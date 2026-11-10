const API_URL = "http://localhost:3000";

async function carregarResultado() {

    const votosResponse =
        await fetch(`${API_URL}/votos`);

    const votos =
        await votosResponse.json();

    const participantesResponse =
        await fetch(
            `${API_URL}/participantes?naRoca=true`
        );

    const participantes =
        await participantesResponse.json();

    document.getElementById("totalVotos")
        .textContent =
        `${votos.length} votos computados`;

    const container =
        document.getElementById(
            "resultadoContainer"
        );

    if (votos.length === 0) {

        container.innerHTML = `
            <div class="alert alert-warning text-center">

                Nenhum voto foi computado ainda.
                Vá para a página de votação para votar.

            </div>
        `;

        return;
    }

    let resultado = [];

    participantes.forEach(participante => {

        const quantidade =
            votos.filter(
                voto =>
                voto.participanteId === participante.id
            ).length;

        const percentual =
            ((quantidade / votos.length) * 100);

        resultado.push({
            ...participante,
            quantidade,
            percentual
        });

    });

    resultado.sort(
        (a, b) =>
            b.quantidade - a.quantidade
    );

    renderizarResultado(resultado);
}

function renderizarResultado(lista) {

    const container =
        document.getElementById(
            "resultadoContainer"
        );

    container.innerHTML = "";

    lista.forEach((participante, indice) => {

        container.innerHTML += `

        <div class="card mb-3
            ${indice === 0 ? 'border-danger' : ''}">

            <div class="card-body">

                <div class="row align-items-center">

                    <div class="col-md-2">

                        <img
                            src="${participante.foto}"
                            class="img-fluid rounded"
                            alt="${participante.nome}">

                    </div>

                    <div class="col-md-10">

                        <h3>

                            ${participante.nome}

                            ${indice === 0
                            ? '<span class="badge bg-danger">Sairia hoje</span>'
                            : ''}

                        </h3>

                        <div class="progress mt-3">

                            <div
                                class="progress-bar
                                ${indice === 0
                                ? 'bg-danger'
                                : 'bg-warning'}"

                                style="
                                width:
                                ${participante.percentual}%">

                            </div>

                        </div>

                        <strong>

                            ${participante.percentual.toFixed(1)}%
                            (${participante.quantidade} votos)

                        </strong>

                    </div>

                </div>

            </div>

        </div>

        `;
    });
}

async function zerarVotacao() {

    const response =
        await fetch(`${API_URL}/votos`);

    const votos =
        await response.json();

    await Promise.all(

        votos.map(voto =>

            fetch(
                `${API_URL}/votos/${voto.id}`,
                {
                    method: "DELETE"
                }
            )

        )

    );

    carregarResultado();
}

carregarResultado();