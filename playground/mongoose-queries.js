const {ObjectId} =require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const{Todo} = require('./../server/models/todo');

let id = '5a09c6bf07c1be47ae2d569211';

if (!ObjectId.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id
// }).then((todos)=> {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=> {
//   console.log('Todo', todo);
// });

Todo.findById(id).then((todo)=> {
  if (!todo) {
    return console.log("ID not found");
  }

  console.log('Todo by ID', todo);
}).catch((e) => console.log(e));