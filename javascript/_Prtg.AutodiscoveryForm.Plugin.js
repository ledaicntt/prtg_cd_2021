(function($,window,document,undefined){var pluginName="autodiscovery-form";function Plugin(element,data,parent){this.$elm=$(element);this.init(this.$elm,data)}Plugin.prototype.init=function(me,data){me.find('label[for="discoverytype0"]').hide();if(data.type==="template")me.find("#discoverytype2").prop("checked",true).trigger("click");else me.find("#discoverytype1").prop("checked",true).trigger("click")};$.fn[pluginName]=function(options,parent){return this.each(function(){if(!$.data(this,"plugin_"+
pluginName))$.data(this,"plugin_"+pluginName,new Plugin(this,options,parent))})}})(jQuery,window,document);
