const express                = require('express');
const controllerUsuario      = require('../controllers/controllerUsuario');
const controllerVotacao      = require('../controllers/controllerVotacao');
const controllerEvento       = require('../controllers/controllerEvento');
const controllerApresentacao = require('../controllers/controllerApresentacao');
const multer                 = require('multer');
const route                  = express.Router();
module.exports               = route;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/")
    },
    filename: (req, file, cb) => {
      req.imageName = req.body.nome+'.png'
      cb(null,  req.imageName)
    },
})

const upload = multer({storage})
route.get("/home",function(req,res){
    res.render('home');
});
route.get("/logout", controllerUsuario.getLogout);

//Controller Usuario
//Usuario - Login e Recuperação de Senha
route.get("/"                     , controllerUsuario.getLogin);
route.post("/login"               , controllerUsuario.postLogin);
route.get("/recuperarSenha/:login", controllerUsuario.getRecuperarSenha);
route.post("/recuperarSenha"      , controllerUsuario.postRecuperarSenha);
//Usuario - CRUD
route.get("/usuarioCreate"    , controllerUsuario.getCreate);
route.post("/usuarioCreate"   , controllerUsuario.postCreate);
route.get("/usuarioList"      , controllerUsuario.getList);
route.get("/usuarioEdit/:id"  , controllerUsuario.getEdit);
route.post("/usuarioEdit"     , controllerUsuario.postEdit);
route.get("/usuarioDelete/:id", controllerUsuario.getDelete);

//Controller Apresentacao
//Apresentacao-CRUD
route.get("/apresentacaoCreate"    , controllerApresentacao.getCreate);
route.post("/apresentacaoCreate"   , upload.single('imagem'),controllerApresentacao.postCreate);
route.get("/apresentacaoList"      , controllerApresentacao.getList);
route.get("/apresentacaoEdit/:id"  , controllerApresentacao.getEdit);
route.post("/apresentacaoEdit"     , upload.single('imagem'),controllerApresentacao.postEdit);
route.get("/apresentacaoDelete/:id", controllerApresentacao.getDelete);

//Controller Evento
//Evento-CRUD
route.get("/eventoCreate"    , controllerEvento.getCreate);
route.post("/eventoCreate"   , upload.single('imagem'),controllerEvento.postCreate);
route.get("/eventoList"      , controllerEvento.getList);
route.get("/eventoEdit/:id"  , controllerEvento.getEdit);
route.post("/eventoEdit"     , upload.single('imagem'),controllerEvento.postEdit);
route.get("/eventoDelete/:id", controllerEvento.getDelete);

//Controller Votacao
//Votacao-CRUD
route.get("/votacaoCreate"    , controllerVotacao.getCreate);
route.post("/votacaoCreate"   , upload.single('imagem'),controllerVotacao.postCreate);
route.get("/votacaoList"      , controllerVotacao.getList);
route.get("/votacaoEdit/:id"  , controllerVotacao.getEdit);
route.post("/votacaoEdit"     , upload.single('imagem'),controllerVotacao.postEdit);
route.get("/votacaoDelete/:id", controllerVotacao.getDelete);