(function($,window,document,undefined){var pluginName="multiedit";function Plugin(element,data,parent){this.element=$(element);this.data=data;this.parent=parent;this.inline=this.element.closest(".multieditscrollcontainer").length>0;if(this.element.find(".control-activation").length)this.element.find(".control-group .controls").find("input,select,textarea,label").not().attr("disabled","disabled");data.inline=this.inline;this.element["prtg-form"](data,parent);this.init(this)}Plugin.prototype.init=function(me){me.element.on("change."+
pluginName,"input.multieditactivecheckbox",function(){var $self=$(this);if($self.is(":checked"))$self.nextAll(".controls").first().find("input,select,textarea,label").removeAttr("disabled");else $self.nextAll(".controls").first().find("input,select,textarea,label").attr("disabled","disabled")}).on("destroyed",function(){if(me.$scrollable)me.$scrollable.off(".inline");$(window).off("."+pluginName);$(document).off("."+pluginName);me.element.off("."+pluginName)});if(this.element.closest(".editsettings.inline").length>
0)me.element.find('[data-placement="right"]').attr("data-placement","left");if(me.inline)me.element.addClass("inlinescroll")};$.fn[pluginName]=function(options,parent){return this.each(function(){if(!$.data(this,"plugin_"+pluginName))$.data(this,"plugin_"+pluginName,new Plugin(this,options,parent))})}})(jQuery,window,document);