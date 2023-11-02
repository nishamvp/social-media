import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile,
      impressions,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, firstName } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "No User Found,Please Register" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    // create and sign token
    const token = jwt.sign(
      {
        userId: user._id,
        email,
        firstName,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("jwtoken", token, { httpOnly: true });
    delete user.password;
    res.status(200).json({user,token});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
