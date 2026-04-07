import { defineCliConfig } from "@sitecore-content-sdk/nextjs/config-cli";

import {
  extractFiles,
  generateMetadata,
  generateSites,
  writeImportMap,
} from "@sitecore-content-sdk/nextjs/tools";

import scConfig from "./sitecore.config";

import { writeQueryShieldRegistry } from "./src/lib/shield/build/cli-command";

export default defineCliConfig({
  config: scConfig,

  build: {
    commands: [
      generateMetadata(),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ["src/components/sitecore"],
      }),
      writeQueryShieldRegistry(),
    ],
  },

  componentMap: {
    paths: ["src/components/sitecore"],
  },
});
