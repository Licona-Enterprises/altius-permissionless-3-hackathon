import { Provider } from 'urql';
import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';

export const aave_rate_query = gql`
query GetReserves($underlyingAsset: String!) {
        reserves(where: { underlyingAsset: $underlyingAsset }) {
        name
        underlyingAsset
        liquidityRate
        variableBorrowRate
    }
}
`;

const THE_GRAPH_API_KEY = '5fef2a1fbe41263bf76e8555468ce9ed';

// Create clients for each chain
export const ethClient = createClient({
  url: 'https://gateway.thegraph.com/api/5fef2a1fbe41263bf76e8555468ce9ed/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g',
  exchanges: [cacheExchange, fetchExchange],
});

export const avaxClient = createClient({
  url: 'https://gateway.thegraph.com/api/5fef2a1fbe41263bf76e8555468ce9ed/subgraphs/id/2h9woxy8RTjHu1HJsCEnmzpPHFArU33avmUh4f71JpVn',
  exchanges: [cacheExchange, fetchExchange],
});

export const arbitrumClient = createClient({
  url: 'https://gateway.thegraph.com/api/5fef2a1fbe41263bf76e8555468ce9ed/subgraphs/id/DLuE98kEb5pQNXAcKFQGQgfSQ57Xdou4jnVbAEqMfy3B',
  exchanges: [cacheExchange, fetchExchange],
});
