import express from 'express';
import graphQLHTTP from 'express-graphql';
import schema from './schema1';
import fetch from 'node-fetch';
import { makeExecutableSchema } from 'graphql-tools';

export const BASE_URL = 'http://localhost:1237';

const getPersonById = (id) =>
  fetch(`${BASE_URL}/people/${id}/`)
    .then(res => res.json());

const root = {
  person: ({id}) => getPersonById(id)
};
const resolvers = {
  Person: {
    firstName: person => person.first_name,
    lastName: person => person.last_name,
    friends: person => person.friends.map(getPersonById)
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

const app = express();

app.use(graphQLHTTP(req => {
  return {
    graphiql: true,
    rootValue: root,
    schema: executableSchema
  };
}));

app.listen(3000, () => { console.log('GraphQL server starter on port 3000'); });
