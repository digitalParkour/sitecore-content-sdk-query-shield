"use client";

import { useClientQueryExample } from "lib/example/use-client-query-example";
import type {
  TExampleResult,
  TPageFields,
} from "../../lib/example/fetch/example.type";
import styles from "./example-results.module.css";

export default function ExampleResultsGraphqlClient({
  initialData,
}: {
  initialData: TExampleResult;
}) {
  const { items, isLoading, lastError, refetch } =
    useClientQueryExample(initialData);

  return (
    <>
      <ul className={styles.list}>
        {items.map((item: TPageFields) => (
          <li key={item.id} className={styles.item}>
            {item.name}
          </li>
        ))}
      </ul>
      {lastError ? (
        <p role="alert" className={styles.error}>
          {lastError}
        </p>
      ) : null}
      <button
        type="button"
        className={styles.button}
        onClick={refetch}
        disabled={isLoading}
      >
        <span className={styles.buttonLabel}>
          {isLoading ? "Loading..." : "Refetch from client"}
        </span>
      </button>
    </>
  );
}
