const alunos = [
    {
        ra: '1',
        nome: 'Joao',
        disciplinas: [
            { codigo: 'MAT101', nome: 'Matematica', professor: 'Prof. Carlos' },
            { codigo: 'HIS101', nome: 'Historia', professor: 'Prof. Ana' },
            { codigo: 'POR101', nome: 'Portugues', professor: 'Prof. Joao' }
        ]
    },
    {
        ra: '2',
        nome: 'Maria',
        disciplinas: [
            { codigo: 'MAT101', nome: 'Matematica', professor: 'Prof. Carlos' },
            { codigo: 'GEO101', nome: 'Geografia', professor: 'Prof. Ana' }
        ]
    },
    {
        ra: '3',
        nome: 'Pedro',
        disciplinas: [
            { codigo: 'CIE101', nome: 'Ciencias', professor: 'Prof. Joao' },
            { codigo: 'EDF101', nome: 'Educacao Fisica', professor: 'Prof. Carlos' }
        ]
    }
];

function clonar(dados) {
    return JSON.parse(JSON.stringify(dados));
}

function encontrarAluno(ra) {
    const aluno = alunos.find((item) => item.ra === ra);

    if (!aluno) {
        throw new Error('Aluno nao encontrado');
    }

    return aluno;
}

function validarDisciplina(disciplina) {
    return disciplina
        && typeof disciplina.codigo === 'string'
        && typeof disciplina.nome === 'string'
        && typeof disciplina.professor === 'string';
}

async function obterTodos() {
    return clonar(alunos);
}

async function obterPorRa(ra) {
    return clonar(encontrarAluno(ra));
}

async function obterDisciplinas(ra) {
    return clonar(encontrarAluno(ra).disciplinas);
}

async function atualizar(ra, dados) {
    const aluno = encontrarAluno(ra);

    if (!dados || typeof dados !== 'object') {
        throw new Error('Dados invalidos');
    }

    if (dados.nome !== undefined) {
        aluno.nome = String(dados.nome).trim();
    }

    if (dados.disciplinas !== undefined) {
        if (!Array.isArray(dados.disciplinas) || !dados.disciplinas.every(validarDisciplina)) {
            throw new Error('Dados invalidos');
        }

        aluno.disciplinas = dados.disciplinas.map((disciplina) => ({
            codigo: disciplina.codigo.trim(),
            nome: disciplina.nome.trim(),
            professor: disciplina.professor.trim()
        }));
    }

    return clonar(aluno);
}

module.exports = {
    obterTodos,
    obterPorRa,
    obterDisciplinas,
    atualizar
};
