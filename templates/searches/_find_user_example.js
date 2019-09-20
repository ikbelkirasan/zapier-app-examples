const _ = require("lodash");
const { api } = require("../shared/env");

const perform = async (z, bundle) => {
  const response = await z.request({
    method: "GET",
    url: api("/users")
  });

  if (response.status !== 200) {
    throw new Error(
      `Unexpected status code ${response.status}\nResponse: ${JSON.stringify(
        response.json,
        null,
        2
      )}`
    );
  }

  const { users } = response.json;

  // Find user
  const requestedUsername = bundle.inputData.username;
  const matchedUser = _.filter(users, user => {
    return user.username == requestedUsername;
  });

  return matchedUser;
};

module.exports = {
  key: "findUser",
  noun: "User",
  display: {
    label: "Find User",
    description: "Finds a User ID"
  },
  operation: {
    inputFields: [
      {
        key: "username",
        label: "Username",
        required: true
      }
    ],
    perform,
    sample: {
      id: 2,
      account_id: 10000,
      username: "john.doe",
      email: "john.doe@example.com"
    }
  }
};
