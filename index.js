const s3Helpers = require("s3Helpers")
const blinkDiff = require("blinkDiffHelpers")

exports.handler = function(event, context, callback) {
  let bucket = "kalefive.unique.bucket.name"
  let key = "cnnImage.png"
  Promise.all([s3Helpers.pullNewBranchS3Image(bucket, key), s3Helpers.pullMasterS3Image(bucket, key)])
    .then(function() {
      console.log("Right before running blinkDiff")
      return blinkDiff.run(key)
    }).then(function() {
      console.log("Right before uploading to S3")
      return s3Helpers.uploadDiffToS3(bucket, key)
    }).then(function() {
      console.log("Success!")
      callback(null, "<<<<<Success>>>>>")
    }).catch(function(error) {
      console.log("This is the error " + error)
      callback(error, null)
    });
}
