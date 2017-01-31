import express from 'express';
import graphQLHTTP from 'express-graphql';
import schema from './schema';
import fetch from 'node-fetch';
import DataLoader from 'dataloader';

export const BASE_URL = 'http://localhost:1237';

const getPersonById = (id) =>
  fetch(`${BASE_URL}/people/${id}/`)
    .then(res => res.json());

const app = express();

app.use(graphQLHTTP(req => {
  const personLoader = new DataLoader(
    keys => Promise.all( keys.map( getPersonById ) )
  );

  const loaders = {
    person: personLoader
  };

  return {
    context: {loaders},
    graphiql: true,
    schema
  };
}));

app.listen(3000, () => { console.log('GraphQL server starter on port 3000'); });
