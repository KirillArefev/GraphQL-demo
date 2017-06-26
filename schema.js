import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql';
import Test from './data-server/mongoose/TestSchemaM';

let getAllTests = () => {
    return new Promise((resolve, reject) => {
      Test.find({}).exec((err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
};

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
    neededRatio: { type: GraphQLFloat },
    ratio: { type: GraphQLFloat },
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

export default new GraphQLSchema({
  query: QueryType
});
