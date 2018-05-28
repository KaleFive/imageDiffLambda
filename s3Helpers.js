const AWS = require("aws-sdk")
const s3 = new AWS.S3()
const fs = require("fs")

// pull Master png and output as buffer
function pullMasterS3Image(bucket, paramKey) {
  let key = "master/" + paramKey
  params = { Bucket: bucket, Key: key }
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(error, data) {
      if(error) { reject() }
      let master_buffer = data.Body;
      resolve(master_buffer)
    })
  });
}

// pull New png and output as buffer
function pullNewBranchS3Image(bucket, paramKey) {
  let key = "qa/" + paramKey
  params = { Bucket: bucket, Key: key }
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(error, data) {
      if(error) { reject() }
      let qa_buffer = data.Body;
      resolve(qa_buffer)
    })
  });
}

function uploadDiffToS3(bucket, paramKey) {
  let key = "diff_" + paramKey
  let diffPath = "/tmp/" + key
  console.log("diffpath " + diffPath)
  return new Promise(function(resolve, reject) {
    fs.readFile(diffPath, function (err,data) {
      if (err) {
        return console.log(err);
      }
      let imageStream = fs.createReadStream(diffPath)
      let params = {
        Bucket: bucket,
        Key: "diff/" + paramKey,
        Body: imageStream,
        ACL: 'public-read'
      };
      console.log("uploading to S3")
      s3.putObject(params, function(data) {
        console.log(data)
        console.log("right before resolve")
        resolve()
      });
    });
  });
}

module.exports = {
  pullMasterS3Image,
  pullNewBranchS3Image,
  pullMasterS3Streams,
  pullNewBranchS3Streams,
  uploadDiffToS3
}

// pull Master png with streams
function pullMasterS3Streams(bucket, paramKey) {
  let key = "master_" + paramKey
  params = { Bucket: bucket, Key: "master/" + paramKey }
  let image = fs.createWriteStream("/tmp/" + key)
  return new Promise(function(resolve, reject) {
    let stream = s3.getObject(params).createReadStream()
    stream.pipe(image)
      .on("close", function() {
        console.log("close stream")
        resolve()
      }).on("error", function(msg) {
        console.log("error stream " + msg)
        reject()
      });
  });
}

// pull New Branch png with streams
function pullNewBranchS3Streams(bucket, paramKey) {
  let key = "qa_" + paramKey
  params = { Bucket: bucket, Key: "qa/" + paramKey }
  let image = fs.createWriteStream("/tmp/" + key)
  return new Promise(function(resolve, reject) {
    let stream = s3.getObject(params).createReadStream()
    stream.pipe(image)
      .on("close", function() {
        console.log("close stream")
        resolve()
      }).on("error", function(msg) {
        console.log("error stream " + msg)
        reject()
      });
  });
}
