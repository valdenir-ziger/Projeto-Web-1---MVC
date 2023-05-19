const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Evento = Schema({
    id: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId()
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