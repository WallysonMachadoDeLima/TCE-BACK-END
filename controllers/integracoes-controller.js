const mysql = require("../mysql");
const validatorCpf = require("gerador-validador-cpf");
const consultCep = require("cep-promise");

// GET
exports.getGenerationCpf = async (req, res, next) => {
  const response = { cpf: validatorCpf.generate({ format: true }) };
  return res.status(200).send(response);
};

exports.getConsultCep = async (req, res, next) => {
  await consultCep(req.params.cep)
    .then((result) => {
      const response = {
        cep: result.cep,
        estado: result.state,
        cidade: result.city,
        bairro: result.neighborhood,
        logradouro: result.street,
      };
      return res.status(200).send(response);
    })
    .catch((error) => {
      return res.status(400).send({ mensagem: "cep inválido" });
    });
};
