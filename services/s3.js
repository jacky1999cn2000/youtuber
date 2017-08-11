'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3({
  region: 'us-west-2'
});

module.exports = {

  getManifest: () => {

    let getParams = {
      Bucket: process.env.S3_BUCKET,
      Key: process.env.PROJECT_NAME + '/manifest.json'
    }

    let p = new Promise((resolve, reject) => {
      s3.getObject(getParams, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data.Body.toString('utf-8')));
      });
    });

    return p;
  },

}
