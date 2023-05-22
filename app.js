const db_mongoose  = require('./config/db_mongoose');
const routes       = require('./routers/route');
const mongoose     = require('mongoose');
const handlebars   = require('express-handlebars');
var   cookieParser = require('cookie-parser');
var   session      = require('express-session');
const middlewares  = require('./middlewares/middlewares');
const express      = require('express');
const app          = express();
const path         = require('path');
//Execute npm init -y para gerar um pacote e automaticamente e aceitar todos os padrões.

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 
app.use(session({secret:'valdenirziger',
                 resave: true,
                 saveUninitialized:true, 
                 cookie:{maxAge: 1000 * 60 * 100}}));
app.engine('handlebars', handlebars.engine({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.logRegister,middlewares.sessionControl)
app.use(routes);

mongoose.connect(db_mongoose.connection, {useUnifiedTopology:true, useNewUrlParser:true}).then(()=>{
    console.log('Conectado em: mongodb+srv://valdenir:1234@clusterutfpr.2k7tc1v.mongodb.net/');
}).catch((error) =>{
    console.error('Erro ao conectar ao banco de dados:', error);
});

app.use(express.urlencoded({extended:true}))

app.listen(8080,function(){
    console.log("Servidor executando no link http://localhost:8080")
});