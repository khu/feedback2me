//
// This is the new tab.js -- it can add a Feedback tab to the page, and it can pop up an iframe.  It's included on a 3rd party customer site.
//
//
// It has the following interface that can be manually called by a customer:
// UserVoice.showPopupWidget(options);    // Show the widget now with these options.
// UserVoice.showTab(options);            // Show the feedback tab with these options.  When clicked, it will show the popup widget.
// UserVoice.insertWidget(options);       // Insert the feedback tab into your site
//
// If uvOptions is defined, it can override any setting in the defaults.
//

if (!UserVoice) {
  var UserVoice = {};
}

(function() {

  // Micro libraries.  Extracted from other files.

  // base64 encode something
  var base64Encode = function(input) {
    function uTF8Encode(string) {
      string = string.replace(/\x0d\x0a/g, "\x0a");
      var output = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          output += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          output += String.fromCharCode((c >> 6) | 192);
          output += String.fromCharCode((c & 63) | 128);
        } else {
          output += String.fromCharCode((c >> 12) | 224);
          output += String.fromCharCode(((c >> 6) & 63) | 128);
          output += String.fromCharCode((c & 63) | 128);
        }
      }
      return output;
    };

    var keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = uTF8Encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
    }
    return output;
  };

  // JSON stringifier.  Extracted from json2
  var jsonStringify = null;
  //////
  (function(){function f(n){return n<10?'0'+n:n;}
  if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
  f(this.getUTCMonth()+1)+'-'+
  f(this.getUTCDate())+'T'+
  f(this.getUTCHours())+':'+
  f(this.getUTCMinutes())+':'+
  f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
  var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
  function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
  if(typeof rep==='function'){value=rep.call(holder,key,value);}
  switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
  gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
  v=partial.length===0?'[]':gap?'[\n'+gap+
  partial.join(',\n'+gap)+'\n'+
  mind+']':'['+partial.join(',')+']';gap=mind;return v;}
  if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
  v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
  mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
  jsonStringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
  rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
  return str('',{'':value});};
  }());
  //////

  //
  // Utility functions
  //
  // requestAnimationFrame
  // Credit: Paul Irish http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  }

  // Mark's lightweight animation function. I call it wiggly. You can give it multiple
  // properties, like { height: '300px', width: '300px' } can also pass in a duration.
  // Only works in pixels for now. Also, a callback.
  var Wiggly = function(el) {
    this.el      = el;
    this.cancel  = false;
    this.running = false;
  };

  Wiggly.prototype.animate = function(opts, callback) {
    this.stop();
    this.cancel  = false;
    this.running = true;

    var self = this;

    var duration = opts.duration || 1000;
    delete opts.duration;

    var start, now, elapsed = 0;
    var animations = [];

    for (var key in opts) {
      var animStart = self.el.style[key] ? parseInt(self.el.style[key]) : 0;
      var finish  = parseInt(opts[key]);
      var anim = {
        prop: key,
        start: animStart,
        current: animStart,
        finish: finish,
        distance: Math.abs(finish - animStart),
        reverse: animStart > finish
      };

      animations.push(anim);
    }

    function animate() {
      if (self.cancel) {
        return;
      }

      if (elapsed < duration) {

        requestAnimationFrame(animate);
        draw();
      } else {
        // we made it to the end. make sure we're set to the end spot.
        for (var i = 0, al = animations.length; i < al; i++) {
          self.el.style[anim.prop] = [anim.finish, 'px'].join('');
        }

        if (typeof callback === 'function') {
          // no need to apply this to a context yet
          callback();
        }
      }
    }

    function draw() {
      start    = start || +new Date();
      now      = +new Date();
      elapsed  = now - start;

      for (var i = 0, al = animations.length; i < al; i++) {
        var anim = animations[i];
        var current = Math.round(easeOut(elapsed, 0, anim.distance, duration));

        anim.current = (anim.reverse ? anim.start - current : anim.start + current);
        self.el.style[anim.prop] = [anim.current, 'px'].join('');

      }
    }

    function easeOut(t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    }

    animate();
  };

  Wiggly.prototype.stop = function() {
    if (this.running) {
      this.cancel = true;
    }
  };

  // Simple browser detection for the bane of my existance; every other browser is sane enough to not need detection.
  var isIe = !!/msie (\d+\.\d+);/.test(navigator.userAgent.toLowerCase());
  var isIe6 = new Number(RegExp.$1) == 6;
  var isIeQuirks = isIe && document.compatMode && document.compatMode == "BackCompat";
  // for mobile safari
  var isTouch = "ontouchstart" in window;

  // Logs arguments to console
  var log = function() {
    if (typeof console !== "undefined" && typeof console.log !== "undefined" && typeof console.log.apply !== "undefined") {
      console.log.apply(console, arguments);
    }
  };

  var append = function(original) {
    var i, key;
    for (i = 1, l = arguments.length; i < l; i++) {
      var extended = arguments[i] || {};
      for (key in extended) original[key] = extended[key];
    }
    return original;
  };

  // Takes a template like "hi there, #{person}" and params {"person": "Dave"} and returns "hi there, Dave"
  var render = function(template, params) {
    return template.replace(/\#\{([^{}]*)\}/g,
      function(a, b) {
        var r = params[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };

  var insertHtml = function(html) {
    var dummy = document.createElement('div');
    dummy.innerHTML = html;
    document.body.insertBefore(dummy.firstChild, document.body.firstChild);
    return document.body.firstChild;
  };

  // Converts object {sso: 'abcd', forum: 1} into "sso=abcd&forum=1"
  // NOTE: does not URI encode, that needs to be done beforehand.
  var toQueryString = function(params) {
    var pairs = [];
    for (key in params) {
      if (params[key] != null && params[key] != '' && typeof params[key] != 'function') {
        pairs.push([key, params[key]].join('='));
      }
    }
    return pairs.join('&');
  };

  // Adds the css string to the page
  var includeCss = function(cssString) {
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css'; styleElement.media = 'screen';
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = cssString;
    } else {
      styleElement.appendChild(document.createTextNode(cssString));
    }
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  };

  var htmlElement = function() {
    return document.getElementsByTagName('html')[0];
  };

  var addClassToElement = function(element, className) {
    element.className += (element.className ? ' ' : '') + className;
  };

  var removeClassFromElement = function(element, className) {
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)", "g"), ' ');
  };

  var pageDimensions = function() {
    var de = document.documentElement;
    var width = window.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var height = window.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    return {width: width, height: height};
  };

  var elementDimensions = function(element) {
    var display = element.display;
    if (display != 'none' && display != null) { // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};
    }

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  };

	var getScrollTop = function() {
	  var scrollTop;
	  if( typeof( window.pageYOffset ) == 'number' ) {
	    scrollTop = window.pageYOffset;
	  } else if( document.body && ( document.body.scrollTop ) ) {
	    scrollTop = document.body.scrollTop;
	  } else if( document.documentElement && ( document.documentElement.scrollTop ) ) {
	    scrollTop = document.documentElement.scrollTop;
	  }
	  return scrollTop;
	};

	// http://james.padolsey.com/javascript/get-document-height-cross-browser/
	function getDocumentHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
	}

  var referrer = function() {
    var ref = window.location.href;
    if (ref.indexOf('?') != -1) {
      ref = ref.substring(0, ref.indexOf('?'));
    }
    return encodeURIComponent(ref);
  };

  // Takes in options (defaults to uservoiceOptions) and sanitizes them.  Raises errors if they are invalid.
  var prepareOptions = function(options) {
    var defaultOptions = {
      key: 'memolane',
      host: 'memolane.uservoice.com',
      widget_key: 'fO5unwVv9CLnO7nsgxYg'
    };
    var clientOptions = {"mode":"full","tab":{"label":"feedback","position":"middle-left","link_color":"000","inverted":false,"color":"000","enabled":true}};

    defaultOptions = append(defaultOptions, (typeof clientOptions === "object" ? clientOptions : {}));

    options = append(defaultOptions, (typeof(uvOptions) !== "undefined" ? uvOptions : {}), options || {});
    options.params = options.params || {};

    // Be explicit about the things we put into params:

    if (options.sso) {
      options.params.sso = options.sso;
    }
    if (options.sess) {
      options.params.sess = options.sess;
    }
    if (options.custom_fields) {
      options.params.custom_fields = options.custom_fields;
    }
    if (options.default_mode) {
      options.params.default_mode = options.default_mode;
    }

    // Add in the referrer
    options.params.referrer = referrer();

    // Add in custom fields
    if (options.params.custom_fields && (typeof options.params.custom_fields == "object")) {
      options.params.custom_fields = encodeURIComponent(base64Encode(jsonStringify(options.params.custom_fields)));
    }

    // The wiggly
    options.tab = options.tab || {};
    options.tab = append({
      enabled: true,
      position: 'bottom-right',
      color: 'CC6D00',
      label: 'feedback &amp; support',
      inverted: false
    }, options.tab);

    // TODO: add in language


    return options;
  };
  
  //
  // Modules
  //

  var Tab = {
    template: '<div id="uvTab" style="#{tabStyle}">' +
              '<a id="uvTabLabel" style="#{linkStyle}" href="javascript:return false;"><img src="#{imgSrc}" alt="#{label}" style="border:0;" /></a></div>',

    show: function(opts) {
      this.setOptions(opts);

      if (this.element) {
        this.element.parentNode.removeChild(this.element);
      }

      if (true && this.options.enabled) {
        var tab = this;
        var img   = new Image();

        // We're going to wait until the tab text is loaded
        img.onload = function() {
          tab.createElement();
        };
        
        img.src = tab.options.imgSrc;
      }
    },

    createElement: function() {
      var tab  = this;
      var el   = tab.element = insertHtml(render(tab.template, tab.options));
      var a    = el.getElementsByTagName('a')[0];
      // var peeker;

      tab.animator = new Wiggly(el);
      tab.dimensions = elementDimensions(el);

      if (tab.rotation) {
        el.style["marginTop"] = ['-', Math.round(tab.dimensions.height / 2), "px"].join('');
      }

      el.style[tab.margin] = ["-", (tab.rotation ? tab.dimensions.width : tab.dimensions.height), "px"].join('');
      el.style["display"] = 'block';

      a.onmouseover = a.onfocus = function(e) {
        if (!this.widgetInited) {
          Widget.init();
          this.widgetInited = true;
        }
      };

      a.onclick = function(e) {
        e && e.preventDefault();

        Widget.show();

        return false;
      }
      
      if (isTouch) {
        tab.bindTouchEvents();
      }
      
      tab.animateOn(false);
    },

    animateOn: function(short, callback) {
      var tab = this;

      if (short) {
        tab.element.style[tab.margin] = "0px";
        // tab.minimize(callback);
      } else {
        tab.maximize();
      }
    },

    minimize: function(callback) {
      var anim = { "duration": 200 };

      anim[this.margin] = ["-", this.dimensions.width - 34, "px"].join('');
      this.animator.animate(anim, callback);
    },

    maximize: function(callback) {
      var anim = { "duration": 200 };

      anim[this.margin] = "0px";
      this.animator.animate(anim, callback);
    },

    setOptions: function(opts) {
      opts = prepareOptions(opts).tab;

      var posArray = /([^\-]+)-([^\-]+)/.exec(opts.position);
      var rotation = posArray[1] === 'middle' ? 90 : 0;
      var tabStyle = ['tab-', opts.inverted ? 'light-' : 'dark-', opts.position].join('');
      var linkStyle = rotation ? 'link-vertical' : 'link-horizontal';
      var assetHost = [("https:" == document.location.protocol ? "https://" : "http://"), "widget.uservoice.com"].join('');
      var image = [assetHost, "/dcache/widget/feedback-tab.png?t=", encodeURIComponent(opts.label), "&c=", opts.inverted ? opts.color : 'ffffff', "&r=", rotation, opts.inverted ? '&i=yes' : ''].join('');
      var bgImage = opts.position.replace(/middle-/, '').replace(/(bottom|top)-(right|left)/, 'horizontal');
      bgImage = [assetHost, "/images/clients/widget2/tab-", bgImage, opts.inverted ? '-light' : '-dark', '.png'].join('');

      opts.bgImage = bgImage;
      opts.imgSrc = image;

      tabStyle = tabCss[tabStyle];
      linkStyle = tabCss[linkStyle];

      opts.tabStyle  = render(tabStyle, opts);
      opts.linkStyle = render(linkStyle, opts);

      this.options = opts;
      this.rotation = rotation;

      if (posArray[1] === 'bottom') {
        this.margin = 'marginBottom';
      } else if (posArray[1] === 'top') {
        this.margin = 'marginTop';
      } else if (posArray[2] === 'right') {
        this.margin = 'marginRight';
      } else {
        this.margin = 'marginLeft';
      }
    },
    
    bindTouchEvents: function() {
      var top;
      var tab = this;
      var pos = /([^\-]+)-([^\-]+)/.exec(tab.options.position);
      pos = (pos && pos[1]) || 'bottom';
      
      function getTop() {
        if (pos === 'top') {
          return (window.pageYOffset + 'px');
        } else if (pos === 'middle') {
          return Math.round(window.pageYOffset + (window.innerHeight / 2) - (tab.dimensions.width / 2)) + 'px';
        } else {
          return (window.pageYOffset + window.innerHeight - tab.dimensions.height) + 'px';
        }
      }
      
      document.addEventListener('touchstart', onTouchStart, false);
      document.addEventListener('touchend', onTouchEnd, false);
      window.addEventListener('scroll', onScroll, false);

      function onTouchStart(event) {
        tab.element.style.display = 'none';
      }

      function onTouchEnd(event) {
        tab.element.style.display = 'block';
      }
      
      function onScroll(event) {
        tab.element.style.bottom = 'auto';
        tab.element.style.top = getTop();
      }
      
      // fire this in case we're in the middle of a page
      onScroll();
    }
  };

  var assetHost = [("https:" == document.location.protocol ? "https://" : "http://"), "widget.uservoice.com"].join('');

  var Widget = {
    //iframeTemplate: '<iframe id="uservoice-dialog-iframe" src="#{url}?#{query}" frameborder="0" scrolling="no" allowtransparency="true" width="#{width}" height="#{height}" style="height: #{height}; width: #{width};"></iframe>',
    iframeTemplate: '<iframe id="uvw-dialog-iframe" src="#{url}?#{query}" frameBorder="0" name="uvw-iframe" style="display: block; background: #FAFBFC; border: none; -moz-border-radius: 3px; -webkit-border-radius: 3px; border-radius: 3px; height: 100%; padding: none; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%;"></iframe>',
    dialogTemplate: '<div class="uvOverlay1" id="#{overlay_id}" style="position: relative; visibility:hidden; z-index: 100003;"><div id="#{overlay_background_id}" style="background: #000; -ms-filter: alpha(opacity=75); filter: alpha(opacity=75); opacity: .75; position: fixed; top: 0; right: 0; bottom: 0; left: 0;"></div><div class="uvOverlay2" style="height: 100%; overflow: auto; position: fixed; top: 0; right: 0; bottom: 0; left: 0;"><div class="uvOverlay3" style="height: 100%; min-height: 650px; min-width: 840px; position: relative; width: 100%;"><div id="#{dialog_id}" style="-webkit-box-shadow: rgba(0,0,0,.5) 0 5px 5px; height: 620px; margin: -310px 0 0 -405px; position: absolute; top: 50%; left: 50%; width: 810px;">' +
                      '<div onclick="return UserVoice.hidePopupWidget();" id="#{dialog_close_id}" title="Close Dialog" style="z-index: 100004; background: transparent url('+assetHost+'/images/clients/widget2/close.png) 0 0 no-repeat; height: 48px; margin: 0; padding: 0; position: absolute; top: -22px; right: -24px; width: 48px;"><button style="background: none; border: none; -moz-box-shadow: none; -webkit-box-shadow: none; box-shadow: none; cursor: pointer; height: 30px; margin: 6px 0 0 9px; padding: 0; width: 30px; text-indent: -9000px;">Close Dialog</button></div>' +
                      '<div id="#{dialog_content_id}"></div>' +
                      
                    '</div></div></div>',

    dialog_id: 'uvw-dialog',
    dialog_close_id: 'uvw-dialog-close',
    dialog_powered_by_id: 'uvw-dialog-powered-by',
    dialog_content_id: 'uvw-dialog-content',
    overlay_id: 'uvw-overlay',
    overlay_background_id: 'uvw-overlay-background',
    
    show: function(opts) {
      // Build the dialog/iframe and shove it up in the dom (if it's not there already)
      this.init(opts);
      this.pokeWidgetLocationViaHash('opened');
      
      // Finally, show the dialog and focus it
      this.overlay.style.visibility = 'visible';
      this.overlay.style.display = 'block';
      this.dialog.focus();

      // Position the dialog
      if (isIe6) this.positionDialog();

      addClassToElement(htmlElement(), "uvw-dialog-open");
    },
    
    hide: function() {
      this.pokeWidgetLocationViaHash();
      
      if (this.overlay) {
        this.overlay.style.display = 'none';
      }
      
      removeClassFromElement(htmlElement(), "uvw-dialog-open");
    },
    
    // Protected
    pokeWidgetLocationViaHash: function(kind) {
      kind = kind || 'reset';
      
      // if we sandbox jquery in the widget, this will have to be fixed.
      var widgetWindow = frames['uvw-iframe'];
      try {
        widgetWindow.location.href = [this.iframeSrc, (+ new Date()).toString() + kind].join('#');
      } catch (e) {
        // swallow. it's not that important
      }      
    },
    
    init: function(opts) {
      if (!this.options) {
        this.options = prepareOptions(opts);

        // Insert dialog CSS:
        includeCss(dialogCss);  // TODO: customize with options
      }
      
      if (!this.overlay) {
        this.overlay = insertHtml(render(this.dialogTemplate, this));
      }
      
      if (!this.dialog) {
        // Construct iframe HTML:
        var iframeOptions = {
          url:  this.url(),
          query: toQueryString(this.options.params)
        };
        var iframeHtml = render(this.iframeTemplate, iframeOptions);
        this.iframeSrc = [iframeOptions.url, iframeOptions.query].join('?');
        this.dialogContent = document.getElementById(this.dialog_content_id);
        this.dialogContent.innerHTML = iframeHtml;
        this.dialog = document.getElementById(this.dialog_id);
      }
    },

    positionDialog: function() {
      // NOTE: this won't work as it is.  It was designed with a different DOM
      var dialogDimensions = elementDimensions(this.overlay);
      var pageDims = pageDimensions();

      // log("Ok, dialogDimensions = ", dialogDimensions);
      // log("Ok, pageDims = ", pageDims);

      var elementStyle = this.overlay.style;
      elementStyle.width = 'auto';
      elementStyle.height = 'auto';
      elementStyle.left = ((pageDims.width - dialogDimensions.width) / 2) + "px";
      var computedHeight = ((pageDims.height - dialogDimensions.height) / 2);
      elementStyle.top = Math.max(computedHeight, 55) + "px";
    },

    url: function() {
      // NOTE: whether it's app.uv.com or key.uv.com or feeback.key.com really depends on if we want to do xhr or jsonp
      var url;
      if ("https:" == document.location.protocol && this.options.key != null) {
        url = 'https://' + this.options.key + '.uservoice.com/clients/widgets/' + this.options.widget_key + '.html';
      } else {
        url =  'http://' + this.options.host + '/clients/widgets/' + this.options.widget_key + '.html';
      }
      return url;
    }
  };

  //
  // CSS
  //
  var tabCss = {"link-vertical":"display: block;padding: 39px 5px 10px 5px;text-decoration: none;","tab-dark-middle-left":"background: red url(#{bgImage}) 50% 0 no-repeat;border: 1px solid #FFF;border-left: none;-moz-border-radius: 0 4px 4px 0;-webkit-border-radius: 0 4px 4px 0;border-radius: 0 4px 4px 0;-moz-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;left: 0;top: 50%;z-index: 9999;background-color: ##{color};","tab-dark-bottom-left":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid #FFF;border-bottom: none;-moz-border-radius: 4px 4px 0 0;-webkit-border-radius: 4px 4px 0 0;border-radius: 4px 4px 0 0;-moz-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;left: 10px;bottom: 0;z-index: 9999;background-color: ##{color};","tab-light-top-right":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid red;border-top: none;-moz-border-radius: 0 0 4px 4px;-webkit-border-radius: 0 0 4px 4px;border-radius: 0 0 4px 4px;-moz-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;right: 10px;top: 0;z-index: 9999;background-color: ##{color};border-color: ##{color};","link-horizontal":"display: block;padding: 6px 10px 2px 42px;text-decoration: none;","tab-dark-middle-right":"background: red url(#{bgImage}) 50% 0 no-repeat;border: 1px solid #FFF;border-right: none;-moz-border-radius: 4px 0 0 4px;-webkit-border-radius: 4px 0 0 4px;border-radius: 4px 0 0 4px;-moz-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;right: 0;top: 50%;z-index: 9999;background-color: ##{color};","tab-light-middle-left":"background: red url(#{bgImage}) 50% 0 no-repeat;border: 1px solid red;border-left: none;-moz-border-radius: 0 4px 4px 0;-webkit-border-radius: 0 4px 4px 0;border-radius: 0 4px 4px 0;-moz-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;left: 0;top: 50%;z-index: 9999;background-color: ##{color};border-color: ##{color};","tab-light-top-left":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid red;border-top: none;-moz-border-radius: 0 0 4px 4px;-webkit-border-radius: 0 0 4px 4px;border-radius: 0 0 4px 4px;-moz-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;left: 10px;top: 0;z-index: 9999;background-color: ##{color};border-color: ##{color};","tab-dark-top-right":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid #FFF;border-top: none;-moz-border-radius: 0 0 4px 4px;-webkit-border-radius: 0 0 4px 4px;border-radius: 0 0 4px 4px;-moz-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;right: 10px;top: 0;z-index: 9999;background-color: ##{color};","tab-dark-bottom-right":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid #FFF;border-bottom: none;-moz-border-radius: 4px 4px 0 0;-webkit-border-radius: 4px 4px 0 0;border-radius: 4px 4px 0 0;-moz-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;right: 10px;bottom: 0;z-index: 9999;background-color: ##{color};","tab-light-bottom-left":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid red;border-bottom: none;-moz-border-radius: 4px 4px 0 0;-webkit-border-radius: 4px 4px 0 0;border-radius: 4px 4px 0 0;-moz-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;left: 10px;bottom: 0;z-index: 9999;background-color: ##{color};border-color: ##{color};","tab-light-bottom-right":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid red;border-bottom: none;-moz-border-radius: 4px 4px 0 0;-webkit-border-radius: 4px 4px 0 0;border-radius: 4px 4px 0 0;-moz-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;right: 10px;bottom: 0;z-index: 9999;background-color: ##{color};border-color: ##{color};","tab-light-middle-right":"background: red url(#{bgImage}) 50% 0 no-repeat;border: 1px solid red;border-right: none;-moz-border-radius: 4px 0 0 4px;-webkit-border-radius: 4px 0 0 4px;border-radius: 4px 0 0 4px;-moz-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;right: 0;top: 50%;z-index: 9999;background-color: ##{color};border-color: ##{color};","tab-dark-top-left":"background: red url(#{bgImage}) 0 50% no-repeat;border: 1px solid #FFF;border-top: none;-moz-border-radius: 0 0 4px 4px;-webkit-border-radius: 0 0 4px 4px;border-radius: 0 0 4px 4px;-moz-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow: inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font: normal normal bold 14px/1em Arial, sans-serif;position: fixed;left: 10px;top: 0;z-index: 9999;background-color: ##{color};"};

  var dialogCss = "\
    html.uvw-dialog-open object,\
    html.uvw-dialog-open iframe,\
    html.uvw-dialog-open embed {\
      visibility: hidden;\
    }\
    html.uvw-dialog-open iframe#uvw-dialog-iframe {\
      visibility: visible;\
    }\
    ";

  // if (isIe6) {
  //   tabCss += "";
  //   dialogCss += "";
  // }

  //
  // Public Functions
  //

  UserVoice.showPopupWidget = function(opts) {
    //log("UserVoice.showPopupWidget: enter");
    Widget.show(opts);
  };

  UserVoice.hidePopupWidget = function() {
    //log("UserVoice.hidePopupWidget: enter");
    Widget.hide();
    return false;
  };

  UserVoice.showTab = function(opts) {
    Tab.show(opts);
  };

  // Get the party started
  if (!isIe6) {
    Tab.show();
  }
})();
