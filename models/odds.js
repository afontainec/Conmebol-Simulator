const fs = require('fs');


function parseOdd(parts) {
  console.log(parts);

  const played = parseInt(parts[1], 10) + parseInt(parts[3], 10) + parseInt(parts[5], 10);

  const odd = {
    played,
    local: ((parts[1] / played) !== 0) ? parts[1] / played : 0.01,
    visit: ((parts[3] / played) !== 0) ? parts[3] / played : 0.01,
    draw: ((parts[5] / played) !== 0) ? parts[5] / played : 0.01,
  };
  console.log(odd);
  console.log('-----------------');
  return odd;
}

// string debe ser de la forma Local #victorias Visita #victorias Empates #empates
function addOdd(string) {
  const parts = string.split(' ');
  const odd = parseOdd(parts);

  fs.readFile('odds.js', 'utf8', (err, data) => {
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
    json[parts[0]][parts[2]] = odd;
    fs.writeFile('odds.js', JSON.stringify(json), (err) => {
      if (err) return console.log(err);
    });
  });
}


const stdin = process.openStdin();

stdin.addListener('data', (d) => {
  addOdd(d.toString().trim());
});

console.log('Ingrese una probabilidad en el siguiente formato: Local #victorias Visita #victorias Empates #empates');
