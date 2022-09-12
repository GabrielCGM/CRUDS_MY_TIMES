const express = require('express'); // IMPORT EXPRESS
const exphbs = require('express-handlebars'); // IMPORT EXPRESS
const server = express(); // INSTANTING EXPRESS
const sql = require('mysql'); // IMPORT MYSQL

// HANDLEBARS
server.engine('handlebars', exphbs.engine())
server.set('view engine','handlebars')

// TEMPLATES
server.use(express.static('templates'))

// JSON
server.use(express.urlencoded({
    extended:true
}))
server.use(express.json())

// CONNECTION
const conn = sql.createPool({
    connectionLimit: 5,
    host:'localhost',
    user:'root',
    password:'',
    database:'nodesql'
})

// ROUTER GET (HOME)
server.get('/', (req, res) =>{
    const query = 'SELECT * FROM futebol'
    conn.query(query, (error, result) =>{
        if(error){
            console.log(error)
        }
        const insert = result
        res.render('home', {insert})
    })
    
})
// ROUTER POST (HOME)
server.post('/', (req, res) => {
    const nome = String(req.body.inputNOME).toUpperCase()
    const liga = String(req.body.inputLIGA).toUpperCase(); 
    const pontos = req.body.inputPONTOS;
    const pos = req.body.inputPOS;
    
    // Preparing the query
    const query = 'INSERT INTO futebol(??, ??, ??, ??) values(?, ?, ?, ?)';
    const insert = ['nome','liga','pontos','pos', nome, liga, pontos, pos];
    conn.query(query, insert, (error) =>{
        if(error){
            console.log(error);
        }
        res.status(200).redirect('/');
    })
    
})

// ROUTER GET (EDIT)
server.get('/editar', (req, res) =>{
    const query = 'SELECT id,nome, liga FROM futebol'
    conn.query(query, (error, result) =>{
        if(error){
            console.log(error)
        }
        const insert = result
        res.render('editar', {insert})
    })
})
// ROUTER POST (EDIT)
server.post('/editar', (req, res) =>{
    const newPontos = req.body.newPONTOS;
    const newPOS = req.body.newPOS;
    const editID = req.body.editarID;
    // Preparing the query
    const query = `UPDATE futebol SET pontos = ?, pos = ? where id = ?`
    const insert = [newPontos, newPOS, editID]
    conn.query(query, insert, (error) =>{
        if(error){
            console.log(error)
        }
        console.log(query, insert)
    })

    res.status(200).redirect('/')
})

// rROUTER GET (/EXCLUIR) --> DELETE
server.get('/excluir', (req, res) =>{
    const query = 'SELECT nome, liga FROM futebol'
    conn.query(query, (error, result) =>{
        if(error){
            console.log(error)
        }
        const insert = result
        res.render('excluir', {insert})
    })
})
//ROUTE POST (/EXCLUIR)--> DELETE 
server.post('/excluir', (req, res) =>{

    const delNOME = req.body.delNOME
    const delLIGA = req.body.delLIGA
    // Preparing the query
    const query = `DELETE FROM futebol WHERE nome =? and liga = ?`
    const insert = [delNOME, delLIGA]
    conn.query(query, insert, (erro) =>{
        if(erro){
            console.log(erro)
        }
        res.status(200).redirect('/')
    })
})

// START SERVE AT PORT 8000
server.listen(8000);

