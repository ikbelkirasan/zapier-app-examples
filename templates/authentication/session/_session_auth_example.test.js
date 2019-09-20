require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

const nock = require("nock");
nock.disableNetConnect();

const { API_URL } = require("../src/shared/env");

describe("App.authentication.test", () => {
  afterEach(async () => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  it("fetch access token", async () => {
    const bundle = {
      authData: {
        username: "john",
        password: "1234",
        apiKey: "pv-secret"
      }
    };

    nock(API_URL)
      .post("/login", {
        username: bundle.authData.username,
        password: bundle.authData.password
      })
      .matchHeader("W-Key", bundle.authData.apiKey)
      .reply(200, {
        login: {
          id: 111111,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          token: "a_token"
        }
      });

    const promise = appTester(App.authentication.sessionConfig.perform, bundle);

    const response = await should(promise).be.resolved();
    should(response).match({
      sessionKey: "a_token"
    });
  });

  it("includes the access token in future requests", async () => {
    const bundle = {
      authData: {
        sessionKey: "a_token"
      }
    };

    nock(API_URL)
      .get("/users/profile")
      .matchHeader("W-Token", bundle.authData.sessionKey)
      .reply(200, {
        user: {
          id: 111111,
          first_name: "John",
          last_name: "Doe"
        }
      });

    const promise = appTester(App.authentication.test, bundle);

    const response = await should(promise).be.resolved();
    should(response).match({
      name: "John Doe"
    });
  });
});
