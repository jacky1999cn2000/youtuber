'use strict';

let co = require('co');
let s3Service = require('./utils/s3-service');
let youtubeService = require('./utils/youtube-service');

let credential = require('./.google-oauth2-credentials.json');
console.log('credential ', credential);

co(function*() {
    let isTokenValid = yield youtubeService.isTokenValid(credential.access_token, credential.channelId);
    console.log('isTokenValid ', isTokenValid);
    // let manifest = yield s3Service.getManifest();
    // console.log('manifest ', manifest);
  })
  .catch(function(ex) {
    console.log('*** catch ***');
    console.log(ex);
  });


console.log('index.js!!!');
