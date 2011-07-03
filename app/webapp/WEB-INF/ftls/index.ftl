<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>People who did not commit timesheet on time.</title>
    <link rel="stylesheet" href="/css/base.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="/css/aristo/jquery-ui-1.8.5.custom.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="/js/timeglider/Timeglider.css" type="text/css" media="screen" title="no title" charset="utf-8">

	<script src="/js/jquery-1.4.4.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/jquery.tmpl.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/underscore-min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/backbone-min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/jquery-ui-1.8.9.custom.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/ba-debug.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/ba-tinyPubSub.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/jquery.mousewheel.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/jquery.ui.ipad.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/raphael-min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/jquery.global.js" type="text/javascript" charset="utf-8"></script>
	<!-- insert glob culture file here -->
	<script src="/js/jquery.global/jquery.glob.fr-FR.js" type="text/javascript" charset="utf-8"></script>
	
	<!-- TIMEGLIDER -->
	<script src="/js/timeglider/TG_Date.js" type="text/javascript" charset="utf-8"></script>
    <script src="/js/timeglider/TG_Org.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/timeglider/TG_Timeline.js" type="text/javascript" charset="utf-8"></script> 
	<script src="/js/timeglider/TG_TimelineView.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/timeglider/TG_Mediator.js" type="text/javascript" charset="utf-8"></script> 
	<script src="/js/timeglider/timeglider.timeline.widget.js" type="text/javascript" charset="utf-8"></script>


<style type='text/css'>
		#placement {
			margin:32px;
			height:500px;
		}
</style>
</head>
<body>
    <div id='placement'></div>

    <script type="text/javascript">
	$(document).ready(function () {
		var tg1 = $("#placement").timeline({
				"min_zoom":5,
				"max_zoom":60,
				"show_centerline":true,
				"data_source":"/${email}.json",
				"show_footer":true,
				"size_importance":true,
				"display_zoom_level":true
		});

    });
    </script>
</body>
</html>

