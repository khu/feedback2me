if (!this.Memolane) {
  Memolane = {};
}

Array.prototype.map = function(fn) {
  for (i=0, r=[], l = this.length; i < l; r.push(fn(this[i++])));
  return r;
};



MemoLane.currentUser = null;
MemoLane.embedded = false;



MemoLane.alertTemplates = {

  friendRequested: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Friend Requested:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon friendreqest-icon"></span>'+
      '<h3>Making Connections</h3>'+
      '<p>Just sent a friend request to {{username}}.</p>'+
    '</div>'+
  '</div>',

  friendRequestPending: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Friend Request Pending:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon friendpending-icon"></span>'+
      '<h3>Working on it...</h3>'+
      "<p>You've sent a friend request to {{username}} already.</p>"+
    '</div>'+
  '</div>',

  contributorAdded: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Contributor Added:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon contributor-icon"></span>'+
      "<h3>They're in!</h3>"+
      '<p>You added {{count}} user(s) to the story.</p>'+
    '</div>'+
  '</div>',

  friendAdded: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Friend Added:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon friendconfirm-icon"></span>'+
      '<h3>Zing!</h3>'+
      "<p>You're now friends with {{username}}!</p>"+
    '</div>'+
  '</div>',

  error: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Error:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon alert-icon"></span>'+
      '<h3>Pardon our dust...</h3>'+
      "<p>We're still in beta, so things aren't always perfect. "+
      "Your best bet is to try again or email <a href='mailto:support@memolane.com'>support@memolane.com</a> "+
      "with what happened, when, and where.</p>"+
    '</div>'+
  '</div>',

  friendRejected: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Friend Declined:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon friendreject-icon"></span>'+
      '<h3>Thanks, but no thanks...</h3>'+
      "<p>You've decided not to be friends with {{username}}.</p>"+
    '</div>'+
  '</div>',

  friendRemoved: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Friend Removed:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon friendremove-icon"></span>'+
      "<h3>It's not you, it's me.</h3>"+
      "<p>You're no longer friends with {{username}}.</p>"+
    '</div>'+
  '</div>',

  friendCancelled: '<div class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
      '<div class="dialogTopBarLine">'+
        '<div class="dialogTitle">Friend Request Cancelled:</div>'+
        '<div class="close closeMemolaneDialog">close</div>'+
        '<div class="clearFloatNoHeight"></div>'+
      '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<span class="main-icon friendremove-icon"></span>'+
      "<h3>We've grown apart...</h3>"+
      "<p>You've cancelled your request for friendship with {{username}}.</p>"+
    '</div>'+
  '</div>'
}


MemoLane.showAlert = function( template, data ) {
    var $html = $( $(Mustache.to_html(MemoLane.alertTemplates[template], data)) );
    $html.lightbox_me({centered:true,overlayCSS:{background: '#000',opacity: .8}});
}


MemoLane.htmlEscape = function( s ){
  if( !s )
    return null;
  return s.replace(/</g, "&lt;").replace(/</g, "&lt;").replace(/\"/g, "&quot;").replace(/\'/g, "&#x27;");
}

MemoLane.filterHTML = function( s ){
  if( !s )
    return null;
   return s.replace(/[\"\'][\s]*javascript:(.*)[\"\']/gi, "\"\"").replace(/<script\b[^>]*>(.*?)<\/script>/i, "").replace(/eval\((.*)\)/gi, "");
}

MemoLane.sanitizeStory = function( story )
{
  story.title = MemoLane.htmlEscape( story.title );
  story.description = MemoLane.htmlEscape( story.description );
  return story;
}

MemoLane.sanitizeAccount = function( account )
{
  account.username = MemoLane.htmlEscape( account.username );
  account.service_name = MemoLane.htmlEscape( account.service_name );
  return account;
}


Memolane.Friends = {
  friends: function(callback) {
    $.get("/friends", function(data) {
      callback(data, "accepted");
    });
  },
  requested: function(callback) {
    $.get("/friends/requested", function(data) {
      callback(data, "requested");
    });
  },
  request: function(friend, callback) {
    $.ajax({
      type: 'post',
      url: "/friends/" + friend,
      complete: function(xhr) {
        var body = null;
        if (xhr.getResponseHeader("Content-Type").match(/^application\/json/)) {
          body = JSON.parse(xhr.responseText);
        } else {
          body = {};
        }
        callback(xhr.status, body);
      }
    });
  },
  accept: function(friend, callback) {
    $.ajax({
      type: 'post',
      url: "/friends/" + friend + "/accept",
      complete: function(xhr) {
        var body = null;
        if (xhr.getResponseHeader("Content-Type").match(/^application\/json/)) {
          body = JSON.parse(xhr.responseText);
        } else {
          body = {};
        }
        callback(xhr.status, body);
      }
    });
  },
  reject: function(friend, callback) {
    $.ajax({
      type: 'post',
      url: "/friends/" + friend + "/reject",
      complete: function(xhr) {
        var body = null;
        if (xhr.getResponseHeader("Content-Type").match(/^application\/json/)) {
          body = JSON.parse(xhr.responseText);
        } else {
          body = {};
        }
        callback(xhr.status, body);
      }
    });
  },
  remove: function(friend, callback) {
    $.ajax({
      type: 'delete',
      url: "/friends/" + friend,
      complete: function(xhr) {
        callback(xhr.status);
      }
    });
  }
};

Memolane.Stories = {
  create: function() {
    $.ajax({
      type: 'post',
      url: "/stories",
      data: { "title": "Story Name", "description": "Story Description" },
      complete: function(data) {
        window.location.href = "/stories/" + JSON.parse(data.responseText).id + "?new=1";
      }
    });
  },
  members: function(id, callback) {
    $.get("/stories/" + id + "/members" , function(data) {
      callback(data);
    });
  },
  addMembers: function(storyId, newMembers, callback) {
    $.ajax({
      type: 'post',
      url: "/stories/" + storyId + "/members",
      data: { "ids": newMembers },
      complete: function(xhr) {
        var body = null;
        if (xhr.getResponseHeader("Content-Type").match(/^application\/json/)) {
          body = JSON.parse(xhr.responseText);
        } else {
          body = {};
        }
        callback(xhr.status, body);
      }
    });
  },
}

var nameSort = function(a,b){
  //gahhh... we still have users with no first or last name set....
  //this is a hack, but at least it is consistent with what would otherwise be shown...
  if( !a.first_name )
    a.first_name = "null"
  if( !a.last_name )
    a.last_name = "null"
  if( !b.first_name )
    b.first_name = "null"
  if( !b.last_name )
    b.last_name = "null"

  if(a.first_name.toLowerCase() == b.first_name.toLowerCase() ){
    if(a.last_name.toLowerCase()  == b.last_name.toLowerCase() ){
      return 0;
    }
    return (a.last_name.toLowerCase()  < b.last_name.toLowerCase() ) ? -1 : 1;
  }
  return (a.first_name.toLowerCase()  < b.first_name.toLowerCase() ) ? -1 : 1;
}

var requestFriendship = function( username ) {
  Memolane.Friends.request(username, function(status) {
    if (status === 201) {
      MemoLane.showAlert("friendRequested", {"username": username});
    } else if (status === 409) {
      MemoLane.showAlert("friendRequestPending", {"username": username})
    } else {
      MemoLane.showAlert("error", {});
    }
  });
}

var removeFriend = function( username ) {
  Memolane.Friends.remove(username, function(status) {
    if (status === 200) {
      MemoLane.showAlert("friendRemoved", {"username": username});
      var parent = $("#top > .panel > .dropdown > .content ");
      showFriends( parent );
      countFriends();
    } else {
      MemoLane.showAlert("error", {});
    }
  });
}

var acceptFriendRequest = function( username ) {
  Memolane.Friends.accept(username, function(status, data) {
    if (status === 201) {
      MemoLane.showAlert("friendAdded", {"username": username});
      var parent = $("#top > .panel > .dropdown > .content ");
      showFriends( parent );
      countFriends();
    } else {
      MemoLane.showAlert("error", {});
    }
  });
}

var rejectFriendRequest = function( username ) {
  Memolane.Friends.reject(username, function(status, data) {
    if (status === 201) {
      MemoLane.showAlert("friendRejected", {"username": username});
      var parent = $("#top > .panel > .dropdown > .content ");
      showFriends( parent );
      countFriends();
    } else {
      MemoLane.showAlert("error", {});
    }
  });
}

var cancelFriendRequest = function( username ) {
  Memolane.Friends.remove(username, function(status, data) {
    if (status === 200) {
      MemoLane.showAlert("friendCancelled", {"username": username});
      var parent = $("#top > .panel > .dropdown > .content ");
      showFriends( parent );
      countFriends();
    } else {
      MemoLane.showAlert("error", {});
    }
  });
}

var showList = function(parent, request, makeElement) {
  var list = $('<div class="list"/>');
  parent.append(list);
  Gnarly.json(request, function(xhr, data) {
    if (xhr.status == 200) {
      $.each(data, function(i, e) {
  var element = makeElement(e);
  list.append(element);
      });
    } else {
      parent.append($('<div class="error">Error</div>'));
      // ToDo: Error handling.
    }
  });
};


var FriendsDropdownTemplate =  Haml('\
#friendsContainer\n\
  :if data.requests.length > 0\n\
    %span.friendsHeader Friend Requests: Received\n\
    %ul.individualFriends\n\
      :each request in data.requests\n\
        %li\n\
          %img{src: request.thumbnail }/\n\
          %a.dropdownUserName{href: "/" + request.username} = request.first_name + " " + request.last_name\n\
          %ul.static-menu\n\
            %li.accept\n\
              %a.ui.ui_approve{onclick: "acceptFriendRequest( \\\"" + request.username + "\\\" );return false;"} Accept\n\
            %li.reject\n\
              %a.ui.ui_deny{onclick: "rejectFriendRequest( \\\"" + request.username + "\\\" );return false;"} Reject\n\
  :if data.pending.length > 0\n\
    %span.friendsHeader Friend Requests: Sent\n\
    %ul.individualFriends\n\
      :each request in data.pending\n\
        %li\n\
          %img{src: request.thumbnail }/\n\
          %a.dropdownUserName{href: "/" + request.username} = request.first_name + " " + request.last_name\n\
          %ul.hover-menu\n\
            %li.remove\n\
              %a.ui.ui_remove{onclick: "cancelFriendRequest( \\\"" + request.username + "\\\" );return false;"} Cancel\n\
  :if data.friends.length > 0\n\
    %span.friendsHeader Friends\n\
    %ul.individualFriends\n\
      :each friend in data.friends\n\
        %li\n\
          %img{src: friend.thumbnail  }/\n\
          %a.dropdownUserName{href: "/" + friend.username} = friend.first_name + " " + friend.last_name\n\
          %ul.hover-menu\n\
            %li.remove\n\
              %a.ui.ui_remove{onclick: "removeFriend( \\\"" + friend.username + "\\\" ); return false;"} Delete');


MemoLane.NoFriendsTemplate = "<span class='friends-empty'>Try the search bar to see if your friends are on Memolane.</span>";

var showFriends = function(parent) {
  parent.empty();
  Gnarly.json(['get', "/friends"], function(xhr, friends) {
    if (xhr.status == 200) {
      Gnarly.json(['get', "/friends/requested"], function(xhr, requests) {
        if (xhr.status == 200) {
          Gnarly.json(['get', "/friends/pending"], function(xhr, pending) {
            if (xhr.status == 200) {

              parent.append('<div id="tellFriends">Tell your friends about Memolane!<a href="#">Add Friends</a></div>');

              if( ( friends.length == 0 && requests.length == 0 && pending.length == 0 ) || window.location.hash == "#empty_dropdowns") {
                var noFriends = $(Mustache.to_html( MemoLane.NoFriendsTemplate, {} ));
                parent.append( noFriends );
              } else {

                //image8 all the profile images...
                friends.map( function(item) {
                  item.thumbnail = "http://" + MemoLane.image8 + "/resize/36x36/http://" + window.location.hostname + "/" + item.username + "/image";
                  return item;
                });
                friends.sort(nameSort);

                requests.map( function(item) {
                  item.thumbnail = "http://" + MemoLane.image8 + "/resize/36x36/http://" + window.location.hostname + "/" + item.username + "/image";
                  return item;
                });
                requests.sort(nameSort);

                pending.map( function(item) {
                  item.thumbnail = "http://" + MemoLane.image8 + "/resize/36x36/http://" + window.location.hostname + "/" + item.username + "/image";
                  return item;
                });
                pending.sort(nameSort);

                html = FriendsDropdownTemplate({"data": { "friends": friends, "requests": requests, "pending": pending }});
                $html = $(html);

                parent.append( $html );
              }

              $('#top .panel .dropdown').css('background-image','none');

            }  else {
              parent.append($('<div class="error">Error</div>'));
              // ToDo: Error handling.
            }
          });
        } else {
    parent.append($('<div class="error">Error</div>'));
          // ToDo: Error handling.
        }
      });
    } else {
      parent.append($('<div class="error">Error</div>'));
      // ToDo: Error handling.
    }
  });
};


Memolane.currentStoryId = "";
Memolane.currentStoryOwner = false;
Memolane.membersToBeAdded = [];

var appendContributor = function( username ) {
  Memolane.membersToBeAdded.push( username );
}

var removeContributor = function( username ) {
  Memolane.membersToBeAdded = _.without(Memolane.membersToBeAdded, username);
}

var addContributors = function() {
  var count = Memolane.membersToBeAdded.length;
  Memolane.Stories.addMembers(Memolane.currentStoryId, Memolane.membersToBeAdded, function(status, data) {
    if (status === 200) {
      MemoLane.showAlert("contributorAdded", {"count": count});
      var parent = $("#top > .panel > .dropdown > .content ");
      showContributors( parent );
    } else {
      MemoLane.showAlert("error", {});
    }
  });
  Memolane.membersToBeAdded = [];
}

var emailInviteContributors = function() {

  emails = $('#email_story_invites').val();
}


var ContributorsDropdownTemplate =  Haml('\
:if owner\n\
    -# #contributorsContainer\n\
      -# %span.contributorsHeader Add Friend to Join\n\
      -# %textarea#email_story_invites\n\
        -# Enter email addresses here. Separate each address with a comma.\n\
      -# %br.clearer\n\
      -# %a.linkButton{href: "#", onclick: "emailInviteContributors();", style: "float: right;"} Add Friend\n\
      -# %br.clearer\n\
  :if friends.length > 0\n\
    #contributorsContainer\n\
      %span.contributorsHeader.mycontributors\n\
        Invite Friends to Join\n\
        %span.inviteHeader Invite?\n\
      %ul.individualcontributors\n\
        :each friend in friends\n\
          %li\n\
            %img{src: friend.thumbnail}/\n\
            %a.dropdownUserName{href: "/" + friend.username} = friend.first_name + " " + friend.last_name\n\
            %input.checkAddFriend{name: "", type: "checkbox", value: "", onclick: "if( this.checked ) appendContributor( \\\"" + friend.id + "\\\"); else removeContributor( \\\"" + friend.id + "\\\");"  }/\n\
      %a.linkButton{href: "#", onclick: "addContributors();", style: "float: right;" } Invite\n\
      %br.clearer\n\
:if contributors.length > 0\n\
  #contributorsContainer\n\
    %span.contributorsHeader.mycontributors\n\
      Contributors\n\
    %ul.individualcontributors\n\
      :each contributor in contributors\n\
        %li\n\
          %div.avatar\n\
            %img{src: contributor.thumbnail}/\n\
            :if contributor.owner == true\n\
              %span.owner\n\
          %a.dropdownUserName{href: "/" + contributor.username} = contributor.first_name + " " + contributor.last_name\n\
          :if contributor.owner == false\n\
            %ul.hover-menu\n\
              %li.remove\n\
                %a.ui.ui_remove{onclick: "removeUserFromStory(\\\"" + contributor.id + "\\\", \\\"" +  contributor.storyId  + "\\\");"} Delete\n\
    %br.clearer');



var showContributors = function(parent) {
  parent.empty();
Gnarly.json(['get', "/friends"], function(xhr, friends) {
    if (xhr.status == 200) {
      Gnarly.json(['get', "/stories/" + Memolane.currentStoryId + "/members"], function(xhr, contributors) {
        if (xhr.status == 200) {

          friends =MemoLane.sanitizeUserList( friends );
          contributors =MemoLane.sanitizeUserList( contributors );

          var members = [];
          var memberIds = [];
          var owner = {};

          $.each(contributors, function(i, contributor) {
            if( contributor.owner ) {
              owner = contributor;
            } else {
              members.push(contributor)
              memberIds.push( contributor.id );
            }
          });

          //sort members by name
          members.sort(nameSort);

          //make sure owner is first on the list
          members = [ owner ].concat( members );

          var friendsNotMembers = [];

          if( friends ) {
            $.each(friends, function(i, friend) {
              if( $.inArray(friend.id, memberIds) == -1 )
                friendsNotMembers.push( friend );
            });

            friendsNotMembers.sort(nameSort);

            //image8 all the profile images...
            friendsNotMembers.map( function(item) {
              item.thumbnail = "http://" + MemoLane.image8 + "/resize/36x36/http://" + window.location.hostname + "/" + item.username + "/image";
              return item;
            });
          }



          members.map( function(item) {
            item.thumbnail = "http://" + MemoLane.image8 + "/resize/36x36/http://" + window.location.hostname + "/" + item.username + "/image";
            item.storyId = Memolane.currentStoryId;
            return item;
          });

          html = ContributorsDropdownTemplate({"friends": friendsNotMembers, "contributors": members, "owner": Memolane.currentStoryOwner });
          object = $(html);
          $('#top .panel .dropdown').css('background-image','none');
          parent.append( object );

        } else {
    parent.append($('<div class="error">Error</div>'));
          // ToDo: Error handling.
        }
      });
    } else {
      parent.append($('<div class="error">Error</div>'));
      // ToDo: Error handling.
    }
  });
};


var FeedDropdownTemplate = Haml('\
#feedContainer\n\
  :if today.length > 0\n\
    %span.feedHeader Today\n\
    %ul.individualEvents\n\
      :each event in today\n\
        %li\n\
          :if event.is_new\n\
            %img.new{src: "/images/dropdowns/new_feed_item.png"}/\n\
          %img.thumbnail{src: event.thumbnail}/\n\
          %span.dropdownEventTitle = event.title\n\
          .clearer\n\
  :if yesterday.length > 0\n\
    %span.feedHeader Yesterday\n\
    %ul.individualEvents\n\
      :each event in yesterday\n\
        %li\n\
          :if event.is_new\n\
            %img.new{src: "/images/dropdowns/new_feed_item.png"}/\n\
          %img.thumbnail{src: event.thumbnail}/\n\
          %span.dropdownEventTitle = event.title\n\
          .clearer\n\
  :if older.length > 0\n\
    %span.feedHeader Older\n\
    %ul.individualEvents\n\
      :each event in older\n\
        %li\n\
          :if event.is_new\n\
            %img.new{src: "/images/dropdowns/new_feed_item.png"}/\n\
          %img.thumbnail{src: event.thumbnail}/\n\
          %span.dropdownEventTitle = event.title\n\
          .clearer');





var StoryDropdownTemplate = Haml('\
.storiesContainer\n\
  %span.createStoryContainer\n\
    %a.linkButtonLarge{href: "#"} Create Story\n\
    %a.whatThisStory{href: "#"} What\'s A Story?\n\
  :if data.owner.length > 0\n\
    %span.storiesHeader.myStories My Stories\n\
    %ul.individualStories\n\
      :each story in data.owner\n\
        %li\n\
          %img{src: story.thumbnail}/\n\
          %a.dropdownStoryName{href: "/stories/" + story.id} = story.title\n\
          %ul.hover-menu\n\
            %li.remove\n\
              %a.ui.ui_remove{onclick: "deleteStory(\\\"" + story.id + "\\\");"} Delete\n\
  :if data.member.length > 0\n\
    %span.storiesHeader Stories\n\
    %ul.individualStories\n\
      :each story in data.member\n\
        %li\n\
          %img{src: story.thumbnail}/\n\
          %a.dropdownStoryName{href: "/stories/" + story.id} = story.title\n\
          %ul.hover-menu\n\
            %li.remove\n\
              %a.ui.ui_remove{onclick: "removeCurrentFromStory(\\\"" + story.id + "\\\");"} Delete');



MemoLane.NoFeedItemsTemplate = "<span class='feed-empty'>You'll find news events, friend requests, and story information here. This is where your Memolane activity is displayed. Start adding friends and creating stories.</span>";

var showFeed = function(parent) {
  showList(parent, ['get', "/feed"], function(e) {

    if( e.length == 0 || window.location.hash == "#empty_dropdowns" ) {
      var noFeeds = $(Mustache.to_html( MemoLane.NoFeedItemsTemplate, {} ));
      parent.append( noFeeds );
    } else {

      var today = [];
      var yesterday = [];
      var older = [];

      var now = Math.round(new Date().getTime() / 1000);
      var secondsPerDay = 86400;
      var d = new Date();
      var secondsSinceMidnight = ( ( (d.getHours() * 60) + d.getMinutes() ) * 60 ) + d.getSeconds();

      e = e.sort( function(a,b) { return b.created_at - a.created_at; } ).slice( 0, 20 );



      $.each(e, function(i, event) {

        var displayData = {};
        displayData["is_new"] = event.is_new;

        if( event.feed_type == "friendship_request_accepted" ) {
          displayData["thumbnail"] = "http://" + MemoLane.image8 + "/resize/24x24/http://" + window.location.hostname + "/" + event.friend.username + "/image";
          displayData["title"] = "<a href='/" + event.friend.username + "'>" + event.friend.first_name + " " + event.friend.last_name + "</a> is now your friend";
        } else if( event.feed_type == "story_added" ) {
          displayData["thumbnail"] = "http://" + MemoLane.image8 + "/resize/24x24/http://" + window.location.hostname + "/" + event.added_by.username + "/image";
          displayData["title"] = "<a href='/" + event.added_by.username + "'>" + event.added_by.first_name + " " + event.added_by.last_name + "</a> has added you to the story <a href='/stories/" + event.story.id + "'>\"" + event.story.title + "\"</a>";
        } else if( event.feed_type == "friendship" ) {
          displayData["thumbnail"] = "/images/dropdowns/connected_friends.png";
          displayData["title"] = "<a href='/" + event.friend.username + "'>" + event.friend.first_name + " " + event.friend.last_name + "</a> and <a href='/" + event.other.username + "'>" + event.other.first_name + " " + event.other.last_name + "</a> are now friends";
        } else if( event.feed_type == "story_new_member" ) {
          displayData["thumbnail"] = "/images/dropdowns/new_story.png";
          displayData["title"] = "<a href='/" + event.new_member.username + "'>" + event.new_member.first_name + " " + event.new_member.last_name + "</a> has been added to the story <a href='/stories/" + event.story.id + "'>\"" + event.story.title + "\"</a>";
        } else if( event.feed_type == "new_user_invited_by" ) {
          displayData["thumbnail"] = "http://" + MemoLane.image8 + "/resize/24x24/http://" + window.location.hostname + "/" + event.inviter.username + "/image";
          displayData["title"] = "<a href='/" + event.inviter.username + "'>" + event.inviter.first_name + " " + event.inviter.last_name + "</a> has invited you to Memolane. To request a friendship with " + event.inviter.first_name + " click <a href='#' onclick='requestFriendship(\"" + event.inviter.username +   "\")' >here</a>";
        } else if( event.feed_type == "welcome_shout" ) {

          var laneLinkURLFull = window.location.protocol +'//'+ window.location.hostname + '/' + MemoLane.currentUser.username;
          displayData["thumbnail"] = "/images/dropdowns/welcome-icon.png";
          displayData["title"] = " Welcome to Memolane! Let your <a target='_blank' class='shareFacebook' href='http://www.facebook.com/share.php?u=" + laneLinkURLFull + "' >Facebook</a> and <a target='_blank' class='shareTwitter' href='http://twitter.com/share/?via=memolane&text=Check%20out%20my%20new%20Memolane!&url=" + laneLinkURLFull + "' >Twitter</a> friends know so you can share your memories";
        } else if( event.feed_type == "welcome_invite" ) {
          displayData["thumbnail"] = "/images/dropdowns/welcome-icon.png";
          displayData["title"] = "<a href='#' onclick='sendInvites(); return false;'>Invite your friends</a> to Memolane to share memories via stories";
        }

        if( ( now - event.created_at ) < secondsSinceMidnight )
          today.push( displayData );
        else if( ( now - event.created_at ) < ( secondsSinceMidnight + secondsPerDay ) )
          yesterday.push( displayData );
        else
          older.push( displayData );
      });

      html = FeedDropdownTemplate({"today": today, "yesterday": yesterday, "older": older});
      $html = $(html)

       $html.find(".shareFacebook").click(function(e){
         window.open( $(this).attr('href'), 'Share on Facebook', 'width=600,height=400');
         e.preventDefault();
       }).end()
       // action for Twitter

      $html.find(".shareTwitter").click(function(e){
        window.open( $(this).attr('href'), 'Share on Twitter', 'width=600,height=400');
        e.preventDefault();
      }).end()

      parent.empty();
      parent.append($html);

      //mark this as the time the user last accessed feeds,
      //this is a little bit brutal as none of these will be shown again, buts its the best I can do until we come up with a better way

      Gnarly.http(['put', "/read", {}, ""], function(xhr) {
        if (xhr.status == 200) {
          var count = $("#top .static ul.menu > li.feed > .count");
          Gnarly.json(['get', "/feed/volume"], function(xhr, data) {
            if (data.volume != 0) {
              count.show().html(data.volume);
            }else{
              count.hide();
            }
          });
        } else {
          // ToDo: Error handling.
        }
      });
    }
    $('#top .panel .dropdown').css('background-image','none');
  });

};

var refreshFeed = function() {
  var parent = $("#top > .panel > .dropdown > .content ");
  parent.empty();
  showFeed( parent );
}


MemoLane.NoStoriesTemplate = "<span class='stories-empty'>No stories yet, click the 'Create Story' button to get started.</span>";


var showStories = function(parent) {

  Gnarly.json(['get', "/stories"], function(xhr, data) {
    if (xhr.status == 200) {

      if(  window.location.hash == "#empty_dropdowns" )
        data = [];

      //image8 all the profile images...
      data.map( function(item) {
        item.thumbnail = "http://" + MemoLane.image8 + "/resize/36x36/http://" + window.location.hostname + "/images/no-image-story.png";
        return item;
      });

      var ownerOf = [];
      var memberOf = []

      $.each(data, function(i, e) {
        e = MemoLane.sanitizeStory( e );
        if( e.owner )
          ownerOf.push( e );
        else
          memberOf.push( e );
      });

      html = StoryDropdownTemplate({"data": { "owner": ownerOf, "member": memberOf }});
      object = $(html);

      if( data.length == 0 ||  window.location.hash == "#empty_dropdowns" ) {
         var noStories = $(Mustache.to_html( MemoLane.NoStoriesTemplate, {} ));
         object.append( noStories );
      }

      newStoryBtn = object.find("a.linkButtonLarge");
      newStoryBtn.click(function() {
        Memolane.Stories.create();
        return false;
      });

      $('#top .panel .dropdown').css('background-image','none');

      parent.append( object );
    } else {
      parent.append($('<div class="error">Error</div>'));
      // ToDo: Error handling.
    }
  });
};


var removeUserFromStory = function( userId, storyId ) {
  var url = "/stories/" + storyId + "/member/" + userId;
  Gnarly.http(['delete', url], function(xhr) {
    if (xhr.status == 200) {
      var parent = $("#top > .panel > .dropdown > .content ");
      parent.empty();
      showContributors( parent );
    } else {
        // ToDo: Error handling.
    }
  });
}

var removeCurrentFromStory = function( storyId ) {

  var url = "/stories/" + storyId + "/member/" + MemoLane.currentUser.id;
  Gnarly.http(['delete', url], function(xhr) {
    if (xhr.status == 200) {
      var parent = $("#top > .panel > .dropdown > .content ");
      parent.empty();
      showStories( parent );
    } else {
        // ToDo: Error handling.
    }
  });
}

var deleteStory = function( storyId ) {

  var $html = $('<div id="confirmStoryDeleteDialog" class="memolaneDialog">'+
          '<div class="dialogTopBar">'+
              '<div class="dialogTopBarLine">'+
                  '<div class="dialogTitle">Are you sure?</div>'+
                  '<div class="close closeMemolaneDialog">cancel</div>'+
                  '<div class="clearFloatNoHeight"></div>'+
              '</div>'+
          '</div>'+
          '<div class="dialogContent">'+
        '<p>Deleteing this story will remove all contributors. Your memos will still remain on your timeline, but will no longer be organized here. <br /><a href="#" class="greenButton close">Ok</a></p>'+
        '<div class="clearFloatNoHeight"></div>'+
          '</div>'+
      '</div>');

    $html.lightbox_me({modalCSS: {top:'150px'},overlayCSS:{background: '#000',opacity: .8},onLoad:function(){
      $('.greenButton.close').focus().click(function(){
          var url = "/stories/" + storyId;
        Gnarly.http(['delete', url], function(xhr) {
          if (xhr.status == 200) {
            var parent = $("#top > .panel > .dropdown > .content ");
            parent.empty();
            showStories( parent );

            if(window.location.href.match(storyId)){window.location = '/me';}

          } else {
              // ToDo: Error handling.
          }
        });
      });

      }
    });
}


  var PrivacyDropdownTemplate = Haml('\
.privacyContainer\n\
  :if privacy == "members"\n\
    %span.privacyTypeHeaderSelected Private\n\
  :if privacy != "members"\n\
    %span.privacyTypeHeader{onclick: "setCurrentStoryPrivacy(\\\"members\\\");"} Private\n\
  %p\n\
    %strong Private Means: \n\
    %br \n\
    Only you and contributors can see stories with this privacy setting.\n\
.privacyContainer\n\
  :if privacy == "nosearch"\n\
    %span.privacyTypeHeaderSelected\n\
      Public\n\
      %span.privacySubHeader&nbsp;(Non-Searchable)\n\
  :if privacy != "nosearch"\n\
    %span.privacyTypeHeader{onclick: "setCurrentStoryPrivacy(\\\"nosearch\\\");"}\n\
      Public\n\
      %span.privacySubHeader&nbsp;(Non-Searchable)\n\
  %p\n\
    %strong Public (non-searchable) means: \n\
    %br \n\
    Anyone can view this story if they have a direct link to it, but it will not show up in public searches.\n\
.privacyContainer\n\
  :if privacy == "public"\n\
    %span.privacyTypeHeaderSelected\n\
      Public\n\
      %span.privacySubHeader&nbsp;(Searchable)\n\
  :if privacy != "public"\n\
    %span.privacyTypeHeader{onclick: "setCurrentStoryPrivacy(\\\"public\\\");"}\n\
      Public\n\
      %span.privacySubHeader&nbsp;(Searchable)\n\
  %p\n\
    %strong Public Means: \n\
    %br \n\
    Anyone can view this story, and it will show up in public searches.');


var setCurrentStoryPrivacy = function( privacy ) {
  var url = "/stories/" + Memolane.currentStoryId + "/privacy";
  Gnarly.http(['put', url, {}, {privacy: privacy}], function(xhr) {
    var parent = $("#top > .panel > .dropdown > .content ");
    if (xhr.status == 200) {
      showPrivacy( parent );
    } else {
      parent.append($('<div class="error">Error</div>'));
      // ToDo: Error handling.
    }
  });
}


var showPrivacy = function(parent) {
  Gnarly.json(['get', "/stories/" + Memolane.currentStoryId], function(xhr, data) {
    if (xhr.status == 200) {
      html = PrivacyDropdownTemplate(data);
      object = $(html);

      parent.empty();
      $('#top .panel .dropdown').css('background-image','none');
      parent.append( object );
    } else {
      parent.append($('<div class="error">Error</div>'));
      // ToDo: Error handling.
    }
  });
};



  var SettingsDropdownTemplate = Haml('\
%ul#settingsDropdown\n\
  %li.socialSettings\n\
    %a.settingsAction{href: "/signup/services"} Services and Privacy\n\
  %li.personalSettings\n\
    %a.settingsAction{href: "#", onclick: "expandSettings(\\\"details\\\");return false;"} Personal Info\n\
    :if expanded == "details"\n\
      #changeInfoContainer\n\
        %br/\n\
        %input#settingsFirstName{name: "firstName", type: "text", value: user.first_name}/\n\
        %label{for: "firstName"} First Name:\n\
        %br/\n\
        %br/\n\
        %input#settingsLastName{name: "lastName", type: "text", value: user.last_name}/\n\
        %label{for: "lastName"} Lastname:\n\
        %br/\n\
        %br/\n\
        %input#settingsEmail{name: "email", type: "text", value: user.email}/\n\
        %label{for: "email"} Email:\n\
        %br/\n\
        %br/\n\
        :if success_text != ""\n\
          %p.success = success_text\n\
        :if error_text != ""\n\
          %p.error = error_text\n\
        %a.linkButton{href: "#", onclick: "changeUserDetails(); return false;"} Update\n\
        %a.linkButton.greyButton{href: "#", onclick: "cancelUserDetailsChange(); return false;"} Cancel\n\
        %div\n\
          %a.deleteAccount{href: "#", title: "Delete My Account"} Delete My Account\n\
      %br.clearer/\n\
  %li.passwordSettings\n\
    %a.settingsAction{href: "#", onclick: "expandSettings(\\\"password\\\"); return false;"} Change Password\n\
    :if expanded == "password"\n\
      #changePWContainer\n\
        %br/\n\
        %input#settingsPwOld{name: "oldPW", type: "password", value: ""}/\n\
        %label{for: "oldPW"} Old:\n\
        %br/\n\
        %br/\n\
        %input#settingsPwNew{name: "newPW", type: "password", value: ""}/\n\
        %label{for: "oldPW"} New:\n\
        %br/\n\
        %br/\n\
        %input#settingsPwRepeat{name: "newPW2", type: "password", value: ""}/\n\
        %label{for: "oldPW"} Again:\n\
        %br/\n\
        %br/\n\
        :if success_text != ""\n\
          %p.success = success_text\n\
        :if error_text != ""\n\
          %p.error = error_text\n\
        %a.linkButton{href: "#", onclick: "changePassword(); return false;"} Change\n\
        %a.linkButton.greyButton{href: "#", onclick: "cancelPasswordChange(); return false;"} Cancel\n\
      %br.clearer/\n\
  %li.musicSettings\n\
    %a.settingsAction{href: "#", onclick: "expandSettings(\\\"music\\\");return false;"} Music Playback\n\
    :if expanded == "music"\n\
      %br/\n\
      :if user.music_provider != "spotify"\n\
        %input#Private{name: "group2", type: "radio", value: "Amazon", checked: true, onclick: "setMusicProvider(\\\"amazon\\\");"}/\n\
      :if user.music_provider == "spotify"\n\
        %input#Private{name: "group2", type: "radio", value: "Amazon", onclick: "setMusicProvider(\\\"amazon\\\");"}/\n\
      %label{for: "Amazon"} Amazon MP3\n\
      %p Play a preview or download from Amazon.com\n\
      :if user.music_provider == "spotify"\n\
        %input#Public{name: "group2", type: "radio", value: "Spotify", checked: true, onclick: "setMusicProvider(\\\"spotify\\\");"}/\n\
      :if user.music_provider != "spotify"\n\
        %input#Public{name: "group2", type: "radio", value: "Spotify", onclick: "setMusicProvider(\\\"spotify\\\");"}/\n\
      %label{for: "Spotify"} Spotify Client\n\
      %p Play in Spotify (you must have the Spotify client installed)\n\
  %li.notificationSettings\n\
    %a.settingsAction{href: "#", onclick: "expandSettings(\\\"notifications\\\");return false;"} Email Notifications\n\
    :if expanded == "notifications"\n\
      %br/\n\
      :if user.mail_notifications.friendship_request != "false"\n\
        %input#FriendReqNotification{type: "checkbox", value: "requests", checked: true}/\n\
      :if user.mail_notifications.friendship_request == "false"\n\
        %input#FriendReqNotification{type: "checkbox", value: "requests"}/\n\
      %label{for: "requests"} Friendship requests.\n\
      %p Send me an email when someone wants to be friends with me\n\
      :if user.mail_notifications.added_to_story != "false"\n\
        %input#StoryAddNotifications{type: "checkbox", value: "stories", checked: true}/\n\
      :if user.mail_notifications.added_to_story == "false"\n\
        %input#StoryAddNotifications{type: "checkbox", value: "stories"}/\n\
      %label{for: "stories"} Added to story\n\
      %p Send me an email when I am added to a story');


MemoLane.currentlyExpandedSetting = "";

var showSettings = function(parent, expand, success_text, error_text) {

  MemoLane.currentlyExpandedSetting = expand;

  //default to true for both if not in the db at all
  if( !MemoLane.currentUser.mail_notifications ) {
    MemoLane.currentUser.mail_notifications = {friendship_request: true, added_to_story: true }
  }


  html = SettingsDropdownTemplate({"expanded": expand, "user": MemoLane.currentUser, "error_text":  error_text, "success_text": success_text });
  object = $(html);


  //bind to the mail_notification checkboxes
  object.find('#FriendReqNotification').bind('click', function () {

    params = {
      "friendship_request":  $(this).is(':checked'),
      "added_to_story": MemoLane.currentUser.mail_notifications.added_to_story
    }

    $.ajax({
      type: 'put',
      url: "/mail_notifications",
      data: params,
      complete: function(xhr) {
        MemoLane.refreshCurrentUser( function() {} );
      }
    });

  });

  object.find('#StoryAddNotifications').bind('click', function () {
     params = {
      "friendship_request":  MemoLane.currentUser.mail_notifications.friendship_request,
      "added_to_story":  $(this).is(':checked')
    }

    $.ajax({
      type: 'put',
      url: "/mail_notifications",
      data: params,
      complete: function(xhr) {
        MemoLane.refreshCurrentUser( function() {} );
      }
    });

  });


  parent.empty();
  $('#top .panel .dropdown').css('background-image','none');
  parent.append( object );

};



var changePassword = function() {

  var oldPw      = $("input#settingsPwOld").val();
  var newPw      = $("input#settingsPwNew").val();
  var newRepeat  = $("input#settingsPwRepeat").val();

  var parent = $("#top > .panel > .dropdown > .content ");

  if( newPw != newRepeat ) {
    showSettings( parent, "password", "", "passwords do not match" );
  } else if ( newPw.length < 8 ) {
    showSettings( parent, "password", "", "min. 8 chars." );
  } else {
    Gnarly.json(['post', ["/password", {"password": newPw, "old_password": oldPw}]], function(xhr) {
      if (xhr.status == 200) {
        //we need to  update current user as it has changed...
        MemoLane.refreshCurrentUser( function() { showSettings( parent, "password", "password changed", "" ); } );

      } else if ( xhr.status == 409 ) {
        showSettings( parent, "password", "", "Old passoword is wrong!" );
      } else {
        showSettings( parent, "password", "", "Error!" );
      }
    });
  }

}


var cancelPasswordChange = function() {

   var parent = $("#top > .panel > .dropdown > .content ");
   showSettings( parent, "password", "", "" );
}


var changeUserDetails = function() {

  var firstName     = $("input#settingsFirstName").val();
  var lastName      = $("input#settingsLastName").val();
  var email         = $("input#settingsEmail").val();

  var parent = $("#top > .panel > .dropdown > .content ");
  Gnarly.json(['post', ["/details", {"first_name": firstName, "last_name": lastName, "email": email}]], function(xhr) {
    if (xhr.status == 200) {
      //we need to update current user as it has changed...
      MemoLane.refreshCurrentUser( function() { showSettings( parent, "details", "details changed", "" ); } );

      //update name in top bar
      $(".your_name").text( firstName + " " + lastName );

    } else {
      showSettings( parent, "details", "", "E-mail already in use." );
    }
  })
}


var cancelUserDetailsChange = function() {

   var parent = $("#top > .panel > .dropdown > .content ");
   showSettings( parent, "details", "", "" );
}

var expandSettings = function(expand) {

  var parent = $("#top > .panel > .dropdown > .content ");
  if( MemoLane.currentlyExpandedSetting == expand )
    showSettings( parent, "" );
  else
    showSettings( parent, expand, "", "" );
}


var handleStaticActions = function( object ) {

  $(document).click(function(e){

    if($('.dropdown:visible').length){
      if($(e.target).closest('.menu').length || $(e.target).closest('.dropdown').length || $(e.target).hasClass('settingsAction')){
        return;
      }else{
        if( active ) {
          active.removeClass("selected");
          active = null;
        }
        dropdown.slideUp();
        content.empty();
      }
    }

    if($('.searchUI:visible').length){
      if($(e.target).closest('.static').length || $(e.target).closest('.searchUI').length){
        return;
      }else{
        $(".searchUI").data('open',false);
        $("#top .search input")
          .val('search memos, stories, and users')
          .css('color','#ccc')
          .data('characterCount',3)
          .trigger('blur');
        $('.searchUI').slideUp('fast');
        $('.closeSearch').hide();
        //$('.logOutLink').show();
      }
    }
  });

  var panel = $("#top > .panel");
  var dropdown = panel.find("> .dropdown").hide();
  var content = dropdown.find("> .content");

  var active = null;
  var menu = object.find(".menu");

  var friends = menu.find("li.friends").click(function() {

    if (active === friends) {
      active.removeClass("selected");
      active = null;
      dropdown.css('right','0').slideUp();
      content.empty();
    } else {
      dropdown.css('background-image','url(/images/ajax-loader.gif)');
      dropdown.removeClass('newStoryNav');
      if (active === null) {
      dropdown.slideDown();
      } else {
      active.removeClass("selected");
      content.empty();
      }
      active = friends;
      active.addClass("selected");
      showFriends(content);
    }
  });
  var feed = menu.find("li.feed").click(function() {
    if (active === feed) {
      active.removeClass("selected");
      active = null;
      dropdown.css('right','0').slideUp();
      content.empty();
    } else {
      dropdown.css('background-image','url(/images/ajax-loader.gif)');
      dropdown.removeClass('newStoryNav');
      if (!active) {
      dropdown.slideDown();
      } else {
      active.removeClass("selected");
      content.empty();
      }
      active = feed;
      active.addClass("selected");
      showFeed(content);
    }
  });
  var stories = menu.find("li.stories").click(function() {
    if (active === stories) {
      active.removeClass("selected");
      active = null;
      dropdown.slideUp();
      content.empty();
    } else {
      dropdown.css('background-image','url(/images/ajax-loader.gif)');
        dropdown.removeClass('newStoryNav');
      if (!active) {
      dropdown.slideDown();
      } else {
      active.removeClass("selected");
      content.empty();
      }
      active = stories;
      active.addClass("selected");
      showStories(content);
    }
  });
  var settings = menu.find("li.settings").click(function() {
    if (active === settings) {
      active.removeClass("selected");
      active = null;
      dropdown.slideUp();
      content.empty();
    } else {
      dropdown.css('background-image','url(/images/ajax-loader.gif)');
      dropdown.removeClass('newStoryNav');
      if (!active) {
      dropdown.slideDown();
      } else {
      active.removeClass("selected");
      content.empty();
      }
      active = settings;
      active.addClass("selected");
      showSettings(content, "");
    }
  });

  var home = menu.find("li.home").click(function() {
    window.location.href = "/me"
  });

  var privacy = menu.find("li.login").click(function() {
    window.location.href = "/login"
  });

  var signup = menu.find("li.signup").click(function() {
    window.location.href = "/signup"
  });

  var ourSite = menu.find("li.ourSite").click(function() {
    window.location.href = "/site"
  });


  var contributors = menu.find("li.contributors").live('click',function() {
    if (active === contributors) {
      active.removeClass("selected");
      active = null;
      dropdown.slideUp();
      content.empty();
    } else {
      dropdown.css('background-image','url(/images/ajax-loader.gif)');
      dropdown.addClass('newStoryNav')
      if (active === null) {
      dropdown.slideDown();
      } else {
      active.removeClass("selected");
      content.empty();
      }
      active = contributors;
      active.addClass("selected");
      showContributors(content);
    }
  });
/*
  var addFriend = menu.find("li.add_friend").live('click',function() {
    Gnarly.json(['get', window.location.href], function(xhr, json) {
      Memolane.Friends.request(json.username, function(status, data) {
        if (status === 201) {
    // ToDo: Better way of communicating this
          MemoLane.showAlert("friendRequested", {"username": json.username})
          add.remove();
        } else if (status === 409) {
          var msg = data.message;
    // ToDo: Better way of communicating this
          //alert("A request already exists - the status is " + msg);
          MemoLane.showAlert("friendRequestPending", {"username": json.username})
          add.remove();
        } else {
    // ToDo: Better way of communicating this
          MemoLane.showAlert("error", {});
        }
      });
    });
  });
*/
  var privacy = menu.find("li.privacy").live('click',function() {
    if (active === privacy) {
      active.removeClass("selected");
      active = null;
      dropdown.slideUp();
      content.empty();
    } else {
      dropdown.css('background-image','url(/images/ajax-loader.gif)');
      dropdown.addClass('newStoryNav');
      if (active === null) {
        dropdown.slideDown();
      } else {
        active.removeClass("selected");
        content.empty();
      }
      active = privacy;
      active.addClass("selected");
      showPrivacy(content);
    }
  });

}

// Feed counter
var countFeeds = function() {
  var count = $("li.feed > .count");

  Gnarly.json(['get', "/feed/volume"], function(xhr, data) {
    if (xhr.status === 200) {
      if( data.volume != 0 ){
        if(data.volume > 9){
          count.css('left','3px').show().html(data.volume);
        }else{
          count.css('left','8px').show().html(data.volume);
        }
      }
    }
  });
}

// Feed counter
var countFriends = function() {
  var count = $("li.friends > .count");

  Gnarly.json(['get', "/friends/requested"], function(xhr, data) {
    if (xhr.status === 200) {
      if( data.length ){
        if(data.length > 9){
          count.css('left','9px').show().html(data.length);
        }else{
          count.css('left','14px').show().html(data.length);
        }
      }else{
        count.hide();
      }
    }
  });
}


var sendInvites = function() {
  var $html = $('<div id="inviteFriendsDialog" class="memolaneDialog">'+
    '<div class="dialogTopBar">'+
        '<div class="dialogTopBarLine">'+
            '<div class="dialogTitle">Add friends to join Memolane:</div>'+
            '<div class="close closeMemolaneDialog">cancel</div>'+
            '<div class="clearFloatNoHeight"></div>'+
        '</div>'+
    '</div>'+
    '<div class="dialogContent">'+
      '<div id="emailUi">'+
      '<p style="margin-bottom:20px;">Enter email addresses of friends you want to invite to Memolane. <br />Existing users will automatically get a friend request.</p>'+
      '<label>Enter comma separated email addresses</label>'+
      '<textarea></textarea>'+
      '<a href="#" id="sendInviteBtn">Send Invites</a>'+
      '</div>'+
      '<div id="invitesSentMessage">'+
          '<h3 class="highlightText">Invites Sent!</h3>'+
          '<div id="friendsExist">'+
              '<h3>We also found a friend or two already on Memolane!</h3>'+
              '<p>Here are the folks you sent friend requests to:'+
              '<ul id="existingAccounts"></ul>'+
          '</div>'+
          '<a href="#" id="okBtn" class="greenButton close">OK</a>'+
      '</div>'+
    '</div>'+
  '</div>')
  .find('textarea')
  .keyup(function(){
    if($(this).val()===''){
      $("#sendInviteBtn").fadeTo(0,0.5).css('cursor','default');
    }else{
      $("#sendInviteBtn").fadeTo(0,1).css('cursor','pointer');
    }
    this.style.height='';
      this.rows=this.value.split('\n').length;
      this.style.height=this.scrollHeight+'px';
  })
  .end();

  // track whether friends were requested so later we can reload the window
  var friendsRequested = false;

  $html.find("#sendInviteBtn").bind( 'click', function() {
    if($(this).css('opacity')==='0.5'){return false};
    //get the list of emails
    var emailsText    = $(this).siblings("textarea").val();
    var emails        = emailsText.split(",");
    var noValidEmails = false;

    $.each(emails,function(index,value){
      if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)){noValidEmails = true};
    });

    if(!noValidEmails){
      if($('.dialogContent div label').text() === 'Enter comma separated email addresses'){
        $('.dialogContent div label').html('A minimum of one valid email is required before sending invites');
      }
      return false;
    };

    // if valid emails and there's at least one
    if( emailsText != "" && emails.length > 0) {

      // send email invites and check to see if emails correspond to existing Memolane accounts
      $.ajax({
        type: 'post',
        url: "/email_invite",
        // invite_friends parameter needed to invite existing Memolane users
        // data: { "emails": emails, "invite_friends": "1" },
        data: { "emails": emailsText, "invite_friends": "1" },
        complete: function(data) {
    $('#emailUi').hide();
    $('#invitesSentMessage').show();

    $('#inviteFriendsDialog')
      .find('.dialogTitle').text('Invites Sent').end()
      .find('.closeMemolaneDialog').text('close');

    // make sure we have a valid JSON object
    if (data.getResponseHeader("Content-Type").match(/^application\/json/)) {
      data = jQuery.parseJSON(data.responseText);
    }

    // if there were existing accounts, show user friend requests
    //  - expecting JSON like this: http://jsfiddle.net/nathanlogan/FHH4f/2/
    if ( data.friendsRequested ) {
      // set to true, so we reload after dialog close, so "Friends" menu item is populated
      friendsRequested = true;
      var friendsAddedHTML = '';
      $.each( data.friendsRequested, function( i, thisUser ){
        // zebra stripe
        ( i % 2 == 0 ) ? (friendsAddedHTML += '<li>') : (friendsAddedHTML += '<li class="zebraOdd">');
        friendsAddedHTML += '<img src="'+ thisUser.avatar +'" /> '+ thisUser.name +' <span>'+ thisUser.username +'</span></li>';
      });
      $('#friendsExist').find('#existingAccounts').append( friendsAddedHTML ).end().show();
    }
        }
      });
    }

    return false;
  });

  $html.lightbox_me({modalCSS: {top:'50px'},destroyOnClose:true,overlayCSS:{background: '#000',opacity: .8}, onClose: function(){if (friendsRequested) window.location.reload()}});
}

// Lane owner
$(function() {
  MemoLane.embedded = window.top != window.self;


  var memberStaticTemplate = Haml('\
.search\n\
  %input{value: "search memos, stories, and users"}\n\
.logOutLink\n\
  %a{href:"/logout"} Logout\n\
.ourSiteLink\n\
  %a{href:"/site",class:"memolaneSite"} Our Site\n\
%a.closeSearch\n\
  exit search\n\
%ul.menu\n\
  %li.home Home\n\
  %li.friends Friends\n\
    .count 0\n\
  %li.stories Stories\n\
  %li.feed News\n\
    .count 0\n\
  %li.settings Settings');

  var guestStaticTemplate = Haml('\
.search\n\
  %input{value: "search memos, stories, and users"}\n\
%a.closeSearch\n\
  exit search\n\
%ul.menu\n\
  %li.login Login\n\
  %li.orTxt or\n\
  %li.signup Signup\n\
  %li.ourSite Learn about Memolane');


  var youTemplate = Haml('\
.with_image\n\
  .image\n\
  .content\n\
    .profile\n\
      .name.your_name = first_name + " " + last_name\n\
      .status That\'s you');

  var friendTemplate = Haml('\
.with_image\n\
  .image\n\
  .content\n\
    .profile\n\
      .name = first_name + " " + last_name\n\
      .status Friend');

  var userTemplate = Haml('\
.with_image\n\
  .image\n\
  .content\n\
    .profile\n\
      .name = first_name + " " + last_name\n\
      .status = status\n\
    .actions\n\
      %ul.menu\n\
        %li.add_friend Add Friend');

  var guestUserTemplate = Haml('\
.with_image\n\
  .image\n\
  .content\n\
    .profile\n\
      .name = first_name + " " + last_name\n\
      .status = status');

  var storyTemplate = Haml('\
.without_image\n\
  .content\n\
    .story_info\n\
      .privacy =privacy\n\
      .title{contenteditable: is_owner, field: "title"} =title\n\
      .description{contenteditable: is_owner, field: "description"} =description\n\
    .actions\n\
      %ul.menu\n\
        %li.contributors Contributors\n\
        :if is_owner\n\
          %li.privacy Privacy\n\
        %li.add_to_story Add Memos');

  var storyTemplateNotContributer = Haml('\
.without_image\n\
  .content\n\
    .story_info\n\
      .privacy =privacy\n\
      .title{contenteditable: is_owner, field: "title"} =title\n\
      .description{contenteditable: is_owner, field: "description"} =description\n\
    .actions\n\
      %ul.menu\n\
        %li.contributors Contributors\n\
        :if is_owner\n\
          %li.privacy Privacy');


  var guestStoryTemplate = Haml('\
.without_image\n\
  .content\n\
    .story_info\n\
      .title{contenteditable: is_owner, field: "title"} =title\n\
      .description{contenteditable: is_owner, field: "description"} =description\n\
    .actions\n\
      %ul.menu\n\
        %li.contributors Contributors');

  var storyEditTemplate = Haml('\
.without_image\n\
  .content\n\
    .story_info\n\
      .description Select Memos\n\
      .title{contenteditable: is_owner, field: "title"} =title\n\
    .actions\n\
      %ul.menu\n\
        %li.story_done I\'m Done, View Story');

  var unknownTemplate = Haml('\
.with_image\n\
  .image\n\
  .content\n\
    .profile\n\
      .name = "Unknown"');

  Gnarly.json(['get', window.location.href], function(xhr, json) {
    if (false) {
        Gnarly.json(['get', '/me'], function(xhr2, currentUser) {
        if (true){//xhr2.status === 200 || xhr2.status === 403  ) {

          if( MemoLane.embedded ) {

            var embBorder     = $("#urls .embedded").attr("border");
            var embBackground = $("#urls .embedded").attr("background");


            if( !embBackground || embBackground == "" || embBackground == "default" )
              embBackground = "black";

            if( embBackground != "memolane" )
               $("body").css("background", embBackground);

            if( !embBorder || embBorder == "" || embBorder == "default" )
              embBorder = "1px solid #FFF"
            
	    // set border
	    $("#middle").css("border", embBorder);


            $("#embedded-branding").show();

            //handle the "to lane" link
            $("#embedded-source-link").attr("href", window.location.href);
            var laneName = "";
            if ( json.username )
              laneName = json.first_name + " " + json.last_name + "'s lane";
            else if (json.type == "story" )
              laneName = "the '" + json.title  + "' story"; 
            

            $("#embedded-source-link p").html( "Open " + laneName  );
            
  
            $(".datelane").hide();
            $(".fader").height(1);
            $(".fader").css( "background", "white");

            var height = $("#middle").height() + 60;
            $("#viewport").height(height);
            $("#timeline").height(height);

            $("#middle").css("padding-top",10);

            var barline = $("#barline");
            barline.height(25);

            barline.find(".barlane").addClass("barlane-embed");
            barline.find(".barlane .marker").addClass("marker-embed");
            barline.find(".barlane .markerHere").addClass("markerHere-embed");
            barline.find(".barlane .bump").remove();


          } else {
            $("#top").show();
            $("#fdbk_tab").show();

            //setup the static part based one whether a user is logged in or not
            var static = $("#top .panel > .static" );
            var staticHtml;

            if(currentUser) {
              MemoLane.currentUser = MemoLane.sanitizeUser( currentUser );
              staticHtml = memberStaticTemplate({});
            } else {
              MemoLane.currentUser = null;
              staticHtml = guestStaticTemplate({});
            }

            var staticObject = $(staticHtml);
            static.append( staticObject );

            handleStaticActions( $("#top .panel") );


            //setup the extension part based one what we are looking at and what permissions we have
            var extension = $("#top .panel > .extension" );
            var object;

            Memolane.currentStoryId = "";

            if ( json.error ) {
              var html;
              if( json.error = 404 ) {
                $("body").addClass("error")
                html = unknownTemplate(json);
              }
              object = $(html);
              object.find(".image").css("background-image", "url(/images/unknown.png)");

            } else if ( json.username ) {

              var html;
              if (json.self) {
                $(".privacyFilter").css("display", "block");
                $("body").addClass("self")
                html = youTemplate(json);
              } else {
                $(".privacyFilter").remove();
                if (json.friend) {
                  $("body").addClass("friend")
                  html = friendTemplate(json);
                } else {

                  $("body").addClass("public");

                  if( currentUser ) {
                    html = userTemplate(json);
                  } else {
                    html = guestUserTemplate(json);
                  }
                }
              }

              object = $(html);
              object.find(".image").css("background-image", "url(" + json.username + "/image)");

            } else if (json.type == "story" ) {

              json = MemoLane.sanitizeStory( json )

              Memolane.currentStoryId = json._id;
              Memolane.currentStoryOwner = json.is_owner;

              if( json.privacy == "members" )
                json.privacy = "Private"
              else
                json.privacy = "Public"

              if( window.location.href.match( json._id + "/add")== json._id + "/add" ) {

                //in add to story mode, a user is always viewing their own lane
                MemoLane.laneOwner = MemoLane.currentUser;

                $("body").addClass("story_add");

                html = storyEditTemplate(json);
                object = $(html);
                var actions = object.find(".content > .actions");
                var done = actions.find("> .menu > .story_done");
                done.click(function() {
                  window.location.href = "/stories/" + json._id
                });

              } else {
                $("body").addClass("story");


                if( currentUser ) {
                  html = storyTemplate(json);
                } else {
                  html = guestStoryTemplate(json);
                }


                if(currentUser && $.inArray(currentUser.id,json.members) === -1){
                html = storyTemplateNotContributer(json);
                }

                object = $(html);
                var actions = object.find(".content > .actions");

                var add = actions.find("> .menu > .add_to_story");
                add.click(function() {
                  window.location.href = "/stories/" + json._id + "/add";
                });
              }
            }

            extension.append(object);

            object.find('*[contenteditable="true"]').each(function(i, e) {
              var editable = $(e);
              var field = editable.attr("field");
              var oldText;
              editable.focus(function() {
                oldText = editable.text();
              }).blur(function() {
                var text = editable.text();
                if (text !== oldText) {
                  var url = "/stories/" + json._id + "/" + field;
                  var data = {};
                  data[field] = text;
                  Gnarly.http(['put', url, {}, data], function(xhr) {
                    if (xhr.status != 200) {
                editable.text(oldText);
                // ToDo: Error Handling
                    }
                  });
                }
              }).keydown(function(e) {
                if (e.keyCode === 27) {
                  editable.text(oldText).blur();
                } else if (e.keyCode === 13) {
                  editable.blur();
                }
              });
            });

            //don't do this for guests
            if( MemoLane.currentUser ) {
              countFeeds();
              countFriends();
            }
          }

          $(document).trigger("memolane:topbar:ready");
        } else {
          $("body").addClass("error")
          // ToDo: Error Handling
        }
      });
    } else {
      $("body").addClass("error")
      // ToDo: Error Handling
    }

  });

});

$(function() {
  $("#top input").keyup(function() { return false; });
  $("#top *[contenteditable=true]").keyup(function() { return false; });

  $('.whatThisStory').live('mouseenter',function(e){
      $.doTimeout('hover',350,function(that){
      var left = Math.ceil($(that).offset().left-500)+'px';
      var top = Math.ceil($(that).offset().top-33)+'px';
    $('.CSStooltip').css({'left':left,'top':top}).fadeIn('fast');

    },this);
  }).live('mouseleave',function(e){
      $.doTimeout('hover');
    $('.CSStooltip').hide();
    return false;
  });

  $('.CSStooltip').live('mouseenter',function(){
    $(this).show();
  }).live('mouseleave',function(){
    $(this).hide();
  });

  $('.deleteAccount').live('click',function(){
    var $html = $('<div id="deleteAccountDialog" class="memolaneDialog">'+
            '<div class="dialogTopBar">'+
                '<div class="dialogTopBarLine">'+
                    '<div class="dialogTitle">Delete Account</div>'+
                    '<div class="close closeMemolaneDialog">cancel</div>'+
                    '<div class="clearFloatNoHeight"></div>'+
                '</div>'+
            '</div>'+
            '<div class="dialogContent">'+
                '<p><strong>Are you sure?</strong></p>'+
          '<p>Deleting your account will remove all of your friendships, delete memos and disassociate your services from Memolane.</p>'+
          '<p>To delete this account enter your password and click the delete button.<br /><label>Password:<input type="password" id="confirmDelete" /></label></p>'+
          '<p id="deletingInfo"><span></span><a href="#" class="redButton" id="deleteAccountBtn">Delete</a></p>'+
          '<div class="clearFloatNoHeight"></div>'+
            '</div>'+
        '</div>');

    $html.lightbox_me({overlayCSS:{background: '#000',opacity: .8},destroyOnClose:true});
    return false;
  });

  $('#deleteAccountBtn').live('click',function(){
    if($('#confirmDelete').val()===''){
      $('#deletingInfo').find('span').text('Please provide a password.');
    }else{
      $('.redButton').hide();
      $('#deletingInfo').find('span').text('Hold on while we delete your account.');
      setTimeout(function(){
        $.ajax({
          type: "POST",
          url: "close_account",
          data: {'password':$('#confirmDelete').val()},
          success: function(data,textStatus){
            $('#deletingInfo').find('span').text('Account deletion successful! Logging you out in 4 seconds.');
            setTimeout(function(){window.location.replace('/signup')},4000);
          },
          error:function(jqXHR, textStatus, errorThrown){
            if(jqXHR.status === 403){
            $('.redButton').show();
            $('#deletingInfo').find('span').text('Incorrect password try again.');
            }
          }
        });
      },2000);
    }
  return false;
  });

  //click event for to open dialog to invite friends
  $('#tellFriends a').live('click',function(){
    sendInvites();
    return false;
  });

  $(document).bind("memolane:topbar:ready", function() {
    if(window.location.hash === '#open_friends_dropdown'){
      $('.friends').trigger('click');
    }
  });

});
