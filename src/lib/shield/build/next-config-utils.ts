/**
 * GraphQL query-shield bundler aliases for next.config (Turbopack + webpack).
 * See src/lib/shield/build/write-query-registry.ts for generation of graphql-client-aliases.json.
 */

import fs from "fs";
import type { NextConfig } from "next";
import path from "path";

/** Normalize for bundler alias keys (Windows → forward slashes). */
function toAliasPath(fsPath: string): string {
  return fsPath.replace(/\\/g, "/");
}

/**
 * Maps absolute graphql module base paths (…/file.graphql, no .ts) → absolute graphql.shield.ts paths.
 * Used for client bundles only; server must keep full query strings.
 */
export function loadQueryShieldAliases(): Record<string, string> | null {
  if (process.env.NEXT_PUBLIC_SHIELD_QUERY !== "true") return null;
  try {
    const aliasesPath = path.join(
      process.cwd(),
      ".shield",
      "graphql-client-aliases.json",
    );
    const graphqlAliases = JSON.parse(
      fs.readFileSync(aliasesPath, "utf8"),
    ) as Record<string, string>;
    const resolved: Record<string, string> = {};
    for (const [fromRel, toRel] of Object.entries(graphqlAliases)) {
      resolved[toAliasPath(path.resolve(process.cwd(), fromRel))] = toAliasPath(
        path.resolve(process.cwd(), toRel),
      );
    }
    return resolved;
  } catch {
    return null;
  }
}

type TurbopackFragment = NonNullable<NextConfig["turbopack"]>;

/**
 * Turbopack: browser-only loader swaps module body with sibling *.graphql.shield.ts /
 * graphql.shield.ts (path convention from src/lib/shield/build/write-query-registry.ts).
 */
export function turbopackQueryShieldOptions(): Pick<
  TurbopackFragment,
  "root" | "rules"
> {
  if (process.env.NEXT_PUBLIC_SHIELD_QUERY !== "true") {
    return {};
  }

  const loader = path.join(
    process.cwd(),
    "loaders",
    "query-shield-turbopack-loader.cjs",
  );

  const browserRule = {
    condition: "browser" as const,
    loaders: [loader],
    as: "*.ts" as const,
  };

  return {
    root: path.resolve(process.cwd()),
    rules: {
      "*.graphql.ts": { ...browserRule },
      "graphql.ts": { ...browserRule },
    },
  };
}
