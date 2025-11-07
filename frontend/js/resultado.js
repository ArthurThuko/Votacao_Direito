document.addEventListener('DOMContentLoaded', () => {
    fetch("http://localhost:3000/resultados")
        .then((res) => res.json())
        .then((data) => {
            // --- DESTAQUES ---
            document.getElementById("nomeDestaqueFavor").textContent = data.destaques.aFavor.nome || "-";
            document.getElementById("fotoDestaqueFavor").src = "http://localhost:3000" + data.destaques.aFavor.foto;

            document.getElementById("nomeDestaqueContra").textContent = data.destaques.contra.nome || "-";
            document.getElementById("fotoDestaqueContra").src = "http://localhost:3000" + data.destaques.contra.foto;

            document.getElementById("nomeDestaqueGeral").textContent = data.destaques.geral.nome || "-";
            document.getElementById("fotoDestaqueGeral").src = "http://localhost:3000" + data.destaques.geral.foto;

            // --- NOTAS ---
            document.getElementById("notaDebate").textContent = data.notas.debate;
            document.getElementById("notaTecnica").textContent = data.notas.tecnica;
            document.getElementById("notaArgumento").textContent = data.notas.argumento;

            // --- POSIÇÃO VENCEDORA ---
            document.getElementById("posicaoVencedora").textContent = data.vencedor;
            document.getElementById("fotoEquipeVencedora").src = "http://localhost:3000" + data.fotoVencedor;

            const bg = document.getElementById("backgroundVencedor");

            if (data.vencedor === "CONTRA") {
                bg.style.backgroundColor = "rgb(226, 79, 79)";
            } else {
                bg.style.backgroundColor = "rgb(81, 135, 235)";
            }
        })
        .catch((err) => {
            console.error("Erro ao carregar resultados:", err);
        });
});