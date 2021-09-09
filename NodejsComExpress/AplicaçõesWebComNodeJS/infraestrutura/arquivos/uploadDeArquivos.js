const fs = require('fs')
const path = require('path')

module.exports = (caminho, nomeDoArquivo, callbackImagemCriada) => {

    const tiposValidos = ['jpg', 'png', 'jpeg']
    const tipo = path.extname(caminho)
    const tipoValido = tiposValidos.indexOf(tipo.substring(1)) !== -1
    const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`

    if(!tipoValido) {
        const erro = 'Tipo é invalido'
        console.log('Tipo invalido')
        callbackImagemCriada(erro)
    } else {
        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(novoCaminho))
            .on('finish', () => callbackImagemCriada(false, novoCaminho))
    }

}