/*!
 * Rails 3 Client Side Validations - v3.1.0
 * https://github.com/bcardarlela/client_side_validations
 *
 * Copyright (c) 2011 Brian Cardarella
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(c){c.fn.validate=function(){return this.filter("form[data-validate]").each(function(){var g=c(this);var f=window[g.attr("id")];g.submit(function(){return g.isValid(f.validators)}).bind("ajax:beforeSend",function(){return g.isValid(f.validators)}).bind("form:validate:after",function(h){clientSideValidations.callbacks.form.after(g,h)}).bind("form:validate:before",function(h){clientSideValidations.callbacks.form.before(g,h)}).bind("form:validate:fail",function(h){clientSideValidations.callbacks.form.fail(g,h)}).bind("form:validate:pass",function(h){clientSideValidations.callbacks.form.pass(g,h)}).find("[data-validate]:input:not(:radio)").live("focusout",function(){c(this).isValid(f.validators)}).live("change",function(){c(this).data("changed",true)}).live("element:validate:after",function(h){clientSideValidations.callbacks.element.after(c(this),h)}).live("element:validate:before",function(h){clientSideValidations.callbacks.element.before(c(this),h)}).live("element:validate:fail",function(j,i){var h=c(this);clientSideValidations.callbacks.element.fail(h,i,function(){d(h,i)},j)}).live("element:validate:pass",function(i){var h=c(this);clientSideValidations.callbacks.element.pass(h,function(){e(h)},i)}).end().find("[data-validate]:checkbox").live("click",function(){c(this).isValid(f.validators)}).end().find("[id*=_confirmation]").each(function(){var i=c(this),h=g.find("#"+this.id.match(/(.+)_confirmation/)[1]+"[data-validate]:input");if(h[0]){c("#"+i.attr("id")).live("focusout",function(){h.data("changed",true).isValid(f.validators)}).live("keyup",function(){h.data("changed",true).isValid(f.validators)})}});var d=function(h,i){clientSideValidations.formBuilders[f.type].add(h,f,i)};var e=function(h){clientSideValidations.formBuilders[f.type].remove(h,f)}})};c.fn.isValid=function(d){if(c(this[0]).is("form")){return b(c(this[0]),d)}else{return a(c(this[0]),d[this[0].name])}};var b=function(f,d){var e=true;f.trigger("form:validate:before").find("[data-validate]:input").each(function(){if(!c(this).isValid(d)){e=false}});if(e){f.trigger("form:validate:pass")}else{f.trigger("form:validate:fail")}f.trigger("form:validate:after");return e};var a=function(e,d){e.trigger("element:validate:before");if(e.data("changed")!==false){var f=true;e.data("changed",false);for(kind in clientSideValidations.validators.all()){if(d[kind]&&(message=clientSideValidations.validators.all()[kind](e,d[kind]))){e.trigger("element:validate:fail",message).data("valid",false);f=false;break}}if(f){e.data("valid",null);e.trigger("element:validate:pass")}}e.trigger("element:validate:after");return e.data("valid")===false?false:true};c(function(){c("form[data-validate]").validate()})})(jQuery);var clientSideValidations={validators:{all:function(){return jQuery.extend({},clientSideValidations.validators.local,clientSideValidations.validators.remote)},local:{presence:function(b,a){if(/^\s*$/.test(b.val()||"")){return a.message}},acceptance:function(b,a){switch(b.attr("type")){case"checkbox":if(!b.attr("checked")){return a.message}break;case"text":if(b.val()!=(a.accept||"1")){return a.message}break}},format:function(b,a){if((message=this.presence(b,a))&&a.allow_blank==true){return}else{if(message){return message}else{if(a["with"]&&!a["with"].test(b.val())){return a.message}else{if(a.without&&a.without.test(b.val())){return a.message}}}}},numericality:function(d,c){if(!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(d.val())){return c.messages.numericality}if(c.only_integer&&!/^\d+$/.test(d.val())){return c.messages.only_integer}var a={greater_than:">",greater_than_or_equal_to:">=",equal_to:"==",less_than:"<",less_than_or_equal_to:"<="};for(var b in a){if(c[b]!=undefined&&!(new Function("return "+d.val()+a[b]+c[b])())){return c.messages[b]}}if(c.odd&&!(parseInt(d.val())%2)){return c.messages.odd}if(c.even&&(parseInt(d.val())%2)){return c.messages.even}},length:function(e,d){var c={};if(d.is){c.message=d.messages.is}else{if(d.minimum){c.message=d.messages.minimum}}if((message=this.presence(e,c))&&d.allow_blank==true){return}else{if(message){return message}else{var a={is:"==",minimum:">=",maximum:"<="};var f=d.js_tokenizer||"split('')";var g=new Function("element","return (element.val()."+f+" || '').length;")(e);for(var b in a){if(d[b]&&!(new Function("return "+g+a[b]+d[b])())){return d.messages[b]}}}}},exclusion:function(d,b){if((message=this.presence(d,b))&&b.allow_blank==true){return}else{if(message){return message}else{if(b["in"]){for(var c=0;c<b["in"].length;c++){if(b["in"][c]==d.val()){return b.message}}}else{if(b.range){var a=b.range[0],e=b.range[1];if(d.val()>=a&&d.val()<=e){return b.message}}}}}},inclusion:function(d,b){if((message=this.presence(d,b))&&b.allow_blank==true){return}else{if(message){return message}else{if(b["in"]){for(var c=0;c<b["in"].length;c++){if(b["in"][c]==d.val()){return}}return b.message}else{if(b.range){var a=b.range[0],e=b.range[1];if(d.val()>=a&&d.val()<=e){return}else{return b.message}}}}}},confirmation:function(b,a){if(b.val()!=jQuery("#"+b.attr("id")+"_confirmation").val()){return a.message}}},remote:{uniqueness:function(c,b){var e={};e.case_sensitive=!!b.case_sensitive;if(b.id){e.id=b.id}if(b.scope){e.scope={};for(key in b.scope){var d=jQuery('[name="'+c.attr("name").replace(/\[\w+]$/,"["+key+']"]'));if(d[0]&&d.val()!=b.scope[key]){e.scope[key]=d.val();d.unbind("change."+c.id).bind("change."+c.id,function(){c.trigger("change");c.trigger("focusout")})}else{e.scope[key]=b.scope[key]}}}if(/_attributes]/.test(c.attr("name"))){var a=c.attr("name").match(/\[\w+_attributes]/g).pop().match(/\[(\w+)_attributes]/).pop();a+=/(\[\w+])$/.exec(c.attr("name"))[1]}else{var a=c.attr("name")}if(b["class"]){a=b["class"]+"["+a.split("[")[1]}e[a]=c.val();if(jQuery.ajax({url:"/validators/uniqueness",data:e,async:false}).status==200){return b.message}}}},formBuilders:{"ActionView::Helpers::FormBuilder":{add:function(c,d,e){if(c.data("valid")!==false&&jQuery('label.message[for="'+c.attr("id")+'"]')[0]==undefined){var a=jQuery(d.input_tag),f=jQuery(d.label_tag),b=jQuery('label[for="'+c.attr("id")+'"]:not(.message)');if(c.attr("autofocus")){c.attr("autofocus",false)}c.before(a);a.find("span#input_tag").replaceWith(c);a.find("label.message").attr("for",c.attr("id"));f.find("label.message").attr("for",c.attr("id"));b.replaceWith(f);f.find("label#label_tag").replaceWith(b)}jQuery('label.message[for="'+c.attr("id")+'"]').text(e)},remove:function(d,e){var a=jQuery(e.input_tag).attr("class"),b=d.closest("."+a),c=jQuery('label[for="'+d.attr("id")+'"]:not(.message)'),f=c.closest("."+a);if(b[0]){b.find("#"+d.attr("id")).detach();b.replaceWith(d);c.detach();f.replaceWith(c)}}},"SimpleForm::FormBuilder":{add:function(b,c,d){if(b.data("valid")!==false){var e=b.closest(c.wrapper_tag);e.addClass(c.wrapper_error_class);var a=$("<"+c.error_tag+' class="'+c.error_class+'">'+d+"</"+c.error_tag+">");e.append(a)}else{b.parent().find(c.error_tag+"."+c.error_class).text(d)}},remove:function(b,c){var d=b.closest(c.wrapper_tag+"."+c.wrapper_error_class);d.removeClass(c.wrapper_error_class);var a=d.find(c.error_tag+"."+c.error_class);a.remove()}},"Formtastic::FormBuilder":{add:function(b,c,d){if(b.data("valid")!==false){var e=b.closest("li");e.addClass("error");var a=$('<p class="'+c.inline_error_class+'">'+d+"</p>");e.append(a)}else{b.parent().find("p."+c.inline_error_class).text(d)}},remove:function(b,c){var d=b.closest("li.error");d.removeClass("error");var a=d.find("p."+c.inline_error_class);a.remove()}},"NestedForm::Builder":{add:function(a,b,c){clientSideValidations.formBuilders["ActionView::Helpers::FormBuilder"].add(a,b,c)},remove:function(a,b,c){clientSideValidations.formBuilders["ActionView::Helpers::FormBuilder"].remove(a,b,c)}}},callbacks:{element:{after:function(a,b){},before:function(a,b){},fail:function(b,d,a,c){a()},pass:function(a,b,c){b()}},form:{after:function(b,a){},before:function(b,a){},fail:function(b,a){},pass:function(b,a){}}}};$.fn.clearForm=function(){return this.each(function(){if($(this).is("form")){return $(":input",this).clearForm()}if($(this).hasClass("clear_on_submit")||$(this).is(":text")||$(this).is(":password")||$(this).is("textarea")){$(this).val("")}else{if($(this).is(":checkbox")||$(this).is(":radio")){$(this).attr("checked",false)}else{if($(this).is("select")){this.selectedIndex=-1}else{if($(this).attr("name")=="photos[]"){$(this).val("")}}}}$(this).blur()})};(function(d){function b(l){var k=d('meta[name="csrf-token"]').attr("content");if(k){l(function(m){m.setRequestHeader("X-CSRF-Token",k)})}}if(d().jquery=="1.5"){var e=d.ajaxSettings.xhr;d.ajaxSettings.xhr=function(){var k=e();b(function(l){var m=k.open;k.open=function(){m.apply(this,arguments);l(this)}});return k}}else{d(document).ajaxSend(function(k,l){b(function(m){m(l)})})}function c(n,k,m){var l=new d.Event(k);n.trigger(l,m);return l.result!==false}function j(n){var p,l,o,k=n.attr("data-type")||(d.ajaxSettings&&d.ajaxSettings.dataType);if(n.is("form")){p=n.attr("method");l=n.attr("action");o=n.serializeArray();var m=n.data("ujs:submit-button");if(m){o.push(m);n.data("ujs:submit-button",null)}}else{p=n.attr("data-method");l=n.attr("href");o=null}d.ajax({url:l,type:p||"GET",data:o,dataType:k,beforeSend:function(r,q){if(q.dataType===undefined){r.setRequestHeader("accept","*/*;q=0.5, "+q.accepts.script)}return c(n,"ajax:beforeSend",[r,q])},success:function(r,q,s){n.trigger("ajax:success",[r,q,s])},complete:function(r,q){n.trigger("ajax:complete",[r,q])},error:function(s,q,r){n.trigger("ajax:error",[s,q,r])}})}function g(q){var l=q.attr("href"),k=q.attr("data-method"),s=d("meta[name=csrf-token]").attr("content"),r=d("meta[name=csrf-param]").attr("content"),m=d('<form method="post" action="'+l+'"></form>'),p='<input name="_method" value="'+k+'" type="hidden" />',o=q.data("form-params");if(r!==undefined&&s!==undefined){p+='<input name="'+r+'" value="'+s+'" type="hidden" />'}if(o!=undefined){var n=d.parseJSON(o);for(key in n){m.append(d("<input>").attr({type:"hidden",name:key,value:n[key]}))}}m.hide().append(p).appendTo("body");m.submit()}function h(k){k.find("input[data-disable-with]").each(function(){var l=d(this);l.data("ujs:enable-with",l.val()).val(l.attr("data-disable-with")).attr("disabled","disabled")})}function a(k){k.find("input[data-disable-with]").each(function(){var l=d(this);l.val(l.data("ujs:enable-with")).removeAttr("disabled")})}function i(k){var l=k.attr("data-confirm");return !l||(c(k,"confirm")&&confirm(l))}function f(l){var k=false;l.find("input[name][required]").each(function(){if(!d(this).val()){k=true}});return k}d("a[data-confirm], a[data-method], a[data-remote]").live("click.rails",function(l){var k=d(this);if(!i(k)){return false}if(k.attr("data-remote")!=undefined){j(k);return false}else{if(k.attr("data-method")){g(k);return false}}});d("form").live("submit.rails",function(m){var k=d(this),l=k.attr("data-remote")!=undefined;if(!i(k)){return false}if(f(k)){return !l}if(l){j(k);return false}else{setTimeout(function(){h(k)},13)}});d("form input[type=submit], form button[type=submit], form button:not([type])").live("click.rails",function(){var l=d(this);if(!i(l)){return false}var k=l.attr("name"),m=k?{name:k,value:l.val()}:null;l.closest("form").data("ujs:submit-button",m)});d("form").live("ajax:beforeSend.rails",function(k){if(this==k.target){h(d(this))}});d("form").live("ajax:complete.rails",function(k){if(this==k.target){a(d(this))}})})(jQuery);(function(b){b.hotkeys={version:"0.8",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",191:"/",224:"meta"},shiftNums:{"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":": ","'":'"',",":"<",".":">","/":"?","\\":"|"}};function a(d){if(typeof d.data!=="string"){return}var c=d.handler,e=d.data.toLowerCase().split(" ");d.handler=function(n){if(this!==n.target&&(/textarea|select/i.test(n.target.nodeName)||n.target.type==="text")){return}var h=n.type!=="keypress"&&b.hotkeys.specialKeys[n.which],o=String.fromCharCode(n.which).toLowerCase(),k,m="",g={};if(n.altKey&&h!=="alt"){m+="alt+"}if(n.ctrlKey&&h!=="ctrl"){m+="ctrl+"}if(n.metaKey&&!n.ctrlKey&&h!=="meta"){m+="meta+"}if(n.shiftKey&&h!=="shift"){m+="shift+"}if(h){g[m+h]=true}else{g[m+o]=true;g[m+b.hotkeys.shiftNums[o]]=true;if(m==="shift+"){g[b.hotkeys.shiftNums[o]]=true}}for(var j=0,f=e.length;j<f;j++){if(g[e[j]]){return c.apply(this,arguments)}}}}b.each(["keydown","keyup","keypress"],function(){b.event.special[this]={add:a}})})(jQuery);(function(b){b.fn.autoResize=function(c){var a=b.extend({onResize:function(){},animate:true,animateDuration:150,animateCallback:function(){},extraSpace:20,limit:1000},c);this.filter("textarea").each(function(){var l=b(this).css({resize:"none","overflow-y":"hidden"}),d=l.height(),j=(function(){var f=["height","width","lineHeight","textDecoration","letterSpacing"],g={};b.each(f,function(k,i){g[i]=l.css(i)});return l.clone().removeAttr("id").removeAttr("name").css({position:"absolute",top:0,left:-9999}).css(g).attr("tabIndex","-1").insertBefore(l)})(),e=null,h=function(){j.height(0).val(b(this).val()).scrollTop(10000);var g=Math.max(j.scrollTop(),d)+a.extraSpace,f=b(this).add(j);if(e===g){return}e=g;if(g>=a.limit){b(this).css("overflow-y","");return}a.onResize.call(this);a.animate&&l.css("display")==="block"?f.stop().animate({height:g},a.animateDuration,a.animateCallback):f.height(g)};l.unbind(".dynSiz").bind("keyup.dynSiz",h).bind("keydown.dynSiz",h).bind("change.dynSiz",h)});return this}})(jQuery);
/*!
 * jQuery UI 1.8.9
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(d,b){function a(c){return !d(c).parents().andSelf().filter(function(){return d.curCSS(this,"visibility")==="hidden"||d.expr.filters.hidden(this)}).length}d.ui=d.ui||{};if(!d.ui.version){d.extend(d.ui,{version:"1.8.9",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});d.fn.extend({_focus:d.fn.focus,focus:function(e,c){return typeof e==="number"?this.each(function(){var f=this;setTimeout(function(){d(f).focus();c&&c.call(f)},e)}):this._focus.apply(this,arguments)},scrollParent:function(){var c;c=d.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(d.curCSS(this,"position",1))&&/(auto|scroll)/.test(d.curCSS(this,"overflow",1)+d.curCSS(this,"overflow-y",1)+d.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(d.curCSS(this,"overflow",1)+d.curCSS(this,"overflow-y",1)+d.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!c.length?d(document):c},zIndex:function(e){if(e!==b){return this.css("zIndex",e)}if(this.length){e=d(this[0]);for(var c;e.length&&e[0]!==document;){c=e.css("position");if(c==="absolute"||c==="relative"||c==="fixed"){c=parseInt(e.css("zIndex"),10);if(!isNaN(c)&&c!==0){return c}}e=e.parent()}}return 0},disableSelection:function(){return this.bind((d.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(c){c.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});d.each(["Width","Height"],function(f,c){function l(n,i,h,e){d.each(k,function(){i-=parseFloat(d.curCSS(n,"padding"+this,true))||0;if(h){i-=parseFloat(d.curCSS(n,"border"+this+"Width",true))||0}if(e){i-=parseFloat(d.curCSS(n,"margin"+this,true))||0}});return i}var k=c==="Width"?["Left","Right"]:["Top","Bottom"],j=c.toLowerCase(),g={innerWidth:d.fn.innerWidth,innerHeight:d.fn.innerHeight,outerWidth:d.fn.outerWidth,outerHeight:d.fn.outerHeight};d.fn["inner"+c]=function(e){if(e===b){return g["inner"+c].call(this)}return this.each(function(){d(this).css(j,l(this,e)+"px")})};d.fn["outer"+c]=function(h,e){if(typeof h!=="number"){return g["outer"+c].call(this,h)}return this.each(function(){d(this).css(j,l(this,h,true,e)+"px")})}});d.extend(d.expr[":"],{data:function(e,c,f){return !!d.data(e,f[3])},focusable:function(e){var c=e.nodeName.toLowerCase(),f=d.attr(e,"tabindex");if("area"===c){c=e.parentNode;f=c.name;if(!e.href||!f||c.nodeName.toLowerCase()!=="map"){return false}e=d("img[usemap=#"+f+"]")[0];return !!e&&a(e)}return(/input|select|textarea|button|object/.test(c)?!e.disabled:"a"==c?e.href||!isNaN(f):!isNaN(f))&&a(e)},tabbable:function(e){var c=d.attr(e,"tabindex");return(isNaN(c)||c>=0)&&d(e).is(":focusable")}});d(function(){var e=document.body,c=e.appendChild(c=document.createElement("div"));d.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});d.support.minHeight=c.offsetHeight===100;d.support.selectstart="onselectstart" in c;e.removeChild(c).style.display="none"});d.extend(d.ui,{plugin:{add:function(f,c,h){f=d.ui[f].prototype;for(var g in h){f.plugins[g]=f.plugins[g]||[];f.plugins[g].push([c,h[g]])}},call:function(f,c,h){if((c=f.plugins[c])&&f.element[0].parentNode){for(var g=0;g<c.length;g++){f.options[c[g][0]]&&c[g][1].apply(f.element,h)}}}},contains:function(e,c){return document.compareDocumentPosition?e.compareDocumentPosition(c)&16:e!==c&&e.contains(c)},hasScroll:function(e,c){if(d(e).css("overflow")==="hidden"){return false}c=c&&c==="left"?"scrollLeft":"scrollTop";var f=false;if(e[c]>0){return true}e[c]=1;f=e[c]>0;e[c]=0;return f},isOverAxis:function(e,c,f){return e>c&&e<c+f},isOver:function(f,c,l,k,j,g){return d.ui.isOverAxis(f,l,j)&&d.ui.isOverAxis(c,k,g)}})}})(jQuery);
/*!
 * jQuery UI Widget 1.8.9
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(a,e){if(a.cleanData){var d=a.cleanData;a.cleanData=function(b){for(var g=0,f;(f=b[g])!=null;g++){a(f).triggerHandler("remove")}d(b)}}else{var c=a.fn.remove;a.fn.remove=function(b,f){return this.each(function(){if(!f){if(!b||a.filter(b,[this]).length){a("*",this).add([this]).each(function(){a(this).triggerHandler("remove")})}}return c.call(a(this),b,f)})}}a.widget=function(b,j,i){var h=b.split(".")[0],g;b=b.split(".")[1];g=h+"-"+b;if(!i){i=j;j=a.Widget}a.expr[":"][g]=function(f){return !!a.data(f,b)};a[h]=a[h]||{};a[h][b]=function(f,k){arguments.length&&this._createWidget(f,k)};j=new j;j.options=a.extend(true,{},j.options);a[h][b].prototype=a.extend(true,j,{namespace:h,widgetName:b,widgetEventPrefix:a[h][b].prototype.widgetEventPrefix||b,widgetBaseClass:g},i);a.widget.bridge(b,a[h][b])};a.widget.bridge=function(b,f){a.fn[b]=function(k){var j=typeof k==="string",i=Array.prototype.slice.call(arguments,1),g=this;k=!j&&i.length?a.extend.apply(null,[true,k].concat(i)):k;if(j&&k.charAt(0)==="_"){return g}j?this.each(function(){var l=a.data(this,b),h=l&&a.isFunction(l[k])?l[k].apply(l,i):l;if(h!==l&&h!==e){g=h;return false}}):this.each(function(){var h=a.data(this,b);h?h.option(k||{})._init():a.data(this,b,new f(k,this))});return g}};a.Widget=function(b,f){arguments.length&&this._createWidget(b,f)};a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(b,g){a.data(g,this.widgetName,this);this.element=a(g);this.options=a.extend(true,{},this.options,this._getCreateOptions(),b);var f=this;this.element.bind("remove."+this.widgetName,function(){f.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(b,g){var f=b;if(arguments.length===0){return a.extend({},this.options)}if(typeof b==="string"){if(g===e){return this.options[b]}f={};f[b]=g}this._setOptions(f);return this},_setOptions:function(b){var f=this;a.each(b,function(h,g){f._setOption(h,g)});return this},_setOption:function(b,f){this.options[b]=f;if(b==="disabled"){this.widget()[f?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",f)}return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(b,j,i){var h=this.options[b];j=a.Event(j);j.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase();i=i||{};if(j.originalEvent){b=a.event.props.length;for(var g;b;){g=a.event.props[--b];j[g]=j.originalEvent[g]}}this.element.trigger(j,i);return !(a.isFunction(h)&&h.call(this.element[0],j,i)===false||j.isDefaultPrevented())}}})(jQuery);
/*!
 * jQuery UI Mouse 1.8.9
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(a){a.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var b=this;this.element.bind("mousedown."+this.widgetName,function(c){return b._mouseDown(c)}).bind("click."+this.widgetName,function(c){if(true===a.data(c.target,b.widgetName+".preventClickEvent")){a.removeData(c.target,b.widgetName+".preventClickEvent");c.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(d){d.originalEvent=d.originalEvent||{};if(!d.originalEvent.mouseHandled){this._mouseStarted&&this._mouseUp(d);this._mouseDownEvent=d;var c=this,h=d.which==1,g=typeof this.options.cancel=="string"?a(d.target).parents().add(d.target).filter(this.options.cancel).length:false;if(!h||g||!this._mouseCapture(d)){return true}this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){c.mouseDelayMet=true},this.options.delay)}if(this._mouseDistanceMet(d)&&this._mouseDelayMet(d)){this._mouseStarted=this._mouseStart(d)!==false;if(!this._mouseStarted){d.preventDefault();return true}}this._mouseMoveDelegate=function(b){return c._mouseMove(b)};this._mouseUpDelegate=function(b){return c._mouseUp(b)};a(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);d.preventDefault();return d.originalEvent.mouseHandled=true}},_mouseMove:function(b){if(a.browser.msie&&!(document.documentMode>=9)&&!b.button){return this._mouseUp(b)}if(this._mouseStarted){this._mouseDrag(b);return b.preventDefault()}if(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)){(this._mouseStarted=this._mouseStart(this._mouseDownEvent,b)!==false)?this._mouseDrag(b):this._mouseUp(b)}return !this._mouseStarted},_mouseUp:function(b){a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;b.target==this._mouseDownEvent.target&&a.data(b.target,this.widgetName+".preventClickEvent",true);this._mouseStop(b)}return false},_mouseDistanceMet:function(b){return Math.max(Math.abs(this._mouseDownEvent.pageX-b.pageX),Math.abs(this._mouseDownEvent.pageY-b.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);(function(a){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))){this.element[0].style.position="relative"}this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(d){var c=this.options;if(this.helper||c.disabled||a(d.target).is(".ui-resizable-handle")){return false}this.handle=this._getHandle(d);if(!this.handle){return false}return true},_mouseStart:function(d){var c=this.options;this.helper=this._createHelper(d);this._cacheHelperProportions();if(a.ui.ddmanager){a.ui.ddmanager.current=this}this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};a.extend(this.offset,{click:{left:d.pageX-this.offset.left,top:d.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(d);this.originalPageX=d.pageX;this.originalPageY=d.pageY;c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt);c.containment&&this._setContainment();if(this._trigger("start",d)===false){this._clear();return false}this._cacheHelperProportions();a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,d);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(d,true);return true},_mouseDrag:function(d,c){this.position=this._generatePosition(d);this.positionAbs=this._convertPositionTo("absolute");if(!c){c=this._uiHash();if(this._trigger("drag",d,c)===false){this._mouseUp({});return false}this.position=c.position}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}a.ui.ddmanager&&a.ui.ddmanager.drag(this,d);return false},_mouseStop:function(e){var d=false;if(a.ui.ddmanager&&!this.options.dropBehaviour){d=a.ui.ddmanager.drop(this,e)}if(this.dropped){d=this.dropped;this.dropped=false}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original"){return false}if(this.options.revert=="invalid"&&!d||this.options.revert=="valid"&&d||this.options.revert===true||a.isFunction(this.options.revert)&&this.options.revert.call(this.element,d)){var f=this;a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){f._trigger("stop",e)!==false&&f._clear()})}else{this._trigger("stop",e)!==false&&this._clear()}return false},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(d){var c=!this.options.handle||!a(this.options.handle,this.element).length?true:false;a(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==d.target){c=true}});return c},_createHelper:function(d){var c=this.options;d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[d])):c.helper=="clone"?this.element.clone():this.element;d.parents("body").length||d.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo);d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute");return d},_adjustOffsetFromHelper:function(b){if(typeof b=="string"){b=b.split(" ")}if(a.isArray(b)){b={left:+b[0],top:+b[1]||0}}if("left" in b){this.offset.click.left=b.left+this.margins.left}if("right" in b){this.offset.click.left=this.helperProportions.width-b.right+this.margins.left}if("top" in b){this.offset.click.top=b.top+this.margins.top}if("bottom" in b){this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])){b.left+=this.scrollParent.scrollLeft();b.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie){b={top:0,left:0}}return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var b=this.element.position();return{top:b.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:b.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e=this.options;if(e.containment=="parent"){e.containment=this.helper[0].parentNode}if(e.containment=="document"||e.containment=="window"){this.containment=[(e.containment=="document"?0:a(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(e.containment=="document"?0:a(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(e.containment=="document"?0:a(window).scrollLeft())+a(e.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(e.containment=="document"?0:a(window).scrollTop())+(a(e.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!/^(document|window|parent)$/.test(e.containment)&&e.containment.constructor!=Array){var d=a(e.containment)[0];if(d){e=a(e.containment).offset();var f=a(d).css("overflow")!="hidden";this.containment=[e.left+(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0)-this.margins.left,e.top+(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0)-this.margins.top,e.left+(f?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,e.top+(f?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}}else{if(e.containment.constructor==Array){this.containment=e.containment}}},_convertPositionTo:function(e,d){if(!d){d=this.position}e=e=="absolute"?1:-1;var h=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(h[0].tagName);return{top:d.top+this.offset.relative.top*e+this.offset.parent.top*e-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:h.scrollTop())*e),left:d.left+this.offset.relative.left*e+this.offset.parent.left*e-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:h.scrollLeft())*e)}},_generatePosition:function(h){var d=this.options,l=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,j=/(html|body)/i.test(l[0].tagName),k=h.pageX,i=h.pageY;if(this.originalPosition){if(this.containment){if(h.pageX-this.offset.click.left<this.containment[0]){k=this.containment[0]+this.offset.click.left}if(h.pageY-this.offset.click.top<this.containment[1]){i=this.containment[1]+this.offset.click.top}if(h.pageX-this.offset.click.left>this.containment[2]){k=this.containment[2]+this.offset.click.left}if(h.pageY-this.offset.click.top>this.containment[3]){i=this.containment[3]+this.offset.click.top}}if(d.grid){i=this.originalPageY+Math.round((i-this.originalPageY)/d.grid[1])*d.grid[1];i=this.containment?!(i-this.offset.click.top<this.containment[1]||i-this.offset.click.top>this.containment[3])?i:!(i-this.offset.click.top<this.containment[1])?i-d.grid[1]:i+d.grid[1]:i;k=this.originalPageX+Math.round((k-this.originalPageX)/d.grid[0])*d.grid[0];k=this.containment?!(k-this.offset.click.left<this.containment[0]||k-this.offset.click.left>this.containment[2])?k:!(k-this.offset.click.left<this.containment[0])?k-d.grid[0]:k+d.grid[0]:k}}return{top:i-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():j?0:l.scrollTop()),left:k-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():j?0:l.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(e,d,f){f=f||this._uiHash();a.ui.plugin.call(this,e,[d,f]);if(e=="drag"){this.positionAbs=this._convertPositionTo("absolute")}return a.Widget.prototype._trigger.call(this,e,d,f)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});a.extend(a.ui.draggable,{version:"1.8.9"});a.ui.plugin.add("draggable","connectToSortable",{start:function(g,d){var j=a(this).data("draggable"),h=j.options,i=a.extend({},d,{item:j.element});j.sortables=[];a(h.connectToSortable).each(function(){var b=a.data(this,"sortable");if(b&&!b.options.disabled){j.sortables.push({instance:b,shouldRevert:b.options.revert});b._refreshItems();b._trigger("activate",g,i)}})},stop:function(e,d){var h=a(this).data("draggable"),g=a.extend({},d,{item:h.element});a.each(h.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;h.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert){this.instance.options.revert=true}this.instance._mouseStop(e);this.instance.options.helper=this.instance.options._helper;h.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",e,g)}})},drag:function(e,d){var h=a(this).data("draggable"),g=this;a.each(h.sortables,function(){this.instance.positionAbs=h.positionAbs;this.instance.helperProportions=h.helperProportions;this.instance.offset.click=h.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=a(g).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return d.helper[0]};e.target=this.instance.currentItem[0];this.instance._mouseCapture(e,true);this.instance._mouseStart(e,true,true);this.instance.offset.click.top=h.offset.click.top;this.instance.offset.click.left=h.offset.click.left;this.instance.offset.parent.left-=h.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=h.offset.parent.top-this.instance.offset.parent.top;h._trigger("toSortable",e);h.dropped=this.instance.element;h.currentItem=h.element;this.instance.fromOutside=h}this.instance.currentItem&&this.instance._mouseDrag(e)}else{if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",e,this.instance._uiHash(this.instance));this.instance._mouseStop(e,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();h._trigger("fromSortable",e);h.dropped=false}}})}});a.ui.plugin.add("draggable","cursor",{start:function(){var d=a("body"),c=a(this).data("draggable").options;if(d.css("cursor")){c._cursor=d.css("cursor")}d.css("cursor",c.cursor)},stop:function(){var b=a(this).data("draggable").options;b._cursor&&a("body").css("cursor",b._cursor)}});a.ui.plugin.add("draggable","iframeFix",{start:function(){var b=a(this).data("draggable").options;a(b.iframeFix===true?"iframe":b.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(a(this).offset()).appendTo("body")})},stop:function(){a("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}});a.ui.plugin.add("draggable","opacity",{start:function(d,c){d=a(c.helper);c=a(this).data("draggable").options;if(d.css("opacity")){c._opacity=d.css("opacity")}d.css("opacity",c.opacity)},stop:function(d,c){d=a(this).data("draggable").options;d._opacity&&a(c.helper).css("opacity",d._opacity)}});a.ui.plugin.add("draggable","scroll",{start:function(){var b=a(this).data("draggable");if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){b.overflowOffset=b.scrollParent.offset()}},drag:function(e){var d=a(this).data("draggable"),h=d.options,g=false;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!h.axis||h.axis!="x"){if(d.overflowOffset.top+d.scrollParent[0].offsetHeight-e.pageY<h.scrollSensitivity){d.scrollParent[0].scrollTop=g=d.scrollParent[0].scrollTop+h.scrollSpeed}else{if(e.pageY-d.overflowOffset.top<h.scrollSensitivity){d.scrollParent[0].scrollTop=g=d.scrollParent[0].scrollTop-h.scrollSpeed}}}if(!h.axis||h.axis!="y"){if(d.overflowOffset.left+d.scrollParent[0].offsetWidth-e.pageX<h.scrollSensitivity){d.scrollParent[0].scrollLeft=g=d.scrollParent[0].scrollLeft+h.scrollSpeed}else{if(e.pageX-d.overflowOffset.left<h.scrollSensitivity){d.scrollParent[0].scrollLeft=g=d.scrollParent[0].scrollLeft-h.scrollSpeed}}}}else{if(!h.axis||h.axis!="x"){if(e.pageY-a(document).scrollTop()<h.scrollSensitivity){g=a(document).scrollTop(a(document).scrollTop()-h.scrollSpeed)}else{if(a(window).height()-(e.pageY-a(document).scrollTop())<h.scrollSensitivity){g=a(document).scrollTop(a(document).scrollTop()+h.scrollSpeed)}}}if(!h.axis||h.axis!="y"){if(e.pageX-a(document).scrollLeft()<h.scrollSensitivity){g=a(document).scrollLeft(a(document).scrollLeft()-h.scrollSpeed)}else{if(a(window).width()-(e.pageX-a(document).scrollLeft())<h.scrollSensitivity){g=a(document).scrollLeft(a(document).scrollLeft()+h.scrollSpeed)}}}}g!==false&&a.ui.ddmanager&&!h.dropBehaviour&&a.ui.ddmanager.prepareOffsets(d,e)}});a.ui.plugin.add("draggable","snap",{start:function(){var d=a(this).data("draggable"),c=d.options;d.snapElements=[];a(c.snap.constructor!=String?c.snap.items||":data(draggable)":c.snap).each(function(){var e=a(this),b=e.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:b.top,left:b.left})})},drag:function(L,K){for(var J=a(this).data("draggable"),H=J.options,I=H.snapTolerance,G=K.offset.left,z=G+J.helperProportions.width,A=K.offset.top,y=A+J.helperProportions.height,F=J.snapElements.length-1;F>=0;F--){var E=J.snapElements[F].left,C=E+J.snapElements[F].width,D=J.snapElements[F].top,B=D+J.snapElements[F].height;if(E-I<G&&G<C+I&&D-I<A&&A<B+I||E-I<G&&G<C+I&&D-I<y&&y<B+I||E-I<z&&z<C+I&&D-I<A&&A<B+I||E-I<z&&z<C+I&&D-I<y&&y<B+I){if(H.snapMode!="inner"){var x=Math.abs(D-y)<=I,w=Math.abs(B-A)<=I,v=Math.abs(E-z)<=I,u=Math.abs(C-G)<=I;if(x){K.position.top=J._convertPositionTo("relative",{top:D-J.helperProportions.height,left:0}).top-J.margins.top}if(w){K.position.top=J._convertPositionTo("relative",{top:B,left:0}).top-J.margins.top}if(v){K.position.left=J._convertPositionTo("relative",{top:0,left:E-J.helperProportions.width}).left-J.margins.left}if(u){K.position.left=J._convertPositionTo("relative",{top:0,left:C}).left-J.margins.left}}var d=x||w||v||u;if(H.snapMode!="outer"){x=Math.abs(D-A)<=I;w=Math.abs(B-y)<=I;v=Math.abs(E-G)<=I;u=Math.abs(C-z)<=I;if(x){K.position.top=J._convertPositionTo("relative",{top:D,left:0}).top-J.margins.top}if(w){K.position.top=J._convertPositionTo("relative",{top:B-J.helperProportions.height,left:0}).top-J.margins.top}if(v){K.position.left=J._convertPositionTo("relative",{top:0,left:E}).left-J.margins.left}if(u){K.position.left=J._convertPositionTo("relative",{top:0,left:C-J.helperProportions.width}).left-J.margins.left}}if(!J.snapElements[F].snapping&&(x||w||v||u||d)){J.options.snap.snap&&J.options.snap.snap.call(J.element,L,a.extend(J._uiHash(),{snapItem:J.snapElements[F].item}))}J.snapElements[F].snapping=x||w||v||u||d}else{J.snapElements[F].snapping&&J.options.snap.release&&J.options.snap.release.call(J.element,L,a.extend(J._uiHash(),{snapItem:J.snapElements[F].item}));J.snapElements[F].snapping=false}}}});a.ui.plugin.add("draggable","stack",{start:function(){var d=a(this).data("draggable").options;d=a.makeArray(a(d.stack)).sort(function(e,b){return(parseInt(a(e).css("zIndex"),10)||0)-(parseInt(a(b).css("zIndex"),10)||0)});if(d.length){var c=parseInt(d[0].style.zIndex)||0;a(d).each(function(b){this.style.zIndex=c+b});this[0].style.zIndex=c+d.length}}});a.ui.plugin.add("draggable","zIndex",{start:function(d,c){d=a(c.helper);c=a(this).data("draggable").options;if(d.css("zIndex")){c._zIndex=d.css("zIndex")}d.css("zIndex",c.zIndex)},stop:function(d,c){d=a(this).data("draggable").options;d._zIndex&&a(c.helper).css("zIndex",d._zIndex)}})})(jQuery);(function(a){a.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var d=this.options,c=d.accept;this.isover=0;this.isout=1;this.accept=a.isFunction(c)?c:function(b){return b.is(c)};this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};a.ui.ddmanager.droppables[d.scope]=a.ui.ddmanager.droppables[d.scope]||[];a.ui.ddmanager.droppables[d.scope].push(this);d.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){for(var d=a.ui.ddmanager.droppables[this.options.scope],c=0;c<d.length;c++){d[c]==this&&d.splice(c,1)}this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");return this},_setOption:function(d,c){if(d=="accept"){this.accept=a.isFunction(c)?c:function(b){return b.is(c)}}a.Widget.prototype._setOption.apply(this,arguments)},_activate:function(d){var c=a.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass);c&&this._trigger("activate",d,this.ui(c))},_deactivate:function(d){var c=a.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass);c&&this._trigger("deactivate",d,this.ui(c))},_over:function(d){var c=a.ui.ddmanager.current;if(!(!c||(c.currentItem||c.element)[0]==this.element[0])){if(this.accept.call(this.element[0],c.currentItem||c.element)){this.options.hoverClass&&this.element.addClass(this.options.hoverClass);this._trigger("over",d,this.ui(c))}}},_out:function(d){var c=a.ui.ddmanager.current;if(!(!c||(c.currentItem||c.element)[0]==this.element[0])){if(this.accept.call(this.element[0],c.currentItem||c.element)){this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("out",d,this.ui(c))}}},_drop:function(f,d){var h=d||a.ui.ddmanager.current;if(!h||(h.currentItem||h.element)[0]==this.element[0]){return false}var g=false;this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var b=a.data(this,"droppable");if(b.options.greedy&&!b.options.disabled&&b.options.scope==h.options.scope&&b.accept.call(b.element[0],h.currentItem||h.element)&&a.ui.intersect(h,a.extend(b,{offset:b.element.offset()}),b.options.tolerance)){g=true;return false}});if(g){return false}if(this.accept.call(this.element[0],h.currentItem||h.element)){this.options.activeClass&&this.element.removeClass(this.options.activeClass);this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("drop",f,this.ui(h));return this.element}return false},ui:function(b){return{draggable:b.currentItem||b.element,helper:b.helper,position:b.position,offset:b.positionAbs}}});a.extend(a.ui.droppable,{version:"1.8.9"});a.ui.intersect=function(v,u,t){if(!u.offset){return false}var s=(v.positionAbs||v.position.absolute).left,q=s+v.helperProportions.width,r=(v.positionAbs||v.position.absolute).top,p=r+v.helperProportions.height,o=u.offset.left,m=o+u.proportions.width,n=u.offset.top,d=n+u.proportions.height;switch(t){case"fit":return o<=s&&q<=m&&n<=r&&p<=d;case"intersect":return o<s+v.helperProportions.width/2&&q-v.helperProportions.width/2<m&&n<r+v.helperProportions.height/2&&p-v.helperProportions.height/2<d;case"pointer":return a.ui.isOver((v.positionAbs||v.position.absolute).top+(v.clickOffset||v.offset.click).top,(v.positionAbs||v.position.absolute).left+(v.clickOffset||v.offset.click).left,n,o,u.proportions.height,u.proportions.width);case"touch":return(r>=n&&r<=d||p>=n&&p<=d||r<n&&p>d)&&(s>=o&&s<=m||q>=o&&q<=m||s<o&&q>m);default:return false}};a.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(i,d){var n=a.ui.ddmanager.droppables[i.options.scope]||[],m=d?d.type:null,k=(i.currentItem||i.element).find(":data(droppable)").andSelf(),l=0;i:for(;l<n.length;l++){if(!(n[l].options.disabled||i&&!n[l].accept.call(n[l].element[0],i.currentItem||i.element))){for(var j=0;j<k.length;j++){if(k[j]==n[l].element[0]){n[l].proportions.height=0;continue i}}n[l].visible=n[l].element.css("display")!="none";if(n[l].visible){n[l].offset=n[l].element.offset();n[l].proportions={width:n[l].element[0].offsetWidth,height:n[l].element[0].offsetHeight};m=="mousedown"&&n[l]._activate.call(n[l],d)}}}},drop:function(e,d){var f=false;a.each(a.ui.ddmanager.droppables[e.options.scope]||[],function(){if(this.options){if(!this.options.disabled&&this.visible&&a.ui.intersect(e,this,this.options.tolerance)){f=f||this._drop.call(this,d)}if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)){this.isout=1;this.isover=0;this._deactivate.call(this,d)}}});return f},drag:function(d,c){d.options.refreshPositions&&a.ui.ddmanager.prepareOffsets(d,c);a.each(a.ui.ddmanager.droppables[d.options.scope]||[],function(){if(!(this.options.disabled||this.greedyChild||!this.visible)){var h=a.ui.intersect(d,this,this.options.tolerance);if(h=!h&&this.isover==1?"isout":h&&this.isover==0?"isover":null){var f;if(this.options.greedy){var b=this.element.parents(":data(droppable):eq(0)");if(b.length){f=a.data(b[0],"droppable");f.greedyChild=h=="isover"?1:0}}if(f&&h=="isover"){f.isover=0;f.isout=1;f._out.call(f,c)}this[h]=1;this[h=="isout"?"isover":"isout"]=0;this[h=="isover"?"_over":"_out"].call(this,c);if(f&&h=="isout"){f.isout=0;f.isover=1;f._over.call(f,c)}}}})}}})(jQuery);jQuery.effects||function(l,i){function e(j){var f;if(j&&j.constructor==Array&&j.length==3){return j}if(f=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(j)){return[parseInt(f[1],10),parseInt(f[2],10),parseInt(f[3],10)]}if(f=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(j)){return[parseFloat(f[1])*2.55,parseFloat(f[2])*2.55,parseFloat(f[3])*2.55]}if(f=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(j)){return[parseInt(f[1],16),parseInt(f[2],16),parseInt(f[3],16)]}if(f=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(j)){return[parseInt(f[1]+f[1],16),parseInt(f[2]+f[2],16),parseInt(f[3]+f[3],16)]}if(/rgba\(0, 0, 0, 0\)/.exec(j)){return d.transparent}return d[l.trim(j).toLowerCase()]}function x(k,j){var f;do{f=l.curCSS(k,j);if(f!=""&&f!="transparent"||l.nodeName(k,"body")){break}j="backgroundColor"}while(k=k.parentNode);return e(f)}function c(){var n=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,j={},f,m;if(n&&n.length&&n[0]&&n[n[0]]){for(var k=n.length;k--;){f=n[k];if(typeof n[f]=="string"){m=f.replace(/\-(\w)/g,function(p,o){return o.toUpperCase()});j[m]=n[f]}}}else{for(f in n){if(typeof n[f]==="string"){j[f]=n[f]}}}return j}function b(k){var j,f;for(j in k){f=k[j];if(f==null||l.isFunction(f)||j in w||/scrollbar/.test(j)||!/color/i.test(j)&&isNaN(parseFloat(f))){delete k[j]}}return k}function v(m,j){var f={_:0},k;for(k in j){if(m[k]!=j[k]){f[k]=j[k]}}return f}function h(m,j,f,k){if(typeof m=="object"){k=j;f=null;j=m;m=j.effect}if(l.isFunction(j)){k=j;f=null;j={}}if(typeof j=="number"||l.fx.speeds[j]){k=f;f=j;j={}}if(l.isFunction(f)){k=f;f=null}j=j||{};f=f||j.duration;f=l.fx.off?0:typeof f=="number"?f:f in l.fx.speeds?l.fx.speeds[f]:l.fx.speeds._default;k=k||j.complete;return[m,j,f,k]}function g(f){if(!f||typeof f==="number"||l.fx.speeds[f]){return true}if(typeof f==="string"&&!l.effects[f]){return true}return false}l.effects={};l.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","borderColor","color","outlineColor"],function(j,f){l.fx.step[f]=function(k){if(!k.colorInit){k.start=x(k.elem,f);k.end=e(k.end);k.colorInit=true}k.elem.style[f]="rgb("+Math.max(Math.min(parseInt(k.pos*(k.end[0]-k.start[0])+k.start[0],10),255),0)+","+Math.max(Math.min(parseInt(k.pos*(k.end[1]-k.start[1])+k.start[1],10),255),0)+","+Math.max(Math.min(parseInt(k.pos*(k.end[2]-k.start[2])+k.start[2],10),255),0)+")"}});var d={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},a=["add","remove","toggle"],w={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};l.effects.animateClass=function(m,j,f,k){if(l.isFunction(f)){k=f;f=null}return this.queue("fx",function(){var r=l(this),q=r.attr("style")||" ",p=b(c.call(this)),n,o=r.attr("className");l.each(a,function(s,t){m[t]&&r[t+"Class"](m[t])});n=b(c.call(this));r.attr("className",o);r.animate(v(p,n),j,f,function(){l.each(a,function(s,t){m[t]&&r[t+"Class"](m[t])});if(typeof r.attr("style")=="object"){r.attr("style").cssText="";r.attr("style").cssText=q}else{r.attr("style",q)}k&&k.apply(this,arguments)});p=l.queue(this);n=p.splice(p.length-1,1)[0];p.splice(1,0,n);l.dequeue(this)})};l.fn.extend({_addClass:l.fn.addClass,addClass:function(m,j,f,k){return j?l.effects.animateClass.apply(this,[{add:m},j,f,k]):this._addClass(m)},_removeClass:l.fn.removeClass,removeClass:function(m,j,f,k){return j?l.effects.animateClass.apply(this,[{remove:m},j,f,k]):this._removeClass(m)},_toggleClass:l.fn.toggleClass,toggleClass:function(n,j,f,m,k){return typeof j=="boolean"||j===i?f?l.effects.animateClass.apply(this,[j?{add:n}:{remove:n},f,m,k]):this._toggleClass(n,j):l.effects.animateClass.apply(this,[{toggle:n},j,f,m])},switchClass:function(n,j,f,m,k){return l.effects.animateClass.apply(this,[{add:j,remove:n},f,m,k])}});l.extend(l.effects,{version:"1.8.9",save:function(k,j){for(var f=0;f<j.length;f++){j[f]!==null&&k.data("ec.storage."+j[f],k[0].style[j[f]])}},restore:function(k,j){for(var f=0;f<j.length;f++){j[f]!==null&&k.css(j[f],k.data("ec.storage."+j[f]))}},setMode:function(j,f){if(f=="toggle"){f=j.is(":hidden")?"show":"hide"}return f},getBaseline:function(k,j){var f;switch(k[0]){case"top":f=0;break;case"middle":f=0.5;break;case"bottom":f=1;break;default:f=k[0]/j.height}switch(k[1]){case"left":k=0;break;case"center":k=0.5;break;case"right":k=1;break;default:k=k[1]/j.width}return{x:k,y:f}},createWrapper:function(k){if(k.parent().is(".ui-effects-wrapper")){return k.parent()}var j={width:k.outerWidth(true),height:k.outerHeight(true),"float":k.css("float")},f=l("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0});k.wrap(f);f=k.parent();if(k.css("position")=="static"){f.css({position:"relative"});k.css({position:"relative"})}else{l.extend(j,{position:k.css("position"),zIndex:k.css("z-index")});l.each(["top","left","bottom","right"],function(n,m){j[m]=k.css(m);if(isNaN(parseInt(j[m],10))){j[m]="auto"}});k.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})}return f.css(j).show()},removeWrapper:function(f){if(f.parent().is(".ui-effects-wrapper")){return f.parent().replaceWith(f)}return f},setTransition:function(m,j,f,k){k=k||{};l.each(j,function(o,n){unit=m.cssUnit(n);if(unit[0]>0){k[n]=unit[0]*f+unit[1]}});return k}});l.fn.extend({effect:function(m){var j=h.apply(this,arguments),f={options:j[1],duration:j[2],callback:j[3]};j=f.options.mode;var k=l.effects[m];if(l.fx.off||!k){return j?this[j](f.duration,f.callback):this.each(function(){f.callback&&f.callback.call(this)})}return k.call(this,f)},_show:l.fn.show,show:function(j){if(g(j)){return this._show.apply(this,arguments)}else{var f=h.apply(this,arguments);f[1].mode="show";return this.effect.apply(this,f)}},_hide:l.fn.hide,hide:function(j){if(g(j)){return this._hide.apply(this,arguments)}else{var f=h.apply(this,arguments);f[1].mode="hide";return this.effect.apply(this,f)}},__toggle:l.fn.toggle,toggle:function(j){if(g(j)||typeof j==="boolean"||l.isFunction(j)){return this.__toggle.apply(this,arguments)}else{var f=h.apply(this,arguments);f[1].mode="toggle";return this.effect.apply(this,f)}},cssUnit:function(k){var j=this.css(k),f=[];l.each(["em","px","%","pt"],function(n,m){if(j.indexOf(m)>0){f=[parseFloat(j),m]}});return f}});l.easing.jswing=l.easing.swing;l.extend(l.easing,{def:"easeOutQuad",swing:function(n,j,f,m,k){return l.easing[l.easing.def](n,j,f,m,k)},easeInQuad:function(n,j,f,m,k){return m*(j/=k)*j+f},easeOutQuad:function(n,j,f,m,k){return -m*(j/=k)*(j-2)+f},easeInOutQuad:function(n,j,f,m,k){if((j/=k/2)<1){return m/2*j*j+f}return -m/2*(--j*(j-2)-1)+f},easeInCubic:function(n,j,f,m,k){return m*(j/=k)*j*j+f},easeOutCubic:function(n,j,f,m,k){return m*((j=j/k-1)*j*j+1)+f},easeInOutCubic:function(n,j,f,m,k){if((j/=k/2)<1){return m/2*j*j*j+f}return m/2*((j-=2)*j*j+2)+f},easeInQuart:function(n,j,f,m,k){return m*(j/=k)*j*j*j+f},easeOutQuart:function(n,j,f,m,k){return -m*((j=j/k-1)*j*j*j-1)+f},easeInOutQuart:function(n,j,f,m,k){if((j/=k/2)<1){return m/2*j*j*j*j+f}return -m/2*((j-=2)*j*j*j-2)+f},easeInQuint:function(n,j,f,m,k){return m*(j/=k)*j*j*j*j+f},easeOutQuint:function(n,j,f,m,k){return m*((j=j/k-1)*j*j*j*j+1)+f},easeInOutQuint:function(n,j,f,m,k){if((j/=k/2)<1){return m/2*j*j*j*j*j+f}return m/2*((j-=2)*j*j*j*j+2)+f},easeInSine:function(n,j,f,m,k){return -m*Math.cos(j/k*(Math.PI/2))+m+f},easeOutSine:function(n,j,f,m,k){return m*Math.sin(j/k*(Math.PI/2))+f},easeInOutSine:function(n,j,f,m,k){return -m/2*(Math.cos(Math.PI*j/k)-1)+f},easeInExpo:function(n,j,f,m,k){return j==0?f:m*Math.pow(2,10*(j/k-1))+f},easeOutExpo:function(n,j,f,m,k){return j==k?f+m:m*(-Math.pow(2,-10*j/k)+1)+f},easeInOutExpo:function(n,j,f,m,k){if(j==0){return f}if(j==k){return f+m}if((j/=k/2)<1){return m/2*Math.pow(2,10*(j-1))+f}return m/2*(-Math.pow(2,-10*--j)+2)+f},easeInCirc:function(n,j,f,m,k){return -m*(Math.sqrt(1-(j/=k)*j)-1)+f},easeOutCirc:function(n,j,f,m,k){return m*Math.sqrt(1-(j=j/k-1)*j)+f},easeInOutCirc:function(n,j,f,m,k){if((j/=k/2)<1){return -m/2*(Math.sqrt(1-j*j)-1)+f}return m/2*(Math.sqrt(1-(j-=2)*j)+1)+f},easeInElastic:function(p,j,f,o,n){p=1.70158;var m=0,k=o;if(j==0){return f}if((j/=n)==1){return f+o}m||(m=n*0.3);if(k<Math.abs(o)){k=o;p=m/4}else{p=m/(2*Math.PI)*Math.asin(o/k)}return -(k*Math.pow(2,10*(j-=1))*Math.sin((j*n-p)*2*Math.PI/m))+f},easeOutElastic:function(p,j,f,o,n){p=1.70158;var m=0,k=o;if(j==0){return f}if((j/=n)==1){return f+o}m||(m=n*0.3);if(k<Math.abs(o)){k=o;p=m/4}else{p=m/(2*Math.PI)*Math.asin(o/k)}return k*Math.pow(2,-10*j)*Math.sin((j*n-p)*2*Math.PI/m)+o+f},easeInOutElastic:function(p,j,f,o,n){p=1.70158;var m=0,k=o;if(j==0){return f}if((j/=n/2)==2){return f+o}m||(m=n*0.3*1.5);if(k<Math.abs(o)){k=o;p=m/4}else{p=m/(2*Math.PI)*Math.asin(o/k)}if(j<1){return -0.5*k*Math.pow(2,10*(j-=1))*Math.sin((j*n-p)*2*Math.PI/m)+f}return k*Math.pow(2,-10*(j-=1))*Math.sin((j*n-p)*2*Math.PI/m)*0.5+o+f},easeInBack:function(o,j,f,n,m,k){if(k==i){k=1.70158}return n*(j/=m)*j*((k+1)*j-k)+f},easeOutBack:function(o,j,f,n,m,k){if(k==i){k=1.70158}return n*((j=j/m-1)*j*((k+1)*j+k)+1)+f},easeInOutBack:function(o,j,f,n,m,k){if(k==i){k=1.70158}if((j/=m/2)<1){return n/2*j*j*(((k*=1.525)+1)*j-k)+f}return n/2*((j-=2)*j*(((k*=1.525)+1)*j+k)+2)+f},easeInBounce:function(n,j,f,m,k){return m-l.easing.easeOutBounce(n,k-j,0,m,k)+f},easeOutBounce:function(n,j,f,m,k){return(j/=k)<1/2.75?m*7.5625*j*j+f:j<2/2.75?m*(7.5625*(j-=1.5/2.75)*j+0.75)+f:j<2.5/2.75?m*(7.5625*(j-=2.25/2.75)*j+0.9375)+f:m*(7.5625*(j-=2.625/2.75)*j+0.984375)+f},easeInOutBounce:function(n,j,f,m,k){if(j<k/2){return l.easing.easeInBounce(n,j*2,0,m,k)*0.5+f}return l.easing.easeOutBounce(n,j*2-k,0,m,k)*0.5+m*0.5+f}})}(jQuery);(function(a){a.effects.blind=function(b){return this.queue(function(){var c=a(this),l=["position","top","bottom","left","right"],m=a.effects.setMode(c,b.options.mode||"hide"),o=b.options.direction||"vertical";a.effects.save(c,l);c.show();var n=a.effects.createWrapper(c).css({overflow:"hidden"}),k=o=="vertical"?"height":"width";o=o=="vertical"?n.height():n.width();m=="show"&&n.css(k,0);var j={};j[k]=m=="show"?o:0;n.animate(j,b.duration,b.options.easing,function(){m=="hide"&&c.hide();a.effects.restore(c,l);a.effects.removeWrapper(c);b.callback&&b.callback.apply(c[0],arguments);c.dequeue()})})}})(jQuery);(function(a){a.effects.bounce=function(c){return this.queue(function(){var v=a(this),e=["position","top","bottom","left","right"],q=a.effects.setMode(v,c.options.mode||"effect"),t=c.options.direction||"up",u=c.options.distance||20,b=c.options.times||5,p=c.duration||250;/show|hide/.test(q)&&e.push("opacity");a.effects.save(v,e);v.show();a.effects.createWrapper(v);var s=t=="up"||t=="down"?"top":"left";t=t=="up"||t=="left"?"pos":"neg";u=c.options.distance||(s=="top"?v.outerHeight({margin:true})/3:v.outerWidth({margin:true})/3);if(q=="show"){v.css("opacity",0).css(s,t=="pos"?-u:u)}if(q=="hide"){u/=b*2}q!="hide"&&b--;if(q=="show"){var r={opacity:1};r[s]=(t=="pos"?"+=":"-=")+u;v.animate(r,p/2,c.options.easing);u/=2;b--}for(r=0;r<b;r++){var o={},n={};o[s]=(t=="pos"?"-=":"+=")+u;n[s]=(t=="pos"?"+=":"-=")+u;v.animate(o,p/2,c.options.easing).animate(n,p/2,c.options.easing);u=q=="hide"?u*2:u/2}if(q=="hide"){r={opacity:0};r[s]=(t=="pos"?"-=":"+=")+u;v.animate(r,p/2,c.options.easing,function(){v.hide();a.effects.restore(v,e);a.effects.removeWrapper(v);c.callback&&c.callback.apply(this,arguments)})}else{o={};n={};o[s]=(t=="pos"?"-=":"+=")+u;n[s]=(t=="pos"?"+=":"-=")+u;v.animate(o,p/2,c.options.easing).animate(n,p/2,c.options.easing,function(){a.effects.restore(v,e);a.effects.removeWrapper(v);c.callback&&c.callback.apply(this,arguments)})}v.queue("fx",function(){v.dequeue()});v.dequeue()})}})(jQuery);(function(a){a.effects.clip=function(b){return this.queue(function(){var e=a(this),j=["position","top","bottom","left","right","height","width"],m=a.effects.setMode(e,b.options.mode||"hide"),o=b.options.direction||"vertical";a.effects.save(e,j);e.show();var n=a.effects.createWrapper(e).css({overflow:"hidden"});n=e[0].tagName=="IMG"?n:e;var l={size:o=="vertical"?"height":"width",position:o=="vertical"?"top":"left"};o=o=="vertical"?n.height():n.width();if(m=="show"){n.css(l.size,0);n.css(l.position,o/2)}var k={};k[l.size]=m=="show"?o:0;k[l.position]=m=="show"?0:o/2;n.animate(k,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){m=="hide"&&e.hide();a.effects.restore(e,j);a.effects.removeWrapper(e);b.callback&&b.callback.apply(e[0],arguments);e.dequeue()}})})}})(jQuery);(function(a){a.effects.drop=function(b){return this.queue(function(){var d=a(this),k=["position","top","bottom","left","right","opacity"],n=a.effects.setMode(d,b.options.mode||"hide"),c=b.options.direction||"left";a.effects.save(d,k);d.show();a.effects.createWrapper(d);var m=c=="up"||c=="down"?"top":"left";c=c=="up"||c=="left"?"pos":"neg";var l=b.options.distance||(m=="top"?d.outerHeight({margin:true})/2:d.outerWidth({margin:true})/2);if(n=="show"){d.css("opacity",0).css(m,c=="pos"?-l:l)}var j={opacity:n=="show"?1:0};j[m]=(n=="show"?c=="pos"?"+=":"-=":c=="pos"?"-=":"+=")+l;d.animate(j,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){n=="hide"&&d.hide();a.effects.restore(d,k);a.effects.removeWrapper(d);b.callback&&b.callback.apply(this,arguments);d.dequeue()}})})}})(jQuery);(function(a){a.effects.explode=function(b){return this.queue(function(){var q=b.options.pieces?Math.round(Math.sqrt(b.options.pieces)):3,p=b.options.pieces?Math.round(Math.sqrt(b.options.pieces)):3;b.options.mode=b.options.mode=="toggle"?a(this).is(":visible")?"hide":"show":b.options.mode;var j=a(this).show().css("visibility","hidden"),m=j.offset();m.top-=parseInt(j.css("marginTop"),10)||0;m.left-=parseInt(j.css("marginLeft"),10)||0;for(var l=j.outerWidth(true),k=j.outerHeight(true),o=0;o<q;o++){for(var n=0;n<p;n++){j.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-n*(l/p),top:-o*(k/q)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:l/p,height:k/q,left:m.left+n*(l/p)+(b.options.mode=="show"?(n-Math.floor(p/2))*(l/p):0),top:m.top+o*(k/q)+(b.options.mode=="show"?(o-Math.floor(q/2))*(k/q):0),opacity:b.options.mode=="show"?0:1}).animate({left:m.left+n*(l/p)+(b.options.mode=="show"?0:(n-Math.floor(p/2))*(l/p)),top:m.top+o*(k/q)+(b.options.mode=="show"?0:(o-Math.floor(q/2))*(k/q)),opacity:b.options.mode=="show"?1:0},b.duration||500)}}setTimeout(function(){b.options.mode=="show"?j.css({visibility:"visible"}):j.css({visibility:"visible"}).hide();b.callback&&b.callback.apply(j[0]);j.dequeue();a("div.ui-effects-explode").remove()},b.duration||500)})}})(jQuery);(function(a){a.effects.fade=function(b){return this.queue(function(){var f=a(this),e=a.effects.setMode(f,b.options.mode||"hide");f.animate({opacity:e},{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){b.callback&&b.callback.apply(this,arguments);f.dequeue()}})})}})(jQuery);(function(a){a.effects.fold=function(b){return this.queue(function(){var u=a(this),n=["position","top","bottom","left","right"],t=a.effects.setMode(u,b.options.mode||"hide"),q=b.options.size||15,p=!!b.options.horizFirst,m=b.duration?b.duration/2:a.fx.speeds._default/2;a.effects.save(u,n);u.show();var s=a.effects.createWrapper(u).css({overflow:"hidden"}),r=t=="show"!=p,c=r?["width","height"]:["height","width"];r=r?[s.width(),s.height()]:[s.height(),s.width()];var o=/([0-9]+)%/.exec(q);if(o){q=parseInt(o[1],10)/100*r[t=="hide"?0:1]}if(t=="show"){s.css(p?{height:0,width:q}:{height:q,width:0})}p={};o={};p[c[0]]=t=="show"?r[0]:q;o[c[1]]=t=="show"?r[1]:0;s.animate(p,m,b.options.easing).animate(o,m,b.options.easing,function(){t=="hide"&&u.hide();a.effects.restore(u,n);a.effects.removeWrapper(u);b.callback&&b.callback.apply(u[0],arguments);u.dequeue()})})}})(jQuery);(function(a){a.effects.highlight=function(b){return this.queue(function(){var c=a(this),h=["backgroundImage","backgroundColor","opacity"],i=a.effects.setMode(c,b.options.mode||"show"),g={backgroundColor:c.css("backgroundColor")};if(i=="hide"){g.opacity=0}a.effects.save(c,h);c.show().css({backgroundImage:"none",backgroundColor:b.options.color||"#ffff99"}).animate(g,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){i=="hide"&&c.hide();a.effects.restore(c,h);i=="show"&&!a.support.opacity&&this.style.removeAttribute("filter");b.callback&&b.callback.apply(this,arguments);c.dequeue()}})})}})(jQuery);(function(a){a.effects.pulsate=function(b){return this.queue(function(){var d=a(this),e=a.effects.setMode(d,b.options.mode||"show");times=(b.options.times||5)*2-1;duration=b.duration?b.duration/2:a.fx.speeds._default/2;isVisible=d.is(":visible");animateTo=0;if(!isVisible){d.css("opacity",0).show();animateTo=1}if(e=="hide"&&isVisible||e=="show"&&!isVisible){times--}for(e=0;e<times;e++){d.animate({opacity:animateTo},duration,b.options.easing);animateTo=(animateTo+1)%2}d.animate({opacity:animateTo},duration,b.options.easing,function(){animateTo==0&&d.hide();b.callback&&b.callback.apply(this,arguments)});d.queue("fx",function(){d.dequeue()}).dequeue()})}})(jQuery);(function(a){a.effects.puff=function(c){return this.queue(function(){var b=a(this),k=a.effects.setMode(b,c.options.mode||"hide"),j=parseInt(c.options.percent,10)||150,f=j/100,d={height:b.height(),width:b.width()};a.extend(c.options,{fade:true,mode:k,percent:k=="hide"?j:100,from:k=="hide"?d:{height:d.height*f,width:d.width*f}});b.effect("scale",c.options,c.duration,c.callback);b.dequeue()})};a.effects.scale=function(c){return this.queue(function(){var b=a(this),m=a.extend(true,{},c.options),k=a.effects.setMode(b,c.options.mode||"effect"),j=parseInt(c.options.percent,10)||(parseInt(c.options.percent,10)==0?0:k=="hide"?0:100),d=c.options.direction||"both",l=c.options.origin;if(k!="effect"){m.origin=l||["middle","center"];m.restore=true}l={height:b.height(),width:b.width()};b.from=c.options.from||(k=="show"?{height:0,width:0}:l);j={y:d!="horizontal"?j/100:1,x:d!="vertical"?j/100:1};b.to={height:l.height*j.y,width:l.width*j.x};if(c.options.fade){if(k=="show"){b.from.opacity=0;b.to.opacity=1}if(k=="hide"){b.from.opacity=1;b.to.opacity=0}}m.from=b.from;m.to=b.to;m.mode=k;b.effect("size",m,c.duration,c.callback);b.dequeue()})};a.effects.size=function(c){return this.queue(function(){var A=a(this),y=["position","top","bottom","left","right","width","height","overflow","opacity"],w=["position","top","bottom","left","right","overflow","opacity"],v=["width","height","overflow"],u=["fontSize"],x=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],s=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],b=a.effects.setMode(A,c.options.mode||"effect"),o=c.options.restore||false,q=c.options.scale||"both",r=c.options.origin,t={height:A.height(),width:A.width()};A.from=c.options.from||t;A.to=c.options.to||t;if(r){r=a.effects.getBaseline(r,t);A.from.top=(t.height-A.from.height)*r.y;A.from.left=(t.width-A.from.width)*r.x;A.to.top=(t.height-A.to.height)*r.y;A.to.left=(t.width-A.to.width)*r.x}var z={from:{y:A.from.height/t.height,x:A.from.width/t.width},to:{y:A.to.height/t.height,x:A.to.width/t.width}};if(q=="box"||q=="both"){if(z.from.y!=z.to.y){y=y.concat(x);A.from=a.effects.setTransition(A,x,z.from.y,A.from);A.to=a.effects.setTransition(A,x,z.to.y,A.to)}if(z.from.x!=z.to.x){y=y.concat(s);A.from=a.effects.setTransition(A,s,z.from.x,A.from);A.to=a.effects.setTransition(A,s,z.to.x,A.to)}}if(q=="content"||q=="both"){if(z.from.y!=z.to.y){y=y.concat(u);A.from=a.effects.setTransition(A,u,z.from.y,A.from);A.to=a.effects.setTransition(A,u,z.to.y,A.to)}}a.effects.save(A,o?y:w);A.show();a.effects.createWrapper(A);A.css("overflow","hidden").css(A.from);if(q=="content"||q=="both"){x=x.concat(["marginTop","marginBottom"]).concat(u);s=s.concat(["marginLeft","marginRight"]);v=y.concat(x).concat(s);A.find("*[width]").each(function(){child=a(this);o&&a.effects.save(child,v);var d={height:child.height(),width:child.width()};child.from={height:d.height*z.from.y,width:d.width*z.from.x};child.to={height:d.height*z.to.y,width:d.width*z.to.x};if(z.from.y!=z.to.y){child.from=a.effects.setTransition(child,x,z.from.y,child.from);child.to=a.effects.setTransition(child,x,z.to.y,child.to)}if(z.from.x!=z.to.x){child.from=a.effects.setTransition(child,s,z.from.x,child.from);child.to=a.effects.setTransition(child,s,z.to.x,child.to)}child.css(child.from);child.animate(child.to,c.duration,c.options.easing,function(){o&&a.effects.restore(child,v)})})}A.animate(A.to,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){A.to.opacity===0&&A.css("opacity",A.from.opacity);b=="hide"&&A.hide();a.effects.restore(A,o?y:w);a.effects.removeWrapper(A);c.callback&&c.callback.apply(this,arguments);A.dequeue()}})})}})(jQuery);(function(a){a.effects.shake=function(b){return this.queue(function(){var u=a(this),n=["position","top","bottom","left","right"];a.effects.setMode(u,b.options.mode||"effect");var t=b.options.direction||"left",s=b.options.distance||20,d=b.options.times||3,r=b.duration||b.options.duration||140;a.effects.save(u,n);u.show();a.effects.createWrapper(u);var q=t=="up"||t=="down"?"top":"left",p=t=="up"||t=="left"?"pos":"neg";t={};var o={},m={};t[q]=(p=="pos"?"-=":"+=")+s;o[q]=(p=="pos"?"+=":"-=")+s*2;m[q]=(p=="pos"?"-=":"+=")+s*2;u.animate(t,r,b.options.easing);for(s=1;s<d;s++){u.animate(o,r,b.options.easing).animate(m,r,b.options.easing)}u.animate(o,r,b.options.easing).animate(t,r/2,b.options.easing,function(){a.effects.restore(u,n);a.effects.removeWrapper(u);b.callback&&b.callback.apply(this,arguments)});u.queue("fx",function(){u.dequeue()});u.dequeue()})}})(jQuery);(function(a){a.effects.slide=function(b){return this.queue(function(){var d=a(this),k=["position","top","bottom","left","right"],m=a.effects.setMode(d,b.options.mode||"show"),c=b.options.direction||"left";a.effects.save(d,k);d.show();a.effects.createWrapper(d).css({overflow:"hidden"});var l=c=="up"||c=="down"?"top":"left";c=c=="up"||c=="left"?"pos":"neg";var n=b.options.distance||(l=="top"?d.outerHeight({margin:true}):d.outerWidth({margin:true}));if(m=="show"){d.css(l,c=="pos"?isNaN(n)?"-"+n:-n:n)}var j={};j[l]=(m=="show"?c=="pos"?"+=":"-=":c=="pos"?"-=":"+=")+n;d.animate(j,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){m=="hide"&&d.hide();a.effects.restore(d,k);a.effects.removeWrapper(d);b.callback&&b.callback.apply(this,arguments);d.dequeue()}})})}})(jQuery);(function(a){a.effects.transfer=function(b){return this.queue(function(){var e=a(this),i=a(b.options.to),h=i.offset();i={top:h.top,left:h.left,height:i.innerHeight(),width:i.innerWidth()};h=e.offset();var g=a('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(b.options.className).css({top:h.top,left:h.left,height:e.innerHeight(),width:e.innerWidth(),position:"absolute"}).animate(i,b.duration,b.options.easing,function(){g.remove();b.callback&&b.callback.apply(e[0],arguments);e.dequeue()})})}})(jQuery);(function(a,b){a.widget("ui.sortable",a.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var c=this.options;this.containerCache={};this.element.addClass("ui-sortable");this.refresh();this.floating=this.items.length?(/left|right/).test(this.items[0].item.css("float")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var c=this.items.length-1;c>=0;c--){this.items[c].item.removeData("sortable-item")}return this},_setOption:function(c,d){if(c==="disabled"){this.options[c]=d;this.widget()[d?"addClass":"removeClass"]("ui-sortable-disabled")}else{a.Widget.prototype._setOption.apply(this,arguments)}},_mouseCapture:function(f,g){if(this.reverting){return false}if(this.options.disabled||this.options.type=="static"){return false}this._refreshItems(f);var e=null,d=this,c=a(f.target).parents().each(function(){if(a.data(this,"sortable-item")==d){e=a(this);return false}});if(a.data(f.target,"sortable-item")==d){e=a(f.target)}if(!e){return false}if(this.options.handle&&!g){var h=false;a(this.options.handle,e).find("*").andSelf().each(function(){if(this==f.target){h=true}});if(!h){return false}}this.currentItem=e;this._removeCurrentsFromItems();return true},_mouseStart:function(f,g,c){var h=this.options,d=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(f);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");a.extend(this.offset,{click:{left:f.pageX-this.offset.left,top:f.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(f);this.originalPageX=f.pageX;this.originalPageY=f.pageY;(h.cursorAt&&this._adjustOffsetFromHelper(h.cursorAt));this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};if(this.helper[0]!=this.currentItem[0]){this.currentItem.hide()}this._createPlaceholder();if(h.containment){this._setContainment()}if(h.cursor){if(a("body").css("cursor")){this._storedCursor=a("body").css("cursor")}a("body").css("cursor",h.cursor)}if(h.opacity){if(this.helper.css("opacity")){this._storedOpacity=this.helper.css("opacity")}this.helper.css("opacity",h.opacity)}if(h.zIndex){if(this.helper.css("zIndex")){this._storedZIndex=this.helper.css("zIndex")}this.helper.css("zIndex",h.zIndex)}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){this.overflowOffset=this.scrollParent.offset()}this._trigger("start",f,this._uiHash());if(!this._preserveHelperProportions){this._cacheHelperProportions()}if(!c){for(var e=this.containers.length-1;e>=0;e--){this.containers[e]._trigger("activate",f,d._uiHash(this))}}if(a.ui.ddmanager){a.ui.ddmanager.current=this}if(a.ui.ddmanager&&!h.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,f)}this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(f);return true},_mouseDrag:function(g){this.position=this._generatePosition(g);this.positionAbs=this._convertPositionTo("absolute");if(!this.lastPositionAbs){this.lastPositionAbs=this.positionAbs}if(this.options.scroll){var h=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if((this.overflowOffset.top+this.scrollParent[0].offsetHeight)-g.pageY<h.scrollSensitivity){this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+h.scrollSpeed}else{if(g.pageY-this.overflowOffset.top<h.scrollSensitivity){this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-h.scrollSpeed}}if((this.overflowOffset.left+this.scrollParent[0].offsetWidth)-g.pageX<h.scrollSensitivity){this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+h.scrollSpeed}else{if(g.pageX-this.overflowOffset.left<h.scrollSensitivity){this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-h.scrollSpeed}}}else{if(g.pageY-a(document).scrollTop()<h.scrollSensitivity){c=a(document).scrollTop(a(document).scrollTop()-h.scrollSpeed)}else{if(a(window).height()-(g.pageY-a(document).scrollTop())<h.scrollSensitivity){c=a(document).scrollTop(a(document).scrollTop()+h.scrollSpeed)}}if(g.pageX-a(document).scrollLeft()<h.scrollSensitivity){c=a(document).scrollLeft(a(document).scrollLeft()-h.scrollSpeed)}else{if(a(window).width()-(g.pageX-a(document).scrollLeft())<h.scrollSensitivity){c=a(document).scrollLeft(a(document).scrollLeft()+h.scrollSpeed)}}}if(c!==false&&a.ui.ddmanager&&!h.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,g)}}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}for(var e=this.items.length-1;e>=0;e--){var f=this.items[e],d=f.item[0],j=this._intersectsWithPointer(f);if(!j){continue}if(d!=this.currentItem[0]&&this.placeholder[j==1?"next":"prev"]()[0]!=d&&!a.ui.contains(this.placeholder[0],d)&&(this.options.type=="semi-dynamic"?!a.ui.contains(this.element[0],d):true)){this.direction=j==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(f)){this._rearrange(g,f)}else{break}this._trigger("change",g,this._uiHash());break}}this._contactContainers(g);if(a.ui.ddmanager){a.ui.ddmanager.drag(this,g)}this._trigger("sort",g,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(d,e){if(!d){return}if(a.ui.ddmanager&&!this.options.dropBehaviour){a.ui.ddmanager.drop(this,d)}if(this.options.revert){var c=this;var f=c.placeholder.offset();c.reverting=true;a(this.helper).animate({left:f.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:f.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(d)})}else{this._clear(d,e)}return false},cancel:function(){var c=this;if(this.dragging){this._mouseUp({target:null});if(this.options.helper=="original"){this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else{this.currentItem.show()}for(var d=this.containers.length-1;d>=0;d--){this.containers[d]._trigger("deactivate",null,c._uiHash(this));if(this.containers[d].containerCache.over){this.containers[d]._trigger("out",null,c._uiHash(this));this.containers[d].containerCache.over=0}}}if(this.placeholder){if(this.placeholder[0].parentNode){this.placeholder[0].parentNode.removeChild(this.placeholder[0])}if(this.options.helper!="original"&&this.helper&&this.helper[0].parentNode){this.helper.remove()}a.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});if(this.domPosition.prev){a(this.domPosition.prev).after(this.currentItem)}else{a(this.domPosition.parent).prepend(this.currentItem)}}return this},serialize:function(e){var c=this._getItemsAsjQuery(e&&e.connected);var d=[];e=e||{};a(c).each(function(){var f=(a(e.item||this).attr(e.attribute||"id")||"").match(e.expression||(/(.+)[-=_](.+)/));if(f){d.push((e.key||f[1]+"[]")+"="+(e.key&&e.expression?f[1]:f[2]))}});if(!d.length&&e.key){d.push(e.key+"=")}return d.join("&")},toArray:function(e){var c=this._getItemsAsjQuery(e&&e.connected);var d=[];e=e||{};c.each(function(){d.push(a(e.item||this).attr(e.attribute||"id")||"")});return d},_intersectsWith:function(m){var e=this.positionAbs.left,d=e+this.helperProportions.width,k=this.positionAbs.top,j=k+this.helperProportions.height;var f=m.left,c=f+m.width,n=m.top,i=n+m.height;var o=this.offset.click.top,h=this.offset.click.left;var g=(k+o)>n&&(k+o)<i&&(e+h)>f&&(e+h)<c;if(this.options.tolerance=="pointer"||this.options.forcePointerForContainers||(this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>m[this.floating?"width":"height"])){return g}else{return(f<e+(this.helperProportions.width/2)&&d-(this.helperProportions.width/2)<c&&n<k+(this.helperProportions.height/2)&&j-(this.helperProportions.height/2)<i)}},_intersectsWithPointer:function(e){var f=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,e.top,e.height),d=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,e.left,e.width),h=f&&d,c=this._getDragVerticalDirection(),g=this._getDragHorizontalDirection();if(!h){return false}return this.floating?(((g&&g=="right")||c=="down")?2:1):(c&&(c=="down"?2:1))},_intersectsWithSides:function(f){var d=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,f.top+(f.height/2),f.height),e=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,f.left+(f.width/2),f.width),c=this._getDragVerticalDirection(),g=this._getDragHorizontalDirection();if(this.floating&&g){return((g=="right"&&e)||(g=="left"&&!e))}else{return c&&((c=="down"&&d)||(c=="up"&&!d))}},_getDragVerticalDirection:function(){var c=this.positionAbs.top-this.lastPositionAbs.top;return c!=0&&(c>0?"down":"up")},_getDragHorizontalDirection:function(){var c=this.positionAbs.left-this.lastPositionAbs.left;return c!=0&&(c>0?"right":"left")},refresh:function(c){this._refreshItems(c);this.refreshPositions();return this},_connectWith:function(){var c=this.options;return c.connectWith.constructor==String?[c.connectWith]:c.connectWith},_getItemsAsjQuery:function(c){var m=this;var h=[];var f=[];var k=this._connectWith();if(k&&c){for(var e=k.length-1;e>=0;e--){var l=a(k[e]);for(var d=l.length-1;d>=0;d--){var g=a.data(l[d],"sortable");if(g&&g!=this&&!g.options.disabled){f.push([a.isFunction(g.options.items)?g.options.items.call(g.element):a(g.options.items,g.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),g])}}}}f.push([a.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):a(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var e=f.length-1;e>=0;e--){f[e][0].each(function(){h.push(this)})}return a(h)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data(sortable-item)");for(var d=0;d<this.items.length;d++){for(var c=0;c<e.length;c++){if(e[c]==this.items[d].item[0]){this.items.splice(d,1)}}}},_refreshItems:function(c){this.items=[];this.containers=[this];var k=this.items;var q=this;var g=[[a.isFunction(this.options.items)?this.options.items.call(this.element[0],c,{item:this.currentItem}):a(this.options.items,this.element),this]];var m=this._connectWith();if(m){for(var f=m.length-1;f>=0;f--){var n=a(m[f]);for(var e=n.length-1;e>=0;e--){var h=a.data(n[e],"sortable");if(h&&h!=this&&!h.options.disabled){g.push([a.isFunction(h.options.items)?h.options.items.call(h.element[0],c,{item:this.currentItem}):a(h.options.items,h.element),h]);this.containers.push(h)}}}}for(var f=g.length-1;f>=0;f--){var l=g[f][1];var d=g[f][0];for(var e=0,o=d.length;e<o;e++){var p=a(d[e]);p.data("sortable-item",l);k.push({item:p,instance:l,width:0,height:0,left:0,top:0})}}},refreshPositions:function(c){if(this.offsetParent&&this.helper){this.offset.parent=this._getParentOffset()}for(var e=this.items.length-1;e>=0;e--){var f=this.items[e];var d=this.options.toleranceElement?a(this.options.toleranceElement,f.item):f.item;if(!c){f.width=d.outerWidth();f.height=d.outerHeight()}var g=d.offset();f.left=g.left;f.top=g.top}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this)}else{for(var e=this.containers.length-1;e>=0;e--){var g=this.containers[e].element.offset();this.containers[e].containerCache.left=g.left;this.containers[e].containerCache.top=g.top;this.containers[e].containerCache.width=this.containers[e].element.outerWidth();this.containers[e].containerCache.height=this.containers[e].element.outerHeight()}}return this},_createPlaceholder:function(e){var c=e||this,f=c.options;if(!f.placeholder||f.placeholder.constructor==String){var d=f.placeholder;f.placeholder={element:function(){var g=a(document.createElement(c.currentItem[0].nodeName)).addClass(d||c.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!d){g.style.visibility="hidden"}return g},update:function(g,h){if(d&&!f.forcePlaceholderSize){return}if(!h.height()){h.height(c.currentItem.innerHeight()-parseInt(c.currentItem.css("paddingTop")||0,10)-parseInt(c.currentItem.css("paddingBottom")||0,10))}if(!h.width()){h.width(c.currentItem.innerWidth()-parseInt(c.currentItem.css("paddingLeft")||0,10)-parseInt(c.currentItem.css("paddingRight")||0,10))}}}}c.placeholder=a(f.placeholder.element.call(c.element,c.currentItem));c.currentItem.after(c.placeholder);f.placeholder.update(c,c.placeholder)},_contactContainers:function(c){var e=null,l=null;for(var g=this.containers.length-1;g>=0;g--){if(a.ui.contains(this.currentItem[0],this.containers[g].element[0])){continue}if(this._intersectsWith(this.containers[g].containerCache)){if(e&&a.ui.contains(this.containers[g].element[0],e.element[0])){continue}e=this.containers[g];l=g}else{if(this.containers[g].containerCache.over){this.containers[g]._trigger("out",c,this._uiHash(this));this.containers[g].containerCache.over=0}}}if(!e){return}if(this.containers.length===1){this.containers[l]._trigger("over",c,this._uiHash(this));this.containers[l].containerCache.over=1}else{if(this.currentContainer!=this.containers[l]){var k=10000;var h=null;var d=this.positionAbs[this.containers[l].floating?"left":"top"];for(var f=this.items.length-1;f>=0;f--){if(!a.ui.contains(this.containers[l].element[0],this.items[f].item[0])){continue}var m=this.items[f][this.containers[l].floating?"left":"top"];if(Math.abs(m-d)<k){k=Math.abs(m-d);h=this.items[f]}}if(!h&&!this.options.dropOnEmpty){return}this.currentContainer=this.containers[l];h?this._rearrange(c,h,null,true):this._rearrange(c,null,this.containers[l].element,true);this._trigger("change",c,this._uiHash());this.containers[l]._trigger("change",c,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[l]._trigger("over",c,this._uiHash(this));this.containers[l].containerCache.over=1}}},_createHelper:function(d){var e=this.options;var c=a.isFunction(e.helper)?a(e.helper.apply(this.element[0],[d,this.currentItem])):(e.helper=="clone"?this.currentItem.clone():this.currentItem);if(!c.parents("body").length){a(e.appendTo!="parent"?e.appendTo:this.currentItem[0].parentNode)[0].appendChild(c[0])}if(c[0]==this.currentItem[0]){this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}}if(c[0].style.width==""||e.forceHelperSize){c.width(this.currentItem.width())}if(c[0].style.height==""||e.forceHelperSize){c.height(this.currentItem.height())}return c},_adjustOffsetFromHelper:function(c){if(typeof c=="string"){c=c.split(" ")}if(a.isArray(c)){c={left:+c[0],top:+c[1]||0}}if("left" in c){this.offset.click.left=c.left+this.margins.left}if("right" in c){this.offset.click.left=this.helperProportions.width-c.right+this.margins.left}if("top" in c){this.offset.click.top=c.top+this.margins.top}if("bottom" in c){this.offset.click.top=this.helperProportions.height-c.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var c=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])){c.left+=this.scrollParent.scrollLeft();c.top+=this.scrollParent.scrollTop()}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)){c={top:0,left:0}}return{top:c.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:c.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var c=this.currentItem.position();return{top:c.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:c.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:(parseInt(this.currentItem.css("marginLeft"),10)||0),top:(parseInt(this.currentItem.css("marginTop"),10)||0)}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var f=this.options;if(f.containment=="parent"){f.containment=this.helper[0].parentNode}if(f.containment=="document"||f.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,a(f.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a(f.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!(/^(document|window|parent)$/).test(f.containment)){var d=a(f.containment)[0];var e=a(f.containment).offset();var c=(a(d).css("overflow")!="hidden");this.containment=[e.left+(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0)-this.margins.left,e.top+(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0)-this.margins.top,e.left+(c?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,e.top+(c?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(g,i){if(!i){i=this.position}var e=g=="absolute"?1:-1;var f=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,h=(/(html|body)/i).test(c[0].tagName);return{top:(i.top+this.offset.relative.top*e+this.offset.parent.top*e-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(h?0:c.scrollTop()))*e)),left:(i.left+this.offset.relative.left*e+this.offset.parent.left*e-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():h?0:c.scrollLeft())*e))}},_generatePosition:function(f){var i=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,j=(/(html|body)/i).test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0])){this.offset.relative=this._getRelativeOffset()}var e=f.pageX;var d=f.pageY;if(this.originalPosition){if(this.containment){if(f.pageX-this.offset.click.left<this.containment[0]){e=this.containment[0]+this.offset.click.left}if(f.pageY-this.offset.click.top<this.containment[1]){d=this.containment[1]+this.offset.click.top}if(f.pageX-this.offset.click.left>this.containment[2]){e=this.containment[2]+this.offset.click.left}if(f.pageY-this.offset.click.top>this.containment[3]){d=this.containment[3]+this.offset.click.top}}if(i.grid){var h=this.originalPageY+Math.round((d-this.originalPageY)/i.grid[1])*i.grid[1];d=this.containment?(!(h-this.offset.click.top<this.containment[1]||h-this.offset.click.top>this.containment[3])?h:(!(h-this.offset.click.top<this.containment[1])?h-i.grid[1]:h+i.grid[1])):h;var g=this.originalPageX+Math.round((e-this.originalPageX)/i.grid[0])*i.grid[0];e=this.containment?(!(g-this.offset.click.left<this.containment[0]||g-this.offset.click.left>this.containment[2])?g:(!(g-this.offset.click.left<this.containment[0])?g-i.grid[0]:g+i.grid[0])):g}}return{top:(d-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(j?0:c.scrollTop())))),left:(e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():j?0:c.scrollLeft())))}},_rearrange:function(h,g,d,f){d?d[0].appendChild(this.placeholder[0]):g.item[0].parentNode.insertBefore(this.placeholder[0],(this.direction=="down"?g.item[0]:g.item[0].nextSibling));this.counter=this.counter?++this.counter:1;var e=this,c=this.counter;window.setTimeout(function(){if(c==e.counter){e.refreshPositions(!f)}},0)},_clear:function(e,f){this.reverting=false;var g=[],c=this;if(!this._noFinalSort&&this.currentItem[0].parentNode){this.placeholder.before(this.currentItem)}this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var d in this._storedCSS){if(this._storedCSS[d]=="auto"||this._storedCSS[d]=="static"){this._storedCSS[d]=""}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else{this.currentItem.show()}if(this.fromOutside&&!f){g.push(function(h){this._trigger("receive",h,this._uiHash(this.fromOutside))})}if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!f){g.push(function(h){this._trigger("update",h,this._uiHash())})}if(!a.ui.contains(this.element[0],this.currentItem[0])){if(!f){g.push(function(h){this._trigger("remove",h,this._uiHash())})}for(var d=this.containers.length-1;d>=0;d--){if(a.ui.contains(this.containers[d].element[0],this.currentItem[0])&&!f){g.push((function(h){return function(i){h._trigger("receive",i,this._uiHash(this))}}).call(this,this.containers[d]));g.push((function(h){return function(i){h._trigger("update",i,this._uiHash(this))}}).call(this,this.containers[d]))}}}for(var d=this.containers.length-1;d>=0;d--){if(!f){g.push((function(h){return function(i){h._trigger("deactivate",i,this._uiHash(this))}}).call(this,this.containers[d]))}if(this.containers[d].containerCache.over){g.push((function(h){return function(i){h._trigger("out",i,this._uiHash(this))}}).call(this,this.containers[d]));this.containers[d].containerCache.over=0}}if(this._storedCursor){a("body").css("cursor",this._storedCursor)}if(this._storedOpacity){this.helper.css("opacity",this._storedOpacity)}if(this._storedZIndex){this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex)}this.dragging=false;if(this.cancelHelperRemoval){if(!f){this._trigger("beforeStop",e,this._uiHash());for(var d=0;d<g.length;d++){g[d].call(this,e)}this._trigger("stop",e,this._uiHash())}return false}if(!f){this._trigger("beforeStop",e,this._uiHash())}this.placeholder[0].parentNode.removeChild(this.placeholder[0]);if(this.helper[0]!=this.currentItem[0]){this.helper.remove()}this.helper=null;if(!f){for(var d=0;d<g.length;d++){g[d].call(this,e)}this._trigger("stop",e,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){if(a.Widget.prototype._trigger.apply(this,arguments)===false){this.cancel()}},_uiHash:function(d){var c=d||this;return{helper:c.helper,placeholder:c.placeholder||a([]),position:c.position,originalPosition:c.originalPosition,offset:c.positionAbs,item:c.currentItem,sender:d?d.element:null}}});a.extend(a.ui.sortable,{version:"1.8.9"})})(jQuery);(function(a){a.fn.charCount=function(b){var d={allowed:140,warning:25,css:"counter",counterElement:"span",cssWarning:"warning",cssExceeded:"exceeded",counterText:""};var b=a.extend(d,b);function c(g){var e=a(g).val().length;var f=b.allowed-e;if(f<=b.warning&&f>=0){a(g).next().addClass(b.cssWarning)}else{a(g).next().removeClass(b.cssWarning)}if(f<0){a(g).next().addClass(b.cssExceeded)}else{a(g).next().removeClass(b.cssExceeded)}a(g).next().html(b.counterText+f)}this.each(function(){a(this).after("<"+b.counterElement+' class="'+b.css+'">'+b.counterText+"</"+b.counterElement+">");c(this);a(this).keyup(function(){c(this)});a(this).change(function(){c(this)})})}})(jQuery);(function(b){function a(g,d){var c=this,f,e;return function(){e=Array.prototype.slice.call(arguments,0),f=clearTimeout(f,e),f=setTimeout(function(){g.apply(c,e);f=0},d);return this}}b.extend(b.fn,{debounce:function(d,e,c){this.bind(d,a.apply(this,[e,c]))}})})(jQuery);
/*!
 * jQuery Expander Plugin v1.3
 *
 * Date: Sat Sep 17 00:37:34 2011 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2011, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/
(function(a){a.expander={version:"1.3",defaults:{slicePoint:100,preserveWords:true,widow:4,expandText:"read more",expandPrefix:"&hellip; ",summaryClass:"summary",detailClass:"details",moreClass:"read-more",lessClass:"read-less",collapseTimer:0,expandEffect:"fadeIn",expandSpeed:250,collapseEffect:"fadeOut",collapseSpeed:200,userCollapse:true,userCollapseText:"read less",userCollapsePrefix:" ",onSlice:null,beforeExpand:null,afterExpand:null,onCollapse:null}};a.fn.expander=function(o){var b=a.extend({},a.expander.defaults,o),d=/^<(?:area|br|col|embed|hr|img|input|link|meta|param).*>$/i,j=/(&(?:[^;]+;)?|\w+)$/,i=/<\/?(\w+)[^>]*>/g,f=/<(\w+)[^>]*>/g,k=/<\/(\w+)>/g,l=/^<[^>]+>.?/,m;this.each(function(){var L,K,P,w,N,G,r,Q,I,M,u=[],E=[],v={},O=this,z=a(this),x=a([]),J=a.meta?a.extend({},b,z.data()):b,q=!!z.find("."+J.detailClass).length,A=!!z.find("*").filter(function(){var R=a(this).css("display");return(/^block|table|list/).test(R)}).length,t=A?"div":"span",C=t+"."+J.detailClass,H="span."+J.moreClass,p=J.expandSpeed||0,y=a.trim(z.html()),B=a.trim(z.text()),D=y.slice(0,J.slicePoint);if(a.data(this,"expander")){return}a.data(this,"expander",true);a.each(["onSlice","beforeExpand","afterExpand","onCollapse"],function(R,S){v[S]=a.isFunction(J[S])});D=h(D);summTagless=D.replace(i,"").length;while(summTagless<J.slicePoint){newChar=y.charAt(D.length);if(newChar=="<"){newChar=y.slice(D.length).match(l)[0]}D+=newChar;summTagless++}D=h(D,J.preserveWords);N=D.match(f)||[];G=D.match(k)||[];P=[];a.each(N,function(R,S){if(!d.test(S)){P.push(S)}});N=P;K=G.length;for(L=0;L<K;L++){G[L]=G[L].replace(k,"$1")}a.each(N,function(R,U){var S=U.replace(f,"$1");var T=a.inArray(S,G);if(T===-1){u.push(U);E.push("</"+S+">")}else{G.splice(T,1)}});E.reverse();if(!q){Q=y.slice(D.length);if(Q.split(/\s+/).length<J.widow&&!q){return}r=E.pop()||"";D+=E.join("");Q=u.join("")+Q}else{Q=z.find(C).remove().html();D=z.html();y=D+Q;r=""}J.moreLabel=z.find(H).length?"":n(J);if(A){Q=y}D+=r;J.summary=D;J.details=Q;J.lastCloseTag=r;if(v.onSlice){P=J.onSlice.call(O,J);J=P&&P.details?P:J}var F=e(J,A);z.html(F);I=z.find(C);M=z.find(H);I.hide();M.find("a").unbind("click.expander").bind("click.expander",s);x=z.find("div."+J.summaryClass);if(J.userCollapse&&!z.find("span."+J.lessClass).length){z.find(C).append('<span class="'+J.lessClass+'">'+J.userCollapsePrefix+'<a href="#">'+J.userCollapseText+"</a></span>")}z.find("span."+J.lessClass+" a").unbind("click.expander").bind("click.expander",function(R){R.preventDefault();clearTimeout(m);var S=a(this).closest(C);c(J,S);if(v.onCollapse){J.onCollapse.call(O,true)}});function s(R){R.preventDefault();M.hide();x.hide();if(v.beforeExpand){J.beforeExpand.call(O)}I.stop(false,true)[J.expandEffect](p,function(){I.css({zoom:""});if(v.afterExpand){J.afterExpand.call(O)}g(J,I,O)})}});function e(s,r){var q="span",p=s.summary;if(r){q="div";p=p.replace(/(<\/[^>]+>)\s*$/,s.moreLabel+"$1");p='<div class="'+s.summaryClass+'">'+p+"</div>"}else{p+=s.moreLabel}return[p,"<",q+' class="'+s.detailClass+'"',">",s.details,"</"+q+">"].join("")}function n(q){var p='<span class="'+q.moreClass+'">'+q.expandPrefix;p+='<a href="#">'+q.expandText+"</a></span>";return p}function h(p,q){if(p.lastIndexOf("<")>p.lastIndexOf(">")){p=p.slice(0,p.lastIndexOf("<"))}if(q){p=p.replace(j,"")}return p}function c(q,p){p.stop(true,true)[q.collapseEffect](q.collapseSpeed,function(){var r=p.prev("span."+q.moreClass).show();if(!r.length){p.parent().children("div."+q.summaryClass).show().find("span."+q.moreClass).show()}})}function g(q,p,r){if(q.collapseTimer){m=setTimeout(function(){c(q,p);if(a.isFunction(q.onCollapse)){q.onCollapse.call(r,false)}},q.collapseTimer)}}return this};a.fn.expander.defaults=a.expander.defaults})(jQuery);(function(d){d.timeago=function(g){if(g instanceof Date){return a(g)}else{if(typeof g=="string"){return a(d.timeago.parse(g))}else{return a(d.timeago.datetime(g))}}};var f=d.timeago;d.extend(d.timeago,{settings:{refreshMillis:60000,allowFuture:false,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",numbers:[]}},inWords:function(l){var m=this.settings.strings;var i=m.prefixAgo;var q=m.suffixAgo;if(this.settings.allowFuture){if(l<0){i=m.prefixFromNow;q=m.suffixFromNow}l=Math.abs(l)}var o=l/1000;var g=o/60;var n=g/60;var p=n/24;var j=p/365;function h(r,t){var s=d.isFunction(r)?r(t,l):r;var u=(m.numbers&&m.numbers[t])||t;return s.replace(/%d/i,u)}var k=o<45&&h(m.seconds,Math.round(o))||o<90&&h(m.minute,1)||g<45&&h(m.minutes,Math.round(g))||g<90&&h(m.hour,1)||n<24&&h(m.hours,Math.round(n))||n<48&&h(m.day,1)||p<30&&h(m.days,Math.floor(p))||p<60&&h(m.month,1)||p<365&&h(m.months,Math.floor(p/30))||j<2&&h(m.year,1)||h(m.years,Math.floor(j));return d.trim([i,k,q].join(" "))},parse:function(h){var g=d.trim(h);g=g.replace(/\.\d\d\d+/,"");g=g.replace(/-/,"/").replace(/-/,"/");g=g.replace(/T/," ").replace(/Z/," UTC");g=g.replace(/([\+-]\d\d)\:?(\d\d)/," $1$2");return new Date(g)},datetime:function(h){var i=d(h).get(0).tagName.toLowerCase()=="time";var g=i?d(h).attr("datetime"):d(h).attr("title");return f.parse(g)}});d.fn.timeago=function(){var h=this;h.each(c);var g=f.settings;if(g.refreshMillis>0){setInterval(function(){h.each(c)},g.refreshMillis)}return h};function c(){var g=b(this);if(!isNaN(g.datetime)){d(this).text(a(g.datetime))}return this}function b(g){g=d(g);if(!g.data("timeago")){g.data("timeago",{datetime:f.datetime(g)});var h=d.trim(g.text());if(h.length>0){g.attr("title",h)}}return g.data("timeago")}function a(g){return f.inWords(e(g))}function e(g){return(new Date().getTime()-g.getTime())}document.createElement("abbr");document.createElement("time")})(jQuery);(function(){var a=function(){var b=function(){};b.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":true},context:{},render:function(f,e,d,g){if(!g){this.context=e;this.buffer=[]}if(!this.includes("",f)){if(g){return f}else{this.send(f);return}}f=this.render_pragmas(f);var c=this.render_section(f,e,d);if(g){return this.render_tags(c,e,d,g)}this.render_tags(c,e,d,g)},send:function(c){if(c!=""){this.buffer.push(c)}},render_pragmas:function(c){if(!this.includes("%",c)){return c}var e=this;var d=new RegExp(this.otag+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+this.ctag);return c.replace(d,function(h,f,g){if(!e.pragmas_implemented[f]){throw ({message:"This implementation of mustache doesn't understand the '"+f+"' pragma"})}e.pragmas[f]={};if(g){var i=g.split("=");e.pragmas[f][i[0]]=i[1]}return""})},render_partial:function(c,e,d){c=this.trim(c);if(!d||d[c]===undefined){throw ({message:"unknown_partial '"+c+"'"})}if(typeof(e[c])!="object"){return this.render(d[c],e,d,true)}return this.render(d[c],e[c],d,true)},render_section:function(e,d,c){if(!this.includes("#",e)&&!this.includes("^",e)){return e}var g=this;var f=new RegExp(this.otag+"(\\^|\\#)\\s*(.+)\\s*"+this.ctag+"\n*([\\s\\S]+?)"+this.otag+"\\/\\s*\\2\\s*"+this.ctag+"\\s*","mg");return e.replace(f,function(i,j,h,k){var l=g.find(h,d);if(j=="^"){if(!l||g.is_array(l)&&l.length===0){return g.render(k,d,c,true)}else{return""}}else{if(j=="#"){if(g.is_array(l)){return g.map(l,function(m){return g.render(k,g.create_context(m),c,true)}).join("")}else{if(g.is_object(l)){return g.render(k,g.create_context(l),c,true)}else{if(typeof l==="function"){return l.call(d,k,function(m){return g.render(m,d,c,true)})}else{if(l){return g.render(k,d,c,true)}else{return""}}}}}}})},render_tags:function(l,c,e,g){var f=this;var k=function(){return new RegExp(f.otag+"(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"+f.ctag+"+","g")};var h=k();var j=function(o,i,n){switch(i){case"!":return"";case"=":f.set_delimiters(n);h=k();return"";case">":return f.render_partial(n,c,e);case"{":return f.find(n,c);default:return f.escape(f.find(n,c))}};var m=l.split("\n");for(var d=0;d<m.length;d++){m[d]=m[d].replace(h,j,this);if(!g){this.send(m[d])}}if(g){return m.join("\n")}},set_delimiters:function(d){var c=d.split(" ");this.otag=this.escape_regex(c[0]);this.ctag=this.escape_regex(c[1])},escape_regex:function(d){if(!arguments.callee.sRE){var c=["/",".","*","+","?","|","(",")","[","]","{","}","\\"];arguments.callee.sRE=new RegExp("(\\"+c.join("|\\")+")","g")}return d.replace(arguments.callee.sRE,"\\$1")},find:function(d,e){d=this.trim(d);function c(g){return g===false||g===0||g}var f;if(c(e[d])){f=e[d]}else{if(c(this.context[d])){f=this.context[d]}}if(typeof f==="function"){return f.apply(e)}if(f!==undefined){return f}return""},includes:function(d,c){return c.indexOf(this.otag+d)!=-1},escape:function(c){c=String(c===null?"":c);return c.replace(/&(?!\w+;)|["'<>\\]/g,function(d){switch(d){case"&":return"&amp;";case"\\":return"\\\\";case'"':return"&quot;";case"'":return"&#39;";case"<":return"&lt;";case">":return"&gt;";default:return d}})},create_context:function(d){if(this.is_object(d)){return d}else{var e=".";if(this.pragmas["IMPLICIT-ITERATOR"]){e=this.pragmas["IMPLICIT-ITERATOR"].iterator}var c={};c[e]=d;return c}},is_object:function(c){return c&&typeof c=="object"},is_array:function(c){return Object.prototype.toString.call(c)==="[object Array]"},trim:function(c){return c.replace(/^\s*|\s*$/g,"")},map:function(g,e){if(typeof g.map=="function"){return g.map(e)}else{var f=[];var c=g.length;for(var d=0;d<c;d++){f.push(e(g[d]))}return f}}};return({name:"mustache.js",version:"0.3.1-dev",to_html:function(e,c,d,g){var f=new b();if(g){f.send=g}f.render(e,c,d);if(!g){return f.buffer.join("\n")}}})}();$.mustache=function(d,b,c,e){return a.to_html(d,b,c,e)}})();(function(f){f.facebox=function(m,l){f.facebox.loading();if(m.ajax){g(m.ajax,l)}else{if(m.image){c(m.image,l)}else{if(m.div){j(m.div,l)}else{if(f.isFunction(m)){m.call(f)}else{f.facebox.reveal(m,l)}}}}};f.extend(f.facebox,{settings:{opacity:0.2,overlay:true,loadingImage:"/facebox/loading.gif",closeImage:"/facebox/closelabel.png",imageTypes:["png","jpg","jpeg","gif"],faceboxHtml:'    <div id="facebox" style="display:none;">       <div class="popup">         <div class="content">         </div>         <a href="#" class="close"></a>       </div>     </div>'},loading:function(){k();if(f("#facebox .loading").length==1){return true}e();f("#facebox .content").empty().append('<div class="loading"><img src="'+f.facebox.settings.loadingImage+'"/></div>');f("#facebox").show().css({top:h()[1]+(i()/10),left:f(window).width()/2-(f("#facebox .popup").outerWidth()/2)});f(document).bind("keydown.facebox",function(l){if(l.keyCode==27){f.facebox.close()}return true});f(document).trigger("loading.facebox")},reveal:function(m,l){f(document).trigger("beforeReveal.facebox");if(l){f("#facebox .content").addClass(l)}f("#facebox .content").empty().append(m);f("#facebox .popup").children().fadeIn("normal");f("#facebox").css("left",f(window).width()/2-(f("#facebox .popup").outerWidth()/2));f(document).trigger("reveal.facebox").trigger("afterReveal.facebox")},close:function(){f(document).trigger("close.facebox");return false}});f.fn.facebox=function(l){if(f(this).length==0){return}k(l);function m(){f.facebox.loading(true);var n=this.rel.match(/facebox\[?\.(\w+)\]?/);if(n){n=n[1]}j(this.href,n);return false}return this.bind("click.facebox",m)};function k(n){if(f.facebox.settings.inited){return true}else{f.facebox.settings.inited=true}f(document).trigger("init.facebox");d();var l=f.facebox.settings.imageTypes.join("|");f.facebox.settings.imageTypesRegexp=new RegExp("\\.("+l+")(\\?.*)?$","i");if(n){f.extend(f.facebox.settings,n)}f("body").append(f.facebox.settings.faceboxHtml);var m=[new Image(),new Image()];m[0].src=f.facebox.settings.closeImage;m[1].src=f.facebox.settings.loadingImage;f("#facebox").find(".b:first, .bl").each(function(){m.push(new Image());m.slice(-1).src=f(this).css("background-image").replace(/url\((.+)\)/,"$1")});f("#facebox .close").click(f.facebox.close).append('<img src="'+f.facebox.settings.closeImage+'" class="close_image" title="close">')}function h(){var m,l;if(self.pageYOffset){l=self.pageYOffset;m=self.pageXOffset}else{if(document.documentElement&&document.documentElement.scrollTop){l=document.documentElement.scrollTop;m=document.documentElement.scrollLeft}else{if(document.body){l=document.body.scrollTop;m=document.body.scrollLeft}}}return new Array(m,l)}function i(){var l;if(self.innerHeight){l=self.innerHeight}else{if(document.documentElement&&document.documentElement.clientHeight){l=document.documentElement.clientHeight}else{if(document.body){l=document.body.clientHeight}}}return l}function d(){var l=f.facebox.settings;l.loadingImage=l.loading_image||l.loadingImage;l.closeImage=l.close_image||l.closeImage;l.imageTypes=l.image_types||l.imageTypes;l.faceboxHtml=l.facebox_html||l.faceboxHtml}function j(m,l){if(m.match(/#/)){var n=window.location.href.split("#")[0];var o=m.replace(n,"");if(o=="#"){return}f.facebox.reveal(f(o).html(),l)}else{if(m.match(f.facebox.settings.imageTypesRegexp)){c(m,l)}else{g(m,l)}}}function c(m,l){var n=new Image();n.onload=function(){f.facebox.reveal('<div class="image"><img src="'+n.src+'" /></div>',l)};n.src=m}function g(m,l){f.get(m,function(n){f.facebox.reveal(n,l)})}function b(){return f.facebox.settings.overlay==false||f.facebox.settings.opacity===null}function e(){if(b()){return}if(f("#facebox_overlay").length==0){f("body").append('<div id="facebox_overlay" class="facebox_hide"></div>')}f("#facebox_overlay").hide().addClass("facebox_overlayBG").css("opacity",f.facebox.settings.opacity).click(function(){f(document).trigger("close.facebox")}).fadeIn(200);return false}function a(){if(b()){return}f("#facebox_overlay").fadeOut(200,function(){f("#facebox_overlay").removeClass("facebox_overlayBG");f("#facebox_overlay").addClass("facebox_hide");f("#facebox_overlay").remove()});return false}f(document).bind("close.facebox",function(){f(document).unbind("keydown.facebox");f("#facebox").fadeOut(function(){f("#facebox .content").removeClass().addClass("content");f("#facebox .loading").remove();f(document).trigger("afterClose.facebox")});a()})})(jQuery);
/*
	--------------------------------
	Infinite Scroll
	--------------------------------
	+ https://github.com/paulirish/infinite-scroll
	+ version 2.0b2.111027
	+ Copyright 2011 Paul Irish & Luke Shumard
	+ Licensed under the MIT license
	
	+ Documentation: http://infinite-scroll.com/
	
*/

(function (window, $, undefined) {
	
	$.infinitescroll = function infscr(options, callback, element) {
		
		this.element = $(element);
		this._create(options, callback);
	
	};
	
	$.infinitescroll.defaults = {
		loading: {
			finished: undefined,
			finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
			img: "http://www.infinite-scroll.com/loading.gif",
			msg: null,
			msgText: "<em>Loading the next set of posts...</em>",
			selector: null,
			speed: 'fast',
			start: undefined
		},
		state: {
			isDuringAjax: false,
			isInvalidPage: false,
			isDestroyed: false,
			isDone: false, // For when it goes all the way through the archive.
			isPaused: false,
			currPage: 1
		},
		callback: undefined,
		debug: false,
		behavior: undefined,
		binder: $(window), // used to cache the selector
		nextSelector: "div.navigation a:first",
		navSelector: "div.navigation",
		contentSelector: null, // rename to pageFragment
		extraScrollPx: 150,
		itemSelector: "div.post",
		animate: false,
		pathParse: undefined,
		dataType: 'html',
		appendCallback: true,
		bufferPx: 40,
		errorCallback: function () { },
		infid: 0, //Instance ID
		pixelsFromNavToBottom: undefined,
		path: undefined
	};


    $.infinitescroll.prototype = {

        /*	
        ----------------------------
        Private methods
        ----------------------------
        */

        // Bind or unbind from scroll
        _binding: function infscr_binding(binding) {

            var instance = this,
				opts = instance.options;
				
			opts.v = '2.0b2.111027';

            // if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_binding_'+opts.behavior] !== undefined) {
				this['_binding_'+opts.behavior].call(this);
				return;
			}

			if (binding !== 'bind' && binding !== 'unbind') {
                this._debug('Binding value  ' + binding + ' not valid')
                return false;
            }

            if (binding == 'unbind') {

                (this.options.binder).unbind('smartscroll.infscr.' + instance.options.infid);

            } else {

                (this.options.binder)[binding]('smartscroll.infscr.' + instance.options.infid, function () {
                    instance.scroll();
                });

            };

            this._debug('Binding', binding);

        },

		// Fundamental aspects of the plugin are initialized
		_create: function infscr_create(options, callback) {

            // If selectors from options aren't valid, return false
            if (!this._validate(options)) { return false; }
            // Define options and shorthand
            var opts = this.options = $.extend(true, {}, $.infinitescroll.defaults, options),
				// get the relative URL - everything past the domain name.
				relurl = /(.*?\/\/).*?(\/.*)/,
				path = $(opts.nextSelector).attr('href');

            // contentSelector is 'page fragment' option for .load() / .ajax() calls
            opts.contentSelector = opts.contentSelector || this.element;

            // loading.selector - if we want to place the load message in a specific selector, defaulted to the contentSelector
            opts.loading.selector = opts.loading.selector || opts.contentSelector;

            // if there's not path, return
            if (!path) { this._debug('Navigation selector not found'); return; }

            // Set the path to be a relative URL from root.
            opts.path = this._determinepath(path);

            // Define loading.msg
            opts.loading.msg = $('<div id="infscr-loading"><img alt="Loading..." src="' + opts.loading.img + '" /><div>' + opts.loading.msgText + '</div></div>');

            // Preload loading.img
            (new Image()).src = opts.loading.img;

            // distance from nav links to bottom
            // computed as: height of the document + top offset of container - top offset of nav link
            opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;

			// determine loading.start actions
            opts.loading.start = opts.loading.start || function() {
				
				$(opts.navSelector).hide();
				opts.loading.msg
					.appendTo(opts.loading.selector)
					.show(opts.loading.speed, function () {
	                	beginAjax(opts);
	            });
			};
			
			// determine loading.finished actions
			opts.loading.finished = opts.loading.finished || function() {
				opts.loading.msg.fadeOut('normal');
			};

            // callback loading
            opts.callback = function(instance,data) {
				if (!!opts.behavior && instance['_callback_'+opts.behavior] !== undefined) {
					instance['_callback_'+opts.behavior].call($(opts.contentSelector)[0], data);
				}
				if (callback) {
					callback.call($(opts.contentSelector)[0], data, opts);
				}
			};

            this._setup();

        },

        // Console log wrapper
        _debug: function infscr_debug() {

			if (this.options && this.options.debug) {
                return window.console && console.log.call(console, arguments);
            }

        },

        // find the number to increment in the path.
        _determinepath: function infscr_determinepath(path) {

            var opts = this.options;

			// if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_determinepath_'+opts.behavior] !== undefined) {
				this['_determinepath_'+opts.behavior].call(this,path);
				return;
			}

            if (!!opts.pathParse) {

                this._debug('pathParse manual');
                return opts.pathParse(path, this.options.state.currPage+1);

            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);

                // if there is any 2 in the url at all.    
            } else if (path.match(/^(.*?)2(.*?$)/)) {

                // page= is used in django:
                // http://www.infinite-scroll.com/changelog/comment-page-1/#comment-127
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }

                path = path.match(/^(.*?)2(.*?$)/).slice(1);

            } else {

                // page= is used in drupal too but second page is page=1 not page=2:
                // thx Jerod Fritz, vladikoff
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug('Sorry, we couldn\'t parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.');
                    // Get rid of isInvalidPage to allow permalink to state
                    opts.state.isInvalidPage = true;  //prevent it from running on this page.
                }
            }
            this._debug('determinePath', path);
            return path;

        },

        // Custom error
        _error: function infscr_error(xhr) {

            var opts = this.options;

			// if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_error_'+opts.behavior] !== undefined) {
				this['_error_'+opts.behavior].call(this,xhr);
				return;
			}

            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }

            this._debug('Error', xhr);

            if (xhr == 'end') {
                this._showdonemsg();
            }

            opts.state.isDone = true;
            opts.state.currPage = 1; // if you need to go back to this instance
            opts.state.isPaused = false;
            this._binding('unbind');

        },

        // Load Callback
        _loadcallback: function infscr_loadcallback(box, data) {

            var opts = this.options,
	    		callback = this.options.callback, // GLOBAL OBJECT FOR CALLBACK
	    		result = (opts.state.isDone) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
	    		frag;
	
			// if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_loadcallback_'+opts.behavior] !== undefined) {
				this['_loadcallback_'+opts.behavior].call(this,box,data);
				return;
			}

            switch (result) {

                case 'done':

                    this._showdonemsg();
                    return false;

                    break;

                case 'no-append':

                    if (opts.dataType == 'html') {
                        data = '<div>' + data + '</div>';
                        data = $(data).find(opts.itemSelector);
                    };

                    break;

                case 'append':

                    var children = box.children();

                    // if it didn't return anything
                    if (children.length == 0) {
                        return this._error('end');
                    }


                    // use a documentFragment because it works when content is going into a table or UL
                    frag = document.createDocumentFragment();
                    while (box[0].firstChild) {
                        frag.appendChild(box[0].firstChild);
                    }

                    this._debug('contentSelector', $(opts.contentSelector)[0])
                    $(opts.contentSelector)[0].appendChild(frag);
                    // previously, we would pass in the new DOM element as context for the callback
                    // however we're now using a documentfragment, which doesnt havent parents or children,
                    // so the context is the contentContainer guy, and we pass in an array
                    //   of the elements collected as the first argument.

                    data = children.get();


                    break;

            }

            // loadingEnd function
			opts.loading.finished.call($(opts.contentSelector)[0],opts)
            

            // smooth scroll to ease in the new content
            if (opts.animate) {
                var scrollTo = $(window).scrollTop() + $('#infscr-loading').height() + opts.extraScrollPx + 'px';
                $('html,body').animate({ scrollTop: scrollTo }, 800, function () { opts.state.isDuringAjax = false; });
            }

            if (!opts.animate) opts.state.isDuringAjax = false; // once the call is done, we can allow it again.

            callback(this,data);

        },

        _nearbottom: function infscr_nearbottom() {

            var opts = this.options,
	        	pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();

            // if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_nearbottom_'+opts.behavior] !== undefined) {
				return this['_nearbottom_'+opts.behavior].call(this);
			}

			this._debug('math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);

            // if distance remaining in the scroll (including buffer) is less than the orignal nav to bottom....
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);

        },

		// Pause / temporarily disable plugin from firing
        _pausing: function infscr_pausing(pause) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_pausing_'+opts.behavior] !== undefined) {
				this['_pausing_'+opts.behavior].call(this,pause);
				return;
			}

			// If pause is not 'pause' or 'resume', toggle it's value
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('Invalid argument. Toggling pause value instead');
            };

            pause = (pause && (pause == 'pause' || pause == 'resume')) ? pause : 'toggle';

            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                    break;

                case 'resume':
                    opts.state.isPaused = false;
                    break;

                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                    break;
            }

            this._debug('Paused', opts.state.isPaused);
            return false;

        },

		// Behavior is determined
		// If the behavior option is undefined, it will set to default and bind to scroll
		_setup: function infscr_setup() {
			
			var opts = this.options;
			
			// if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_setup_'+opts.behavior] !== undefined) {
				this['_setup_'+opts.behavior].call(this);
				return;
			}
			
			this._binding('bind');
			
			return false;
			
		},

        // Show done message
        _showdonemsg: function infscr_showdonemsg() {

            var opts = this.options;

			// if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['_showdonemsg_'+opts.behavior] !== undefined) {
				this['_showdonemsg_'+opts.behavior].call(this);
				return;
			}

            opts.loading.msg
	    		.find('img')
	    		.hide()
	    		.parent()
	    		.find('div').html(opts.loading.finishedMsg).animate({ opacity: 1 }, 2000, function () {
	    		    $(this).parent().fadeOut('normal');
	    		});

            // user provided callback when done    
            opts.errorCallback.call($(opts.contentSelector)[0],'done');

        },

		// grab each selector option and see if any fail
        _validate: function infscr_validate(opts) {

            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('Your ' + key + ' found no elements.');
                    return false;
                }
                return true;
            }

        },

        /*	
        ----------------------------
        Public methods
        ----------------------------
        */

		// Bind to scroll
		bind: function infscr_bind() {
			this._binding('bind');
		},

        // Destroy current instance of plugin
        destroy: function infscr_destroy() {

            this.options.state.isDestroyed = true;
            return this._error('destroy');

        },

		// Set pause value to false
		pause: function infscr_pause() {
			this._pausing('pause');
		},
		
		// Set pause value to false
		resume: function infscr_resume() {
			this._pausing('resume');
		},

        // Retrieve next set of content items
        retrieve: function infscr_retrieve(pageNum) {

            var instance = this,
				opts = instance.options,
				path = opts.path,
				box, frag, desturl, method, condition,
	    		pageNum = pageNum || null,
				getPage = (!!pageNum) ? pageNum : opts.state.currPage;
				beginAjax = function infscr_ajax(opts) {
					
					// increment the URL bit. e.g. /page/3/
	                opts.state.currPage++;

	                instance._debug('heading into ajax', path);

	                // if we're dealing with a table we can't use DIVs
	                box = $(opts.contentSelector).is('table') ? $('<tbody/>') : $('<div/>');

	                desturl = path.join(opts.state.currPage);

	                method = (opts.dataType == 'html' || opts.dataType == 'json') ? opts.dataType : 'html+callback';
	                if (opts.appendCallback && opts.dataType == 'html') method += '+callback'

	                switch (method) {

	                    case 'html+callback':

	                        instance._debug('Using HTML via .load() method');
	                        box.load(desturl + ' ' + opts.itemSelector, null, function infscr_ajax_callback(responseText) {
	                            instance._loadcallback(box, responseText);
	                        });

	                        break;

	                    case 'html':
	                    case 'json':

	                        instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
	                        $.ajax({
	                            // params
	                            url: desturl,
	                            dataType: opts.dataType,
	                            complete: function infscr_ajax_callback(jqXHR, textStatus) {
	                                condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
	                                (condition) ? instance._loadcallback(box, jqXHR.responseText) : instance._error('end');
	                            }
	                        });
	
	                        break;
	                }
				};
				
			// if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['retrieve_'+opts.behavior] !== undefined) {
				this['retrieve_'+opts.behavior].call(this,pageNum);
				return;
			}

            
			// for manual triggers, if destroyed, get out of here
			if (opts.state.isDestroyed) {
                this._debug('Instance is destroyed');
                return false;
            };

            // we dont want to fire the ajax multiple times
            opts.state.isDuringAjax = true;

            opts.loading.start.call($(opts.contentSelector)[0],opts);

        },

        // Check to see next page is needed
        scroll: function infscr_scroll() {

            var opts = this.options,
				state = opts.state;

            // if behavior is defined and this function is extended, call that instead of default
			if (!!opts.behavior && this['scroll_'+opts.behavior] !== undefined) {
				this['scroll_'+opts.behavior].call(this);
				return;
			}

			if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) return;

            if (!this._nearbottom()) return;

            this.retrieve();

        },
		
		// Toggle pause value
		toggle: function infscr_toggle() {
			this._pausing();
		},
		
		// Unbind from scroll
		unbind: function infscr_unbind() {
			this._binding('unbind');
		},
		
		// update options
		update: function infscr_options(key) {
			if ($.isPlainObject(key)) {
				this.options = $.extend(true,this.options,key);
			}
		}

    }


    /*	
    ----------------------------
    Infinite Scroll function
    ----------------------------
	
    Borrowed logic from the following...
	
    jQuery UI
    - https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
	
    jCarousel
    - https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js
	
    Masonry
    - https://github.com/desandro/masonry/blob/master/jquery.masonry.js		
	
    */

    $.fn.infinitescroll = function infscr_init(options, callback) {


        var thisCall = typeof options;

        switch (thisCall) {

            // method 
            case 'string':

                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function () {

                    var instance = $.data(this, 'infinitescroll');

                    if (!instance) {
                        // not setup yet
                        // return $.error('Method ' + options + ' cannot be called until Infinite Scroll is setup');
						return false;
                    }
                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        // return $.error('No such method ' + options + ' for Infinite Scroll');
						return false;
                    }

                    // no errors!
                    instance[options].apply(instance, args);

                });

                break;

            // creation 
            case 'object':

                this.each(function () {

                    var instance = $.data(this, 'infinitescroll');

                    if (instance) {

                        // update options of current instance
                        instance.update(options);

                    } else {

                        // initialize new instance
                        $.data(this, 'infinitescroll', new $.infinitescroll(options, callback, this));

                    }

                });

                break;

        }

        return this;

    };



    /* 
    * smartscroll: debounced scroll event for jQuery *
    * https://github.com/lukeshumard/smartscroll
    * Based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
    * Copyright 2011 Louis-Remi & Luke Shumard * Licensed under the MIT license. *
    */

    var event = $.event,
		scrollTimeout;

    event.special.smartscroll = {
        setup: function () {
            $(this).bind("scroll", event.special.smartscroll.handler);
        },
        teardown: function () {
            $(this).unbind("scroll", event.special.smartscroll.handler);
        },
        handler: function (event, execAsap) {
            // Save the context
            var context = this,
		      args = arguments;

            // set correct event type
            event.type = "smartscroll";

            if (scrollTimeout) { clearTimeout(scrollTimeout); }
            scrollTimeout = setTimeout(function () {
                $.event.handle.apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartscroll = function (fn) {
        return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll", ["execAsap"]);
    };


})(window, jQuery);

