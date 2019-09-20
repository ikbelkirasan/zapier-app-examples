require("should");

const zapier = require("zapier-platform-core");

const App = require("../../src/index");
const appTester = zapier.createAppTester(App);

const nock = require("nock");

const { authURL, API_URL, CLIENT_ID, CLIENT_SECRET } = require("../shared/env");

describe("App.authentication.test", () => {
  afterEach(async () => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  it("generates an authorize URL", () => {
    const bundle = {
      inputData: {
        state: "4444",
        redirect_uri: "http://zapier.com/"
      }
    };

    return appTester(App.authentication.oauth2Config.authorizeUrl, bundle).then(
      authorizeUrl => {
        should(authorizeUrl).eql(
          `${authURL(
            "authorize"
          )}?client_id=test_client_id&state=4444&redirect_uri=http%3A%2F%2Fzapier.com%2F&response_type=code`
        );
      }
    );
  });

  it("can fetch an access token", () => {
    const bundle = {
      inputData: {
        code: "one_time_code",
        redirect_uri: "http://zapier.com"
      }
    };

    nock(API_URL)
      .post("/oauth/access_token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: bundle.inputData.code,
        redirect_uri: "http://zapier.com",
        grant_type: "authorization_code"
      })
      .reply(200, {
        access_token: "a_token"
        // refresh_token: 'a_refresh_token'
      });

    return appTester(
      App.authentication.oauth2Config.getAccessToken,
      bundle
    ).then(result => {
      should(result.access_token).eql("a_token");
      // should(result.refresh_token).eql('a_refresh_token')
    });
  });

  it.skip("can refresh the access token", () => {
    const bundle = {
      authData: {
        access_token: "a_token",
        refresh_token: "a_refresh_token"
      },
      inputData: {
        redirect_uri: "http://zapier.com"
      }
    };

    nock(API_URL)
      .post("/oauth/access_token", {
        // refresh_token: bundle.authData.refresh_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: bundle.inputData.redirect_uri,
        grant_type: "refresh_token"
      })
      .reply(200, {
        access_token: "a_new_token"
      });

    return appTester(
      App.authentication.oauth2Config.refreshAccessToken,
      bundle
    ).then(result => {
      should(result.access_token).eql("a_new_token");
    });
  });

  it("includes the access token in future requests", () => {
    const bundle = {
      authData: {
        access_token: "a_token"
        // refresh_token: 'a_refresh_token'
      }
    };

    nock(API_URL)
      .get("/me")
      .query({ access_token: bundle.authData.access_token })
      .reply(200, {
        name: "john"
      });

    return appTester(App.authentication.test, bundle).then(result => {
      should(result).have.property("name", "john");
    });
  });
});
