IMAGE=jacky1999cn2000/youtuber
GIT_HASH=$(shell git rev-parse --short HEAD)

upload:
	aws s3 cp ./json/2.json s3://youtube-douyin/youtube/抖音精品收藏/2018-8-8/2.json --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

install:
	docker run -i --rm --name install -v `pwd`:/usr/src/app -w /usr/src/app node:8 npm install

run: install
	docker-compose down
	docker-compose up

bash:
	docker run -it --rm -v `pwd`:/usr/src/app -w /usr/src/app --entrypoint="bash" node:8

build_image: install version
	$(info GIT_HASH: $(GIT_HASH))
	docker build --no-cache -t $(IMAGE):${GIT_HASH} .

tag: build_image
	docker tag $(IMAGE):${GIT_HASH} ${IMAGE}:latest

push: tag
	docker push ${IMAGE}:${GIT_HASH}
	docker push ${IMAGE}:latest

version:
	git log -n 1 > BUILD-VERSION.txt
