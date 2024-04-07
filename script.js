
document.addEventListener('DOMContentLoaded', function () {
    const inputCep = document.querySelector('#cep');
    const inputCidade = document.querySelector('#cidade');
    const inputBairro = document.querySelector('#bairro');
    const inputRua = document.querySelector('#rua');
    const inputNumero = document.querySelector('#numero');
    const inputCliente = document.querySelector('#cliente');
    const formTodo = document.querySelector('#todo-form');
    const pedidosList = document.querySelector('#pedidos-list'); 
const inputData= document.querySelector('#data')
const inputValor=document.querySelector('#valor')
    function getPedidosFromLocalStorage() {
        const pedidosString = localStorage.getItem('pedidos');
        return pedidosString ? JSON.parse(pedidosString) : [];
    }

    const pedidos = getPedidosFromLocalStorage();
    pedidos.forEach(pedido => {
        exibirPedidoNaLista(pedido);
    });

    function savePedidosToLocalStorage(pedidos) {
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    async function postData(pedido) {
        try {
            const pedidos = getPedidosFromLocalStorage();
            pedidos.push(pedido);
            savePedidosToLocalStorage(pedidos);
            exibirPedidoNaLista(pedido); 
        } catch (erro) {
            console.error('Erro ao salvar dados:', erro);
        }
    }
    
    function exibirPedidoNaLista(pedido) {
        const item = document.createElement('li');
        const deleteButton = document.createElement('button');
        const completeButton = document.createElement('button'); 
        deleteButton.textContent = 'Apagar';
        completeButton.textContent = 'Concluir'; 
        deleteButton.addEventListener('click', function() {
            item.remove();
            const index = pedidos.indexOf(pedido);
            if (index !== -1) {
                pedidos.splice(index, 1);
                savePedidosToLocalStorage(pedidos);
            }
        });
        completeButton.addEventListener('click', function() {
            item.classList.add('completed');
        });
        item.innerHTML = `
        <strong>Cliente: </strong>${pedido.cliente} - 
        <strong>Data: </strong>${pedido.data} - 
        <strong>Valor: </strong>${pedido.valor} - 
        <strong>Cidade: </strong>${pedido.cidade} - 
        <strong>Bairro: </strong>${pedido.bairro} - 
        <strong>Rua: </strong>${pedido.rua} - 
        <strong>Número: </strong>${pedido.numero}
        `;
        item.appendChild(deleteButton);
        item.appendChild(completeButton); 
        pedidosList.appendChild(item);
    }
    
    formTodo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pedido = {
            cliente: inputCliente.value,
            data: inputData.value,
            valor: inputValor.value,
            cidade: inputCidade.value,
            bairro: inputBairro.value,
            rua: inputRua.value,
            numero: inputNumero.value
        };
        if (validarCampos(pedido)) {
            await postData(pedido);
        } else {
            console.error('Todos os campos devem ser preenchidos!');
        }
    });

    function validarCampos(pedido) {
        return Object.values(pedido).every(value => value.trim() !== '');
    }

    inputCep.addEventListener('blur', async () => {
        const cep = inputCep.value;
        if (cep.length === 8 && /^[0-9]+$/.test(cep)) {
            buscarEnderecoPorCep(cep);
        } else {
            console.error('Formato de CEP inválido');
        }
    });

    async function buscarEnderecoPorCep(cep) {
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await resposta.json();
            preencherCampos(endereco);
        } catch (erro) {
            console.error('Erro ao buscar endereço:', erro);
        }
    }

    function preencherCampos(endereco) {
        inputCidade.value = endereco.localidade;
        inputBairro.value = endereco.bairro;
        inputRua.value = endereco.logradouro;
    }
});