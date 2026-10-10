const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const data = fs.readFileSync(path.join(__dirname, '..', 'selecoes-copas.js'), 'utf8');
const squads = vm.runInNewContext(data + ';worldCupSquads');
const expected = [13,16,16,16,16,16,16,16,24,24,24,24,32,32,32,32,32,32,32,48];
assert.equal(squads.length, 493);
assert.equal(squads.reduce((n, s) => n + s.players.length, 0), 11307);
assert.equal(new Set(squads.map(s => s.country + ' ' + s.year)).size, squads.length);
expected.forEach((count, index) => {
  assert.equal(squads.filter(s => s.year === 1950 + index * 4).length, count);
});
for (const squad of squads) {
  assert.ok(squad.players.length >= 11, squad.country + ' ' + squad.year);
  assert.equal(new Set(squad.players.map(p => p[3])).size, squad.players.length);
  assert.equal(new Set(squad.players.map(p => p[0])).size, 4);
  for (const [position, name, rating, id] of squad.players) {
    assert.ok(['GOL', 'DEF', 'MEI', 'ATA'].includes(position));
    assert.ok(name && !/[<>"\ufffd]/.test(name));
    assert.ok(Number.isInteger(rating) && rating >= 1 && rating <= 99);
    assert.match(id, /^\d+$/);
  }
}
for (const [country, year, name, rating] of [
  ['Brasil', 2002, 'Ronaldo Fenômeno', 99],
  ['Brasil', 1994, 'Romário', 99],
  ['Espanha', 2010, 'Xavi', 98],
  ['Alemanha', 2014, 'Thomas Müller', 95],
  ['Argentina', 2022, 'Lionel Messi', 99]
]) {
  assert.equal(squads.find(s => s.country === country && s.year === year).players.find(p => p[1] === name)[2], rating);
}
const ronaldo = squads.find(s => s.country === 'Brasil' && s.year === 2002).players.find(p => p[1] === 'Ronaldo Fenômeno');
assert.ok(squads.flatMap(s => s.players).filter(p => p[3] === ronaldo[3]).length >= 2);
console.log('Seleções validadas: 20 edições, 493 elencos, 11.307 inscrições.');
