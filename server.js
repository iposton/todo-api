var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req,res){ 
	res.send('Todo api root');
});

// Get request all todos
app.get('/todos', function (req,res){ 
	res.json(todos);
});

// Get request one todo
app.get('/todos/:id', function (req,res){ 
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
  // Iterate of todos array. find a match. ^ refactored with underscore above

	// todos.forEach( function (todo) {
	// 	if (todoId === todo.id) {
	// 		matchedTodo = todo;
	// 	}
	// });

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
});
// Post 
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
 // Validation
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();
  // add field 
	body.id = todoNextId++;

  // push to todos array
	todos.push(body);

	res.json(body);

});

// Delete 
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

 if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with that id."});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

// Put 
app.put('/todos/:id', function (req, res) {
	// Here 
  var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).json({"error": "not found"})
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;

	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({"error": "something bad happened. not completed."});
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		console.log('Update todo successful.');
		validAttributes.description = body.description;

	} else if (body.hasOwnProperty('description')) {
		return res.status(400).json({"error": "description not valid."});
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});


app.listen(PORT, function () {
	console.log('Express listening on '+ PORT +'!');
})