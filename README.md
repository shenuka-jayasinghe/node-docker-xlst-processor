# node-docker-xslt-processor
Process XLST transform with docker and node using this repo's java code: https://github.com/cambridge-collection/cudl-data-processing-xslt?tab=readme-ov-file

## Dependencies

1. [Docker](https://www.docker.com/products/docker-desktop/)
2. [Node](https://nodejs.org/en/download)

## How it works

![Untitled Diagram drawio](https://github.com/shenuka-jayasinghe/node-docker-xslt-processor/assets/137282472/81a7688f-151f-40d3-8b54-b7290098efd8)

A TEI directory (:string) is passed in as an argument to the JS function. The function then spins up this [Docker container](https://github.com/shenuka-jayasinghe/cudl-data-processing-xslt/blob/main/Dockerfile) via a volume mount to where our JS function runs. The constainer processes the TEI XSML via XSLT into JSON. The JSON is then outputted into the working directory, and the docker container is closed. 

1. In line 61. of teiToJSON.js insert the TEI directory to be processed for the first argument

2. If your dockerhub credentials require ```sudo``` to pull images from online repositories, have the second argument as true, if not, to false

example:

```js
processDataWithDocker('/home/linux/Documents/github/dl-data-samples/source-data/data/items/data/tei/MS-TEST-ITEM-00002/', true)
```

