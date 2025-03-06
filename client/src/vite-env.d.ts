/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GRAPHQL_URI: string;
    // Add any other environment variables you need here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  