const Apresentacao = require('../models/models_nosql/apresentacao');

module.exports = {
    async getCreate(req, res) {
        res.render('apresentacao/apresentacaoCreate');
    },
    async postCreate(req, res) {
        const {nome, ingredientes, preparo} = req.body;
        const imagem = req.imageName;
        console.log(imagem);
        const apresentacao = new Apresentacao({nome, ingredientes, preparo, imagem});
        await apresentacao.save();
        res.redirect('/home');
    },
    async getList(req, res) {
        Apresentacao.find().then((apresentacao) => {
            res.render('apresentacao/apresentacaoList', {apresentacao: apresentacao.map(apresentacao => apresentacao.toJSON())});
        });
    },
    async getEdit(req, res) {
        await Apresentacao.findOne({ _id: req.params.id }).then((apresentacao) => {
            res.render('apresentacao/apresentacaoEdit', { apresentacao: apresentacao.toJSON() });
        });
    },
    async postEdit(req, res) {
        const {nome, ingredientes, preparo} = req.body;
        const imagem = req.imageName;
        console.log(imagem);
        await Apresentacao.findOneAndUpdate({_id:req.body.id}, {nome, ingredientes, preparo,imagem});
        res.redirect('/apresentacaoList');
    },
    async getDelete(req, res) {
        await Apresentacao.findOneAndRemove({ _id: req.params.id });
        res.redirect('/apresentacaoList');
    }
}