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

const alunos = [
    { nome: "Ana", foto: "https://i.pravatar.cc/100?img=1" },
    { nome: "Bruno", foto: "https://i.pravatar.cc/100?img=2" },
    { nome: "Carla", foto: "https://i.pravatar.cc/100?img=3" },
    { nome: "Diego", foto: "https://i.pravatar.cc/100?img=4" },
    { nome: "Elisa", foto: "https://i.pravatar.cc/100?img=5" },
];

const container = document.getElementById("alunosContainer");
const inputHidden = document.getElementById("alunoFavor");
let selecionadoIndex = null;

function criarCard(aluno, index) {
    const card = document.createElement("div");
    card.className = "card text-center";
    card.style.width = "100px";
    card.style.cursor = "pointer";
    card.style.transition = "transform 0.2s, box-shadow 0.2s";
    card.classList.add("border", "border-secondary");

    card.innerHTML = `
      <img src="${aluno.foto}" class="card-img-top rounded-circle mx-auto mt-3" style="width:80px; height:80px; object-fit: cover;" alt="Foto de ${aluno.nome}">
      <div class="card-body p-2">
        <p class="card-text mb-0">${aluno.nome}</p>
      </div>
    `;

    card.onclick = () => {
        if (selecionadoIndex !== null) {
            container.children[selecionadoIndex].classList.remove("border-primary", "shadow", "selected-card");
            container.children[selecionadoIndex].style.transform = "none";
        }

        selecionadoIndex = index;
        card.classList.add("border-primary", "shadow", "selected-card");
        card.style.transform = "scale(1.05)";

        inputHidden.value = aluno.nome;
    };

    return card;
}

alunos.forEach((aluno, i) => {
    container.appendChild(criarCard(aluno, i));
});
//Input de Cards para Votação de Aluno destaque