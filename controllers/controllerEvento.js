const Evento = require('../models/models_nosql/evento');
const moment = require('moment');

module.exports = {
    async getCreate(req, res) {
        res.render('evento/eventoCreate');
    },
    async postCreate(req, res) {
        var {nome, descricao, data_inicio, data_inicio_exibicao, data_fim, data_fim_exibicao} = req.body;

        data_inicio_exibicao = moment(data_inicio).format('DD/MM/YYYY');
        data_fim_exibicao    = moment(data_fim).format('DD/MM/YYYY');

        const evento = new Evento({nome, descricao, data_inicio, data_inicio_exibicao, data_fim, data_fim_exibicao});
        await evento.save().catch((err) => {
            console.log(err); 
        });
        res.redirect('/home');
    },
    async getList(req, res) {
        Evento.find().then((eventos) => {
            res.render('evento/eventoList', {eventos: eventos.map(eventos => eventos.toJSON())});
        });
    },
    async getEdit(req, res) {
        await Evento.findOne({ _id: req.params.id}).then((eventos) => {
            res.render('evento/eventoEdit', { eventos: eventos.toJSON(), 
                                              dataTermino : moment(eventos.data_fim).format('DD/MM/YYYY')});
        });
    },
    async postEdit(req, res) {
        var {data_fim, data_fim_exibicao} = req.body;
        data_fim_exibicao = moment(data_fim).format('DD/MM/YYYY');
        await Evento.findOneAndUpdate({_id:req.body.id}, {data_fim, data_fim_exibicao});
        res.redirect('/eventoList');
    },
    async getDelete(req, res) {
        await Evento.findOneAndRemove({ _id: req.params.id});
        res.redirect('/eventoList');
    }
}