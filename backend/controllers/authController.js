const pool = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Password validation function
function validatePassword(password) {
  const minLength = 8;
  const uppercasePattern = /[A-Z]/;
  const numberPattern = /[0-9]/;
  const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) {
    return `Password must be longer than ${minLength} characters long.`;
  }
  if (!uppercasePattern.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!numberPattern.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!specialCharacterPattern.test(password)) {
    return 'Password must contain at least one special character.';
  }

  return null; // Valid password
}


exports.signup = async (req, res) => {
  const { username, password } = req.body;

  // Validate the password
  const validationError = validatePassword(password);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const initialBalance = 100000.00;

    const result = await pool.query(
      'INSERT INTO users (username, password, balance, buying_power, created_on) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [username, hashedPassword, initialBalance, initialBalance]
    );

    const userId = result.rows[0].user_id;

    // Create portfolio for user
    await pool.query('INSERT INTO portfolio (user_id) VALUES ($1)', [userId]);

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [user.user_id]);

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
