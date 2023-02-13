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
                 <a href="https://todoapp-khencahyo13.vercel.app/todoapp/users/${verification_token}">Verify your email in here</a>
          `
        }

        // Send Email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            response.status(500).json({ msg: "Email verification failed to send" })
          } else {
            response.status(201).json({ msg: "Verification email is send to your gmail account" })
          }
        })
      }
    } catch (error) {
      response.status(400).json({ msg: "The email you entered is already registered" })
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

  updatePicture: async (request, response) => {
    try {
      const { id_user } = request.params
      const picture = request.file.filename
      let pictureURL = request.protocol + "://" + request.get("host") + "/profil_image/" + request.file.filename

      const query = "UPDATE users SET picture = ?, url_picture = ? WHERE id_user = ?"
      const [results] = await Database.query(query, [picture, pictureURL, id_user])
      response.status(200).json({ msg: "Picture update successfully" })
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

      // Encrypt Password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Update Data
      if (password !== confPassword) {
        response.status(400).json({ msg: "Password and Password Confirmation must be the same" })
      } else {
        const query = 'UPDATE users SET fullname = ?, email = ?, password = ? WHERE id_user = ?'
        const [result] = await Database.query(query, [fullname, email, hashedPassword, id_user])
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
  },

  loginUser: async (request, response, next) => {
    try {
      const { email } = request.body
      const [results] = await Database.query("SELECT * FROM users WHERE email = ?", [email])
      if (results.length > 0) {
        if (results[0].is_verified === 1) {
          const password = request.body.password
          const compare = bcrypt.compareSync(password, results[0].password)
          if (compare) {
            response.status(200).json({ msg: "Login successfully", data: results })
          } else {
            response.status(400).json({ msg: "Invalid password" })
          }
        } else {
          response.status(400).json({ msg: "Your email is not verified, pliss verified your email to continue" })
        }
      } else {
        response.status(404).json({ msg: "Email not found" })
      }
    } catch (error) {
      console.log(error)
    }
  },

  deleteUser: async (request, response) => {
    try {
      const { id_user } = request.params
      const query = "DELETE FROM users WHERE id_user = ?"
      const [results] = await Database.query(query, [id_user])
      response.status(200).json({ msg: "Account succecssfully deleted" })
    } catch (error) {
      console.log(error)
    }
  },

  forgotPassword: async (request, response) => {
    try {
      const { email } = request.body
      const query = "SELECT * FROM users WHERE email = ?"
      const [results] = await Database.query(query, [email])
      if(results.length > 0) {
        response.status(200).json({ data: results })
      } else {
        response.status(400).json({ msg: "Email is not found in server" })
      }
    } catch (error) {
      console.log(error)
    }
  },

  resetPassword: async (request, response) => {
    try {
      const { id_user } = request.params
      const { password, confPassword } = request.body

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      
      if(password !== confPassword) {
        response.status(400).json({ msg: "Password and Password Confirmation must be the same" })
      } else {
        const query = "UPDATE users SET password = ? WHERE id_user = ?"
        const [results] = await Database.query(query, [hashedPassword, id_user])
        response.status(201).json({ msg: "Password change successfully" })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = UsersController