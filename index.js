const s3Helpers = require("s3Helpers")
const blinkDiff = require("blinkDiffHelpers")

exports.handler = function(event, context, callback) {
  let bucket = event.Records[0].s3.bucket.name;
  // branches/[branchName]/[fileName]
  let key = event.Records[0].s3.object.key;
  let key_for_blinkdiff = key.split("/").join("_")

  let global_branch_buffer = null;
  let global_master_buffer = null;

  s3Helpers.pullNewBranchS3Image(bucket, key)
    .then(function(branch_buffer) {
      global_branch_buffer = branch_buffer
      return s3Helpers.pullMasterS3Image(bucket, key)
    }).then(function(master_buffer) {
      console.log('3')
      if (master_buffer != null) { return master_buffer }
      console.log("file not found in MASTER - creating new file in master")
      return s3Helpers.uploadBranchFileToMaster(bucket, key)
    }).then(function(master_buffer) {
      global_master_buffer = master_buffer
      console.log("Right before running blinkDiff")
      return blinkDiff.runBufferInput([global_master_buffer, global_branch_buffer], key_for_blinkdiff)
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
