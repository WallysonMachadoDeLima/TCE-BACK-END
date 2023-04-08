const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Import routes
const routeUsuarios = require("./routes/usuarios");
const routePessoas = require("./routes/pessoas");
const routeIntegracoes = require("./routes/integracoes");

// Configs
app.use(morgan("dev")); // Logs
app.use(bodyParser.urlencoded({ extended: false })); // Simple data
app.use(bodyParser.json()); // Setting JSON format
app.use((req, res, next) => {
  // Header permissions
  res.header("Access-Controll-Allw-Origin", "*");
  res.header(
    "Access-Controll-Allow-Header",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  );
  if (req.method == "OPTIONS") {
    // Setting CORS
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }

  next();
});

// Routes
app.use("/usuarios", routeUsuarios);
app.use("/pessoas", routePessoas);
app.use("/integracao", routeIntegracoes);

// Routes not found
app.use((req, res, next) => {
  const erro = new Error("Não encontrado");
  erro.status = 404;
  next(erro);
});

// Unidentified error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});
module.exports = app;
