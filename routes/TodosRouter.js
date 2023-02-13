const express = require('express')
const tRouter = express.Router()

const TodosController = require('../controllers/TodosController')

tRouter.post('/', TodosController.createTodo)
tRouter.put('/:id_todo', TodosController.updateTodo)
tRouter.put('/process/:id_todo', TodosController.processTodo)
tRouter.put('/completed/:id_todo', TodosController.completedTodo)
tRouter.put('/restore/:id_todo', TodosController.restoreTodo)
tRouter.get('/:id_user', TodosController.getTodoByIdUser)
tRouter.get('/process/:id_user', TodosController.getTodoProcess)
tRouter.get('/completed/:id_user', TodosController.getTodoCompleted)
tRouter.get('/edit/:id_todo', TodosController.getTodoById)
tRouter.delete('/:id_todo', TodosController.deleteTodo)
tRouter.delete('/all/:id_user', TodosController.deleteTodoByUser)

module.exports = tRouter