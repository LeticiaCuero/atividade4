const API_BASE_URL = '/alunos';

const estado = {
    alunos: [],
    alunoSelecionado: null
};

const elementos = {
    alerta: document.getElementById('alerta'),
    filtro: document.getElementById('filtro'),
    tabelaAlunos: document.getElementById('tabelaAlunos'),
    detalheRa: document.getElementById('detalheRa'),
    detalheNome: document.getElementById('detalheNome'),
    detalheQtd: document.getElementById('detalheQtd'),
    listaResumoDisciplinas: document.getElementById('listaResumoDisciplinas'),
    disciplinasRa: document.getElementById('disciplinasRa'),
    tabelaDisciplinas: document.getElementById('tabelaDisciplinas'),
    formAluno: document.getElementById('formAluno'),
    editRa: document.getElementById('editRa'),
    editNome: document.getElementById('editNome'),
    camposDisciplinas: document.getElementById('camposDisciplinas'),
    btnAdicionarDisciplina: document.getElementById('btnAdicionarDisciplina'),
    btnAtualizarDetalhes: document.getElementById('btnAtualizarDetalhes')
};

function mostrarAlerta(tipo, mensagem) {
    elementos.alerta.className = `alert alert-${tipo}`;
    elementos.alerta.textContent = mensagem;
}

function limparAlerta() {
    elementos.alerta.className = 'alert d-none';
    elementos.alerta.textContent = '';
}

function escaparHtml(valor) {
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const dados = await response.json().catch(() => null);

    if (!response.ok) {
        const mensagem = dados && dados.error ? dados.error : 'Falha ao consumir a API';
        throw new Error(mensagem);
    }

    return dados;
}

function criarBotao(icone, texto, classe, onClick) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = classe;
    botao.title = texto;
    botao.innerHTML = `<i class="bi ${icone}"></i><span class="d-none d-md-inline ms-1">${texto}</span>`;
    botao.addEventListener('click', onClick);
    return botao;
}

function renderizarAlunos() {
    const filtro = elementos.filtro.value.trim().toLowerCase();
    const alunosFiltrados = estado.alunos.filter((aluno) => {
        return aluno.ra.toLowerCase().includes(filtro) || aluno.nome.toLowerCase().includes(filtro);
    });

    elementos.tabelaAlunos.innerHTML = '';

    if (alunosFiltrados.length === 0) {
        elementos.tabelaAlunos.innerHTML = '<tr><td colspan="3" class="text-center py-4">Nenhum aluno encontrado</td></tr>';
        return;
    }

    alunosFiltrados.forEach((aluno) => {
        const linha = document.createElement('tr');
        const acoes = document.createElement('td');
        acoes.className = 'text-end acoes';

        const btnDetalhes = criarBotao('bi-eye', 'Detalhes', 'btn btn-sm btn-outline-primary me-1', () => selecionarAluno(aluno.ra));
        const btnEditar = criarBotao('bi-pencil', 'Editar', 'btn btn-sm btn-outline-secondary', () => selecionarAluno(aluno.ra, true));

        acoes.append(btnDetalhes, btnEditar);
        linha.innerHTML = `<td>${escaparHtml(aluno.ra)}</td><td>${escaparHtml(aluno.nome)}</td>`;
        linha.appendChild(acoes);
        elementos.tabelaAlunos.appendChild(linha);
    });
}

function renderizarDetalhes(aluno) {
    elementos.detalheRa.textContent = aluno.ra;
    elementos.detalheNome.textContent = aluno.nome;
    elementos.detalheQtd.textContent = aluno.disciplinas.length;
    elementos.listaResumoDisciplinas.innerHTML = '';

    if (aluno.disciplinas.length === 0) {
        elementos.listaResumoDisciplinas.innerHTML = '<li class="list-group-item px-0">Sem disciplinas</li>';
        return;
    }

    aluno.disciplinas.forEach((disciplina) => {
        const item = document.createElement('li');
        item.className = 'list-group-item px-0';
        item.textContent = `${disciplina.codigo} - ${disciplina.nome}`;
        elementos.listaResumoDisciplinas.appendChild(item);
    });
}

function renderizarDisciplinas(disciplinas, ra) {
    elementos.disciplinasRa.textContent = `RA ${ra}`;
    elementos.tabelaDisciplinas.innerHTML = '';

    if (disciplinas.length === 0) {
        elementos.tabelaDisciplinas.innerHTML = '<tr><td colspan="3" class="text-center py-3">Sem disciplinas</td></tr>';
        return;
    }

    disciplinas.forEach((disciplina) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${escaparHtml(disciplina.codigo)}</td>
            <td>${escaparHtml(disciplina.nome)}</td>
            <td>${escaparHtml(disciplina.professor)}</td>
        `;
        elementos.tabelaDisciplinas.appendChild(linha);
    });
}

function criarCampoDisciplina(disciplina = { codigo: '', nome: '', professor: '' }) {
    const linha = document.createElement('div');
    linha.className = 'disciplina-linha border rounded p-2';
    linha.innerHTML = `
        <div class="row g-2 align-items-end">
            <div class="col-md-3">
                <label class="form-label">Codigo</label>
                <input class="form-control disciplina-codigo" type="text" value="${escaparHtml(disciplina.codigo)}" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Nome</label>
                <input class="form-control disciplina-nome" type="text" value="${escaparHtml(disciplina.nome)}" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Professor</label>
                <input class="form-control disciplina-professor" type="text" value="${escaparHtml(disciplina.professor)}" required>
            </div>
            <div class="col-md-1 d-grid">
                <button class="btn btn-outline-danger" type="button" title="Remover disciplina">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;

    linha.querySelector('button').addEventListener('click', () => linha.remove());
    elementos.camposDisciplinas.appendChild(linha);
}

function renderizarFormulario(aluno) {
    elementos.editRa.value = aluno.ra;
    elementos.editNome.value = aluno.nome;
    elementos.camposDisciplinas.innerHTML = '';
    aluno.disciplinas.forEach(criarCampoDisciplina);
}

function obterDisciplinasDoFormulario() {
    return [...elementos.camposDisciplinas.querySelectorAll('.disciplina-linha')].map((linha) => ({
        codigo: linha.querySelector('.disciplina-codigo').value.trim(),
        nome: linha.querySelector('.disciplina-nome').value.trim(),
        professor: linha.querySelector('.disciplina-professor').value.trim()
    }));
}

async function selecionarAluno(ra, focarEdicao = false) {
    limparAlerta();

    try {
        const aluno = await requestJson(`${API_BASE_URL}/${encodeURIComponent(ra)}`);
        const disciplinas = await requestJson(`${API_BASE_URL}/${encodeURIComponent(ra)}/disciplinas`);
        estado.alunoSelecionado = aluno;

        renderizarDetalhes(aluno);
        renderizarDisciplinas(disciplinas, ra);
        renderizarFormulario(aluno);

        if (focarEdicao) {
            document.getElementById('edicao').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        mostrarAlerta('danger', error.message);
    }
}

async function listarAlunos() {
    limparAlerta();

    try {
        estado.alunos = await requestJson(API_BASE_URL);
        renderizarAlunos();

        if (estado.alunos.length > 0) {
            await selecionarAluno(estado.alunos[0].ra);
        }
    } catch (error) {
        mostrarAlerta('danger', error.message);
    }
}

async function salvarAluno(event) {
    event.preventDefault();

    const ra = elementos.editRa.value;
    const dados = {
        nome: elementos.editNome.value.trim(),
        disciplinas: obterDisciplinasDoFormulario()
    };

    if (!dados.nome || dados.disciplinas.some((disciplina) => !disciplina.codigo || !disciplina.nome || !disciplina.professor)) {
        mostrarAlerta('warning', 'Preencha o nome e todos os campos das disciplinas.');
        return;
    }

    try {
        await requestJson(`${API_BASE_URL}/${encodeURIComponent(ra)}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });

        mostrarAlerta('success', 'Aluno atualizado com sucesso.');
        await listarAlunos();
        await selecionarAluno(ra);
    } catch (error) {
        mostrarAlerta('danger', error.message);
    }
}

elementos.filtro.addEventListener('input', renderizarAlunos);
elementos.formAluno.addEventListener('submit', salvarAluno);
elementos.btnAdicionarDisciplina.addEventListener('click', () => criarCampoDisciplina());
elementos.btnAtualizarDetalhes.addEventListener('click', () => {
    if (estado.alunoSelecionado) {
        selecionarAluno(estado.alunoSelecionado.ra);
    }
});

listarAlunos();
