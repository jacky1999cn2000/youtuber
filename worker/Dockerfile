FROM node:8
RUN wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl
COPY . /usr/src/app
WORKDIR /usr/src/app
ENTRYPOINT forever start index.js
