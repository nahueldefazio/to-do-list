const { Router } = require("express");
const Tasks = require('../models/tasks');

Router.get('/allTasks', async (req, res) => {
    try {
        const tasks = await Tasks.find();
        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

Router.post('/createTask', async (req, res) => {
    try {
        const task = await Tasks.create(req.body);
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

Router.put('/updateTask/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

Router.delete('/deleteTask/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.id);
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = Router;
