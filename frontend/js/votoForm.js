document.addEventListener('DOMContentLoaded', () => {
    const alunosFavor = [
        { nome: "Ana", foto: "../image/usuario_generico.png" },
        { nome: "Bruno", foto: "../image/usuario_generico.png" },
        { nome: "Carla", foto: "../image/usuario_generico.png" },
        { nome: "Diego", foto: "../image/usuario_generico.png" },
        { nome: "Elisa", foto: "../image/usuario_generico.png" },
    ];

    const alunosContra = [...alunosFavor];

    renderizarAlunos(alunosFavor, "alunosFavorContainer", "alunoFavor", "selecionado-favor");
    renderizarAlunos(alunosContra, "alunosContraContainer", "alunoContra", "selecionado-contra");

    const posicaoCards = document.querySelectorAll('.posicao-card');
    const inputPosicao = document.getElementById('posicaoFinal');

    posicaoCards.forEach(card => {
        card.addEventListener('click', () => {
            posicaoCards.forEach(c => c.classList.remove('selecionado'));
            card.classList.add('selecionado');
            inputPosicao.value = card.getAttribute('data-value');
        });
    });

    document.querySelector('form')?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const alunoFavor = document.getElementById('alunoFavor').value;
        const alunoContra = document.getElementById('alunoContra').value;
        const debateNota = parseInt(document.getElementById('debateNota').value);
        const tecnicoNota = parseInt(document.getElementById('tecnicoNota').value);
        const argumentoNota = parseInt(document.getElementById('argumentoNota').value);
        const posicaoFinal = document.getElementById('posicaoFinal').value;

        const dados = { alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal };

        try {
            const response = await fetch('http://localhost:3000/votar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();
            alert(resultado.mensagem || 'Erro ao registrar voto');
        } catch (err) {
            alert('Erro ao enviar voto');
            console.error(err);
        }
    });
});