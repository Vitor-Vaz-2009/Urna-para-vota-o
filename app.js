// ======================================================
// CONFIGURAÇÕES
// ======================================================

const CHAPAS_STORAGE = "urnaChapas";
const VOTOS_STORAGE = "urnaVotos";

let numeroDigitado = "";
let votoAtual = null;

let eleicaoEncerrada =
    localStorage.getItem("eleicaoEncerrada") === "true";


// ======================================================
// CARREGAR CHAPAS
// ======================================================

function obterChapas() {

    const chapasSalvas =
        localStorage.getItem(CHAPAS_STORAGE);

    if (chapasSalvas) {

        try {

            const chapas =
                JSON.parse(chapasSalvas);

            if (Array.isArray(chapas)) {

                return chapas;

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar chapas:",
                erro
            );

        }

    }


    // Se ainda não existir nenhuma chapa cadastrada,
    // começa com uma lista vazia.
    const chapasVazias = [];


    localStorage.setItem(
        CHAPAS_STORAGE,
        JSON.stringify(chapasVazias)
    );


    return chapasVazias;

}


// ======================================================
// SALVAR CHAPAS
// ======================================================

function salvarChapas(chapas) {

    localStorage.setItem(
        CHAPAS_STORAGE,
        JSON.stringify(chapas)
    );

}


// ======================================================
// CARREGAR VOTOS
// ======================================================

let votos =
    JSON.parse(
        localStorage.getItem(VOTOS_STORAGE)
    ) || {};


// ======================================================
// INICIALIZAÇÃO DOS VOTOS
// ======================================================

function inicializarVotos() {

    const chapas =
        obterChapas();


    chapas.forEach(chapa => {

        if (votos[chapa.numero] === undefined) {

            votos[chapa.numero] = 0;

        }

    });


    if (votos.brancos === undefined) {

        votos.brancos = 0;

    }


    if (votos.nulos === undefined) {

        votos.nulos = 0;

    }


    salvarDados();

}


inicializarVotos();


// ======================================================
// SALVAR VOTOS
// ======================================================

function salvarDados() {

    localStorage.setItem(
        VOTOS_STORAGE,
        JSON.stringify(votos)
    );

}


// ======================================================
// SOM DAS TECLAS
// ======================================================

let proximoSomTecla = 1;


function tocarSomTecla() {

    let caminhoSom;


    if (proximoSomTecla === 1) {

        caminhoSom = "sons/tecla1.mp3";

        proximoSomTecla = 2;

    } else {

        caminhoSom = "sons/tecla2.mp3";

        proximoSomTecla = 1;

    }


    const audio =
        new Audio(caminhoSom);

    audio.currentTime = 0;


    audio.play().catch(erro => {

        console.log(
            "Erro ao reproduzir som da tecla:",
            caminhoSom,
            erro
        );

    });

}


// ======================================================
// SOM DE CONFIRMAÇÃO
// ======================================================

function tocarSomConfirma() {

    const audio =
        new Audio(
            "sons/confirma.mp3"
        );

    audio.currentTime = 0;


    audio.play().catch(erro => {

        console.log(
            "Erro ao reproduzir som de confirmação:",
            erro
        );

    });

}


// ======================================================
// DIGITAR NÚMERO
// ======================================================

function digitar(numero) {

    if (eleicaoEncerrada) {

        return;

    }


    if (numeroDigitado.length >= 2) {

        return;

    }


    numeroDigitado += numero;


    tocarSomTecla();


    atualizarTela();


    procurarChapa();

}


// ======================================================
// ATUALIZAR NÚMERO NA TELA
// ======================================================

function atualizarTela() {

    document.getElementById(
        "digitos"
    ).textContent =
        numeroDigitado;

}


// ======================================================
// PROCURAR CHAPA
// ======================================================

function procurarChapa() {

    const chapas =
        obterChapas();


    const chapa =
        chapas.find(
            c =>
                String(c.numero) ===
                String(numeroDigitado)
        );


    const nome =
        document.getElementById(
            "nome-chapa"
        );


    const situacao =
        document.getElementById(
            "situacao"
        );


    const foto =
        document.getElementById(
            "foto-chapa"
        );


    const mensagem =
        document.getElementById(
            "mensagem"
        );


    if (chapa) {

        votoAtual = chapa;


        nome.textContent =
            chapa.nome;


        situacao.textContent =
            "VOTO VÁLIDO";


        foto.src =
            chapa.foto;


        foto.style.display =
            "block";


        mensagem.textContent =
            "CONFIRA OS DADOS E APERTE CONFIRMA.";

    } else {

        votoAtual = "nulo";


        nome.textContent =
            "";


        situacao.textContent =
            "NÚMERO NÃO ENCONTRADO";


        foto.src =
            "";


        foto.style.display =
            "none";


        mensagem.textContent =
            "NÚMERO NÃO ENCONTRADO — VOTO NULO.";

    }

}


// ======================================================
// CORRIGIR VOTO
// ======================================================

function corrigir() {

    numeroDigitado = "";

    votoAtual = null;


    atualizarTela();


    document.getElementById(
        "nome-chapa"
    ).textContent = "";


    document.getElementById(
        "situacao"
    ).textContent = "";


    document.getElementById(
        "foto-chapa"
    ).src = "";


    document.getElementById(
        "foto-chapa"
    ).style.display =
        "none";


    document.getElementById(
        "mensagem"
    ).textContent = "";

}


// ======================================================
// VOTO EM BRANCO
// ======================================================

function branco() {

    if (eleicaoEncerrada) {

        return;

    }


    numeroDigitado = "";

    votoAtual = "branco";


    atualizarTela();


    document.getElementById(
        "nome-chapa"
    ).textContent = "";


    document.getElementById(
        "situacao"
    ).textContent =
        "VOTO EM BRANCO";


    document.getElementById(
        "foto-chapa"
    ).src = "";


    document.getElementById(
        "foto-chapa"
    ).style.display =
        "none";


    document.getElementById(
        "mensagem"
    ).textContent =
        "VOTO EM BRANCO. APERTE CONFIRMA.";

}


// ======================================================
// CONFIRMAR VOTO
// ======================================================

function confirmar() {

    if (eleicaoEncerrada) {

        return;

    }


    if (votoAtual === null) {

        document.getElementById(
            "mensagem"
        ).textContent =
            "DIGITE O NÚMERO DE UMA CHAPA OU ESCOLHA BRANCO.";

        return;

    }


    if (votoAtual === "branco") {

        votos.brancos++;

    }


    else if (votoAtual === "nulo") {

        votos.nulos++;

    }


    else {

        if (
            votos[votoAtual.numero] ===
            undefined
        ) {

            votos[votoAtual.numero] = 0;

        }


        votos[votoAtual.numero]++;

    }


    salvarDados();


    tocarSomConfirma();


    document.getElementById(
        "mensagem"
    ).textContent =
        "VOTO CONFIRMADO!";


    setTimeout(() => {

        corrigir();

    }, 1500);

}