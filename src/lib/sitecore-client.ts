import scConfig from "sitecore.config";
import { SitecoreServerProxyClient } from "./shield/sitecore-server-proxy-client";

const client = new SitecoreServerProxyClient({
  ...scConfig,
});

export default client;
