(function($){var counter=0;var elements=[];var timer;function Sparkline(){return{init:function(data,parent){elements.push(this);if(!timer)timer=setTimeout(waitRenderer,333)},___:"_Prtg.Sparklines"}}function waitRenderer(){timer=null;while(counter<3&&elements.length>0)render(elements.pop());if(elements.length>0)timer=setTimeout(waitRenderer,333)}function render(elm){counter++;var myobject=$(elm);var sparklinegraphwidth=$(elm).parent().width()-1;var sparklinegraphheight=$(elm).parent().height();var data=
myobject.data();if(myobject.length>0){myobject.removeClass("sparklinetodo").sparkline(data.error,{type:"line",width:sparklinegraphwidth+"px",height:sparklinegraphheight+"px",lineColor:"#E9979B",fillColor:"#FDD5D7",chartRangeMin:0,spotRadius:0,disableInteraction:true});if(data.graph&&data.graph.length)myobject.sparkline(data.graph,{type:"line",composite:"true",lineColor:"#aaaaaa",fillColor:"#dddddd",spotRadius:0,disableInteraction:true})}counter--;elm=null}function renderd3(elm){counter++;var myobject=
$(elm);var pxwidth=$(elm).parent().width()-1;var pxheight=$(elm).parent().height();var data=myobject.data();var graph=d3.select(elm).append("svg:svg").attr("width",pxwidth+"px").attr("height",pxheight+"px");var maxd=d3.max(data.graph);var maxe=d3.max(data.error);var xd=d3.scale.linear().domain([0,data.graph.length-1]).range([0,pxwidth-1]);var yd=d3.scale.linear().domain([0,Math.max(maxd,maxe)]).rangeRound([pxheight-1,0]);var xe=d3.scale.linear().domain([0,data.error.length-1]).range([0,pxwidth-1]);
var ye=d3.scale.linear().domain([0,Math.max(maxd,maxe)]).rangeRound([pxheight-1,0]);var dataarea=d3.svg.area().x(function(d,i){return xd(i)}).y0(pxheight).y1(function(d){return yd(d)}).interpolate("linear");var errorline=d3.svg.line().x(function(d,i){return xe(i)}).y(function(d){return ye(d)}).interpolate("linear");graph.append("svg:path").attr("class","error").attr("d",errorline(data.error));graph.append("svg:path").attr("class","data").attr("d",dataarea(data.graph));counter--;elm=null}$.extend(true,
window,{_Prtg:{Plugins:{Sparkline:Sparkline()}}})})(jQuery);