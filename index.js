const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parse')

require('dotenv').config()

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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