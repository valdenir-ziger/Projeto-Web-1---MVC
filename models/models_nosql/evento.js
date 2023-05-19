const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const randomUUID = require('crypto');

const Evento = Schema({
    id: {
        type: 'UUID',
        default: () => randomUUID(),
    },
    descricao: {
        type: String, 
        required: true 
    },
    datainicio: { 
        type: Date,
        default: Date.now, 
        required: true 
    },
	datafim: { 
        type: Date,
        required: false 
    }
});

module.exports = mongoose.model("Evento", Evento)