import {sites, remainingSites} from './catalog.js';
import {normal, clicked} from './artwork.js';
const $=id=>document.getElementById(id), key='jeff-discoveries-v1';
let discovered=[],storageAvailable=true,busy=false;
try{const saved=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(saved))discovered=[...new Set(saved.filter(x=>typeof x==='string'))];}catch{storageAvailable=false;}
$('jeff-image').src=normal;
function render(){
 const found=sites.filter(s=>discovered.includes(s.id));
 $('nav-count').textContent=found.length;$('collection-count').textContent=String(found.length).padStart(2,'0');
 $('progress-label').textContent=`${found.length} of ${sites.length} little adventures discovered`;
 $('progress-fill').style.width=`${found.length/sites.length*100}%`;
 $('empty').hidden=found.length>0;$('cards').replaceChildren();
 [...discovered].reverse().forEach(id=>{const site=sites.find(s=>s.id===id);if(!site)return;
 const link=document.createElement('a');link.className='card';link.href=site.url;link.target='_blank';link.rel='noopener noreferrer';
 const top=document.createElement('div');top.className='card-top';top.textContent=site.category+' ↗';
 const title=document.createElement('h3');title.textContent=site.name;
 const description=document.createElement('p');description.textContent=site.description;
 const domain=document.createElement('small');domain.textContent=new URL(site.url).hostname;
 link.append(top,title,description,domain);$('cards').append(link);});
}
function finish(animate){
 busy=true;$('jeff').disabled=true;$('jeff-image').src=clicked;
 const complete=()=>{$('jeff').hidden=true;$('ending').hidden=false;document.querySelectorAll('.annotation,.doodle').forEach(el=>el.hidden=true);$('status').textContent='All adventures found. Your favorites are yours to revisit.';};
 if(animate){$('status').textContent='Something is happening…';$('jeff').classList.add('farewell');setTimeout(complete,1450);}else complete();
}
$('jeff').addEventListener('click',()=>{
 if(busy)return;const remaining=remainingSites(sites,discovered);if(!remaining.length){finish(true);return;}
 const site=remaining[Math.floor(Math.random()*remaining.length)];
 // Open directly during the click so browsers recognize this as a user action.
 const tab=window.open(site.url,'_blank');if(!tab){$('status').textContent='Allow new tabs for Jeff, then give him another press.';return;}try{tab.opener=null;}catch{}
 discovered.push(site.id);try{localStorage.setItem(key,JSON.stringify(discovered));}catch{storageAvailable=false;}
 render();$('status').textContent=`You found ${site.name}!${storageAvailable?'':' Saved for this session only.'}`;
 if(!remainingSites(sites,discovered).length){finish(true);return;}
 busy=true;$('jeff-image').src=clicked;$('jeff').classList.add('pressed');setTimeout(()=>{$('jeff-image').src=normal;$('jeff').classList.remove('pressed');busy=false;},400);
});
$('about').addEventListener('click',()=>$('credits').showModal());$('close-credits').addEventListener('click',()=>$('credits').close());
window.addEventListener('storage',event=>{if(event.key===key)location.reload();});
render();if(!remainingSites(sites,discovered).length)finish(false);
