const fs = require("fs")
const blinkDiff = require("blink-diff")

function run(page) {
  let diff = new blinkDiff({
    imageAPath: "./screenshots/master/" + page,
    imageBPath: "./screenshots/qa/" + page,

    // thresholdType: blinkDiff.THRESHOLD_PERCENT,
    // threshold: 0.01, // 1% threshold

    imageOutputPath: "./screenshots/diff/" + page
  })

  return new Promise(function(resolve, reject) {
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

// at this time, it may not be possible because the output here must be a file
function runBuffer(arrayOfBuffers) {
  let diff = new blinkDiff({
    imageA: arrayOfBuffers[0],
    imageB: arrayOfBuffers[1],

    imageOutputPath: "./screenshots/diff/" + page
  })

  return new Promise(function(resolve, reject) {
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
  "run": run,
  "runBuffer": runBuffer
}
