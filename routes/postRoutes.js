const router = require("express").Router();
const { verify, verifyNotAdmin } = require("../auth");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment
} = require("../controllers/postController");

router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", verify, verifyNotAdmin, createPost);
router.put("/:id", verify, verifyNotAdmin, updatePost);
router.post("/:id/comments", verify, verifyNotAdmin, addComment);

router.delete("/:id", verify, deletePost);
router.delete("/:postId/comments/:commentId", verify, deleteComment);

module.exports = router;