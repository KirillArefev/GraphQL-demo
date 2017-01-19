import express from 'express';
import morgan from 'morgan';
import bodyParser  from 'body-parser'
import _ from 'lodash';
import people from './fixtures/people';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/people', (req, res) => {
  res.send(people);
});

app.get('/people/:id', (req, res) => {
  let personData = _.find(people, i => i.id === req.params.id);
  if (!personData) {
    res.statusCode = 404;
    res.send({ error: 'Person not found' });
  } else {
    res.send(personData);
  }
});


app.listen(1237, () => console.log('REST server is running on port 1237'));
