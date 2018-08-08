'use strict';

let _ = require('lodash');
let request = require('request');

module.exports = {

  /*
    get all videos for a specified channel or playlist
    p.s. "channel" used ""/v3/search" which supports "publishedAfter" parameter, while "playlist" used "/v3/playlistItems" which didn't
  */
  getVideoListInfo: (credential, media, pageToken) => {

    let options;

    switch (media.sourceType) {
      case 'channel':
        options = {
          url: 'https://www.googleapis.com/youtube/v3/search',
          method: 'GET',
          qs: {
            part: 'snippet',
            channelId: media.sourceId,
            order: 'date',
            maxResults: 50,
            publishedAfter: media.publishedAfter,
            key: credential.apiKey
          }
        };
        break;
      case 'playlist':
        options = {
          url: 'https://www.googleapis.com/youtube/v3/playlistItems',
          method: 'GET',
          qs: {
            part: 'snippet,contentDetails',
            playlistId: media.sourceId,
            order: 'date',
            maxResults: 50,
            key: credential.apiKey
          }
        };
        break;
      default:
        options = {};
    }

    if (pageToken) {
      options.qs.pageToken = pageToken;
    }

    let p = new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) {
          console.log('request err ', err);
          reject(err);
        }
        let bodyJson = JSON.parse(response.body)
        resolve(bodyJson);
      });
    });

    return p;
  },

  /*
    get stats for videos specified in id parameter (50 comma separated id is maximum per request)
  */
  getVideoStats: (credential, videoIds) => {

    let options = {
      url: 'https://www.googleapis.com/youtube/v3/videos',
      method: 'GET',
      qs: {
        part: 'statistics',
        id: videoIds,
        key: credential.apiKey
      }
    };

    let p = new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) {
          console.log('request err ', err);
          reject(err);
        }
        let bodyJson = JSON.parse(response.body)
        resolve(bodyJson);
      });
    });

    return p;
  }

}
