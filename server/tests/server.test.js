const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {

    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });

    Todo.find().then((todos) => {
      expect(todos.length).toBe(2);
      done();
    }).catch((e) => done(e));
  });

});//(POST /todos)


describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });//it should get all todos

});//(GET /todos)

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {

    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non objects id', (done) => {
    request(app)
      .get('/todos/123456')
      .expect(404)
      .end(done);
  });

});//(GET /todos/:id)

describe('DELETE /todos/:id', () => {

  it('should delete a todo', (done) => {

    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.doc._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a 404 if todo not found', (done) => {

    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non objectID', (done) => {
    request(app)
      .delete('/todos/123456')
      .expect(404)
      .end(done)
  });

});//(DELETE /todos/:id)

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({text: "new", completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('new');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });

  it('should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send({text: "new", completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('new');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist(null);
      })
      .end(done)
  });


});//PATCH