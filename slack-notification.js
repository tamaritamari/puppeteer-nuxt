'use strict'
const request = require('request')
const imageURLs = process.argv.slice(2)
if (imageURLs.length === 0) {
  console.log('diff imageがありません')
}

const attachments = imageURLs.map((url) => {
  const branch = url.split('/')[3]
  const splitedTestNames = url
    .split('/')[5]
    .replace(/-\d-diff\.png/, '')
    .split('-')
  const filenameEndIndex = splitedTestNames.findIndex(
    (name) => name === 'ts' || name === 'js'
  )
  const testNamePatten = splitedTestNames.splice(filenameEndIndex + 1)

  return {
    text:
      '以下の画面の見た目が変わっています。新しい画像を正しいものとしますか?',
    image_url: url,
    fallback: `${url}`,
    callback_id: 'renew',
    color: '#3AA3E3',
    attachment_type: 'default',
    actions: [
      {
        name: 'game',
        text: '新しい方の画像を正しいものとする。(正解の差し替え)',
        type: 'button',
        value: JSON.stringify({
          url,
          branch,
          testNamePatten,
        }),
      },
    ],
  }
})

const options = {
  uri: process.env.SLACK_WEB_HOOK_URL,
  headers: {
    'Content-type': 'application/json',
  },
  json: {
    text: 'Slack Message Sample Text222',
    attachments,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            imageURLs.length === 0
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
    ],
  },
}

request.post(options, (error) => {
  if (error) {
    console.log(`slack notification failed on error: ${error}`)
  }
})
