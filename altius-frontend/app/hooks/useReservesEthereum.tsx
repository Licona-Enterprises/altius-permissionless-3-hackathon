import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';
import { useQuery } from 'urql';

// Create the client
const client = createClient({
  url: 'https://gateway.thegraph.com/api/{api-key}/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g',
  exchanges: [cacheExchange, fetchExchange],
});

// Define the GraphQL query
// const DATA_QUERY = gql`
//   query GetReserves($underlyingAsset: String!) {
//       reserves(where: { underlyingAsset: $underlyingAsset }) {
//       name
//       underlyingAsset
//       liquidityRate
//       variableBorrowRate
//     }
//   }
// `;

const DATA_QUERY = gql`
  reserves(where: { underlyingAsset: $underlyingAsset }) {
    name
    underlyingAsset
    liquidityRate
    variableBorrowRate
  }
`;


// Custom hook to fetch reserves
export const useReserves = (underlyingAsset: string) => {
  const [{ data, error, fetching }] = useQuery({
    query: DATA_QUERY,
    variables: { underlyingAsset },
    pause: !underlyingAsset, 
  });

  return { data, error, fetching };
};
