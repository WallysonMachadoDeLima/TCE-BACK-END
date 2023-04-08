const express = require("express");
const router = express.Router();
const IntegracoesControllers = require("../controllers/integracoes-controller");

// GET
router.get("/geradorCpf", IntegracoesControllers.getGenerationCpf);

router.get("/consultaCep/:cep", IntegracoesControllers.getConsultCep);

module.exports = router;
