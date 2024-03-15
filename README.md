# node-docker-xlst-processor
Process XLST transform with docker and node using this repo's java code: https://github.com/cambridge-collection/cudl-data-processing-xslt?tab=readme-ov-file

## Dependencies

1. [Docker](https://www.docker.com/products/docker-desktop/)
2. [Node](https://nodejs.org/en/download)

## How it works

1. Change line 61. of teiToJSON.js to TEI directory
2. If your dockerhub credentials require 'sudo', have the second argument as true, if not, to false

example:
```js
processDataWithDocker('/home/linux/Documents/github/dl-data-samples/source-data/data/items/data/tei/MS-TEST-ITEM-00002/', true)
```

