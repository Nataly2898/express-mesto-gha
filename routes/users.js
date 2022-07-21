const router = require("express").Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateAvatar,
  updateProfile,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserId);
router.post("/", createUser);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
