const Usuario = require('../models/models_nosql/usuario');
const Ranking = require('../models/models_nosql/ranking');

module.exports = {
    async getLogin(req, res) {
        if (req.session.login == undefined) {
            res.render('usuario/login', { layout: 'noMenu.handlebars' });
        }
        else {
            res.redirect('/home');
        }
    },
    async getLogout(req, res) {
        req.session.destroy();
        res.redirect('/');
    },
    async postLogin(req, res) {
        await Usuario.findOne({login   : req.body.login, 
                               senha   : req.body.senha,
                               excluido: false}).then((usuarios) => {
            if (usuarios != null) {
                req.session.login           = req.body.login;
                req.session.user            = usuarios.nome;
                req.session.tipo            = usuarios.tipo;
                req.session.tipo_descricao  = usuarios.tipo_descricao;
                console.log("Usuário " + req.session.login + " acabou de conectar como " + req.session.tipo_descricao + "!"); 
                
                res.redirect('/home');
            }
        });

        if (req.session.login == undefined) {
            res.redirect('usuario/login');
        }
    },
    async getCreate(req, res) {
        res.render('usuario/usuarioCreate');
    },
    async postCreate(req, res) {
        const {nome, login, senha, tipo} = req.body;
        const usuario = new Usuario({nome, login, senha, tipo});
        if (tipo == 0){
            usuario.tipo_descricao = "Administrador";
        }
        else if (tipo == 1) {
            usuario.tipo_descricao = "Ouvinte/Votante";
        }
        else{
            usuario.tipo_descricao = "Candidato";
        }

        await usuario.save().catch((err) => {
            console.log(err); 
        });

        res.redirect('/home');
    },
    async getList(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            if (req.session.tipo == 0){//administrador
                Usuario.find().then((usuarios) => {
                    res.render('usuario/usuarioList', { usuarios: usuarios.map(usuarios=> usuarios.toJSON())});
                }).catch((err) => {
                    console.log(err); 
                    res.redirect('/home');
                });
            }
            else{
                Usuario.find({excluido: false}).then((usuarios) => {
                    res.render('usuario/usuarioList', { usuarios: usuarios.map(usuarios=> usuarios.toJSON())});
                }).catch((err) => {
                    console.log(err); 
                    res.redirect('/home');
                });
            }
        }
    },
    async getEdit(req, res) {
        await Usuario.findOne({ _id: req.params.id }).then((usuarios) => {
            res.render('usuario/usuarioEdit', { usuarios: usuarios.toJSON() });
        });
    },
    async postEdit(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            var {nome, senha, tipo, tipo_descricao, excluido} = req.body;
            excluido = false;
            if (tipo.length > 1){
                //tipo = tipo[0];//Como tava Antes de Alterar
                tipo = tipo[1];//Como ficou depois
            }

            if (tipo == 0){
                tipo_descricao = "Administrador";
            }
            else if (tipo == 1) {
                tipo_descricao = "Ouvinte/Votante";
            }
            else{
                tipo_descricao = "Candidato";
            }

            await Usuario.findOneAndUpdate({_id:req.body.id}, {nome, senha, tipo, tipo_descricao, excluido});
            res.redirect('/usuarioList');
        }
    },
    async getDelete(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            var excluido = true;
            await Usuario.findOneAndUpdate({ _id: req.params.id }, {excluido});
            res.redirect('/usuarioList');
        }
    }
}   