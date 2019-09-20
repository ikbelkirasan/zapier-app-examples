require("should");

const zapier = require("zapier-platform-core");

const App = require("../../src/index");
const appTester = zapier.createAppTester(App);

const nock = require("nock");
nock.disableNetConnect();

const { API_URL } = require("../../src/shared/env");

describe("App.findUser.test", () => {
  afterEach(async () => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  it("finds a user ID", async () => {
    const bundle = {
      authData: {
        sessionKey: "a_token"
      },
      inputData: {
        username: "john.doe"
      }
    };

    nock(API_URL)
      .get("/users")
      .matchHeader("W-Token", bundle.authData.sessionKey)
      .reply(200, {
        users: [
          {
            id: 1,
            name: "jane.doe"
          },
          {
            id: 2,
            name: "john.doe"
          }
        ]
      });

    const promise = appTester(
      App.searches["findUser"].operation.perform,
      bundle
    );

    const response = await should(promise).be.resolved();
    should(response).eql([
      {
        id: 2,
        username: "john.doe"
      }
    ]);
  });
});
