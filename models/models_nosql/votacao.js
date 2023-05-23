const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Votacao = Schema({
    id_evento: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    descricao_evento: {
        type: String, 
        required: true 
    },
    id_apresentacao: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    descricao_apresentacao: {
        type: String, 
        required: true 
    },
    matricula: {
        type: String, 
        lowercase: true, 
        trim: true,
        required: true 
    },
	nota: { 
        type: Number,
        min: 0, 
        max: 10, 
        required: true 
    },
	data_voto: { 
        type: Date,
        default: Date.now, 
        required: true 
    },
    excluido: { 
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model("Votacao", Votacao)