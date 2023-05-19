const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const Apresentacao = Schema({
    id: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId()
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
        required: true 
    },
	participante2: { 
        type: String, 
        lowercase: true, 
        trim: true, 
        required: false 
    },
	participante3: { 
        type: String, 
        lowercase: true, 
        trim: true, 
        required: false 
    },
    participante4: {
        type: String,
        lowercase: true, 
        trim: true,  
        required: false 
    },
    participante5: { 
        type: String,
        lowercase: true, 
        trim: true,  
        required:false
    },
    participante6: { 
        type: String, 
        lowercase: true, 
        trim: true, 
        required:false
    }
});

module.exports = mongoose.model("Apresentacao", Apresentacao)