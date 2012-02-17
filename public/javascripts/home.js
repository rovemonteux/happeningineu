var Publisher={bookmarklet:false,close:function(){Publisher.form().addClass("closed");
Publisher.form().find("#publisher_textarea_wrapper").removeClass("active");
Publisher.form().find("textarea.ac_input").css("min-height","")},open:function(){Publisher.form().removeClass("closed");
Publisher.form().find("#publisher_textarea_wrapper").addClass("active");
Publisher.form().find("textarea.ac_input").css("min-height","42px");
Publisher.determineSubmitAvailability()},cachedForm:false,form:function(){if(!Publisher.cachedForm){Publisher.cachedForm=$("#publisher")}return Publisher.cachedForm},cachedInput:false,input:function(){if(!Publisher.cachedInput){Publisher.cachedInput=Publisher.form().find("#status_message_fake_text")}return Publisher.cachedInput},cachedHiddenInput:false,hiddenInput:function(){if(!Publisher.cachedHiddenInput){Publisher.cachedHiddenInput=Publisher.form().find("#status_message_text")}return Publisher.cachedHiddenInput},cachedSubmit:false,submit:function(){if(!Publisher.cachedSubmit){Publisher.cachedSubmit=Publisher.form().find("#status_message_submit")}return Publisher.cachedSubmit},autocompletion:{options:function(){return{minChars:1,max:5,onSelect:Publisher.autocompletion.onSelect,searchTermFromValue:Publisher.autocompletion.searchTermFromValue,scroll:false,formatItem:function(c,b,a){return"<img src='"+c.avatar+"' class='avatar'/>"+c.name},formatMatch:function(c,b,a){return c.name},formatResult:function(a){return a.name},disableRightAndLeft:true}},hiddenMentionFromPerson:function(a){return"@{"+a.name+";
 "+a.handle+"}"},onSelect:function(b,g,f){var a=b[0].selectionStart;
var d=Publisher.autocompletion.addMentionToInput(b,a,f);
$.Autocompleter.Selection(b[0],d[1],d[1]);
var e=Publisher.autocompletion.hiddenMentionFromPerson(g);
var c={visibleStart:d[0],visibleEnd:d[1],mentionString:e};
Publisher.autocompletion.mentionList.push(c);
Publisher.oldInputContent=b.val();
Publisher.hiddenInput().val(Publisher.autocompletion.mentionList.generateHiddenInput(b.val()))},mentionList:{mentions:[],sortedMentions:function(){return this.mentions.sort(function(b,a){if(b.visibleStart>a.visibleStart){return -1}else{if(b.visibleStart<a.visibleStart){return 1}else{return 0}}})},push:function(a){this.mentions.push(a)},generateHiddenInput:function(d){var f=d;
for(var c in this.sortedMentions()){var b=this.mentions[c];
var g=f.slice(0,b.visibleStart);
var e=b.mentionString;
var a=f.slice(b.visibleEnd);
f=g+e+a}return f},insertionAt:function(a,c,b){if(a!=c){this.selectionDeleted(a,c)}this.updateMentionLocations(a,1);
this.destroyMentionAt(a)},deletionAt:function(b,d,c){if(b!=d){this.selectionDeleted(b,d);
return}var a;
if(c==KEYCODES.DEL){a=b}else{a=b-1}this.updateMentionLocations(a,-1);
this.destroyMentionAt(a)},selectionDeleted:function(a,b){Publisher.autocompletion.mentionList.destroyMentionsWithin(a,b);
Publisher.autocompletion.mentionList.updateMentionLocations(a,a-b)},destroyMentionsWithin:function(d,a){for(var c=this.mentions.length-1;
c>=0;
c--){var b=this.mentions[c];
if(d<b.visibleEnd&&a>=b.visibleStart){this.mentions.splice(c,1)}}},clear:function(){this.mentions=[]},destroyMentionAt:function(b){var a=this.mentionAt(b);
var c=this.mentions[a];
if(c){this.mentions.splice(a,1)}},updateMentionLocations:function(a,e){var d=this.mentionsAfter(a);
for(var c in d){var b=d[c];
b.visibleStart+=e;
b.visibleEnd+=e}},mentionAt:function(a){for(var c in this.mentions){var b=this.mentions[c];
if(a>b.visibleStart&&a<b.visibleEnd){return c}}return false},mentionsAfter:function(a){var d=[];
for(var c in this.mentions){var b=this.mentions[c];
if(a<=b.visibleStart){d.push(b)}}return d}},repopulateHiddenInput:function(){var a=Publisher.autocompletion.mentionList.generateHiddenInput(Publisher.input().val());
if(a!=Publisher.hiddenInput().val()){Publisher.hiddenInput().val(a)}},keyUpHandler:function(a){Publisher.autocompletion.repopulateHiddenInput();
Publisher.determineSubmitAvailability()},keyDownHandler:function(d){var c=Publisher.input();
var e=c[0].selectionStart;
var f=c[0].selectionEnd;
var b=(d.keyCode==KEYCODES.DEL&&e<c.val().length)||(d.keyCode==KEYCODES.BACKSPACE&&(e>0||e!=f));
var a=(KEYCODES.isInsertion(d.keyCode)&&d.keyCode!=KEYCODES.RETURN);
if(b){Publisher.autocompletion.mentionList.deletionAt(e,f,d.keyCode)}else{if(a){Publisher.autocompletion.mentionList.insertionAt(e,f,d.keyCode)}}},addMentionToInput:function(b,g,e){var h=b.val();
var a=Publisher.autocompletion.findStringToReplace(h,g);
var c=h.slice(0,a[0]);
var d=h.slice(a[1]);
b.val(c+e+d);
var f=e.length-(a[1]-a[0]);
Publisher.autocompletion.mentionList.updateMentionLocations(c.length,f);
return[c.length,c.length+e.length]},findStringToReplace:function(c,d){var a=c.lastIndexOf("@",d);
if(a==-1){return[0,0]}var b=d;
if(b==-1){b=c.length}return[a,b]},searchTermFromValue:function(c,e){var a=Publisher.autocompletion.findStringToReplace(c,e);
if(a[0]<=2){a[0]=0}else{a[0]-=2}var d=c.slice(a[0],a[1]).replace(/\s+$/,"");
var b=d.match(/(^|\s)@(.+)/);
if(b){return b[2]}else{return""}},initialize:function(){$.getJSON($("#publisher .selected_contacts_link").attr("href"),undefined,function(a){Publisher.input().autocomplete(a,Publisher.autocompletion.options());
Publisher.input().result(Publisher.autocompletion.selectItemCallback);
Publisher.oldInputContent=Publisher.input().val()})}},determineSubmitAvailability:function(){var b=($.trim(Publisher.input().val())===""),a=Publisher.submit().attr("disabled"),c=($("#photodropzone").children().length>0);
if((b&&!c)&&!a){Publisher.submit().attr("disabled",true)}else{if((!b||c)&&a){Publisher.submit().removeAttr("disabled")}}},clear:function(){this.autocompletion.mentionList.clear();
$("#photodropzone").find("li").remove();
$("#publisher textarea").removeClass("with_attachments").css("paddingBottom","")},bindServiceIcons:function(){$(".service_icon").bind("click",function(a){$(this).toggleClass("dim");
Publisher.toggleServiceField($(this))})},toggleServiceField:function(a){Publisher.createCounter(a);
var b=a.attr("id");
var c=$('#publisher [name="services[]"][value="'+b+'"]');
if(c.length>0){c.remove()}else{$("#publisher .content_creation form").append('<input id="services_" name="services[]" type="hidden" value="'+b+'">')}},isPublicPost:function(){return $('#publisher [name="aspect_ids[]"]').first().val()=="public"},isToAllAspects:function(){return $('#publisher [name="aspect_ids[]"]').first().val()=="all_aspects"},selectedAspectIds:function(){var b=$('#publisher [name="aspect_ids[]"]');
var a=[];
b.each(function(){a.push(parseInt($(this).attr("value")))});
return a},removeRadioSelection:function(a){$.each(a,function(b,d){var c=$(d);
if(c.val()=="all_aspects"||c.val()=="public"){c.remove()}})},toggleAspectIds:function(b){var c=b.attr("data-aspect_id"),e=$('#publisher [name="aspect_ids[]"]'),d=function(){$("#publisher .content_creation form").append('<input id="aspect_ids_" name="aspect_ids[]" type="hidden" value="'+c+'">')};
if(b.hasClass("radio")){$.each(e,function(f,g){$(g).remove()});
d();
b.closest(".dropdown").removeClass("active")}else{var a=$('#publisher [name="aspect_ids[]"][value="'+c+'"]');
Publisher.removeRadioSelection(e);
if(a.length>0){a.remove()}else{d()}}},createCounter:function(b){var d=$("#publisher .counter");
d.remove();
var e=80000;
var c=$(".service_icon:not(.dim)");
if(c.length>0){$.each(c,function(f,g){var a=parseInt($(g).attr("maxchar"));
if(e>a){e=a}});
$("#status_message_fake_text").charCount({allowed:e,warning:e/10})}},bindAspectToggles:function(){$("#publisher .dropdown .dropdown_list li").bind("click",function(b){var a=$(this),c=a.parent(".dropdown").find(".button");
if(a.hasClass("radio")){AspectsDropdown.toggleRadio(a)}else{AspectsDropdown.toggleCheckbox(a)}AspectsDropdown.updateNumber(a.closest(".dropdown_list"),null,a.parent().find("li.selected").length,"");
Publisher.toggleAspectIds(a)})},beforeSubmit:function(){if($("#publisher .content_creation form #aspect_ids_").length==0){alert(Diaspora.I18n.t("publisher.at_least_one_aspect"));
return false}},onSubmit:function(b,a,c){$("#photodropzone").find("li").remove();
$("#publisher textarea").removeClass("with_attachments").css("paddingBottom","")},onFailure:function(b,a,c){a=$.parseJSON(a.responseText);
if(a.errors.length!==0){Diaspora.Alert.show(a.errors)}else{Diaspora.Alert.show(Diaspora.I18n.t("failed_to_post_message"))}},onSuccess:function(c,b,d){if(Publisher.bookmarklet==false){var a=Diaspora.page.aspectNavigation.selectedAspects().length==0;
var e=Publisher.selectedAspectIds();
if(Publisher.isPublicPost()||Publisher.isToAllAspects()){a=true}else{$.each(Diaspora.page.aspectNavigation.selectedAspects(),function(f,g){if(e.indexOf(parseInt(g))>-1){a=true}})}if(a){ContentUpdater.addPostToStream(b.html);
Diaspora.page.stream.addPost($("#"+b.post_id))}else{Diaspora.widgets.flashMessages.render({success:true,message:Diaspora.I18n.t("successfully_posted_message_to_an_aspects_that_is_not_visible")})}}Publisher.close();
Publisher.clear();
},bindAjax:function(){Publisher.form().bind("submit",Publisher.beforeSubmit);
Publisher.form().bind("ajax:loading",Publisher.onSubmit);
Publisher.form().bind("ajax:failure",Publisher.onFailure);
Publisher.form().bind("ajax:success",Publisher.onSuccess)},triggerGettingStarted:function(){Publisher.setUpPopovers("#publisher .dropdown",{trigger:"manual",offset:10,id:"message_visibility_explain",placement:"below",html:true},1000);
Publisher.setUpPopovers("#publisher #status_message_fake_text",{trigger:"manual",placement:"right",offset:30,id:"first_message_explain",html:true},600);
Publisher.setUpPopovers("#gs-shim",{trigger:"manual",placement:"left",id:"stream_explain",offset:-5,html:true},1400);
$("#publisher .button.creation").bind("click",function(){$("#publisher .dropdown").popover("hide");
$("#publisher #status_message_fake_text").popover("hide")})},setUpPopovers:function(a,b,d){var c=$(a);
c.popover(b);
c.bind("click",function(){$(this).popover("hide")});
setTimeout(function(){c.popover("show");
var e=c.data("popover").$tip[0],f=$(e).find(".close");
f.bind("click",function(){if($(".popover").length==1){$.get("/getting_started_completed")}c.popover("hide")})},d)},initialize:function(){Publisher.cachedForm=Publisher.cachedSubmit=Publisher.cachedInput=Publisher.cachedHiddenInput=false;
Publisher.bindServiceIcons();
Publisher.bindAspectToggles();
Publisher.form().delegate("#hide_publisher","click",function(){$.each(Publisher.form().find("textarea"),function(a,b){$(b).val("")});
Publisher.close()});
Publisher.autocompletion.initialize();
if(Publisher.hiddenInput().val()===""){Publisher.hiddenInput().val(Publisher.input().val())}Publisher.input().autoResize();
Publisher.input().keydown(Publisher.autocompletion.keyDownHandler);
Publisher.input().keyup(Publisher.autocompletion.keyUpHandler);
Publisher.input().mouseup(Publisher.autocompletion.keyUpHandler);
Publisher.bindAjax();
Publisher.form().find("textarea").bind("focus",function(a){Publisher.open()})}};
$(document).ready(function(){Publisher.initialize();
Diaspora.page.subscribe("stream/reloaded",Publisher.initialize)});
function toggleAspectTitle(){$("#aspect_name_title").toggleClass("hidden");
$("#aspect_name_edit").toggleClass("hidden")}function updateAspectName(a){$("#aspect_name_title .name").html(a);
$("input#aspect_name").val(a)}$(document).ready(function(){$("#rename_aspect_link").live("click",function(){toggleAspectTitle()});
$("form.edit_aspect").live("ajax:success",function(b,c,a,d){updateAspectName(c.name);
toggleAspectTitle()})});
var qq=qq||{};
qq.extend=function(b,a){for(var c in a){b[c]=a[c]}};
qq.indexOf=function(b,c,d){if(b.indexOf){return b.indexOf(c,d)}d=d||0;
var a=b.length;
if(d<0){d+=a}for(;
d<a;
d++){if(d in b&&b[d]===c){return d}}return -1};
qq.getUniqueId=(function(){var a=0;
return function(){return a++}})();
qq.attach=function(a,c,b){if(a.addEventListener){a.addEventListener(c,b,false)}else{if(a.attachEvent){a.attachEvent("on"+c,b)}}};
qq.detach=function(a,c,b){if(a.removeEventListener){a.removeEventListener(c,b,false)}else{if(a.attachEvent){a.detachEvent("on"+c,b)}}};
qq.preventDefault=function(a){if(a.preventDefault){a.preventDefault()}else{a.returnValue=false}};
qq.insertBefore=function(d,c){c.parentNode.insertBefore(d,c)};
qq.remove=function(a){a.parentNode.removeChild(a)};
qq.contains=function(b,a){if(b==a){return true}if(b.contains){return b.contains(a)}else{return !!(a.compareDocumentPosition(b)&8)}};
qq.toElement=(function(){var a=document.createElement("div");
return function(c){a.innerHTML=c;
var b=a.firstChild;
a.removeChild(b);
return b}})();
qq.css=function(a,b){if(b.opacity!==null){if(typeof a.style.opacity!="string"&&typeof(a.filters)!="undefined"){b.filter="alpha(opacity="+Math.round(100*b.opacity)+")"}}qq.extend(a.style,b)};
qq.hasClass=function(b,a){var c=new RegExp("(^| )"+a+"( |$)");
return c.test(b.className)};
qq.addClass=function(b,a){if(!qq.hasClass(b,a)){b.className+=" "+a}};
qq.removeClass=function(b,a){var c=new RegExp("(^| )"+a+"( |$)");
b.className=b.className.replace(c," ").replace(/^\s+|\s+$/g,"")};
qq.setText=function(a,b){a.innerText=b;
a.textContent=b};
qq.children=function(b){var a=[],c=b.firstChild;
while(c){if(c.nodeType==1){a.push(c)}c=c.nextSibling}return a};
qq.getByClass=function(d,e){if(d.querySelectorAll){return d.querySelectorAll("."+e)}var b=[];
var f=d.getElementsByTagName("*");
var a=f.length;
for(var c=0;
c<a;
c++){if(qq.hasClass(f[c],e)){b.push(f[c])}}return b};
qq.obj2url=function(f,b,h){var g=[],d="&",e=function(k,j){var l=b?(/\[\]$/.test(b))?b:b+"["+j+"]":j;
if((l!="undefined")&&(j!="undefined")){g.push((typeof k==="object")?qq.obj2url(k,l,true):(Object.prototype.toString.call(k)==="[object Function]")?encodeURIComponent(l)+"="+encodeURIComponent(k()):encodeURIComponent(l)+"="+encodeURIComponent(k))}};
if(!h&&b){d=(/\?/.test(b))?(/\?$/.test(b))?"":"&":"?";
g.push(b);
g.push(qq.obj2url(f))}else{if((Object.prototype.toString.call(f)==="[object Array]")&&(typeof f!="undefined")){for(var c=0,a=f.length;
c<a;
++c){e(f[c],c)}}else{if((typeof f!="undefined")&&(f!==null)&&(typeof f==="object")){for(var c in f){e(f[c],c)}}else{g.push(encodeURIComponent(b)+"="+encodeURIComponent(f))}}}return g.join(d).replace(/^&/,"").replace(/%20/g,"+")};
var qq=qq||{};
qq.FileUploaderBasic=function(a){this._options={debug:false,action:"/server/upload",params:{},button:null,multiple:true,maxConnections:3,allowedExtensions:[],sizeLimit:0,minSizeLimit:0,onSubmit:function(c,b){},onProgress:function(e,d,b,c){},onComplete:function(d,c,b){},onAllComplete:function(b){},onCancel:function(c,b){},messages:{typeError:"{file} has invalid extension. Only {extensions} are allowed.",sizeError:"{file} is too large, maximum file size is {sizeLimit}.",minSizeError:"{file} is too small, minimum file size is {minSizeLimit}.",emptyError:"{file} is empty, please select files again without it.",onLeave:"The files are being uploaded, if you leave now the upload will be cancelled."},showMessage:function(b){alert(b)}};
qq.extend(this._options,a);
this._filesInProgress=0;
this._handler=this._createUploadHandler();
if(this._options.button){this._button=this._createUploadButton(this._options.button)}this._preventLeaveInProgress()};
qq.FileUploaderBasic.prototype={setParams:function(a){this._options.params=a},getInProgress:function(){return this._filesInProgress},_createUploadButton:function(b){var a=this;
return new qq.UploadButton({element:b,multiple:this._options.multiple&&qq.UploadHandlerXhr.isSupported(),onChange:function(c){a._onInputChange(c)}})},_createUploadHandler:function(){var a=this,c;
if(qq.UploadHandlerXhr.isSupported()){c="UploadHandlerXhr"}else{c="UploadHandlerForm"}var b=new qq[c]({debug:this._options.debug,action:this._options.action,maxConnections:this._options.maxConnections,onProgress:function(g,f,d,e){a._onProgress(g,f,d,e);
a._options.onProgress(g,f,d,e)},onComplete:function(f,e,d){a._onComplete(f,e,d);
a._options.onComplete(f,e,d)},onAllComplete:function(d){a._options.onAllComplete(d)},onCancel:function(e,d){a._onCancel(e,d);
a._options.onCancel(e,d)}});
return b},_preventLeaveInProgress:function(){var a=this;
qq.attach(window,"beforeunload",function(b){if(!a._filesInProgress){return}var b=b||window.event;
b.returnValue=a._options.messages.onLeave;
return a._options.messages.onLeave})},_onSubmit:function(b,a){this._filesInProgress++},_onProgress:function(d,c,a,b){},_onComplete:function(c,b,a){this._filesInProgress--;
if(a.error){this._options.showMessage(a.error)}},_onCancel:function(b,a){this._filesInProgress--},_onInputChange:function(a){if(this._handler instanceof qq.UploadHandlerXhr){this._uploadFileList(a.files)}else{if(this._validateFile(a)){this._uploadFile(a)}}this._button.reset()},_uploadFileList:function(b){for(var a=0;
a<b.length;
a++){if(!this._validateFile(b[a])){return}}for(var a=0;
a<b.length;
a++){this._uploadFile(b[a])}},_uploadFile:function(a){var c=this._handler.add(a);
var b=this._handler.getName(c);
if(this._options.onSubmit(c,b)!==false){this._onSubmit(c,b);
this._handler.upload(c,this._options.params)}},_validateFile:function(c){var a,b;
if(c.value){a=c.value.replace(/.*(\/|\\)/,"")}else{a=c.fileName!=null?c.fileName:c.name;
b=c.fileSize!=null?c.fileSize:c.size}if(!this._isAllowedExtension(a)){this._error("typeError",a);
return false}else{if(b===0){this._error("emptyError",a);
return false}else{if(b&&this._options.sizeLimit&&b>this._options.sizeLimit){this._error("sizeError",a);
return false}else{if(b&&b<this._options.minSizeLimit){this._error("minSizeError",a);
return false}}}}return true},_error:function(c,d){var b=this._options.messages[c];
function a(e,f){b=b.replace(e,f)}a("{file}",this._formatFileName(d));
a("{extensions}",this._options.allowedExtensions.join(", "));
a("{sizeLimit}",this._formatSize(this._options.sizeLimit));
a("{minSizeLimit}",this._formatSize(this._options.minSizeLimit));
this._options.showMessage(b)},_formatFileName:function(a){if(a.length>33){a=a.slice(0,19)+"..."+a.slice(-13)}return a},_isAllowedExtension:function(d){var b=(-1!==d.indexOf("."))?d.replace(/.*[.]/,"").toLowerCase():"";
var c=this._options.allowedExtensions;
if(!c.length){return true}for(var a=0;
a<c.length;
a++){if(c[a].toLowerCase()==b){return true}}return false},_formatSize:function(a){var b=-1;
do{a=a/1024;
b++}while(a>99);
return Math.max(a,0.1).toFixed(1)+["kB","MB","GB","TB","PB","EB"][b]}};
qq.FileUploader=function(a){qq.FileUploaderBasic.apply(this,arguments);
qq.extend(this._options,{element:null,listElement:null,template:'<div class="qq-uploader"><div class="qq-upload-drop-area"><span>Drop files here to upload</span></div><div class="qq-upload-button">Upload a file</div><ul class="qq-upload-list"></ul></div>',fileTemplate:'<li><span class="qq-upload-file"></span><span class="qq-upload-spinner"></span><span class="qq-upload-size"></span><a class="qq-upload-cancel" href="#">Cancel</a><span class="qq-upload-failed-text">Failed</span></li>',classes:{button:"qq-upload-button",drop:"qq-upload-drop-area",dropActive:"qq-upload-drop-area-active",list:"qq-upload-list",file:"qq-upload-file",spinner:"qq-upload-spinner",size:"qq-upload-size",cancel:"qq-upload-cancel",success:"qq-upload-success",fail:"qq-upload-fail"}});
qq.extend(this._options,a);
this._element=this._options.element;
this._element.innerHTML=this._options.template;
this._listElement=this._options.listElement||this._find(this._element,"list");
this._classes=this._options.classes;
this._button=this._createUploadButton(this._find(this._element,"button"));
this._bindCancelEvent();
this._setupDragDrop()};
qq.extend(qq.FileUploader.prototype,qq.FileUploaderBasic.prototype);
qq.extend(qq.FileUploader.prototype,{_find:function(c,b){var a=qq.getByClass(c,this._options.classes[b])[0];
if(!a){throw new Error("element not found "+b)}return a},_setupDragDrop:function(){var b=this,c=this._find(this._element,"drop");
var a=new qq.UploadDropZone({element:c,onEnter:function(d){qq.addClass(c,b._classes.dropActive);
d.stopPropagation()},onLeave:function(d){d.stopPropagation()},onLeaveNotDescendants:function(d){qq.removeClass(c,b._classes.dropActive)},onDrop:function(d){c.style.display="none";
qq.removeClass(c,b._classes.dropActive);
b._uploadFileList(d.dataTransfer.files)}});
c.style.display="none";
qq.attach(document,"dragenter",function(d){if(!a._isValidFileDrag(d)){return}c.style.display="block"});
qq.attach(document,"dragleave",function(f){if(!a._isValidFileDrag(f)){return}var d=document.elementFromPoint(f.clientX,f.clientY);
if(!d||d.nodeName=="HTML"){c.style.display="none"}})},_onSubmit:function(b,a){qq.FileUploaderBasic.prototype._onSubmit.apply(this,arguments);
this._addToList(b,a)},_onProgress:function(g,f,a,d){qq.FileUploaderBasic.prototype._onProgress.apply(this,arguments);
var c=this._getItemByFileId(g);
var b=this._find(c,"size");
b.style.display="inline";
var e;
if(a!=d){e=Math.round(a/d*100)+"% from "+this._formatSize(d)}else{e=this._formatSize(d)}qq.setText(b,e)},_onComplete:function(d,c,a){qq.FileUploaderBasic.prototype._onComplete.apply(this,arguments);
var b=this._getItemByFileId(d);
qq.remove(this._find(b,"cancel"));
qq.remove(this._find(b,"spinner"));
if(a.success){qq.addClass(b,this._classes.success)}else{qq.addClass(b,this._classes.fail)}},_addToList:function(d,c){var a=qq.toElement(this._options.fileTemplate);
a.qqFileId=d;
var b=this._find(a,"file");
qq.setText(b,this._formatFileName(c));
this._find(a,"size").style.display="none";
this._listElement.appendChild(a)},_getItemByFileId:function(b){var a=this._listElement.firstChild;
while(a){if(a.qqFileId==b){return a}a=a.nextSibling}},_bindCancelEvent:function(){var a=this,b=this._listElement;
qq.attach(b,"click",function(f){f=f||window.event;
var d=f.target||f.srcElement;
if(qq.hasClass(d,a._classes.cancel)){qq.preventDefault(f);
var c=d.parentNode;
a._handler.cancel(c.qqFileId);
qq.remove(c)}})}});
qq.UploadDropZone=function(a){this._options={element:null,onEnter:function(b){},onLeave:function(b){},onLeaveNotDescendants:function(b){},onDrop:function(b){}};
qq.extend(this._options,a);
this._element=this._options.element;
this._disableDropOutside();
this._attachEvents()};
qq.UploadDropZone.prototype={_disableDropOutside:function(a){if(!qq.UploadDropZone.dropOutsideDisabled){qq.attach(document,"dragover",function(b){if(b.dataTransfer){b.dataTransfer.dropEffect="none";
b.preventDefault()}});
qq.UploadDropZone.dropOutsideDisabled=true}},_attachEvents:function(){var a=this;
qq.attach(a._element,"dragover",function(c){if(!a._isValidFileDrag(c)){return}var b=c.dataTransfer.effectAllowed;
if(b=="move"||b=="linkMove"){c.dataTransfer.dropEffect="move"}else{c.dataTransfer.dropEffect="copy"}c.stopPropagation();
c.preventDefault()});
qq.attach(a._element,"dragenter",function(b){if(!a._isValidFileDrag(b)){return}a._options.onEnter(b)});
qq.attach(a._element,"dragleave",function(c){if(!a._isValidFileDrag(c)){return}a._options.onLeave(c);
var b=document.elementFromPoint(c.clientX,c.clientY);
if(qq.contains(this,b)){return}a._options.onLeaveNotDescendants(c)});
qq.attach(a._element,"drop",function(b){if(!a._isValidFileDrag(b)){return}b.preventDefault();
a._options.onDrop(b)})},_isValidFileDrag:function(c){var b=c.dataTransfer,a=navigator.userAgent.indexOf("AppleWebKit")>-1;
return b&&b.effectAllowed!="none"&&(b.files||(!a&&b.types.contains&&b.types.contains("Files")))}};
qq.UploadButton=function(a){this._options={element:null,multiple:false,name:"file",onChange:function(b){},hoverClass:"qq-upload-button-hover",focusClass:"qq-upload-button-focus"};
qq.extend(this._options,a);
this._element=this._options.element;
qq.css(this._element,{position:"relative",direction:"ltr"});
this._input=this._createInput()};
qq.UploadButton.prototype={getInput:function(){return this._input},reset:function(){if(this._input.parentNode){qq.remove(this._input)}qq.removeClass(this._element,this._options.focusClass);
this._input=this._createInput()},_createInput:function(){var b=document.createElement("input");
if(this._options.multiple){b.setAttribute("multiple","multiple")}b.setAttribute("type","file");
b.setAttribute("name",this._options.name);
qq.css(b,{position:"absolute",right:0,top:0,margin:0,padding:0,opacity:0});
this._element.appendChild(b);
var a=this;
qq.attach(b,"change",function(){a._options.onChange(b)});
qq.attach(b,"mouseover",function(){qq.addClass(a._element,a._options.hoverClass)});
qq.attach(b,"mouseout",function(){qq.removeClass(a._element,a._options.hoverClass)});
qq.attach(b,"focus",function(){qq.addClass(a._element,a._options.focusClass)});
qq.attach(b,"blur",function(){qq.removeClass(a._element,a._options.focusClass)});
if(window.attachEvent){b.setAttribute("tabIndex","-1")}return b}};
qq.UploadHandlerAbstract=function(a){this._options={debug:false,action:"/upload.php",maxConnections:999,onProgress:function(e,d,b,c){},onComplete:function(d,c,b){},onAllComplete:function(b){},onCancel:function(c,b){}};
qq.extend(this._options,a);
this._queue=[];
this._params=[];
this._completed_files=[]};
qq.UploadHandlerAbstract.prototype={log:function(a){if(this._options.debug&&window.console){console.log("[uploader] "+a)}},add:function(a){},upload:function(d,b){var a=this._queue.push(d);
var c={};
qq.extend(c,b);
this._params[d]=c;
if(a<=this._options.maxConnections){this._upload(d,this._params[d])}},cancel:function(a){this._cancel(a);
this._dequeue(a)},cancelAll:function(){for(var a=0;
a<this._queue.length;
a++){this._cancel(this._queue[a])}this._queue=[]},getName:function(a){},getSize:function(a){},getQueue:function(){return this._queue},_upload:function(a){},_cancel:function(a){},_dequeue:function(d){var b=qq.indexOf(this._queue,d);
this._queue.splice(b,1);
var a=this._options.maxConnections;
if(this._queue.length>=a){var c=this._queue[a-1];
this._upload(c,this._params[c])}if(this._queue.length==0){this._onAllComplete()}},_onAllComplete:function(){this._options.onAllComplete(this._completed_files)}};
qq.UploadHandlerForm=function(a){qq.UploadHandlerAbstract.apply(this,arguments);
this._inputs={}};
qq.extend(qq.UploadHandlerForm.prototype,qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerForm.prototype,{add:function(a){a.setAttribute("name","qqfile");
var b="qq-upload-handler-iframe"+qq.getUniqueId();
this._inputs[b]=a;
if(a.parentNode){qq.remove(a)}return b},getName:function(a){return this._inputs[a].value.replace(/.*(\/|\\)/,"")},_cancel:function(b){this._options.onCancel(b,this.getName(b));
delete this._inputs[b];
var a=document.getElementById(b);
if(a){a.setAttribute("src","javascript:false;
");
qq.remove(a)}},_upload:function(g,e){var b=this._inputs[g];
if(!b){throw new Error("file with passed id was not added, or already uploaded or cancelled")}var f=this.getName(g);
var c=this._createIframe(g);
var d=this._createForm(c,e);
d.appendChild(b);
$(d).append($('<input type="hidden" name="authenticity_token" value="'+$("meta[name='csrf-token']").attr("content")+'"/>'));
var a=this;
this._attachLoadEvent(c,function(){a.log("iframe loaded");
var h=a._getIframeContentJSON(c);
a._options.onComplete(g,f,h);
a._dequeue(g);
delete a._inputs[g];
setTimeout(function(){qq.remove(c)},1)});
d.submit();
qq.remove(d);
return g},_attachLoadEvent:function(a,b){qq.attach(a,"load",function(){if(!a.parentNode){return}if(a.contentDocument&&a.contentDocument.body&&a.contentDocument.body.innerHTML=="false"){return}b()})},_getIframeContentJSON:function(iframe){var doc=iframe.contentDocument?iframe.contentDocument:iframe.contentWindow.document,response;
this.log("converting iframe's innerHTML to JSON");
this.log("innerHTML = "+doc.body.innerHTML);
try{response=eval("("+doc.body.innerHTML+")")}catch(err){response={}}return response},_createIframe:function(b){var a=qq.toElement('<iframe src="javascript:false;
" name="'+b+'" />');
a.setAttribute("id",b);
a.style.display="none";
document.body.appendChild(a);
return a},_createForm:function(a,c){var b=qq.toElement('<form method="post" enctype="multipart/form-data"></form>');
var d=qq.obj2url(c,this._options.action);
b.setAttribute("action",d);
b.setAttribute("target",a.name);
b.style.display="none";
document.body.appendChild(b);
return b}});
qq.UploadHandlerXhr=function(a){qq.UploadHandlerAbstract.apply(this,arguments);
this._files=[];
this._xhrs=[];
this._loaded=[]};
qq.UploadHandlerXhr.isSupported=function(){var a=document.createElement("input");
a.type="file";
return("multiple" in a&&typeof File!="undefined"&&typeof(new XMLHttpRequest()).upload!="undefined")};
qq.extend(qq.UploadHandlerXhr.prototype,qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerXhr.prototype,{add:function(a){if(!(a instanceof File)){throw new Error("Passed obj in not a File (in qq.UploadHandlerXhr)")}return this._files.push(a)-1},getName:function(b){var a=this._files[b];
return a.fileName!=null?a.fileName:a.name},getSize:function(b){var a=this._files[b];
return a.fileSize!=null?a.fileSize:a.size},getLoaded:function(a){return this._loaded[a]||0},_upload:function(h,f){var d=this._files[h],b=this.getName(h),c=this.getSize(h);
this._loaded[h]=0;
var e=this._xhrs[h]=new XMLHttpRequest();
var a=this;
e.upload.onprogress=function(i){if(i.lengthComputable){a._loaded[h]=i.loaded;
a._options.onProgress(h,b,i.loaded,i.total)}};
e.onreadystatechange=function(){if(e.readyState==4){a._onComplete(h,e)}};
f=f||{};
f.qqfile=b;
var g=qq.obj2url(f,this._options.action);
e.open("POST",g,true);
e.setRequestHeader("X-Requested-With","XMLHttpRequest");
e.setRequestHeader("X-File-Name",encodeURIComponent(b));
e.setRequestHeader("Content-Type","application/octet-stream");
e.setRequestHeader("X-CSRF-Token",$("meta[name='csrf-token']").attr("content"));
e.send(d)},_onComplete:function(id,xhr){if(!this._files[id]){return}var name=this.getName(id);
var size=this.getSize(id);
this._options.onProgress(id,name,size,size);
if(xhr.status==200){this.log("xhr - server response received");
this.log("responseText = "+xhr.responseText);
var response;
try{response=eval("("+xhr.responseText+")")}catch(err){response={}}this._completed_files.push({file:this._files[id],response:response});
this._options.onComplete(id,name,response)}else{this._completed_files.push({file:this._files[id],response:{}});
this._options.onComplete(id,name,{})}this._files[id]=null;
this._xhrs[id]=null;
this._dequeue(id)},_cancel:function(a){this._options.onCancel(a,this.getName(a));
this._files[a]=null;
if(this._xhrs[a]){this._xhrs[a].abort();
this._xhrs[a]=null}}});
