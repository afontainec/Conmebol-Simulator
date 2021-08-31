#!/usr/bin/env node

const program = require('commander');


const interpreter = require('../Layer 1 - Business Logic/interpreter');

program
  .version('0.0.1');


// / simulate

program
  .command('max-fifth')
  .alias('max')
  .description('get all the repositories of a particular organization')
  .option('-n, --number [n]', 'number of times to simulate')
  .action((options) => {
    interpreter.maxFifth(options.number);
  });

program
  .command('qualify')
  .alias('q')
  .description('get all the repositories of a particular organization')
  .option('-n, --number [n]', 'number of times to simulate')
  .option('-c, --country [country]', 'country to qualify')
  .option('-r, --round [round]', 'round from which start to simulate the matches')
  .option('-p, --position [position]', 'position from to which it has to get to qualify')
  .option('-m, --mode [mode]', 'mode to select match to pull down')
  .option('-f, --fix [fix]', 'set the result for a match in the format "local localGolas visit visitGoals"')
  .action((options) => {
    const fixedMatch = interpreter.readFixedMatch(options.fix);
    interpreter.simulteToQualify(options.number, options.country, {
      round: options.round,
      mode: options.mode,
      position: options.position,
      fixedMatch,
    });
  });

program
    .command('simulate')
    .alias('s')
    .description('get all the repositories of a particular organization')
    .option('-n, --number [n]', 'number of times to simulate')
    .option('-r, --round [round]', 'round from which start to simulate the matches')
    .option('-f, --fix [fix]', 'set the result for a match in the format "local localGolas visit visitGoals"')
    .action((options) => {
      const fixedMatch = interpreter.readFixedMatch(options.fix);
      interpreter.simulate(options.number, options.round, fixedMatch);
    });


program
  .on('--help', () => {
    console.log('  For the RF requested:');
    console.log();
    console.log(' RF2:');
    console.log('    $ saffie repositories github -o rails');
    console.log(' RF3:');
    console.log('    $ saffie has-repository github -o rails');
    console.log('    $ saffie last-commits github -o github');
    console.log();
  });

program
  .command('*')
  .action((env) => {
    console.log('Command does not exists "%s"', env);
  });

program.parse(process.argv);

