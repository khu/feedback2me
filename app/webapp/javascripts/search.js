if (!MemoLane.Search) { MemoLane.Search = {};}

MemoLane.apiSearchIcons = {}

MemoLane.Search.init = function(){

	if(MemoLane.currentUser !== null){
		$('.searchType').after('<div class="searchFilter" id="searchFilter-memos"><label>Only Show:</label><label><input type="checkbox" checked="checked" value="me">My Memos</label><label><input type="checkbox" value="friends">My Friends\' Memos</label></div><div class="searchFilter displayNone" id="searchFilter-stories"><label>Only Show:</label><label><input type="checkbox" checked="checked" value="me">My Stories</label><label><input type="checkbox" value="friends">My Friends\' Stories</label></div>')
	}

	var $searchInput = $("#top .search input");
	var $searchDropDown = $(".searchUI");
	var $searchResultsScroll = $('.searchResults');
	var $searchResults = $('.searchResults ul');
	var $searchFilter = $('.searchFilter');
	//var $logOutLink = $('.logOutLink');
	var $closeSearch = $('.closeSearch');
	var $searchLoader = $('.searchLoader');
	var $disableScrollBar = $('.disableScrollBar');
	var searchTimeout = undefined;
	var pagination = 0;
	var numberPerPage = 14;
	var infiniteScroll = false;
	var lastPage = false;
	var totalResults = 0;

	$searchDropDown.data('open',false);

	//input logic/events/meta data
	$searchInput
	.data({'searchType':'memos','characterCount':3})
	.focus(function(){
	  	var v = $(this).val();
	    $(this).val( v === this.defaultValue ? '' : v ).css('color','#000');
	    $(this).data('hasFocus', true);
	    $('.menu li.selected').removeClass('selected');
		$('.dropdown').hide();
	  })
	.blur(function(){
		if(!$searchDropDown.data('open')){
			$(this).val( this.defaultValue ).css('color','#ccc');
		}
	    $(this).data('hasFocus', false);
	  })
	.keyup(function(){
	    var query = $(this).val();
	    if(query.length != 0 && query.length >= $(this).data('characterCount')){
	    	var that = this;
	 		//throttle and control http calls
	    	if(searchTimeout != undefined){clearTimeout(searchTimeout);}

	        searchTimeout = setTimeout(function(){
	                searchTimeout = undefined;
	                var filter = '';
	                var searchType = $(that).data('searchType');
	                var $searchFilterType = $('#searchFilter-'+searchType);

	                if(!infiniteScroll){//if not infiniteScroll reset for new search
	                	$searchResultsScroll.scrollTop(0);
	                	$searchResults.empty();
	                	$searchDropDown.css('background-image','url(/images/ajax-loader.gif)');
	                	pagination = 0;
	                	lastPage = false;
	                }

	                if($searchFilterType.length){
	                	if($searchFilterType.find(':checkbox:checked').length){
		                	$('#searchFilter-'+searchType).find(':checkbox:checked').each(function(i,el){
		                		filter += ','+$(el).val();
		                	});
		                	filter = filter.slice(1);
		                }else{
		                	filter = 'me,friends,world';
		                }
	                }else{
	                	filter = 'world';
	                }
	                getSearchData(query,searchType,filter);
	        }, 250);

	    } else {
	    	clearTimeout(searchTimeout);
	    	searchTimeout = undefined;
			removeSearch();
	    }
	});

	//events for search type memos, stories, or users
	$('#searchTabs li').click(function(){
		if($(this).hasClass('active')){return;}
		var searchType = $(this).attr('id').split('-')[1];
		$(this).parent().find('li.active').removeClass('active').end().end().addClass('active');
		$searchInput.data('searchType',searchType).trigger('keyup');
		$searchFilter.hide().filter('#searchFilter-'+searchType).show();
		if(searchType === 'users'){
			$searchLoader.css('top','459px');
		}else{
			$searchLoader.css('top','487px');
		}
	});

	//events for filter, unique for each search type
	$('.searchFilter input:checkbox').live('click',function(){
		$searchInput.trigger('keyup');
	});

	//close search event
	$closeSearch.click(function(){
		$searchDropDown.data('open',false);
		removeSearch();
		$searchInput.trigger('blur');
	});

	//close search event with esc key
	$(document).keypress(function(e) {
    	if(e.keyCode == 27 && $searchDropDown.data('open')){
    		$closeSearch.trigger('click');
    	}
	});

	//click event, for memo results
	$('.searchMemo .searchResultTxt').live('click',function(e){
		// only do the page refresh if it's this page that should be refreshed (that is, they aren't trying to open another tab, etc.)
		if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
			window.location.href = $(this).attr("href");
			window.location.reload();
			$closeSearch.trigger('click');
		}
	});

	//scroll event
	$searchResultsScroll.scroll(function(){
		if($searchResultsScroll.scrollTop() >= $searchResults.height() - $searchResultsScroll.height() && infiniteScroll == false && lastPage == false && $searchResultsScroll.scrollTop() != 0){
			infiniteScroll = true;
			pagination += numberPerPage;
			$disableScrollBar.show();
			$searchInput.trigger('keyup');
			$searchLoader.find('span').text(totalResults).end().show();
		}
	});

    //fetch json data based on search query, search type, filter state
	var getSearchData = function(searchQuery,searchType,filter){
		if(!$searchDropDown.data('open')){openSearch();}
		$.ajax({
	  	url: '/search/'+searchType,
	  	data: {q:searchQuery,scope:filter,limit:numberPerPage,start:pagination},
	  	success: function(data){
				if(infiniteScroll){
					$searchLoader.hide();
					$disableScrollBar.hide();
					//if we hit last page stop infinite scroll
	  				if(data[searchType].length < numberPerPage){lastPage = true;}
	  			}else{
	  				$searchResults.empty();
	  			}
	  			totalResults = data.hits;
	  			if(data.hits <= numberPerPage){lastPage = true;}
	  			infiniteScroll = false;//always make sure you reset infinite scroll
	  			if(data[searchType] === undefined || !data[searchType].length){reportNoResults();return;}
	  			searchResults[searchType](data);
	  		}
		});
	};

	//remove search
	var removeSearch = function(){
		$searchInput.data('characterCount',3);
		$searchDropDown.slideUp('fast').data('open',false);
		$closeSearch.hide();
	    //$logOutLink.show();
	    $searchResults.empty();
	};

	//open search
	var openSearch = function(){
		$searchInput.data('characterCount',0);
		$searchDropDown.slideDown('fast').data('open',true);
		//$logOutLink.hide();
		$closeSearch.show();
		$('.menu li.selected').removeClass('selected');
		$('.dropdown').hide();
	};

	//report no results
	var reportNoResults = function(){
		$searchDropDown.css('background-image','none');
		$searchResults.empty().append('<li class="searchnoresults">No bueno...try again!</li>');
	};

	//add results to DOM
	var appendResults = function(html){
		$searchDropDown.css('background-image','none');
		$searchResults.append(html);
	};


	//search result logic
	var searchResults = {
		memos:function(data){
			var html = '';
			$.each(data.memos,function(i,v){
				var resultTxt;
				if(v.title){resultTxt = v.title.substring(0,150);}
				if(v.description && resultTxt == undefined){resultTxt = v.description.substring(0,150);}
				if(v.track && resultTxt == undefined){resultTxt = '<strong>'+v.track.artist +'</strong><br /> '+v.track.name;}
				var strippedId = v['_id'].replace(/[:_@\.\/]/g, "");
				
				// construct the HTML for this result
				html += '<li class="search-'+v.service+' clearfix searchMemo"';		
				if( v.service == "api" ) {
					if( !MemoLane.apiSearchIcons[v.service_id] ) {
						call = $.ajax({
							type: 'GET',
							async: false,
							url:  '/api/search_icon/' + v.service_id
						});
						MemoLane.apiSearchIcons[v.service_id] = call.responseText;
					}
					icon = MemoLane.apiSearchIcons[v.service_id];
					html += ' style="background-image:url('+ icon +')"';
				}
				html += '><a href="/'+v.user.username+'" title="User: '+v.user.username+'"><img src="'+v.user.image+'"></a><a href="/'+v.user.username+'#'+v.created_at+'memo=id' + strippedId + '" class="searchResultTxt" data-user="'+v.user.username+'">'+resultTxt+'</a>...</li>';
			});
			appendResults(html);
		},
		stories:function(data){
			var html = '';
			$.each(data.stories,function(i,v){
				html += '<li class="clearfix searchStory"><a href="/'+v.user.username+'" title="User: '+v.user.username+'"><img src="'+v.user.image+'"></a><a href="/stories/'+v._id+'" class="searchResultTxt"><strong>'+v.title+'</strong><br />'+v.description+'</a>...</li>';
			});
			appendResults(html);
		},
		users:function(data){
			var html = '';
			$.each(data.users,function(i,v){

        var addFriendButton = ""

        if( MemoLane.currentUser && v["_id"] != MemoLane.currentUser.id )
          addFriendButton = "<a onclick='requestFriendship(\"" + v.username +  "\" )' class='addFriend ui ui_add' title='Request friendship'>Add as Friend</a>";

				html += '<li class="clearfix searchUser"><a href="/'+v.username+'" title="User: '+v.first_name+' '+v.last_name+'"><img src="'+v.image+'"></a><span class="searchResultTxt"><a href="/'+v.username+'"><strong>'+v.first_name+' '+v.last_name+'</strong> ('+v.username+') </a> ' + addFriendButton + '</span> </li>';
			});
			appendResults(html);
		}
	};

};

$(document).bind("memolane:topbar:ready", function() {
  MemoLane.Search.init();
});
