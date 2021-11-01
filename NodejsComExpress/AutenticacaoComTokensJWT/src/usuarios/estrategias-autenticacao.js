const passport = require('passport')
const bcrypt = require('bcrypt')

const BearerStrategy = require('passport-http-bearer').Strategy
const LocalStrategy = require('passport-local').Strategy

const { InvalidArgumentError } = require('../erros')
const Usuario = require('./usuarios-modelo')
const tokens = require('./tokens')

function verificaUsuario(usuario) {
    if(!usuario) {
        throw new InvalidArgumentError('Usuário não localizado')
    }
}

async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash)

    if(!senhaValida){
        throw new InvalidArgumentError('E-mail ou senha invalidos')
    }
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email)
            verificaUsuario(usuario)
            await verificaSenha(senha, usuario.senhaHash)

            done(null, usuario)

        } catch (erro) {
            done(erro)
        }
    })
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const id = await tokens.access.verifica(token)
                const usuario = await Usuario.buscaPorId(id)
                done(null, usuario, { token: token })
            } catch (erro) {
                done(erro)
            }
        }
    )
)
