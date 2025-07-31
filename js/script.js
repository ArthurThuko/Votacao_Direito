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
