import type { TExampleResult } from "../../lib/example/fetch/example.type";
import ExampleResultsGraphqlClient from "./example-results-graphql-client";
import styles from "./example-results.module.css";

export default function ExampleResults({ data }: { data: TExampleResult }) {
  return (
    <section className={styles.card} aria-labelledby="example-results-title">
      <h1 id="example-results-title" className={styles.title}>
        Example Results
      </h1>
      <hr className={styles.divider} />
      <div className={styles.body}>
        <ExampleResultsGraphqlClient initialData={data} />
      </div>
    </section>
  );
}
