var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet Mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Clean my car',
	completed: false
}, {
	id: 3,
	description: 'Get a haircut',
	completed: true
}];

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
	var matchedTodo;
// Iterate of todos array. find a match. 
	todos.forEach( function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}

	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
});


app.listen(PORT, function () {
	console.log('Express listening on '+ PORT +'!');
})