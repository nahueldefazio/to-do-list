const express = require("express");
const Tasks = require('../models/tasks');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Backend funcionando!');
  });
  

router.get('/allTasks', async (req, res) => {
    try {
        const tasks = await Tasks.find();
        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/createTask', async (req, res) => {
    try {
        const task = await Tasks.create(req.body);
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/updateTask/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/deleteTask/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.id);
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
