document.addEventListener('DOMContentLoaded', () => {
    fetch('http://jurisimulado.kinghost.net/backend/resultados.php')
        .then(res => res.json())
        .then(data => {
            // --- DESTAQUES ---
            document.getElementById("nomeDestaqueFavor").textContent = data.destaques.aFavor.nome || "-";
            document.getElementById("fotoDestaqueFavor").src = data.destaques.aFavor.foto;

            document.getElementById("nomeDestaqueContra").textContent = data.destaques.contra.nome || "-";
            document.getElementById("fotoDestaqueContra").src = data.destaques.contra.foto;

            document.getElementById("nomeDestaqueGeral").textContent = data.destaques.geral.nome || "-";
            document.getElementById("fotoDestaqueGeral").src = data.destaques.geral.foto;

            // --- NOTAS ---
            document.getElementById("notaDebate").textContent = data.notas.debate;
            document.getElementById("notaTecnica").textContent = data.notas.tecnica;
            document.getElementById("notaArgumento").textContent = data.notas.argumento;

            // --- POSIÇÃO VENCEDORA ---
            document.getElementById("posicaoVencedora").textContent = data.vencedor;
            document.getElementById("fotoEquipeVencedora").src = data.fotoVencedor;

            const bg = document.getElementById("backgroundVencedor");
            bg.style.backgroundColor = data.vencedor === "ACUSACAO"
                ? "rgb(226, 79, 79)"
                : "rgb(81, 135, 235)";
        })
        .catch(err => console.error("Erro ao carregar resultados:", err));
});
