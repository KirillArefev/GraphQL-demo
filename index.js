import express from 'express';
import graphQLHTTP from 'express-graphql';
//import schema from './schema';

const app = express();

app.use(graphQLHTTP({
  graphiql: true,
  //schema
}));

app.listen(3000);
