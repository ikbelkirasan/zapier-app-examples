require("should");

const zapier = require("zapier-platform-core");

const App = require("../../src/index");
const appTester = zapier.createAppTester(App);

const nock = require("nock");
nock.disableNetConnect();

const { API_URL } = require("../../src/shared/env");

describe("App.listUsers.test", () => {
  afterEach(async () => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  it("fetches a list of users", async () => {
    const bundle = {
      authData: {
        sessionKey: "a_token"
      },
      inputData: {}
    };

    nock(API_URL)
      .get("/users")
      .matchHeader("W-Token", bundle.authData.sessionKey)
      .reply(200, {
        users: [
          {
            id: 1000,
            username: "john.doe",
            name: "John Doe",
            account_id: 10000,
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com"
          }
        ]
      });

    const promise = appTester(
      App.triggers["listUsers"].operation.perform,
      bundle
    );

    const response = await should(promise).be.resolved();
    should(response).eql([
      {
        id: 1000,
        username: "john.doe",
        name: "John Doe",
        account_id: 10000,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com"
      }
    ]);
  });
});
