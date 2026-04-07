import type { TExampleResult } from "../../lib/example/fetch/example.type";
import ExampleResultsGraphqlClient from "./example-results-graphql-client";

export default function ExampleResults({ data }: { data: TExampleResult }) {
  return (
    <section>
      <h1>Example Results</h1>
      <hr />
      <ExampleResultsGraphqlClient initialData={data} />
    </section>
  );
}
