const roteador = require('express').Router({ mergeParams: true })
const Serializador = require('../../../Serializador')
const { SerializadorProduto } = require('../../../Serializador')
const Produto = require('./Produto')
const Tabela = require('./TabelaProduto')

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
        res.status(201).send(serializador.serializar(produto))
    } catch (erro) {
        next(erro)
    }
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
        res.send(serializador.serializar(produto))
    } catch (erro) {
        next(erro)
    }
})

module.exports = roteador