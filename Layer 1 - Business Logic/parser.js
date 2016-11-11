////Layer 1 - Business Logic/parser.js


function parseRepository(input_json, params, options) {
    let output_json = {
        name: getParam(input_json, params[0]),
        description: getParam(input_json, params[1]),
        private: getParam(input_json, params[2])
    };

    if (options.info) {
        let extended = {
            created_at: getParam(input_json, params[3]),
            clone_url: getParam(input_json, params[4]),
            stargazers_count: getParam(input_json, params[5]),
            watchers_count: getParam(input_json, params[6]),
            open_issues_count: getParam(input_json, params[7]),
            forks_count: getParam(input_json, params[8])
        };

        for (var key in extended) {
            output_json[key] = extended[key];
        }
    }

    return output_json;
}




exports.getParamFromJson = getParam;

function getParam(json, param_path) {

    const keys = param_path.split('&');

    let param = json;
    for (var i = 0; i < keys.length; i++) {
        param = param[keys[i]];
    }

    return param;

}

exports.parseRepository = parseRepository;

exports.parseRepositories = function(input_array, params, options) {
    let output_array = [];

    for (var i = 0; i < input_array.length; i++) {
        output_array.push(parseRepository(input_array[i], params, options));
    }

    return output_array;
}

exports.parseRepositoriesWithCommit = function(input_array, params, commit_params, options) {
    let output_array = [];

    for (var i = 0; i < input_array.length; i++) {
        output_array.push(parseRepositoryWithCommit(input_array[i], params, commit_params, options));
    }

    return output_array;
}

function parseRepositoryWithCommit(input_json, params, commit_params, options) {
    options.info = false;
    output_json = parseRepository(input_json, params, options);
    if (input_json.last_commit){
        output_json.commit = {
            sha: getParam(input_json, "last_commit&" + commit_params[0]),
            name: getParam(input_json, "last_commit&" + commit_params[1]),
            date: getParam(input_json, "last_commit&" + commit_params[2]),
        };
    }


    return output_json;
}

exports.parseRepositoriesWithIssues = function(input_array, params, issues_params, label_params, options) {
    let output_array = [];

    for (var i = 0; i < input_array.length; i++) {
        output_array.push(parseRepositoryWithIssues(input_array[i], params, issues_params, label_params, options));
    }

    return output_array;
}

function parseRepositoryWithIssues(input_json, params, issues_params, label_params, options) {
    options.info = false;
    output_json = parseRepository(input_json, params, options);
    output_json.issues = [];
    if (input_json.issues){

        for (var i = 0; i < input_json.issues.length ; i++){
            issue_to_add = parseIssue(input_json.issues[i], issues_params, label_params, options);
            if (issue_to_add)
                output_json.issues.push(issue_to_add);
        }

    }


    return output_json;
}

exports.parseRepositoriesWithPulls = function(input_array, params, pulls_params, options) {
    let output_array = [];

    for (var i = 0; i < input_array.length; i++) {
        output_array.push(parseRepositoryWithPulls(input_array[i], params, pulls_params, options));
    }

    return output_array;
}

function parseRepositoryWithPulls(input_json, params, pulls_params, options) {
    options.info = false;
    output_json = parseRepository(input_json, params, options);
    output_json.pulls = [];
    if (input_json.pulls){
        for (var i = 0; i < input_json.pulls.length ; i++){
            pulls_to_add = parsePull(input_json.pulls[i], pulls_params, options);
            if (pulls_to_add)
                output_json.pulls.push(pulls_to_add);
        }
    }
    


    return output_json;
}

function parseIssue(input_json, issues_params, label_params, options){
    title = getParam(input_json, issues_params[0]);
    date = getParam(input_json, issues_params[1]);
    author = getParam(input_json, issues_params[2]);
    state = getParam(input_json, issues_params[3]);

    if (options.author){
        if(options.author != author)
            return;
    }
    if (options.date){
        //compare the length of the date given
        date_substring = date.substring(0, options.date.length);
        if(options.date != date_substring)
            return;
    }
    if (options.state){
        if(options.state != state)
            return;
    }

    issue_json = {
        title: title,
        date: date,
        author: author,
        state: state
    };
    issue_json.labels = [];

    if (!input_json.labels)
        return issue_json

    for (var i = 0; i < input_json.labels.length ; i++){
        issue_json.labels.push(parseLabel(input_json.labels[i], label_params));
    }
    if (options.label){
        if (issue_json.labels.length == 0)
            return;
        ret = true
        for (var j = 0; j< issue_json.labels.length; j++){
            if (issue_json.labels[j].name == options.label){
                ret = false;
                break;
            }
        }
        if (ret)
            return;
    }

    return issue_json;
}

function parseLabel(input_json, label_params){
    label_json = {
        name: getParam(input_json, label_params[0]),
        color: getParam(input_json, label_params[1]),
    };

    return label_json;
}

function parsePull(input_json, pulls_params, options){
    title = getParam(input_json, pulls_params[0]);
    date = getParam(input_json, pulls_params[1]);
    user = getParam(input_json, pulls_params[2]);
    state = getParam(input_json, pulls_params[3]);
    basebranch = getParam(input_json, pulls_params[4]);

    if (options.author){
        if(options.author != author)
            return;
    }
    if (options.state){
        if(options.state != state)
            return;
    }
    if (options.basebranch){
        if (options.basebranch != basebranch)
            return;
    }

    pull_json = {
        title: title,
        date: date,
        user: user,
        state: state,
        basebranch: basebranch
    };

    return pull_json;
}
