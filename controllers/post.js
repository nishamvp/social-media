import User from "../models/authModel.js";
import Post from "../models/postModel.js";

// CREATE API
export const createPost = async (req, res) => {
  try {
    
    const { userId,description, picturePath } = req.body;
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
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// UPDATE API
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
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
