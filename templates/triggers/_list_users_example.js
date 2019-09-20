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

  const data = response.json;

  let users = _.map(data.users, user => {
    user.name = `${user.first_name} ${user.last_name}`;
    return user;
  });

  return users;
};

module.exports = {
  key: "listUsers",
  noun: "User",
  display: {
    label: "List users",
    description: "List available users",
    hidden: true
  },
  operation: {
    inputFields: [],
    perform,
    sample: {
      id: 1000,
      username: "john.doe",
      name: "John Doe",
      account_id: 10000,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com"
    }
  }
};
