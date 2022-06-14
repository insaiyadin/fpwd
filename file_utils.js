const {
    readFile,
    writeFile
} = require('fs/promises')

const getFileContent = async fileName => {
    const fileContent = await readFile(fileName, {
        encoding: 'utf-8'
    })
    return JSON.parse(fileContent)
}

const saveFileContent = async (fileName, data) => {
    await writeFile(fileName, JSON.stringify(data))
}

module.exports = {
    getFileContent,
    saveFileContent
}