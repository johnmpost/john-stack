import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.gql",
  documents: "./src/operations.gql",
  generates: {
    "./src/index.gen.ts": {
      config: {
        useIndexSignature: true,
      },
      plugins: [
        "typescript",
        "typescript-resolvers",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};
export default config;
