// ##TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'cds28mmq5e'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // ##TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-1dg-875f.us.auth0.com',            // Auth0 domain
  clientId: 'TbXp1ShFAeNuGuRCn11OtUjwslF9jRPm',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
