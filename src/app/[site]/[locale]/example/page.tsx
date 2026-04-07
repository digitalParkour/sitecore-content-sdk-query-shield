import ExampleResults from "components/example/example-results";
import { fetchGraphQlExample } from "lib/example/fetch/example.api";

export default async function Page() {
  const data = await fetchGraphQlExample();
  return (
    <main style={{ padding: "20px" }}>
      <ExampleResults data={data} />
    </main>
  );
}

// Metadata fields for the page.
export const generateMetadata = async () => {
  return {
    title: "Example",
  };
};
