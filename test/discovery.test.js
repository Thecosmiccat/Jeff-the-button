import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sites,remainingSites,filterCollection} from '../catalog.js';
test('curated catalog removes Wiki Game and adds twelve browser games',()=>{
 assert.equal(sites.length,34);assert.equal(new Set(sites.map(s=>s.id)).size,sites.length);assert.equal(new Set(sites.map(s=>s.url)).size,sites.length);
 assert.equal(sites.some(s=>s.id==='wiki-game'||s.url.includes('thewikigame')),false);
 assert.equal(sites.filter(s=>s.fresh).length,12);assert.ok(sites.filter(s=>s.fresh).every(s=>s.game));
 for(const site of sites)assert.equal(new URL(site.url).protocol,'https:');
});
test('discovery never repeats and the collection retains every revisit',()=>{
 const history=[];while(remainingSites(sites,history).length)history.push(remainingSites(sites,history)[0].id);
 assert.equal(history.length,sites.length);assert.equal(remainingSites(sites,history).length,0);assert.equal(filterCollection(sites,history).length,sites.length);
});
test('legacy history ignores removed IDs and new IDs revive Jeff',()=>{
 const old=['wiki-game','sandspiel','cat-bounce'];assert.equal(filterCollection(sites,old).length,2);
 assert.equal(remainingSites(sites,old).length,sites.length-2);
 const history=sites.map(s=>s.id);const added={id:'new-adventure'};assert.deepEqual(remainingSites([...sites,added],history),[added]);
});
test('game flavor includes cozy games and never picks non-games or repeats',()=>{
 const games=remainingSites(sites,[],'games');assert.ok(games.length>=15);assert.ok(games.every(s=>s.game));assert.ok(games.some(s=>s.id==='six-cats-under'));
 const history=games.map(s=>s.id);assert.equal(remainingSites(sites,history,'games').length,0);assert.ok(remainingSites(sites,history).length>0);
});
test('search, category and favorites combine in newest-first order',()=>{
 const history=['sandspiel','six-cats-under','chessformer'];assert.equal(filterCollection(sites,history)[0].id,'chessformer');
 assert.deepEqual(filterCollection(sites,history,{query:' CATS ',group:'cozy',favorites:['six-cats-under']}).map(s=>s.id),['six-cats-under']);
 assert.equal(filterCollection(sites,history,{favorites:[]}).length,0);assert.equal(filterCollection(sites,history,{query:'no-match-here'}).length,0);
});
