//Define your Github organisation name here
var orgName="seattletestbed";
/*Call the generateReport function with the organisation name as the parameter */
generateReport(orgName);
/* function to fetch all the repos from the organisation */
function generateReport(orgName) {
	$.ajax({
        url: "https://api.github.com/orgs/"+orgName+"/repos",
        async: false,
        dataType: 'json',
        crossDomain : true,
        success: function(repos) {
         	processRepos(repos);
        	},
        "error": function(xhr, ajaxOptions, thrownError) {
        	document.getElementById("id01").innerHTML = "ERROR : "+thrownError;
        	//console.log(thrownError);
        	}
        });
};
/*function to iterate through each repo url and again fetch the corresponding issues of that repo*/
function processRepos(repo) {
	out='<table><thead><tr><th>Repo Name</th><th onclick="sort_table(report_body, 1, -1);">Type</th><th>Number & Label</th><th>TITLE</th><th>BODY</th></tr></thead><tbody id="report_body">';
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
		      	processRepoData(RepoName, RepoHtmlUrl, issuesOfRepo);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    message.innerHTML = "ERROR : "+thrownError;
                    //console.log(thrownError);
		}
		});
	}
	out=out+'</tbody></table>';
	document.getElementById("id01").innerHTML = out;
};
/*function to iterate through the issues list of a repo and display the issues details*/
function processRepoData(RepoName, RepoHtmlUrl, issue) {
	for (var i = 0; issue[i] != undefined; i++) {
		var HtmlUrl = issue[i].html_url;
		var arr = HtmlUrl.split("/");
		var issueType = arr[5];
		if(issueType == "pull")
			issueType="Pull Request";
		else if(issueType == "issues")
			issueType="Issue";
		var title = issue[i].title;
	        var number = issue[i].number;
		var body = issue[i].body;
		var labels = issue[i].labels;
		var labelData = "";
		for(var j = 0; labels[j] != undefined; j++) {
			labelData+='<br>'+labels[j].name;
		}
		out+='<tr><td><a href='+RepoHtmlUrl+'>'+RepoName+'</a></td><td>'+issueType;
		out+='</td><td><a href='+HtmlUrl+'>'+number+'</a>'+labelData+'</td><td>'+title+'</td><td>'+body+'</td></tr>';
	}			
};
function sort_table(tbody, col, asc){
    var rows = tbody.rows, rlen = rows.length, arr = new Array(), i, j, cells, clen;
    // fill the array with values from the table
    for(i = 0; i < rlen; i++){
    cells = rows[i].cells;
    clen = cells.length;
    arr[i] = new Array();
        for(j = 0; j < clen; j++){
        arr[i][j] = cells[j].innerHTML;
        }
    }
    // sort the array by the specified column number (col) and order (asc)
    arr.sort(function(a, b){
        return (a[col] == b[col]) ? 0 : ((a[col] > b[col]) ? asc : -1*asc);
    });
    for(i = 0; i < rlen; i++){
        arr[i] = "<td>"+arr[i].join("</td><td>")+"</td>";
    }
    tbody.innerHTML = "<tr>"+arr.join("</tr><tr>")+"</tr>";
};
