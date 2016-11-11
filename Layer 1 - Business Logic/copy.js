const requestify = require('requestify');
const provider = require('../models/provider');


let counter = 0;


exports.allRepositories = function getAllRepositories(options) {
  const URL = `https://api.github.com/orgs/${options.organization}/repos`;
  console.log('******* Searching in github... *******************************************');
  console.log('**************************************************************************');
  console.log(`Repositories of organization: ${options.organization}`);
  requestify.get(URL).then((response) => {
        // Get the response body
    const body = response.getBody();
    counter = 0;
    for (let i = 0; i < body.length; i++) {
      printRepository(body[i], (i + 1), options.info, options.commit);
    }
    if (body.length == 0) {
      console.log('  ...');
      console.log(`  ${options.organization} has no repoositories in github.`);
    }
  }).fail((error) => {
    console.log(`  the request failed with status: ${
            error.getHeaders().status}`);
    console.log(`  ${error.getBody().message}`);
    console.log('**************************************************************************');
  });
};


exports.findRepository = function (options) {
  const URL = `https://api.github.com/orgs/${options.organization}/repos`;
  console.log('******* Searching in github... *******************************************');
  console.log('**************************************************************************');

  requestify.get(URL).then((response) => {
    const body = response.getBody();
    let exists = false;
    for (let i = 0; i < body.length; i++) {
      if (body[i].name == options.repository) {
        console.log(`Organization ${options.organization} has repository: `);
        printRepository(body[i], '', options.info, options.commit);
        exists = true;
      }
    }
    if (!exists) {
      console.log(`${options.organization} does not contain repository ${options.repository}`);
    }
  }).fail((error) => {
    console.log(`  the request failed with status: ${
            error.getHeaders().status}`);
    console.log(`  ${error.getBody().message}`);
    console.log('**************************************************************************');
  });
};


function printRepository(repository, j, extended, showLastCommit) {
  if (showLastCommit) {
        // Take of the {/sha} that is at the end of repository.commits_url
    const URL = repository.commits_url.substring(0, repository.commits_url.length - 6);

    requestify.get(URL).then((response) => {
      // Get the response body
      const body = response.getBody();

      printRepositorySummary(repository, j, extended);
      console.log('    Last commit:');
      if (body.length === 0) {
        console.log('      ...');
        console.log(`      ${repository.name} has no commits in github.`);
      } else {
        console.log(`      SHA: ${body[0].sha}`);
        console.log(`      Author\`s username: ${body[0].author.login}`);
        console.log(`      Author\`s name: ${body[0].commit.author.name}`);
        console.log(`      Date of Issue: ${body[0].commit.author.date}`);
        console.log(`      Message: ${body[0].commit.message}`);
      }
      console.log('----------------------------------------------------------------------------------------------------------------');
    }).fail((error) => {
      console.log(`        the request failed with status: ${
                error.getHeaders().status}`);
      console.log(`        ${error.getBody().message}`);
      console.log('----------------------------------------------------------------------------------------------------------------');
    });
  } else {
    printRepositorySummary(repository, j, extended);
    console.log('----------------------------------------------------------------------------------------------------------------');
  }
}

function printRepositorySummary(repository, j, extended) {
  counter += 1;
  console.log('----------------------------------------------------------------------------------------------------------------');
  console.log(`  ${counter}- Name: ${repository.name}`);
  if (repository.private) {
    console.log('    This is a private repository');
  }
  console.log('    This is a public repository');
  console.log(`    Description: ${repository.description}`);
  if (extended) {
    console.log(`    Created: ${repository.created_at}`);
    console.log(`    Clone URL: ${repository.clone_url}`);
    console.log(`    Number of stargazers: ${repository.stargazers_count}`);
    console.log(`    Number of watchers: ${repository.watchers_count}`);
    console.log(`    Number of open issues: ${repository.open_issues_count}`);
    console.log(`    Number of forks: ${repository.forks_count}`);
  }
}
