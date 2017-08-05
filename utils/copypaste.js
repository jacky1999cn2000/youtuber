/// upload

var Youtube = require('youtube-video-api')

var youtube = Youtube({
  video: {
    part: 'status,snippet'
  }
})

var params = {
  resource: {
    snippet: {
      title: 'test video',
      description: 'This is a test video uploaded via the YouTube API'
    },
    status: {
      privacyStatus: 'public'
    }
  }
}

youtube.authenticate('754774158425-mmtt0i163hgfif89jvnqik2tmdi0rdi9.apps.googleusercontent.com', 'EI1HGjeFJ2ZX0kYEvSOHo-8g', function(err, tokens) {
  if (err) return console.error('Cannot authenticate:', err)
  uploadVideo()
})

function uploadVideo() {
  youtube.upload('./videos/1.mp4', params, function(err, video) {
    // 'path/to/video.mp4' can be replaced with readable stream.
    // When passing stream adding mediaType to params is advised.
    if (err) {
      return console.error('Cannot upload video:', err)
    }

    console.log('Video was uploaded with ID:', video.id)

    // this is just a test! delete it
    // youtube.delete(video.id, function (err) {
    //   if (!err) console.log('Video was deleted')
    // })
  })
}

//// download

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  // await exec('youtube-dl -ci -f 137 https://www.youtube.com/watch?v=pjFrd282rF8');

  // await exec('youtube-dl -ci -f \'best\' -o \'videos/%(title)s.%(ext)s\' http://v.youku.com/v_show/id_XMjkzNzA0MDY3Ng==.html?spm=a2h0j.8191423.playlist_content.5!5~5~5~A&&f=50564085&from=y1.2-3.4.5');
  // console.log('next');
  // await exec('youtube-dl -ci -f \'best\' -o \'videos/%(title)s.%(ext)s\' https://www.youtube.com/watch?v=BZhM3sLzchI');



  // await exec('youtube-dl -cit https://www.youtube.com/playlist?list=PL3w7SGFrUy7o7KcSolD5psdP9Q_9dqE6B');
  // await exec('you-get -o \'videos/\' http://www.meipai.com/media/454570774');
  console.log('done');
}
//lsExample();
