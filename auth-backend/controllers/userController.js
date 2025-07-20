const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate username from email (before @ symbol) or from name
    let username = email.split('@')[0].toLowerCase();
    
    // Check if username already exists, if so, append numbers
    let usernameExists = await User.findOne({ username });
    let counter = 1;
    let originalUsername = username;
    
    while (usernameExists) {
      username = `${originalUsername}${counter}`;
      usernameExists = await User.findOne({ username });
      counter++;
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user with username
    const user = await User.create({ 
      name, 
      email, 
      username,
      password: hashed 
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isMatch = user && await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    token: generateToken(user._id)
  });
};
