console.log('Starting index.js - api gateway');
const http = require('http');
const express = require('express');
const httpProxy = require('express-http-proxy');
const morgan = require('morgan');
const helmet = require('helmet');
const authController = require('../controllers/authController');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
// app.use(cookieParser());

app.post('/login', authController.Login);
app.post('/logout', authController.validateToken, authController.Logout);

const options = {
  timeout: 5000,
  proxyReqPathResolver: (req) => req.originalUrl  // Forward the original request path e evita o erro do proxy passar o caminho faltando a parte que já foi tratada pelo Gateway. o que ocorre é que o GW repassa a url faltando a primeira parte que foi usada para identificar o serviço a ser encaminhado
};

const moviesServiceProxy = httpProxy(process.env.MOVIES_API_URL || '127.0.0.1:3000', options); //sem options vai dar erro de 404 no GET /
const catalogServiceProxy = httpProxy(process.env.CATALOG_API_URL || '127.0.0.1:3001', options);

app.use('/movies', moviesServiceProxy);
// app.use('/cinema', catalogServiceProxy);
app.use('/cities', authController.validateToken, catalogServiceProxy);
// app.use('/catalog', catalogServiceProxy);

app.listen(process.env.MS_GW_PORT || 4000, () => {
  console.log(`API Gateway listening on port ${process.env.MS_GW_PORT || 4000}`);
});

// Health check endpoint

app.get('/status', (req, res) => {
  res.status(200).send('Gateway OK');
});

// Global error handlers for debugging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
