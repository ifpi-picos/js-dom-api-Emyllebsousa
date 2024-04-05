const inputCep = document.querySelector('#cep');
const inputCidade = document.querySelector('#cidade');
const inputBairro = document.querySelector('#bairro');
const inputRua = document.querySelector('#rua');
const inputButao=document.querySelector('#butao')


async function getData () {
    const resposta = await fetch('http://localhost:3000/pedidos');
    const pedidos = await resposta.json();
    console.log(pedidos);
}

getData();

async function postData(pedidos){
    const resposta = await fetch('http://localhost:3000/pedidos');
    const pedidos = await resposta.json();
}
inputButao.addEventListener('blur', async()=>{
    const ped= inputButao.value;
})
inputCep.addEventListener('blur', async () => {
    const cep = inputCep.value;
    buscarEnderecoPorCep(cep);
});

async function buscarEnderecoPorCep(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const endereco = await resposta.json();
    console.log(endereco);
    preencherCampos(endereco);
}

function preencherCampos(endereco) {
    inputCidade.value = endereco.localidade;
    inputBairro.value = endereco.bairro;
    inputRua.value = endereco.logradouro;
}
