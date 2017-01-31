import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import fetch from 'node-fetch';
import { BASE_URL } from './index';
import Test from './data-server/mongoose/TestSchemaM';

let getAllTests = () => {
    return new Promise((resolve, reject) => {
      Test.find({}).exec((err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
};

let addPerson = (personFields) => fetch(
    `${BASE_URL}/people`,
    { method: 'POST', body: JSON.stringify(personFields),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

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
      resolve: (person, args, {loaders}) => loaders.person.loadMany(person.friends)
    }
  })
});

const TestType = new GraphQLObjectType({
  name: 'Test',
  description: '...',
  fields: () => ({
    id: { type: GraphQLString },
    link: { type: GraphQLString },
    title: { type: GraphQLString },
    titleForUser: { type: GraphQLString },
    currentQuestion: { type: GraphQLInt },
    neededRatio: { type: GraphQLInt },
    ratio: { type: GraphQLInt },
    passed: { type: GraphQLBoolean }
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
      resolve: (root, args, {loaders}) => loaders.person.load(args.id)
    },
    tests: {
      type: new GraphQLList(TestType),
      resolve: getAllTests
    }
  })
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: '...',
  fields: () => ({
    addPerson: {
      type: PersonType,
      description: 'Add a person',
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve: (value, args) => addPerson(args)
    }
  })
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
