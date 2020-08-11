import { APIGatewayProxyHandler } from 'aws-lambda';
import { post, OptionsWithUri } from "request-promise"
import 'source-map-support/register';
export const triggerImageUpdate: APIGatewayProxyHandler = async (event, _context) => {

  const {body} = event
  const {actions} = JSON.parse(decodeURIComponent(body).replace("payload=", ''))
  const selectedActionValues = JSON.parse(actions[0].value)

  const options: OptionsWithUri = {
    uri: process.env.CIRCLE_CI_PIPELINE_URL,
    headers: {
      'Content-type': 'application/json',
    },
    json: {
      branch: selectedActionValues.branch,
      parameters: {
        run_integration_tests: false,
        run_update_image_snapshot: true,
        test_name_pattern: selectedActionValues.testNamePatten.join(" ")
      }
    },
    auth: {
      user: process.env.CIRCLE_API_USER_TOKEN
    }
  }
  try {
    const { statusCode } = await post(options) 
    console.log(event)
    return {
      statusCode,
      body: JSON.stringify({
        message: 'Success!',
        actions,
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
