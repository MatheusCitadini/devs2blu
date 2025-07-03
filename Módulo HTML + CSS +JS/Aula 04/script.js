document.getElementById('formNotas').addEventListener('submit', function(event) {
  event.preventDefault();

  const n1 = parseFloat(document.getElementById('nota1').value);
  const n2 = parseFloat(document.getElementById('nota2').value);
  const n3 = parseFloat(document.getElementById('nota3').value);

  const media = (n1 + n2 + n3) / 3;
  let situacao = '';
  let emoji = '';
  let cor = '';

  if (media >= 7) {
    situacao = 'Aprovado';
    emoji = '✅';
    cor = '#27ae60';
  } else if (media >= 5) {
    situacao = 'Recuperação';
    emoji = '⚠️';
    cor = '#f39c12';
  } else {
    situacao = 'Reprovado';
    emoji = '❌';
    cor = '#e74c3c';
  }

  const resultadoDiv = document.getElementById('resultadoNotas');
  resultadoDiv.innerHTML = `
    <div style="text-align: center; padding: 20px; background: ${cor}; color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <div style="font-size: 2rem; margin-bottom: 10px;">${emoji}</div>
      <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 5px;">Média: ${media.toFixed(1)}</div>
      <div style="font-size: 1.1rem;">Situação: ${situacao}</div>
    </div>
  `;
  
  resultadoDiv.style.opacity = '0';
  resultadoDiv.style.transform = 'translateY(20px)';
  setTimeout(() => {
    resultadoDiv.style.transition = 'all 0.5s ease';
    resultadoDiv.style.opacity = '1';
    resultadoDiv.style.transform = 'translateY(0)';
  }, 100);
});

document.getElementById('formConversor').addEventListener('submit', function(event) {
  event.preventDefault();

  const valor = parseFloat(document.getElementById('valor').value);
  const moeda = document.getElementById('moeda').value;

  let taxa = 0;
  let simbolo = '';
  let nome = '';

  switch (moeda) {
    case 'dolar':
      taxa = 5.30;
      simbolo = 'US$';
      nome = 'Dólar Americano';
      break;
    case 'euro':
      taxa = 5.80;
      simbolo = '€';
      nome = 'Euro';
      break;
    case 'libra':
      taxa = 6.70;
      simbolo = '£';
      nome = 'Libra Esterlina';
      break;
    case 'bitcoin':
      taxa = 594147;
      simbolo = '₿';
      nome = 'Bitcoin';
      break;
  }

  const resultado = valor / taxa;
  const casasDecimais = moeda === 'bitcoin' ? 8 : 2;

  const resultadoDiv = document.getElementById('resultadoConversao');
  resultadoDiv.innerHTML = `
    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <div style="font-size: 1.5rem; margin-bottom: 10px;">💰</div>
      <div style="font-size: 0.9rem; margin-bottom: 5px;">R$ ${valor.toFixed(2)} equivale a:</div>
      <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 5px;">${simbolo} ${resultado.toFixed(casasDecimais)}</div>
      <div style="font-size: 0.8rem; opacity: 0.9;">${nome}</div>
    </div>
  `;

  resultadoDiv.style.opacity = '0';
  resultadoDiv.style.transform = 'scale(0.9)';
  setTimeout(() => {
    resultadoDiv.style.transition = 'all 0.5s ease';
    resultadoDiv.style.opacity = '1';
    resultadoDiv.style.transform = 'scale(1)';
  }, 100);
});

const numeroSecreto = Math.floor(Math.random() * 100) + 1;
let tentativas = 0;
let jogoAcabou = false;

const formAdivinha = document.getElementById('formAdivinha');
const inputAdivinha = document.getElementById('tentativa');
const mensagemDiv = document.getElementById('mensagem');

formAdivinha.addEventListener('submit', function (e) {
  e.preventDefault();

  if (jogoAcabou) {
    location.reload();
    return;
  }

  const chute = parseInt(inputAdivinha.value);
  tentativas++;

  const diferenca = Math.abs(chute - numeroSecreto);

  if (chute === numeroSecreto) {
    jogoAcabou = true;
    mensagemDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; background: #27ae60; color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="font-size: 2rem; margin-bottom: 10px;">🎉</div>
        <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 10px;">Parabéns! Você acertou!</div>
        <div style="font-size: 1.1rem; margin-bottom: 5px;">O número era <strong>${numeroSecreto}</strong></div>
        <div style="font-size: 1rem;">Tentativas: <strong>${tentativas}</strong></div>
      </div>
    `;
    
    const button = formAdivinha.querySelector('button');
    button.textContent = 'Jogar Novamente';
    button.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    
    inputAdivinha.disabled = true;
  } else {
    let dica = '';
    let emoji = '';
    let cor = '';

    if (diferenca <= 5) {
      dica = 'Muito quente! Quase lá!';
      emoji = '🔥';
      cor = '#e74c3c';
    } else if (diferenca <= 10) {
      dica = 'Quente! Você está próximo!';
      emoji = '🌡️';
      cor = '#f39c12';
    } else if (diferenca <= 20) {
      dica = 'Morno... Tente mais!';
      emoji = '🤔';
      cor = '#f39c12';
    } else {
      dica = 'Frio! Muito longe!';
      emoji = '❄️';
      cor = '#3498db';
    }

    let dicaDirecao = '';
    if (chute < numeroSecreto) {
      dicaDirecao = 'Tente um número MAIOR!';
    } else {
      dicaDirecao = 'Tente um número MENOR!';
    }

    mensagemDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; background: ${cor}; color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="font-size: 2rem; margin-bottom: 10px;">${emoji}</div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">${dica}</div>
        <div style="font-size: 1rem; margin-bottom: 5px;">${dicaDirecao}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">Tentativas: ${tentativas}</div>
      </div>
    `;
    
    inputAdivinha.value = '';
    inputAdivinha.focus();
  }

  mensagemDiv.style.opacity = '0';
  mensagemDiv.style.transform = 'translateX(-20px)';
  setTimeout(() => {
    mensagemDiv.style.transition = 'all 0.5s ease';
    mensagemDiv.style.opacity = '1';
    mensagemDiv.style.transform = 'translateX(0)';
  }, 100);
});

const formTabuada = document.getElementById('formTabuada');
const inputTabuada = document.getElementById('numero');
const resultadoTabuada = document.getElementById('resultadoTabuada');

formTabuada.addEventListener('submit', function (e) {
  e.preventDefault();

  const numero = parseInt(inputTabuada.value);
  let tabuadaHTML = `
    <div style="text-align: center; margin-bottom: 20px; color: #3498db; font-size: 1.3rem;">
      📘 Tabuada do ${numero}
    </div>
  `;

  for (let i = 1; i <= 10; i++) {
    tabuadaHTML += `
      <div style="padding: 8px; margin: 5px 0; background: rgba(52, 152, 219, 0.1); border-radius: 5px; font-family: 'Courier New', monospace; font-size: 1.1rem;">
        ${numero} × ${i} = <span style="color: #3498db; font-weight: bold;">${numero * i}</span>
      </div>
    `;
  }

  resultadoTabuada.innerHTML = tabuadaHTML;

  resultadoTabuada.style.opacity = '0';
  setTimeout(() => {
    resultadoTabuada.style.transition = 'all 0.5s ease';
    resultadoTabuada.style.opacity = '1';
  }, 100);
});

document.getElementById('formFatorial').addEventListener('submit', function (e) {
  e.preventDefault();

  const numero = parseInt(document.getElementById('numeroFatorial').value);
  let resultado = 1;
  let calculo = '';

  if (numero === 0 || numero === 1) {
    resultado = 1;
    calculo = `${numero}! = 1`;
  } else {
    let fatorialArray = [];
    for (let i = numero; i >= 1; i--) {
      fatorialArray.push(i);
      resultado *= i;
    }
    calculo = `${numero}! = ${fatorialArray.join(' × ')}`;
  }

  const resultadoDiv = document.getElementById('resultadoFatorial');
  resultadoDiv.innerHTML = `
    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <div style="font-size: 1.5rem; margin-bottom: 10px;">🔢</div>
      <div style="font-size: 1.1rem; margin-bottom: 10px; font-family: 'Courier New', monospace;">${calculo}</div>
      <div style="font-size: 1.3rem; font-weight: bold;">= ${resultado.toLocaleString()}</div>
    </div>
  `;

  resultadoDiv.style.opacity = '0';
  resultadoDiv.style.transform = 'rotateY(90deg)';
  setTimeout(() => {
    resultadoDiv.style.transition = 'all 0.6s ease';
    resultadoDiv.style.opacity = '1';
    resultadoDiv.style.transform = 'rotateY(0deg)';
  }, 100);
});

document.getElementById('formIMC').addEventListener('submit', function (e) {
  e.preventDefault();

  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);

  const imc = peso / (altura * altura);
  let classificacao = '';
  let emoji = '';
  let cor = '';
  let dica = '';

  if (imc < 18.5) {
    classificacao = 'Abaixo do peso';
    emoji = '⚖️';
    cor = '#3498db';
    dica = 'Considere uma dieta para ganhar peso saudável';
  } else if (imc < 25) {
    classificacao = 'Peso normal';
    emoji = '✅';
    cor = '#27ae60';
    dica = 'Parabéns! Seu peso está ideal';
  } else if (imc < 30) {
    classificacao = 'Sobrepeso';
    emoji = '⚠️';
    cor = '#f39c12';
    dica = 'Considere uma dieta balanceada e exercícios';
  } else if (imc < 35) {
    classificacao = 'Obesidade grau 1';
    emoji = '🚨';
    cor = '#e67e22';
    dica = 'Procure orientação médica e nutricional';
  } else if (imc < 40) {
    classificacao = 'Obesidade grau 2';
    emoji = '🚨';
    cor = '#e74c3c';
    dica = 'Procure orientação médica urgente';
  } else {
    classificacao = 'Obesidade grau 3';
    emoji = '🚨';
    cor = '#c0392b';
    dica = 'Procure orientação médica imediatamente';
  }

  const resultadoDiv = document.getElementById('resultadoIMC');
  resultadoDiv.innerHTML = `
    <div style="text-align: center; padding: 20px; background: ${cor}; color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <div style="font-size: 2rem; margin-bottom: 10px;">${emoji}</div>
      <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 10px;">IMC: ${imc.toFixed(1)}</div>
      <div style="font-size: 1.2rem; margin-bottom: 10px; font-weight: bold;">${classificacao}</div>
      <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">${dica}</div>
    </div>
  `;

  resultadoDiv.style.opacity = '0';
  resultadoDiv.style.transform = 'scale(0.8)';
  setTimeout(() => {
    resultadoDiv.style.transition = 'all 0.6s ease';
    resultadoDiv.style.opacity = '1';
    resultadoDiv.style.transform = 'scale(1)';
  }, 100);
});

document.getElementById('formAno').addEventListener('submit', function (e) {
  e.preventDefault();

  const ano = parseInt(document.getElementById('ano').value);
  const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
  
  let emoji = '';
  let cor = '';
  let explicacao = '';

  if (bissexto) {
    emoji = '✅';
    cor = '#27ae60';
    explicacao = 'Este ano tem 366 dias (29 de fevereiro)';
  } else {
    emoji = '❌';
    cor = '#e74c3c';
    explicacao = 'Este ano tem 365 dias (28 de fevereiro)';
  }

  const resultadoDiv = document.getElementById('resultadoAno');
  resultadoDiv.innerHTML = `
    <div style="text-align: center; padding: 20px; background: ${cor}; color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <div style="font-size: 2rem; margin-bottom: 10px;">${emoji}</div>
      <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 10px;">
        ${ano} ${bissexto ? 'É' : 'NÃO é'} bissexto
      </div>
      <div style="font-size: 1rem; opacity: 0.9;">${explicacao}</div>
    </div>
  `;

  resultadoDiv.style.opacity = '0';
  resultadoDiv.style.transform = 'translateY(20px)';
  setTimeout(() => {
    resultadoDiv.style.transition = 'all 0.5s ease';
    resultadoDiv.style.opacity = '1';
    resultadoDiv.style.transform = 'translateY(0)';
  }, 100);
});