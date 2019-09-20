const { authURL, api, CLIENT_ID, CLIENT_SECRET } = require("../src/shared/env");

const getAccessToken = (z, bundle) => {
  const promise = z.request(authURL("accessToken"), {
    method: "POST",
    body: {
      code: bundle.inputData.code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: bundle.inputData.redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });

  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error("Unable to fetch access token: " + response.content);
    }

    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token
      // refresh_token: result.refresh_token
    };
  });
};

/*

// Facebook does not support refreshing the token

const refreshAccessToken = (z, bundle) => {
  const promise = z.request(authURL('refreshToken'), {
    method: 'POST',
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: bundle.inputData.redirect_uri,
      grant_type: 'refresh_token'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })

  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content)
    }

    const result = JSON.parse(response.content)
    return {
      access_token: result.access_token
    }
  })
}

*/

const testAuth = (z /*, bundle*/) => {
  const promise = z.request({
    method: "GET",
    url: api("/me")
  });

  return promise.then(response => {
    if (response.status === 401) {
      throw new Error("The access token you supplied is not valid");
    }
    return z.JSON.parse(response.content);
  });
};

module.exports = {
  type: "oauth2",
  oauth2Config: {
    authorizeUrl: {
      url: authURL("authorize"),
      params: {
        client_id: CLIENT_ID,
        state: "{{bundle.inputData.state}}",
        redirect_uri: "{{bundle.inputData.redirect_uri}}",
        response_type: "code"
      }
    },
    getAccessToken: getAccessToken,
    // refreshAccessToken: refreshAccessToken,
    autoRefresh: true,
    scope: "ads_management"
  },
  test: testAuth,
  connectionLabel: "{{name}}"
};
