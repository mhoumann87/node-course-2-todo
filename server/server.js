const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

todo.save().then((doc) => {
  res.send(doc);
}, (e) => {
  res.status(400).send(e);
});

});//app.post('/todos')

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) =>{
    res.status(400).send(e);
  });

});//app.get(/todos)

app.get('/todos/:id', (req, res) => {

let id = req.params.id;

if (!ObjectID.isValid(id)) {
  return res.status(404).send();
}

Todo.findById(id).then((todo) => {
  if (!todo) {
    return res.status(404).send();
  }

  res.send({todo});
}).catch((e) => {
  res.status(400).send();
});

});//app.get(/todos/:id)

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = {app};