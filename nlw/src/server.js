const express = require("express")
const server = express()

//pegar banco de dados
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//utilizando template egine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da minha aplicação //pagina inicial //req: Requisição e res: Resposta
server.get("/", (req, res) =>{
    return res.render("index.html")
})

server.get("/create-point", (req, res) =>{
    return res.render("create-point.html")
})

//caminho da aplicacão
server.get("/search", (req, res) =>{

//pegar os dados do banco de dados
//consultar os dados da tabela
    db.all(`SELECT * FROM places`, function (err, rows){
        if(err){
            return console.log(err)
        }

        //total de elementos
        const total = rows.length

        //console.log("Aqui estão seus Registros: ")
        //console.log(rows)

        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})
    })
})

//ligar o servidor
server.listen(5000)