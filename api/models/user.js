const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Por favor, digite um email'],
    unique: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  senha: { type: String, required: [true, 'Por favor, digite uma senha '], minlength: [6, 'A senha tem que ter no mínimo 6 dígitos'] },
});

module.exports = mongoose.model("User", userSchema);
