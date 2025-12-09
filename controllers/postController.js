const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content
    });
    await post.save();
    await post.populate("user", "username");

    res.json(post); 
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", "username email") 
    .populate("comments.user", "username"); 

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json(post);
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Not allowed" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.user.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not allowed" });

    comment.deleteOne();

    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};