import { normalizeQuery } from "lib/shield/utils/graphql-util";
import client from "lib/sitecore-client";
import { NextRequest, NextResponse } from "next/server";

// These must be full path, all lowercase starting with '/'
const allowedPathPrefixes = [
  "/sitecore/content", // TODO: scope this appropriately
  // "/sitecore/content/your-tenant/your-site/home",
  // '/sitecore/content/global-data',
];

// Must be formatted all lowercase, no punctuation
const disallowedItemIds = [
  "sitecore",
  "11111111111111111111111111111111", // /sitecore
  "0de95ae441ab4d019eb067441b7c2450", // /sitecore/content
];

// Some embedded queries in Sitecore SDK
// Add others that are not directly in code
const allowedQueries = [
  normalizeQuery(`query RedirectsQuery($siteName: String!) {
  site {
    siteInfo(site: $siteName) {
      redirects {
        pattern
        target
        redirectType
        isQueryStringPreserved
        locale
      }
    }
  }
}`),
  normalizeQuery(
    "query ( $siteName: String!, $language: String!, $itemPath: String! ) { layout ( site: $siteName, routePath: $itemPath, language: $language ) { item { id version personalization { variantIds } } } }",
  ),
];

function hasAllowedPath(path: string | undefined | null) {
  if (!path) {
    // nothing to block here
    return true;
  }

  // Handle path validation
  if (path.indexOf("/") > -1) {
    let normalPath = path.toLocaleLowerCase().trim();

    if (normalPath.charAt(0) != "/") {
      normalPath = "/" + normalPath;
    }

    // some queries have relative paths for site (ignore those, all good) - only check for full paths

    return (
      !normalPath.startsWith("/sitecore") ||
      allowedPathPrefixes.some((x) => normalPath.startsWith(x))
    );
  }

  // block known high level sitecore ids
  const normalId = path
    .toLocaleLowerCase()
    .trim()
    .replaceAll("{", "")
    .replaceAll("}", "")
    .replaceAll("-", "");

  return !disallowedItemIds.some((x) => x === normalId);
}

/*
    This is a custom solution to keep the Sitecore API_KEY secret server side.
    SEE also: src\lib\sitecore\graphql-client-factory\create.ts
    It was extended to point here for any client side usage.
    This function uses the server side GraphQL client and server secrets to proxy the request. 

    When NEXT_PUBLIC_SHIELD_QUERY=true: client sends query ID (hash), we look up the
    query body from Vercel Edge Config (or local fallback in dev) and run only that.
    When false or unset: original behavior — req.body.query is the full GraphQL query string.
*/

type PostData = {
  query: string;
  variables: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  const body: PostData = await req.json();
  const queryParam = typeof body?.query === "string" ? body.query.trim() : "";
  const variables = body?.variables ?? {};

  if (!queryParam) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const usePathShield = process.env.SHIELD_VARIABLES === "true";
  if (
    usePathShield &&
    !hasAllowedPath(variables?.path?.toString() || variables?.id?.toString())
  ) {
    console.warn("QUERY SHIELD BLOCKED PATH:", variables?.path);

    if (process.env.TEMP_SHIELD_BYPASS_AND_LOG !== "true") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }
  }

  let queryBody: string;

  const useQueryShield = process.env.NEXT_PUBLIC_SHIELD_QUERY === "true";
  if (useQueryShield) {
    const lookup: Record<string, string> = (
      await import("@shield/query-registry")
    )?.default;

    // match by known hash (as expected)
    let resolved: string | undefined = lookup?.[queryParam];

    // match by known query (gracefully allow known queries)
    const incomingQuery = normalizeQuery(queryParam);
    if (!resolved && Object.values(lookup).includes(incomingQuery)) {
      resolved = incomingQuery;
    }
    if (!resolved && allowedQueries.includes(incomingQuery)) {
      resolved = incomingQuery;
    }

    if (!resolved) {
      console.warn("QUERY SHIELD BLOCKED QUERY:", incomingQuery);
      if (process.env.TEMP_SHIELD_BYPASS_AND_LOG !== "true") {
        return NextResponse.json({ error: "Unknown query" }, { status: 400 });
      }

      resolved = queryParam as string;
    }

    queryBody = resolved;
  } else {
    queryBody = queryParam;
  }

  try {
    const data = await client.getData<unknown>(queryBody, variables);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
