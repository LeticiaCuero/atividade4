const alunosModel = require('../models/alunos');

function tratarErro(res, error) {
    if (error.message === 'Aluno não encontrado') {
        return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
}

exports.obterTodos = async (req, res) => {
    try {
        const alunos = await alunosModel.obterTodos();
        return res.json(alunos);
    } catch (error) {
        return tratarErro(res, error);
    }
};

exports.obterPorRa = async (req, res) => {
    try {
        const aluno = await alunosModel.obterPorRa(req.params.ra);
        return res.json(aluno);
    } catch (error) {
        return tratarErro(res, error);
    }
};

exports.obterDisciplinas = async (req, res) => {
    try {
        const disciplinas = await alunosModel.obterDisciplinas(req.params.ra);
        return res.json(disciplinas);
    } catch (error) {
        return tratarErro(res, error);
    }
};

exports.atualizar = async (req, res) => {
    try {
        const aluno = await alunosModel.atualizar(req.params.ra, req.body);
        return res.json(aluno);
    } catch (error) {
        return tratarErro(res, error);
    }
};