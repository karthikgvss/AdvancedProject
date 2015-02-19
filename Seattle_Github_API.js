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
            var array = Repodata;
	        for (var i = 0; array[i] != undefined; i++) {
	          var RepoUrl = array[i].url;
	          $.ajax({
                url: RepoUrl+"/issues",
                async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(data) {
                	document.write(array[i].full_name);
					document.write('Issues <br>');
					processResponse(data);
                },
                "error": function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
					}
				});
			 $.ajax({
                url: RepoUrl+"/pulls",
                async: false,
                dataType: 'json',
                crossDomain : true,
                success: function(data) {
                	document.write(array[i].full_name);
					document.write('<b> Pull requests</b><br>');
					processResponse(data);
					},
                "error": function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
					}
				});
	        }
	     };	
		 function processResponse(data) {
	        var array = data;document.write('<table>');
	        document.write('<tr><td>ISSUE NUMBER</td><td>TITLE</td><td>BODY</td></tr>');
	        for (var i = 0; array[i] != undefined; i++) {
	          var title = array[i].title;
	          var number = array[i].number;
		      var body = array[i].body;
	          document.write('<tr><td>'+number + '</td><td>' + title + '</td><td>'+body+'</td></tr>');
	        }
			document.write('</table>');
	     };
		 seattleIssueReport();	     
