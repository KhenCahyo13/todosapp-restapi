const Database = require('../config/Database')
const bcrypt = require('bcrypt')

const UsersController = {
    createUser: async (request, response) => {
        try {
            // Get Request Value
            const { fullname, email, password, confPassword } = request.body
            const picture = request.file.filename
            // Create URL Picture
            let pictureURL = request.protocol + "://" + request.get("host") + "/profil_image/" + request.file.filename

            // Encrypt Password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Insert Data
            if (password !== confPassword) {
                response.status(400).json({ msg: "Password and Password Confirmation must be the same" })
            } else {
                const query = 'INSERT INTO users (fullname, email, password, picture, url_picture) VALUES (?, ?, ?, ?, ?)'
                const [result] = await Database.query(query, [fullname, email, hashedPassword, picture, pictureURL])
                const addAnn = new Announcement({
                    fullname, email, password, picture, url_picture: request.users.id
                })
                const saveAnn = await addAnn.save()
                response.status(201).json({ saveAnn, msg: "Registration successfully" })
            }
        } catch (error) {
            console.log(error)
            response.status(400).json({ msg: error })
        }
    },

    updateUser: async (request, response) => {
        try {
            // Get Request Value
            const { fullname, email, password, confPassword } = request.body
            const { id_user } = request.params
            const picture = request.file.filename
            // Create URL Picture
            let pictureURL = request.protocol + "://" + request.get("host") + "/profil_image/" + request.file.filename

            // Encrypt Password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Update Data
            if (password !== confPassword) {
                response.status(400).json({ msg: "Password and Password Confirmation must be the same" })
            } else {
                const query = 'UPDATE users SET fullname = ?, email = ?, password = ?, picture = ?, url_picture = ? WHERE id_user = ?'
                const [result] = await Database.query(query, [fullname, email, hashedPassword, picture, pictureURL, id_user])
                response.status(201).json({ msg: "Data successfully updated" })
            }
        } catch (error) {
            console.log(error)
            response.status(400).json({ msg: error })
        }
    },

    getAllUser: async (request, response) => {
        try {
            const [results, fields] = await Database.query("SELECT * FROM users")
            response.status(200).json({ data: results })
        } catch (error) {
            console.log(error)
            response.status(400).json({ msg: error })
        }
    },

    getUserById: async (request, response) => {
        try {
            const { id } = request.params
            const [results, fields] = await Database.query('SELECT * FROM users WHERE id_user = ?', [id])
            response.status(200).json({ data: results })
        } catch (error) {
            console.log(error)
            response.status(400).json({ msg: error })
        }
    }
}

module.exports = UsersController