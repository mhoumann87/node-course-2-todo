const {ObjectId} =require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const{Todo} = require('./../server/models/todo');

// let id = '5a09c6bf07c1be47ae2d569211';
//
// if (!ObjectId.isValid(id)) {
//   console.log('ID not valid');
// }


//Remove all todos in the database

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

/*Find one post and remove*/


/*Find by Id and remove*/
Todo.findByIdAndRemove('5a0adb59b88a8b42c64285ef').then((todo) => {
  console.log(todo);
});