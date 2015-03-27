function generateReport(orgName,reporttype) {
	//console.log(orgName+" is the org name !!");
    $.ajax({
        url: "https://api.github.com/orgs/"+orgName+"/repos?access_token=cde929ac80882135f84f2c69ac58ceb169896fb1",
        async: false,
        dataType: 'json',
        crossDomain : true,
        success: function(repos) {
         	//console.log(repos+" is the repos data !!");
            processRepos(repos,reporttype);
            $(document).ready( function () {
                $('#table_id').DataTable({
                    paging: false
                });
            } );
            },
        "error": function(xhr, ajaxOptions, thrownError) {
        	document.getElementById("output").innerHTML = "ERROR : "+thrownError;
        	console.log(thrownError);
        	}
        });
};
/*function to iterate through each repo url and again fetch the corresponding issues of that repo*/
function processRepos(repo,reporttype) {
var RepoApiUrl;
var RepoName;
var RepoHtmlUrl;
var out;

if(reporttype == "issue")
{
document.getElementById("output").innerHTML = '<table id="table_id" class="display"><col style="width:14%"><col style="width:6%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:15%"><col style="width:35%"><thead><tr><th>Repo Name</th><th>Type</th><th>Number & Label <br><select id="mySelect"></select><button type="button" onclick="myFunction()">Show</button></th><th>Created on</th><th>Updated on</th><th>TITLE</th><th>BODY</th></tr></thead><tbody></tbody></table>';
        //console.log("karthikeya");
	for (var i = 0; repo[i] != undefined; i++) {
		RepoApiUrl = repo[i].url;
		RepoName = repo[i].full_name;
		RepoHtmlUrl = repo[i].html_url;
		$.ajax({
        	url: RepoApiUrl+"/issues?access_token=cde929ac80882135f84f2c69ac58ceb169896fb1",
        	async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(issuesOfRepo) {
                    out = processRepoIssues(RepoName, RepoHtmlUrl, issuesOfRepo);
                    //console.log(out+"karthik");
                    $("#table_id tbody").append(out);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    document.getElementById("output").innerHTML = "ERROR : "+thrownError;
                    console.log(thrownError);
		}
		});
	}
}
else
{
    document.getElementById("output").innerHTML = '<table id="table_id" class="display"><col style="width:19%"><col style="width:12%"><col style="width:15%"><col style="width:26%"><col style="width:10%"><col style="width:18%"><thead><tr><th>Repo Name</th><th>Commited by</th><th>Committed on</th><th>File Names</th><th>Changes</th><th>message</th></tr></thead><tbody></tbody></table>';
    for (var i = 0; repo[i] != undefined; i++) {
        RepoApiUrl = repo[i].url;
        RepoName = repo[i].full_name;
        RepoHtmlUrl = repo[i].html_url;
        $.ajax({
            url: RepoApiUrl+"/commits?access_token=cde929ac80882135f84f2c69ac58ceb169896fb1",
            async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(commitsOfRepo) {
                    out = processRepoCommits(RepoName, RepoHtmlUrl, commitsOfRepo);
                    //console.log(out+"karthik");
                    $("#table_id tbody").append(out);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    document.getElementById("output").innerHTML = "ERROR : "+thrownError;
                    console.log(thrownError);
        }
        });
    }
}
};
/*function to iterate through the issues list of a repo and display the issues details*/
function processRepoCommits(RepoName, RepoHtmlUrl, commit) {
    var out ='';
    var HtmlUrl;
    var arr;
    var issueType;
    var title;
    var number;
    var body;
    var committedby;
    var created_at;
    var commitApiUrl;
    var labelData = "";
	for (var i = 0; ( i<=10 && (commit[i]!=undefined)); i++) {
		
        HtmlUrl = commit[i].html_url;
	commitApiUrl  = commit[i].url;
        created_at = commit[i].commit.committer.date;
        committedby = commit[i].commit.committer.name;
        message = commit[i].commit.message;
	    $.ajax({
            url: commitApiUrl+"?access_token=cde929ac80882135f84f2c69ac58ceb169896fb1",
            async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(dataOfCommit) {
                    out = processCommitData(RepoName, RepoHtmlUrl, committedby, HtmlUrl, created_at, message, dataOfCommit);
                    //console.log(out+"karthik");
                    $("#table_id tbody").append(out);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    document.getElementById("output").innerHTML = "ERROR : "+thrownError;
                    console.log(thrownError);
        }
        });
		
	}
    return out;
};
function processCommitData(RepoName, RepoHtmlUrl, committedby, HtmlUrl, created_at, message, dataOfCommit){
var additions;
var deletions;
var files;
var fileinfo='';
var out='';
additions=dataOfCommit.stats.additions;
deletions=dataOfCommit.stats.deletions;
files=dataOfCommit.files;
for (var i = 0; files[i] != undefined; i++) {
        fileinfo += files[i].filename+"--"+files[i].status+"<br>";

    }
out+='<tr><td><a href='+RepoHtmlUrl+'>'+RepoName+'</a></td><td>'+committedby;
out+='</td><td><a href='+HtmlUrl+'>'+created_at+'</a></td><td>'+fileinfo+'</td><td>additions - '+additions+"<br>deletions - "+deletions+'</td><td>'+message+'</td></tr>';    
return out;
};

/*function to iterate through the issues list of a repo and display the issues details*/
function processRepoIssues(RepoName, RepoHtmlUrl, issue) {
    var out ='';
    var HtmlUrl;
    var arr;
    var issueType;
    var title;
    var number;
    var body;
    var labels;
    var created_at;
    var updated_at;
    var labelData = "";
    for (var i = 0; issue[i] != undefined; i++) {
        
        HtmlUrl = issue[i].html_url;
        arr = HtmlUrl.split("/");
        issueType = arr[5];
        if(issueType == "pull")
            issueType="Pull Request";
        else if(issueType == "issues")
            issueType="Issue";
        
        number = issue[i].number;
        created_at = issue[i].created_at;
        updated_at = issue[i].updated_at;
        title = issue[i].title;
        body = issue[i].body;
    
        labels = issue[i].labels;
        labelData = "";
        for(var j = 0; labels[j] != undefined; j++) {
            labelData+='<br>'+labels[j].name;
        }
        
        out+='<tr><td><a href='+RepoHtmlUrl+'>'+RepoName+'</a></td><td>'+issueType;
        out+='</td><td><a href='+HtmlUrl+'>'+number+'</a>'+labelData+'</td><td>'+created_at+'</td><td>'+updated_at+'</td><td>'+title+'</td><td>'+body+'</td></tr>';
    }
    return out;
};
