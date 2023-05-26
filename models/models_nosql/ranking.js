const { Decimal128 } = require('bson');
const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Ranking = Schema({
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
	nota: { 
        type: Number,
        required: true 
    },
    votos: { 
        type: Number,
        required: true 
    },
    media_final: { 
        type: Number,
	    default: 0,
        required: true 
    },
});

module.exports = mongoose.model("Ranking", Ranking)