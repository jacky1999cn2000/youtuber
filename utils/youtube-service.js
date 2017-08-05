'use strict';

let _ = require('lodash');
let co = require("co");
let request = require('co-request');

module.exports = {

  isTokenValid: function() {

    return co(function*(token, channelId) {

      let response;
      let body;

      let options = {
        url: 'https://www.googleapis.com/youtube/v3/search',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        },
        qs: {
          part: 'snippet',
          channelId: channelId,
          order: 'date',
          maxResults: 50
        }
      };

      try {
        response = yield request(options);
        body = JSON.parse(response.body);
      } catch (err) {
        console.err('request err ', err);
      }

      if (body.error && body.error.message && body.error.message == 'Invalid Credentials') {
        return false;
      } else {
        return true;
      }

    });

  },

}
