function renderizarAlunos(alunos, containerId, inputId, classeSelecionado) {
    const container = document.getElementById(containerId);
    const inputHidden = document.getElementById(inputId);

    if (!container || !inputHidden) return;

    alunos.forEach((aluno) => {
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
            Array.from(container.children).forEach(c => c.classList.remove(classeSelecionado));
            card.classList.add(classeSelecionado);
            inputHidden.value = aluno.nome;
        };

        container.appendChild(card);
    });
}