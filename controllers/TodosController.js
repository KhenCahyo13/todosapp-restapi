const Database = require('../config/Database')

const TodosController = {
    createTodo: async (request, response) => {
        try {
            const { fullname, name, date, description } = request.body
            const query = 'INSERT INTO todos (fullname, name, date, description) VALUES (?, ?, ?)'
            const [result] = await Database.query(query, [fullname, name, date, description])
            response.status(201).json({ msg: "Todo successfully created" }) 
        } catch (error) {
            console.log(error)
            response.status(400).json({ msg: error })
        }
    },

    updateTodo: async (request, response) => {
        try {
            const { fullname, name, date, description } = request.body
            const { id_todo } = request.params
            const query = 'UPDATE todos SET name = ?, date = ?, description = ? WHERE id_todo = ?'
            const [results, fields] = await Database.query(query, [fullname, name, date, description, id_todo])
            response.status(200).json({ msg: "Todo successfully updated" })
        } catch (error) {
            console.log(error)
            response.status(400).json({ msg: error })
        }
    }
}

module.exports = TodosController