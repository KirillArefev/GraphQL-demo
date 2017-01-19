import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:1237';

const getPersonById = (id) =>
  fetch(`${BASE_URL}/people/${id}/`)
    .then(res => res.json());

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: '...',
  fields: () => ({
    firstName: {
      type: GraphQLString,
      resolve: (person) => { return person.first_name }
    },
    lastName: {
      type: GraphQLString,
      resolve: (person) => person.last_name
    },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    id: { type: GraphQLString },
    friends: {
      type: new GraphQLList(PersonType),
      resolve: (person) => person.friends.map( getPersonById )
    }
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',
  fields: () => ({
    person: {
      type: PersonType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (root, args) => getPersonById(args.id)
    }
  })
});

export default new GraphQLSchema({
  query: QueryType
});
