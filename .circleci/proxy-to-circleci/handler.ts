import { APIGatewayProxyHandler } from 'aws-lambda';
import { post, OptionsWithUri } from "request-promise"
import 'source-map-support/register';
export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const {body: requestBody} = event
  const options: OptionsWithUri = {
    uri: 'https://circleci.com/api/v2/project/gh/tamaritamari/puppeteer-nuxt/pipeline',
    headers: {
      'Content-type': 'application/json',
    },
    json: {
      branch: "develop",
      parameters: {
        run_integration_tests: false,
        run_update_image_snapshot: true
      }
    },
    auth: {
      user: 'd8557effe60964ef91f4fad42017d12882ee0bd1'
    }
  }
  try {
    const { statusCode } = await post(options) 
    return {
      statusCode,
      body: JSON.stringify({
        message: 'Success!',
        requestBody,
      }, null, 2),
    }
  }catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed on Request',
        error,
      }, null, 2)
    }
  }
}
