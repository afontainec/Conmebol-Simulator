// Bolivia local

const fs = require('fs');
const oddModel = require('./models/odds');

const read = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.log('ERROR');
        console.error(err);
        return reject(err);
      }
      const json = JSON.parse(data);
      return resolve(json);
    });
  });
};

const f = async () => {
  const matches = await read('matches.js');
  const homeTeams = Object.keys(matches);
  console.log(homeTeams);
  for (let i = 0; i < homeTeams.length; i++) {
    const homeTeam = homeTeams[i];
    const awayTeams = Object.keys(matches[homeTeam]);
    for (let j = 0; j < awayTeams.length; j++) {
      const odds = await read('odds.js');
      const awayTeam = awayTeams[j];
      const homeGoals = parseInt(matches[homeTeam][awayTeam][homeTeam], 10);
      const awayGoals = parseInt(matches[homeTeam][awayTeam][awayTeam], 10);
      const history = odds[homeTeam][awayTeam];
      if (homeGoals > awayGoals) oddModel.addOdd([homeTeam, Math.round(history.local * history.played) + 1, awayTeam, Math.round(history.visit * history.played), 'Empates', Math.round(history.draw * history.played)].join(' '));
      else if (homeGoals === awayGoals) oddModel.addOdd([homeTeam, Math.round(history.local * history.played), awayTeam, Math.round(history.visit * history.played), 'Empates', Math.round(history.draw * history.played) + 1].join(' '));
      else oddModel.addOdd([homeTeam, Math.round(history.local * history.played), awayTeam, Math.round(history.visit * history.played) + 1, 'Empates', Math.round(history.draw * history.played)].join(' '));
    }
  }
};


f().then(() => {
  console.log('termino');
}).catch((err) => {
  console.log(err);
})
;
