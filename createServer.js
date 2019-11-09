const fs = require("fs");
const config = require("config");

const TLS = config.get("tls");
const keyFile = "./.keys/cert.key";
const certFile = "./.keys/cert.pem";
const key = fs.existsSync(keyFile) && fs.readFileSync(keyFile);
const cert = fs.existsSync(certFile) && fs.readFileSync(certFile);

process.env.TLS = !(TLS && key && cert) ? "false" : "true";

module.exports = app =>
  TLS && key && cert
    ? require("https").createServer({ key, cert }, app)
    : require("http").createServer(app);
