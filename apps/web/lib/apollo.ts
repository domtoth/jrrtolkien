import { ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { HttpLink } from '@apollo/client';

export const makeClient = () => {
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
});

  return new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
};

