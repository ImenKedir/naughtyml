import type { SSTConfig } from "sst";
import { Api, Auth, RemixSite, Config } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "NaughtyML",
      region: "us-west-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const GOOGLE_AUTH_CLIENT_ID = 
        new Config.Secret(stack, "GOOGLE_AUTH_CLIENT_ID");

      const PLANETSCALE_DATABASE_URI = 
        new Config.Secret(stack, "PLANETSCALE_DATABASE_URI");

      const authApi = new Api(stack, "authApi");
      const AUTH_API_URL = new Config.Parameter(stack, "AUTH_API_URL", {
        value: authApi.url + "/auth",
      });

      const site = new RemixSite(stack, "site", {
        bind: [AUTH_API_URL, PLANETSCALE_DATABASE_URI]
      });

      const auth = new Auth(stack, "auth", {
        authenticator: {
          handler: "functions/auth.handler",
          bind: [site, PLANETSCALE_DATABASE_URI, GOOGLE_AUTH_CLIENT_ID],
        },
      });

      auth.attach(stack, {
        api: authApi,
        prefix: "/auth",
      });

      stack.addOutputs({
        GoogleAuth: authApi.url + "/auth/google/authorize",
        GoogleAuthCallback: authApi.url + "/auth/google/callback",
        SiteURL: site.url || "Site URL not available until after deployment",
      });
    });
  },
} satisfies SSTConfig;
