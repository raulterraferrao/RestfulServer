const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Por favor, digite um email"],
    unique: [true, "teste"],
    lowercase: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "Por favor, digite um email válido",
    ],
  },
  senha: {
    type: String,
    required: [true, "Por favor, digite uma senha "],
    minlength: [6, "A senha tem que ter no mínimo 6 dígitos"],
  },
});

// fire a functions before a doc is saved
//the "this" variable is the doc before saved in db
userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
})

userSchema.statics.login = async function(email, senha){
  
  const user = await this.findOne({email});

  if(user){
    const auth = await bcrypt.compare(senha, user.senha);
    if(auth){
        return user;
    }
      throw Error('senha incorreta')
    }
    throw Error('email incorreto')
}
module.exports = mongoose.model("User", userSchema);
