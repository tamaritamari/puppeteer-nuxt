import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'proxy-to-circleci',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '>=1.72.0',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      CIRCLE_CI_PIPELINE_URL: `https://circleci.com/api/v2/project/gh/${process.env.PROJECT_OWNER}/${process.env.PROJECT_NAME}/pipeline`,
      CIRCLE_API_USER_TOKEN: process.env.CIRCLE_API_USER_TOKEN
    },
  },
  functions: {
    trigger_image_update: {
      handler: 'handler.triggerImageUpdate',
      events: [
        {
          http: {
            method: 'post',
            path: 'trigger_image_update',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
