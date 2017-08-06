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

  // let t = moment('2017-08-06T02:46:11.000Z').unix();
  // console.log('t ', t);
  // let n = moment.unix(t).subtract(7, 'days').unix();
  // console.log('n ', n);
  // let m = moment().subtract(7, 'days').unix();
  // console.log('m ', m);
  // console.log('t>n ', t > n);
  // let a = moment.parseZone(moment.unix(n)).utc().format();
  // console.log('a ', a);

  /*
    parse manifest and get list of videos (https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)
  */
  let finalList = [];

  for (let media of manifest.medium) {
    console.log('media ', media.sourceType);
    // "channel" used ""/v3/search" which supports "publishedAfter" parameter, while "playlist" used "/v3/playlistItems" which didn't
    if (media.sourceType == 'channel') {
      media.publishedAfter = moment().subtract(media.days, 'days').utc().format();
    }

    let running = true;
    let pageToken;
    let videoList = [];

    do {
      let response = await youtubeService.getVideoListInfo(credential, media, pageToken);
      pageToken = response.nextPageToken;
      running = typeof pageToken != "undefined";
      videoList = _.union(videoList, response.items);
    } while (running);

    // for "playlist", filter items based on days ("channel" already did so via "publishedAfter")
    if (media.sourceType == 'playlist') {
      let targetDate = moment().subtract(media.days, 'days').unix();
      console.log('targetDate ', targetDate);
      videoList = _.filter(videoList, (item) => {
        let publishedAt = moment(item.snippet.publishedAt).unix();
        // console.log('publishedAt ', publishedAt);
        return publishedAt > targetDate;
      });
    }
    console.log('videoList ', videoList.length);

    // let initialVideoListInfo = await youtubeService.getVideoListInfo(credential, media, null);
    // let result = youtubeService.processVideoListInfo(initialVideoListInfo, media);
    // console.log('result ', result);
  }

}

execute();
