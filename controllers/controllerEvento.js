const Evento        = require('../models/models_nosql/evento');
const Apresentacao  = require('../models/models_nosql/apresentacao');
const moment        = require('moment');

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
        if (req.session.tipo == 0){//administrador
            Evento.find().then((eventos) => {
                res.render('evento/eventoList', {eventos: eventos.map(eventos => eventos.toJSON())});
            });
        }
        else{
            Evento.find({excluido: false}).then((eventos) => {
                res.render('evento/eventoList', {eventos: eventos.map(eventos => eventos.toJSON())});
            });
        }
    },
    async getEdit(req, res) {
        await Evento.findOne({ _id: req.params.id}).then((eventos) => {
            res.render('evento/eventoEdit', { eventos: eventos.toJSON(), 
                                              dataTermino : moment(eventos.data_fim).format('DD/MM/YYYY')});
        });
    },
    async postEdit(req, res) {
        var {data_fim, data_fim_exibicao, excluido} = req.body;
        let currentDate      = new Date();
        let dataEncerramento = new Date(data_fim);
        data_fim_exibicao    = moment(data_fim).format('DD/MM/YYYY');
        excluido             = false;
        if (dataEncerramento < currentDate){
            excluido = true
        }
        await Evento.findOneAndUpdate({_id:req.body.id}, {data_fim, data_fim_exibicao, excluido});

        const apresentacao = await Apresentacao.find();

        if(apresentacao.length > 0){
            for (const apresentacaoAlterada of apresentacao) {
                if(apresentacaoAlterada.id_evento == req.body.id){
                    data_encerramento = dataEncerramento;
                    await Apresentacao.findOneAndUpdate({ _id: apresentacaoAlterada._id}, {data_encerramento, excluido});
                }
            }
        }

        res.redirect('/eventoList');
    },
    async getDelete(req, res) {
        //await Evento.findOneAndRemove({ _id: req.params.id});
        var excluido = true;
        await Evento.findOneAndUpdate({ _id: req.params.id }, {excluido});
        res.redirect('/eventoList');
    }
}