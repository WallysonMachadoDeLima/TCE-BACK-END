const mysql = require("../mysql");

// POST
exports.postPessoas = async (req, res, next) => {
  try {
    const query = `INSERT INTO Pessoa (
        nome_pes, 
        cpf_pes, 
        email_pes,
        dataNascimento_pes,
        telefone_pes,
        nomePai_pes,
        nomeMae_pes,
        responsavel_pes,
        cep_pes,
        estado_pes,
        cidade_pes,
        bairro_pes,
        logradouro_pes,
        numero_pes,
        id_usu_fk
      ) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const requiredFields = [
      "nome",
      "cpf",
      "email",
      "dataNascimento",
      "telefone",
      "nomePai",
      "nomeMae",
      "cep",
      "estado",
      "cidade",
      "bairro",
      "logradouro",
      "numero",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .send({ error: `Campo '${field}' é obrigatório` });
      }
    }

    const result = await mysql.execute(query, [
      req.body.nome,
      req.body.cpf,
      req.body.email,
      req.body.dataNascimento,
      req.body.telefone,
      req.body.nomePai,
      req.body.nomeMae,
      req.body.responsavel ? req.body.responsavel : null,
      req.body.cep,
      req.body.estado,
      req.body.cidade,
      req.body.bairro,
      req.body.logradouro,
      req.body.numero,
      req.user.id,
    ]);
    const response = {
      mensagem: "Pessoa inserida com sucesso",
      pessoa: {
        id: result.insertId,
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        dataNascimento: req.body.dataNascimento,
        telefone: req.body.telefone,
        request: {
          tipo: "GET",
          descricao: "Retorna todas as pessoas",
          url: process.env.URL + "pessoas/",
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

// GET
exports.getPessoas = async (req, res, next) => {
  console.log("passando");
  try {
    let query = `SELECT * FROM Pessoa WHERE id_usu_fk = ?`;
    const search = req.query.search;
    const minSearch = 3;
    if (search.length >= minSearch) {
      query += ` AND nome_pes LIKE '%?%' OR cpf_pes LIKE '%$?%'`;
    }
    const result = await mysql.execute(query, [req.user.id, search, search]);

    const response = {
      quantidade: result.length,
      produto: result.map((pes) => {
        return {
          id: pes.id_pes,
          nome: pes.nome_pes,
          cpf: pes.cpf_pes,
          email: pes.email_pes,
          dataNacimento: pes.dataNascimento_pes,
          telefone: pes.telefone_pes,
          nomePai: pes.nomePai_pes,
          nomeMae: pes.nomeMae_pes,
          responsavel: pes.responsavel_pes,
          cep: pes.cep_pes,
          estado: pes.estado_pes,
          cidade: pes.cidade_pes,
          bairro: pes.bairro_pes,
          logradouro: pes.logradouro_pes,
          numero: pes.numero_pes,
          request: {
            tipo: "GET",
            descricao: "Retorna os detalhes de uma pessoa",
            url: process.env.URL + "pessoas/" + pes.id_pes,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

// GET ID
exports.getIdPessoas = async (req, res, next) => {
  try {
    const query = `SELECT * FROM Pessoa WHERE id_usu_fk = ? AND id_pes = ?`;
    const result = await mysql.execute(query, [req.user.id, req.params.id]);
    if (result.length === 0) {
      return res.status(404).send({ mensagem: "Pessoa não encontrado" });
    }
    const response = {
      produto: {
        id: result[0].id_pes,
        nome: result[0].nome_pes,
        cpf: result[0].cpf_pes,
        email: result[0].email_pes,
        dataNacimento: result[0].dataNascimento_pes,
        telefone: result[0].telefone_pes,
        nomePai: result[0].nomePai_pes,
        nomeMae: result[0].nomeMae_pes,
        responsavel: result[0].responsavel_pes,
        cep: result[0].cep_pes,
        estado: result[0].estado_pes,
        cidade: result[0].cidade_pes,
        bairro: result[0].bairro_pes,
        logradouro: result[0].logradouro_pes,
        numero: result[0].numero_pes,
        request: {
          request: {
            tipo: "GET",
            descricao: "Retorna todas as pessoas",
            url: process.env.URL + "pessoas/",
          },
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

// PATCH
exports.patchProdutos = async (req, res, next) => {
  try {
    let query = `UPDATE Pessoa SET `;
    let values = [];
    let first = true;

    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        if (!first) {
          query += ", ";
        }
        query += key + "_pes" + " = ?";
        values.push(req.body[key]);
        first = false;
      }
    }

    query += ` WHERE id_usu_fk = ? AND id_pes = ?`;

    values.push(req.user.id, req.params.id);

    const result = await mysql.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send({ mensagem: "Pessoa não encontrada" });
    }
    const response = {
      mensagem: "Pessoa Atualizado com sucesso",
    };
    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

// DELTE
exports.deleteProdutos = async (req, res, next) => {
  try {
    const query = "DELETE FROM Pessoa WHERE id_pes = ?";
    const result = await mysql.execute(query, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ mensagem: "Pessoa não encontrada" });
    }
    const response = {
      menssagem: "Pessoa removido com sucesso",
      request: {
        tipo: "POST",
        descricao: "Insere uma pessoa",
        url: process.env.URL + "pessoas/",
      },
    };
    res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
