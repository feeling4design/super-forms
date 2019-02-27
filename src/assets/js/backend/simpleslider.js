var __slice=[].slice,__indexOf=[].indexOf||function(t){for(var i=0,e=this.length;i<e;i++)if(i in this&&this[i]===t)return i;return-1};!function(n,t){var r;r=function(){function SimpleSlider(t,i){var e,s=this;this.input=t,this.defaultOptions={animate:!0,snapMid:!1,classPrefix:null,classSuffix:null,theme:null,highlight:!1},this.settings=n.extend({},this.defaultOptions,i),this.settings.theme&&(this.settings.classSuffix="-"+this.settings.theme),this.input.hide(),this.slider=n("<div>").addClass("slider"+(this.settings.classSuffix||"")).css({position:"relative",userSelect:"none",boxSizing:"border-box"}).insertBefore(this.input),this.input.attr("id")&&this.slider.attr("id",this.input.attr("id")+"-slider"),this.track=this.createDivElement("track").css({width:"100%"}),this.settings.highlight&&(this.highlightTrack=this.createDivElement("highlight-track").css({width:"0"})),this.dragger=this.createDivElement("dragger"),this.slider.css({minHeight:this.dragger.outerHeight(),marginLeft:this.dragger.outerWidth()/2,marginRight:this.dragger.outerWidth()/2}),this.track.css({marginTop:this.track.outerHeight()/-2}),this.settings.highlight&&this.highlightTrack.css({marginTop:this.track.outerHeight()/-2}),this.dragger.css({marginTop:this.dragger.outerHeight()/-2,marginLeft:this.dragger.outerWidth()/-2}),this.track.mousedown(function(t){return s.trackEvent(t)}),this.settings.highlight&&this.highlightTrack.mousedown(function(t){return s.trackEvent(t)}),this.dragger.mousedown(function(t){if(1===t.which)return s.dragging=!0,s.dragger.addClass("dragging"),s.domDrag(t.pageX,t.pageY),!1}),n("body").mousemove(function(t){if(s.dragging)return s.domDrag(t.pageX,t.pageY),n("body").css({cursor:"pointer"})}).mouseup(function(t){if(s.dragging)return s.dragging=!1,s.dragger.removeClass("dragging"),n("body").css({cursor:"auto"})}),this.pagePos=0,""===this.input.val()?(this.value=this.getRange().min,this.input.val(this.value)):this.value=this.nearestValidValue(this.input.val()),this.setSliderPositionFromValue(this.value),e=this.valueToRatio(this.value),this.input.trigger("slider:ready",{value:this.value,ratio:e,position:e*this.slider.outerWidth(),el:this.slider}),this.dragger.bind("touchstart",function(t){return s.dragging=!0,s.dragger.addClass("dragging"),s.domDrag(t.originalEvent.touches[0].pageX,t.originalEvent.touches[0].pageY),!1}),n("body").bind("touchmove",function(t){if(s.dragging)return s.domDrag(t.originalEvent.touches[0].pageX,t.originalEvent.touches[0].pageY),!1}).bind("touchend",function(t){if(s.dragging)return s.dragging=!1,s.dragger.removeClass("dragging"),n("body").css({cursor:"auto"})})}return SimpleSlider.prototype.createDivElement=function(t){return n("<div>").addClass(t).css({position:"absolute",top:"50%",userSelect:"none",cursor:"pointer"}).appendTo(this.slider)},SimpleSlider.prototype.setRatio=function(t){var i;return t=Math.min(1,t),t=Math.max(0,t),i=this.ratioToValue(t),this.setSliderPositionFromValue(i),this.valueChanged(i,t,"setRatio")},SimpleSlider.prototype.setValue=function(t){var i;return t=this.nearestValidValue(t),i=this.valueToRatio(t),this.setSliderPositionFromValue(t),this.valueChanged(t,i,"setValue")},SimpleSlider.prototype.trackEvent=function(t){if(1===t.which)return this.domDrag(t.pageX,t.pageY,!0),!(this.dragging=!0)},SimpleSlider.prototype.domDrag=function(t,i,e){var s,a,r;if(null==e&&(e=!1),s=t-this.slider.offset().left,s=Math.min(this.slider.outerWidth(),s),s=Math.max(0,s),this.pagePos!==s)return a=(this.pagePos=s)/this.slider.outerWidth(),r=this.ratioToValue(a),this.valueChanged(r,a,"domDrag"),this.settings.snap?this.setSliderPositionFromValue(r,e):this.setSliderPosition(s,e)},SimpleSlider.prototype.setSliderPosition=function(t,i){if(null==i&&(i=!1),i&&this.settings.animate){if(this.dragger.animate({left:t},200),this.settings.highlight)return this.highlightTrack.animate({width:t},200)}else if(this.dragger.css({left:t}),this.settings.highlight)return this.highlightTrack.css({width:t})},SimpleSlider.prototype.setSliderPositionFromValue=function(t,i){var e;return null==i&&(i=!1),e=this.valueToRatio(t),this.setSliderPosition(e*this.slider.outerWidth(),i)},SimpleSlider.prototype.getRange=function(){return this.settings.allowedValues?{min:Math.min.apply(Math,this.settings.allowedValues),max:Math.max.apply(Math,this.settings.allowedValues)}:this.settings.range?{min:parseFloat(this.settings.range[0]),max:parseFloat(this.settings.range[1])}:{min:0,max:1}},SimpleSlider.prototype.nearestValidValue=function(t){var i,e,s,a;return s=this.getRange(),t=Math.min(s.max,t),t=Math.max(s.min,t),this.settings.allowedValues?(i=null,n.each(this.settings.allowedValues,function(){if(null===i||Math.abs(this-t)<Math.abs(i-t))return i=this}),i):this.settings.step?(e=(s.max-s.min)/this.settings.step,a=Math.floor((t-s.min)/this.settings.step),(t-s.min)%this.settings.step>this.settings.step/2&&a<e&&(a+=1),a*this.settings.step+s.min):t},SimpleSlider.prototype.valueToRatio=function(t){var i,e,s,a,r,n,h,l;if(this.settings.equalSteps){for(a=n=0,h=(l=this.settings.allowedValues).length;n<h;a=++n)i=l[a],(null==e||Math.abs(i-t)<Math.abs(e-t))&&(e=i,s=a);return this.settings.snapMid?(s+.5)/this.settings.allowedValues.length:s/(this.settings.allowedValues.length-1)}return(t-(r=this.getRange()).min)/(r.max-r.min)},SimpleSlider.prototype.ratioToValue=function(t){var i,e,s,a,r;return this.settings.equalSteps?(r=this.settings.allowedValues.length,a=Math.round(t*r-.5),i=Math.min(a,this.settings.allowedValues.length-1),this.settings.allowedValues[i]):(s=t*((e=this.getRange()).max-e.min)+e.min,this.nearestValidValue(s))},SimpleSlider.prototype.valueChanged=function(t,i,e){var s;if(t.toString()!==this.value.toString())return t=parseFloat(t.toFixed(2)),s={value:this.value=t,ratio:i,position:i*this.slider.outerWidth(),trigger:e,el:this.slider},this.input.val(t).trigger(n.Event("change",s)).trigger("slider:changed",s)},SimpleSlider}(),n.extend(n.fn,{simpleSlider:function(){var e,s,a;return a=arguments[0],e=2<=arguments.length?__slice.call(arguments,1):[],s=["setRatio","setValue"],n(this).each(function(){var t,i;return a&&0<=__indexOf.call(s,a)?(t=n(this).data("slider-object"))[a].apply(t,e):(i=a,n(this).data("slider-object",new r(n(this),i)))})}}),n(function(){return n("[data-slider]").each(function(){var t,a,i,r;return t=n(this),i={},(a=t.data("slider-values"))&&(i.allowedValues=function(){var t,i,e,s;for(s=[],t=0,i=(e=a.split(",")).length;t<i;t++)r=e[t],s.push(parseFloat(r));return s}()),t.data("slider-range")&&(i.range=t.data("slider-range").split(",")),t.data("slider-step")&&(i.step=t.data("slider-step")),i.snap=t.data("slider-snap"),i.equalSteps=t.data("slider-equal-steps"),t.data("slider-theme")&&(i.theme=t.data("slider-theme")),t.attr("data-slider-highlight")&&(i.highlight=t.data("slider-highlight")),null!=t.data("slider-animate")&&(i.animate=t.data("slider-animate")),t.simpleSlider(i)})})}(this.jQuery||this.Zepto);