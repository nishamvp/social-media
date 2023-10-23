import User from "../models/authModel.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id);
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends =async (req,res) =>{
    try {
        console.log('getUserFriends')
    } catch (error) {
        res.status(404).json({ message: err.message });
    }
}