const fs = require('fs');


function addPoints(p, match, local, visit) {
  if (match[local] > match[visit]) {
    p[local] = p[local] + 3;
  } else if (match[local] == match[visit]) {
    p[local] = p[local] + 1;
    p[visit] = p[visit] + 1;
  } else {
    p[visit] = p[visit] + 3;
  }
}

function simulate(p, matches) {
  for (const local in p) {
    for (visit in p) {
      if (local != visit) {
        let match = getMatch(matches, local, visit);
        if (!match) {
          match = play(local, visit);
          if (!matches[local])
            matches[local] = {};
          matches[local][visit] = match;
          addPoints(p, match, local, visit);
        }
      }
    }
  }
  table = sort(p);
  return {
    table,
    matches,
  };
}

function sort(p) {
  const sorted_array = [];
  for (const key in p) {
    sorted_array.push({
      name: key,
      points: p[key],
    });
  }

  sorted_array.sort((a, b) => {
    return b.points - a.points;
  });

  return sorted_array;
}

function getMatch(matches, local, visit) {
  if (matches[local] && matches[local][visit])
    return matches[local][visit];
  return false;
}

function play(local, visit) {
  maxGoals = 5;
  match = {};
    // if (local == "peru" || local == "bolivia" || local == "venezuela") {
    //     match[local] = 0;
    //     match[visit] = 3;
    // } else if (visit == "peru" || visit == "bolivia" || visit == "venezuela") {
    //     match[local] = 3;
    //     match[visit] = 0;
    // } else {
    //     match[local] = Math.floor((Math.random() * maxGoals));
    //     match[visit] = Math.floor((Math.random() * maxGoals));
    // }
  match[local] = Math.floor((Math.random() * maxGoals));
  match[visit] = Math.floor((Math.random() * maxGoals));


  return match;
}


fs.readFile('matches.js', 'utf8', (err, data) => {
  if (err) {
    console.log('ERROR');
    return console.error(err);
  }

  const num_of_simulations = 8000;
  const num_of_ast = 100;


  p = {
    chile: 0,
    argentina: 0,
    bolivia: 0,
    peru: 0,
    paraguay: 0,
    uruguay: 0,
    venezuela: 0,
    colombia: 0,
    ecuador: 0,
    brasil: 0,
  };

  matches = JSON.parse(data);

  for (const local in p) {
    for (const visit in p) {
      if (local != visit) {
        const match = getMatch(matches, local, visit);
        if (match) {
          addPoints(p, match, local, visit);
        }
      }
    }
  }

  console.log('tabla inicial');
  sorted_array = sort(p);
  for (var i = 0; i < sorted_array.length; i++) {
    console.log(`${i + 1}) ${sorted_array[i].name}   ${sorted_array[i].points}`);
  }
  console.log();
  for (var i = 0; i < num_of_ast; i++) {
    process.stdout.write('*');
  }
  console.log();
  max_json = simulate(JSON.parse(JSON.stringify(p)), JSON.parse(JSON.stringify(matches)));
  let average = max_json.table[4].points;
  printer = 0;

  for (var i = 0; i < num_of_simulations; i++) {
    json = simulate(JSON.parse(JSON.stringify(p)), JSON.parse(JSON.stringify(matches)));
    if (json.table[4].points > max_json.table[4].points) {
      max_json = json;
    }
    average += json.table[4].points;
    printer = printer + 1;
    if (printer > (num_of_simulations / num_of_ast)) {
      process.stdout.write('*');
      printer = 0;
    }
  }
  average /= (num_of_simulations + 1);
  console.log();
    // console.log(max_json.matches);
  console.log('------------------------------');
  console.log(`número de intentos: ${num_of_simulations}`);
  for (var i = 0; i < max_json.table.length; i++) {
    console.log(`${i + 1}) ${max_json.table[i].name}   ${max_json.table[i].points}`);
  }

  console.log('average %d', average);
});
