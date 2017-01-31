const mongoose = require('./mongoose');

const beautifyId = (schema) => {
  schema.options.toObject = schema.options.toObject || {};
  schema.options.toObject.transform =  (doc, ret) => {
    ret.id = doc.id;
    delete ret._id;
    return ret;
  };
};

const testSchema = new mongoose.Schema({
  link: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String
  },
  titleForUser: {
    type: String
  },
  currentQuestion: {type: Number, default: 1},
  neededRatio: Number,
  ratio: {type: Number, default: null},
  passed: {type: Boolean, default: null}
});

// _id to id for client
beautifyId(testSchema);

const Test = mongoose.model('Test', testSchema);
export default Test;
