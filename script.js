let jogadoras = JSON.parse(localStorage.getItem("jogadoras")) || [
    {
        "nome": "Andressa Alves",
        "posicao": "Meio-campo",
        "clube": "Corinthians",
        "foto": "./images/andressa-alves.jpg",
        "gols": 15,
        "assistencias": 10,
        "jogos": 28,
        "favorita": false
    },
    {
        "nome": "Dayana Rodríguez",
        "posicao": "Meio-campo",
        "clube": "Corinthians",
        "foto": "https://example.com/dayana.jpg",
        "gols": 5,
        "assistencias": 12,
        "jogos": 30,
        "favorita": false
    },
    {
        "nome": "Mariza",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://example.com/mariza.jpg",
        "gols": 2,
        "assistencias": 1,
        "jogos": 32,
        "favorita": false
    },
    {
        "nome": "Thaís Regina",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://example.com/thais.jpg",
        "gols": 1,
        "assistencias": 2,
        "jogos": 25,
        "favorita": false
    },
    {
        "nome": "Letícia Teles",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://example.com/leticia.jpg",
        "gols": 0,
        "assistencias": 0,
        "jogos": 18,
        "favorita": false
    }
];

window.onload = function () {
    loadJogadoras();
    populateClubeFilter();
    displayJogadoras();

    document.getElementById("form").addEventListener("submit", addJogadora);
    document.getElementById("lista").addEventListener("click", handleJogadoraListClick);

    document.getElementById("filtroBusca").addEventListener("input", filterJogadoras);
    document.getElementById("filtroClube").addEventListener("input", filterJogadoras);

    document.getElementById("ordenarNome").addEventListener("click", () => {
        jogadoras.sort((a, b) => a.nome.localeCompare(b.nome));
        filterJogadoras();
    });

    document.getElementById("ordenarClube").addEventListener("click", () => {
        jogadoras.sort((a, b) => a.clube.localeCompare(b.clube));
        filterJogadoras();
    });
};

function saveJogadoras() {
    localStorage.setItem("jogadoras", JSON.stringify(jogadoras));
}

function loadJogadoras() {
    const stored = localStorage.getItem("jogadoras");
    if (stored) jogadoras = JSON.parse(stored);
}

function addJogadora(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const posicao = document.getElementById("posicao").value.trim();
    const clube = document.getElementById("clube").value.trim();
    const foto = document.getElementById("foto").value.trim();
    const gols = Number(document.getElementById("gols").value);
    const assistencias = Number(document.getElementById("assistencias").value);
    const jogos = Number(document.getElementById("jogos").value);

    if (!nome || !posicao || !clube || !foto || isNaN(gols) || isNaN(assistencias) || isNaN(jogos)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const nova = {nome, posicao, clube, foto, gols, assistencias, jogos, favorita: false};
    jogadoras.unshift(nova);
    saveJogadoras();
    populateClubeFilter();

    document.getElementById("form").reset();
    filterJogadoras();
}

function displayJogadoras(list = jogadoras) {
    const container = document.getElementById("lista");
    container.innerHTML = "";
    list.forEach(j => {
        const index = jogadoras.indexOf(j);
        const card = document.createElement("div");
        card.classList.add("card-jogadora");
        card.innerHTML = `
      <span class="favorite ${j.favorita ? "active" : ""}" data-index="${index}">&#9733;</span>
      <img src="${j.foto}" alt="${j.nome}" style="max-width:150px;">
      <h3>${j.nome}</h3>
      <p>Posição: ${j.posicao}</p>
      <p>Clube: ${j.clube}</p>
      <p>Gols: ${j.gols} | Assistências: ${j.assistencias} | Jogos: ${j.jogos}</p>
      <button data-action="edit" data-index="${index}">Editar</button>
      <button data-action="delete" data-index="${index}">Apagar</button>
      <hr style="margin:20px 0;">
    `;
        container.append(card);
    });
}

function editJogadora(index) {
    const j = jogadoras[index];
    if (!j) return;

    document.getElementById("nome").value = j.nome;
    document.getElementById("posicao").value = j.posicao;
    document.getElementById("clube").value = j.clube;
    document.getElementById("foto").value = j.foto;
    document.getElementById("gols").value = j.gols;
    document.getElementById("assistencias").value = j.assistencias;
    document.getElementById("jogos").value = j.jogos;

    jogadoras.splice(index, 1);
    saveJogadoras();
    populateClubeFilter();
    filterJogadoras();
}

function deleteJogadora(index) {
    if (!jogadoras[index]) return;
    if (confirm("Deseja realmente apagar esta jogadora?")) {
        jogadoras.splice(index, 1);
        saveJogadoras();
        populateClubeFilter();
        filterJogadoras();
    }
}

function toggleFavorite(index) {
    index = Number(index);
    if (Number.isNaN(index) || !jogadoras[index]) return;
    jogadoras[index].favorita = !jogadoras[index].favorita;
    saveJogadoras();
    filterJogadoras();
}

function filterJogadoras() {
    const termo = document.getElementById("filtroBusca").value.trim().toLowerCase();
    const clube = document.getElementById("filtroClube").value.trim().toLowerCase();

    const listaFiltrada = jogadoras.filter(j => {
        const textMatch = !termo
            ? true
            : j.nome.toLowerCase().includes(termo) || j.posicao.toLowerCase().includes(termo);
        const clubeMatch = !clube || j.clube.toLowerCase() === clube;
        return textMatch && clubeMatch;
    });

    displayJogadoras(listaFiltrada);
}


function handleJogadoraListClick(event) {
    const clicked = event.target.closest("button, .favorite");
    if (!clicked) return;

    if (clicked.classList.contains("favorite")) {
        const index = Number(clicked.dataset.index);
        toggleFavorite(index);
    } else {
        const action = clicked.dataset.action;
        const index = Number(clicked.dataset.index);
        if (action === "edit") editJogadora(index);
        else if (action === "delete") deleteJogadora(index);
    }
}

function populateClubeFilter() {
    const select = document.getElementById("filtroClube");
    const previous = select.value;
    const clubes = [...new Set(jogadoras.map(j => j.clube))].sort((a, b) => a.localeCompare(b));
    select.innerHTML = "<option value=\"\">Todos os clubes</option>";
    clubes.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });
    if (previous && (previous === "" || clubes.includes(previous))) {
        select.value = previous;
    } else {
        select.value = "";
    }
}
