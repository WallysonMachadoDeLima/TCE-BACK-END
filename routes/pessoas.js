const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const validation = require("../middleware/validation");
const PessoasControllers = require("../controllers/pessoas-controller");

// POST
router.post(
  "/",
  login.mandatory,
  validation.existUser,
  (req, res, next) =>
    validation.validateCPf(req, res, next, "Pessoa", "cpf_pes"),
  (req, res, next) =>
    validation.validateEmail(req, res, next, "Pessoa", "email_pes"),
  validation.validateAddress,
  PessoasControllers.postPessoas
);

// GET
router.get("/", login.mandatory, PessoasControllers.getPessoas);

// GET ID
router.get("/:id", login.mandatory, PessoasControllers.getIdPessoas);

// PATHC
router.patch(
  "/:id",
  login.mandatory,
  (req, res, next) =>
    validation.validateCPf(req, res, next, "Pessoa", "cpf_pes"),
  (req, res, next) =>
    validation.validateEmail(req, res, next, "Pessoa", "email_pes"),
  validation.validateAddress,
  PessoasControllers.patchProdutos
);

// DELETE
router.delete("/:id", login.mandatory, PessoasControllers.deleteProdutos);

module.exports = router;
