# Contatos · Gabinete Estadual DeMolay SP

Diretório de contatos oficiais do Gabinete Estadual da Ordem DeMolay de São Paulo.
HTML, CSS e JavaScript puros: sem build e sem instalar nada.

```
index.html          página
css/style.css       visual
js/app.js           busca, filtro, cards e configuração do cabeçalho
data/membros.js     lista de membros (o único arquivo que você precisa editar no dia a dia)
assets/logo-demolay-sp.png, bg-header.png, bg-footer.png
                    logo e padrões geométricos do site da DMSP
```

O visual segue a identidade do site da DMSP (demolaysp.org.br): fonte Manrope,
preto `#0c0a0c`, vinho `#7c152a`, vermelho `#b11f37`, dourado `#d7a35a` e fundo
creme `#f6f1ed`. As cores ficam no topo de `css/style.css` (`:root`).

Para ver no computador, abra o `index.html` com dois cliques.

## Adicionar ou editar membros

Abra `data/membros.js` e copie um bloco:

```js
{
  nome: "Nome Completo do Membro",
  cargo: "Assessor de Comunicação",
  area: "Comunicação",
  telefone: "(11) 91234-5678",
  digitos: "11912345678",
},
```

- **area**: cada área diferente vira uma seção, criada sozinha. As seções seguem a
  ordem em que aparecem no arquivo, e a "Direção Estadual" vem sempre primeiro.
  Use exatamente o mesmo texto para todos da mesma área.
- **ordem dentro da seção**: o Mestre Conselheiro Estadual, o Adjunto e o Secretário
  (cargo começando com "Secretário") sobem para o topo sozinhos. Os outros seguem a
  ordem do arquivo.
- **telefone / digitos**: `digitos` são só os números com DDD, usados nos botões de
  WhatsApp e Ligar. Se você deixar o campo de fora, ele é calculado a partir do `telefone`.
- **detalhe** (opcional): etiqueta pequena no card, como `"Macro A+B"` nos Mestres
  Conselheiros Regionais. Também entra na busca ("macro c" traz só a Macro C).
- **ddi** (opcional): só para número de fora do Brasil. Ex.: `ddi: "1"` com
  `telefone: "(321) 410-9356"` vira +1 (321) 410-9356 e o WhatsApp abre `wa.me/13214109356`.
- Nomes digitados em CAIXA ALTA aparecem em Title Case ("da", "de", "do", "dos" ficam
  em minúsculas). Nomes que já têm minúsculas ficam exatamente como escritos.
- Uma pessoa com dois cargos (ex.: Assessor e Mestre Conselheiro Regional) entra uma
  vez em cada área.
- Não esqueça a vírgula entre um bloco e outro.

## Trocar o logo, o subtítulo e a gestão

O logo "DeMolay São Paulo" da barra superior é o da DMSP (`assets/logo-demolay-sp.png`).
Para mostrar um brasão grande acima do título, coloque o arquivo em `assets/` (PNG
quadrado com fundo transparente, 512×512 px ou mais) e preencha `logo` no `CONFIG`.
Com `logo: ""` nenhum emblema aparece.

Para usar outro nome de arquivo, ou mudar os textos do cabeçalho, edite o bloco
`CONFIG` no topo de `js/app.js`:

```js
const CONFIG = {
  gestao: "Gestão 2026/2027",
  linhaSuperior: "DeMolay São Paulo",
  titulo: "Gabinete Estadual",
  subtitulo: "Unidos pelo Ideal.",  // 2ª linha do título ("" para ocultar)
  logo: "",                         // ex.: "assets/brasao.png"
  ...
};
```

## Publicar no GitHub Pages

1. Envie estes arquivos para um repositório no GitHub (a `index.html` na raiz).
2. No repositório: **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, selecione a branch (ex.: `main`) e a pasta `/ (root)`. Clique em **Save**.
4. Em um ou dois minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Cada alteração enviada para essa branch atualiza o site sozinha.

A página tem `noindex, nofollow`, então não aparece no Google. Mas qualquer pessoa
com o link consegue abrir: compartilhe só nos grupos da Ordem.
