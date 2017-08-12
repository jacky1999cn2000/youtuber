'use strict';

let s3Service = require('./services/s3');
let youtube = require('./modules/youtube');

async function execute() {
  let manifest = await s3Service.getManifest();
  console.log('manifest ', manifest);

  switch (manifest.project.type) {
    case 'youtube':
      youtube(manifest);
      break;
    default:
      console.log('unknown type: ', manifest.project.type);
  }

};

execute();
// youtube();
