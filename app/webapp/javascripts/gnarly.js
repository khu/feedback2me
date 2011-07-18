
var Gnarly = { };

(function() {

  var normalizeHeaders = function(headers) {
    var normalized = {};
    for (h in headers) {
      var n = h.toLowerCase().replace("_", "-").replace(/\b([^-])/g, function(x) {
	return x.toUpperCase();
      });
      normalized[n] = headers[h];
    }
    return normalized;
  };

  Gnarly.http = function(request, callback, options) {
    var oldAccept = $.ajaxSettings.accepts._default;
    var url = request[1];
    if ($.isArray(url)) {
      url = url[0] + "?" + $.param(url[1]);
    }
    var headers = normalizeHeaders(request[2]);
    var accept = headers["Accept"];
    if (accept) {
      $.ajaxSettings.accepts._default = accept;
      delete headers["Accept"];
    }
    var opts = {
      type: request[0],
      url: url,
      complete: callback,
      beforeSend: function(xhr) {
		for (key in headers) {
			xhr.setRequestHeader(key, headers[key]);
		}
      }
	};
    if (options) {
      for (key in options) {	
			alert(key);
		opts[key] = options[key];
      }
    }
    var body = request[3];
    if (body) {
      opts.data = body;
      //opts.processData = false;
    }
	
    $.ajax(opts);
    $.ajaxSettings.accepts._default = oldAccept;
  };

})();

(function() {

  Gnarly.json = function(request, callback, options) {
    if (!request[2]) {
      request[2] = {};
    }
    request[2]["Accept"] = "application/json";
    request[2]["Accept-Language"] = "en-US";
    if (request[3]) {
      request[2]["Content-Type"] = "application/json";
      request[3] = JSON.stringify(request[3]);
    }
    Gnarly.http(request, function(xhr) {
      var body = undefined;
		       if (xhr.responseText && xhr.getResponseHeader('Content-Type') && xhr.getResponseHeader('Content-Type').match(/^application\/json/)) {
					body = JSON.parse(xhr.responseText);
		       }
      callback(xhr, body);
    }, options);
  };

})();
