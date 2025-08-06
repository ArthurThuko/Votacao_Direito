function includeComponent(id, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao incluir componente:', error);
        });
}

includeComponent("navbar", "../components/navbar.html");
includeComponent("footer", "../components/footer.html");
// Geração de componentes

const alunosFavor = [
    { nome: "Ana", foto: "../image/usuario_generico.png" },
    { nome: "Bruno", foto: "../image/usuario_generico.png" },
    { nome: "Carla", foto: "../image/usuario_generico.png" },
    { nome: "Diego", foto: "../image/usuario_generico.png" },
    { nome: "Elisa", foto: "../image/usuario_generico.png" },
];

const alunosContra = [
    { nome: "Ana", foto: "../image/usuario_generico.png" },
    { nome: "Bruno", foto: "../image/usuario_generico.png" },
    { nome: "Carla", foto: "../image/usuario_generico.png" },
    { nome: "Diego", foto: "../image/usuario_generico.png" },
    { nome: "Elisa", foto: "../image/usuario_generico.png" },
];

function renderizarAlunos(alunos, containerId, inputId, classeSelecionado) {
    const container = document.getElementById(containerId);
    const inputHidden = document.getElementById(inputId);

    alunos.forEach((aluno, index) => {
        const card = document.createElement("div");
        card.className = "card aluno-card text-center me-2 mb-2";
        card.style.width = "175px";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${aluno.foto}" class="card-img-top rounded-circle mx-auto mt-3"
                style="width:150px; height:150px; object-fit: cover;" alt="Foto de ${aluno.nome}">
            <div class="card-body p-2">
                <p class="card-text mb-0" style="font-size: 15px; font-weight: bold;">${aluno.nome}</p>
            </div>
        `;

        card.onclick = () => {
            // Remove destaque anterior
            Array.from(container.children).forEach(c => c.classList.remove(classeSelecionado));

            // Adiciona destaque ao atual
            card.classList.add(classeSelecionado);
            inputHidden.value = aluno.nome;
        };

        container.appendChild(card);
    });
}

renderizarAlunos(alunosFavor, "alunosFavorContainer", "alunoFavor", "selecionado-favor");
renderizarAlunos(alunosContra, "alunosContraContainer", "alunoContra", "selecionado-contra");
//Votos dos Alunos Destaques

const posicaoCards = document.querySelectorAll('.posicao-card');
const inputPosicao = document.getElementById('posicaoFinal');

posicaoCards.forEach(card => {
    card.addEventListener('click', () => {
        posicaoCards.forEach(c => c.classList.remove('selecionado'));

        card.classList.add('selecionado');
        inputPosicao.value = card.getAttribute('data-value');
    });
});

document.querySelectorAll('#alunosFavorContainer .aluno-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('alunoFavor').value = card.dataset.nome;
    });
});

document.querySelectorAll('#alunosContraContainer .aluno-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('alunoContra').value = card.dataset.nome;
    });
});

document.querySelectorAll('.posicao-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('posicaoFinal').value = card.dataset.value;
    });
});

//Voto Geral do Debate

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const alunoFavor = document.getElementById('alunoFavor').value;
    const alunoContra = document.getElementById('alunoContra').value;
    const debateNota = parseInt(document.getElementById('debateNota').value);
    const tecnicoNota = parseInt(document.getElementById('tecnicoNota').value);
    const argumentoNota = parseInt(document.getElementById('argumentoNota').value);
    const posicaoFinal = document.getElementById('posicaoFinal').value;

    const dados = {
        alunoFavor,
        alunoContra,
        debateNota,
        tecnicoNota,
        argumentoNota,
        posicaoFinal
    };

    const response = await fetch('http://localhost:3000/votar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    const resultado = await response.json();
    alert(resultado.mensagem || 'Erro ao registrar voto');
});
//integração com o Banco de Dados

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/resultados");
        const data = await response.json();

        // Atualiza os nomes
        document.getElementById("nomeDestaqueFavor").textContent = data.destaques.aFavor.nome;
        document.getElementById("nomeDestaqueContra").textContent = data.destaques.contra.nome;

        // Atualiza as fotos (verifica se existe caminho, senão usa padrão)
        document.getElementById("fotoDestaqueFavor").src = data.destaques.aFavor.foto || "../image/usuario_generico.png";
        document.getElementById("fotoDestaqueContra").src = data.destaques.contra.foto || "../image/usuario_generico.png";

        // Atualiza as notas
        document.getElementById("notaDebate").textContent = data.notas.debate;
        document.getElementById("notaTecnica").textContent = data.notas.tecnica;
        document.getElementById("notaArgumento").textContent = data.notas.argumento;

        // Atualiza a posição vencedora
        const posicao = data.vencedor.toUpperCase();
        document.getElementById("posicaoVencedora").textContent = posicao;

        // Opcional: mudar imagem ou estilo conforme posição
        const img = document.querySelector("#posicaoContainer img");
        if (posicao === "A FAVOR") {
            img.src = "../image/icone_corrente.png";
        } else {
            img.src = "../image/icone_contra.png"; // coloque essa imagem na pasta
        }

    } catch (err) {
        console.error("Erro ao buscar dados:", err);
    }
});
//Buscando resultado do Banco de Dados