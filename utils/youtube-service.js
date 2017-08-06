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

  */
  processVideoListInfo: (videoListInfo, media) => {

    let result = {};

    let processedItems = _.map(videoListInfo.items, (item) => {
      return {
        'publishedAt': item.snippet.publishedAt,
        'title': item.snippet.title,
        'description': item.snippet.description,
        'videoId': media.sourceType == 'channel' ? item.id.videoId : item.contentDetails.videoId
      };
    });

    result.items = processedItems;
    result.done = typeof videoListInfo.nextPageToken == undefined;
    result.pageToken = videoListInfo.nextPageToken;

    // if(channel.incremental){
    //   // for incremental retrieval
    //   let filteredItems
    //
    // }else{
    //   // for total retrieval
    //
    // }

    return result;
  }

}
