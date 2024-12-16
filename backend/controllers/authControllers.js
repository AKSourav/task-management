// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create and save the new user
    const user = new User({ email, password });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Exclude the password field from the user object
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res)=>{
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid login credentials');
      }
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      // Exclude the password field from the user object
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
}
const getProfile = async (req, res)=>{
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
      
      if (!user) {
        throw new Error('You are not a user');
      }
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
}

module.exports = { register, login, getProfile};
