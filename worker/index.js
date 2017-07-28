console.log('index.js!!!');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  // await exec('youtube-dl -ci -f 137 https://www.youtube.com/watch?v=pjFrd282rF8');
  await exec('youtube-dl -ci -f \'best\' -o \'%(title)s.%(ext)s\' https://www.youtube.com/watch?v=OPyG5cH0L4o');
  // await exec('youtube-dl -cit https://www.youtube.com/playlist?list=PL3w7SGFrUy7o7KcSolD5psdP9Q_9dqE6B');

  console.log('done');
}
lsExample();
