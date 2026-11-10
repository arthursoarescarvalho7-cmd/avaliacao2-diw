const API_URL = "http://localhost:3000";

async function getParticipantesRoca() {
    const response = await fetch(
        `${API_URL}/participantes?naRoca=true`
    );

    return await response.json();
}

async function getParticipantesForaRoca() {
    const response = await fetch(
        `${API_URL}/participantes?naRoca=false`
    );

    return await response.json();
}

function criarCardRoca(participante) {
    return `
        <div class="col">
            <div class="card h-100">
                <img src="${participante.foto}" class="card-img-top" alt="${participante.nome}">
                <div class="card-body text-center">
                    <span class="badge bg-danger mb-2">
                        Na roça
                    </span>
                    <h5 class="card-title">
                        ${participante.nome}
                    </h5>
                    <button class="btn btn-danger w-100" onclick="votar(${participante.id})">
                        Votar para eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function criarCardPeao(participante) {
    return `
        <div class="col">
            <div class="card h-100">
                <img src="${participante.foto}" class="card-img-top" alt="${participante.nome}">
                <div class="card-body p-2 text-center">
                    <small>
                        ${participante.nome}
                    </small>
                </div>
            </div>
        </div>
    `;
}

async function carregarParticipantes() {

    const participantesRoca = await getParticipantesRoca();

    const participantesFora = await getParticipantesForaRoca();

    const divRoca = document.getElementById("cardsRoca");

    const divPeoes = document.getElementById("cardsPeoes");

    divRoca.innerHTML = participantesRoca.map(criarCardRoca).join("");

    divPeoes.innerHTML = participantesFora.map(criarCardPeao).join("");
}

async function votar(participanteId) {

    const voto = {
        participanteId: participanteId,
        data: new Date().toISOString()
    };

    await fetch(`${API_URL}/votos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(voto)
    });

    mostrarMensagem(participanteId);
}

async function mostrarMensagem(participanteId) {

    const votos = await fetch(`${API_URL}/votos`);
    const listaVotos = await votos.json();

    const participante = await fetch(
        `${API_URL}/participantes/${participanteId}`
    );

    const dadosParticipante =
        await participante.json();

    const quantidade =
        listaVotos.filter(
            voto => voto.participanteId === participanteId
        ).length;

    document.getElementById("mensagem").innerHTML = `
        <div class="alert alert-success alert-dismissible fade show">

            Voto computado para
            <strong>${dadosParticipante.nome}</strong>.

            Total de votos recebidos:
            <strong>${quantidade}</strong>

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert">
            </button>

        </div>
    `;
}



carregarParticipantes();