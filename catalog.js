export const sites = [
['sandspiel','Sandspiel','Paint a world of sand, fire, and little experiments.','Make something','https://sandspiel.club/'],
['radio-garden','Radio Garden','Spin the globe and tune into somewhere else.','Listen','https://radio.garden/'],
['patatap','Patatap','Turn your keyboard into a sound and color playground.','Make something','https://patatap.com/'],
['quick-draw','Quick, Draw!','Can a neural network guess your doodle?','Play','https://quickdraw.withgoogle.com/'],
['mystic-square','Mystic Square','A tiny sliding puzzle with a satisfying challenge.','Play','https://sliding.toys/mystic-square/8-puzzle/'],
['optical-toys','Optical Toys','Give your eyes something delightfully confusing.','Explore','https://optical.toys/'],
['ragebait','Ragebait','A strange little experiment from R74n.','Explore','https://r74n.com/mini/ragebait'],
['gentown','Gentown','See what a generated little town has in store.','Explore','https://r74n.com/gentown/'],
['sandboxels','Sandboxels','A pixel sandbox for curious experiments.','Make something','https://neal.fun/sandboxels/'],
['openfront','OpenFront','A multiplayer strategy world to jump into.','Play','https://openfront.io/'],
['krillion','Krillion','Dive into an online game and see what happens.','Play','https://krillion.io/'],
['unusual-articles','Unusual Wikipedia','Follow a rabbit hole of wonderfully unusual articles.','Explore','https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles'],
['cat-bounce','Cat Bounce','Exactly as advertised. A lot more cats than expected.','Cats','https://cat-bounce.com/'],
['little-alchemy','Little Alchemy 2','Mix simple elements into surprising discoveries.','Make something','https://littlealchemy2.com/'],
['futureme','FutureMe','Send a little time capsule to your future self.','Explore','https://www.futureme.org/'],
['space','People in Space','Find out how many humans are above us right now.','Explore','https://www.howmanypeopleareinspacerightnow.com/'],
['music-map','Music Map','Let one favorite artist lead you to another.','Listen','https://www.music-map.com/'],
['true-size','The True Size','Move countries around. Rethink the map.','Explore','https://thetruesize.com/'],
['friday','Is It Friday Yet?','One question. A very important answer.','Explore','https://isitfridayyet.net/'],
['wigglypaint','WigglyPaint','Draw something with a little wiggle in it.','Make something','https://wigglypaint.net/'],
['kittytoy','Kittytoy','A little cat-shaped escape from the ordinary.','Cats','https://rakqoi.itch.io/kittytoy'],
['cat-cafe','An Average Day at the Cat Cafe','Spend a little time in a cat cafe game.','Cats','https://zephyo.itch.io/an-average-day-at-the-cat-cafe'],
['picohot','PICOHOT','A tiny 3D shooter where time moves only when you do.','Action','https://tarkovsky.itch.io/picohot'],
['six-cats-under','Six Cats Under','Haunt a little apartment to help your cats escape.','Cats','https://teambeanloop.itch.io/six-cats-under'],
['n-step-steve','N Step Steve: Part 1','A cat, a few steps, and puzzles that get delightfully strange.','Puzzle','https://epicpikaguy.itch.io/n-step-steve-part-1'],
['tiny-islands','Tiny Islands','Flip cards and draw your own peaceful archipelago.','Cozy','https://dr-d-king.itch.io/tiny-islands'],
['deepest-sword','Deepest Sword','An enormous sword makes a very inconvenient climbing tool.','Platformer','https://cosmicadventuresquad.itch.io/deepest-sword'],
['sort-the-court','Sort the Court!','Rule a tiny kingdom with two very powerful words: yes and no.','Cozy','https://graebor.itch.io/sort-the-court'],
['chessformer','Chessformer','Chess pieces obey gravity. Your brain has questions.','Puzzle','https://rob1221.itch.io/chessformer'],
['dark-room','A Dark Room','Light a fire. Watch a surprisingly big adventure unfold.','Adventure','https://adarkroom.doublespeakgames.com/'],
['paperclips','Universal Paperclips','Make a paperclip. Then perhaps a few too many.','Incremental','https://www.decisionproblem.com/paperclips/'],
['celeste-classic','Celeste Classic','A pocket-sized mountain with an excellent dash button.','Platformer','https://maddymakesgamesinc.itch.io/celesteclassic'],
['pigeon-ascent','Pigeon Ascent','Raise a pigeon. Train a pigeon. Challenge the Pigeon God.','Adventure','https://escada-games.itch.io/pigeon-ascent'],
['die-in-dungeon','Die in the Dungeon Classic','A frog explores a dungeon armed with a deck of dice.','Strategy','https://alarts.itch.io/die-in-the-dungeon']
].map(([id,name,description,category,url],index)=>({id,name,description,category,url,
  group: ['Cats','Cozy'].includes(category)?'cozy':['Play','Action','Puzzle','Platformer','Adventure','Incremental','Strategy'].includes(category)?'games':'curious',
  game: ['Play','Action','Puzzle','Platformer','Adventure','Incremental','Strategy','Cozy'].includes(category) || ['kittytoy','cat-cafe','six-cats-under'].includes(id),
  color: ['green','peach','purple','blue','yellow'][index%5],
  fresh: index>=22
}));
function matchesGroup(site,group) {return group==='all' || (group==='games'?site.game:site.group===group);}
export function remainingSites(catalog, discovered, mood='all') {
  return catalog.filter(site=>!discovered.includes(site.id) && matchesGroup(site,mood));
}
export function filterCollection(catalog, discovered, {query='',group='all',favorites=null}={}) {
  const search=query.trim().toLowerCase();
  return discovered.slice().reverse().map(id=>catalog.find(site=>site.id===id)).filter(site=>site &&
    matchesGroup(site,group) && (!favorites || favorites.includes(site.id)) &&
    (!search || `${site.name} ${site.description} ${site.category}`.toLowerCase().includes(search)));
}
