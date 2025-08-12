function mostrarMensagem(titulo, mensagem, tipo = 'info') {
    const modalTitulo = document.getElementById('mensagemTitulo');
    const modalTexto = document.getElementById('mensagemTexto');

    modalTitulo.textContent = titulo;
    modalTexto.textContent = mensagem;

    // Cores do título conforme tipo
    if (tipo === 'erro') {
        modalTitulo.className = 'modal-title text-danger';
    } else if (tipo === 'sucesso') {
        modalTitulo.className = 'modal-title text-success';
    } else {
        modalTitulo.className = 'modal-title text-primary';
    }

    const modal = new bootstrap.Modal(document.getElementById('mensagemModal'));
    modal.show();
}