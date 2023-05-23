const Apresentacao = require('../models/models_nosql/apresentacao');
const Evento       = require('../models/models_nosql/evento');

module.exports = {
    async getCreate(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            let currentDate = new Date();
            let dataLimite  = new Date('3000-01-01T00:00:00Z');
            Evento.find({excluido: false}).where('data_fim').gt(currentDate).lt(dataLimite).then((eventos) => {
                res.render('apresentacao/apresentacaoCreate', {eventos: eventos.map(eventos => eventos.toJSON())});
            });
        }
    },
    async postCreate(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            var {id_evento, descricao_evento, matricula, musica, participante1, participante2, participante3, participante4, participante5, participante6, data_encerramento} = req.body;
            
            matricula = req.session.login;

            if (participante2 == '') {
                participante2 = undefined;
            }

            if (participante3 == '') {
                participante3 = undefined;
            }

            if (participante4 == '') {
                participante4 = undefined;
            }

            if (participante5 == '') {
                participante5 = undefined;
            }

            if (participante6 == '') {
                participante6 = undefined;
            }

            await Evento.findOne({ _id: id_evento}).then((eventos) => {
                descricao_evento = eventos.nome; 
                data_encerramento = eventos.data_fim;
            });
            
            const apresentacao = new Apresentacao({id_evento, 
                                                   descricao_evento, 
                                                   matricula, 
                                                   musica,  
                                                   participante1, 
                                                   participante2, 
                                                   participante3, 
                                                   participante4, 
                                                   participante5,
                                                   participante6,
                                                   data_encerramento});
            await apresentacao.save().catch((err) => {
                console.log(err); 
            });
            res.redirect('/home');
        }
    },
    async getList(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            if (req.session.tipo == 0){
                Apresentacao.find().then((apresentacao) => {
                    res.render('apresentacao/apresentacaoList', {apresentacao: apresentacao.map(apresentacao => apresentacao.toJSON())});
                });
            }
            else{
                Apresentacao.find({ matricula: req.session.login, excluido: false }).then((apresentacao) => {
                    res.render('apresentacao/apresentacaoList', {apresentacao: apresentacao.map(apresentacao => apresentacao.toJSON())});
                });
            }
            
        }
    },
    async getEdit(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            await Apresentacao.findOne({ _id: req.params.id }).then((apresentacao) => {
                res.render('apresentacao/apresentacaoEdit', { apresentacao: apresentacao.toJSON() });
            });
        }
    },
    async postEdit(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            var {id_evento, musica, participante1, participante2, participante3, participante4, participante5, participante6, data_encerramento, excluido} = req.body;
            excluido = false;
            if (participante2 == '') {
                participante2 = undefined;
            }

            if (participante3 == '') {
                participante3 = undefined;
            }

            if (participante4 == '') {
                participante4 = undefined;
            }

            if (participante5 == '') {
                participante5 = undefined;
            }

            if (participante6 == '') {
                participante6 = undefined;
            }

            Evento.findOne({ _id: id_evento }).then((eventos) => {
                data_encerramento = eventos.data_fim;
            });

            await Apresentacao.findOneAndUpdate({_id:req.body.id}, 
                                                {id_evento, musica, participante1, participante2, participante3, participante4, participante5, participante6, data_encerramento, excluido});
            res.redirect('/apresentacaoList');
        }
    },
    async getDelete(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            //await Apresentacao.findOneAndRemove({ _id: req.params.id });
            var excluido = true;
            await Apresentacao.findOneAndUpdate({ _id: req.params.id }, {excluido});
            res.redirect('/apresentacaoList');
        }
    }
}