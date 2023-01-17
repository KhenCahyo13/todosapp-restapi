const multer = require('multer')
const express = require('express')
const uRouter = express.Router()
const path = require('path')
const fs = require('fs')

const UsersController = require('../controllers/UsersController')

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, './src/profil_image')
    },
    filename: (request, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

uRouter.post('/', upload.single('picture'), UsersController.createUser)
uRouter.get('/', UsersController.getAllUser)
uRouter.get('/:id', UsersController.getUserById)
uRouter.put('/:id_user', UsersController.updateUser)

module.exports = uRouter
