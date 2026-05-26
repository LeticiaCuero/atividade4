const express = require('express');
const alunosRouter = require('./routes/alunosRouter');
const alunosModel = require('./models/alunos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/alunos', alunosRouter);

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        },
        body: JSON.stringify(body),
    };
}

function tratarErro(error) {
    if (error.message === 'Aluno não encontrado' || error.message === 'Aluno nÃ£o encontrado') {
        return json(404, { error: error.message });
    }

    return json(500, { error: error.message });
}

function obterPartesDaRota(event) {
    return event.path
        .replace('/.netlify/functions/app', '')
        .replace(/^\/alunos/, '')
        .split('/')
        .filter(Boolean)
        .map(decodeURIComponent);
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return json(204, {});
    }

    const partes = obterPartesDaRota(event);

    try {
        if (event.httpMethod === 'GET' && partes.length === 0) {
            const alunos = await alunosModel.obterTodos();
            return json(200, alunos);
        }

        if (event.httpMethod === 'GET' && partes.length === 1) {
            const aluno = await alunosModel.obterPorRa(partes[0]);
            return json(200, aluno);
        }

        if (event.httpMethod === 'GET' && partes.length === 2 && partes[1] === 'disciplinas') {
            const disciplinas = await alunosModel.obterDisciplinas(partes[0]);
            return json(200, disciplinas);
        }

        if (event.httpMethod === 'PUT' && partes.length === 1) {
            const dados = event.body ? JSON.parse(event.body) : {};
            const aluno = await alunosModel.atualizar(partes[0], dados);
            return json(200, aluno);
        }

        return json(404, { error: 'Rota não encontrada' });
    } catch (error) {
        return tratarErro(error);
    }
};

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta: ${PORT}`);
    });
}
