const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Evento = Schema({
    id: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId()
    },
    nome: {
        type: String, 
        required: true 
    },
    descricao: {
        type: String, 
        required: true 
    },
    data_inicio: { 
        type: Date,
        default: Date.now, 
        required: true 
    },
    data_inicio_exibicao: { 
        type: String,
        required: true 
    },
	data_fim: { 
        type: Date,
        required: false 
    },
	data_fim_exibicao: { 
        type: String,
        required: false 
    },
    excluido: { 
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model("Evento", Evento)