const ModeloTabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')

ModeloTabela.sync()
    .then(() => console.log('Tabela criada com sucesso'))
    .catch((err) => console.log(err))