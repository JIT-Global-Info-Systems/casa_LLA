const bcrypt = require("bcrypt");
const User = require("../models/user");
const Access = require("../models/Access");
const { generateToken } = require("../utils/jwt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3️⃣ Check status
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account is inactive"
      });
    }

    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 5️⃣ Get access details for the user's role
    const accessDetails = await Access.findOne({ role: user.role });
    
    // 6️⃣ Generate JWT
    const token = generateToken(user);

    // 7️⃣ Prepare user data for response
    const userData = {
      user_id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      access: accessDetails ? accessDetails.page_names : []
    };

    // 8️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



