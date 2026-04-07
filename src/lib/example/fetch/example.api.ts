import client from "lib/sitecore-client";
import { queryExample } from "./example.graphql";
import { TExampleResult } from "./example.type";

/* ==================== GraphQL Example ================================
/*
 * A Fetch Method implements how to get the data.
 * Here we will query against Sitecore's GraphQL endpoint.
 */
export async function fetchGraphQlExample(
  path: string = "/sitecore/content/clientprefix/clientprefix",
  lang: string = "en",
): Promise<TExampleResult> {
  console.log("QueryExample", queryExample);
  return (await client.getData<TExampleResult>(queryExample, {
    path: path,
    lang: lang,
  })) as TExampleResult;
}
