const Usuario = require('../models/models_nosql/usuario');

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
        await Usuario.findOne({login: req.body.login, 
                               senha: req.body.senha}).then((usuarios) => {
            if (usuarios != null) {
                req.session.login = req.body.login;
                res.redirect('/home');
            }

            if (req.session.login == undefined) {
                res.redirect('usuario/login');
            }
        });
    },
    async getRecuperarSenha(req, res) {
        await Usuario.find({login: req.params.login}).then((usuarios) => {
            res.render('usuario/recuperarSenha', {
                    layout: 'noMenu.handlebars', 
                    login: req.params.login, 
                    pergunta: usuarios[0].pergunta_secreta});
        });

    },
    async postRecuperarSenha(req, res) {
        Usuario.find({login:             req.body.login, 
                      pergunta_secreta:  req.body.pergunta,
                      resposta_pergunta: req.body.resposta}).then(usuarios => {
            if (usuarios.length > 0) {
                res.render('usuario/senhaRecuperada', { layout: 'noMenu.handlebars', senha: usuarios[0].senha });
            }
            else {
                res.redirect('/home');
            }
        });
    },
    async getCreate(req, res) {
        //res.render('usuario/usuarioCreate', { layout: 'noMenu.handlebars'});
        res.render('usuario/usuarioCreate');
    },
    async postCreate(req, res) {
        const {nome, login, senha, pergunta_secreta, resposta_pergunta} = req.body;
        const usuario = new Usuario({nome, login, senha, pergunta_secreta, resposta_pergunta});
        if (usuario.tipo == 0){
            usuario.tipo_descricao = "Administrador";
        }
        else if (usuario.tipo == 1) {
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
            Usuario.find().then((usuarios) => {
                res.render('usuario/usuarioList', { usuarios: usuarios.map(usuarios=> usuarios.toJSON())});
            }).catch((err) => {
                console.log(err); 
                res.redirect('/home')
            });
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
            var {nome, senha, pergunta_secreta, resposta_pergunta, tipo, tipo_descricao} = req.body;
            if (tipo == 0){
                tipo_descricao = "Administrador";
            }
            else if (tipo == 1) {
                tipo_descricao = "Ouvinte/Votante";
            }
            else{
                tipo_descricao = "Candidato";
            }

            await Usuario.findOneAndUpdate({_id:req.body.id}, {nome, senha, pergunta_secreta, resposta_pergunta, tipo, tipo_descricao});
            res.redirect('/usuarioList');
        }
    },
    async getDelete(req, res) {
        if(req.session.login == undefined){
            res.redirect('usuario/login');
        }else{
            await Usuario.findOneAndRemove({ _id: req.params.id });
            res.redirect('/usuarioList');
        }
    }
}   