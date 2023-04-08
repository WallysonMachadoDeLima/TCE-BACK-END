const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.cadastrarUsuario = async (req, res, next) => {
  try {
    const queryRepeatEmail = "SELECT * FROM Usuario WHERE email_usu = ?";
    const repeatEmail = await mysql.execute(queryRepeatEmail, [req.body.email]);
    if (repeatEmail.length > 0) {
      return res.status(409).send({ mensagem: "Usuário já cadastrado" });
    }

    const query =
      "INSERT INTO Usuario (nome_usu, email_usu, senha_usu) VALUES (?,?,?)";
    const requiredFields = ["nome", "email", "senha"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .send({ error: `Campo '${field}' é obrigatório` });
      }
    }

    const hash = bcrypt.hashSync(req.body.senha, 10);
    const result = await mysql.execute(query, [
      req.body.nome,
      req.body.email,
      hash,
    ]);
    const response = {
      mensagem: "Usuário criado com secesso",
      usuario: {
        id: result.insertId,
        nome: req.body.nome,
        email: req.body.email,
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.loginUsuario = async (req, res, next) => {
  try {
    const query = "SELECT * FROM Usuario WHERE email_usu = ?";
    const result = await mysql.execute(query, [req.body.email]);

    if (result.length < 1) {
      return res.status(401).send({ mensagem: "Falha na authenticação" });
    }
    bcrypt.compare(
      req.body.senha,
      result[0].senha_usu,
      (errorPassword, resultPassword) => {
        if (errorPassword) {
          return res.status(401).send({ mensagem: "Falha na authenticação" });
        }
        if (resultPassword) {
          const token = jwt.sign(
            {
              id: result[0].id_usu,
              nome: result[0].nome_usu,
              email: result[0].email_usu,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "7d",
            }
          );
          return res.status(200).send({
            mensagem: "Authenticado com sucesso",
            Authorization: "Bearer " + token,
          });
        }
        return res.status(401).send({ mensagem: "Falha na authenticação" });
      }
    );
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
