const express = require("express");
const app = express();

app.use(express.json());

app.listen(3000);

allTasks = [];
viewCounts = 0;

// ! MIDDLEWARES
function checkIfHasId(req, res, next) {
	if (allTasks.filter(el => el.id == req.params.id).length == 0) {
		return res.status(400).json({ error: "Task not found!" });
	}
	return next();
}

app.use((req, res, next) => {
	console.log(`Contagem de requisições: ${++viewCounts}`);

	return next();
});

// ! ROUTES

// Create new project
app.post("/projects", (req, res) => {
	const { id, title } = req.body;

	allTasks.push({ id: id, title: title, tasks: [] });

	res.json({ status: "Project created!" });
});

// Fetch all projects
app.get("/projects", (req, res) => {
	res.json(allTasks);
});

// Delete one project by id
app.delete("/projects/:id", checkIfHasId, (req, res) => {
	const { id } = req.params;

	allTasks = allTasks.filter(task => task.id != id);

	res.json({ status: "Project deleted!" });
});

// Change project title
app.put("/projects/:id", checkIfHasId, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	allTasks = allTasks.map(task =>
		task.id == id ? { id: task.id, title: title, tasks: task.tasks } : task
	);

	res.json({ status: `Titulo da tarefa ${id} alterado` });
});

// Add task to a great task
app.post("/projects/:id/tasks", checkIfHasId, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	allTasks.filter(el => el.id == id)[0].tasks.push(title);

	res.json({ status: "Task added!" });
});
