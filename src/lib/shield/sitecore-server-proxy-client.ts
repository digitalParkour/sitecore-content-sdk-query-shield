import { SitecoreClient } from "@sitecore-content-sdk/nextjs/client";
import { SitecoreConfig } from "@sitecore-content-sdk/nextjs/config";
import { SitecoreNextjsClientInit } from "node_modules/@sitecore-content-sdk/nextjs/types/client/sitecore-nextjs-client";

/* Detect if client context and forward to server proxy route (/api/graphql).
  Otherwise, use the normal SitecoreClient (server side).
  This allows us to hide contextId from browser, but does increase latency and cloud spend.
*/

export class SitecoreServerProxyClient extends SitecoreClient {
  constructor(initOptions: SitecoreNextjsClientInit) {
    const isClientSide = typeof globalThis.window !== "undefined";
    const useServerProxy =
      process.env.NEXT_PUBLIC_USE_SHIELD === "true" && isClientSide;
    if (useServerProxy) {
      // point queries to our custom server side proxy route (/api/graphql)
      initOptions.api.local.apiHost = "/"; // CLient side query can be relative
      initOptions.api.local.path = "/api/graphql"; // match edge path
      initOptions.api.edge = {} as unknown as SitecoreConfig["api"]["edge"]; // this hack forces fallback to /api/graphql
    }
    super(initOptions);
  }
}
