# 3ª Ação Social de Natal — Içara/SC (2026)

Site de divulgação com vídeo em reprodução contínua e painel local de gestão de patrocinadores. Projeto totalmente estático, sem mensalidade, pronto para hospedar gratuitamente no **GitHub Pages**.

## Abrir e testar

- Clique duas vezes em `index.html` para abrir o site no navegador.
- Abra `painel.html` para cadastrar patrocinadores e gerar textos de divulgação.
- Para uma prévia mais fiel, no VS Code use a extensão Live Server (ou rode `python -m http.server 8000` e entre em `http://localhost:8000`).

## Publicar gratuitamente com GitHub Pages

1. Crie um repositório **público** no GitHub, por exemplo `acao-social-natal-2026`.
2. Envie **todos os arquivos e a pasta `assets/`**, mantendo a organização abaixo. Não altere os nomes de fotos ou caminhos.
3. Entre em **Settings → Pages**, em **Build and deployment**, escolha **Deploy from a branch**. Selecione `main` e a pasta `/(root)`; salve.
4. Acesse o endereço exibido em Pages, por exemplo `https://SEU-USUARIO.github.io/acao-social-natal-2026/`.
5. O site é responsivo e funciona com a versão hospedada; não exige servidor ou banco de dados.

## Adicionar patrocinadores

1. Abra `painel.html` no navegador, cadastre empresa, categoria, site/Instagram e, opcionalmente, imagem da logomarca.
2. Clique em **Baixar arquivo para publicar**. Isso baixa um novo `patrocinadores.js`.
3. Substitua o `patrocinadores.js` na raiz do repositório, confirme o commit e aguarde a atualização do GitHub Pages.
4. Abra o site público e confira a seção de patrocinadores.

**Importante:** o painel usa o armazenamento **local do navegador**. As edições **não são sincronizadas** com outros dispositivos nem aparecem automaticamente no site publicado. Para levar as marcas a outros navegadores, importe o arquivo `patrocinadores.js` exportado. O painel é acessível publicamente caso seja hospedado com os demais arquivos, mas **não altera o site sem que você faça o upload**. Não coloque senhas ou dados privados nele. Se quiser que o painel fique fora do ar, simplesmente não publique `painel.html` nem `painel.js`/`painel.css`: ele funciona no seu computador.

> Um SaaS com painel autenticado, alterações em tempo real, gestão de equipes e banco de dados compartilhado precisará de um backend e controle de acesso. Este projeto é um MVP de portal + gerenciador local para publicação gratuita, e **não** um SaaS multiusuário com backend.

## Arquivos

```
acao-social-natal-2026/
├── index.html                  # página da campanha
├── styles.css                  # estilos adaptados a celular/desktop
├── script.js                   # PIX, contagem, menu, patrocinadores, compartilhamento
├── patrocinadores.js          # lista pública de marcas (inicialmente vazia)
├── painel.html                 # editor local de patrocinadores
├── painel.css                  # estilos do editor
├── painel.js                   # lógica do editor local e exportação
├── README.md
├── TEXTOS-DE-DIVULGACAO.md    # posts para Instagram, WhatsApp e empresas
└── assets/
    ├── video-natal.mp4          # vídeo original, reproduzido automaticamente em loop
    ├── capa-video-natal.jpg    # imagem de capa antes de carregar o vídeo
    ├── balas2024.jpeg
    ├── balas2025.jpeg
    ├── todomundo.jpeg
    └── favicon.svg
```

## Informações cadastradas

- **Cidade:** Içara, SC.
- **Arrecadação até:** 14/12/2026.
- **Carreata:** 18/12/2026.
- **Chave PIX:** `48996470603` (identificador de celular, sem QR code de cobrança).
- **Coleta:** CIEE Criciúma, Pereira Soluções, Garage 445.

Os botões de localização **fazem uma busca no Google Maps**, pois não foram fornecidos endereços oficiais. Confirme com cada ponto antes de divulgar endereços/horários. O botão de parceria apenas prepara e copia uma mensagem: **não a envia a nenhum número**, já que não foi fornecido canal de contato da organização.

## Segurança e transparência

- As informações de pagamento **não são processadas no site**. O visitante copia a chave e conclui o PIX no banco, onde deverá conferir quem recebe.
- Não existem valores arrecadados ou número de crianças alcançadas inventados.
- Para cadastrar logomarcas, use apenas imagens que sua organização tem autorização de publicar.
- A presença de `painel.html` na web **não representa autenticação**. Em um painel real com registros de doações ou contas de usuários, a autenticação e validação precisam acontecer em servidor.

## Vídeo da campanha

- O vídeo está na seção **“Assista ao vídeo”**, perto do começo da página, após os números da campanha.
- É um arquivo local (`assets/video-natal.mp4`), não depende de YouTube, Instagram ou serviços pagos.
- As opções HTML `autoplay muted loop playsinline` fazem o vídeo iniciar automaticamente, tocar **sem som** e reiniciar ao fim, inclusive em navegadores de celular que permitem autoplay sem áudio.
- O visitante pode usar **Ativar som** ou **Pausar/Reproduzir**. O áudio nunca é ligado automaticamente.
- Alguns navegadores ou modos de economia de energia podem bloquear a reprodução automática. Nesse caso, basta tocar em **Reproduzir vídeo**.
- Para quem ativou a preferência de acessibilidade de reduzir movimentos, o JavaScript pausa o vídeo inicialmente e deixa o botão de reprodução disponível.
- Ao publicar no GitHub Pages, **envie a pasta `assets/` inteira, inclusive o `.mp4`**. Se faltar esse arquivo, o vídeo não abrirá.
- O vídeo original tem cerca de **29 segundos** e é apresentado em retrato (9:16), respeitando o enquadramento.
