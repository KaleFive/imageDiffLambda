const s3Helpers = require("s3Helpers")
const blinkDiff = require("blinkDiffHelpers")

exports.handler = function(event, context, callback) {
  let bucket = event.Records[0].s3.bucket.name;
  // branches/[branchName]/[fileName]
  let key = event.Records[0].s3.object.key;
  let key_for_blinkdiff = key.split("/").join("_")
  Promise.all([s3Helpers.pullNewBranchS3Image(bucket, key), s3Helpers.pullMasterS3Image(bucket, key)])
    .then(function(buffers) {
      console.log("Right before running blinkDiff")
      return blinkDiff.runBufferInput(buffers, key_for_blinkdiff)
    }).then(function() {
      console.log("Right before uploading to S3")
      return s3Helpers.uploadDiffToS3(bucket, key_for_blinkdiff)
    }).then(function() {
      console.log("Success!")
      callback(null, "<<<<< Success >>>>>")
    }).catch(function(error) {
      console.log("This is the error " + error)
      callback(error, null)
    });
}
