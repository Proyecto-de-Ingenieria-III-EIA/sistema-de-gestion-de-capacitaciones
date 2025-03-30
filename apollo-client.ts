// filepath: d:\SumClasses\Proyecto III Sistemas Repos\sistema-de-gestion-de-capacitaciones\apollo-client.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql", // Your GraphQL API endpoint
  cache: new InMemoryCache(), // Cache for query results
});

export default client;