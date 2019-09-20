require("should");

const zapier = require("zapier-platform-core");

const App = require("../../src/index");
const appTester = zapier.createAppTester(App);

const nock = require("nock");
nock.disableNetConnect();

const { API_URL } = require("../../src/shared/env");

describe("App.createSomething.test", () => {
  afterEach(async () => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  it("creates something", async () => {
    const bundle = {
      authData: {
        sessionKey: "a_token"
      },
      inputData: {
        user_id: 1000,
        notes: "Come in early today."
      }
    };

    nock(API_URL)
      .post("/things", bundle.inputData)
      .matchHeader("W-Token", bundle.authData.sessionKey)
      .reply(200, {
        something: {
          id: 10000
          // ...more fields
        }
      });

    const promise = appTester(
      App.creates["createSomething"].operation.perform,
      bundle
    );

    const response = await should(promise).be.resolved();
    should(response).eql({
      id: 10000
      // ...more fields
    });
  });
});
