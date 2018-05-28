const fs = require("fs")
const blinkDiff = require("blink-diff")

function run(page) {
  let diff = new blinkDiff({
    imageAPath: "/tmp/master_" + page,
    imageBPath: "/tmp/qa_" + page,

    // thresholdType: blinkDiff.THRESHOLD_PERCENT,
    // threshold: 0.01, // 1% threshold

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
  "run": run
}
