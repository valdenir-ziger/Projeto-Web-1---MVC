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
    nome: { 
        type: String,
        trim: true, 
        default: "Sem Nome",
        required: true 
    },
	tipo: { // 0 - Administrador, 1 - Ouvinte/Votante, 2 - Candidato
        type: Number,
        min: 0, 
        max: 2, 
        default: 1
    },
    tipo_descricao: { 
        type: String,
        trim: true, 
        default: "Ouvinte/Votante",
        required: true 
    },
    excluido: { 
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model("Usuario", Usuario)