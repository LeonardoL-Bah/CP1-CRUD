let jogadoras = JSON.parse(localStorage.getItem('jogadoras')) || [
  {
    "nome": "Andressa Alves",
    "posicao": "Meio-campo",
    "clube": "Corinthians",
    "foto": "https://example.com/andressa.jpg",
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
]

window.onload = function() {
    loadJogadoras();
    displayJogadoras();

    document.getElementById('form').addEventListener('submit', addJogadora);
    document.getElementById('lista').addEventListener('click', handleJogadoraListClick);
}

function handleJogadoraListClick(event) {
    const clickedElement = event.target.closest('button');
    if (!clickedElement) return;

    const action = clickedElement.dataset.action;
    const index = clickedElement.dataset.index;

    if (action === "edit") editJogadora(index);
    else if (action === "delete") deleteJogadora(index);
    else if (action === "favorite") toggleFavorite(index);
}

function saveJogadoras() {
    localStorage.setItem('jogadoras', JSON.stringify(jogadoras));
}

function loadJogadoras() {
    const stored = localStorage.getItem("jogadoras");
    if(stored) jogadoras = JSON.parse(stored);
}

function addJogadora(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const posicao = document.getElementById('posicao').value.trim();
    const clube = document.getElementById('clube').value.trim();
    const foto = document.getElementById('foto').value.trim();
    const gols = Number(document.getElementById('gols').value);
    const assistencias = Number(document.getElementById('assistencias').value);
    const jogos = Number(document.getElementById('jogos').value);

    if(!nome || !posicao || !clube || !foto || isNaN(gols) || isNaN(assistencias) || isNaN(jogos)){
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const nova = {nome,posicao,clube,foto,gols,assistencias,jogos,favorita:false};
    jogadoras.unshift(nova);
    saveJogadoras();

    document.getElementById('jogadoraForm').reset();
    displayJogadoras();
}

function displayJogadoras() {
    const list = document.getElementById('lista'); // era 'jogadoraList'
    list.innerHTML = '';
    jogadoras.forEach((j, index) => {
        const card = document.createElement('div');
        card.classList.add('card-jogadora');
        card.innerHTML = `
            <span class="favorite ${j.favorita ? 'active' : ''}" onclick="toggleFavorite(${index})">&#9733;</span>
            <img src="${j.foto}" alt="${j.nome}" style="max-width:150px;">
            <h3>${j.nome}</h3>
            <p>Posição: ${j.posicao}</p>
            <p>Clube: ${j.clube}</p>
            <p>Gols: ${j.gols} | Assistências: ${j.assistencias} | Jogos: ${j.jogos}</p>
            <button data-action="edit" data-index="${index}">Editar</button>
            <button data-action="delete" data-index="${index}">Apagar</button>
            <hr style="margin:20px 0;">
        `;
        list.append(card);
    });
}

function editJogadora(index) {
    const j = jogadoras[index];
    document.getElementById('nome').value = j.nome;
    document.getElementById('posicao').value = j.posicao;
    document.getElementById('clube').value = j.clube;
    document.getElementById('foto').value = j.foto;
    document.getElementById('gols').value = j.gols;
    document.getElementById('assistencias').value = j.assistencias;
    document.getElementById('jogos').value = j.jogos;

    jogadoras.splice(index, 1);
    saveJogadoras();
    displayJogadoras();
}

function deleteJogadora(index) {
    if(confirm("Deseja realmente apagar esta jogadora?")){
        jogadoras.splice(index,1);
        saveJogadoras();
        displayJogadoras();
    }
}
