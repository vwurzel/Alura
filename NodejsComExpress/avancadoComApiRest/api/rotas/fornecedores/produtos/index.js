const roteador = require('express').Router({ mergeParams: true })
const Serializador = require('../../../Serializador')
const { SerializadorProduto } = require('../../../Serializador')
const Produto = require('./Produto')
const Tabela = require('./TabelaProduto')

roteador.options('/', (req, res) => {
    res.set({
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type'
    })
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new SerializadorProduto(res.getHeader('Content-Type'))
    res.send(serializador.serializar(produtos))
})

roteador.post('/', async (req, res, next) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new SerializadorProduto(res.getHeader('Content-Type'))
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set({
            'Etag': produto.versao,
            'Last-Modified': timestamp,
            'Location': `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
        })

        res.status(201).send(serializador.serializar(produto))
    } catch (erro) {
        next(erro)
    }
})

roteador.options('/:id', (req, res) => {
    res.set({
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, HEAD, PUT',
        'Access-Control-Allow-Headers': 'Content-Type'
    })
    res.status(204).end()
})

roteador.delete('/:id', async (req, res) => {
    const dados = {
        id: req.params.id,
        fornecedor: req.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar()

    res.status(204).end()
})

roteador.get('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new SerializadorProduto(res.getHeader('Content-Type'), [
            'preco',
            'estoque',
            'fornecedor',
            'dataCriacao',
            'dataAtualizacao',
            'versao'
        ])
        const timestamp = new Date(produto.dataAtualizacao).getTime()
        res.set({
            'Etag': produto.versao,
            'Last-Modified': timestamp,
            'X-powered-by': 'Gatito'
        })
        res.send(serializador.serializar(produto))
    } catch (erro) {
        next(erro)
    }
})

roteador.head('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        const timestamp = new Date(produto.dataAtualizacao).getTime()
        res.set({
            'Etag': produto.versao,
            'Last-Modified': timestamp
        })
        res.status(200).end()
    } catch (erro) {
        next(erro)
    }
})


roteador.put('/:id', async (req, res, next) => {
    try {
        const dados = Object.assign({}, req.body, {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })
    
        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set({
            'Etag': produto.versao,
            'Last-Modified': timestamp,
            'Location': `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
        })
        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

roteador.options('/:id/diminuir-estoque', (req, res) => {
    res.set({
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
    })
    res.status(204).end()
})

roteador.post('/:id/diminuir-estoque', async (req, res, next) => {
    try {
        const produto = new Produto({
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })
        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set({
            'Etag': produto.versao,
            'Last-Modified': timestamp,
        })
        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

module.exports = roteador