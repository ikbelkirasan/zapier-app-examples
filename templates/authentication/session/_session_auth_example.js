// Note: Make sure all paths are correct
const { api } = require("./shared/env");

/**
 * Get a session key
 *
 * @param {*} z
 * @param {*} bundle
 */
const getSessionKey = async (z, bundle) => {
  const response = await z.request({
    method: "POST",
    url: api("/login"),
    headers: {
      "W-Key": bundle.authData.apiKey
    },
    body: JSON.stringify({
      username: bundle.authData.username,
      password: bundle.authData.password
    })
  });
  if (response.status === 401) {
    throw new Error("The username or password you supplied are invalid");
  }

  const accessToken = response.json.login.token;
  return {
    sessionKey: accessToken
  };
};

/**
 * Test authentication
 *
 * @param {*} z
 */
const testAuth = async (z /*, bundle*/) => {
  const response = await z.request({
    method: "GET",
    url: api("/users/profile")
  });

  if (response.status === 401) {
    throw new Error("The Session Key you supplied is invalid");
  }

  const user = response.json.user;
  const name = [user.first_name, user.last_name].join(" ");
  return {
    name
  };
};

module.exports = {
  type: "session",
  fields: [
    {
      key: "username",
      label: "Username",
      required: true,
      type: "string",
      helpText: "Your Username."
    },
    {
      key: "password",
      label: "Password",
      required: true,
      type: "string",
      helpText: "Your password."
    },
    {
      key: "apiKey",
      label: "API Key",
      required: true,
      type: "string",
      helpText:
        "Go to [API Reference](https://dev.example.com/) to request your developer API."
    }
  ],
  test: testAuth,
  sessionConfig: {
    perform: getSessionKey
  },
  connectionLabel: "{{name}}"
};
