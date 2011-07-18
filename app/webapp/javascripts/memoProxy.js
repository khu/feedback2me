MemoLane.MemoProxy = {};

MemoLane.MemoProxy.Proxy = function(url, visibility) {
  this.url = url;
  this.busy = false;
  this.jobs = [];
  this.cache = [];
  this.memos = [];
  this.memosIds = {};
  this.visibility = visibility;
};

MemoLane.MemoProxy.Proxy.prototype = {
  DAY: 24 * 60 * 60,

  queue: function(from, to, callback) {
	this.jobs.push([from, to, callback]);
	this.kick();
  },

  changeVisibility:  function(newVisibility) {
	this.visibility = newVisibility;
	this.jobs.length = 0;
	this.cache.length = 0;
	this.memos.length = 0;
	this.memosIds = {};
  },

  kick: function() {
	if (!this.busy && this.jobs.length > 0) {
	  var job = this.jobs.shift();
	  this.busy = true;
	  this.get.apply(this, job);
	}
  },

  get: function(from, to, callback) {
	var that = this;

	if (this.isCached(from, to)) {
	  var memos = this.cached(from, to);
	  callback({memos: memos});
	  this.busy = false;
	  this.kick();
	} else {
	  this.fetch(from, to, function() {
		var memos = that.cached(from, to);
		callback({memos: memos});
		that.busy = false;
		that.kick();
	  });
	}
  },

  isCached: function(from, to) {
	return _.any(this.cache, function(e) {return e[0] <= from && to < e[1];});
  },

  cached: function(from, to) {
	return this.select(this.memos, from, to);
  },

  fetch: function(from, to, callback) {
	var that = this;

	var from = from - (7 * this.DAY);
	var to = to + (14 * this.DAY);

	var args = {from: from, to: to};
	if( that.visibility )
	  args["visibility"] = that.visibility
	  Gnarly.json(['get', url+".json"], function(xhr, data) {
		that.cache.push([from, to]);
	  _.each(data.memos, function(memo) {
		if( memo && !that.memosIds[memo["id"]]) { //HACK!! memo really should never be NULL but it can happen in a story if a deletion or refresh of an account or deletion of a user goes bad
		  that.memosIds[memo["id"]] = true;
		  that.memos.push([memo.created_at, memo]);
		}
	   });
	  callback();
	});
  },

  select: function(array, from, to) {
	var memos = _(array).chain()
	  .select(function(element) {return element[0] >= from && element[0] < to;})
	  .map(function(element) {return element[1];})
	  .value();
	return memos;
  }
};
