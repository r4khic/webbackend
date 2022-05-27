const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middleware/is-auth");

router.get("/", adminController.getProducts);

router.get("/add", isAuth, adminController.getAddProduct);
router.post("/add", isAuth, adminController.postAddProduct);
router.get("/edit/:productId", isAuth, adminController.getEditProduct);
router.post("/edit", isAuth, adminController.postEditProduct);
router.post("/delete", isAuth, adminController.postDeleteProduct);

module.exports = router;
