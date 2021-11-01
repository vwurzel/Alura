const middlewareAutenticacao = require('./middleware-autenticacao');
const usuariosControlador = require('./usuarios-controlador');

module.exports = app => {
  app
    .route('/usuario/atualiza_token')
    .post(middlewareAutenticacao.refresh, usuariosControlador.login)
  app
    .route('/usuario/login')
    .post(middlewareAutenticacao.local, usuariosControlador.login)

  app
    .route('/usuario/logout')
    .post([ middlewareAutenticacao.refresh, middlewareAutenticacao.bearer ], usuariosControlador.logout)
  
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route('/usuario/verifica_email/:token')
    .get(middlewareAutenticacao.verificacaoEmail, usuariosControlador.verificaEmail)

  app
    .route('/usuario/:id')
    .delete(middlewareAutenticacao.bearer, usuariosControlador.deleta);
};
