import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { getSession } from "next-auth/react";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({ uri: "/api/graphql" });

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();

  return {
    headers: {
      ...headers,
      "session-token": session?.sessionToken ?? "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
