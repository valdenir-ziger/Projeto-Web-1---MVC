const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Votacao = Schema({
    id: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId()
    },
    evento: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    apresentacao: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    votante: {// login ou numero da matricula 
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
	datavoto: { 
        type: Date,
        default: Date.now, 
        required: true 
    }
});

module.exports = mongoose.model("Votacao", Votacao)