module.exports = {
    logRegister(req, res, next) {
        console.log(req.url + req.method + new Date())
        next();
    },
    sessionControl(req, res, next) {
        if (req.session.login != undefined)
            next();
        else if ((req.url == '/') && (req.method == 'GET')) 
            next();
        else if ((req.url == '/login') && (req.method == 'POST'))
            next();
        else if ((req.url).split('/')[1].substr(0, 14) == 'recuperarSenha')
            next();
        else if ((req.url).split('/')[1] == 'usuarioCreate')
            next();
        else res.redirect('/');
    }
};