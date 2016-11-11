const fs = require('fs');

const matchProvider = require('./Layer 2 - Data Access/matchProvider');

fs.readFile('odds.js', 'utf8', (err, data) => {
  if (err) {
    console.log('ERROR');
    return console.error(err);
  }
  const json = JSON.parse(data);

  const teams = matchProvider.getTeams();

  for (let i = 0; i < teams.length; i++) {
    if (!(teams[i].name in json)) {
      console.log(`Faltan todos los partidos de local de ${teams[i].name}`);
    } else {
      const local = teams[i].name;
      for (let j = 0; j < teams.length; j++) {
        if (!(teams[j].name in json[local]) && local !== teams[j].name) {
          console.log(`Faltan ${local} vs ${teams[j].name}`);
        }
      }
    }
  }
});
