		function seattleIssueReport() {
            $.ajax({
                url: "https://api.github.com/orgs/seattletestbed/repos",
                async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(data) {
                	processRepos(data);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
                }
            });
        };function processRepos(Repodata) {
            var array = Repodata;document.write('<table><tr><th>Repo Name</th><th>Type</th><th>Number</th><th>TITLE</th><th>BODY</th></tr>');
	        for (var i = 0; array[i] != undefined; i++) {
	          var RepoApiUrl = array[i].url;
			  var RepoName = array[i].full_name;
			  var RepoHtmlUrl = array[i].html_url;
			  
			  $.ajax({
                url: RepoApiUrl+"/issues",
                async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(data) {
		          	processResponse(RepoName, RepoHtmlUrl, data);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
					}
				});
			 }
			document.write('</table>');
	     };	
		 function processResponse(RepoName, RepoHtmlUrl, data) {
	        var array = data;
	        for (var i = 0; array[i] != undefined; i++) {
			  var HtmlUrl = array[i].html_url;
			  var arr = HtmlUrl.split("/");
			  var title = array[i].title;
	          var number = array[i].number;
		      var body = array[i].body;
			  document.write('<tr><td>'+RepoName+'<br><a href='+RepoHtmlUrl+'>'+RepoHtmlUrl+'</a></td>');
	          document.write('<td>'+arr[5]+'</td><td>'+number+'<br><a href='+HtmlUrl+'>'+HtmlUrl+'</a></td><td>'+title+'</td><td>'+body+'</td></tr>');
	        }			
	     };
		 seattleIssueReport();	     
