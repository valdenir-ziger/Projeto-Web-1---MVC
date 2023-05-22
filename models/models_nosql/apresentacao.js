const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Apresentacao = Schema({
    id: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId()
    },
    id_evento: {
        type: String,
        required: true 
    },
    descricao_evento: {
        type: String,
        required: true 
    },
    matricula: {
        type: String,
        required: true 
    },
    musica : {
        type: String, 
        lowercase: true, 
        trim: true, 
        required: true 
    },
    participante1: { 
        type: String,
        lowercase: true, 
        trim: true,  
        required: false 
    },
	participante2: { 
        type: String, 
        lowercase: true, 
        trim: true, 
        required: false,
        default: undefined
    },
	participante3: { 
        type: String, 
        lowercase: true, 
        trim: true, 
        required: false,
        default: undefined 
    },
    participante4: {
        type: String,
        lowercase: true, 
        trim: true,  
        required: false,
        default: undefined 
    },
    participante5: { 
        type: String,
        lowercase: true, 
        trim: true,  
        required:false,
        default: undefined
    },
    participante6: { 
        type: String,
        lowercase: true, 
        trim: true,  
        required:false,
        default: undefined
    }
});

module.exports = mongoose.model("Apresentacao", Apresentacao)