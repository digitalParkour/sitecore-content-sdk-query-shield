"use client";

import { useClientQueryExample } from "lib/example/use-client-query-example";
import type {
  TExampleResult,
  TPageFields,
} from "../../lib/example/fetch/example.type";

const buttonStyle = {
  marginTop: "10px",
  color: "white",
  backgroundColor: "black",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer" as const,
};

export default function ExampleResultsGraphqlClient({
  initialData,
}: {
  initialData: TExampleResult;
}) {
  const { items, isLoading, lastError, refetch } =
    useClientQueryExample(initialData);

  return (
    <>
      <ul>
        {items.map((item: TPageFields) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {lastError ? (
        <p role="alert" style={{ color: "crimson", marginTop: "8px" }}>
          {lastError}
        </p>
      ) : null}
      <button
        type="button"
        style={buttonStyle}
        onClick={refetch}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Refetch from client"}
      </button>
    </>
  );
}
