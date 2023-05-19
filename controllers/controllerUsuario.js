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
        res.render('usuario/usuarioCreate', { layout: 'noMenu.handlebars'});
    },
    async postCreate(req, res) {
        //if(req.session.login == undefined){
        //    res.redirect('usuario/login');
        //}else{
            const {nome, login, senha, pergunta_secreta, resposta_pergunta} = req.body;
            const usuario = new Usuario({nome, login, senha, pergunta_secreta, resposta_pergunta});
            await usuario.save().catch((err) => {
                console.log(err); 
            });
            res.redirect('/home');
        //}
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
    }
}   