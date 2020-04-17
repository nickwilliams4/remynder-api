const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('remynder_users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },
  getUserByID(db, id) {
    return db('remynder_users')
      .where('id', id)
      .first();
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('remynder_users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password be longer than 8 characters' })
    }
    if (password.length > 72) {
      return res.status(400).json({ error: 'Password be less than 72 characters' })
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return res.status(400).json({ error: 'Password must not start or end with empty spaces' })
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return res.status(400).json({ error: 'Password must contain one upper case, lower case, number and special character' })
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    }
  },
}

module.exports = UsersService