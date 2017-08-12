# youtuber

* structure
  * modules (modularized logic for retrieving videos from different sources)
    * youtube

  * services (modularized logic for methods handling different tasks)
    * youtube
    * s3

* commands
  * `make upload`: copy `./config/manifest.json` to `s3://youtube-farming/[projectname]/`

* manifest
  * youtube (based on modules)
    * project: basic information for the project
      * email: email address used to login this channel
      * channelUrl: channel url
      * channelName: channel name
      * description: channel description
      * type: type of the channel (indicate where the video come from: youtube, meipai, youku...)
    * medium: an array of media from which the code will retrieve video lists
      * sourceUrl: url for the source
      * sourceName: name of the source
      * sourceType: type of the source (channel or playlist)
      * sourceId: id of the source (extracted from url - some channel doesn't have id, but playlist always has id)
      * targetType: type of the target (typically a playlist)
      * targetId: id of the target
      * viewCount: code will filter out videos whose view count below this value (use reasonable values based on when the video was published)
      * days: code will calculate a target date (today - days), and will filter out videos that published before the target date (if move the entire channel the first time, probably use a larger value like 1000; for periodical update, use a reasonable value)
  ```
  {
    "metadata":{
      "email":"liang.zhao.sfdc01@gmail.com",
      "targetUrl":"https://www.youtube.com/channel/project1",
      "targetName":"project1",
      "description":"this is a test project"
    },
    "medium":[
      {
        "sourceUrl": "https://www.youtube.com/user/StevieGReds",
        "sourceName": "B站搬运工",
        "sourceType":"playlist",
        "sourceId":"PLFQPNZbW2NEnUJMNVrYVJ6Bn2Y6Xsm7ZV",
        "targetType":"playlist",
        "targetId":"PLIPOJGlufsbVXLSBoM_utjoiAD93V4c63",
        "viewCount":10000,
        "days":10000
      },
      {
        "sourceUrl": "https://www.youtube.com/channel/UCXgka_nGg5r_rjZ1l1TWyWA",
        "sourceName": "逗比劇",
        "sourceType":"channel",
        "sourceId":"UCXgka_nGg5r_rjZ1l1TWyWA",
        "targetType":"playlist",
        "targetId":"PLIPOJGlufsbX7r7V8aZ4AM0VNhAr25Gnx",
        "viewCount":10000,
        "days":7
      }
    ]
  }
  ```


* technical notes
  * [use await in for loops](https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)


[15 Useful ‘FFmpeg’ Commands for Video, Audio and Image Conversion in Linux – Part 2](https://www.tecmint.com/ffmpeg-commands-for-video-audio-and-image-conversion-in-linux/)


视频网站
https://www.youtube.com/channel/UCgiagsMuTX3Mk4ernq4v4yg/playlists  卡通
https://www.youtube.com/channel/UCRFabIivtjFbG-rrtpERyBg/featured

* technology
  * 添加水印
  `ffmpeg -i 1.mp4 -i logo.png -filter_complex "overlay=main_w-overlay_w-15:main_h-overlay_h-15" 1-1.mp4`
  * 转换格式
  `ffmpeg -fflags +genpts -i 1.mp4 -r 24 1.webm`

* meipai
http://www.meipai.com/squares/new_timeline?page=1&count=24&tid=16
https://github.com/soimort/you-get/issues/1933

* Oauth
  * [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
* [submodule](https://github.com/blog/2104-working-with-submodules) - for nightmarejs parsing  project
