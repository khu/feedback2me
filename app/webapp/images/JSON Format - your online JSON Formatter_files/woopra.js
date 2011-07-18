
var woopraTracker=false;

function WoopraScript(_src,_hook,_async){

        this.src=_src;
        this.hook=_hook;
        this.async=_async;

        var pntr=false;

        this.init=function(){
               	pntr=this;
        }

        this.load=function(){

                var script=document.createElement('script');
                script.type='text/javascript';
                script.src=pntr.src;
		script.async=pntr.async;

                if(pntr.hook){
			if(typeof(script.onreadystatechange)!='undefined'){
				script.onreadystatechange = function() {
                        	        if (this.readyState == 'complete'|| this.readyState=='loaded') {
                	                        setTimeout(pntr.hook,400);
        	                        }
	                        }
			}else{
	                        script.onload=function(){
					setTimeout(function(){pntr.hook.apply();},400);
				}
			}
                }

                var ssc = document.getElementsByTagName('script')[0];
		ssc.parentNode.insertBefore(script, ssc);
	}
	this.init();
}

function WoopraEvent(name, ce, cv, file){

	this.name=name || 'unknown';
	this.ce = ce || {};
	this.cv = cv || {};
	this.file = file || 'ce';

	this.addProperty=function(key,value){
		this.ce[key] = value;
	}


	this.serialize=function(k,v,delim){
		if(typeof(v) == 'string' || typeof(v) == 'number') {
			return "&" + encodeURIComponent(delim+'_'+k)+'='+encodeURIComponent(v);
		}
		if (v instanceof Array) { // Array
			var buffer='';
			for (var i=0; i<v.length; i++) {
				buffer+= this.serialize(k+'['+i+']',v[i],delim);
			}
			return buffer;
		}
		{ // Object
			var buffer='';
			for (var itemKey in v) {
				buffer+= this.serialize(k + '.' + itemKey,v[itemKey],delim);
			}
			return buffer;
		}
		return '';
	}

	this.fire=function(tracker){

		var t=tracker || woopraTracker;
		
		var buffer='';

		this.addProperty('name',this.name);

		var rd = woopraTracker.getRequestData() || {};
		for (var key in rd) {
			var item=rd[key];
			buffer+= "&" +encodeURIComponent(key)+'='+encodeURIComponent(item);
		}

		for (var key in this.cv) {
			var item=this.cv[key];
			buffer += this.serialize(key,item,'cv');
		}
		
		for (var key in this.ce){
			var item=this.ce[key];
			buffer += this.serialize(key,item,'ce');
		}

		if(buffer!=''){
			var path = ((document.location.protocol=="https:")?'/woopras/'+this.file+'.jsp?':'/'+this.file+'/');
			var _url= t.getEndpoint() + path +'ra='+t.randomstring()+buffer;
			t.request(_url);
		}
	}
}

function WoopraTracker(){

	var pntr=false;
	var chat=false;

	var alias='';
	var vs=0;

	var cv={};

	var pint=false;

	this.version=10;

	this.initialize=function(){
		if(!pntr){
			pntr=this;
			
			pint=setInterval(function(){pntr.ping();},12000);

			if(typeof(document.attachEvent)!='undefined'){
				document.attachEvent("onmousedown",pntr.clicked);
                                document.attachEvent("onmousemove",pntr.moved);
                                document.attachEvent("onkeydown",pntr.typed);
			}else{
				document.addEventListener("mousedown",pntr.clicked,false);
				document.addEventListener("mousemove",pntr.moved,false);
				document.addEventListener("keydown",pntr.typed,false);
			}
		}
		this.initCookies();
	}

	this.initCookies=function(){
		var _c=pntr.readcookie('wooTracker');
                if(!_c){
                        _c=pntr.randomstring();
                        pntr.createcookie('wooTracker', _c, 10*1000);
                }
	}

	this.getEndpoint=function(){
		if(document.location.protocol=="https:"){
			return "https://sec1.woopra.com";
		}else{
			var domain=this.getSettings()['domain'];
        	        return "http://"+domain+".woopra-ns.com";
		}
	}
	
	this.getStatic=function(){
		return document.location.protocol+"//static.woopra.com";
	}

	this.sleep=function(millis){
		var date = new Date();
		var curDate = new Date();
		while(curDate-date < millis){
			curDate=new Date();
		}
	}

	this.randomstring=function(){
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var s = '';
		for (var i = 0; i < 32; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			s += chars.substring(rnum, rnum + 1);
		}
		return s;
	}

	this.readcookie=function(k) {
		var c=""+document.cookie;
		var ind=c.indexOf(k);
		if (ind==-1 || k==""){
			return "";
		}
		var ind1=c.indexOf(';',ind);
		if (ind1==-1){
			ind1=c.length;
		}
		return unescape(c.substring(ind+k.length+1,ind1));
	}

	this.createcookie=function(k,v,days){
		var exp='';
		if(days>0){
			var expires = new Date();
			expires.setDate(expires.getDate() + days);
			exp = expires.toGMTString();
		}
		cookieval = k + '=' + v + '; ' + 'expires=' + exp + ';' + 'path=/'+';domain=.'+pntr.getSettings()['domain'];
		document.cookie = cookieval;
	}

	this.request=function(url,hook){
		var script=new WoopraScript(url,hook,true);
		script.load();
	}
	this.meta=function(){
		var meta='';
		if(pntr.readcookie('wooMeta')){
			meta=pntr.readcookie('wooMeta');
		}
		return meta;
	}
	
	this.site=function(){
		return pntr.getSettings()['domain'];
	}

	this.getRequestData=function(){
		var r=new Object();
		r['alias']=this.getSettings()['domain'];
		r['cookie']=this.readcookie('wooTracker');
		r['meta']=this.meta();
		r['screen']=screen.width + 'x' + screen.height;;
		r['language']=(navigator.browserLanguage || navigator.language || "");
		r['referer']=document.referrer;
		r['idle']=''+parseInt(idle/1000);
                if(vs==2){
                        r['vs']='w';
                        vs=0;
                }else{
                      	if(idle==0){
                                r['vs']='r';
                        }else{
                              	r['vs']='i';
                        }
                }
		return r;
	}

	this.getVisitorData=function(){
		return cv;
	}

	this.getSettings=function(){
		
		if(typeof(woo_settings) != 'undefined' && woo_settings != false){
		}else{
			woo_settings={};
		}
		if(!woo_settings['idle_timeout']){
			woo_settings['idle_timeout']='300000';
		}
		if(!woo_settings['domain']){
			var s=location.hostname;
			s=((s.indexOf('www.')<0)?s:s.substring(4));
			woo_settings['domain']=s;
		}
		return woo_settings;
	}

	this.trackPageview=function(action){
		var e=new WoopraEvent('pv',action,cv,'visit');
		e.fire(pntr);
	}

	//compatibility with woopra.v2.js
	this.track=function(){
		var title=((document.getElementsByTagName('title').length==0)?'':document.getElementsByTagName('title')[0].innerHTML);
		var e=new WoopraEvent('pv',{url:window.location.pathname,title:title},cv,'visit');
		e.fire(pntr);
        }

	this.setDomain=function(site){
                this.getSettings()['domain']=site;
		this.initCookies();
	}

        this.addVisitorProperty=function(name,value){
                this.getVisitorData()[name]=value;
        }

	this.setIdleTimeout=function(t){
                this.getSettings()['idle_timeout']=''+t;
        }
	//end of

	this.pingServer=function(){
		var e=new WoopraEvent('x',{},{},'ping');
		e.fire(pntr);
	}

	this.typed=function(e){
		vs=2;
	}

	this.clicked=function(e) {
		pntr.moved();

		var cElem = (e.srcElement) ? e.srcElement : e.target;

		 while (typeof cElem != 'undefined' && cElem != null) {
		         if (cElem.tagName == "A") {
           			  break;
             		 }
         		cElem = cElem.parentNode;
         	}

		if(typeof cElem != 'undefined' && cElem != null){

			var link=cElem;
			var _download = link.pathname.match(/(?:doc|eps|jpg|png|svg|xls|ppt|pdf|xls|zip|txt|vsd|vxd|js|css|rar|exe|wma|mov|avi|wmv|mp3)($|\&)/);
			var ev=false;
			if(_download && (link.href.toString().indexOf('woopra-ns.com')<0)){
				ev=new WoopraEvent('download',{url:link.href});
				ev.addProperty('url',link.href);
				ev.fire();
				pntr.sleep(100);
			}
			if (!_download&&link.hostname != location.host && link.hostname.indexOf('javascript')==-1 && link.hostname!=''){
				ev=new WoopraEvent('outgoing',{url:link.href});
				ev.fire();
				pntr.sleep(400);
			}
		}
	}

	var last_activity=new Date();
	var idle=0;
	
	this.moved=function(){
		last_activity=new Date();       
		idle=0;
	}

	this.ping=function(){
		var timeout=4*60*1000;
		if(this.getSettings()['idle_timeout']){
			timeout=parseInt(this.getSettings()['idle_timeout']);
		}
		if(idle>timeout){
			clearInterval(pint);
			return;
		}
		pntr.pingServer();
		var now=new Date();
		if(now-last_activity>10000){
			idle=now-last_activity;
		}
	}
    
	this.loadScript=function(src,hook){
		pntr.request(src,hook);
	}

	this.pushEvent=function(ce,cv){
		var e=new WoopraEvent(ce.name,ce,cv,'ce');
                e.fire(pntr);
	}
}

woopraTracker=new WoopraTracker();
woopraTracker.initialize();


if (typeof woopraReady == 'undefined' || woopraReady(woopraTracker) != false) {

	var wx=0;

	if(typeof(woo_actions) != 'undefined' && woo_actions != false){
	}else{
		var title=((document.getElementsByTagName('title').length==0)?'':document.getElementsByTagName('title')[0].innerHTML);
		woo_actions=[{'type':'pageview','title':title,'url':window.location.pathname}];
	}

	if(typeof(woo_visitor) !='undefined' && woo_visitor != false){
		for (var _key in woo_visitor) {
			var item=woo_visitor[_key];
			woopraTracker.addVisitorProperty(_key,item);
		}
	}

        for(wx=0;wx<woo_actions.length;wx++){
                var action=woo_actions[wx];
                if(action.type=='pageview'){
                        woopraTracker.trackPageview(action);
                }else{
                        woopraTracker.pushEvent(action);
               	}
        }

}
