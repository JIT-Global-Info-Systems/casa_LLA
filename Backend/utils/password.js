const crypto = require("crypto");

exports.generateTempPassword = () => {
  return crypto.randomBytes(5).toString("hex"); // strong & random
};
