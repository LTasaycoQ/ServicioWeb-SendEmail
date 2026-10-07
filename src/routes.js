const express = require('express');
const router = express.Router();

const { handleCliente } = require('./controllers/cliente'); 
const { handleTerraForm } = require('./controllers/terra');
const { handleEvaluacion } = require('./controllers/evaluacion');
const { handleContact, handleSubscribe } = require('./controllers/luxury');
const { handleFiestaToursPeru, handleFiestaToursPeruBasic } = require('./controllers/fiestatoursperu');

router.post('/cliente', handleCliente);
router.post('/form-terra', handleTerraForm);
router.post('/evaluacion', handleEvaluacion);
router.post('/contact', handleContact);
router.post('/subscribe', handleSubscribe);
router.post('/fiestatoursperu', handleFiestaToursPeru);
router.post('/fiestatoursperu-basic', handleFiestaToursPeruBasic);

module.exports = router;