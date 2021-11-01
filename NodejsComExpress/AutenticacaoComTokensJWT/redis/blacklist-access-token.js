const jwt = require('jsonwebtoken')
const redis = require('redis')
const { createHash } = require('crypto')

const blacklist = redis.createClient({ prefix: 'blacklist-access-token:' })
const manipulaLista = require('./manipula-lista')

const manipulaBlacklist = manipulaLista(blacklist)

function geraTokenHash(token) {
    return createHash('sha256').update(token).digest('hex')
}

module.exports = {
    adiciona: async (token) => {
        const dataExpiracao = jwt.decode(token).exp
        const tokenHash = geraTokenHash(token)
        await manipulaBlacklist.adiciona(tokenHash, '', dataExpiracao)
    },

    contemToken: async (token) => {
        const tokenHash = geraTokenHash(token)
        return manipulaBlacklist.contemChave(tokenHash)
    }
}