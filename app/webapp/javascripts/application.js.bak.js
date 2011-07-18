var MemoLane = {};

MemoLane.username = "d458a0ce02fbb7eafb4aa433d800022f";
MemoLane.password = "foo";
MemoLane.initialIndex = 0;
MemoLane.storyMembers = {};
MemoLane.changedPrivacies = {};


//not passing anything is the same as all, and it makes the lane work correctly for other people
MemoLane.visibility = null;

MemoLane.config = {
  memo: {
    large: {
      width: 550
    }
  }
};

MemoLane.today = function() {
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

MemoLane.dateOffset = function(date, offset) {
  var ms = date.valueOf();
  return new Date(ms + offset * 86400000);
};

MemoLane.formatUTCDate = function(sec) {
  var d = new Date(sec * 1000);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toDateString();
};

MemoLane.BarLine = function(barline, fromTime, toTime, callback) {
  this.callback = callback;
  this.barline = barline;
  this.fromTime = fromTime;
  this.toTime = toTime;
  this.deltaSec = this.toTime - this.fromTime;
  this.calibrate();
  this.barlane = this.barline.find("div.barlane");
  
  this.date = this.barline.find("div.datelane div.date");
  if(window.top != window.self) {
    //move the date marker into the barlane to save space
    var datelane = 
    $("div.datelane").remove("div.date");
    $("div.barlane").append(this.date);
    this.date = this.barline.find("div.barlane div.date");
  } 
    
    
  
  
  
  this.marker = this.barlane.find("div.marker");
  this.marker.hide();
  this.bump = this.barlane.find("div.bump");
  this.bump.hide();

  var t = this;
  this.barlane.mouseenter(function(e) {
    var x = e.pageX;
    t.update(x);
    t.marker.show();
    t.bump.show();
    return false;
  });
  this.barlane.mousemove(function(e) {
    var x = e.pageX;
    t.update(x);
    return false;
  });
  this.barlane.mouseleave(function(e) {
    t.reset();
    t.marker.hide();
    t.bump.hide();
    return false;
  });
  this.barlane.click(function(e) {
    $('#viewport').css({'background-image':'url("/images/large-loading2.gif")',
    					'background-repeat':'no-repeat',
    					'background-position':'center center'});

	//fake way to mark what we click on the barline
   	$('.markerHere').css('left',e.pageX-1+'px');

    t.callback(t.secOfPoint(e.pageX));

  });
};

MemoLane.BarLine.prototype.secOfPoint = function(x) {
  return Math.ceil( ( ( x / this.length ) * this.deltaSec ) + this.fromTime );
};

MemoLane.BarLine.prototype.update = function(x) {
  var sec = this.secOfPoint(x);
  this.date.text(MemoLane.formatUTCDate(sec));
  var w = this.date.width();
  var offset = Math.max((x - Math.ceil(w / 2)), 5);
  offset = Math.min(offset, this.length - w - 5);
  this.date.css("left", offset + "px");
  this.marker.css("left", (x - 1) + "px");
  this.bump.css("left", (x - 60 - ((x + 3) % 7)) + "px");
};

MemoLane.BarLine.prototype.reset = function(x) {
  this.date.text("");
};

MemoLane.BarLine.prototype.calibrate = function() {
  this.length = this.barline.width();
};

MemoLane.TimeLine = function(timeline, list, makeUrl, memoHandlers) {
  this.timeline = timeline;
  this.list = list;
  this.makeUrl = makeUrl;
  this.memoHandlers = memoHandlers;
  this.viewport = timeline.parent();
  this.masterSlot = timeline.find("> div.slot");
  this.slotWidth = this.masterSlot.outerWidth();
  this.masterSlot.remove();
  this.slotCount = Math.ceil(9000 / this.slotWidth);
  this.preferredOffset = Math.ceil(this.slotCount / 3) * this.slotWidth - 5;
  this.slots = [];
  this.timeline.width(this.slotCount * this.slotWidth);
  this.slotsPerScreen = Math.floor(this.viewport.width() / this.slotWidth);


  this.memoProxy = new MemoLane.MemoProxy.Proxy($("#urls .memos").attr("href"), MemoLane.visibility);

  var t = this;

  var offset = Math.ceil(this.slotCount / 3) + Math.floor(this.viewport.width() / this.slotWidth);
  if( MemoLane.initialIndex != 0)
    offset = Math.floor( offset + MemoLane.initialIndex - (this.slotsPerScreen / 2 ) );

  this.fill(list.length - offset, function() {
  	t.viewport.css('background','none');
    t.timeline.animate({opacity: 1.0}, 'fast',function(){
    	var theMemoid = MemoLane.memoDeepLinkId;
    	if(theMemoid){
    	
	    	var memo = $('#'+theMemoid);
	    		
	        if( memo.length == 0 ) {
	          //no top level item found... we need to look inside stacks
	          var memos = $('.memo');
	          $.each(memos, function(i, group) {
	            //get ids in group
	            idsInGroup = $(group).data( "ids" );
	            if( idsInGroup && idsInGroup.length > 1 )
	              $.each(idsInGroup, function(i, idInGroup) {
	                idInGroup = "id" + decodeURIComponent( idInGroup ).replace(/[:_@\.\/]/g, "");
	                if( idInGroup == theMemoid ) {
	                  memo =  $(group).closest(".memo");
	                  return;
	                }
	              });
	          });
	        }
			
	        if( memo.length ) {
	          var bodyY = -memo.position().top;
	          memo.find('.content').addClass('glow-in-story');
	          memo.parent().animate({top: bodyY},600,function(){
	            memo.trigger('mouseup');
	            window.setTimeout(function(){memo.find('.content').removeClass('glow-in-story')}, 3000);
	          });
	        } else { //you were linked to a memo u don't have the privacys rights to see or is gone...

	        var $html = $('<div id="noMemoDeepLinkDialog" class="memolaneDialog">'+
	        '<div class="dialogTopBar">'+
	            '<div class="dialogTopBarLine">'+
	                '<div class="dialogTitle">Can\'t show that memo...</div>'+
	                '<div class="clearFloatNoHeight"></div>'+
	            '</div>'+
	        '</div>'+
	        '<div class="dialogContent">'+
				'<p>The memo you\'re trying to find either has a privacy level you don\'t have access to or has been removed.<br /><a href="#" class="greenButton close">Ok</a></p>'+
				'<div class="clearFloatNoHeight"></div>'+
	        '</div>'+
	    '</div>');
	
	    		$html.lightbox_me({modalCSS: {top:'150px'},overlayCSS:{background: '#000',opacity: .8},onLoad:function(){ $('.greenButton.close').focus() }});
	        }

    		MemoLane.memoDeepLinkId = null;

    	}
    });
  });

  this.down = false;
  var dragX = false;
  this.dragY = false;
  this.startX = null;
  this.startY = null;
  this.moveY = null;
  this.$leftEmptySlot = null;
  this.$rightEmptySlot = null;
  this.atRightEdge = null;
  this.atLeftEdge = null;
  this.atRightEdgeStop = null;
  this.atLeftEdgeStop = null;

  this.lock = false;

  var mousedown = function(x, y) {
    t.down = true;
    t.startX = x;
    t.startY = y;
    t.$rightEmptySlot = t.timeline.find('.slot:not(.empty):last').next();
    t.$leftEmptySlot = t.timeline.find('.slot:not(.empty):first').prev();
    t.atRightEdge = t.$rightEmptySlot.length;
    t.atLeftEdge = t.$leftEmptySlot.length;
    t.atRightEdgeStop = t.atRightEdge ? t.$rightEmptySlot.offset().left < t.viewport.width() : null;
    t.atLeftEdgeStop = t.atLeftEdge ? t.$leftEmptySlot.offset().left > 0 : null;
  };

  this.timeline.mousedown(function(e) {
    if(e.target.nodeName.toLowerCase() == "object" || e.target.nodeName.toLowerCase() == "embed"){
      return;
    }else{
      mousedown(e.pageX, e.pageY);
      return false;
    }
  });

  this.timeline.bind("touchstart", function(e) {
    mousedown(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
    return false;
  });

  var mousemove = function(x, y) {

    if (dragX) {
      var d = x - t.startX;

      //stop if at end of timeline right
      if(t.atRightEdge){
        if(t.atRightEdgeStop && d<0){
          t.down = false;
          dragX = false;
        }else{
          t.timeline.css("left", (t.timelineX + d) + "px");
        }
      }else{
        t.timeline.css("left", (t.timelineX + d) + "px");
      }
      //stop if at end of timeline left
      if(t.atLeftEdge){
        if(t.atLeftEdgeStop && d>0){
          t.down = false;
          dragX = false;
        }else{
          t.timeline.css("left", (t.timelineX + d) + "px");
        }
      }else{
        t.timeline.css("left", (t.timelineX + d) + "px");
      }

    } else if (t.dragY) {
      if (t.moveY) t.moveY(y - t.startY);
    } else if (t.down) {
      var dx = (x - t.startX);
      var dy = (y - t.startY);
      var adx = Math.abs(dx);
      var ady = Math.abs(dy);
      if (ady > 5 && ady >= adx) {
        if (t.moveY) {
          t.dragY = true;
          t.moveY(dy);
        }
      } else if (adx > 5) {
        dragX = true;
        t.timeline.css("left", (t.timelineX + dx) + "px");
      }
    }
  };

  this.timeline.mousemove(function(e) {
    mousemove(e.pageX, e.pageY);
  });

  this.timeline.bind("touchmove", function(e) {
    var touches = e.originalEvent.changedTouches[0];
    mousemove(touches.pageX, touches.pageY);
  });

  var stopDragging = function(x,e) {
    if (dragX) {
      t.moveBarLineMark();
      var d = x - t.startX;
      t.timelineX += d;
      t.timeline.css("left", t.timelineX + "px");
      dragX = false;
      t.balance();
    }

    t.down = false;
    if(e.target.nodeName.toLowerCase() == "object" || e.target.nodeName.toLowerCase() == "embed"){
      return;
    }else{
      return false;
    }
  };

  var mouseuporleave = function(e) {
    return stopDragging(e.pageX,e);
  };

  this.timeline.mouseup(mouseuporleave);

  this.timeline.mouseleave(mouseuporleave);

  var touchendorcancel = function(e) {
    stopDragging(e.originalEvent.changedTouches[0].pageX);
  };

  this.timeline.bind("touchend", touchendorcancel);
  this.timeline.bind("touchcancel", touchendorcancel);
};

MemoLane.TimeLine.prototype.fill = function(offset, callback) {
  var t = this;
  this.timeline.empty();
  this.slots = [];
  var loadedSlots = 0;
  for (var i = 0; i < this.slotCount; i++) {
    var slot = this.makeSlot(offset + i, function() {
      loadedSlots++;
      if (loadedSlots == t.slotCount) {
        if (callback) {
          if($('#urls .story').attr('first_edit') == "true"){
            $('<div id="newStoryHelp" class="memolaneDialog">'+
		'<div class="dialogTopBar">'+
		    '<div class="dialogTopBarLine">'+
			'<div class="dialogTitle">Steps for adding memos to a story:</div>'+
			'<div class="close closeMemolaneDialog">close</div>'+
			'<div class="clearFloatNoHeight"></div>'+
		    '</div>'+
		'</div>'+
		'<div class="dialogContent">'+
		    '<ol>'+
		      '<li class="addMemos">Select memos to add to a story by<br>clicking this icon:</li>'+
		      '<li>When you are done adding memo\'s click<br/>"I\'m Done, View Story" in the green menu bar.</li>'+
		    '</ol>'+
		'</div>'+
	      '</div>')
            .appendTo('body')
            .lightbox_me({centered:true, overlayCSS:{background:'#000', opacity:.8}});
          }
          callback();
        }
      }
    });
    this.slots.push(slot);
    this.timeline.append(slot.element);
  }

  this.timelineX = - this.preferredOffset;
  this.timeline.css("left", this.timelineX + "px");

};

MemoLane.TimeLine.prototype.jump = function(time) {
  var index = 0;
  for (; index < this.list.length; index++) {
    if (time < this.list[index].to) break;
  }

  var totalofAllSlots = this.list.length * this.slotWidth;

  var whereAreInTotalOfAllSlots = index * this.slotWidth;

  var foo = whereAreInTotalOfAllSlots/totalofAllSlots * $('.barlane').width();

  var t = this;
  this.timeline.animate({opacity: 0.0}, 'fast', function() {
    var offset = Math.floor($(window).width() / t.slotWidth / 2);

    t.fill(index - offset - Math.ceil(t.slotCount / 3), function() {
      t.viewport.css('background','none');
      t.timeline.animate({opacity: 1.0}, 'fast');

      //ensure that we set the correct time
      t.findCurrentTime();
    });
  });
};

MemoLane.TimeLine.prototype.getMemoHandler = function(service) {

  var handlers = this.memoHandlers;
  if (handlers) {
    return handlers.small;
  } else {
    return null;
  }
};

MemoLane.TimeLine.prototype.getExpandMemoHandler = function(service) {
  var handlers = this.memoHandlers;
  if (handlers) {
    return handlers.expand;
  } else {
    return null;
  }
};

MemoLane.TimeLine.prototype.getCollapseMemoHandler = function(service) {
  var handlers = this.memoHandlers;
  if (handlers) {
    return handlers.collapse;
  } else {
    return null;
  }
};

MemoLane.TimeLine.prototype.expandMemo = function(memo) {
  var content = memo.find("> .content");
  var service = content.data("service");
  var handler = this.getExpandMemoHandler(service);
  if (handler) {
    handler(content);
  }
};

MemoLane.TimeLine.prototype.collapseMemo = function(memo) {
  var content = memo.find("> .content");
  var service = content.data("service");
  var handler = this.getCollapseMemoHandler(service);
  if (handler) {
    handler(content);
  }
};

MemoLane.TimeLine.prototype.makeMemoContent = function(parent, service, data, inStory, storyId, editMode, contributor ) {
  var handler = this.getMemoHandler(service);
  if (handler) {
    handler(parent, data, inStory, storyId, editMode, contributor);
  } else {
    parent.text(service);
  }
};

MemoLane.TimeLine.prototype.makeMemo = function(parent, data, inStory, storyId, editMode, contributor) {
  var service = data.service;
  var memoId = ((data.id || data.items[0].id).replace(/[:_@\.\/]/g, ""));
  var memo = $('<div class="memo '+service+'" id="id'+memoId+'"></div>');
  var connection = $("<div class=\"connection\"/>");
  var connect = $("<div class=\"connect\"/>");
  connection.append(connect);
  memo.append(connection);
  var content = $("<div class=\"content\"/>");
  content.data("service", service);
  memo.append(content);
  this.makeMemoContent(content, service, data, inStory, storyId, editMode, contributor);
  parent.append(memo);
};


MemoLane.TimeLine.prototype.makeStacks = function(rows) {

    var items = [];
    var groups = [];

    var groupHash = {}
    var ungroupedItems = [];
    var groupedItems = [];

    $.each(rows, function(i, item) {

      //create a key based on user, service and group ids
      var key = "";
      var groupTitle = "";

      if( item.group ) {
        key = item.user_id + ":" + item.service + ":" + item.group.id;
        groupTitle = item.group.name;
      }

      //todo add played tracks stuff
      if( !groupHash[key] ) {
        groupHash[key] = { "service": item.service, "items": [] };

        //only add title if we have a sane one.
        if( !(groupTitle == "no group" || groupTitle == "_NO_GROUP_" || groupTitle == "" ) ) {
          groupHash[key]["title"] = { "text": groupTitle }
        }
      }

      //if we do not have a key, add directly to list of ungrouped items
      if( key != "" ) {
        groupHash[key]["items"].push(item) ;
      }
      else
        ungroupedItems.push( item );

    });

    //do a quick sorting based on creation time
    function sortfunction(a, b){
      if( a.track && b.track && a.created_at == b.created_at )
        return b.track.playcount - a.track.playcount;  //TODO: make an explicit "weight" of memos to use when creation times match instead?

      return a.created_at - b.created_at;
    }

    for(var i in groupHash) {
      if( groupHash[i]["items"].length == 1 ) {
        ungroupedItems.push( groupHash[i]["items"][0] )
      } else if ( groupHash[i]["items"].length > 0 )  {
        var group = groupHash[i]
        group["count"] = group["items"].length;
        group["items"].sort(sortfunction);
        groupedItems.push( group );
      }
    }

    ungroupedItems.sort(sortfunction);

    groupedItems = groupedItems.concat(ungroupedItems);

    return groupedItems;

};


MemoLane.TimeLine.prototype.makeBody = function(item, body, data, callback) {
  var t = this;
  var items = this.makeStacks(data.memos);

  var storyId = $("#urls .story").attr("href")
  var editMode = $("#urls .story").attr("edit_mode") == "true";
  if (storyId != "") {
    if( editMode ) {
      //right now we are showing the users own lane in story edit mode, so we need the list
      //of ids in the range of visisble memos that are in the story
      //so we can show which ones are in the story and which ones are not
      var url = "/stories/" + storyId + "/memos";
      Gnarly.json(['get', [url, {from: item.from, to: item.to}], {}], function(xhr, result) {
        if (xhr.status === 200) {

          var ids = [];
          $.each(result.memos, function(i, memo) {
            if( memo )
              ids.push( memo.id );
          });

          $.each(items, function(i, e) {
            if( e.items )
              t.makeMemo(body, e, $.inArray(e.items[0].id, ids) != -1, storyId, true, {} );
            else
              t.makeMemo(body, e, $.inArray(e.id, ids) != -1, storyId, true, {} );
          });

        } else {
          //TODO; something...
        }
        if (callback) { callback() };
      });

    } else {
      //we are showing a story in normal mode. Also get a list of story contributors
      //so we can show avatars on each memo
      var storyMembers = {};
      $.each( data, function(i, member) {
        storyMembers[member.id] = member;
      });

      $.each(items, function(i, e) {
        if( e.items )
          t.makeMemo(body, e, true, storyId, false, MemoLane.storyMembers[e.items[0].user_id] );
        else
          t.makeMemo(body, e, true, storyId, false, MemoLane.storyMembers[e.user_id] );
      });

      if (callback) { callback() };
    }

  } else {
    $.each(items, function(i, e) {
      t.makeMemo(body, e, false, "", false, {});
    });
    if (callback) { callback() };
  }


};

MemoLane.TimeLine.prototype.makeSlot = function(index, callback) {
  var slot = this.masterSlot.clone();
  var item = this.list[index];
  if (item) {

    //give each slot in the dom its date value
    slot.attr('id',item.from.toString()).addClass('notEmpty');

    var content = slot.find("> div.content");
    content.find("> div.head > div.date").text(MemoLane.formatUTCDate(item.from));
    var viewport = content.find("> div.viewport");
    var body = viewport.find("> div.body");
    var bodyY = 0;
    var t = this;
    var move = function(d) {
      if(Math.abs(bodyY-200)>body.height()){bodyY= -(body.height()-250);return;};
      var y = Math.min(0, bodyY + d);
      body.css("top", y + "px");
    };
    
    viewport.bind('mousewheel', function(event,delta,deltaX,deltaY){
    if(body.find('div').length <= 1){return;};
    if(Math.abs(bodyY-200)>body.height()){bodyY= -(body.height()-250);return;};
      if(body.offset().top <= 146){
        var y = Math.ceil(bodyY+(deltaY*20));
        if(y<0){
          bodyY = y;
            body.css("top", y + "px");
          }else{
            bodyY = 0;
            body.css("top", 0 + "px");
          }
        return false;
      };
    });

    viewport.mousedown(function() {
    	if(Math.abs(bodyY-200)>body.height()){bodyY= -(body.height()-250);return;};
    //if(body.height()<viewport.height()-40){return};
      t.moveY = move;
    });
    viewport.bind("touchstart", function() {
      t.moveY = move;
    });
    var stopDragging = function(y) {
      if (t.dragY) {
        var d = y - t.startY;
        var y = Math.min(0, bodyY + d);
        bodyY = y;
        body.css("top", bodyY + "px");
        t.dragY = false;
      }
    };
    viewport.mouseleave(function(e) {
      if(Math.abs(bodyY-200)>body.height()){bodyY= -(body.height()-250);return;};
      stopDragging(e.pageY);
      t.down = false;
    });
    viewport.mouseup(function(e) {
      if(Math.abs(bodyY-200)>body.height()){bodyY= -(body.height()-250);return;};
      stopDragging(e.pageY);
    });
    viewport.bind("touchend", function(e) {
      stopDragging(e.originalEvent.changedTouches[0].pageY);
    });

    var expandMemo = function(memo) {
      if (memo.hasClass("expanded")) {

        var memos = memo.parent();
        var y = parseInt(memos.css("top"), 10);
        var z = memo.position().top;
        if (y < -z) {
          bodyY = -z;
          memos.animate({"top":bodyY});
        }
        collapseMemo(memo);
        t.expandedMemo = null;
      } else {
        var width = MemoLane.config.memo.large.width;
        if (t.expandedMemo) {
          collapseMemo(t.expandedMemo, function() {
            var content = memo.find("> .content");

            memo.css({width: width});
            memo.addClass("expanded");
            
            t.expandMemo(memo);
            t.expandedMemo = memo;
          });
        }
        var content = memo.find("> .content");
        bodyY = -memo.position().top;
        body.animate({top: bodyY+(memo.siblings().andSelf().index(memo) ? 30 : 0)},200,'linear');

        memo.css({width: width});
        memo.addClass("expanded");
        t.expandMemo(memo);
        t.expandedMemo = memo;
        
        var memoOffsetLeft = memo.offset().left;
        var viewPortWidth = $(window).width();

        if(viewPortWidth > 550 && memoOffsetLeft > (viewPortWidth - 550)){
        	$('#timeline').animate({left:'-='+((memoOffsetLeft - (viewPortWidth - 550))+30)},400,'linear');
        };
        if(viewPortWidth > 550 && memoOffsetLeft < 0){
        	$('#timeline').animate({left:'-='+(memoOffsetLeft-30)},500,'linear');
        }
        
      }
    };
    var collapseMemo = function(memo, callback) {
      memo.animate({width: 195}, 0, callback);
      memo.removeClass("expanded");
      t.collapseMemo(memo);
    };

    this.memoProxy.queue(item.from, item.to, function(data) {
      t.makeBody(item, body, data, function () {
        var memos = body.find("div.memo");
        memos.mouseup(function(e) {
        if(e.target.nodeName.toLowerCase() == "object" || e.target.nodeName.toLowerCase() == "embed" || e.target.nodeName.toLowerCase() == "a"){return};
          if (e.which === 1 && e.pageX === t.startX && e.pageY === t.startY || e.which === undefined && e.pageX === undefined && e.pageY === undefined) {
            var memo = $(this);
            expandMemo(memo);
          }
        });
        if (callback) {
          callback();
        }
      });
    });
  } else {
    slot.addClass("empty");
    if (callback) {callback();}
  }
  var obj = {
    index: index,
    element: slot
  };
  return obj;

};

MemoLane.TimeLine.prototype.balance = function() {
  var d = (this.timelineX + this.preferredOffset) / this.slotWidth;
  if (d < 0) {
    var c = Math.floor(-d);
    for (var i = 0; i < c; i++) {
      var slot = this.slots.shift();
      slot.element.remove();
      this.timelineX += this.slotWidth;
      this.timeline.css("left", this.timelineX + "px");
    }
    var index = _.last(this.slots).index;
    for (var i = 1; i <= c; i++) {
      var slot = this.makeSlot(index + i);
      this.slots.push(slot);
      this.timeline.append(slot.element);
    }
  } else {
    var c = Math.ceil(d);
    for (var i = 0; i < c; i++) {
      var slot = this.slots.pop();
      slot.element.remove();
    }
    var index = _.first(this.slots).index;
    for (var i = 1; i <= c; i++) {
      var slot = this.makeSlot(index - i);
      this.slots.unshift(slot);
      this.timeline.prepend(slot.element);
      this.timelineX -= this.slotWidth;
      this.timeline.css("left", this.timelineX + "px");
    }
  }

};

MemoLane.TimeLine.prototype.moveSlots = function(i) {
  if (this.lock) {
    return;
  } else {
    this.lock = true;
  }

  var d = i * this.slotWidth;
  var t = this;
  var w = this.viewport.width();
  t.$rightEmptySlot = t.timeline.find('.slot:not(.empty):last').next();
  t.$leftEmptySlot = t.timeline.find('.slot:not(.empty):first').prev();

  //stop if at end of timeline either side
  if(i<0){
    if(t.$rightEmptySlot.length){
      if(t.$rightEmptySlot.offset().left < w){
      t.lock=false;
      return;
      }
    }
  }else{
    if(t.$leftEmptySlot.length){
      if(t.$leftEmptySlot.offset().left > 0){
      t.lock=false;
      return;
      }
    }
  }

  this.timeline.animate({left: this.timelineX + d}, 'fast', function() {
    t.timelineX += d;
    t.balance();
    t.lock = false;
  });

  this.moveBarLineMark();

};

MemoLane.TimeLine.prototype.moveScreens = function(i) {
  if (this.lock) {
    return;
  } else {
    this.lock = true;
  }

  var w = this.viewport.width();
  var t = this;
  t.$rightEmptySlot = t.timeline.find('.slot:not(.empty):last').next();
  t.$leftEmptySlot = t.timeline.find('.slot:not(.empty):first').prev();

  if (i < 0) {

    //stop if at end of timeline
    if(t.$rightEmptySlot.length){
      if(t.$rightEmptySlot.offset().left < w){
      t.lock=false;
      return;
      }
    }

    var x = (w - this.timelineX) % this.slotWidth;
    var d = w - x - 5;

    this.timeline.animate({left: this.timelineX - d}, 'slow', function() {
      t.timelineX -= d;
      t.balance();
      t.lock = false;
    });
  } else {

    //stop if at end of timeline
    if(t.$leftEmptySlot.length){
      if(t.$leftEmptySlot.offset().left > 0){
        t.lock=false;
        return;
      }
    }

    var x = this.slotWidth + (this.timelineX % this.slotWidth);
    var d = w - x - 5;

    this.timeline.animate({left: this.timelineX + d}, 'slow', function() {
      t.timelineX += d;
      t.balance();
      t.lock = false;
    });
  }

  this.moveBarLineMark();

};


MemoLane.TimeLine.prototype.findCurrentTime = function(){

  var slotFocused; //date in center of viewport
  $('.notEmpty').each(function(i,el){//find which slot is in the center of viewport
      if($(el).offset().left>$(window).width()/2){
        slotFocused = parseFloat($(el).attr('id'));
          return false;
      }
  });

  return slotFocused;
}


MemoLane.TimeLine.prototype.moveBarLineMark = function(){

	var slotFocused = this.findCurrentTime();

	var fromTime = this.list[0].from; //grab start date
	var toTime = this.list[this.list.length-1].to; //grab end date
	var deltaSec = toTime - fromTime; //find delta or time between start and end date

    var barlineArray = new Array($('#barline').width()); //create an array with a length equal to the length of the viewport

    $.each(barlineArray,function(i,v){//lop over our array and place a date into the array for each pixel much like the barline
    	barlineArray[i] = Math.ceil( ( ( i / $('#barline').width() ) * deltaSec ) + fromTime );
    });

	var indexBL = 0; //create an index to store where we are in the array
	var barLineArrayLength = barlineArray.length;

	/*loop over the array and stop on the index of the array where are time is greater then the value in the array, this will give us the pixel amount from the left side of the screen we should place out mark*/
	for (; indexBL < barLineArrayLength; indexBL++) {
    	if (slotFocused < barlineArray[indexBL]){
    		break;
    	}
  	}

	$('.markerHere').css('left',(indexBL>$(window).width()?$(window).width():indexBL-1)+'px'); //update mark on barline

}



//old code for scrolling thumbnails in flickr/picaso memo's
MemoLane.ThumbnailsScroll = function(thumbnails) {//retro fitted
  this.thumbnails = thumbnails;
  var t = this;
  this.thumbnails.mousedown(function(e) {
    return false;
  });

  var stopDrag = function(e) {

	$(e.target).trigger('safeclick');

  };
  this.thumbnails.mouseup(stopDrag);

};


MemoLane.createSlots = function( centerTime ) {
  var t = this;

  //do we have a particular time we want to jump to in a hashanchor
  var showAt = -1;
  var showIndex = -1;

  var hash = window.location.hash;

  if( hash ) {
    var value = hash.substring(1); // remove #
    
    var timestampRegexp = /^\d{1,10}/
    
    if( value.substring( 0, 2 ) == "t=" ) {
      showAt = value.substring(2).match(timestampRegexp);
    } else {
      showAt = value.match(timestampRegexp);
    }
  } else if ( centerTime != -1 ) {
    showAt = centerTime
  }

  MemoLane.memoDeepLinkId = hash.search(/memo=/)>-1 ? hash.substring(hash.search(/memo=/)).substring(5).split('?')[0] : null;
  /*
  var url = $("#urls .volume").attr("href");
  if( MemoLane.visibility )
    url += ( "?visibility=" + MemoLane.visibility )
  */
  url="";  
  if( url != "memos" ) {
		var jsondatas={"memos":[
			{
			"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:foursquare:164956:485119097",
			"type":"memo",
			"service_id":"164956",
			"user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d",
			"memo_id":485119097,
			"created_at":1300292695,
			"added_at":1300292695,
			"fetched_at":1300889358,
			"service":"foursquare",
			"privacy":"friends",
			"title":{"text":"Joe S. @ Cafe Wellington"},
			"geo":{
				"poi":[{"name":"Cafe Wellington",
					"description":null,
					"time":1300292695,
					"lat":41.79577611765196,
					"lon":-88.09844255447388,
					"address":{"address":"2222 Wellington Ave","city":"Lisle","state":"IL","zip":"60532"}
					}]},
			"group":{"name":"Foursquare checkins","id":"foursquarecheckins"},
			"venue_id":3857758
			},
			{
			"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:foursquare:164956:485257812",
			"type":"memo",
			"service_id":"164956",
			"user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d",
			"memo_id":485257812,
			"created_at":1300296735,
			"added_at":1300296735,
			"fetched_at":1300889358,
			"service":"foursquare",
			"privacy":"friends",
			"title":{"text":"Joe S. @ Best Buy #301"},
			"geo":{"poi":[{"name":"Best Buy #301","description":"New camera!","time":1300296735,"lat":41.836101,"lon":-88.019385,"address":{"address":"1432 Butterfield Rd.","city":"Downers Grove","state":"IL","zip":"60515"}}]},
			"group":{"name":"Foursquare checkins","id":"foursquarecheckins"},
			"venue_id":524851
			},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548304837","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548304837","created_at":1300298729,"added_at":1300757756,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0003"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5223/5548304837_4062e82ef8.jpg","thumbnail":"http://farm6.static.flickr.com/5223/5548304837_4062e82ef8_m.jpg","original":"http://farm6.static.flickr.com/5223/5548304837_ab8e1859de_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548304837","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548305157","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548305157","created_at":1300298736,"added_at":1300757763,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0004"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5110/5548305157_79d47fda6e.jpg","thumbnail":"http://farm6.static.flickr.com/5110/5548305157_79d47fda6e_m.jpg","original":"http://farm6.static.flickr.com/5110/5548305157_e7f922b007_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548305157","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548305425","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548305425","created_at":1300301034,"added_at":1300757769,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0005"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5268/5548305425_a680f52442.jpg","thumbnail":"http://farm6.static.flickr.com/5268/5548305425_a680f52442_m.jpg","original":"http://farm6.static.flickr.com/5268/5548305425_e3fae1be5c_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548305425","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548305621","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548305621","created_at":1300301039,"added_at":1300757774,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0006"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5107/5548305621_00144dfe12.jpg","thumbnail":"http://farm6.static.flickr.com/5107/5548305621_00144dfe12_m.jpg","original":"http://farm6.static.flickr.com/5107/5548305621_35d86fb6e7_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548305621","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548889118","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548889118","created_at":1300301046,"added_at":1300757782,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0007"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5132/5548889118_375f499172.jpg","thumbnail":"http://farm6.static.flickr.com/5132/5548889118_375f499172_m.jpg","original":"http://farm6.static.flickr.com/5132/5548889118_27f3cd76d6_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548889118","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548889500","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548889500","created_at":1300301056,"added_at":1300757790,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0008"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5054/5548889500_4b93a9916f.jpg","thumbnail":"http://farm6.static.flickr.com/5054/5548889500_4b93a9916f_m.jpg","original":"http://farm6.static.flickr.com/5054/5548889500_79d1a8033b_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548889500","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548306837","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548306837","created_at":1300301573,"added_at":1300757799,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0009"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5067/5548306837_32ae4a4da4.jpg","thumbnail":"http://farm6.static.flickr.com/5067/5548306837_32ae4a4da4_m.jpg","original":"http://farm6.static.flickr.com/5067/5548306837_bff1a2cd51_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548306837","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548307307","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548307307","created_at":1300301580,"added_at":1300757808,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0010"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5300/5548307307_73d1e5592f.jpg","thumbnail":"http://farm6.static.flickr.com/5300/5548307307_73d1e5592f_m.jpg","original":"http://farm6.static.flickr.com/5300/5548307307_556d307c9e_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548307307","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548890800","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548890800","created_at":1300301593,"added_at":1300757816,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0011"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5140/5548890800_bdc454209b.jpg","thumbnail":"http://farm6.static.flickr.com/5140/5548890800_bdc454209b_m.jpg","original":"http://farm6.static.flickr.com/5140/5548890800_9bdeb3baa0_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548890800","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548891206","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548891206","created_at":1300301596,"added_at":1300757825,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0012"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5053/5548891206_659b919316.jpg","thumbnail":"http://farm6.static.flickr.com/5053/5548891206_659b919316_m.jpg","original":"http://farm6.static.flickr.com/5053/5548891206_5ffc3cd274_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548891206","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548891656","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548891656","created_at":1300301604,"added_at":1300757835,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0013"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5068/5548891656_6afef75dc5.jpg","thumbnail":"http://farm6.static.flickr.com/5068/5548891656_6afef75dc5_m.jpg","original":"http://farm6.static.flickr.com/5068/5548891656_26e010d9a8_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548891656","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548892044","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548892044","created_at":1300301614,"added_at":1300757844,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0014"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5029/5548892044_52965d9706.jpg","thumbnail":"http://farm6.static.flickr.com/5029/5548892044_52965d9706_m.jpg","original":"http://farm6.static.flickr.com/5029/5548892044_9b2ef3c30b_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548892044","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548452839","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548452839","created_at":1300453999,"added_at":1300760992,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"STF_0334"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5225/5548452839_89d06a900d.jpg","thumbnail":"http://farm6.static.flickr.com/5225/5548452839_89d06a900d_m.jpg","original":"http://farm6.static.flickr.com/5225/5548452839_6b3eb4984b_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548452839","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","description":""},"description":
			{"text":""},"privacy":"friends"}]};
			var list = new Array(jsondatas.length);
			var lastTo = 0;
			$.each(jsondatas, function(i, e) {//rows are an array of objects
			var fromTime = e[0]; //seconds from 1970 to today dates
			var toTime = fromTime + 86400; //add 24 hours in seconds to get fromTime
			if( lastTo < showAt && showAt <= toTime ){
			MemoLane.initialIndex = i;
			}
			lastTo = toTime;
			var s = {
			from: fromTime,
			to: toTime
			};
			list[i] = s; //make array containing unix time stamp with time range in 24 hours
			});
	
          if( MemoLane.initialIndex != 0 ){
            MemoLane.initialIndex = list.length - MemoLane.initialIndex;
          }
          t.init(list); //pass array of from and to times to init func
  } else {
    t.init([]);
  }
}



MemoLane.init = function(list) { //list is an array of from and to times

  var makeUrl = function(startTime, endTime) {
    return "/day/" + startTime + "/" + endTime;
  };


  if (list.length > 0) {
    //construct Timeline object
    var timeline = new MemoLane.TimeLine($("#timeline"), list, makeUrl, MemoLane.memoHandlers);

    MemoLane.timeline = timeline;

  //get the very first time and last time of all memo's
    var startTime = list[0].from;
    var endTime = list[list.length - 1].to;


    //contruct Barline object
    MemoLane.barline = new MemoLane.BarLine($("#barline"), startTime, endTime, function(time) {
      timeline.jump(time);
    });

    $('.markerHere').css('left',($(window).width()-1)+'px'); //update mark on barline

    $("#viewport > .nav > .backward").click(function() {
      timeline.moveScreens(1);
    });
    $("#viewport > .nav > .forward").click(function() {
      timeline.moveScreens(-1);
    });
    
    //make sure to always hide any message overlays
    //this can be an issue if we were just looking at our own lane as a guest and there was no content
    //and we than changed view back to "as me"
     $("#message_overlay").hide();

  } else {//list is empty
    //MemoLane.laneOwner should always be available, but there seems to be some issue where, right after creating a new story, this is not the case... caching? db write delay? stale couch views?
    if( !MemoLane.currentUser || !MemoLane.laneOwner || MemoLane.currentUser["_id"] != MemoLane.laneOwner["_id"] ) {
      $("#barline").hide();
      $("#viewport > .nav").hide();
    }

    //check if we have a message to display
    if( $("#message_overlay h1").text() != "" ) {
      
        if( window.top != window.self )
          $("#embedded_message_overlay").show();
        else
          $("#message_overlay").show(); 
    }

    $('#viewport').css('background','none');

  }

};

MemoLane.reset = function( toStart ) {

  MemoLane.changedPrivacies = {};
  
  var centerTime = -1;
  if( !toStart )
    centerTime = MemoLane.timeline.findCurrentTime();


  //stuff needed for a complete reset! (move to sepetare function as we might need this elsewhere!)
  $("#timeline").empty();
  $("#timeline").css({ opacity: 0.0 });
  var masterSlotHtml = "<div class='slot'>\n\
                  <div class='content'>\n\
                      <div class='head'>\n\
                          <div class='connect'></div>\n\
                          <div class='date'></div>\n\
                      </div>\n\
                      <div class='spacer'></div>\n\
                      <div class='viewport'>\n\
                          <div class='body'></div>\n\
                      </div>\n\
                  </div>\n\
              </div>\n";


  $("#timeline").append( $(masterSlotHtml) );

  //these will get bound again, so unbind for now... TODO: move anything that binds to staic elements outside of the "createSlots" flow
  $("#viewport > .nav > .backward").unbind();
  $("#viewport > .nav > .forward").unbind();
  $("#timeline").unbind();


  $('#viewport').css({'background-image':'url("/images/large-loading2.gif")',
            'background-repeat':'no-repeat',
            'background-position':'center center'});

  MemoLane.createSlots( centerTime );
}



//run on DOM load
$(function() {
  if( window.top != window.self ) { //if embedding, always show public view
    MemoLane.visibility = "public";
  }

	$.ajaxSetup({data: {'_csrf':$('#csrf input').val()}});

  MemoLane.currentTime = null;

  var win = $(window);
  var offset = $("#top").outerHeight() + $("#barline").outerHeight() + $("#bottom").outerHeight();
  win.resize(
    function() {
      var height = win.height() - offset;
      $("#timeline").height(height).fadeIn('fast');
      $("#barline .barlane").css('visibility','visible');
      $('.body').css('top','0px');
      if (barline) {
      barline.calibrate();
      	MemoLane.timeline.moveBarLineMark();
      }
    });

  win.resize();

  var barline = null;


  MemoLane.initialIndex = 0;

  //when loading lane, center on "now" and not the end of the lane (which might be in the future)
  var timestamp = Number(new Date()) / 1000;


  MemoLane.storyMembers = {};
  var storyId = $("#urls .story").attr("href")
  var editMode = $("#urls .story").attr("edit_mode") == "true";
  if (storyId != "") {
    if( !editMode ) {
      //we are showing a story in normal mode. Also get a list of story contributors
      //so we can show avatars on each memo
      var url = "./memos";//"/stories/" + storyId + "/members";
		var jsondata=[
			{
			"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:foursquare:164956:485119097",
			"type":"memo",
			"service_id":"164956",
			"user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d",
			"memo_id":485119097,
			"created_at":1300292695,
			"added_at":1300292695,
			"fetched_at":1300889358,
			"service":"foursquare",
			"privacy":"friends",
			"title":{"text":"Joe S. @ Cafe Wellington"},
			"geo":{
				"poi":[{"name":"Cafe Wellington",
					"description":null,
					"time":1300292695,
					"lat":41.79577611765196,
					"lon":-88.09844255447388,
					"address":{"address":"2222 Wellington Ave","city":"Lisle","state":"IL","zip":"60532"}
					}]},
			"group":{"name":"Foursquare checkins","id":"foursquarecheckins"},
			"venue_id":3857758
			},
			{
			"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:foursquare:164956:485257812",
			"type":"memo",
			"service_id":"164956",
			"user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d",
			"memo_id":485257812,
			"created_at":1300296735,
			"added_at":1300296735,
			"fetched_at":1300889358,
			"service":"foursquare",
			"privacy":"friends",
			"title":{"text":"Joe S. @ Best Buy #301"},
			"geo":{"poi":[{"name":"Best Buy #301","description":"New camera!","time":1300296735,"lat":41.836101,"lon":-88.019385,"address":{"address":"1432 Butterfield Rd.","city":"Downers Grove","state":"IL","zip":"60515"}}]},
			"group":{"name":"Foursquare checkins","id":"foursquarecheckins"},
			"venue_id":524851
			},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548304837","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548304837","created_at":1300298729,"added_at":1300757756,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0003"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5223/5548304837_4062e82ef8.jpg","thumbnail":"http://farm6.static.flickr.com/5223/5548304837_4062e82ef8_m.jpg","original":"http://farm6.static.flickr.com/5223/5548304837_ab8e1859de_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548304837","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548305157","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548305157","created_at":1300298736,"added_at":1300757763,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0004"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5110/5548305157_79d47fda6e.jpg","thumbnail":"http://farm6.static.flickr.com/5110/5548305157_79d47fda6e_m.jpg","original":"http://farm6.static.flickr.com/5110/5548305157_e7f922b007_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548305157","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548305425","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548305425","created_at":1300301034,"added_at":1300757769,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0005"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5268/5548305425_a680f52442.jpg","thumbnail":"http://farm6.static.flickr.com/5268/5548305425_a680f52442_m.jpg","original":"http://farm6.static.flickr.com/5268/5548305425_e3fae1be5c_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548305425","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548305621","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548305621","created_at":1300301039,"added_at":1300757774,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0006"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5107/5548305621_00144dfe12.jpg","thumbnail":"http://farm6.static.flickr.com/5107/5548305621_00144dfe12_m.jpg","original":"http://farm6.static.flickr.com/5107/5548305621_35d86fb6e7_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548305621","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548889118","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548889118","created_at":1300301046,"added_at":1300757782,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0007"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5132/5548889118_375f499172.jpg","thumbnail":"http://farm6.static.flickr.com/5132/5548889118_375f499172_m.jpg","original":"http://farm6.static.flickr.com/5132/5548889118_27f3cd76d6_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548889118","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548889500","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548889500","created_at":1300301056,"added_at":1300757790,"fetched_at":1300769857,"service":"flickr","title":
			{"text":"IMG_0008"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5054/5548889500_4b93a9916f.jpg","thumbnail":"http://farm6.static.flickr.com/5054/5548889500_4b93a9916f_m.jpg","original":"http://farm6.static.flickr.com/5054/5548889500_79d1a8033b_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548889500","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548306837","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548306837","created_at":1300301573,"added_at":1300757799,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0009"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5067/5548306837_32ae4a4da4.jpg","thumbnail":"http://farm6.static.flickr.com/5067/5548306837_32ae4a4da4_m.jpg","original":"http://farm6.static.flickr.com/5067/5548306837_bff1a2cd51_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548306837","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548307307","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548307307","created_at":1300301580,"added_at":1300757808,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0010"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5300/5548307307_73d1e5592f.jpg","thumbnail":"http://farm6.static.flickr.com/5300/5548307307_73d1e5592f_m.jpg","original":"http://farm6.static.flickr.com/5300/5548307307_556d307c9e_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548307307","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548890800","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548890800","created_at":1300301593,"added_at":1300757816,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0011"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5140/5548890800_bdc454209b.jpg","thumbnail":"http://farm6.static.flickr.com/5140/5548890800_bdc454209b_m.jpg","original":"http://farm6.static.flickr.com/5140/5548890800_9bdeb3baa0_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548890800","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548891206","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548891206","created_at":1300301596,"added_at":1300757825,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0012"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5053/5548891206_659b919316.jpg","thumbnail":"http://farm6.static.flickr.com/5053/5548891206_659b919316_m.jpg","original":"http://farm6.static.flickr.com/5053/5548891206_5ffc3cd274_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548891206","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548891656","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548891656","created_at":1300301604,"added_at":1300757835,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0013"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5068/5548891656_6afef75dc5.jpg","thumbnail":"http://farm6.static.flickr.com/5068/5548891656_6afef75dc5_m.jpg","original":"http://farm6.static.flickr.com/5068/5548891656_26e010d9a8_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548891656","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548892044","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548892044","created_at":1300301614,"added_at":1300757844,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"IMG_0014"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5029/5548892044_52965d9706.jpg","thumbnail":"http://farm6.static.flickr.com/5029/5548892044_52965d9706_m.jpg","original":"http://farm6.static.flickr.com/5029/5548892044_9b2ef3c30b_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548892044","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","id":"72157626322449126"}},
			{"id":"d6a3fd7863fa1000f1b0c80adc1a9c9d:flickr:16868820@N04:5548452839","type":"memo","sub_type":"image","user_id":"d6a3fd7863fa1000f1b0c80adc1a9c9d","service_id":"16868820@N04","memo_id":"5548452839","created_at":1300453999,"added_at":1300760992,"fetched_at":1300769856,"service":"flickr","title":
			{"text":"STF_0334"},"description":
			{"text":null},"image":
			{"url":"http://farm6.static.flickr.com/5225/5548452839_89d06a900d.jpg","thumbnail":"http://farm6.static.flickr.com/5225/5548452839_89d06a900d_m.jpg","original":"http://farm6.static.flickr.com/5225/5548452839_6b3eb4984b_o.jpg"},"highlight":false,"source_url":"http://www.flickr.com/photos/16868820@N04/5548452839","privacy":"friends","group":
			{"name":"Cross-Country Road Trip 2011","description":""},"description":
			{"text":""},"privacy":"friends"}];
			
			$.each( jsondata, function(i, member) {
            MemoLane.storyMembers[member.id] = member;
          });
          MemoLane.createSlots( timestamp );
    } else {
      MemoLane.createSlots( timestamp );
    }
  } else {
    MemoLane.createSlots( timestamp );
  }

  //none of the following functions bind on memos, so it should not be an issue that they
  //potentially get bound before memos are created


  //key events to navigate timeline
  $(document).keyup(
    function(event) {
      var kc = event.keyCode;
      if($('.search input').data('hasFocus')){return;}
      if (kc === 37) {
        if (event.shiftKey) {
          MemoLane.timeline.moveScreens(1);
        } else {
          MemoLane.timeline.moveSlots(1);
        }
      } else if (kc === 39) {
        if (event.shiftKey) {
          MemoLane.timeline.moveScreens(-1);
        } else {
          MemoLane.timeline.moveSlots(-1);
        }
      }
    }
  );


  //click event for to open dialg which changes lane view based on privacy
  $('.privacyFilter').click(function(){
  	 var $html = $('<div id="setLaneViewDialog" class="memolaneDialog">'+
        '<div class="dialogTopBar">'+
            '<div class="dialogTopBarLine">'+
                '<div class="dialogTitle">View your Memolane as:</div>'+
                '<div class="close closeMemolaneDialog">cancel</div>'+
                '<div class="clearFloatNoHeight"></div>'+
            '</div>'+
        '</div>'+
        '<div class="dialogContent">'+
            '<label id="asMIcon" class="smallTooltip"><input name="viewAsRadioBtn" type="radio" id="viewAsMe">Me<span class="smalltooltipTxt">This is how your Memolane looks when you\'re logged in.</span></label>'+
            '<label id="asFIcon" class="smallTooltip"><input name="viewAsRadioBtn" type="radio" id="viewAsFriend">A Friend<span class="smalltooltipTxt">This is how your Memolane looks to someone you\'re friends with when they\'re viewing your lane.</span></label>'+
            '<label id="asGIcon" class="smallTooltip"><input name="viewAsRadioBtn" type="radio" id="viewAsGuest">The Public<span class="smalltooltipTxt">This is how your Memolane looks to someone who navigates to your lane that isn\'t your friend.</span></label>'+
        '</div>'+
    '</div>').find('#' + $(this).data('currentLaneView')).attr("checked","checked").end();

    $html.lightbox_me({modalCSS: {top:'150px'},overlayCSS:{background: '#000',opacity: .8}});
  });

  //click event for radio buttons contain in the dailog for changing the view based on privacy
  $('#setLaneViewDialog input').live('click',function(){

    var viewAs = $(this).parent().find('input:checked').attr('id');
    $('.privacyFilter')
      .data('currentLaneView',viewAs)
      .removeClass(function(){return 'viewAsMe viewAsFriend viewAsGuest'})
      .addClass(viewAs);

    $('#setLaneViewDialog .closeMemolaneDialog').trigger('click');

    if( MemoLane.embedded ) {
      MemoLane.visibility = "public";
    } else if( viewAs == "viewAsMe" )
      MemoLane.visibility = null; //not passing anything is the same as all, and it makes the lane work correctly for other people
    else if ( viewAs == "viewAsFriend" )
      MemoLane.visibility = "friends";
    else
      MemoLane.visibility = "public";

    MemoLane.timeline.memoProxy.changeVisibility( MemoLane.visibility );

    MemoLane.reset( false );

  });

  $('.smallTooltip').live('mouseenter',function(e){
    $.doTimeout('hover',400,function(that){
    var offsetFromLeft = $(that).offset().left-44;
    var halfOfThat = $(that).innerWidth()/2;
    var fromLeft = halfOfThat+offsetFromLeft;
	  $('<div class="SmallCSStooltip"><p></p><div class="smltooltipPointerBox"><div class="smltooltipPointer"><div class="innerSmltooltipPointer"></div></div></div></div>')
	  .find('p')
	  .text($(that).find('.smalltooltipTxt').html())
	  .end()
	  .appendTo('body')
	  .css('left',fromLeft+'px')
	  .css('top',$(that).offset().top-($('.SmallCSStooltip').outerHeight()+26)+'px')
	  .fadeIn('fast')
	  .bind('mouseenter',function(){ $('.SmallCSStooltip').remove();})
    },this);
  }).live('mouseleave',function(e){
      $('.SmallCSStooltip').remove();
	  $.doTimeout('hover');
	$('.SmallCSStooltip').remove();
  }).live('click',function(e){
		$('.SmallCSStooltip').remove();
  });

});


// To be deleted
$(function() {

  var menu = $("#top > .menus > ul.menu.user");

  var dropdown = $("#top > .menus > .dropdown.user");
  dropdown.width(menu.outerWidth() - 32);

  var selected = null;

  var hide = function(element) {
    dropdown.hide();
    selected.button.removeClass("selected");
    selected.body.removeClass("selected");
    selected = null;
  };

  var show = function(element) {
    if (selected) {
      selected.button.removeClass("selected");
      selected.body.removeClass("selected");
    } else {
      dropdown.show();
    }
    selected = element;
    selected.button.addClass("selected");
    selected.body.addClass("selected");
  };

  var toggle = function(element) {
    if (selected === element) {
      hide(selected);
      return false;
    } else {
      show(element);
      return true;
    }
  };

  var profile = {
    button: menu.find("> li.profile"),
    body: dropdown.find("> div.profile")
  };
  profile.button.click(function() {
    toggle(profile);
  });

  var settings = {
    button: menu.find("> li.settings"),
    body: dropdown.find("> div.settings")
  };
  settings.button.click(function() {
    toggle(settings);
  });

  var makeUserListItem = function(e, state) {
    var li = $("<li/>");

    //TODO: Image8 this stuff, but that is a little tricky due to image8 and counc potentially being on seperate hosts
    var img = $("<img class=\"image\" src=\"/" + e.username + "/image" + "\" href=\"/" + e.username + "\"/>");
    var a = $("<a class=\"name\" href=\"/" + e.username + "\"/>");
    li.append(img);
    li.append(a);
    if (state === "accepted") {
      var remove = $("<a class='link' href='/friends/" + e.username + "'>Remove</a>");
      remove.click(function(e) {
        e.preventDefault();
        var url = $(this).attr("href");
        $.post(url, {"_method": "DELETE"}, function() {
          loadFriends();
        });
      });
      li.append(remove);
    }
    if (e.first_name && e.last_name) {
      a.text(e.first_name + " " + e.last_name);
    } else {
      a.text(e.username);
    }
    return li;
  };

  var loadFriends = function() {
    MemoLane.Friends.friends(function(data, state) {
      var ul = $("#top > .menus > .dropdown.user > .share ul.friends").empty();
      $.each(data, function(i, e) {
	var li = makeUserListItem(e, state);
	ul.append(li);
      });
    });
  };

  var loadFriendRequests = function() {
    MemoLane.Friends.requested(function(data) {
      //hide the friends request header if there are no requests
      if(data.length == 0) {
        var requests = $("#top > .menus > .dropdown.user > .share #friend_requests").empty();
        requests.hide();
        return;
      }

      var ul = $("#top > .menus > .dropdown.user > .share ul.requests").empty();

      $.each(data, function(i, e) {
        var li = makeUserListItem(e);
        var buttons = $("<ul class=\"buttons\"/>");
        li.append(buttons);
        var accept = $("<li class=\"link\">Accept</li>");
        accept.click(function() {
          $.post("/friends/" + e.username + "/accept", function(data, status) {
            // TODO: Error handling
            loadFriendRequests();
            loadFriends();
          });
        });
        buttons.append(accept);
        var reject = $("<li class=\"link\">Reject</li>");
        reject.click(function() {
          $.post("/friends/" + e.username + "/reject", function(data, status) {
            // TODO: Error handling
            loadFriendRequests();
          });
        });
        buttons.append(reject);
        ul.append(li);
      });
    });
  };

  var share = {
    button: menu.find("> li.share"),
    body: dropdown.find("> div.share")
  };
  share.button.click(function() {
    if (toggle(share)) {
      loadFriendRequests();
      loadFriends();
    }
  });

  var feed = {
    button: menu.find("> li.feed"),
    body: dropdown.find("> div.feed"),
    list: dropdown.find("> div.feed > ul"),
    makeFeedItem: function(data) {
      var li = $("<li />");
      var handler = MemoLane.Feed.Handlers[data.feed_type];
      if (handler) {
        li.append(handler(data));
        return li;
      } else {
        return false;
      }
    },
    load: function() {
      var that = this;
      that.list.empty();
      $.get("/feed", function(data) {
        _.each(data.feeds, function(entry) {
          e = entry;
          var item = that.makeFeedItem(entry);
          if (item) {that.list.append(item);}
        });
      });
    }
  };

  feed.button.click(function() {
    if (toggle(feed)) {
      feed.load();
    }
  });

  var invite = {
    button: menu.find("> li.invite"),
    body: dropdown.find("> div.invite")
  };
  invite.button.click(function() {
    toggle(invite);
  });

  var newStory = $("#urls .story").attr("new_story")

  if( newStory ) {

    var storyHelpTemplate = $('<div id="newStoryHelp" class="memolaneDialog">'+
	'<div class="dialogTopBar">'+
	    '<div class="dialogTopBarLine">'+
		'<div class="dialogTitle">Steps for creating a story:</div>'+
		'<div class="close closeMemolaneDialog">close</div>'+
		'<div class="clearFloatNoHeight"></div>'+
	    '</div>'+
	'</div>'+
	'<div class="dialogContent">'+
	    '<ol>'+
	      '<li>Name your story and add a description. Do this by clicking (edit in place) on the "Story Name" and "Story Description" in the green Menu bar.</li>'+
	      '<li>Set your privacy options (private by default) from the privacy dropdown menu in the green menu bar.</li>'+
	      '<li>Invite contributors to your story from the contributors dropdown menu in the green menu bar.</li>'+
	      '<li>Add memos to the Story by clicking on the "Add Memos" in the green menu bar.</li>'+
	    '</ol>'+
	'</div>'+
      '</div>')
    .appendTo('body')
    .lightbox_me({centered:true, overlayCSS:{background:'#000', opacity:.8}});
  
  }

  $('#addingMemos').live('click',function(){
  	window.location.href = 'http://'+window.location.hostname+window.location.pathname+'/add';
  	return false;
  });

});


$.fn.imagesLoaded = function(callback){
  var elems = this.filter('img'),
      len = elems.length;

  elems.bind('load',function(){
      if (--len <= 0){ callback.call(elems,this); }
  }).each(function(){
     // cached images don't fire load sometimes, so we reset src.
     if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        this.src = src;
     }
  });

  return this;
};

