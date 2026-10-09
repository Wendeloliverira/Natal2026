'use strict';
const STORAGE_KEY = 'acao-natal-2026-sponsors-v1';
const initialSponsors = Array.isArray(window.ACAO_PATROCINADORES) ? window.ACAO_PATROCINADORES : [];
const toast=document.querySelector('#toast');let toastTimer;
const nodes={form:document.querySelector('#sponsorForm'),name:document.querySelector('#sponsorName'),level:document.querySelector('#sponsorLevel'),url:document.querySelector('#sponsorUrl'),file:document.querySelector('#sponsorLogo'),preview:document.querySelector('#logoPreview'),editId:document.querySelector('#editId'),list:document.querySelector('#sponsorList'),formTitle:document.querySelector('#formTitle'),cancel:document.querySelector('#cancelEdit'),remove:document.querySelector('#removeLogo'),status:document.querySelector('#formStatus'),importStatus:document.querySelector('#importStatus')};
let sponsors;
try{let stored=localStorage.getItem(STORAGE_KEY);sponsors=stored?JSON.parse(stored):structuredClone(initialSponsors);}catch(e){sponsors=initialSponsors.slice();}
if(!Array.isArray(sponsors)) sponsors=[];
let logoData='';
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3500);}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(sponsors));return true;}catch(e){notify('Armazenamento do navegador cheio: exporte seus dados.');return false;}}
function uid(){return 'sponsor-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);}
function safeSponsor(s){return s && typeof s.name==='string' && s.name.trim().length>0 && s.name.length<90 && (!s.logo || typeof s.logo==='string') && (!s.url || typeof s.url==='string');}
function cleanSponsor(s){return{id:typeof s.id==='string' ? s.id:uid(),name:s.name.trim().slice(0,85),level:['Patrocinador','Apoiador','Parceiro'].includes(s.level)?s.level:'Parceiro',url:typeof s.url==='string' && /^https:\/\//.test(s.url)?s.url:'',logo:typeof s.logo==='string' && /^(data:image\/(png|jpeg|webp);base64,|https:\/\/)/i.test(s.logo)?s.logo:''};}
function picturePreview(){nodes.preview.replaceChildren();if(logoData){const img=document.createElement('img');img.src=logoData;img.alt='Prévia da logomarca';nodes.preview.append(img);}else nodes.preview.textContent='Nenhuma logomarca selecionada';}
function render(){
 nodes.list.replaceChildren();document.querySelector('#totalSponsors').textContent=String(sponsors.length);document.querySelector('#totalMain').textContent=String(sponsors.filter(s=>s.level==='Patrocinador').length);document.querySelector('#totalOthers').textContent=String(sponsors.filter(s=>s.level!=='Patrocinador').length);document.querySelector('#listCount').textContent=sponsors.length+' MARCAS';
 if(!sponsors.length){const p=document.createElement('p');p.className='empty-notice';p.textContent='Nenhum patrocinador cadastrado. Use o formulário ao lado para adicionar a primeira marca.';nodes.list.append(p);return;}
 sponsors.forEach(s=>{const row=document.createElement('div');row.className='admin-sponsor-item';
  const thumb=document.createElement('div');thumb.className='admin-sponsor-thumb';if(s.logo){const img=document.createElement('img');img.src=s.logo;img.alt='Logo de '+s.name;thumb.append(img);}else thumb.textContent='✳';
  const meta=document.createElement('div');meta.className='admin-sponsor-meta';const name=document.createElement('strong');name.textContent=s.name;const level=document.createElement('small');level.textContent=s.level;meta.append(name,level);
  const actions=document.createElement('div');actions.className='admin-sponsor-buttons';const edit=document.createElement('button');edit.type='button';edit.textContent='Editar';edit.setAttribute('aria-label','Editar '+s.name);edit.addEventListener('click',()=>editSponsor(s.id));const del=document.createElement('button');del.type='button';del.textContent='Excluir';del.className='delete-button';del.setAttribute('aria-label','Excluir '+s.name);del.addEventListener('click',()=>removeSponsor(s.id));actions.append(edit,del);row.append(thumb,meta,actions);nodes.list.append(row);
 });
}
function resetForm(){nodes.form.reset();nodes.editId.value='';logoData='';picturePreview();nodes.formTitle.textContent='Adicionar patrocinador';nodes.cancel.hidden=true;nodes.status.textContent='';}
function editSponsor(id){const s=sponsors.find(s=>s.id===id);if(!s)return;nodes.editId.value=s.id;nodes.name.value=s.name;nodes.level.value=s.level;nodes.url.value=s.url||'';logoData=s.logo||'';picturePreview();nodes.formTitle.textContent='Editar patrocinador';nodes.cancel.hidden=false;nodes.status.textContent='';nodes.form.scrollIntoView({behavior:'smooth',block:'start'});nodes.name.focus({preventScroll:true});}
function removeSponsor(id){const s=sponsors.find(s=>s.id===id);if(!s)return;if(!confirm('Excluir '+s.name+'? Esta alteração só será publicada após exportar o arquivo.'))return;sponsors=sponsors.filter(s=>s.id!==id);persist();render();if(nodes.editId.value===id)resetForm();notify('Marca excluída do painel local.');}
function resizeImage(file){return new Promise((resolve,reject)=>{
 if(file.size>4*1024*1024) return reject(new Error('A imagem deve ter no máximo 4 MB.'));
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)) return reject(new Error('Escolha JPG, PNG ou WEBP.'));
 const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);const max=440;const scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const context=canvas.getContext('2d');context.drawImage(img,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/webp',.8);resolve(data);};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Imagem inválida.'))};img.src=url;
 });}
nodes.file.addEventListener('change',async()=>{const file=nodes.file.files?.[0];if(!file)return;try{logoData=await resizeImage(file);picturePreview();nodes.status.textContent='Logomarca preparada com sucesso.';}catch(e){nodes.file.value='';nodes.status.textContent=e.message;}});
nodes.remove.addEventListener('click',()=>{logoData='';nodes.file.value='';picturePreview();});nodes.cancel.addEventListener('click',resetForm);
nodes.form.addEventListener('submit',event=>{event.preventDefault();const name=nodes.name.value.trim();const url=nodes.url.value.trim();if(!name){nodes.status.textContent='Informe um nome.';return;}if(url && !/^https:\/\//i.test(url)){nodes.status.textContent='O link deve começar com https://';return;}
 const id=nodes.editId.value||uid();const s={id,name,level:nodes.level.value,url,logo:logoData};if(nodes.editId.value){const pos=sponsors.findIndex(p=>p.id===id);if(pos>=0)sponsors[pos]=s;}else sponsors.push(s);persist();render();resetForm();notify('Marca salva neste navegador! Exporte para publicar.');});
function exportFile(){const content='// Arquivo gerado no painel da Ação Social de Natal 2026.\n// Publique este arquivo na raiz do seu site GitHub Pages.\nwindow.ACAO_PATROCINADORES = '+JSON.stringify(sponsors,null,2)+';\n';const blob=new Blob([content],{type:'text/javascript;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='patrocinadores.js';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);notify('Arquivo baixado! Substitua patrocinadores.js no GitHub.');}
document.querySelector('#exportSponsors').addEventListener('click',exportFile);
document.querySelector('.import-label').addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('#importSponsors').click()});
document.querySelector('#importSponsors').addEventListener('change',async event=>{
 const file=event.target.files?.[0];if(!file)return;
 try{let raw=await file.text();let input;
  if(file.name.toLowerCase().endsWith('.json')) input=JSON.parse(raw);
  else{const match=raw.match(/window\.ACAO_PATROCINADORES\s*=\s*([\s\S]*?);\s*$/);if(!match)throw new Error('Arquivo JS inválido.');input=JSON.parse(match[1]);}
  if(!Array.isArray(input)||!input.every(safeSponsor))throw new Error('Lista de patrocinadores inválida.');
  if(!confirm('Importar '+input.length+' marcas? Isso substituirá a lista deste navegador.'))return;
  sponsors=input.map(cleanSponsor);persist();render();resetForm();nodes.importStatus.textContent='Arquivo importado com sucesso.';notify('Patrocinadores importados.');
 }catch(error){nodes.importStatus.textContent='Erro na importação: '+error.message;}finally{event.target.value='';}
});
async function copyText(text){try{if(navigator.clipboard?.writeText && window.isSecureContext){await navigator.clipboard.writeText(text);return true;}const el=document.createElement('textarea');el.value=text;document.body.append(el);el.select();const ok=document.execCommand('copy');el.remove();return ok;}catch{return false;}}
document.querySelector('#copyWhatsapp').addEventListener('click',async()=>{const value='🎄 A 3ª Ação Social de Natal está chegando! ❤️ Em Içara/SC, um grupo de amigos vai espalhar doces e alegria para as crianças no dia 18/12/2026. Doe balas, pirulitos ou chocolates até 14/12 nos pontos CIEE Criciúma, Pereira Soluções ou Garage 445. Também aceitamos contribuições via PIX: 48996470603. Toda ajuda faz a diferença! Compartilhe! ✨';if(await copyText(value))notify('Convite para WhatsApp copiado!');else prompt('Copie o convite:',value);});
document.querySelector('#copyBusiness').addEventListener('click',async()=>{const value='Olá! Somos um grupo de amigos que organiza a Ação Social de Natal de Içara/SC. Em 2026 chegamos à nossa 3ª edição, com carreata e distribuição de doces para crianças no dia 18 de dezembro. Estamos buscando empresas parceiras para apoiar com doces ou contribuições financeiras até 14 de dezembro. Gostaríamos de convidar sua empresa a fazer parte dessa história. Podemos conversar?';if(await copyText(value))notify('Convite para empresas copiado!');else prompt('Copie o convite:',value);});
sponsors=sponsors.filter(safeSponsor).map(cleanSponsor);render();
