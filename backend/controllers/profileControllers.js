const User = require('../models/User')

const getProfile = async (req, res) =>{
    const {userId} = req.params;

    const user = await User.findOne({
        _id: userId || req?.user?._id
    }).select("-password");

    return res.json(user);
}

module.exports = {getProfile}