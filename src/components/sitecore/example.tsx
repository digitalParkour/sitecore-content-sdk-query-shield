import {
  GetComponentServerProps,
  SitecorePageProps,
} from "@sitecore-content-sdk/nextjs";
import ExampleResults from "components/example/example-results";
import { fetchGraphQlExample } from "lib/example/fetch/example.api";
import { TExampleResult } from "lib/example/fetch/example.type";

type ExampleProps = SitecorePageProps & {
  data: TExampleResult;
};

const Example = ({ data }: ExampleProps): React.ReactNode => {
  return <ExampleResults data={data} />;
};

export const getComponentServerProps: GetComponentServerProps = async () => {
  const data = await fetchGraphQlExample();
  return { data };
};

export default Example;
