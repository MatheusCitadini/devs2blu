const API_BASE = 'http://localhost:3000/enderecos';
const VIA_CEP = 'https://viacep.com.br/ws';

let idEmEdicao = null;
let listaDeEnderecos = [];
let idParaExcluir = null;

//Elementos do DOM
//Inputs Formulário
const formulario = document.getElementById('form-endereco');
const tituloFormulario = document.getElementById('form-title');
const inputNome = document.getElementById('campo-nome');
const inputCEP = document.getElementById('campo-cep');
const inputEstado = document.getElementById('campo-estado');
const inputCidade = document.getElementById('campo-cidade');
const inputBairro = document.getElementById('campo-bairro');
const inputLogradouro = document.getElementById('campo-logradouro');

//Botões de Acão
const botaoBuscarCep = document.getElementById('botao-buscar-cep');
const botaoCancelar = document.getElementById('botao-cancelar');
const botaoSalvar = document.getElementById('botao-salvar');

//Lista de Enderecos
const containerEnderecos = document.getElementById('lista-enderecos');
const loading = document.getElementById('carregando');
const estadoVazio = document.getElementById('estado-vazio');

//Modal
const modal = document.getElementById('modal-confirmacao');
const botaoCancelarExclusao = document.getElementById('botao-cancelar-exclusao');
const botaoConfirmarExclusao = document.getElementById('botao-confirmar-exclusao');

const toast = document.getElementById('toast');
const mensagemToast = document.getElementById('mensagem-toast');

//Eventos
document.addEventListener('DOMContentLoaded', () => {
    carregarEnderecos();
    configurarEventos();
});

function configurarEventos() {
    formulario.addEventListener('submit', salvarEndereco);
    botaoBuscarCep.addEventListener('click', buscarEnderecoViaCEP);
    inputCEP.addEventListener('blur', buscarEnderecoViaCEP);
    inputCEP.addEventListener('input', formatarCEP);
    botaoCancelar.addEventListener('click', cancelarEdicao);
    botaoCancelarExclusao.addEventListener('click', fecharModal);
    botaoConfirmarExclusao.addEventListener('click', confirmarExclusao);
    modal.addEventListener('click', e => {
        if(e.target === modal) fecharModal();
    })
}

function formatarCEP(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length >= 5) {
        valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
    }
    e.target.value = valor;
}

async function buscarEnderecoViaCEP() {
    const cep = inputCEP.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        mostrarToast('CEP deve ter 8 dígitos', 'erro');
        return;
    }

    try {
        botaoBuscarCep.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        botaoBuscarCep.disabled = true;

        const resposta = await fetch(`${VIA_CEP}/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            mostrarToast('CEP não encontrado', 'erro');
            limparCamposEndereco();
            return;
        }

        inputEstado.value = dados.uf || '';
        inputCidade.value = dados.localidade || '';
        inputBairro.value = dados.bairro || '';
        inputLogradouro.value = dados.logradouro || '';
    } catch (erro) {
        console.error(erro);
        mostrarToast('Erro ao buscar o CEP', 'erro');
        limparCamposEndereco();
    } finally {
        botaoBuscarCEP.innerHTML = '<i class="fas fa-search"></i>';
        botaoBuscarCEP.disabled = false;
    }
}

function limparCamposEndereco() {
    inputEstado.value = '';
    inputCidade.value = '';
    inputBairro.value = '';
    inputLogradouro.value = '';
}

async function carregarEnderecos() {
    try {
        mostrarCarregamento(true);
        const resposta = await fetch(API_BASE);
        if (!resposta.ok) throw new Error('Erro ao carregar endereços')
        listaDeEnderecos = await resposta.json();
        renderizarEnderecos();
    } catch (erro) {
        console.error(erro);
        mostrarToast('Erro ao carregar endereços. Verifique o servidor.', 'erro');
        listaDeEnderecos = [];
        renderizarEnderecos();
    } finally {
        mostrarCarregamento(false);
    }
}

function renderizarEnderecos() {
  if (listaDeEnderecos.length === 0) {
    estadoVazio.classList.remove('hidden');
    containerEnderecos.classList.add('hidden');
    return;
  }

  estadoVazio.classList.add('hidden');
  containerEnderecos.classList.remove('hidden');

  containerEnderecos.innerHTML = listaDeEnderecos.map(endereco => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800 mb-2">
            <i class="fas fa-user text-blue-600 mr-2"></i>
            ${endereco.nome}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div><i class="fas fa-map-pin mr-1"></i>CEP: ${endereco.cep}</div>
            <div><i class="fas fa-map-marker-alt mr-1"></i>${endereco.cidade} - ${endereco.estado}</div>
            <div class="md:col-span-2"><i class="fas fa-road mr-1"></i>${endereco.logradouro}, ${endereco.bairro}</div>
          </div>
        </div>
        <div class="flex space-x-2 ml-4">
          <button onclick="editarEndereco(${endereco.id})" class="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="excluirEndereco(${endereco.id})" class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

async function salvarEndereco(evento) {
    evento.preventDefault();
    const dadosFormulario = new FormData(formulario);
    const endereco = Object.fromEntries(dadosFormulario.entries());
    if (idEmEdicao) {
        endereco.id = Number(idEmEdicao);
    } else {
        const maxId = Math.max(...listaDeEnderecos.map(e => Number(e.id) || 0), 0);
        endereco.id = maxId + 1;
    }
    
    if (!validarFormulario(endereco)) return;

    try {
        botaoSalvar.disabled = true;
        botaoSalvar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
        //POSSIVEL ERRO DE ID ESTÁ AQUI
        const config = {
            method: idEmEdicao ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(endereco)
        }

        const url = idEmEdicao ? `${API_BASE}/${idEmEdicao}` : API_BASE;
        console.log("Enviando para:", idEmEdicao);
        console.log("URL final:", url);
        console.log("Corpo:", endereco);
        const resposta = await fetch(url, config);

        if (!resposta.ok) throw new Error('Erro ao salvar endereco');

        mostrarToast(idEmEdicao ? 'Endereço atualizado com sucesso!' : 'Endereço cadastrado!', 'sucesso');
        limparFormulario();
        carregarEnderecos();
    } catch(erro) {
        console.error(erro);
        mostrarToast('Erro ao salva endereço', 'erro');
    } finally {
        botaoSalvar.disabled = false;
        botaoSalvar.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar';
    }
}

function validarFormulario(dados) {
  const camposObrigatorios = ['nome', 'cep', 'estado', 'cidade', 'bairro', 'logradouro'];
  const faltando = camposObrigatorios.filter(campo => !dados[campo] || dados[campo].trim() === '');


  if (faltando.length > 0) {
    mostrarToast('Todos os campos são obrigatórios', 'erro');
    return false
  }

  const cepNumerico = dados.cep.replace(/\D/g, '');
  if (cepNumerico.length !== 8) {
    mostrarToast('CEP inválido', 'erro');
    return false
  }

  return true;
}

function editarEndereco(id) {
  const endereco = listaDeEnderecos.find( e => String(e.id) === String(id));
  if (!endereco) return;

  idEmEdicao = id;
  inputNome.value = endereco.nome;
  inputCEP.value = endereco.cep;
  inputEstado.value = endereco.estado;
  inputCidade.value = endereco.cidade;
  inputBairro.value = endereco.bairro;
  inputLogradouro.value = endereco.logradouro;

  tituloFormulario.innerHTML = '<i class="fas fa-edit text-yellow-600 mr-2"></i>Editar Endereço';
  botaoCancelar.classList.remove('hidden');
  botaoSalvar.innerHTML = '<i class="fas fa-save mr-2"></i>Atualizar';

  formulario.scrollIntoView({behavior: 'smooth'});
}

function cancelarEdicao() {
  limparFormulario();
}

function limparFormulario() {
  formulario.reset();
  idEmEdicao = null;
  tituloFormulario.innerHTML = '<i class="fas fa-plus-circle text-green-600 mr-2"></i>Cadastrar Novo Endereço';
  botaoCancelar.classList.add('hidden');
  botaoSalvar.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar';
  limparCamposEndereco();
}

function excluirEndereco(id) {
  idParaExcluir = id;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

async function confirmarExclusao() {
  if ( !idParaExcluir) return;

  try {
    const resposta = await fetch(`${API_BASE}/${idParaExcluir}`, {method: 'DELETE'});
    if(!resposta.ok) throw new Error('Erro ao excluir endereço');

    mostrarToast('Endereço excluídp com sucesso!', 'sucesso');
    carregarEnderecos();

    if(idEmEdicao == idParaExcluir) {
      limparFormulario();
    }
  } catch (erro) {
    console.error(erro);
    mostrarToast('Erro ao excluir endereço', 'erro')
  } finally {
    fecharModal();
  }
}

function fecharModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  idParaExcluir = null;
}

function mostrarCarregamento(exibir) {
  if(exibir) {
    loading.classList.remove('hidden');
    containerEnderecos.classList.add('hidden');
    estadoVazio.classList.add('hidden');
  } else {
    loading.classList.add('hidden');
  }
}


function mostrarToast(mensagem, tipo = 'sucesso') {
  mensagemToast.textContent = mensagem;
  toast.className = 'toast';

  const icone = toast.querySelector('i');
  if (tipo === 'erro') {
    toast.classList.add('bg-red-600');
    icone.className = 'fas fa-times-circle mr-2';
  } else {
    toast.classList.add('bg-green-600');
    icone.className = 'fas fa-check-circle mr-2';
  }

  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Expõe para onclick no HTML
window.editarEndereco = editarEndereco;
window.excluirEndereco = excluirEndereco;