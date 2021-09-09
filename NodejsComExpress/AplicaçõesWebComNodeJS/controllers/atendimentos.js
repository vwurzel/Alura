const Atendimento = require('../models/atendimentos')

module.exports = app => {
    app.get('/atendimentos', (req, res) => {
        Atendimento.lista()
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => res.status(400).json(erro))
    })

    app.get('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Atendimento.buscaPorId(id)
            .then((resultado) => res.status(200).json(resultado[0]))
            .catch(erro => res.status(400).json(erro))
    })

    app.post('/atendimentos', (req, res) => {
       const atendimento = req.body

        Atendimento.adiciona(atendimento)
            .then(atendimentoCadastrado => res.status(201).json(atendimentoCadastrado))
            .catch(erro => res.status(400).json(erro))
    }) 

    app.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const valores = req.body

        Atendimento.altera(id, valores)
            .then(atendimentoAlterado => res.status(200).json({...valores, id}))
            .catch(erro => res.status(400).json(erro))
    })

    app.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Atendimento.deleta(id)
            .then(res.status(200).json({ id }))
            .catch(res.status(400).json(erro))
    })
}