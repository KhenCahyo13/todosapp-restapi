const Database = require('../config/Database')

const TodosController = {
  createTodo: async (request, response) => {
    try {
      const { id_user, name, date, description } = request.body
      const query = 'INSERT INTO todos (id_user, name, date, description) VALUES (?, ?, ?, ?)'
      const [result] = await Database.query(query, [id_user, name, date, description])
      response.status(201).json({ msg: "Todo successfully created" })
    } catch (error) {
      response.status(400).json({ msg: error })
    }
  },

  updateTodo: async (request, response) => {
    try {
      const { name, date, description } = request.body
      const { id_todo } = request.params
      const query = 'UPDATE todos SET name = ?, date = ?, description = ? WHERE id_todo = ?'
      const [results, fields] = await Database.query(query, [name, date, description, id_todo])
      response.status(200).json({ msg: "Todo successfully updated" })
    } catch (error) {
      console.log(error)
      response.status(400).json({ msg: error })
    }
  },

  restoreTodo: async (request, response) => {
    try {
      const { id_todo } = request.params
      const query = "UPDATE todos SET is_process = 0 WHERE is_process = 1 AND id_todo = ?"
      const [results] = await Database.query(query, [id_todo])
      response.status(201).json({ msg: "Todo successfully restored" })
    } catch (error) {
      console.log(error)
    }
  },

  processTodo: async (request, response) => {
    try {
      const { id_todo } = request.params
      const query = "UPDATE todos SET is_process = 1 WHERE id_todo = ?"
      const [results] = await Database.query(query, [id_todo])
      response.status(200).json({ msg: "Todo move to process list" })
    } catch (error) {
      console.log(error)
      response.status(400).json({ msg: error })
    }
  },

  completedTodo: async (request, response) => {
    try {
      const { id_todo } = request.params
      const query = "UPDATE todos SET is_completed = 1, is_process = 0 WHERE id_todo = ?"
      const [results] = await Database.query(query, [id_todo])
      response.status(200).json({ msg: "Todo move to completed list" })
    } catch (error) {
      response.status(400).json({ msg: error })
    }
  },


  getTodoByIdUser: async (request, response) => {
    try {
      const { id_user } = request.params
      const query = "SELECT * FROM todos WHERE id_user = ? AND is_process = 0 AND is_completed = 0"
      const [results] = await Database.query(query, [id_user])
      response.status(200).json({ data: results })
    } catch (error) {
      console.log(error)
      response.status(400).json({ msg: "Fullname is not in the data" })
    }
  },

  getTodoProcess: async (request, response) => {
    try {
      const { id_user } = request.params
      const query = "SELECT * FROM todos WHERE id_user = ? AND is_process = 1"
      const [results] = await Database.query(query, [id_user])
      response.status(201).json({ data: results })
    } catch (error) {
      response.status(400).json({ msg: "Data is not found" })
    }
  },

  getTodoCompleted: async (request, response) => {
    try {
      const { id_user } = request.params
      const query = "SELECT * FROM todos WHERE id_user = ? AND is_completed = 1"
      const [results] = await Database.query(query, [id_user])
      response.status(201).json({ data: results })
    } catch (error) {
      console.log(error)
      response.status(400).json({ msg: "Data is not found" })
    }
  },

  getTodoById: async (request, response) => {
    try {
      const { id_todo } = request.params
      const query = "SELECT * FROM todos WHERE id_todo = ?"
      const [results] = await Database.query(query, [id_todo])
      response.status(201).json({ data: results })
    } catch (error) {
      console.log(error)
      response.status(400).json({ msg: "Data not found" })
    }
  },

  deleteTodo: async (request, response) => {
    try {
      const { id_todo } = request.params
      const query = "DELETE FROM todos WHERE id_todo = ?"
      const [results] = await Database.query(query, [id_todo])
      response.status(201).json({ msg: "ToDo deleted successfully" })
    } catch (error) {
      response.status(400).json({ msg: error })
    }
  },

  deleteTodoByUser: async (request, response) => {
    try {
      const { id_user } = request.params
      const query = "DELETE FROM todos WHERE id_user = ?"
      const [results] = await Database.query(query, [id_user])
      response.status(200).json({ msg: "Sucessfully deleted todo" })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = TodosController