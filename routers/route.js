const express = require('express');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerReceita = require('../controllers/controllerReceita');
const multer = require('multer');
const route = express.Router();

module.exports = route;

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
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/recuperarSenha/:login", controllerUsuario.getRecuperarSenha);
route.post("/recuperarSenha", controllerUsuario.postRecuperarSenha);
//Usuario - CRUD
route.get("/usuarioCreate", controllerUsuario.getCreate);
route.post("/usuarioCreate", controllerUsuario.postCreate);
route.get("/usuarioList", controllerUsuario.getList);

//Controller Receita
//Receita-CRUD
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate",upload.single('imagem'),controllerReceita.postCreate);
route.get("/receitaList", controllerReceita.getList);
route.get("/receitaEdit/:id", controllerReceita.getEdit);
route.post("/receitaEdit",upload.single('imagem'),controllerReceita.postEdit);
route.get("/receitaDelete/:id", controllerReceita.getDelete);