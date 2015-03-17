//Define your Github organisation name here
//var orgName="seattletestbed";
/*Call the generateReport function with the organisation name as the parameter */
//generateReport(orgName);
/* function to fetch all the repos from the organisation */

function generateReport(orgName) {
	console.log(orgName+" is the org name !!");
    $.ajax({
        url: "https://api.github.com/orgs/"+orgName+"/repos",
        async: false,
        dataType: 'json',
        crossDomain : true,
        success: function(repos) {
         	console.log(repos+" is the repos data !!");
            processRepos(repos);
            $(document).ready( function () {
            $('#table_id').DataTable();
            } );
            },
        "error": function(xhr, ajaxOptions, thrownError) {
        	document.getElementById("output").innerHTML = "ERROR : "+thrownError;
        	//console.log(thrownError);
        	}
        });
};
/*function to iterate through each repo url and again fetch the corresponding issues of that repo*/
function processRepos(repo) {

	for (var i = 0; repo[i] != undefined; i++) {
		var RepoApiUrl = repo[i].url;
		var RepoName = repo[i].full_name;
		var RepoHtmlUrl = repo[i].html_url;
		$.ajax({
        	url: RepoApiUrl+"/issues",
        	async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(issuesOfRepo) {
                    var out = processRepoData(RepoName, RepoHtmlUrl, issuesOfRepo);
                    console.log(out+"karthik");
                    $("#table_id tbody").append(out);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    document.getElementById("output").innerHTML = "ERROR : "+thrownError;
                    //console.log(thrownError);
		}
		});
	}
};
/*function to iterate through the issues list of a repo and display the issues details*/
function processRepoData(RepoName, RepoHtmlUrl, issue) {
    var out ='';
    var HtmlUrl;
    var arr;
    var issueType;
    var title;
    var number;
    var body;
    var labels;
    var labelData = "";
	for (var i = 0; issue[i] != undefined; i++) {
		HtmlUrl = issue[i].html_url;
		arr = HtmlUrl.split("/");
		issueType = arr[5];
		if(issueType == "pull")
			issueType="Pull Request";
		else if(issueType == "issues")
			issueType="Issue";
		title = issue[i].title;
	        number = issue[i].number;
		body = issue[i].body;
		labels = issue[i].labels;
		labelData = "";
		for(var j = 0; labels[j] != undefined; j++) {
			labelData+='<br>'+labels[j].name;
		}
		out+='<tr><td><a href='+RepoHtmlUrl+'>'+RepoName+'</a></td><td>'+issueType;
		out+='</td><td><a href='+HtmlUrl+'>'+number+'</a>'+labelData+'</td><td>'+title+'</td><td>'+body+'</td></tr>';
	}
    return out;
};
