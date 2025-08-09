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

        // Validações
        if (!nome) return mostrarMensagem('Erro', 'Por favor, preencha seu nome completo.', 'erro');
        if (!email) return mostrarMensagem('Erro', 'Por favor, preencha seu email.', 'erro');
        if (!cpf) return mostrarMensagem('Erro', 'Por favor, preencha seu CPF.', 'erro');
        if (!validarCPF(cpf)) return mostrarMensagem('Erro', 'CPF inválido.', 'erro');
        if (!alunoFavor) return mostrarMensagem('Erro', 'Selecione um aluno destaque A FAVOR.', 'erro');
        if (!alunoContra) return mostrarMensagem('Erro', 'Selecione um aluno destaque CONTRA.', 'erro');
        if (isNaN(debateNota)) return mostrarMensagem('Erro', 'Informe a nota do debate.', 'erro');
        if (isNaN(tecnicoNota)) return mostrarMensagem('Erro', 'Informe a nota do nível técnico.', 'erro');
        if (isNaN(argumentoNota)) return mostrarMensagem('Erro', 'Informe a nota da qualidade dos argumentos.', 'erro');
        if (!posicaoFinal) return mostrarMensagem('Erro', 'Selecione sua posição final.', 'erro');

        const dados = { nome, email, cpf, alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal };

        try {
            const response = await fetch('http://localhost:3000/votar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();

            if (!response.ok) {
                return mostrarMensagem('Erro', resultado.error || 'Erro ao registrar voto.', 'erro');
            }

            mostrarMensagem('Sucesso', resultado.mensagem || 'Voto registrado com sucesso.', 'sucesso');

            // Limpa formulário depois de 2 segundos
            setTimeout(() => location.reload(), 2000);
        } catch (err) {
            mostrarMensagem('Erro', 'Erro ao enviar voto. Tente novamente.', 'erro');
            console.error(err);
        }
    });
});