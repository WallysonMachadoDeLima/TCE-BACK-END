const express = require("express");
const router = express.Router();
const validation = require("../middleware/validation");
const UsuariosControllers = require("../controllers/usuarios-controllers");
// POST
router.post(
  "/cadastro",
  (req, res, next) =>
    validation.validateEmail(req, res, next, "Usuario", "email_usu"),
  UsuariosControllers.cadastrarUsuario
);

// LOGIN
router.post("/login", UsuariosControllers.loginUsuario);

module.exports = router;
