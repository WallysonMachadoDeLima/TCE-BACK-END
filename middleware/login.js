const jwt = require("jsonwebtoken");

exports.mandatory = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({ mensagem: "Falha na autenticação" });
  }
};

exports.optional = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = decode;
    next();
  } catch (error) {
    next();
  }
};
