const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const { SerializadorFornecedor } = require('../../Serializador')

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.send(serializador.serializar(resultados))
})

roteador.post('/', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        res.status(201)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.send(serializador.serializar(fornecedor))
    } catch (erro) {
        next(erro)
    }
})

roteador.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        res.status(200)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['email', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.send(serializador.serializar(fornecedor))
    } catch (erro) {
        next(erro)
    }
})

roteador.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

roteador.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

const roteadorProdutos = require('./produtos')

const verificarFornecedor = async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        next()
    } catch (erro) {
        next(erro)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador