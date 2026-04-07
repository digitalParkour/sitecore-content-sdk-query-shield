# Query Shield — lock down Sitecore GraphQL usage

Great benefits and all automatic

# What this does

1. Hides Sitecore Context ID from browser
2. Blocks GraphQL Queries not in codebase
   2b. Obfuscates query payload from browser (passing hash in place of app query)
3. Blocks path and id query values that are out of scope

# How to use it

- Enable this .env block

```
  # ============================================================================
  # Query Shield - lock down client query usage
  #   NEXT_PUBLIC_SHIELD_QUERY: true/false - use hash ID from browser, only allow known queries
  #   SHIELD_QUERY_PATH: true/false - restrict path or id variable values
  #   TEMP_SHIELD_QUERY_BYPASS_AND_LOG: true/false - log queries and bypass (to find external queries to make known)
  # ============================================================================
  NEXT_PUBLIC_SHIELD_QUERY=true
  SHIELD_QUERY_PATH=true
  TEMP_SHIELD_QUERY_BYPASS_AND_LOG=false
```

- Ensure you REMOVE this default variable
  - `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=`
- To your Next.js 16+, Context SDK 2.0.1+ repo
  - Add these files:
    - /loaders/\*
    - /src/app/api/graphl/\*
    - /src/lib/shield/\*
  - Merge these files:
    - /src/lib/sitecore-client.ts
      - (change SitecoreClient to SitecoreServerProxyClient)
    - /next.config.ts
      - (turbopack)
    - /sitecore.cli.config.ts
      - (last build command, writeQueryShieldRegistry())
    - /.gitignore
      - \*.shield.ts
      - .shield/\*
  - Run npm build
    - notice files generated under .shield/\*
    - **client queries will now proxy to /api/graphql and use hash ID for query**

  - If you want the test example, then also add:
    - /src/app/[site]/[locale]/example/\*
    - /src/components/exampe/\*
    - /src/lib/example/\*

# How it does it

- 1. Sitecore GraphQL Proxy
  - Enabled by using `SitecoreServerProxyClient()` in sitecore-client.ts
  - **Context aware SitecoreClient**
    - if browser, post query to new server proxy /api/graphql
    - else server, post to Sitecore endpoint with server-side secret

- 2. Registers \*graphql.ts files on build to gate proxied requets
  - Enabled by `NEXT_PUBLIC_SHIELD_QUERY=true`
  - sitecore.cli.config **build command** generates lookup file
  - Proxy, /api/graphql, verifies incoming query matches list

- 2b. Obfuscate browser-side queries and minimize payload size
  - Enabled by `NEXT_PUBLIC_SHIELD_QUERY=true`
  - Assumes all your graphql queries are imported from \*graphql.ts files
  - sitecore.cli.config **build command**:
    - generates \*graphql.shield.ts file next to query file with same const but hashed id for query.
    - generates import alias list
  - next.config.ts turbopack loader replaces the shield.ts file for the graphql.ts file on build (for client bundle only)

- 3. **Proxy** route sniffs for "id" or "path" variables and validates values against hard coded lists.
  - Enabled by `SHIELD_QUERY_VAR=true`
  - Manage **allow/deny lists** in /src/app/api/graphql/route.ts
