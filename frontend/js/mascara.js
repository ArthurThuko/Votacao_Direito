const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove tudo que não for número
    value = value.replace(/\D/g, '');

    // Aplica a máscara
    if (value.length > 3 && value.length <= 6) {
        value = value.replace(/^(\d{3})(\d+)/, '$1.$2');
    } else if (value.length > 6 && value.length <= 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }

    e.target.value = value;
})