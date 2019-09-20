const { api } = require("../shared/env");

const perform = async (z, bundle) => {
  const response = await z.request({
    method: "POST",
    url: api("/things"),
    body: JSON.stringify(bundle.inputData)
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

  return data.something;
};

module.exports = {
  key: "createSomething",
  noun: "Something",
  display: {
    label: "Create a Something",
    description: "Creates something interesting."
  },
  operation: {
    inputFields: [
      {
        // Example of dynamic dropdown field & add search button
        key: "user_id",
        label: "User",
        type: "string",
        required: true,
        dynamic: "listUsers.id",
        search: "findUserByName.id"
      },
      {
        key: "notes",
        label: "Some Notes",
        type: "text",
        required: true,
        default: ""
      }
    ],
    perform,
    sample: {
      id: 10000,
      user_id: 1111,
      notes: ""
    }
  }
};
