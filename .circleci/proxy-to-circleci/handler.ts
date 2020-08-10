import { APIGatewayProxyHandler } from 'aws-lambda';
import { post, OptionsWithUri } from "request-promise"
import 'source-map-support/register';
export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const {body: requestBody} = event
  const options: OptionsWithUri = {
    uri: 'http://35949be1e4c0.ngrok.io',
    headers: {
      'Content-type': 'application/json',
    },
    json: {
      requestBody
    },
  }
  try {
    const { statusCode } = await post(options) 
    return {
      statusCode,
      body: JSON.stringify({
        message: 'Success!',
        requestBody,
      }, null, 2)
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
