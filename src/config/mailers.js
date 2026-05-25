const nodemailer = require('nodemailer');

// Credenciales
const USER_1 = "luistasayco3030@gmail.com";
const PASS_1 = "xkii szmn wopp rqdr";

const USER_2 = "noreply.terraandina@gmail.com"; 
const PASS_2 = "vvkh jkzc vozm jbji"; 

const EMAIL_USER = "noreply.fiestatoursperu@gmail.com";
const EMAIL_PASS = "ztcn lsxw sbwy mktw";

// Transporters
const transporterGeneral = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: USER_1, pass: PASS_1 }
});

const transporterEducativo = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: USER_2, pass: PASS_2 }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

// Keys Turnstile
const SECRET_KEY_TURNSTILE_PERU_LUXURY = "0x4AAAAAADPRDAWehbe_VFhuGTxSXn4SnK4";
const SECRET_KEY_TURNSTILE = "0x4AAAAAACw3a24bV1FooWeaaH8KsZdr_cE";

module.exports = {
  transporterGeneral,
  transporterEducativo,
  transporter,
  SECRET_KEY_TURNSTILE,
  SECRET_KEY_TURNSTILE_PERU_LUXURY,
  EMAIL_USER,
  USER_1,
  USER_2
};