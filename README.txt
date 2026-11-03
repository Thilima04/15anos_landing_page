CONVITE DIGITAL — JÚLIA LIMA

Abra index.html no navegador para visualizar o convite.

WHATSAPP
Em script.js, preencha WHATSAPP_NUMBER com DDI + DDD + número,
apenas dígitos (por exemplo: 5531999999999).
Enquanto o número estiver vazio, o botão apresenta um aviso de
confirmação disponível em breve, sem abrir um endereço inválido.

VISUAL E EFEITOS
Fundo floral inspirado na referência, papel verde e marfim,
moldura dourada, título caligráfico e ícones desenhados.
Pétalas flutuantes nas laterais, brilhos dourados nas bordas,
luz suave nas flores, nome verde com contorno dourado, reflexo nos ícones, halo e rastro
do cursor, entrada dos textos ao rolar e brilho no botão RSVP.
Os efeitos iniciam automaticamente e permanecem ativos durante a visita.
Três pontos de luz percorrem a moldura com caudas douradas.
Toques no papel criam uma pequena chuva de estrelas; os botões
mantêm suas ações normais. As animações pausam quando a aba fica em
segundo plano e retomam automaticamente ao voltar ao convite.
Layout adaptável a celular e computador.
Em celulares, os textos têm tamanho mínimo de 18px, os detalhes quebram
em linhas e a confirmação aparece centralizada com botão de 48px.
Layout conferido em larguras de 320, 390, 430 e 768 pixels, sem rolagem lateral.

PUBLICAÇÃO
Publique index.html, style.css, script.js, robots.txt, vercel.json
e a pasta assets inteira, preservando sua estrutura.
As imagens WebP e as fontes WOFF2 são locais: não há requisições
ao Google Fonts durante a visita. As licenças estão em assets/fonts.
vercel.json configura cache dos recursos na Vercel.
As imagens PNG e as prévias JPG são fontes/arquivos de revisão;
não são baixadas pela página e podem ficar fora da publicação.

OTIMIZAÇÕES DE DESEMPENHO
Fundo original: 2.030.006 bytes. Versões entregues: 39.708 bytes
(480px), 82.642 bytes (768px), 123.722 bytes (1024px).
O navegador antecipa a imagem adequada e as duas fontes locais.
O conteúdo inicial não depende das animações de entrada.
As animações CSS contínuas usam transform/opacity; luzes, sombras
e pétalas do canvas são preparadas uma vez e reutilizadas.
O canvas cobre apenas a tela visível, limita a resolução a 1,5x
e desenha até 30 quadros por segundo; pausa fora da área visível.
Os efeitos continuam automáticos, sem botão de ativação.

Para recriar imagens e obter as fontes: python tools/prepare-assets.py
(requer Pillow; o download inicial das fontes requer internet).
