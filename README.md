# youtuber

* code structure
  * modules (modularized logic for retrieving videos from different sources)
    * youtube

  * services (modularized logic for methods handling different tasks)
    * youtube
    * s3

* configuration
  * settings.json
    * target: indicate which manifest file to load for process
  * manifest files
    * [youtube](https://github.com/jacky1999cn2000/youtuber/blob/master/notes/youtube.md) 


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
