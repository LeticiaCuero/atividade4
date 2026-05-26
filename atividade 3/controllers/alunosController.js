const alunos = require('../models/alunos');

exports.obterTodos = async (req, res) => {
    return res.json(alunos);
};

exports.obterPorRa = async (req, res) => {
    const aluno = alunos.find((item) => item.ra === req.params.ra);

    if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    return res.json(aluno);
};

exports.obterDisciplinas = async (req, res) => {
    const aluno = alunos.find((item) => item.ra === req.params.ra);

    if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    return res.json(aluno.disciplinas);
};

exports.atualizar = async (req, res) => {
    const aluno = alunos.find((item) => item.ra === req.params.ra);

    if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const { nome, disciplinas } = req.body;

    if (nome !== undefined) {
        aluno.nome = nome;
    }

    if (disciplinas !== undefined) {
        aluno.disciplinas = disciplinas;
    }

    return res.json(aluno);
};
