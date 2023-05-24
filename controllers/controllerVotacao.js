const Votacao       = require('../models/models_nosql/votacao');
const Apresentacao  = require('../models/models_nosql/apresentacao');

module.exports = {
    async getCreate(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            let currentDate = new Date();
            let dataLimite  = new Date('3000-01-01T00:00:00Z');
            Apresentacao.find({excluido: false}).where('data_encerramento').gt(currentDate).lt(dataLimite).then((apresentacao) => {
                if (apresentacao.length > 0) {
                    res.render('votacao/votacaoCreate', {apresentacao: apresentacao.map(apresentacao => apresentacao.toJSON())});
                }
                else {
                    res.redirect('/home');
                }
            });
        }
    },
    async postCreate(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            var {id_evento, descricao_evento, id_apresentacao, descricao_apresentacao, matricula, nota, data_voto}  = req.body;
            await Apresentacao.findOne({ _id: id_apresentacao}).then((apresentacao) => {
                id_evento  = apresentacao.id_evento;
                descricao_evento  = apresentacao.descricao_evento;
                descricao_apresentacao = apresentacao.musica;
            });

            data_voto = new Date();
            matricula = req.session.login;
            const votacao = new Votacao({id_evento, descricao_evento, id_apresentacao, descricao_apresentacao, matricula, nota, data_voto});
            await votacao.save().catch((err) => {
                console.log(err); 
            });
            res.redirect('/home');
        }
    },
    async getList(req, res) {
        if (req.session.tipo == 0){//administrador
            Votacao.find().then((votacao) => {
                res.render('votacao/votacaoListAdmin', {votacao: votacao.map(votacao => votacao.toJSON())});
            });
        }
        else{
            Votacao.find({matricula: req.session.login, excluido: false}).then((votacao) => {       
                res.render('votacao/votacaoList', {votacao: votacao.map(votacao => votacao.toJSON())});
            });
        }
    },
    async getEdit(req, res) {
        await Votacao.findOne({ _id: req.params.id }).then((votacao) => {
            res.render('votacao/votacaoEdit', { votacao: votacao.toJSON() });
        });
    },
    async postEdit(req, res) {
        var {nota, data_voto} = req.body;
        data_voto = new Date();
        await Votacao.findOneAndUpdate({_id:req.body.id}, {nota, data_voto});
        Votacao.find().then((votacao) => {
            res.render('votacao/votacaoListAdmin', {votacao: votacao.map(votacao => votacao.toJSON())});
        });
    },
    async getDelete(req, res) {
        //await Votacao.findOneAndRemove({ _id: req.params.id });
        var excluido = true;
        await Votacao.findOneAndUpdate({ _id: req.params.id }, {excluido});
        Votacao.find().then((votacao) => {
            res.render('votacao/votacaoListAdmin', {votacao: votacao.map(votacao => votacao.toJSON())});
        });
    },
    async getListRanking(req, res) {
        Votacao.find().then((votacao) => {
            res.render('votacao/votacaoRanking', {votacao: votacao.map(votacao => votacao.toJSON())});
        });
    }
}