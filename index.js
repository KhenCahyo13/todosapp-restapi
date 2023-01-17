const express = require('express')
const app = express()
const path = require('path')

require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "src")))

const uRouter = require('./routes/UserRouter')
const tRouter = require('./routes/TodosRouter')

app.get('/', (request, response) => {
    response.status(200).json({ msg: "Welcome to TodoApp RestAPI" })
})
app.use('/todoapp/users', uRouter)
app.use('/todoapp/todo', tRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("Server running on port " + process.env.PORT + " ....")
})