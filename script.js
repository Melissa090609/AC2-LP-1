const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3001;
const experimentosPath = path.join(__dirname, 'experimentos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let experimentosData = fs.readFileSync(experimentosPath, 'utf-8');
let experimentos = JSON.parse(experimentosData);

function salvarDados() {
    fs.writeFileSync(experimentosPath, JSON.stringify(experimentos, null, 2));
}

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.get('/adicionar-experimento', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/adicionar-experimento.html'));
});

app.post('/adicionar-experimento', (req, res) => {
    const novoExperimento = req.body;
    
    if (experimentos.find(exp => exp.nomeExperimento.toLowerCase() === novoExperimento.nomeExperimento.toLowerCase())) {
        res.send('<h1>Esse experimento já existe. Não é possível adicionar duplicatas.</h1>');
        return;
    }
    
    experimentos.push(novoExperimento);
    salvarDados();
    
    res.send('<h1>Experimento adicionado com sucesso!</h1> <br><a href="/adicionar-experimento">Adicionar Experimentos</a><br><a href="/buscar-experimento">Buscar por Experimentos</a><br><a href="/categoria-experimento">Buscar por Categoria</a>');
});

function buscarExperimentoPorNome(nome) {
    return experimentos.find(exp => exp.nomeExperimento.toLowerCase() === nome.toLowerCase());
}

app.get('/buscar-experimento', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/buscar-experimento.html'));
});

app.post('/buscar-experimento', (req, res) => {
    const nomeExperimentoBuscado = req.body.nomeExperimento;
    const experimentoEncontrado = buscarExperimentoPorNome(nomeExperimentoBuscado);
    
    if (experimentoEncontrado) {
        res.send(`<h1>Experimento encontrado:</h1> <pre>${JSON.stringify(experimentoEncontrado, null, 2)}</pre> <br><a href="/adicionar-experimento">Adicionar Experimentos</a><br><a href="/buscar-experimento">Buscar por Experimentos</a><br><a href="/categoria-experimento">Buscar por Categoria</a>`);
    } else {
        res.send('<h1>Experimento não encontrado.</h1> <br><a href="/adicionar-experimento">Adicionar Experimentos</a><br><a href="/buscar-experimento">Buscar por Experimentos</a><br><a href="/categoria-experimento">Buscar por Categoria</a>');
    }
});

function buscarExperimentoPorCategoria(nome) {
    let categoriaExperimentos = "";
    experimentos.forEach(exp => {
        if (exp.categoria.toLowerCase() === nome.toLowerCase()) {
            categoriaExperimentos += `${JSON.stringify(exp, null, 2)}\n`;
        }
    });
    return categoriaExperimentos;
}

app.get('/categoria-experimento', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/categoria-experimento.html'));
});

app.post('/categoria-experimento', (req, res) => {
    const nomeCategoriaBuscada = req.body.categoria;
    const categoriaExperimentos = buscarExperimentoPorCategoria(nomeCategoriaBuscada);
    
    if (categoriaExperimentos !== "") {
        res.send(`<h1>Experimentos encontrados:</h1> <pre> ${categoriaExperimentos} </pre> <br><a href="/adicionar-experimento">Adicionar Experimentos</a><br><a href="/buscar-experimento">Buscar por Experimentos</a><br><a href="/categoria-experimento">Buscar por Categoria</a>`);
    } else {
        res.send('<h1>Nenhum experimento encontrado.</h1> <br><a href="/adicionar-experimento">Adicionar Experimentos</a><br><a href="/buscar-experimento">Buscar por Experimentos</a><br><a href="/categoria-experimento">Buscar por Categoria</a>');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/index`);
});
