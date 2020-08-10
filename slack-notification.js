'use strict'
const request = require('request')
const imageURLs = process.argv.slice(2)
if (imageURLs.length === 0) {
  console.log('diff imageがありません')
}

const imageSections = imageURLs.map((url) => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `<${url}|画像リンク>`,
    },
    accessory: {
      type: `image`,
      image_url: `${url}`,
      alt_text: 'Haunted hotel image',
    },
  }
})

const options = {
  uri:
    'https://hooks.slack.com/services/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',
  headers: {
    'Content-type': 'application/json',
  },
  json: {
    text: 'Slack Message Sample Text222',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            imageSections.length === 0
              ? 'e2eテストに失敗しました。'
              : 'ビジュアルリグレッションテストに失敗しました。\n以下の画像を確認し、画像の更新が必要なら更新を押してください。\n意図せぬ変更が起きている場合は、ソースを確認してください。',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*CIRCLE_BRANCH:*\n' + (process.env.CIRCLE_BRANCH ?? '不明'),
          },
          {
            type: 'mrkdwn',
            text:
              '*CIRCLE_PR_USERNAME:*\n' +
              (process.env.CIRCLE_PR_USERNAME ?? '不明'),
          },
          {
            type: 'mrkdwn',
            text:
              '*CIRCLE_BUILD_URL:*\n' +
              (process.env.CIRCLE_BUILD_URL ?? '不明'),
          },
          {
            type: 'mrkdwn',
            text: '*When:*\n' + new Date().toLocaleString(),
          },
        ],
      },
      ...imageSections,
    ],
  },
}

request.post(options, (error) => {
  if (error) {
    console.log(`slack notification failed on error: ${error}`)
  }
})
