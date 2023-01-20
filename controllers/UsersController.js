const Database = require('../config/Database')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

let testAccount = nodemailer.createTestAccount();
// Nodemailer verification
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "khencahyo02@gmail.com", // generated ethereal user
    pass: 'qojyryonglfatjjr',
  }
});

const UsersController = {
  createUser: async (request, response) => {
    try {
      // Get Request Value
      const { fullname, email, password, confPassword } = request.body
      const picture = request.file.filename
      const verification_token = crypto.randomBytes(16).toString('hex')
      const exp_time = Date.now() + (60 * 60 * 24 * 1000) // 24 Hours
      // Create URL Picture
      let pictureURL = request.protocol + "://" + request.get("host") + "/profil_image/" + request.file.filename

      // Encrypt Password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Insert Data
      if (password !== confPassword) {
        response.status(400).json({ msg: "Password and Password Confirmation must be the same" })
      } else {
        const query = 'INSERT INTO users (fullname, email, password, picture, url_picture, verification_token, exp_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const [result] = await Database.query(query, [fullname, email, hashedPassword, picture, pictureURL, verification_token, exp_time])
        // Send Email Verification to User
        let mailOptions = {
          from: '"Verify your email address" <khencahyo02@gmail.com>',
          to: email,
          subject: 'Todo App -Email Verification',
          html: `<h2>Hi ${fullname}, thanks for registering in Todo App</h2>
                 <h4>Please verify your email to continue in app</h4>
                 <a href="https://${request.headers.host}/todoapp/users/${verification_token}">Verify your email in here</a>
          `
        }

        // Send Email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
          } else {
            response.status(201).json({ msg: "Verification email is send to your gmail account" })
          }
        })

        // response.status(201).json({ msg: "Registration successfully" })
      }
    } catch (error) {
      console.log(error)
      response.status(400).json({ msg: error })
    }
  },

  verifyEmail: async (request, response) => {
    try {
      const { token } = request.params
      const verification_token = null
      const is_verified = true

      const query = "UPDATE users SET is_verified = ?, verification_token = ? WHERE verification_token = ?"
      const [results] = await Database.query(query, [is_verified, verification_token, token])
      response.status(201).json({ msg: "Email has been verified" })
    } catch (error) {
      console.log(error)
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