/*!
 * jQuery UI 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.7",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*
 * jQuery UI Position 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+parseInt(c.curCSS(this,"marginRight",true))||0,w=m+q+parseInt(c.curCSS(this,"marginBottom",true))||0,i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=m/2;
i.left=Math.round(i.left);i.top=Math.round(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=
d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;

/*
 * Copyright (C) 1999-2009 Jive Software. All rights reserved.
 *
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

/*
* $ lightbox_me
* By: Buck Wilson
* Version : 2.2
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

(function($){$.fn.lightbox_me=function(options){return this.each(function(){var
opts=$.extend({},$.fn.lightbox_me.defaults,options),$overlay=$('div.'+opts.classPrefix+'_overlay'),$self=$(this),$iframe=$('iframe#lb_iframe'),ie6=($.browser.msie&&$.browser.version<7);if($overlay.length>0){$overlay[0].removeModal();}else{$overlay=$('<div class="'+opts.classPrefix+'_overlay" style="display:none;"/>');}
$iframe=($iframe.length>0)?$iframe:$iframe=$('<iframe id="lb_iframe" style="z-index: '+(opts.zIndex+1)+'; display: none; border: none; margin: 0; padding: 0; position: absolute; width: 100%; height: 100%; top: 0; left: 0;"/>');if(ie6){var src=/^https/i.test(window.location.href||'')?'javascript:false':'about:blank';$iframe.attr('src',src);$('body').append($iframe);}
$('body').append($self).append($overlay);setSelfPosition();$self.css({left:'50%',marginLeft:($self.outerWidth()/2)*-1,zIndex:(opts.zIndex+3)});setOverlayHeight();$overlay.css({position:'absolute',width:'100%',top:0,left:0,right:0,bottom:0,zIndex:(opts.zIndex+2)}).css(opts.overlayCSS);if($overlay.is(":hidden")){$overlay.fadeIn(opts.overlaySpeed,function(){$self[opts.appearEffect](opts.lightboxSpeed,function(){setOverlayHeight();opts.onLoad()});});}else{$self[opts.appearEffect](opts.lightboxSpeed,function(){setOverlayHeight();opts.onLoad()});}
$(window).resize(setOverlayHeight).resize(setSelfPosition).scroll(setSelfPosition).keydown(observeEscapePress);$self.find(opts.closeSelector).click(function(){removeModal(true);return false;});$overlay.click(function(){if(opts.closeClick){removeModal(true);return false;}});$self.bind('close',function(){removeModal(true)});$self.bind('resize',setSelfPosition);$overlay[0].removeModal=removeModal;function removeModal(removeO){$self[opts.disappearEffect](opts.lightboxDisappearSpeed,function(){if(removeO){removeOverlay();}
opts.destroyOnClose?$self.remove():$self.hide()
$self.find(opts.closeSelector).unbind('click');$self.unbind('close');$self.unbind('resize');$(window).unbind('scroll',setSelfPosition);$(window).unbind('resize',setSelfPosition);});}
function removeOverlay(){$overlay.fadeOut(opts.overlayDisappearSpeed,function(){$(window).unbind('resize',setOverlayHeight);$overlay.remove();$overlay.unbind('click');opts.onClose();})}
function observeEscapePress(e){if((e.keyCode==27||(e.DOM_VK_ESCAPE==27&&e.which==0))&&opts.closeEsc)removeModal(true);}
function setOverlayHeight(){if($(window).height()<$(document).height()){$overlay.css({height:$(document).height()+'px'});}else{$overlay.css({height:'100%'});if(ie6){$('html,body').css('height','100%');}}}
function setSelfPosition(){var s=$self[0].style;if(($self.height()+80>=$(window).height())&&($self.css('position')!='absolute'||ie6)){var topOffset=$(document).scrollTop()+40;$self.css({position:'absolute',top:topOffset+'px',marginTop:0})
if(ie6){s.removeExpression('top');}}else if($self.height()+80<$(window).height()){if(ie6){s.position='absolute';if(opts.centered){s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"')
s.marginTop=0;}else{var top=(opts.modalCSS&&opts.modalCSS.top)?parseInt(opts.modalCSS.top):0;s.setExpression('top','((blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"')}}else{if(opts.centered){$self.css({position:'fixed',top:'50%',marginTop:($self.outerHeight()/2)*-1})}else{$self.css({position:'fixed'}).css(opts.modalCSS);}}}}});};$.fn.lightbox_me.defaults={appearEffect:"fadeIn",overlaySpeed:300,lightboxSpeed:"fast",disappearEffect:"fadeOut",overlayDisappearSpeed:300,lightboxDisappearSpeed:"fast",closeSelector:".close",closeClick:true,closeEsc:true,destroyOnClose:false,onLoad:function(){},onClose:function(){},classPrefix:'lb',zIndex:999,centered:false,modalCSS:{top:'40px'},overlayCSS:{background:'black',opacity:.6}}})(jQuery);

/*
 * jQuery Notify UI Widget 1.4
 * Copyright (c) 2010 Eric Hynds
 *
 * http://www.erichynds.com/jquery/a-jquery-ui-growl-ubuntu-notification-widget/
 *
 * Depends:
 *   - jQuery 1.4
 *   - jQuery UI 1.8 widget factory
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/
(function(d){d.widget("ech.notify",{options:{speed:500,expires:5E3,stack:"below",custom:false},_create:function(){var a=this;this.templates={};this.keys=[];this.element.addClass("ui-notify").children().addClass("ui-notify-message ui-notify-message-style").each(function(b){b=this.id||b;a.keys.push(b);a.templates[b]=d(this).removeAttr("id").wrap("<div></div>").parent().html()}).end().empty().show()},create:function(a,b,c){if(typeof a==="object"){c=b;b=a;a=null}a=this.templates[a||this.keys[0]];if(c&&c.custom)a=d(a).removeClass("ui-notify-message-style").wrap("<div></div>").parent().html();return(new d.ech.notify.instance(this))._create(b,d.extend({},this.options,c),a)}});d.extend(d.ech.notify,{instance:function(a){this.parent=a;this.isOpen=false}});d.extend(d.ech.notify.instance.prototype,{_create:function(a,b,c){this.options=b;var e=this;c=c.replace(/#(?:\{|%7B)(.*?)(?:\}|%7D)/g,function(f,g){return g in a?a[g]:""});c=this.element=d(c);var h=c.find(".ui-notify-close");typeof this.options.click==="function"&&c.addClass("ui-notify-click").bind("click",function(f){e._trigger("click",f,e)});h.length&&h.bind("click",function(){e.close();return false});this.open();typeof b.expires==="number"&&window.setTimeout(function(){e.close()},b.expires);return this},close:function(){var a=this,b=this.options.speed;this.isOpen=false;this.element.fadeTo(b,0).slideUp(b,function(){a._trigger("close")});return this},open:function(){if(this.isOpen||this._trigger("beforeopen")===false)return this;var a=this;this.isOpen=true;this.element[this.options.stack==="above"?"prependTo":"appendTo"](this.parent.element).css({display:"none",opacity:""}).fadeIn(this.options.speed,function(){a._trigger("open")});return this},widget:function(){return this.element},_trigger:function(a,b,c){return this.parent._trigger.call(this,a,b,c)}})})(jQuery);

// Underscore.js 1.1.2
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var o=this,A=o._,r=typeof StopIteration!=="undefined"?StopIteration:"__break__",k=Array.prototype,m=Object.prototype,i=k.slice,B=k.unshift,C=m.toString,p=m.hasOwnProperty,s=k.forEach,t=k.map,u=k.reduce,v=k.reduceRight,w=k.filter,x=k.every,y=k.some,n=k.indexOf,z=k.lastIndexOf;m=Array.isArray;var D=Object.keys,c=function(a){return new l(a)};if(typeof exports!=="undefined")exports._=c;o._=c;c.VERSION="1.1.2";var j=c.each=c.forEach=function(a,b,d){try{if(s&&a.forEach===s)a.forEach(b,d);else if(c.isNumber(a.length))for(var e=
0,f=a.length;e<f;e++)b.call(d,a[e],e,a);else for(e in a)p.call(a,e)&&b.call(d,a[e],e,a)}catch(g){if(g!=r)throw g;}return a};c.map=function(a,b,d){if(t&&a.map===t)return a.map(b,d);var e=[];j(a,function(f,g,h){e[e.length]=b.call(d,f,g,h)});return e};c.reduce=c.foldl=c.inject=function(a,b,d,e){var f=d!==void 0;if(u&&a.reduce===u){if(e)b=c.bind(b,e);return f?a.reduce(b,d):a.reduce(b)}j(a,function(g,h,E){d=!f&&h===0?g:b.call(e,d,g,h,E)});return d};c.reduceRight=c.foldr=function(a,b,d,e){if(v&&a.reduceRight===
v){if(e)b=c.bind(b,e);return d!==void 0?a.reduceRight(b,d):a.reduceRight(b)}a=(c.isArray(a)?a.slice():c.toArray(a)).reverse();return c.reduce(a,b,d,e)};c.find=c.detect=function(a,b,d){var e;j(a,function(f,g,h){if(b.call(d,f,g,h)){e=f;c.breakLoop()}});return e};c.filter=c.select=function(a,b,d){if(w&&a.filter===w)return a.filter(b,d);var e=[];j(a,function(f,g,h){if(b.call(d,f,g,h))e[e.length]=f});return e};c.reject=function(a,b,d){var e=[];j(a,function(f,g,h){b.call(d,f,g,h)||(e[e.length]=f)});return e};
c.every=c.all=function(a,b,d){b=b||c.identity;if(x&&a.every===x)return a.every(b,d);var e=true;j(a,function(f,g,h){(e=e&&b.call(d,f,g,h))||c.breakLoop()});return e};c.some=c.any=function(a,b,d){b=b||c.identity;if(y&&a.some===y)return a.some(b,d);var e=false;j(a,function(f,g,h){if(e=b.call(d,f,g,h))c.breakLoop()});return e};c.include=c.contains=function(a,b){if(n&&a.indexOf===n)return a.indexOf(b)!=-1;var d=false;j(a,function(e){if(d=e===b)c.breakLoop()});return d};c.invoke=function(a,b){var d=i.call(arguments,
2);return c.map(a,function(e){return(b?e[b]:e).apply(e,d)})};c.pluck=function(a,b){return c.map(a,function(d){return d[b]})};c.max=function(a,b,d){if(!b&&c.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};j(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});return e.value};c.min=function(a,b,d){if(!b&&c.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};j(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});
return e.value};c.sortBy=function(a,b,d){return c.pluck(c.map(a,function(e,f,g){return{value:e,criteria:b.call(d,e,f,g)}}).sort(function(e,f){var g=e.criteria,h=f.criteria;return g<h?-1:g>h?1:0}),"value")};c.sortedIndex=function(a,b,d){d=d||c.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(b)?e=g+1:f=g}return e};c.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(c.isArray(a))return a;if(c.isArguments(a))return i.call(a);return c.values(a)};c.size=function(a){return c.toArray(a).length};
c.first=c.head=function(a,b,d){return b&&!d?i.call(a,0,b):a[0]};c.rest=c.tail=function(a,b,d){return i.call(a,c.isUndefined(b)||d?1:b)};c.last=function(a){return a[a.length-1]};c.compact=function(a){return c.filter(a,function(b){return!!b})};c.flatten=function(a){return c.reduce(a,function(b,d){if(c.isArray(d))return b.concat(c.flatten(d));b[b.length]=d;return b},[])};c.without=function(a){var b=i.call(arguments,1);return c.filter(a,function(d){return!c.include(b,d)})};c.uniq=c.unique=function(a,
b){return c.reduce(a,function(d,e,f){if(0==f||(b===true?c.last(d)!=e:!c.include(d,e)))d[d.length]=e;return d},[])};c.intersect=function(a){var b=i.call(arguments,1);return c.filter(c.uniq(a),function(d){return c.every(b,function(e){return c.indexOf(e,d)>=0})})};c.zip=function(){for(var a=i.call(arguments),b=c.max(c.pluck(a,"length")),d=Array(b),e=0;e<b;e++)d[e]=c.pluck(a,""+e);return d};c.indexOf=function(a,b){if(n&&a.indexOf===n)return a.indexOf(b);for(var d=0,e=a.length;d<e;d++)if(a[d]===b)return d;
return-1};c.lastIndexOf=function(a,b){if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};c.range=function(a,b,d){var e=i.call(arguments),f=e.length<=1;a=f?0:e[0];b=f?e[0]:e[1];d=e[2]||1;e=Math.max(Math.ceil((b-a)/d),0);f=0;for(var g=Array(e);f<e;){g[f++]=a;a+=d}return g};c.bind=function(a,b){var d=i.call(arguments,2);return function(){return a.apply(b||{},d.concat(i.call(arguments)))}};c.bindAll=function(a){var b=i.call(arguments,1);if(b.length==
0)b=c.functions(a);j(b,function(d){a[d]=c.bind(a[d],a)});return a};c.memoize=function(a,b){var d={};b=b||c.identity;return function(){var e=b.apply(this,arguments);return e in d?d[e]:d[e]=a.apply(this,arguments)}};c.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};c.defer=function(a){return c.delay.apply(c,[a,1].concat(i.call(arguments,1)))};c.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));return b.apply(b,d)}};c.compose=
function(){var a=i.call(arguments);return function(){for(var b=i.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};c.keys=D||function(a){if(c.isArray(a))return c.range(0,a.length);var b=[],d;for(d in a)if(p.call(a,d))b[b.length]=d;return b};c.values=function(a){return c.map(a,c.identity)};c.functions=c.methods=function(a){return c.filter(c.keys(a),function(b){return c.isFunction(a[b])}).sort()};c.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});
return a};c.clone=function(a){return c.isArray(a)?a.slice():c.extend({},a)};c.tap=function(a,b){b(a);return a};c.isEqual=function(a,b){if(a===b)return true;var d=typeof a;if(d!=typeof b)return false;if(a==b)return true;if(!a&&b||a&&!b)return false;if(a.isEqual)return a.isEqual(b);if(c.isDate(a)&&c.isDate(b))return a.getTime()===b.getTime();if(c.isNaN(a)&&c.isNaN(b))return false;if(c.isRegExp(a)&&c.isRegExp(b))return a.source===b.source&&a.global===b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===
b.multiline;if(d!=="object")return false;if(a.length&&a.length!==b.length)return false;d=c.keys(a);var e=c.keys(b);if(d.length!=e.length)return false;for(var f in a)if(!(f in b)||!c.isEqual(a[f],b[f]))return false;return true};c.isEmpty=function(a){if(c.isArray(a)||c.isString(a))return a.length===0;for(var b in a)if(p.call(a,b))return false;return true};c.isElement=function(a){return!!(a&&a.nodeType==1)};c.isArray=m||function(a){return!!(a&&a.concat&&a.unshift&&!a.callee)};c.isArguments=function(a){return!!(a&&
a.callee)};c.isFunction=function(a){return!!(a&&a.constructor&&a.call&&a.apply)};c.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};c.isNumber=function(a){return a===+a||C.call(a)==="[object Number]"};c.isBoolean=function(a){return a===true||a===false};c.isDate=function(a){return!!(a&&a.getTimezoneOffset&&a.setUTCFullYear)};c.isRegExp=function(a){return!!(a&&a.test&&a.exec&&(a.ignoreCase||a.ignoreCase===false))};c.isNaN=function(a){return c.isNumber(a)&&isNaN(a)};c.isNull=function(a){return a===
null};c.isUndefined=function(a){return typeof a=="undefined"};c.noConflict=function(){o._=A;return this};c.identity=function(a){return a};c.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};c.breakLoop=function(){throw r;};c.mixin=function(a){j(c.functions(a),function(b){F(b,c[b]=a[b])})};var G=0;c.uniqueId=function(a){var b=G++;return a?a+b:b};c.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};c.template=function(a,b){var d=c.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+
a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(e,f){return"',"+f.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(e,f){return"');"+f.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return b?d(b):d};var l=function(a){this._wrapped=a};c.prototype=l.prototype;var q=function(a,b){return b?c(a).chain():a},F=function(a,b){l.prototype[a]=function(){var d=
i.call(arguments);B.call(d,this._wrapped);return q(b.apply(c,d),this._chain)}};c.mixin(c);j(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=k[a];l.prototype[a]=function(){b.apply(this._wrapped,arguments);return q(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];l.prototype[a]=function(){return q(b.apply(this._wrapped,arguments),this._chain)}});l.prototype.chain=function(){this._chain=true;return this};l.prototype.value=function(){return this._wrapped}})();

/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line != "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag);
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();


//json2.js

if(!this.JSON){this.JSON={};}
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
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

//haml.js

var Haml;

(function () {

  var matchers, self_close_tags, embedder, forceXML;

  function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }

  function render_attribs(attribs) {
    var key, value, result = [];
    for (key in attribs) {
      if (key !== '_content' && attribs.hasOwnProperty(key)) {
        switch (attribs[key]) {
        case 'undefined':
        case 'false':
        case 'null':
        case '""':
          break;
        default:
          try {
            value = JSON.parse("[" + attribs[key] +"]")[0];
            if (value === true) {
              value = key;
            } else if (typeof value === 'string' && embedder.test(value)) {
              value = '" +\n' + parse_interpol(html_escape(value)) + ' +\n"';
            } else {
              value = html_escape(value);
            }
            result.push(" " + key + '=\\"' + value + '\\"');
          } catch (e) {
            result.push(" " + key + '=\\"" + html_escape(' + attribs[key] + ') + "\\"');
          }
        }
      }
    }
    return result.join("");
  }

  // Parse the attribute block using a state machine
  function parse_attribs(line) {
    var attributes = {},
        l = line.length,
        i, c,
        count = 1,
        quote = false,
        skip = false,
        open, close, joiner, seperator,
        pair = {
          start: 1,
          middle: null,
          end: null
        };

    if (!(l > 0 && (line.charAt(0) === '{' || line.charAt(0) === '('))) {
      return {
        _content: line[0] === ' ' ? line.substr(1, l) : line
      };
    }
    open = line.charAt(0);
    close = (open === '{') ? '}' : ')';
    joiner = (open === '{') ? ':' : '=';
    seperator = (open === '{') ? ',' : ' ';

    function process_pair() {
      if (typeof pair.start === 'number' &&
          typeof pair.middle === 'number' &&
          typeof pair.end === 'number') {
        var key = line.substr(pair.start, pair.middle - pair.start).trim(),
            value = line.substr(pair.middle + 1, pair.end - pair.middle - 1).trim();
        attributes[key] = value;
      }
      pair = {
        start: null,
        middle: null,
        end: null
      };
    }

    for (i = 1; count > 0; i += 1) {

      // If we reach the end of the line, then there is a problem
      if (i > l) {
        throw "Malformed attribute block";
      }

      c = line.charAt(i);
      if (skip) {
        skip = false;
      } else {
        if (quote) {
          if (c === '\\') {
            skip = true;
          }
          if (c === quote) {
            quote = false;
          }
        } else {
          if (c === '"' || c === "'") {
            quote = c;
          }

          if (count === 1) {
            if (c === joiner) {
              pair.middle = i;
            }
            if (c === seperator || c === close) {
              pair.end = i;
              process_pair();
              if (c === seperator) {
                pair.start = i + 1;
              }
            }
          }

          if (c === open || c === "(") {
            count += 1;
          }
          if (c === close || (count > 1 && c === ")")) {
            count -= 1;
          }
        }
      }
    }
    attributes._content = line.substr(i, line.length);
    return attributes;
  }

  // Split interpolated strings into an array of literals and code fragments.
  function parse_interpol(value) {
    var items = [],
        pos = 0,
        next = 0,
        match;
    while (true) {
      // Match up to embedded string
      next = value.substr(pos).search(embedder);
      if (next < 0) {
        if (pos < value.length) {
          items.push(JSON.stringify(value.substr(pos)));
        }
        break;
      }
      items.push(JSON.stringify(value.substr(pos, next)));
      pos += next;

      // Match embedded string
      match = value.substr(pos).match(embedder);
      next = match[0].length;
      if (next < 0) { break; }
      items.push(match[1] || match[2]);
      pos += next;
    }
    return items.filter(function (part) { return part && part.length > 0}).join(" +\n");
  }

  // Used to find embedded code in interpolated strings.
  embedder = /\#\{([^}]*)\}/;

  self_close_tags = ["meta", "img", "link", "br", "hr", "input", "area", "base"];

  // All matchers' regexps should capture leading whitespace in first capture
  // and trailing content in last capture
  matchers = [
    // html tags
    {
      regexp: /^(\s*)((?:[.#%][a-z_\-][a-z0-9_:\-]*)+)(.*)$/i,
      process: function () {
        var tag, classes, ids, attribs, content;
        tag = this.matches[2];
        classes = tag.match(/\.([a-z_\-][a-z0-9_\-]*)/gi);
        ids = tag.match(/\#([a-z_\-][a-z0-9_\-]*)/gi);
        tag = tag.match(/\%([a-z_\-][a-z0-9_:\-]*)/gi);

        // Default to <div> tag
        tag = tag ? tag[0].substr(1, tag[0].length) : 'div';

        attribs = this.matches[3];
        if (attribs) {
          attribs = parse_attribs(attribs);
          if (attribs._content) {
            this.contents.unshift(attribs._content.trim());
            delete(attribs._content);
          }
        } else {
          attribs = {};
        }

        if (classes) {
          classes = classes.map(function (klass) {
            return klass.substr(1, klass.length);
          }).join(' ');
          if (attribs['class']) {
            try {
              attribs['class'] = JSON.stringify(classes + " " + JSON.parse(attribs['class']));
            } catch (e) {
              attribs['class'] = JSON.stringify(classes + " ") + " + " + attribs['class'];
            }
          } else {
            attribs['class'] = JSON.stringify(classes);
          }
        }
        if (ids) {
          ids = ids.map(function (id) {
            return id.substr(1, id.length);
          }).join(' ');
          if (attribs.id) {
            attribs.id = JSON.stringify(ids + " ") + attribs.id;
          } else {
            attribs.id = JSON.stringify(ids);
          }
        }

        attribs = render_attribs(attribs);

        content = this.render_contents();
        if (content === '""') {
          content = '';
        }

        if (forceXML ? content.length > 0 : self_close_tags.indexOf(tag) == -1) {
          return '"<' + tag + attribs + '>"' +
            (content.length > 0 ? ' + \n' + content : "") +
            ' + \n"</' + tag + '>"';
        } else {
          return '"<' + tag + attribs + ' />"';
        }
      }
    },

    // each loops
    {
      regexp: /^(\s*)(?::for|:each)\s+(?:([a-z_][a-z_\-]*),\s*)?([a-z_][a-z_\-]*)\s+in\s+(.*)(\s*)$/i,
      process: function () {
        var ivar = this.matches[2] || '__key__', // index
            vvar = this.matches[3],              // value
            avar = this.matches[4],              // array
            rvar = '__result__';                 // results

        if (this.matches[5]) {
          this.contents.unshift(this.matches[5]);
        }
        return '(function () { ' +
          'var ' + rvar + ' = [], ' + ivar + ', ' + vvar + '; ' +
          'for (' + ivar + ' in ' + avar + ') { ' +
          'if (' + avar + '.hasOwnProperty(' + ivar + ')) { ' +
          vvar + ' = ' + avar + '[' + ivar + ']; ' +
          rvar + '.push(\n' + (this.render_contents() || "''") + '\n); ' +
          '} } return ' + rvar + '.join(""); }).call(this)';
      }
    },

    // if statements
    {
      regexp: /^(\s*):if\s+(.*)\s*$/i,
      process: function () {
        var condition = this.matches[2];
        return '(function () { ' +
          'if (' + condition + ') { ' +
          'return (\n' + (this.render_contents() || '') + '\n);' +
          '} else { return ""; } }).call(this)';
      }
    },

    // declarations
    {
      regexp: /^()!!!(?:\s*(.*))\s*$/,
      process: function () {
        var line = '';
        switch ((this.matches[2] || '').toLowerCase()) {
        case '':
          // XHTML 1.0 Transitional
          line = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
          break;
        case 'strict':
        case '1.0':
          // XHTML 1.0 Strict
          line = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
          break;
        case 'frameset':
          // XHTML 1.0 Frameset
          line = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">';
          break;
        case '5':
          // XHTML 5
          line = '<!DOCTYPE html>';
          break;
        case '1.1':
          // XHTML 1.1
          line = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
          break;
        case 'basic':
          // XHTML Basic 1.1
          line = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">';
          break;
        case 'mobile':
          // XHTML Mobile 1.2
          line = '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">';
          break;
        case 'xml':
          // XML
          line = "<?xml version='1.0' encoding='utf-8' ?>";
          break;
        case 'xml iso-8859-1':
          // XML iso-8859-1
          line = "<?xml version='1.0' encoding='iso-8859-1' ?>";
          break;
        }
        return JSON.stringify(line + "\n");
      }
    },

    // Embedded markdown. Needs to be added to exports externally.
    {
      regexp: /^(\s*):markdown\s*$/i,
      process: function () {
        return parse_interpol(exports.Markdown.encode(this.contents.join("\n")));
      }
    },

    // script blocks
    {
      regexp: /^(\s*):(?:java)?script\s*$/,
      process: function () {
        return parse_interpol('\n<script type="text/javascript">\n' +
          '//<![CDATA[\n' +
          this.contents.join("\n") +
          "\n//]]>\n</script>\n");
      }
    },

    // css blocks
    {
      regexp: /^(\s*):css\s*$/,
      process: function () {
        return JSON.stringify('\n<style type="text/css">\n' +
          this.contents.join("\n") +
          "\n</style>\n");
      }
    },

  ];

  function compile(lines) {
    var block = false,
        output = [];

    // If lines is a string, turn it into an array
    if (typeof lines === 'string') {
      lines = lines.trim().replace(/\n\r|\r/g, '\n').split('\n');
    }

    lines.forEach(function(line) {
      var match, found = false;

      // Collect all text as raw until outdent
      if (block) {
        match = block.check_indent.exec(line);
        if (match) {
          block.contents.push(match[1] || "");
          return;
        } else {
          output.push(block.process());
          block = false;
        }
      }

      matchers.forEach(function (matcher) {
        if (!found) {
          match = matcher.regexp.exec(line);
          if (match) {
            block = {
              contents: [],
              matches: match,
              check_indent: new RegExp("^(?:\\s*|" + match[1] + "  (.*))$"),
              process: matcher.process,
              render_contents: function () {
                return compile(this. contents);
              }
            };
            found = true;
          }
        }
      });

      // Match plain text
      if (!found) {
        output.push(function () {
          // Escaped plain text
          if (line[0] === '\\') {
            return parse_interpol(line.substr(1, line.length));
          }

          // Plain variable data
          if (line[0] === '=') {
            line = line.substr(1, line.length).trim();
            try {
              return parse_interpol(JSON.parse(line));
            } catch (e) {
              return line;
            }
          }

          // HTML escape variable data
          if (line.substr(0, 2) === "&=") {
            line = line.substr(2, line.length).trim();
            try {
              return JSON.stringify(html_escape(JSON.parse(line)));
            } catch (e2) {
              return 'html_escape(' + line + ')';
            }
          }

          // Plain text
          return parse_interpol(line);
        }());
      }

    });
    if (block) {
      output.push(block.process());
    }
    return output.filter(function (part) { return part && part.length > 0}).join(" +\n");
  };

  function optimize(js) {
    var new_js = [], buffer = [], part, end;

    function flush() {
      if (buffer.length > 0) {
        new_js.push(JSON.stringify(buffer.join("")) + end);
        buffer = [];
      }
    }
    js.replace(/\n\r|\r/g, '\n').split('\n').forEach(function (line) {
      part = line.match(/^(\".*\")(\s*\+\s*)?$/);
      if (!part) {
        flush();
        new_js.push(line);
        return;
      }
      end = part[2] || "";
      part = part[1];
      try {
        buffer.push(JSON.parse(part));
      } catch (e) {
        flush();
        new_js.push(line);
      }
    });
    flush();
    return new_js.join("\n");
  };

  function render(text, options) {
    options = options || {};
    text = text || "";
    var js = compile(text);
    if (options.optimize) {
      js = Haml.optimize(js);
    }
    return execute(js, options.context || Haml, options.locals);
  };

  function execute(js, self, locals) {
    return (function () {
      with(locals || {}) {
        try {
          return eval("(" + js + ")");
        } catch (e) {
          return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
        }

      }
    }).call(self);
  };

  Haml = function Haml(haml, xml) {
    forceXML = xml;
    var js = optimize(compile(haml));
    return new Function("locals",
      html_escape + "\n" +
      "with(locals || {}) {\n" +
      "  try {\n" +
      "    return (" + js + ");\n" +
      "  } catch (e) {\n" +
      "    return \"\\n<pre class='error'>\" + html_escape(e.stack) + \"</pre>\\n\";\n" +
      "  }\n" +
      "}");
  }
  Haml.compile = compile;
  Haml.optimize = optimize;
  Haml.render = render;
  Haml.execute = execute;

}());

// Hook into module system
if (typeof module !== 'undefined') {
  module.exports = Haml;
}
/*
 * jQuery doTimeout: Like setTimeout, but better! - v1.0 - 3/3/2010
 * http://benalman.com/projects/jquery-dotimeout-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($){var a={},c="doTimeout",d=Array.prototype.slice;$[c]=function(){return b.apply(window,[0].concat(d.call(arguments)))};$.fn[c]=function(){var f=d.call(arguments),e=b.apply(this,[c+f[0]].concat(f));return typeof f[0]==="number"||typeof f[1]==="number"?this:e};function b(l){var m=this,h,k={},g=l?$.fn:$,n=arguments,i=4,f=n[1],j=n[2],p=n[3];if(typeof f!=="string"){i--;f=l=0;j=n[1];p=n[2]}if(l){h=m.eq(0);h.data(l,k=h.data(l)||{})}else{if(f){k=a[f]||(a[f]={})}}k.id&&clearTimeout(k.id);delete k.id;function e(){if(l){h.removeData(l)}else{if(f){delete a[f]}}}function o(){k.id=setTimeout(function(){k.fn()},j)}if(p){k.fn=function(q){if(typeof p==="string"){p=g[p]}p.apply(m,d.call(n,i))===true&&!q?o():e()};o()}else{if(k.fn){j===undefined?e():k.fn(j===false);return true}else{e()}}}})(jQuery);

/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 *
 * Requires: 1.2.2+
 */
(function(c){var a=["DOMMouseScroll","mousewheel"];c.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var d=a.length;d;){this.addEventListener(a[--d],b,false)}}else{this.onmousewheel=b}},teardown:function(){if(this.removeEventListener){for(var d=a.length;d;){this.removeEventListener(a[--d],b,false)}}else{this.onmousewheel=null}}};c.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}});function b(i){var g=i||window.event,f=[].slice.call(arguments,1),j=0,h=true,e=0,d=0;i=c.event.fix(g);i.type="mousewheel";if(i.wheelDelta){j=i.wheelDelta/120}if(i.detail){j=-i.detail/3}d=j;if(g.axis!==undefined&&g.axis===g.HORIZONTAL_AXIS){d=0;e=-1*j}if(g.wheelDeltaY!==undefined){d=g.wheelDeltaY/120}if(g.wheelDeltaX!==undefined){e=-1*g.wheelDeltaX/120}f.unshift(i,j,e,d);return c.event.handle.apply(this,f)}})(jQuery);

/*
 * jQuery autoResize (textarea auto-resizer)
 * @copyright James Padolsey http://james.padolsey.com
 * @version 1.04
 */

(function(a){a.fn.autoResize=function(j){var b=a.extend({onResize:function(){},animate:true,animateDuration:150,animateCallback:function(){},extraSpace:20,limit:1000},j);this.filter('textarea').each(function(){var c=a(this).css({resize:'none','overflow-y':'hidden'}),k=c.height(),f=(function(){var l=['height','width','lineHeight','textDecoration','letterSpacing'],h={};a.each(l,function(d,e){h[e]=c.css(e)});return c.clone().removeAttr('id').removeAttr('name').css({position:'absolute',top:0,left:-9999}).css(h).attr('tabIndex','-1').insertBefore(c)})(),i=null,g=function(){f.height(0).val(a(this).val()).scrollTop(10000);var d=Math.max(f.scrollTop(),k)+b.extraSpace,e=a(this).add(f);if(i===d){return}i=d;if(d>=b.limit){a(this).css('overflow-y','');return}b.onResize.call(this);b.animate&&c.css('display')==='block'?e.stop().animate({height:d},b.animateDuration,b.animateCallback):e.height(d)};c.unbind('.dynSiz').bind('keyup.dynSiz',g).bind('keydown.dynSiz',g).bind('change.dynSiz',g)});return this}})(jQuery);
