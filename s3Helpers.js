const AWS = require("aws-sdk")
const s3 = new AWS.S3()
const fs = require("fs")

function uploadBranchFileToMaster(bucket, key, branch_buffer) {
  return new Promise(function(resolve, reject) {
    let params = {
      Bucket: bucket,
      Key: key,
      Body: branch_buffer,
      ACL: 'public-read'
    };
    console.log("uploading new image to S3 Master")
    s3.putObject(params, function(data) {
      console.log(data)
      console.log("Successfully uploaded to Master")
      // branch_buffer is uploading to master so we can return it as if it is the master_buffer
      resolve(branch_buffer)
    });
  });
}

// pull Master png and output as buffer
function pullMasterS3Image(bucket, paramKey, branch_buffer) {
  // paramKey here is prefixed with 'branches/[branchname]/' so we are taking that out here
  let key = "master/" + paramKey.split("/").slice(2).join("/");
  console.log("this is the master key " + key)
  params = { Bucket: bucket, Key: key }
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(error, data) {
      if (error) { reject() }
      if (data == null) {
        resolve(1234124)
      } else {
        let master_buffer = data.Body
        resolve(master_buffer)
      }
    })
    resolve(null)
  });
}

// pull New png and output as buffer
function pullNewBranchS3Image(bucket, key) {
  console.log("this is the branch key " + key)
  params = { Bucket: bucket, Key: key }
  return new Promise(function(resolve, reject) {
    s3.getObject(params, function(error, data) {
      if(error) { reject() }
      let branch_buffer = data.Body;
      resolve(branch_buffer)
    })
  });
}

function uploadDiffToS3(bucket, paramKey) {
  let diffPath = "/tmp/diff_" + paramKey
  console.log("diffpath " + diffPath)
  let uploadDiffPath = "diff/" + paramKey.split("_").slice(1).join("/")
  return new Promise(function(resolve, reject) {
    fs.readFile(diffPath, function (err,data) {
      if (err) {
        return console.log(err);
      }
      let imageStream = fs.createReadStream(diffPath)
      let params = {
        Bucket: bucket,
        Key: uploadDiffPath,
        Body: imageStream,
        ACL: 'public-read'
      };
      console.log("uploading to S3")
      console.log(uploadDiffPath)
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
  uploadDiffToS3,
  uploadBranchFileToMaster
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
  let key = "branches_" + paramKey
  params = { Bucket: bucket, Key: "branches/" + paramKey }
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
