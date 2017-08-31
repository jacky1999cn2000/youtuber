'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3({
  region: 'us-west-2'
});

module.exports = {

  /*
    upload video list to s3
  */
  uploadVideoList: (type, name, index, videoList) => {

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let key = `${type}/${name}/${year}-${month}-${day}/${index}.json`;

    let body = JSON.stringify(videoList);

    let params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: 'application/json;charset=utf-8'
    }

    let p = new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });

    return p;
  }

}
