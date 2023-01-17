const express = require('express')
const tRouter = express.Router()

const TodosController = require('../controllers/TodosController')

tRouter.post('/',  TodosController.createTodo)
tRouter.put('/:id_todo', TodosController.updateTodo)

module.exports = tRouter