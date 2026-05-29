const express = require('express');
const router = express.Router();

const { handleCliente } = require('./controllers/cliente'); 
const { handleTerraForm } = require('./controllers/terra');
const { handleEvaluacion } = require('./controllers/evaluacion');
const { handleContact, handleSubscribe } = require('./controllers/luxury');

router.post('/cliente', handleCliente);
router.post('/form-terra', handleTerraForm);
router.post('/evaluacion', handleEvaluacion);
router.post('/contact', handleContact);
router.post('/subscribe', handleSubscribe);

module.exports = router;