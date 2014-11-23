$(document).ready(function(){

	BindLinks();
	BindCats();
	BindDelete();

	$('#addCatBtn').click(function(){
		var currentCats = JSON.parse(localStorage.getItem("davedcats"));
		if(currentCats==undefined)
		{
			currentCats = {items:[]}; 
		}

		currentCats.items.push(
			{Name: $('#categoryTb').val()}
			);
		localStorage.setItem("davedcats", JSON.stringify(currentCats));
		BindCats();
		ClearCatForm();
	});

	$('#clearBtn').click(function(){
		currentLinks = {items:[]}; 
		localStorage.setItem("davedlinks", JSON.stringify(currentLinks));
		BindLinks();
	});

	$('#saveBtn').click(function(){
		var currentLinks = JSON.parse(localStorage.getItem("davedlinks"));
		if(currentLinks==undefined)
		{
			currentLinks = {items:[]}; 
		}

		currentLinks.items.push(
			{targetLink: $('#linkTb').val(), targetTitle : GetTitle($('#linkTb').val())}
			);
		localStorage.setItem("davedlinks", JSON.stringify(currentLinks));
		BindLinks();
		ClearForm();
	});

	function BindDelete(){
		$('.delete').click(function(){
			var currentId = $(this).attr("data-listitemid");
			var currentLinks = JSON.parse(localStorage.getItem("davedlinks"));
			currentLinks.items[currentId].splice();
			localStorage.setItem("davedlinks", JSON.stringify(currentLinks));
			BindLinks();
		});
	}

	function BindLinks(){
		var currentLinks = JSON.parse(localStorage.getItem("davedlinks"));
		if(currentLinks!=undefined)
		{
			$("#currentLinks").empty();
			for(var i=0; i < currentLinks.items.length; i++)
			{
				$('#currentLinks').append('<tr><td><i class="glyphicon glyphicon-remove-circle delete" data-listitemid="' + i + '"/></td><td><a href="' + currentLinks.items[i].targetLink + '"">' + currentLinks.items[i].targetTitle + '</a></td></tr>');
			}
		}
	}

	function BindCats(){
		var currentCats = JSON.parse(localStorage.getItem("davedcats"));
		if(currentCats!=undefined)
		{
			$("#categories").empty();
			for(var i=0; i < currentCats.items.length; i++)
			{
				$('#categories').append('<li><a href="?/' + currentCats.items[i].Name + '"">' + currentCats.items[i].Name + '</a></li>');
			}
		}

	}

	function ClearForm(){
		$('#titleTb').val('');
		$('#linkTb').val('');
	}

	function ClearCatForm(){
		$('#categoryTb').val('');
	}

	function GetTitle(url){
		linkUrl = url;
		$.ajax('http://query.yahooapis.com/v1/public/yql', {
			type: 'get',
			data: {
				q: "use 'http://www.datatables.org/data/htmlstring.xml' as htmlstring; select * from htmlstring where url='" + linkUrl + "'",
				format: 'json'
			},
			dataType: 'json',
			success: function(r) {
				var response, title;
				response = r.query.results;
				if (!response) {
					return url;
				}
				title = response.result.match(/&lt;\s*title\s*>([^&lt;]*)&lt;\/title>/)[1];
				if (!title) {
					return url;
				}
				return title;
			}
		});
		return url;
	};

});