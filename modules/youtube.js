'use strict';

let _ = require('lodash');
let moment = require('moment');

let s3Service = require('../services/s3');
let youtubeService = require('../services/youtube');

module.exports = async(manifest) => {

  /*
    1. load credential
  */
  let credential = manifest.credential;

  /*
    2. parse manifest and get list of videos ()
  */
  let finalList = [];

  for (let media of manifest.medium) {

    /*
      2.1 get all videos for a specified channel or playlist
    */
    console.log('media ', media.sourceType);

    let running = true;
    let pageToken;
    let videoList = [];

    // add "publishedAfter" to media if "sourceType" is "channel"
    if (media.sourceType == 'channel') {
      media.publishedAfter = moment().subtract(media.days, 'days').utc().format();
    }

    do {
      let response_videolistinfo = await youtubeService.getVideoListInfo(credential, media, pageToken);
      pageToken = response_videolistinfo.nextPageToken;
      running = typeof pageToken != "undefined";
      videoList = _.union(videoList, response_videolistinfo.items);
      console.log('has next page ',running);
    } while (running);

    console.log('raw videoList size ',videoList.length);

    // for "playlist", filter items based on days ("channel" already did so via "publishedAfter" parameter in search)
    if (media.sourceType == 'playlist') {
      let targetDate = moment().subtract(media.days, 'days').unix();
      videoList = _.filter(videoList, (item) => {
        let publishedAt = moment(item.snippet.publishedAt).unix();
        return publishedAt > targetDate;
      });
    }

    console.log('videoList size after filtering date ',videoList.length);

    /*
      2.2 transform items to be more succinct
    */
    videoList = _.map(videoList, (item) => {
      return {
        'downloaded': false,
        'converted': false,
        'watermarked': false,
        'cropped': false,
        'uploaded': false,
        'targetType': media.targetType,
        'targetId': media.targetId,
        'publishedAt': item.snippet.publishedAt,
        'title': '【抖音 Tik Tok】' + item.snippet.title,
        'description': media.description,
        'title_en': '【Tik Tok】 ',
        'description_en': media.description_en,
        'tags': media.tags,
        'videoId': media.sourceType == 'channel' ? item.id.videoId : item.contentDetails.videoId
      };
    });

    /*
      2.3 get stats for all videos
    */
    // pluck "videoId" from videoList and create an array of videoIds
    let videoIdList = _.map(videoList, 'videoId');

    // break down the original list to multiple chunk lists (each list has up to 50 videoIds - that's the maximum number of videoIds the stats request can take)
    let chunkListOfVideoIds = [];
    while (videoIdList.length) {
      chunkListOfVideoIds.push(videoIdList.splice(0, 50));
    }

    // get all stats into statsList (some video may not have stats due to deletion or restriction - e.g. videoList has 191 items, statsList has 180 items, so 11 items might be deleted from this playlist)
    let statsList = [];
    for (let chunkList of chunkListOfVideoIds) {
      let response_videostats = await youtubeService.getVideoStats(credential, chunkList.join());
      statsList = _.union(statsList, response_videostats.items);
    }

    // convert statsList to statsMap
    let statsMap = {};
    _.each(statsList, (item) => {
      statsMap[item.id] = item.statistics;
    });

    // remove deleted video from videoList & add stats to each video & filter out videos whose viewCount less than the value designated in manifest
    videoList = _.filter(videoList, (item) => {
        return _.includes(_.keys(statsMap), item.videoId);
      })
      .map((item) => {
        let stats = statsMap[item.videoId];
        item.viewCount = stats.viewCount;
        item.likeCount = stats.likeCount;
        item.favoriteCount = stats.favoriteCount;
        item.commentCount = stats.commentCount;
        return item;
      })
      .filter((item) => {
        return item.viewCount >= media.viewCount;
      });

    console.log('videoList size after filtering stats and viewCount ',videoList.length);

    /*
      2.4 put it in finalList
    */
    finalList = finalList.concat(videoList);
  }
  console.log('finalList ', finalList.length);

  /*
    3. split finalList into chunks of 50 items each, and upload to s3 under 'bucket/type/project/year-month-day/[index].json'
  */
  let batchList = [];
  // break down finalList to multiple batches (each batch has up to 100 videoIds)
  while (finalList.length) {
    batchList.push(finalList.splice(0, 20));
  }
  let index = 1;
  for (let batch of batchList) {
    let uploaded = await s3Service.uploadVideoList(manifest.project.type, manifest.project.channelName, index, batch);
    console.log('index ', index, ',uploaded ', uploaded);
    index++;
  }

}
