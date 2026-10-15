import {sites, remainingSites, filterCollection} from './catalog.js';
import {normal, clicked} from './artwork.js';
const $=id=>document.getElementById(id);
const keys={history:'jeff-discoveries-v1',favorites:'jeff-favorites-v1',settings:'jeff-settings-v1'};
let storageAvailable=true;
function read(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value??fallback;}catch{storageAvailable=false;return fallback;}}
function cleanList(value){return Array.isArray(value)?[...new Set(value.filter(item=>typeof item==='string'))]:[];}
let discovered=cleanList(read(keys.history,[]));
let favorites=cleanList(read(keys.favorites,[]));
const savedSettings=read(keys.settings,{});
let settings={sound:savedSettings?.sound===true,theme:savedSettings?.theme==='night'?'night':'day'};
let busy=false,showFavorites=false,endingTimer=null,pressTimer=null,toastTimer=null,audioContext=null;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('jeff-image').src=normal;
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{storageAvailable=false;}}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,2400);}
function sound(final=false){
 if(!settings.sound)return;
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioContext??=new Audio();audioContext.resume().catch(()=>{});
 const now=audioContext.currentTime;const notes=final?[523,659,784,1047]:[440,660,880];
 notes.forEach((frequency,index)=>{const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),start=now+index*.07;
 oscillator.type='square';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.018,start);gain.gain.exponentialRampToValueAtTime(.001,start+.09);
 oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(start);oscillator.stop(start+.1);});
 }catch{/* Sound is optional; discovery remains available. */}
}
function burst(){
 if(reducedMotion)return;$('particles').replaceChildren();
 for(let i=0;i<18;i++){const particle=document.createElement('i');particle.className='particle';const angle=i/18*Math.PI*2,distance=80+Math.random()*85;
 particle.style.setProperty('--x',`${Math.cos(angle)*distance}px`);particle.style.setProperty('--y',`${Math.sin(angle)*distance-20}px`);
 particle.style.background=['#b63125','#f4d45b','#304eaa','#e292b7'][i%4];$('particles').append(particle);}
 setTimeout(()=>$('particles').replaceChildren(),900);
}
function setFavoriteButton(button,site){const active=favorites.includes(site.id);button.textContent=active?'★':'☆';button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',`${active?'Remove':'Add'} ${site.name} ${active?'from':'to'} favorites`);}
function favorite(site,button){const fromCard=Boolean(button.closest('.card'));const active=favorites.includes(site.id);favorites=active?favorites.filter(id=>id!==site.id):[...favorites,site.id];save(keys.favorites,favorites);setFavoriteButton(button,site);renderCollection();renderLatest();if(fromCard){const card=[...document.querySelectorAll('.card')].find(item=>item.dataset.id===site.id);(card?.querySelector('.favorite')||$('view-favorites')).focus();}toast(active?'Removed from favorites.':'Added to favorites.');}
function renderLatest(){const site=discovered.slice().reverse().map(id=>sites.find(s=>s.id===id)).find(Boolean);$('latest').hidden=!site;if(!site)return;
 $('latest-title').textContent=site.name;$('latest-description').textContent=site.description;$('latest-link').href=site.url;
 setFavoriteButton($('latest-favorite'),site);$('latest-favorite').onclick=()=>favorite(site,$('latest-favorite'));
}
function renderCollection(){
 const found=sites.filter(site=>discovered.includes(site.id));$('collection-count').textContent=String(found.length).padStart(2,'0');$('nav-count').textContent=found.length;
 const visible=filterCollection(sites,discovered,{query:$('search').value,group:$('category').value,favorites:showFavorites?favorites:null});
 $('cards').replaceChildren();$('results-count').textContent=`${visible.length} ${showFavorites?'favorites':visible.length===1?'find':'finds'}`;
 $('empty').hidden=visible.length>0;
 if(!found.length){$('empty-title').textContent='You haven’t found anything yet.';$('empty-description').textContent='Press Jeff. The places he sends you will be kept here.';$('empty-action').hidden=false;}
 else if(showFavorites&&!favorites.some(id=>found.some(site=>site.id===id))){$('empty-title').textContent='No favorites yet.';$('empty-description').textContent='Use the star beside a find to save it here.';$('empty-action').hidden=true;}
 else{$('empty-title').textContent='Nothing matches that search.';$('empty-description').textContent='Try another word or choose All kinds.';$('empty-action').hidden=true;}
 for(const site of visible){
 const card=document.createElement('article');card.className='card';card.dataset.id=site.id;card.dataset.group=site.group;
 const number=document.createElement('span');number.className='find-number';number.setAttribute('aria-hidden','true');
 const knownHistory=discovered.filter(id=>sites.some(item=>item.id===id));number.textContent=String(knownHistory.indexOf(site.id)+1).padStart(2,'0');
 const content=document.createElement('div');content.className='find-main';
 const title=document.createElement('h3'),link=document.createElement('a');link.href=site.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=site.name;title.append(link);
 const description=document.createElement('p');description.textContent=site.description;content.append(title,description);
 const meta=document.createElement('div');meta.className='find-meta';const category=document.createElement('span');category.textContent=site.category;
 const domain=document.createElement('span');domain.textContent=new URL(site.url).hostname.replace(/^www\./,'');meta.append(category,domain);
 const star=document.createElement('button');star.className='favorite';setFavoriteButton(star,site);star.addEventListener('click',()=>favorite(site,star));
 card.append(number,content,meta,star);$('cards').append(card);
 }
}
function renderProgress(){const found=sites.filter(site=>discovered.includes(site.id)).length,percentage=found/sites.length*100;
 $('total-chip').textContent=`${sites.length} places in the pile.`;
 $('progress-label').textContent=`${found} / ${sites.length}`;$('progress-fill').style.width=`${percentage}%`;
 const bar=document.querySelector('[role=progressbar]');bar.setAttribute('aria-valuemax',sites.length);bar.setAttribute('aria-valuenow',found);
 $('rank').textContent=found===sites.length?'Just a cat again.':found>=sites.length*.75?'Almost a cat.':'Still a button.';
 $('quest-title').textContent=found===sites.length?'Every place found.':`${sites.length-found} ${sites.length-found===1?'place':'places'} left to find.`;
}
function syncControls(){
 if(busy||!remainingSites(sites,discovered).length)return;
 const count=remainingSites(sites,discovered,$('mood').value).length;$('jeff').disabled=!count;
 $('status').textContent=count?(discovered.some(id=>sites.some(site=>site.id===id))?'Press Jeff. He has somewhere new.':'Press Jeff to find your first website.'):'You’ve found this whole category. Try another.';
 if(count){$('machine-hint').replaceChildren('Opens in a new tab. ');const key=document.createElement('kbd');key.textContent='Space';$('machine-hint').append(key,' works too.');}else $('machine-hint').textContent='Choose Anywhere to keep going.';
}
function finish(animate){
 busy=true;$('jeff').disabled=true;$('jeff-image').src=clicked;$('mood').disabled=true;
 const complete=()=>{$('jeff').hidden=true;$('ending').hidden=false;document.querySelectorAll('.press-note').forEach(el=>el.hidden=true);$('status').textContent='Every place found. One cat returned.';$('machine-hint').textContent='Your finds stay here. Jeff will return when new places are added.';document.body.classList.remove('celebrating');};
 if(animate&&!reducedMotion){$('status').textContent='Hang on. Something’s happening…';$('jeff').classList.add('farewell');document.body.classList.add('celebrating');endingTimer=setTimeout(complete,1550);}else complete();
}
function discover(){
 if(busy)return;const remaining=remainingSites(sites,discovered,$('mood').value);if(!remaining.length){syncControls();return;}
 const site=remaining[Math.floor(Math.random()*remaining.length)];let tab;
 try{tab=window.open('about:blank','_blank');if(tab){tab.opener=null;tab.location.replace(site.url);}}catch{try{tab?.close();}catch{}tab=null;}
 if(!tab){$('status').textContent='Allow new tabs for Jeff, then try again.';return;}
 busy=true;discovered.push(site.id);save(keys.history,discovered);$('jeff-image').src=clicked;$('jeff').classList.add('pressed');
 renderCollection();renderLatest();renderProgress();burst();sound(!remainingSites(sites,discovered).length);$('status').textContent=`You found ${site.name}.${storageAvailable?'':' Saved for this session only.'}`;
 if(!remainingSites(sites,discovered).length){$('jeff').classList.remove('pressed');finish(true);return;}

 pressTimer=setTimeout(()=>{$('jeff-image').src=normal;$('jeff').classList.remove('pressed');busy=false;syncControls();},900);
}
function applySettings(){document.body.dataset.theme=settings.theme;$('theme').setAttribute('aria-pressed',String(settings.theme==='night'));
 const themeLabel=`Switch to ${settings.theme==='night'?'day':'night'} mode`;$('theme').setAttribute('aria-label',themeLabel);$('theme').title=themeLabel;$('theme-label').textContent=settings.theme==='night'?'Lights off':'Lights on';
 $('sound').setAttribute('aria-pressed',String(settings.sound));const soundLabel=`Turn sound ${settings.sound?'off':'on'}`;$('sound').setAttribute('aria-label',soundLabel);$('sound').title=soundLabel;$('sound-icon').textContent=settings.sound?'♫':'♪';$('sound-label').textContent=settings.sound?'Sound on':'Sound off';}
$('jeff').addEventListener('click',discover);$('mood').addEventListener('change',syncControls);$('search').addEventListener('input',renderCollection);$('category').addEventListener('change',renderCollection);
function setView(favoriteView){showFavorites=favoriteView;$('view-all').classList.toggle('selected',!favoriteView);$('view-all').setAttribute('aria-pressed',String(!favoriteView));$('view-favorites').classList.toggle('selected',favoriteView);$('view-favorites').setAttribute('aria-pressed',String(favoriteView));renderCollection();}
$('view-all').addEventListener('click',()=>setView(false));$('view-favorites').addEventListener('click',()=>setView(true));
$('sound').addEventListener('click',()=>{settings.sound=!settings.sound;save(keys.settings,settings);applySettings();sound();});
$('theme').addEventListener('click',()=>{settings.theme=settings.theme==='night'?'day':'night';save(keys.settings,settings);applySettings();});
$('about').addEventListener('click',()=>$('credits').showModal());$('close-credits').addEventListener('click',()=>$('credits').close());
window.addEventListener('keydown',event=>{if(event.code!=='Space'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||$('credits').open)return;
 if(event.target.closest('input,select,textarea,button,a,summary,[contenteditable]'))return;event.preventDefault();discover();});
window.addEventListener('storage',event=>{if(event.key===keys.history||event.key===null){clearTimeout(endingTimer);clearTimeout(pressTimer);document.body.classList.remove('celebrating');discovered=cleanList(read(keys.history,[]));busy=false;$('jeff').hidden=false;$('jeff').disabled=false;$('ending').hidden=true;$('jeff').classList.remove('pressed','farewell');$('jeff-image').src=normal;$('mood').disabled=false;document.querySelectorAll('.press-note').forEach(el=>el.hidden=false);renderProgress();renderCollection();renderLatest();if(!remainingSites(sites,discovered).length)finish(false);else syncControls();}
 if(event.key===keys.favorites||event.key===null){favorites=cleanList(read(keys.favorites,[]));renderCollection();renderLatest();}});
applySettings();renderProgress();renderCollection();renderLatest();if(!remainingSites(sites,discovered).length)finish(false);else syncControls();
