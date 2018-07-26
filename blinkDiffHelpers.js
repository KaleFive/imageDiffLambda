const fs = require("fs")
const blinkDiff = require("blink-diff")

function run(page) {
  let diff = new blinkDiff({
    imageAPath: "/tmp/master_" + page,
    imageBPath: "/tmp/branches_" + page,
    imageOutputPath: "/tmp/diff_" + page
  })

  return new Promise(function(resolve, reject) {
    console.log("running blink-diff")
    diff.run(function (error, result) {
      if (error) {
        reject("Error inside of blinkDiff promise " + error)
      } else {
        console.log(diff.hasPassed(result.code) ? "Passed" : "Failed")
        console.log("Found " + result.differences + " differences.")
        resolve()
      }
    });
  });
};

function runBufferInput(arrayOfBuffers, page) {
  let diff = new blinkDiff({
    imageA: arrayOfBuffers[0],
    imageB: arrayOfBuffers[1],
    imageOutputPath: "/tmp/diff_" + page
  })

  return new Promise(function(resolve, reject) {
    console.log("running blink-diff")
    diff.run(function (error, result) {
      if (error) {
        reject("Error inside of blinkDiff promise " + error)
      } else {
        console.log(diff.hasPassed(result.code) ? "Passed" : "Failed")
        console.log("Found " + result.differences + " differences.")
        resolve()
      }
    });
  });
};

module.exports = {
  run,
  runBufferInput
}
