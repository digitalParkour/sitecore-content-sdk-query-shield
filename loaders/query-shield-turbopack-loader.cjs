/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Turbopack / webpack loader: emit sibling shield source for GraphQL modules.
 * - *.graphql.ts → *.graphql.shield.ts
 * - graphql.ts (basename only) → graphql.shield.ts
 * Register with `condition: 'browser'` only. Run `shield:build` for .shield.ts files.
 */
const fs = require("fs");
const path = require("path");

/** @param {string} resourcePath forward-slash normalized path */
function resolveShieldPath(resourcePath) {
  const base = path.basename(resourcePath);

  if (base === "graphql.shield.ts") {
    return null;
  }

  if (base === "graphql.ts") {
    return resourcePath.replace(/graphql\.ts$/i, "graphql.shield.ts");
  }

  if (
    /\.graphql\.ts$/i.test(resourcePath) &&
    !/\.graphql\.shield\.ts$/i.test(resourcePath)
  ) {
    return resourcePath.replace(/\.graphql\.ts$/i, ".graphql.shield.ts");
  }

  return null;
}

module.exports = function queryShieldTurbopackLoader(source) {
  const resourcePath = this.resourcePath.replace(/\\/g, "/");
  const shieldPath = resolveShieldPath(resourcePath);

  if (!shieldPath) {
    return source;
  }

  try {
    if (fs.existsSync(shieldPath)) {
      return fs.readFileSync(shieldPath, "utf8");
    }
  } catch {
    /* fall through */
  }

  this.emitWarning(
    new Error(
      `[graphql-shield-turbopack-loader] Missing ${path.basename(shieldPath)} next to ${path.basename(resourcePath)}; run shield:build. Passing through query source.`,
    ),
  );
  return source;
};
