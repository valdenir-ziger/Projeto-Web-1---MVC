const Votacao = require('../models/models_nosql/votacao');

module.exports = {
    async getCreate(req, res) {
        res.render('votacao/votacaoCreate');
    },
    async postCreate(req, res) {
        const {nome, ingredientes, preparo} = req.body;
        const imagem = req.imageName;
        console.log(imagem);
        const votacao = new Votacao({nome, ingredientes, preparo, imagem});
        await votacao.save();
        res.redirect('/home');
    },
    async getList(req, res) {
        if (req.session.tipo == 0){//administrador
            Votacao.find().then((votacao) => {
                res.render('votacao/votacaoList', {votacao: votacao.map(votacao => votacao.toJSON())});
            });
        }
        else{
            Votacao.find({excluido: false}).then((votacao) => {
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
        const {nome, ingredientes, preparo} = req.body;
        const imagem = req.imageName;
        console.log(imagem);
        await Votacao.findOneAndUpdate({_id:req.body.id}, {nome, ingredientes, preparo,imagem});
        res.redirect('/votacaoList');
    },
    async getDelete(req, res) {
        //await Votacao.findOneAndRemove({ _id: req.params.id });
        var excluido = true;
        await Votacao.findOneAndUpdate({ _id: req.params.id }, {excluido});
        res.redirect('/votacaoList');
    }
}