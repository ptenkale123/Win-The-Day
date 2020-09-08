const express = require('express');
const cors = require('cors');

const db = require('./models');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

function success(res, resBody) {
    return res.status(200).json(resBody);
}

/*
List of requests:
1. Post- Create a new tasklist and add it to the list
2. Get- Return all tasklists from each day
3. Put- Update tasklist from a particular day based on object id
4. Delete- Delete a day's tasks from the dayList
*/

app.post('/winTheDay', async (req, res, next) => {
    try {
        console.log(req.body);
        const winTheDay = await db.winTheDay.create(req.body);
        if (req.body.winStatus) {
            await db.winStats.update({name: 'winStats'}, { $inc: { numWins: 1, numDays: 1}});
        } else {
            await db.winStats.update({name: 'winStats'}, { $inc: { numLosses: 1, numDays: 1}});
        }
        return success(res, winTheDay);
    } catch (err) {
        const errorMessage = "Failed to create a new taskList:\n" + err.message;
        next({status: 400, message: errorMessage})
    }
});

app.get('/winTheDay', async (req, res, next) => {
    try {
        const allTaskLists = await db.winTheDay.find();
        return success(res, allTaskLists);
    } catch (err) {
        const errorMessage = "Failed to retrieve all taskLists:\n" + err.message;
        next({status: 400, message: errorMessage})
    }
});

app.put('/winTheDay/:id', async (req, res, next) => {
    try {
        const newTaskList = req.body;
        const oldTaskList = await db.winTheDay.findByIdAndUpdate(req.params.id, newTaskList);
        if (oldTaskList.winStatus && !newTaskList.winStatus) {
            await db.winStats.update({name: 'winStats'}, { $inc: { numWins: -1, numLosses: 1}});
        } else if (newTaskList.winStatus && !oldTaskList.winStatus) {
            await db.winStats.update({name: 'winStats'}, { $inc: { numWins: 1, numLosses: -1}});
        }
        return success(res, newTaskList);
    } catch (err) {
        const errorMessage = "Failed to update specified taskList:\n" + err.message;
        next({status: 400, message: errorMessage})
    } 
});

app.delete('/winTheDay/:id', async (req, res, next) => {
    try {
        const deletedTaskList = await db.winTheDay.findByIdAndRemove(req.params.id);
        if (deletedTaskList.winStatus) {
            await db.winStats.update({name: 'winStats'}, { $inc: { numWins: -1, numDays: -1}});
        } else {
            await db.winStats.update({name: 'winStats'}, { $inc: { numLosses: -1, numDays: -1}});
        }
        return success(res, deletedTaskList);
    } catch (err) {
        const errorMessage = "Failed to delete specified taskList:\n" + err.message;
        next({status: 400, message: errorMessage});
    }
});

app.get('/winStats', async (req, res, next) => {
    try {
        const winStatistics = await db.winStats.find();
        return success(res, winStatistics);
    } catch (err) {
        const errorMessage = "Failed to retrieve the Win/Loss statistics:\n" + err.message;
        next({status: 400, message: errorMessage});
    }
});

// error handling middleware
app.use((err, req, res, next) => {
    return res.status(err.status || 400).json({
        status: err.status || 400,
        message: err.message || "there was an error processing request",
    })
})



