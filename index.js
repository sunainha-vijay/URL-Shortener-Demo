const { Client } = require('auth0');

// Replace these placeholders with your actual values
const auth0Domain = 'dev-4gcgwfgf45ktb52x.us.auth0.com';
const auth0ClientId = 'ovl0zvf0BCL9pyANc0O22PzmwVjTxJC2';
const auth0ClientSecret = 'X2sE9ENpRV-qFxn_ECzfZdFPm9X2pnS_KTuoxDycLdbBQeiPmsSGppXWWGea_Q28';
const auth0Audience = 'https://dev-4gcgwfgf45ktb52x.us.auth0.com/api/v2/';

const auth0 = new Client({
  domain: auth0Domain,
  clientId: auth0ClientId,
  clientSecret: auth0ClientSecret,
});

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'GET' && request.url.endsWith('/callback')) {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const code = urlParams.get('code');

    try {
      // Exchange authorization code for access token
      const tokenResponse = await auth0.oauth.token({
        grantType: 'authorization_code',
        code,
        redirectUri: 'https://url-shortener.sunu.workers.dev/callback', // Replace if using a different redirect URI
        audience: auth0Audience,
      });

      const accessToken = tokenResponse.access_token;

      // Optional: Retrieve user information from Auth0 userinfo endpoint
      const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo?access_token=${accessToken}`);
      const userInfo = await userInfoResponse.json();

      // Register user in your application's database (if applicable)
      // Implement your logic here using the retrieved user information (e.g., email, name)
      console.log(`New user: ${userInfo.email}`); // Replace with actual registration logic

      // Redirect to successful sign-up page or main URL shortening functionality
      return new Response('Sign-up successful!', {
        status: 302,
        headers: {
          Location: 'https://url-shortener.sunu.workers.dev/shorten', // Replace with your desired redirect URL
        },
      });

    } catch (error) {
      console.error('Error during sign-up:', error);
      return new Response('Sign-up failed!', { status: 500 });
    }
  } else {
    // Handle other requests (optional)
    return new Response('Not found');
  }
}
