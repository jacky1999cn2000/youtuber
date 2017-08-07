'use strict';

let _ = require('lodash');
let request = require('request');

module.exports = {

  isTokenValid: (credential) => {

    let options = {
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + credential.access_token
      },
      qs: {
        part: 'snippet',
        channelId: credential.channelId,
        order: 'date',
        maxResults: 5
      }
    };

    let p = new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) {
          console.log('request err ', err);
          reject(err);
        }
        let bodyJson = JSON.parse(response.body)

        if (bodyJson.error && bodyJson.error.message && bodyJson.error.message == 'Invalid Credentials') {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    return p;
  },

  /*
    use refresh_token to get new access_token
  */
  refreshToken: (credential) => {

    let options = {
      url: 'https://www.googleapis.com/oauth2/v4/token',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      qs: {
        client_id: credential.client_id,
        client_secret: credential.client_secret,
        refresh_token: credential.refresh_token,
        grant_type: 'refresh_token'
      }
    };

    let p = new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) {
          console.log('request err ', err);
          reject(err);
        }
        let bodyJson = JSON.parse(response.body)
        resolve(bodyJson.access_token);
      });
    });

    return p;
  },

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
          headers: {
            Authorization: 'Bearer ' + credential.access_token
          },
          qs: {
            part: 'snippet',
            channelId: media.sourceId,
            order: 'date',
            maxResults: 50,
            publishedAfter: media.publishedAfter
          }
        };
        break;
      case 'playlist':
        options = {
          url: 'https://www.googleapis.com/youtube/v3/playlistItems',
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + credential.access_token
          },
          qs: {
            part: 'snippet,contentDetails',
            playlistId: media.sourceId,
            order: 'date',
            maxResults: 50
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
      headers: {
        Authorization: 'Bearer ' + credential.access_token
      },
      qs: {
        part: 'statistics',
        id: videoIds
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
