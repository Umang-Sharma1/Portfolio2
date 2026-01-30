import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL Code Generator Configuration
 *
 * Generates TypeScript types from GraphQL schema and operations.
 *
 * Run: npm run codegen
 * Watch: npm run codegen:watch
 */
const config: CodegenConfig = {
  // Schema source - local GraphQL schema file
  // This avoids needing the API server running during codegen
  schema: 'lib/graphql/schema.graphql',

  // Documents to scan for operations
  documents: ['lib/graphql/**/*.ts', 'components/**/*.tsx', 'app/**/*.tsx'],

  // Ignore node_modules
  ignoreNoDocuments: true,

  generates: {
    // Generate all types in a single file
    'lib/graphql/__generated__/types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        // Use exact types (no Partial/Pick wrappers)
        avoidOptionals: false,

        // Generate named exports
        enumsAsTypes: true,

        // Immutable types
        immutableTypes: false,

        // Scalar mappings
        scalars: {
          DateTime: 'string',
          Date: 'string',
          JSON: 'Record<string, any>',
          Upload: 'File',
        },

        // Hook configuration
        withHooks: true,
        withHOC: false,
        withComponent: false,

        // Naming conventions
        typesPrefix: '',
        typesSuffix: '',

        // Skip typename in operations
        skipTypename: false,

        // Add __typename to all selection sets
        addTypename: true,

        // Use DocumentNode from graphql-tag
        documentMode: 'documentNode',

        // Generate React hooks
        reactApolloVersion: 3,

        // Export fragments
        exportFragmentSpreadSubTypes: true,

        // Deduplication
        dedupeFragments: true,

        // Omit operation suffixes
        omitOperationSuffix: false,

        // Use type imports
        useTypeImports: true,

        // Default base types path
        baseTypesPath: '',

        // Error handling
        errorType: 'ApolloError',

        // Merge fragments
        mergeFragmentTypes: true,
      },
    },

    // Generate introspection result for Apollo Client
    'lib/graphql/__generated__/introspection.ts': {
      plugins: ['fragment-matcher'],
      config: {
        apolloClientVersion: 3,
      },
    },

    // Generate schema types only (for server-side usage)
    'lib/graphql/__generated__/schema.ts': {
      plugins: ['typescript'],
      config: {
        enumsAsTypes: true,
        skipTypename: true,
        declaration: true,
      },
    },
  },

  // Hooks for codegen lifecycle
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
