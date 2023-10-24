import User from "../models/authModel.js";
import Post from "../models/postModel.js";

// CREATE API
export const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      userPicturePath: user.picturePath,
      description,
      picturePath,
      like: {},
      comment: [],
    });
    await newPost.save();
    const post = await Post.find();
    res.status(201).json({ message: "Post Created Successfully..", post });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// READ API
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    res.status(200).json(posts);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const postId = req.params.id;
    const userPost = await Post.findById(postId);
    if (!userPost) {
      res.json("No post found");
    }
    res.status(200).json(userPost);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// UPDATE API
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};
