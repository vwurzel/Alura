const pessoas = require('./pessoasRoute')
const niveis = require('./niveisRoute')
const turmas = require('./turmasRoute')

module.exports = app => {
 app.use(
   pessoas,
   niveis,
   turmas
   )
 }
