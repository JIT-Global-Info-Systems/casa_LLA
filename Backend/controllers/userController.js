const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendUserCredentials } = require("../utils/mail");
const { generateTempPassword } = require("../utils/password");

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      phone_number,
      status,
      created_by
    } = req.body;

    // Basic validation
    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Name, email and role are required"
      });
    }

    // Check email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // 1️⃣ SEND EMAIL FIRST
    await sendUserCredentials(email, name, tempPassword);

    // 2️⃣ HASH PASSWORD ONLY AFTER EMAIL SUCCESS
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3️⃣ CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone_number,
      status: status || "active",
      created_by
    });

    return res.status(201).json({
      message: "User created successfully and credentials emailed",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "User creation failed. Email was not sent.",
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, phone_number, status } = req.body;

    // logged-in user (from JWT middleware)
    const updatedBy = req.user._id;

    // 1️⃣ Check user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 2️⃣ Update ONLY allowed fields
    if (name !== undefined) user.name = name;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (status !== undefined) user.status = status;

    // 3️⃣ Update audit fields
    user.updated_by = updatedBy;
    user.updated_at = new Date();

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        user_id: user._id,
        name: user.name,
        phone_number: user.phone_number,
        status: user.status,
        updated_by: user.updated_by,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // exclude password
      .sort({ created_at: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users: users.map(user => ({
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at
      }))
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const deletedBy = req.user.user_id;

    // 1️⃣ Find user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 2️⃣ Check if already inactive
    if (user.status === "inactive") {
      return res.status(200).json({
        message: "User is already inactive"
      });
    }

    // 3️⃣ Soft delete
    user.status = "inactive";
    user.updated_by = deletedBy;
    user.updated_at = new Date();

    await user.save();

    res.status(200).json({
      message: "User deactivated successfully"
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const mongoose = require("mongoose");

exports.getUserById = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        message: "Invalid user id"
      });
    }

    const user = await User.findOne({
      _id: user_id,
      status: "active"
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user
    });

  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({
      message: "Failed to fetch user",
      error: error.message
    });
  }
};
