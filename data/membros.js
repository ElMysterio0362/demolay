/*
 * Dados do Gabinete Estadual — DeMolay São Paulo
 * ------------------------------------------------
 * Para adicionar alguém, copie um bloco { ... } e altere os campos.
 *
 *  nome      → nome completo em Title Case ("Carlos Eduardo da Silva Filho")
 *  cargo     → cargo exibido no card
 *  area      → nome da seção. Uma área nova vira uma seção nova automaticamente.
 *              As seções aparecem na ordem em que cada área surge pela 1ª vez aqui.
 *  telefone  → formato (DD) 9XXXX-XXXX
 *  digitos   → só os números (DDD + celular), usado nos links de WhatsApp/Ligar.
 *              Se ficar vazio, é calculado a partir do "telefone".
 *
 * Dentro de cada seção, o Mestre Conselheiro Estadual, o Adjunto e os
 * Secretários aparecem primeiro automaticamente; os demais seguem a ordem daqui.
 */
const MEMBROS = [
  // ── Direção Estadual ──────────────────────────────────────────
  {
    nome: "Gabriel Ale Favaleça",
    cargo: "Mestre Conselheiro Estadual",
    area: "Direção Estadual",
    telefone: "(17) 99622-0111",
    digitos: "17996220111",
  },
  {
    nome: "Julio Borges Lopes",
    cargo: "Mestre Conselheiro Estadual Adj.",
    area: "Direção Estadual",
    telefone: "(19) 97122-9795",
    digitos: "19971229795",
  },

  // ── Ações Sociais ─────────────────────────────────────────────
  {
    nome: "Gustavo da Rocha Abbud",
    cargo: "Secretário de Ações Sociais",
    area: "Ações Sociais",
    telefone: "(11) 98153-0939",
    digitos: "11981530939",
  },
  {
    nome: "Gabriel Carvalho de Siqueira Coelho",
    cargo: "Assessor de Ações Sociais",
    area: "Ações Sociais",
    telefone: "(13) 99660-0418",
    digitos: "13996600418",
  },
  {
    nome: "Carlos Eduardo da Silva Filho",
    cargo: "Assessor de Ações Sociais",
    area: "Ações Sociais",
    telefone: "(16) 99237-1894",
    digitos: "16992371894",
  },
  {
    nome: "João Pedro Pelegrini Paiva",
    cargo: "Assessor de Ações Sociais",
    area: "Ações Sociais",
    telefone: "(19) 99893-0882",
    digitos: "19998930882",
  },
  {
    nome: "Kauan Rocco Bragião",
    cargo: "Assessor de Ações Sociais",
    area: "Ações Sociais",
    telefone: "(19) 99887-0106",
    digitos: "19998870106",
  },
  {
    nome: "Matheus Sanches Signorelli dos Reis",
    cargo: "Assessor de Ações Sociais",
    area: "Ações Sociais",
    telefone: "(16) 99101-4648",
    digitos: "16991014648",
  },
];
