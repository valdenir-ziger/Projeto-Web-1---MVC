const Votacao       = require('../models/models_nosql/votacao');
const Apresentacao  = require('../models/models_nosql/apresentacao');
const Ranking       = require('../models/models_nosql/ranking');

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

            //Processo de atualização da lista exibida no ranking.
            var novoRanking = true;
            var id_ranking;
            var media_final = 0;
            await Ranking.find().then((ranking) => {
                if(ranking.length > 0){
                    for (const atualizarRanking of ranking) {
                        if(atualizarRanking.id_evento == id_evento && atualizarRanking.id_apresentacao == id_apresentacao){
                            novoRanking = false; 
                            if (atualizarRanking.nota == undefined){
                                atualizarRanking.nota = 0;
                            }
                            nota        = (Number(nota) + atualizarRanking.nota);
                            votos       = (atualizarRanking.votos + 1);
                            media_final = (nota / votos);
                            media_final = media_final.toFixed(1);
                            id_ranking  = atualizarRanking._id;
                            break;
                        }
                    }
                }
                else{
                    novoRanking = true; 
                }
            });

            if(novoRanking){
                votos       = 1;
                media_final = nota;
                var rankingNew = new Ranking({id_evento, descricao_evento, id_apresentacao, descricao_apresentacao, nota, votos, media_final});
                await rankingNew.save().catch((err) => {
                    console.log(err); 
                });  
            }
            else if (id_ranking != undefined){
                await Ranking.findOneAndUpdate({ _id: id_ranking }, {nota, votos, media_final});
            }

            //res.redirect('/home');
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
        }
    },
    async getList(req, res) {
        if (req.session.tipo == 0){//administrador
            Votacao.find().then((votacao) => {
                res.render('votacao/votacaoListAdmin', {votacao: votacao.map(votacao => votacao.toJSON()),
                                                          quantidade: votacao.length});
            });
        }
        else{
            Votacao.find({matricula: req.session.login, excluido: false}).then((votacao) => {
                res.render('votacao/votacaoList', {votacao: votacao.map(votacao => votacao.toJSON()),
                                                   quantidade: votacao.length});
            });
        }
    },
    async getEdit(req, res) {
        await Votacao.findOne({ _id: req.params.id }).then((votacao) => {
            res.render('votacao/votacaoEdit', { votacao: votacao.toJSON() });
        });
    },
    async postEdit(req, res) {
        var {nota, data_voto, excluido} = req.body;
        data_voto = new Date();
        excluido  = false;
        await Votacao.findOneAndUpdate({_id:req.body.id}, {nota, data_voto, excluido});
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
    async getDelete(req, res) {
        //await Votacao.findOneAndRemove({ _id: req.params.id });
        var excluido = true;
        await Votacao.findOneAndUpdate({ _id: req.params.id }, {excluido});
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
    async getListRanking(req, res) {
        Ranking.find().sort({ media_final : -1, votos : -1}).then((ranking) => {
            if (ranking.length > 0) {
                res.render('votacao/votacaoRankingGeral', { ranking: ranking.map(ranking => ranking.toJSON()),
                                                            quantidade: ranking.length} );
            }
        });
    },
    async getListRankingTop10PorNota(req, res) {
        Ranking.find().limit(10).sort({ media_final : -1,  votos : -1}).then((ranking) => {
            if (ranking.length > 0) {
                res.render('votacao/votacaoRankingNota', {ranking: ranking.map(ranking => ranking.toJSON())});
            }
        });
    },
    async getListRankingTop10PorQuantidade(req, res) {
        Ranking.find().limit(10).sort({ votos : -1, media_final : -1}).then((ranking) => {
            if (ranking.length > 0) {
                res.render('votacao/votacaoRankingVoto', {ranking: ranking.map(ranking => ranking.toJSON())});
            }
        });
    }
}