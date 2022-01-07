const { Router } = require("express");
const {
  addNewUser,
  getUserById,
  changeFotoProfile,
  updateInformationUser,
  updateStreetAddress,
  logout,
} = require("../Controller/UserController");
const { uploadsProfile } = require("../Helpers/Multer");
const { validateToken } = require("../Middlewares/ValidateToken");

const router = Router();

router.post("/user/add-new-user", addNewUser);
router.get("/user/get-user-by-id", validateToken, getUserById);
router.put(
  "/user/update-picture-profile",
  [validateToken, uploadsProfile.single("image")],
  changeFotoProfile
);
router.put(
  "/user/update-information-user",
  validateToken,
  updateInformationUser
);
router.put("/user/update-street-address", validateToken, updateStreetAddress);
router.get("/logout", logout);

module.exports = router;
