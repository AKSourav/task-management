const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    }
  }, { timestamps: true });
  
// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
  
  // Password comparison method
userSchema.methods.comparePassword = async function(enteredPassword) {
  console.log("ionside", enteredPassword, this.password)
  const data = await bcrypt.compare(enteredPassword, this.password);
  console.log("compare: ",data)
  return data;
};
  
const User = mongoose.model('User', userSchema);

module.exports = User;