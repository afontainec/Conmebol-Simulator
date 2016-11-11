const fs = require('fs');


function parseMatch(parts) {
  console.log(parts);

  const match = {};
  match[parts[0]] = parts[1];
  match[parts[2]] = parts[3];
  match.round = parts[4];
  console.log(match);
  console.log('-----------------');
  return match;
}

// string debe ser de la forma Local 2 Visita 1 3
function addMatch(string) {
  const parts = string.split(' ');
  const match = parseMatch(parts);

  fs.readFile('matches.js', 'utf8', (err, data) => {
    if (err) {
      console.log('ERROR');
      return console.error(err);
    }
    const json = JSON.parse(data);

    if (!json[parts[0]]) {
      json[parts[0]] = {};
    }
    if (!json[parts[0]][parts[2]]) {
      json[parts[0]][parts[2]] = {};
    }
    json[parts[0]][parts[2]] = match;
    fs.writeFile('matches.js', JSON.stringify(json), (err) => {
      if (err) return console.log(err);
    });
  });
}


const stdin = process.openStdin();

stdin.addListener('data', (d) => {
  addMatch(d.toString().trim());
});

console.log('Ingrese un partido en el siguiente formato: Local GolesLocal Visita GolesVisita Ronda');
