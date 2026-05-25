const API_BASE_URL = 'https://two0261-frontend.onrender.com/alunos';

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    let payload = null;
    try {
        payload = await response.json();
    } catch (error) {
        payload = null;
    }

    if (!response.ok) {
        const message = payload && payload.error ? payload.error : 'Falha ao consumir a API de alunos';
        throw new Error(message);
    }

    return payload;
}

function obterTodos() {
    return requestJson(API_BASE_URL);
}

function obterPorRa(ra) {
    return requestJson(`${API_BASE_URL}/${encodeURIComponent(ra)}`);
}

function obterDisciplinas(ra) {
    return requestJson(`${API_BASE_URL}/${encodeURIComponent(ra)}/disciplinas`);
}

function atualizar(ra, dados) {
    return requestJson(`${API_BASE_URL}/${encodeURIComponent(ra)}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    });
}

module.exports = {
    obterTodos,
    obterPorRa,
    obterDisciplinas,
    atualizar,
};