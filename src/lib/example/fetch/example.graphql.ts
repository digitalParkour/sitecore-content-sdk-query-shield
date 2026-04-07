export const queryExample = /* GraphQL */ `
  query GetExample($path: String = "/sitecore/content", $lang: String = "en") {
    example: item(path: $path, language: $lang) {
      child: children {
        list: results {
          id
          name
        }
      }
    }
  }
`;
