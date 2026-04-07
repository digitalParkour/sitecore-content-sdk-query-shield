export type TExampleResult = {
  example: {
    child: {
      list: TPageFields[];
    };
  };
};

export type TPageFields = {
  id: string;
  name: string;
};
