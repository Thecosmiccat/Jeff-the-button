import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sites,remainingSites} from '../catalog.js';
test('all supplied destinations have unique IDs and secure links',()=>{assert.equal(sites.length,23);assert.equal(new Set(sites.map(s=>s.id)).size,23);for(const site of sites)assert.equal(new URL(site.url).protocol,'https:');});
test('discover every destination exactly once, keeping collection IDs for revisits',()=>{const history=[];while(remainingSites(sites,history).length)history.push(remainingSites(sites,history)[0].id);assert.equal(history.length,23);assert.equal(remainingSites(sites,history).length,0);assert.equal(sites.filter(s=>history.includes(s.id)).length,23);});
test('new catalog entries bring Jeff back without losing previous progress',()=>{const history=sites.map(s=>s.id);const added={id:'new-adventure'};assert.deepEqual(remainingSites([...sites,added],history),[added]);assert.equal(remainingSites(sites,[...history,'removed-site']).length,0);});
