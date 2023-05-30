module.exports = {
    logRegister(req, res, next) {
        console.log('Url: ' + req.url + ' - Método: ' + req.method + ' - Data: ' + new Date())
        next();
    },
    sessionControl(req, res, next) {
        if (req.session.login != undefined){
            res.locals.user            = req.session.user;
            res.locals.isAdministrador = (req.session.tipo == 0);
            res.locals.isVotante       = (req.session.tipo == 2 || req.session.tipo == 1 || req.session.tipo == 0);
            res.locals.isCandidato     = (req.session.tipo == 2 || req.session.tipo == 0);
            next();
        }
        else if ((req.url == '/') && (req.method == 'GET')) 
            next();
        else if ((req.url == '/login') && (req.method == 'POST'))
            next();
        else if ((req.url).split('/')[1] == 'usuarioCreate')
            next();
        else res.redirect('/');
    }
};