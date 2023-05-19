const Evento = require('../models/models_nosql/evento');

module.exports = {
    async getCreate(req, res) {
        res.render('evento/eventoCreate');
    },
    async postCreate(req, res) {
        const {nome, ingredientes, preparo} = req.body;
        const imagem = req.imageName;
        console.log(imagem);
        const evento = new Evento({nome, ingredientes, preparo, imagem});
        await evento.save();
        res.redirect('/home');
    },
    async getList(req, res) {
        Evento.find().then((eventos) => {
            res.render('evento/eventoList', {eventos: eventos.map(eventos => eventos.toJSON())});
        });
    },
    async getEdit(req, res) {
        await Evento.findOne({ _id: req.params.id }).then((eventos) => {
            res.render('evento/eventoEdit', { eventos: eventos.toJSON() });
        });
    },
    async postEdit(req, res) {
        const {nome, ingredientes, preparo} = req.body;
        const imagem = req.imageName;
        console.log(imagem);
        await Evento.findOneAndUpdate({_id:req.body.id}, {nome, ingredientes, preparo,imagem});
        res.redirect('/eventoList');
    },
    async getDelete(req, res) {
        await Evento.findOneAndRemove({ _id: req.params.id });
        res.redirect('/eventoList');
    }
}