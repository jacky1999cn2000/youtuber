'use strict';

let youtube = require('./modules/youtube');
let settings = require('./config/settings');

async function execute() {

  let manifest = require('./config/' + settings.target);
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
