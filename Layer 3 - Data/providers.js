exports.map = {
    github: {
        host: "https://api.github.com",
        //rf2 and rf4
        all_repositories: {
            path: "/orgs/%organization%/repos",
            value: false,
            params: ["name", "description", "private"],
            //for rf4
            extended_params: ['created_at', 'clone_url', 'stargazers_count',
                'watchers_count', 'open_issues_count', 'forks_count'
            ],
        },
        commits: {
            path: "/repos/%organization%/%repository%/commits",
            value: false,
            params: ['sha', 'commit&author&name', 'commit&author&date'],
            collaborator_params: ['commit&author&name', 'commit&author&email', 'commit&author&email']
        },
        issues: {
            path: "/repos/%organization%/%repository%/issues?state=all",
            value: false,
            params:['title', 'created_at', 'user&login', 'state', 'labels']
        },
        labels: {
            params:['name', 'color']
        },
        pulls: {
            path: "/repos/%organization%/%repository%/pulls?state=all",
            value: false,
            params:['title', 'created_at', 'user&login', 'state', 'base&repo&default_branch']
        }
    },

    bitbucket: {
        host: 'https://api.bitbucket.org',
        all_repositories: {
            path: "/2.0/repositories/%organization%",
            value: 'values',
            // path: '/orgs/{ORG}/repos',
            params: ['name', 'website', 'is_private'],
            extended_params: ['created_on', '', '',
                '', '', ''
            ],
        },
        commits: {
            path: "/2.0/repositories/%organization%/%repository%/commits",
            value: 'values',
            params: ['hash', 'author&user&display_name', 'date'],
            collaborator_params: ['author&user&display_name', 'author&raw', 'author&user&username']

        },
        issues: {
            path: "/2.0/repositories/%organization%/%repository%/issues?state=all",
            value: 'values',
            params:['title', 'created_on', 'reporter&display_name', 'state', '']
        },
        labels: {
            params:['', '']
        },
        pulls: {
            path: "/2.0/repositories/%organization%/%repository%/pullrequests?state=all",
            value: 'values',
            params:['title', 'created_on', 'author&display_name', 'state', 'destination&branch&name']
        }
    },

}
