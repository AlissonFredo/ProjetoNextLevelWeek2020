const express = require("express")
const server = express()

//pegar banco de dados
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))

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

server.post("/savepoint", (req, res) =>{

    //REQ.BODY: O CORPO DO NOSSO FORMULARIO
    //console.log(req.body)

    //inserir dados no banco de dados
    const query = `INSERT INTO places (
        name,
        image,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);`

    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ] 

    function afterInsertData (err){
        if(err){
            return console.log(err)
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
})

//caminho da aplicacão
server.get("/search", (req, res) =>{

    const search = req.query.search

    if(search == ""){
        return res.render("search-results.html", {total: 0}) 
    }

//pegar os dados do banco de dados
//consultar os dados da tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows){
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