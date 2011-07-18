$(document).bind("memolane:topbar:ready", function() {

  $("#notification_container").notify({
      speed: 500,
      expires: false,
      stack: 'above'
  });

  //only if a user is logged in and viewing his own lane


  hrefArray = window.location.href.split( "/" );
  userPart = hrefArray[hrefArray.length-1]

  if( MemoLane.currentUser && ( userPart == "me" || userPart == MemoLane.currentUser.username ) ) {

    //check if we have already shown the errors this browser session
    var value = sessionStorage.getItem("serviceErrorsShown");
    if( !value ) {
      sessionStorage.setItem("serviceErrorsShown", "true");
      Gnarly.json(['get', "/accounts"], function(xhr, json) {
        if (xhr.status === 200) {

          $.each(json.accounts, function(i, account) {

            if( account.error ) {

              account = MemoLane.sanitizeAccount( account );

              var date = new Date( account.error.timestamp * 1000 );
              var timeString = date.toLocaleString();

              var errorDescription = "Unknown error"
              if( account.error.type == "access_revoked" ) {
                errorDescription = "We are no longer authorized to access your '" + account.username + "' " + account.service_name + " account. <a target='_blank' href='/services/" + account.service + "' >Reauthorize it</a> or remove service from the <a href='/signup/services' >'Service Setings </a> page"
              } else if ( account.error.type == "remote_service_error" ) {
                errorDescription = "At " + timeString + " we received an error from " + account.service_name + "'s API and we have been unable to receive content from "+ account.service_name + ". We will keep trying..."
              } else if ( account.error.type == "rss_error" ) {
                errorDescription = "Since " + timeString + " we have not been able to access the RSS feed '"  + account.username  +  "' (" + account.service_id + "). We will try again later. You can also go to the <a href='/signup/services' >'Service Setings </a> page and add the feed again."
              } else if ( account.error.type == "no_privacy_set" ) {
                errorDescription = "You have not yet specified a privacy level for your '" + account.username + "' "  + account.service_name + " account. Go to the <a href='/signup/services' >'Service Setings </a> page to select one.";
              }

              $("#notification_container").notify("create", "notification_template", {
                title: account.service_name + " Error",
                text: errorDescription,
                service: account.service
              });
            }
          });

        }
      });
    }
  }
  //dummy errors for Aubrey

  var hash = window.location.hash;
  if( hash && hash == "#dummy_errors") {

	$("#notification_container").notify("create", "notification_template", {
      title: "Privacy Change",
      text: 'Privacy for the story you\'re a collaborator in called "My New Story" has changed to Friends only.',
      service: "privacyChange"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "Error 1",
      text: "Hi. I'm an Error message with a quite long description text that needs to span several lines so we can see how the style looks in cases like this. I wonder if this is long enough or if I should add some more text....",
      service: "twitter"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "Facebook",
      text: "I'm short and to the point!",
      service: "facebook"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "Foursquare",
      text: "I'm short and to the point!",
      service: "foursquare"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "TripIt",
      text: "I'm short and to the point!",
      service: "tripit"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "Last.FM",
      text: "I'm short and to the point!",
      service: "lastfm"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "Picasa",
      text: "I'm short and to the point!",
      service: "picasa"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "Twitter",
      text: "I'm short and to the point!",
      service: "twitter"
    });


    $("#notification_container").notify("create", "notification_template", {
      title: "Youtube",
      text: "I'm short and to the point!",
      service: "youtube"
    });

    $("#notification_container").notify("create", "notification_template", {
      title: "RSS Feed",
      text: "I'm short and to the point!",
      service: "feed"
    });

  }

});
