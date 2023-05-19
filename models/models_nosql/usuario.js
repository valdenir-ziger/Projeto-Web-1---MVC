const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Usuario = Schema({
    login: {
        type: String,
        required: true 
    },
    senha: { 
        type: String, 
        required: true 
    },
    pergunta_secreta: {
        type: String, 
        lowercase: true, 
        trim: true,
        required: true 
    },
    resposta_pergunta: { 
        type: String,
        lowercase: true, 
        trim: true, 
        required:true
    },
    nome: { 
        type: String,
        lowercase: true, 
        trim: true, 
        default: "sem nome",
        required: true 
    },
	tipo: { // 0 - Administrador, 1 - Ouvinte/Votante, 2 - Candidato
        type: Number,
        min: 0, 
        max: 2, 
        default: 1
    },
});

module.exports = mongoose.model("Usuario", Usuario)