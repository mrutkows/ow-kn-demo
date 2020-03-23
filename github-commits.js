function main(params) {

    console.log("Display GitHub Commit Details for GitHub repo: ", params.repository.url);
    for (var commit of params.commits) {
        console.log(params.head_commit.author.name + " added code changes with commit message: " + commit.message);
    }

    console.log("Commit logs are: ")
    console.log(params.commits)

    return { message: params };
}
