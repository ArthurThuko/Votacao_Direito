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

// Renderizar os dois blocos
renderizarAlunos(alunosFavor, "alunosFavorContainer", "alunoFavor", "selecionado-favor");
renderizarAlunos(alunosContra, "alunosContraContainer", "alunoContra", "selecionado-contra");