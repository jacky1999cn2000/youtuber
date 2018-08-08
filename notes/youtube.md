# youtube

* manifest
  * project: basic information for the project
    * email: email address used to login this channel
    * channelUrl: channel url
    * channelName: channel name *(used as part of file path when saving video list to s3)*
    * description: channel description
    * type: indicate where the video come from: youtube, meipai, youku... *(used as part of file path when saving video list to s3)*
  * credential
    * channelId: channelId for current project (only used in isTokenValid() method as a dummy parameter)
    * token_type: Bearer *(default)*  
    * expires_in: 3600 *(default)*
    * client_id: google app client_id *(not used in this project)*
    * client_secret: google app client_secret *(not used in this project)*
    * apiKey: apiKey *(retrieved from Oauth Playground)*
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
    "credential": {
      "channelId": "UCauLBhE2V9JOFxUih8e1svg",
      "token_type": "Bearer",
      "expires_in": 3600,
      "client_id": "client_id",
      "client_secret": "client_secret",
      "apiKey": "apiKey"
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

* create google app
  * follow [this link](https://www.slickremix.com/docs/get-api-key-for-youtube/)

* Oauth
  * [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

* edit json
  * download json into `./json` folder
  * beautify json `https://codebeautify.org/online-json-editor`
  * edit file and use `make upload` to upload file
