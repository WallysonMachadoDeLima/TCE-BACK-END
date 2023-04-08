const mysql = require("../mysql");
const validatorCpf = require("gerador-validador-cpf");
var validatorEmail = require("email-validator");
const consultCep = require("cep-promise");

exports.existUser = async (req, res, next) => {
  try {
    const query = `SELECT * FROM Usuario`;
    const result = await mysql.execute(query);
    if (result && result.length === 0) {
      return res.status(404).send({ error: "Nenhum usuário encontrado" });
    } else {
      const queryExist = `SELECT * FROM Usuario WHERE id_usu = ?`;
      const resultExist = await mysql.execute(queryExist, [req.user.id]);
      if (resultExist && resultExist.length === 0) {
        return res.status(404).send({ error: "Nenhum usuário encontrado" });
      }
    }

    next();
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.validateCPf = async (req, res, next, table, attribute) => {
  try {
    if (req.body.cpf) {
      if (validatorCpf.validate(req.body.cpf) === false) {
        return res.status(400).send({ mensagem: "CPF inválido" });
      }
      const query = `SELECT * FROM ${table} WHERE ${attribute} = ?`;
      const result = await mysql.execute(query, [req.body.cpf]);
      if (result && result.length > 0) {
        return res.status(409).send({ mensagem: "CPF já cadastrado" });
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.validateEmail = async (req, res, next, table, attribute) => {
  try {
    if (req.body.email) {
      if (validatorEmail.validate(req.body.email) === false) {
        return res.status(400).send({ mensagem: "Email inválido" });
      }
      const query = `SELECT * FROM ${table} WHERE ${attribute} = ?`;
      const result = await mysql.execute(query, [req.body.email]);
      if (result && result.length > 0) {
        return res.status(409).send({ mensagem: "Email já cadastrado" });
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.validateAddress = async (req, res, next) => {
  try {
    if (req.body.cep) {
      const address = await consultCep(req.body.cep);
      const addressFields = [
        { field: "estado", value: address.state },
        { field: "cidade", value: address.city },
        { field: "bairro", value: address.neighborhood },
        { field: "logradouro", value: address.street },
      ];

      const invalidField = addressFields.find(
        ({ field, value }) => req.body[field] !== value
      );

      if (invalidField) {
        return res.status(400).send({
          mensagem: `${invalidField.field} Inválido para o CEP inserido`,
        });
      }
    } else {
      const invalidFields = ["estado", "cidade", "bairro", "logradouro"];
      for (let field of invalidFields) {
        if (field in req.body) {
          return res.status(400).send({
            mensagem: `Não é possível inserir o campo ${field} sem informar o CEP`,
          });
        }
      }
    }
    next();
  } catch (error) {
    if (error?.name === "CepPromiseError") {
      return res.status(400).send({ mensagem: "cep inválido" });
    }
    return res.status(500).send({ error: error });
  }
};
