'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3({
  region: 'us-west-2'
});

module.exports = {

  getManifest: function() {

    let getParams = {
      Bucket: process.env.S3_BUCKET,
      Key: process.env.project + '/manifest.json'
    }

    let p = new Promise(function(resolve, reject) {
      s3.getObject(getParams, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data.Body.toString('utf-8'));
      });
    });

    return p;
  },

}
