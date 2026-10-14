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
 particle.style.background=['#e67843','#799957','#f0c955','#a78ab3'][i%4];$('particles').append(particle);}
 setTimeout(()=>$('particles').replaceChildren(),900);
}
// Original tiny pixel symbols; never screenshots or graphics from linked games.
const pixels={
 game:['0000000000000000','0000111111110000','0011111111111100','0011100000011100','0111001001001110','0110011100100110','0111001001001110','0111111111111110','0011100000011100','0011100000011100'],
 cat:['0011000000110000','0011110011110000','0011111111110000','0111111111111000','0110011110011000','0111110011111000','0011111111110000','0001111111100000','0000111111000000'],
 puzzle:['0000011100000000','0000011100000000','0011111111110000','0011111111110000','1111111100110000','1111111100110000','0011111111110000','0011111111110000','0011110011110000'],
 planet:['0000011111100000','0001111111111000','0011110011111100','0011110011111100','1111111111111111','1111111111111111','0011111100111100','0011111100111100','0001111111111000','0000011111100000'],
 note:['0000011111110000','0000011111110000','0000011000110000','0000011000110000','0000011000110000','0000011000110000','0001111001110000','0011111011110000','0011110011100000']
};
function icon(site){const type=site.category==='Listen'?'note':site.group==='cozy'?'cat':site.category==='Puzzle'?'puzzle':site.group==='games'?'game':'planet';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 16 16');svg.setAttribute('aria-hidden','true');svg.setAttribute('shape-rendering','crispEdges');
 pixels[type].forEach((row,y)=>[...row].forEach((cell,x)=>{if(cell!=='1')return;const square=document.createElementNS(svg.namespaceURI,'rect');square.setAttribute('x',x);square.setAttribute('y',y+3);square.setAttribute('width',1);square.setAttribute('height',1);square.setAttribute('fill','#33483b');svg.append(square);}));return svg;}
function setFavoriteButton(button,site){const active=favorites.includes(site.id);button.textContent=active?'★':'☆';button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',`${active?'Remove':'Add'} ${site.name} ${active?'from':'to'} favorites`);}
function favorite(site,button){const fromCard=Boolean(button.closest('.card'));const active=favorites.includes(site.id);favorites=active?favorites.filter(id=>id!==site.id):[...favorites,site.id];save(keys.favorites,favorites);setFavoriteButton(button,site);renderCollection();renderLatest();if(fromCard){const card=[...document.querySelectorAll('.card')].find(item=>item.dataset.id===site.id);(card?.querySelector('.favorite')||$('view-favorites')).focus();}toast(active?'Removed from favorites.':'A keeper. Added to favorites.');}
function renderLatest(){const site=discovered.slice().reverse().map(id=>sites.find(s=>s.id===id)).find(Boolean);$('latest').hidden=!site;if(!site)return;
 $('latest-title').textContent=site.name;$('latest-description').textContent=site.description;$('latest-link').href=site.url;
 setFavoriteButton($('latest-favorite'),site);$('latest-favorite').onclick=()=>favorite(site,$('latest-favorite'));
}
function renderCollection(){
 const found=sites.filter(site=>discovered.includes(site.id));$('collection-count').textContent=String(found.length).padStart(2,'0');$('nav-count').textContent=found.length;
 const visible=filterCollection(sites,discovered,{query:$('search').value,group:$('category').value,favorites:showFavorites?favorites:null});
 $('cards').replaceChildren();$('results-count').textContent=`${visible.length} ${showFavorites?'favorites':'discoveries'}`;
 $('empty').hidden=visible.length>0;
 if(!found.length){$('empty-title').textContent='Your inventory is looking a little empty.';$('empty-description').textContent='Press Jeff. Find something fun. It’ll be waiting here when you come back.';$('empty-action').hidden=false;}
 else if(showFavorites&&!favorites.some(id=>found.some(site=>site.id===id))){$('empty-title').textContent='Found a keeper? Give it a star.';$('empty-description').textContent='Your favorite discoveries will live here, ready for round two.';$('empty-action').hidden=true;}
 else{$('empty-title').textContent='No finds match this little search.';$('empty-description').textContent='Try another word or switch the filter to see more of your collection.';$('empty-action').hidden=true;}
 for(const site of visible){
 const card=document.createElement('article');card.className='card';card.dataset.color=site.color;card.dataset.id=site.id;
 const art=document.createElement('div');art.className='card-art';art.append(icon(site));const star=document.createElement('button');star.className='favorite';setFavoriteButton(star,site);star.addEventListener('click',()=>favorite(site,star));art.append(star);
 const content=document.createElement('div');content.className='card-body';const category=document.createElement('span');category.className='card-category';category.textContent=site.category.toUpperCase();
 const title=document.createElement('h3'),link=document.createElement('a');link.href=site.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=site.name;title.append(link);
 const description=document.createElement('p');description.textContent=site.description;
 const bottom=document.createElement('div');bottom.className='card-bottom';const domain=document.createElement('span');domain.textContent=new URL(site.url).hostname.replace(/^www\./,'');
 const arrow=document.createElement('span');arrow.className='arrow';arrow.setAttribute('aria-hidden','true');bottom.append(domain,arrow);content.append(category,title,description,bottom);card.append(art,content);$('cards').append(card);
 }
}
function renderProgress(){const found=sites.filter(site=>discovered.includes(site.id)).length,percentage=found/sites.length*100;
 $('total-chip').textContent=`${sites.length} little escapes`;$('new-count').textContent=sites.filter(s=>s.fresh).length;
 $('progress-label').textContent=`${found} / ${sites.length}`;$('progress-fill').style.width=`${percentage}%`;
 const bar=document.querySelector('[role=progressbar]');bar.setAttribute('aria-valuemax',sites.length);bar.setAttribute('aria-valuenow',found);
 $('rank').textContent=found===sites.length?'CAT LIBERATOR':found>=24?'INTERNET EXPLORER':found>=12?'RABBIT HOLE ROYALTY':found>=5?'BUTTON BUDDY':'CURIOUS CAT';
 $('quest-title').textContent=found===sites.length?'Quest complete. A very good day for one very weird cat.':found===0?'Every discovery brings Jeff a little closer.':`${sites.length-found} more little adventures until Jeff becomes a cat again.`;
}
function syncControls(){
 if(busy||!remainingSites(sites,discovered).length)return;
 const count=remainingSites(sites,discovered,$('mood').value).length;$('jeff').disabled=!count;
 $('status').textContent=count?`${count} UNDISCOVERED ${count===1?'ADVENTURE':'ADVENTURES'} IN THIS PILE`:'YOU FOUND THIS WHOLE FLAVOR. TRY ANOTHER!';
 $('machine-hint').textContent=count?'Opens in a new tab · press Jeff or Space':'Pick a different flavor to keep exploring.';
}
function finish(animate){
 busy=true;$('jeff').disabled=true;$('jeff-image').src=clicked;$('mood').disabled=true;
 const complete=()=>{$('jeff').hidden=true;$('ending').hidden=false;document.querySelectorAll('.press-note,.spark,.orbit').forEach(el=>el.hidden=true);$('status').textContent='ALL ADVENTURES FOUND. CAT SUCCESSFULLY FREED.';$('machine-hint').textContent='Your collection stays. Come back when new places are added.';document.body.classList.remove('celebrating');};
 if(animate&&!reducedMotion){$('status').textContent='WAIT. SOMETHING IS HAPPENING…';$('jeff').classList.add('farewell');document.body.classList.add('celebrating');endingTimer=setTimeout(complete,1550);}else complete();
}
function discover(){
 if(busy)return;const remaining=remainingSites(sites,discovered,$('mood').value);if(!remaining.length){syncControls();return;}
 const site=remaining[Math.floor(Math.random()*remaining.length)];let tab;
 try{tab=window.open('about:blank','_blank');if(tab){tab.opener=null;tab.location.replace(site.url);}}catch{try{tab?.close();}catch{}tab=null;}
 if(!tab){$('status').textContent='ALLOW NEW TABS, THEN GIVE JEFF ANOTHER PRESS.';return;}
 busy=true;discovered.push(site.id);save(keys.history,discovered);$('jeff-image').src=clicked;$('jeff').classList.add('pressed');
 renderCollection();renderLatest();renderProgress();burst();sound(!remainingSites(sites,discovered).length);$('status').textContent=`YOU FOUND ${site.name.toUpperCase()}!${storageAvailable?'':' SAVED FOR THIS SESSION.'}`;
 if(!remainingSites(sites,discovered).length){$('jeff').classList.remove('pressed');finish(true);return;}
 const count=sites.filter(s=>discovered.includes(s.id)).length;if([1,5,12,24].includes(count))toast(count===1?'First find! The adventure begins.':`${count} finds! Jeff’s bell is getting brighter.`);
 pressTimer=setTimeout(()=>{$('jeff-image').src=normal;$('jeff').classList.remove('pressed');busy=false;syncControls();},900);
}
function applySettings(){document.body.dataset.theme=settings.theme;$('theme').setAttribute('aria-pressed',String(settings.theme==='night'));
 const themeLabel=`Switch to ${settings.theme==='night'?'day':'night'} mode`;$('theme').setAttribute('aria-label',themeLabel);$('theme').title=themeLabel;
 $('sound').setAttribute('aria-pressed',String(settings.sound));const soundLabel=`Turn sound ${settings.sound?'off':'on'}`;$('sound').setAttribute('aria-label',soundLabel);$('sound').title=soundLabel;$('sound-icon').textContent=settings.sound?'♫':'♪';}
$('jeff').addEventListener('click',discover);$('mood').addEventListener('change',syncControls);$('search').addEventListener('input',renderCollection);$('category').addEventListener('change',renderCollection);
function setView(favoriteView){showFavorites=favoriteView;$('view-all').classList.toggle('selected',!favoriteView);$('view-all').setAttribute('aria-pressed',String(!favoriteView));$('view-favorites').classList.toggle('selected',favoriteView);$('view-favorites').setAttribute('aria-pressed',String(favoriteView));renderCollection();}
$('view-all').addEventListener('click',()=>setView(false));$('view-favorites').addEventListener('click',()=>setView(true));
$('sound').addEventListener('click',()=>{settings.sound=!settings.sound;save(keys.settings,settings);applySettings();sound();});
$('theme').addEventListener('click',()=>{settings.theme=settings.theme==='night'?'day':'night';save(keys.settings,settings);applySettings();});
$('about').addEventListener('click',()=>$('credits').showModal());$('close-credits').addEventListener('click',()=>$('credits').close());
window.addEventListener('keydown',event=>{if(event.code!=='Space'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||$('credits').open)return;
 if(event.target.closest('input,select,textarea,button,a,[contenteditable]'))return;event.preventDefault();discover();});
window.addEventListener('storage',event=>{if(event.key===keys.history||event.key===null){clearTimeout(endingTimer);clearTimeout(pressTimer);document.body.classList.remove('celebrating');discovered=cleanList(read(keys.history,[]));busy=false;$('jeff').hidden=false;$('jeff').disabled=false;$('ending').hidden=true;$('jeff').classList.remove('pressed','farewell');$('jeff-image').src=normal;$('mood').disabled=false;document.querySelectorAll('.press-note,.spark,.orbit').forEach(el=>el.hidden=false);renderProgress();renderCollection();renderLatest();if(!remainingSites(sites,discovered).length)finish(false);else syncControls();}
 if(event.key===keys.favorites||event.key===null){favorites=cleanList(read(keys.favorites,[]));renderCollection();renderLatest();}});
applySettings();renderProgress();renderCollection();renderLatest();if(!remainingSites(sites,discovered).length)finish(false);else syncControls();
