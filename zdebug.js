const fs = require('fs')

const f = async () => {
  const matches = await read('matches.js');
  const odds = await read('odds.js');
  const homeTeams = Object.keys(matches);
  console.log(homeTeams);
  for (let i = 0; i < homeTeams.length; i++) {
    const homeTeam = homeTeams[i];
    const awayTeams = Object.keys(matches[homeTeam]);
    for (let j = 0; j < awayTeams.length; j++) {
      const awayTeam = awayTeams[j];
      const homeGoals = parseInt(matches[homeTeam][awayTeam][homeTeam], 10);
      const awayGoals = parseInt(matches[homeTeam][awayTeam][awayTeam], 10);
      if(homeGoals > awayGoals) console.log(homeTeam, homeGoals, '-', awayGoals, awayTeam, 'GANO', homeTeam);
      else if(homeGoals === awayGoals) console.log(homeTeam, homeGoals, '-', awayGoals, awayTeam, 'EMPATE');
      else console.log(homeTeam, homeGoals, '-', awayGoals, awayTeam, 'GANO', awayTeam);

    }
  }
}

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
}

f().then(() => {
  console.log('termino');
}).catch((err) => {
  console.log(err);
})