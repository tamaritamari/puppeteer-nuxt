const fs = require('fs')
const chalk = require('chalk')
const AWS = require('aws-sdk')

const UPLOAD_BUCKET = 'nuxt-puppet-failed-results-images'

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-1',
})
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

class ImageReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onTestResult(test, testResult, aggregateResults) {
    const branchName = process.env.CIRCLE_BRANCH
    if (!branchName) {
      console.log(
        'CircleCi上でブランチ名が取得できません。CircleCi上で実行していますか?'
      )
    }
    if (
      testResult.numFailingTests &&
      testResult.failureMessage.match(/different from snapshot/)
    ) {
      const files = fs.readdirSync(
        './test/e2e/__image_snapshots__/__diff_output__/'
      )
      await files.forEach(async (value) => {
        const path = `${branchName}/diff_output/${value}`
        const params = {
          Body: fs.readFileSync(
            `./test/e2e/__image_snapshots__/__diff_output__/${value}`
          ),
          Bucket: UPLOAD_BUCKET,
          Key: path,
          ContentType: 'image/png',
        }
        await s3.putObject(params, async (err) => {
          if (err) {
            console.log(err, err.stack)
          } else {
            console.log(
              chalk.red.bold(
                `Uploaded image diff file to https://${UPLOAD_BUCKET}.s3.amazonaws.com/${path}`
              )
            )
            await fs.appendFile(
              'diffImagesURLs.txt',
              `https://${UPLOAD_BUCKET}.s3.amazonaws.com/${path}`,
              (err) => {
                console.log(`you failed on save images log on error: ${err}`)
              }
            )
          }
        })
      })
    }
  }
}

module.exports = ImageReporter
