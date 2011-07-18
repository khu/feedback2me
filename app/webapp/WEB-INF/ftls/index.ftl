  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>

    <script type='text/javascript'>
    var url = "http://localhost:8080/feedback.me/${email}"
    </script>
    <title>Memolane | See, search, and share your life</title>
    <link href='./stylesheets/screen.css' rel='stylesheet' type='text/css' />
    <link href='./stylesheets/global.css' rel='stylesheet' type='text/css' />
    <link href='./stylesheets/top.css' rel='stylesheet' type='text/css' />
    <link href='./stylesheets/memo.css' rel='stylesheet' type='text/css' />

    <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'></script>

    <script src='./javascripts/3rdParty.js' type='text/javascript'></script>
    <!--
    <script src='./javascripts/jquery.ui.widget.js' type='text/javascript'></script>
    <script src='./javascripts/jquery.notify.min.js' type='text/javascript'></script>
    <script src='./javascripts/underscore-min.js' type='text/javascript'></script>
    <script src='./javascripts/mustache.js' type='text/javascript'></script>
    <script src='./javascripts/json2.js' type='text/javascript'></script>
    <script src='./javascripts/haml.js' type='text/javascript'></script>
    <script src='http://maps.google.com/maps/api/js?sensor=false' type='text/javascript'></script>
    -->
    <script src='./javascripts/gnarly.js' type='text/javascript'></script>
    <script src='./data/memos.js' type='text/javascript'></script>
    <script src='./javascripts/application.js' type='text/javascript'></script>
    <script src='./javascripts/notifications.js' type='text/javascript'></script>
    <script src='./javascripts/memoProxy.js' type='text/javascript'></script>
    <script src='./javascripts/top.js' type='text/javascript'></script>
    <script src='./javascripts/handlers.js' type='text/javascript'></script>
    <script src='./javascripts/search.js' type='text/javascript'></script>
    <meta content='user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0' name='viewport' />
    <meta content='yes' name='apple-mobile-web-app-capable' />
    <meta content='black' name='apple-mobile-web-app-status-bar-style' />
    <link href='./images/i-icon.png' rel='apple-touch-icon' />
    <link href='./images/welcome.png' rel='apple-touch-startup-image' />
    <link href='./images/favicon.gif' rel='shortcut icon' type='image/gif' />
    <link rel="image_src" type="image/png" href="./images/i-icon.png"/>

    <meta name="title" content="Memolane | See, search, and share your life" />
    <meta name="description" content="Keep your memories alive. Capture photos, music, tweets, posts, and much more. View and share your entire online life in one place. Explore and search your history. One timeline, a million memories." />

</head>

<body>

<!--[if IE]>
<div id="IEBrowserAlert">
<a href="http://www.whatbrowser.org/" title="whatbrowser.org">
<img src="/images/IEBrowserAlertLeft.png" class="floatLeft" width="377" height="25" />
<img src="/images/IEBrowserAlertRight.png" class="floatRight" alt="IEBrowserAlertRight" width="370" height="25" />
</a>
<div class="clearFloatNoHeight"></div>
</div>
<![endif]-->

    <div id='top' style="display:none;">
        <div class='panel'>
            <div class='extension'></div>

            <div class='static'></div>

            <div class='static_end'></div>

            <div class='dropdown'>
                <div class='content'></div>
            </div>

        <div class="searchUI">
    <div class="searchType">
      <label>Search:</label><ul id="searchTabs"><li class="active" id="searchType-memos">Memos</li><li id="searchType-stories">Stories</li><li id="searchType-users">Users</li></ul>
      </div>

      <div class="searchResults"><ul></ul></div>
      <div class="searchLoader">Loading more results from <span></span> total results</div>
      <div class="disableScrollBar"></div>
  </div>
        </div><a class='home' href='/'><img src='/images/logo.png' /></a>
    </div>

    <div id='middle'>
        <div id='viewport'>
            <div class='nav'>
                <div class='backward' title="go back in time">
                    <div class='arrow'></div>
                </div>
          <div class='privacyFilter viewAsMe' title='change lane view' data-currentLaneView='viewAsMe'></div>
                <div class='forward'>
                    <div class='arrow' title="go forward in time"></div>
                </div>
            </div>

            <div id='timeline'>
                <div class='slot'>
                    <div class='content'>
                        <div class='head'>
                            <div class='connect'></div>

                            <div class='date'></div>
                        </div>

                        <div class='spacer'></div>

                        <div class='viewport'>
                            <div class='body'></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class='fader'></div>
        </div>

        <div id='barline'>
            <div class='datelane'>
                <div class='date'></div>
            </div>

            <div class='barlane'>
                <div class='marker'></div>

                <div class='bump'></div>
                <div class='markerHere'></div>
            </div>
        </div>
    </div>

    <div id='bottom'>
      <div id='embedded-branding' style="display:none;">
        <span class="source"><a id="embedded-source-link" href="#" target="_blank"><p>View full size</p></a></span>
        <span class="powered-logo"><a href="http://memolane.com/site" target="_blank"><img src="/images/powered-by-memolane.png" /></a></span>
      </div>
    </div>

    <div id='urls'>
        <a class='memos' href='/stories/fd2c8b05e61a84bebc800c11fca9485b/memos'></a>
        <a class='volume' href='/stories/fd2c8b05e61a84bebc800c11fca9485b/volume'></a>
        <a class='search' href='/users/search'></a>
        <a class='story' href='fd2c8b05e61a84bebc800c11fca9485b' edit_mode='false' new_story='' first_edit='' ></a>
        <a class='embedded' href='#' border='' background='' ></a>
    </div>

    <div id='message_overlay' class='message_overlay'>
        <h1> That's a short story! </h1>
        <p>  The owner / contributors are probably adding content, check back soon. </p>
    </div>

    <div id='embedded_message_overlay' class='message_overlay' style="display: none;">
        <h1> Nothing to see here... </h1>
        <p> This lane has no public content to show! </p>
    </div>


    <div id="notification_container" style="display:none; top:auto; right:0px; bottom:0px; margin:0 0 10px 10px" >
      <div id="notification_template" class="#{service}" style="margin-top:10px;text-align:center">
          <a class="ui-notify-cross ui-notify-close" href="#">x</a>
          <h1>#{title}</h1>
          <p>#{text}</p>
      </div>
    </div>

    <div class="CSStooltip">
      <h5>A story is a new timeline where you and your friends can combine favorite memories from your own Memolane. <h5>

    <h5>Stories can be about events in the past, present, or events yet to come.</h5>

    <h5>Here are some examples:</h5>

    <p><a href="http://memolane.com/stories/835d959b74eb9e4b60a6aa4f7e239f8b">Visit to Denmark</a></p>
    <p><a href="http://memolane.com/stories/8a3d3bacd1eef863886c00023c5dc8ed">The Memolane Story</a></p>
      <div class="CSSpointerBox"><div class="CSSpointer"><div class="CSSpointer-inner"></div></div></div>
  </div>

</body>
</html>
