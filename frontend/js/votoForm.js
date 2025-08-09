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

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf.length !== 11) return false;

        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const alunoFavor = document.getElementById('alunoFavor').value;
        const alunoContra = document.getElementById('alunoContra').value;
        const debateNota = parseInt(document.getElementById('debateNota').value);
        const tecnicoNota = parseInt(document.getElementById('tecnicoNota').value);
        const argumentoNota = parseInt(document.getElementById('argumentoNota').value);
        const posicaoFinal = document.getElementById('posicaoFinal').value;

        if (!nome) {
            alert('Por favor, preencha seu nome completo.');
            return;
        }

        if (!email) {
            alert('Por favor, preencha seu email.');
            return;
        }

        if (!cpf) {
            alert('Por favor, preencha seu CPF.');
            return;
        }

        if (!validarCPF(cpf)) {
            alert('CPF inválido. Por favor, insira um CPF válido.');
            return;
        }

        if (!alunoFavor) {
            alert('Por favor, selecione um aluno destaque A FAVOR.');
            return;
        }

        if (!alunoContra) {
            alert('Por favor, selecione um aluno destaque CONTRA.');
            return;
        }

        if (isNaN(debateNota)) {
            alert('Por favor, informe a nota do debate.');
            return;
        }

        if (isNaN(tecnicoNota)) {
            alert('Por favor, informe a nota do nível técnico da discussão.');
            return;
        }

        if (isNaN(argumentoNota)) {
            alert('Por favor, informe a nota da qualidade dos argumentos.');
            return;
        }

        if (!posicaoFinal) {
            alert('Por favor, selecione sua posição final após o debate.');
            return;
        }

        const dados = { nome, email, cpf, alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal };

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