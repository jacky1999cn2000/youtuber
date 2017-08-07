'use strict';

let _ = require('lodash');
let jsonfile = require('jsonfile');
let moment = require('moment');

let s3Service = require('./utils/s3-service');
let youtubeService = require('./utils/youtube-service');

let credential = require('./.google-oauth2-credentials.json');

async function execute() {

  let isTokenValid = await youtubeService.isTokenValid(credential);
  console.log('isTokenValid ', isTokenValid);

  /*
    if not valid, use refresh_token to get new access_token and write it to credential file
  */
  if (!isTokenValid) {
    let access_token = await youtubeService.refreshToken(credential);
    credential.access_token = access_token;
    jsonfile.writeFileSync('./.google-oauth2-credentials.json', credential);
  }

  /*
    get manifest from s3
  */
  let manifest = await s3Service.getManifest();
  console.log('manifest ', manifest);


  /*
    parse manifest and get list of videos ()
  */
  let finalList = [];

  for (let media of manifest.medium) {

    /*
      1. get all videos for a specified channel or playlist
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
    } while (running);

    // for "playlist", filter items based on days ("channel" already did so via "publishedAfter" parameter in search)
    if (media.sourceType == 'playlist') {
      let targetDate = moment().subtract(media.days, 'days').unix();
      videoList = _.filter(videoList, (item) => {
        let publishedAt = moment(item.snippet.publishedAt).unix();
        return publishedAt > targetDate;
      });
    }

    /*
      2. transform items to be more succinct
    */
    videoList = _.map(videoList, (item) => {
      return {
        'targetType': media.targetType,
        'targetId': media.targetId,
        'publishedAt': item.snippet.publishedAt,
        'title': item.snippet.title,
        'description': item.snippet.description,
        'videoId': media.sourceType == 'channel' ? item.id.videoId : item.contentDetails.videoId
      };
    });

    /*
      3. get stats for all videos
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

    console.log('videoList ', videoList.length);
    console.log('videoList ', videoList);
  }

}

execute();
