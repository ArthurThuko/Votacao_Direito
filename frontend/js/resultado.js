document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/resultados')
        .then(response => response.json())
        .then(data => {
            document.getElementById('nomeDestaqueFavor').textContent = data.destaques.aFavor.nome || 'Nenhum';
            document.getElementById('fotoDestaqueFavor').src = data.destaques.aFavor.foto;

            document.getElementById('nomeDestaqueContra').textContent = data.destaques.contra.nome || 'Nenhum';
            document.getElementById('fotoDestaqueContra').src = data.destaques.contra.foto;

            document.getElementById('notaDebate').textContent = data.notas.debate;
            document.getElementById('notaTecnica').textContent = data.notas.tecnica;
            document.getElementById('notaArgumento').textContent = data.notas.argumento;

            document.getElementById('posicaoVencedora').textContent = data.vencedor;
        })
        .catch(error => {
            console.error('Erro ao buscar os resultados:', error);
            alert('Erro ao carregar os resultados da votação.');
        });
});