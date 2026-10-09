'use strict';
const PIX_KEY = '48996470603';
const CAMPAIGN_NAME = '3ª Ação Social de Natal 2026 — Içara/SC';
const toast = document.querySelector('#toast');
let toastTimeout;
function notify(message){
  if (!toast) return;
  toast.textContent = message;toast.classList.add('show');
  clearTimeout(toastTimeout);toastTimeout = setTimeout(()=>toast.classList.remove('show'),3500);
}
async function copyText(value){
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {await navigator.clipboard.writeText(value);return true;}
    const field = document.createElement('textarea');field.value = value;field.style.position='fixed';field.style.left='-9999px';document.body.appendChild(field);field.select();
    const copied=document.execCommand('copy');field.remove();return copied;
  }catch(error){return false;}
}
function showCopyFallback(value,message){
  window.prompt(message+' Copie o texto abaixo:',value);
}
document.querySelector('#copyPix')?.addEventListener('click',async()=>{
  if(await copyText(PIX_KEY)) notify('Chave PIX copiada! Confira o destinatário no seu banco.');
  else showCopyFallback(PIX_KEY,'Não foi possível copiar automaticamente.');
});
function formatCountdown(){
  const el=document.querySelector('#countdown');if(!el)return;
  const now=new Date();const deadline = new Date('2026-12-14T23:59:59-03:00');const ride = new Date('2026-12-18T00:00:00-03:00');
  if(now<=deadline){const days=Math.max(0,Math.ceil((deadline-now)/86400000));el.textContent=days===0?'Último dia para doar!':`${days} ${days===1?'dia restante':'dias restantes'} para doar`;}
  else if(now<ride){el.textContent='Arrecadação encerrada';}
  else{el.textContent='Prazo de doações encerrado';}
}
formatCountdown();
const menuBtn=document.querySelector('.menu-toggle');const menu=document.querySelector('#menu');
menuBtn?.addEventListener('click',()=>{const active=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(active));menuBtn.setAttribute('aria-label',active?'Fechar menu':'Abrir menu');});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');menuBtn?.setAttribute('aria-label','Abrir menu');}));
// Sponsors come exclusively from the published patrocinadores.js file.
// Edits in painel.html only reach this page after exporting and replacing that file.
function renderSponsors(){
  const grid=document.querySelector('#sponsorsGrid');if(!grid)return;
  grid.replaceChildren();
  const sponsors=Array.isArray(window.ACAO_PATROCINADORES)?window.ACAO_PATROCINADORES:[];
  const clean=sponsors.filter(s=>s && typeof s.name==='string' && s.name.trim());
  clean.sort((a,b)=>({Patrocinador:0,Apoiador:1,Parceiro:2}[a.level]??3)-({Patrocinador:0,Apoiador:1,Parceiro:2}[b.level]??3));
  const total=Math.max(6,Math.ceil(clean.length/3)*3);
  clean.forEach(s=>{
    const item=document.createElement('article');item.className='sponsor-real';
    if(typeof s.logo==='string' && /^(data:image\/(png|jpeg|webp);base64,|https:\/\/)/i.test(s.logo)){
      const img=document.createElement('img');img.src=s.logo;img.alt='Logo de '+s.name;img.loading='lazy';item.append(img);
    }
    const name=document.createElement('strong');name.className='sponsor-name';name.textContent=s.name;item.append(name);
    const level=document.createElement('span');level.className='sponsor-level';level.textContent=['Patrocinador','Apoiador','Parceiro'].includes(s.level)?s.level:'Parceiro';item.append(level);
    if(typeof s.url==='string' && /^https:\/\//i.test(s.url)){
      const link=document.createElement('a');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Conhecer empresa ↗';item.append(link);
    }
    grid.append(item);
  });
  for(let i=clean.length;i<total;i++){
    const item=document.createElement('div');item.className='sponsor-placeholder';item.innerHTML='<span aria-hidden="true">✳</span><strong>Sua marca aqui</strong><small>Seja um patrocinador</small>';grid.append(item);
  }
}
renderSponsors();
const sponsorDialog=document.querySelector('#sponsorDialog');
document.querySelector('#sponsorContact')?.addEventListener('click',()=>{sponsorDialog?.showModal();});
sponsorDialog?.addEventListener('click',event=>{if(event.target===sponsorDialog)sponsorDialog.close();});
document.querySelector('#buildSponsorMessage')?.addEventListener('click',async()=>{
  const name=document.querySelector('#companyName').value.trim();const type=document.querySelector('#contactType').value;
  const message=`Olá! Meu nome / minha empresa é ${name||'[seu nome ou empresa]'}. Tenho interesse em apoiar a 3ª Ação Social de Natal 2026, em Içara/SC. Gostaria de colaborar com: ${type.toLowerCase()}. Como podemos conversar sobre essa parceria?`;
  const feedback=document.querySelector('#sponsorMessageResult');
  if(await copyText(message)){feedback.textContent='Mensagem copiada! Envie aos organizadores pelo canal que você já utiliza.';notify('Mensagem de parceria copiada!');}
  else{feedback.textContent='Use a janela exibida para copiar sua mensagem.';showCopyFallback(message,'Copie sua mensagem de interesse.');}
});
document.querySelector('#shareCampaign')?.addEventListener('click',async()=>{
  const text=`🎄 ${CAMPAIGN_NAME}\nDoe doces ou contribua pelo PIX ${PIX_KEY} até 14/12/2026. Carreata em 18/12/2026!\nPontos de coleta: CIEE Criciúma, Pereira Soluções e Garage 445.\n${location.protocol.startsWith('http')?location.href.split('#')[0]:''}`.trim();
  if(navigator.share){try{await navigator.share({title:CAMPAIGN_NAME,text});return;}catch(err){if(err.name==='AbortError')return;}}
  if(await copyText(text))notify('Texto da campanha copiado para compartilhar!');else showCopyFallback(text,'Copie para compartilhar.');
});


// Vídeo da carreata: toca sem som para permitir autoplay em celulares.
// O áudio só é ativado depois de uma interação do visitante.
const natalVideo = document.querySelector('#natalVideo');
const videoPlayback = document.querySelector('#videoPlayback');
const videoPlaybackIcon = document.querySelector('#videoPlaybackIcon');
const videoSound = document.querySelector('#videoSound');
const videoSoundIcon = document.querySelector('#videoSoundIcon');
const videoSoundLabel = document.querySelector('#videoSoundLabel');
let userPausedVideo = false;

function updateVideoControls() {
  if (!natalVideo) return;
  const isPlaying = !natalVideo.paused;
  if (videoPlayback) {
    videoPlayback.setAttribute('aria-label', isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo');
    videoPlayback.title = isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo';
  }
  if (videoPlaybackIcon) videoPlaybackIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  const soundEnabled = !natalVideo.muted;
  if (videoSound) {
    videoSound.setAttribute('aria-label', soundEnabled ? 'Silenciar vídeo' : 'Ativar som');
    videoSound.setAttribute('aria-pressed', String(soundEnabled));
    videoSound.title = soundEnabled ? 'Silenciar vídeo' : 'Ativar som';
  }
  if (videoSoundIcon) videoSoundIcon.textContent = soundEnabled ? '♫' : '♪';
  if (videoSoundLabel) videoSoundLabel.textContent = soundEnabled ? 'Silenciar' : 'Ativar som';
}

if (natalVideo) {
  natalVideo.muted = true;
  natalVideo.loop = true;
  natalVideo.playsInline = true;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function tryAutoPlay() {
    if (userPausedVideo || reducedMotion) return;
    const attempt = natalVideo.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => updateVideoControls()); // Pode ser bloqueado pelo navegador; botão manual permanece disponível.
    }
  }
  if (reducedMotion) { natalVideo.pause(); userPausedVideo = true; }
  else tryAutoPlay();
  natalVideo.addEventListener('canplay', tryAutoPlay);
  natalVideo.addEventListener('play', updateVideoControls);
  natalVideo.addEventListener('pause', updateVideoControls);
  natalVideo.addEventListener('volumechange', updateVideoControls);
  natalVideo.addEventListener('error', () => {
    const errorMessage = document.querySelector('#videoError');
    if (errorMessage) errorMessage.hidden = false;
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryAutoPlay();
  });
  videoPlayback?.addEventListener('click', () => {
    if (natalVideo.paused) {
      userPausedVideo = false;
      // Reprodução iniciada por clique (também acessível em navegadores que bloqueiam autoplay).
      const attempt = natalVideo.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => notify('Não foi possível iniciar o vídeo neste navegador.'));
    } else {
      userPausedVideo = true;
      natalVideo.pause();
    }
    updateVideoControls();
  });
  videoSound?.addEventListener('click', () => {
    natalVideo.muted = !natalVideo.muted;
    updateVideoControls();
  });
  updateVideoControls();
}
