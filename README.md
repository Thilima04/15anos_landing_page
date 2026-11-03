# Convite de 15 anos — Júlia Lima

Convite digital com tema floral verde e dourado, adaptado para celular e computador.

- Pétalas, brilhos e iluminação animados, ativados automaticamente.
- Confirmação de presença pelo WhatsApp.
- Endereço com link para o Google Maps.
- Imagens WebP responsivas e fontes WOFF2 locais.
- Animações otimizadas e canvas limitado à área visível.

## Visualizar

Abra `index.html` ou execute na pasta do projeto:

```sh
python -m http.server 5173
```

Acesse <http://localhost:5173>.

## Publicar na Vercel

Importe este repositório como site estático, usando a raiz do projeto como diretório de publicação e sem comando de build. O arquivo `vercel.json` configura o cache dos recursos.

Os arquivos de produção são `index.html`, `style.css`, `script.js`, `robots.txt`, `vercel.json` e a pasta `assets/`. Os PNGs originais e as prévias JPG são arquivos de referência e não são carregados pelo site.

## Manutenção

O telefone de confirmação fica em `WHATSAPP_NUMBER`, no arquivo `script.js`. Os textos, o horário e o endereço ficam em `index.html`.

Para verificar os recursos e gerar um pacote de publicação:

```sh
python tools/verify-assets.py
python tools/package-release.py
```

Para recriar as imagens otimizadas e obter as fontes, instale Pillow e execute `python tools/prepare-assets.py`. As licenças das fontes estão em `assets/fonts/`.

## Desempenho

A auditoria Lighthouse local de novembro de 2026 mediu 98 em desempenho e 100 em acessibilidade, boas práticas e SEO. As notas podem variar conforme rede, dispositivo e ambiente de publicação.
