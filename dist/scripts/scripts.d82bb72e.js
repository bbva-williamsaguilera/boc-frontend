"use strict";angular.module("bocFrontendApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","nvd3ChartDirectives","d3"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"ApihourCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("bocFrontendApp").controller("ApihourCtrl",["$scope","backendApi","$http","$interval",function(a,b,c,d){function e(){for(var b=0;b<a.rooms.length;b++){var c=a.rooms[b],d={light:Math.round(10*(90*Math.random()+40))/10,temperature:Math.round(10*(12*Math.random()+20))/10,humidity:Math.round(10*(6*Math.random()+42))/10,volume:Math.round(10*(50*Math.random()+30))/10};c.metrics=d}}function f(){var b=angular.copy(a.currentRoom);b++,b>=a.rooms.length&&(b=0),a.currentRoom=b,$(".monitor-category").fadeOut(500,function(){$(".monitor-category").fadeIn(500)})}function g(a,b,c,d,e){c="undefined"!=typeof c?c:!1,d="undefined"!=typeof d?d:!1,e="undefined"!=typeof e?e:!1;var f=b,g=-1*b;c===!0&&(g=0);var h=Math.round(parseInt(a)+(Math.random()*(f-g)+g));return d!==!1&&d>h&&(h=d),e!==!1&&h>e&&(h=e),h}function h(){a.loadState.locations!==!1&&(k(),j())}function i(){a.loadState.dataGenerics>=a.genericLoad.length&&a.loadState.dataDevices>=a.devices.length&&(a.monitorizeData=angular.copy(a.monitorize))}function j(){if(a.loadState.initialGenerics!==!0)for(var b=0;b<a.genericLoad.length;b++)a.loadGenericData(a.genericLoad[b])}function k(){a.loadState.devices!==!0&&(a.devices=[{device:"entrada-device"},{device:"auditorio-device"},{device:"patio-device"}],a.loadState.devices=!0,l())}function l(){if(a.loadState.initialData!==!0)for(var b=0;b<a.devices.length;b++)a.loadDeviceData(a.devices[b])}a.devices=[],a.mqttClient=null,a.monitorize=[],a.monitorizeData=[],a.dataPushTimer=4e3,a.testHoursToAdd=0,a.roomRotationTime=1e4,a.hour=moment().add(a.testHoursToAdd,"hours").format("HH:mm"),a.cDay=moment().format("D MMM YYYY"),a.currentRoom=0,a.hoursToMonitorize=12,a.lastMonitorizedMoment=moment().add(a.testHoursToAdd,"hours").subtract(a.hoursToMonitorize,"hours"),a.currentHours=[],a.getCurrentHours=function(){for(var b=[],c=100/a.hoursToMonitorize,d=0;d<a.hoursToMonitorize;d++){var e=moment().subtract(a.hoursToMonitorize-d,"hours");b.push({hour:e.format("HH")+":"+e.format("mm"),position:c*d})}a.currentHours=b},a.loadState={locations:!1,devices:!1,initialGenerics:!1,initialData:!1,mqttConnection:!1,dataDevices:0,dataGenerics:0},a.wifiData=[{title:"",data:[{tag:"Friday",value:120,color:"#3E3E3D"},{tag:"Saturday",value:130,color:"#3E3E3D"},{tag:"Sunday",value:150,color:"#3E3E3D"},{tag:"Monday",value:180,color:"#3E3E3D"},{tag:"Tuesday",value:173,color:"#3E3E3D"},{tag:"Wednesday",value:168,color:"#3E3E3D"},{tag:"Today",value:382,color:"#177B57"}]}],a.metrics={costeElectrico:[150,60,70,20,60,20,110,70,50,30,60,30],esperaCafeteria:"15",asistentes:{total:150,actual:20},ocupacion:{planta1:10,planta2:8,planta3:51},detalleOcupacion:[{sala1:!0},{sala2:!1},{sala3:!0},{sala4:!0},{sala5:!1},{sala6:!0},{sala7:!0},{sala8:!0},{sala9:!0},{sala10:!0},{sala11:!0},{"bano-minus":!0},{"bano-hombre-1":!0},{"bano-hombre-2":!0},{"bano-hombre-3":!1},{"bano-hombre-4":!0},{"bano-hombre-5":!0},{"bano-mujer-1":!1},{"bano-mujer-2":!1},{"bano-mujer-3":!1},{"bano-mujer-4":!0},{"bano-mujer-5":!1}]},a.rooms=[{name:"Room 1"},{name:"Room 2"},{name:"Room 3"},{name:"Room 4"},{name:"Room 5"},{name:"Room 6"},{name:"Room 7"},{name:"Room 8"}],e(),d(e,a.dataPushTimer),d(f,a.roomRotationTime),a.checkAvailability=function(){for(var b={},c=[],d=0;d<a.metrics.detalleOcupacion.length;d++){var e=a.metrics.detalleOcupacion[d],f=Object.keys(e)[0],g="";"bano"===f.substring(0,f.indexOf("-"))?(g=f.substring(f.indexOf("-")+1),g.indexOf("-")>=0&&(g=g.substring(0,g.indexOf("-")))):g="salas",Object.keys(b).indexOf(g)<0&&(b[g]=[0,0]),b[g][1]++,c.push(e[f]),e[f]===!0&&b[g][0]++}a.metrics.disponibilidad=b,a.metrics.floorOcupacion=c},a.checkAvailability(),a.loadState.locations!==!0&&c.get("misc/locations.json").then(function(b){a.monitorize=b.data,a.loadState.locations=!0,h()}),a.tick=function(){a.hour=moment().add(a.testHoursToAdd,"hours").format("HH:mm"),a.lastMonitorizedMoment=moment().add(a.testHoursToAdd,"hours").subtract(a.hoursToMonitorize,"hours"),a.getCurrentHours(),a.cleanMonitorData(),a.randomizeData()},d(a.tick,3e3),a.randomCounter=0,a.randomizeData=function(){if(a.randomCounter>=3){a.randomCounter=0;for(var b=0;b<a.metrics.detalleOcupacion.length;b++){var c=a.metrics.detalleOcupacion[b],d=Object.keys(c)[0];c[d]=Math.random()>=.5}a.checkAvailability(),a.metrics.asistentes.actual=g(a.metrics.asistentes.actual,20,!1,30,a.metrics.asistentes.total);var e=a.metrics.esperaCafeteria;e=g(e,8,!1,0,99),a.metrics.esperaCafeteria=e;var f=g(a.wifiData[0].data[a.wifiData[0].data.length-1].value,3,!1,0);a.wifiData[0].data[a.wifiData[0].data.length-1].value=f}a.metrics.ocupacion.planta1=g(a.metrics.ocupacion.planta1,3,!1,0,99),a.metrics.ocupacion.planta2=g(a.metrics.ocupacion.planta2,3,!1,0,99),a.metrics.ocupacion.planta3=g(a.metrics.ocupacion.planta3,3,!1,0,99),a.randomCounter++},a.cleanMonitorData=function(){if(a.monitorizeData.length>0)for(var b=moment().add(a.testHoursToAdd,"hours").subtract(a.hoursToMonitorize+2,"hours").format("x"),c=0;c<a.monitorizeData.length;c++)for(var d=0;d<a.monitorizeData[c].locations.length;d++){var e=a.monitorizeData[c].locations[d];if(e.data&&e.data.length>0){for(var f=0,g=0;g<e.data.length&&!(e.data[g][0]>=b);g++)f++;e.data.splice(0,f)}}},a.genericLoad=[{key:"volume"}],a.loadGenericData=function(b){for(var c=[],d=10,e=moment().format("x"),f=moment().subtract(a.hoursToMonitorize,"hours").format("x"),g=(e-f)/(a.hoursToMonitorize*d),h=0;h<a.hoursToMonitorize*d;h++){var j=parseInt(f)+parseInt(g*h),k=moment(parseInt(j),"x").format("YYYY-MM-DDTHH:mm:ss.SSS"),l=Math.round(10*(50*Math.random()+30))/10,m={volume:l,date:k};c.push(m)}for(h=0;h<a.monitorize.length;h++)for(var n=a.monitorize[h],o=0;o<n.locations.length;o++)if(n.locations[o].generic&&n.locations[o].generic.indexOf(b.key)>=0){void 0===n.locations[o].data&&(n.locations[o].data=[]);for(var p=0;p<c.length;p++){var q=c[p],r=parseInt(moment(q.date).format("x"));n.datum&&q[n.datum]&&n.locations[o].data.push([r,q[n.datum]])}n.locations[o].data.sort(function(a,b){return a[0]-b[0]})}a.loadState.dataGenerics++,i()},a.loadDeviceData=function(b){for(var c=[],d=5,e=moment().format("x"),f=moment().subtract(a.hoursToMonitorize,"hours").format("x"),g=(e-f)/(a.hoursToMonitorize*d),h=0;h<a.hoursToMonitorize*d;h++){var j=parseInt(f)+parseInt(g*h),k=moment(parseInt(j),"x").format("YYYY-MM-DDTHH:mm:ss.SSS"),l=Math.round(10*(12*Math.random()+20))/10,m=Math.round(10*(6*Math.random()+42))/10,n=Math.round(10*(90*Math.random()+40))/10,o={ambient_temperature:l,humidity:m,lux:n,device:b.device,date:k};c.push(o)}for(h=0;h<a.monitorize.length;h++)for(var p=a.monitorize[h],q=0;q<p.locations.length;q++)if(p.locations[q].devices&&p.locations[q].devices.indexOf(b.device)>=0){void 0===p.locations[q].data&&(p.locations[q].data=[]);for(var r=0;r<c.length;r++){var s=c[r],t=parseInt(moment(s.date).format("x"));p.datum&&s[p.datum]&&p.locations[q].data.push([t,s[p.datum]])}p.locations[q].data.sort(function(a,b){return a[0]-b[0]})}a.loadState.dataDevices++,i()},a.dataPushing=0,a.pushDataPool=function(){var b,c=[],d=moment().format("YYYY-MM-DDTHH:mm:ss.SSS"),e=Math.round(10*(50*Math.random()+30))/10,f={mqtt_topic:"quasar/volume",topic_var:"volume",mqtt_object:{volume:e,date:d}};if(c.push(f),a.dataPushing>=5){for(b=0;b<a.devices.length;b++){var g=Math.round(10*(12*Math.random()+20))/10,h=Math.round(10*(6*Math.random()+42))/10,i=Math.round(10*(90*Math.random()+40))/10;f={mqtt_topic:"quasar/datum",topic_var:"datum",mqtt_object:{ambient_temperature:g,humidity:h,lux:i,device:a.devices[b].device,date:d}},c.push(f)}a.dataPushing=0}for(b=0;b<c.length;b++)for(var j=0;j<a.monitorizeData.length;j++){var k=a.monitorizeData[j];if(k.mqtt===c[b].mqtt_topic&&c[b].mqtt_object[k.datum])for(var l=0;l<k.locations.length;l++){var m=!1;k.locations[l].generic&&k.locations[l].generic.indexOf(c[b].topic_var)>=0&&(m=!0),k.locations[l].devices&&c[b].mqtt_object.device&&k.locations[l].devices.indexOf(c[b].mqtt_object.device)>=0&&(m=!0),void 0===k.locations[l].data&&(k.locations[l].data=[]);var n=moment().format("x");m===!0&&k.locations[l].data.push([n,c[b].mqtt_object[k.datum]])}}a.dataPushing++},d(a.pushDataPool,a.dataPushTimer),a.manageMqttMessage=function(b,c){var d=b.split("/");if(console.log(b,c.toString()),"quasar"===d[0])switch(d[d.length-1]){case"volume":case"datum":break;case"tweet":a.tweetData[1].data[1].value=parseInt(a.tweetData[1].data[1].value)+1;break;case"hashtag":a.tweetData[0].data[1].value=parseInt(a.tweetData[0].data[1].value)+1;break;default:if("metrics"===d[1])switch(d[2]){case"cafeteria":a.metrics.esperaCafeteria=c.toString();break;case"ocupacion":a.metrics.ocupacion.planta1=c.toString();break;case"asistentes":a.metrics.asistentes.actual=parseInt(c.toString()),a.checkAssistance();break;case"entradas":a.metrics.edificio.entradas=parseInt(c.toString());break;case"salidas":a.metrics.edificio.salidas=parseInt(c.toString());break;case"wifi":a.wifiData[0].data[a.wifiData[0].data.length-1].value=parseInt(c.toString());break;case"tweet":a.tweetData[1].data[1].value=parseInt(c.toString());break;case"hashtag":a.tweetData[0].data[1].value=parseInt(c.toString());break;case"bano-mujer-1":case"bano-mujer-2":case"bano-hombre-1":case"bano-hombre-2":case"bano-minus":var e=!1;"true"===c.toString()&&(e=!0),a.metrics.detalleOcupacion[3].ocupacion[d[2]]=e,a.checkAvailability()}}},a.getCurrentTimeWidth=function(b,c){if(void 0!==b&&void 0!==c){var d=a.hour.split(":");b=b.split(":"),c=c.split(":"),d=moment().hour(d[0]).minute(d[1]).format("x"),b=moment().hour(b[0]).minute(b[1]).format("x"),c=moment().hour(c[0]).minute(c[1]).format("x");var e=c-b;return d-=b,Math.round(85*d/e)}return 0}}]),angular.module("bocFrontendApp").factory("backendApi",["$http",function(a){function b(){return a.get(h+"sensortag")}function c(b){return a.get(h+"datum?device="+b+"&after="+j+"&limit="+k)}function d(b,c){return c=void 0!==c?"/"+c:"",a.get(h+"generic/"+b+c+"?after="+j+"&limit="+k)}function e(){return a.get("misc/speakers.json")}function f(b){return a.get(h+"generic/aggregate/"+b+"?index=volume&threshold=2&after="+j+"&limit="+k)}function g(){return a.get("misc/schedule.json")}var h,i=!1;h=i?"http://localhost:9000/api/":"http://52.18.80.55/api/";var j=moment().subtract(6,"hours").format("YYYY-MM-DD hh:mm:ss"),k=20;return{getDevices:b,getSensorData:c,getGenericData:d,getScheduleData:g,getGenericVolumeData:f,getSpeakers:e}}]),angular.module("bocFrontendApp").directive("barChart",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(d,e,f){c.d3().then(function(c){var g,h=parseInt(f.margin)||20,i=parseInt(f.barHeight)||20,j=parseInt(f.barPadding)||5,k=c.select(e[0]).append("svg").style("width","100%");a.onresize=function(){},d.$watch(function(){return angular.element(a)[0].innerWidth},function(){d.render(d.data)}),d.$watch("data",function(a){d.render(a)},!0),d.render=function(a){k.selectAll("*").remove(),a&&(g&&clearTimeout(g),g=b(function(){var b=c.select(e[0])[0][0].offsetWidth;(void 0===b||0>=b)&&(b=k[0][0].offsetWidth),b-=h;var f=d.data.length*(i+j),g=c.scale.category20(),l=c.scale.linear().domain([0,c.max(a,function(a){return a.score})]).range([0,b]);k.attr("height",f),k.selectAll("rect").data(a).enter().append("rect").on("click",function(a){return d.onClick({item:a})}).attr("height",i).attr("width",140).attr("x",Math.round(h/2)).attr("y",function(a,b){return b*(i+j)}).attr("fill",function(a){return g(a.score)}).transition().duration(1e3).attr("width",function(a){return l(a.score)}),k.selectAll("text").data(a).enter().append("text").attr("fill","#fff").attr("y",function(a,b){return b*(i+j)+15}).attr("x",15).text(function(a){return a.name+" (scored: "+a.score+")"})},200))}})}}}]),angular.module("bocFrontendApp").directive("sparkline",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(d,e){c.d3().then(function(c){function f(a,b){var c=parseInt(a.slice(1),16),d=Math.round(2.55*b),e=(c>>16)+d,f=(c>>8&255)+d,g=(255&c)+d;return"#"+(16777216+65536*(255>e?1>e?0:e:255)+256*(255>f?1>f?0:f:255)+(255>g?1>g?0:g:255)).toString(16).slice(1)}function g(a,b){var c,d,e,f;if(a&&a.length>0){for(var g=0;g<a.length;g++)("number"!=typeof c||a[g][b]>e)&&(c=g,e=a[g][b]),("number"!=typeof d||a[g][b]<f)&&(d=g,f=a[g][b]);return{max:a[c],min:a[d]}}return{max:null,min:null}}var h,i=500,j=c.select(e[0]).append("svg").style("width","100%"),k=.2,l=c.select(e[0])[0][0].offsetWidth;(void 0===l||0>=l)&&(l=j[0][0].offsetWidth),l=l-l*k-40;var m=45,n=c.select(e[0])[0][0].offsetWidth;(void 0===n||0>=n)&&(n=j[0][0].offsetWidth);var o=88,p=n*k*.7,q=[15,18];j.attr("height",o),a.onresize=function(){},d.$watch(function(){return angular.element(a)[0].innerWidth},function(){d.render(d.data)}),d.$watch("data",function(a){d.render(a)},!0);var r=d.data.locations.length,s=0;1===r&&(s=40);var t=30;j.append("g").attr("class","svg-perm svg-category-container");for(var u=0;r>u;u++){var v=d.data;j.select("g.svg-category-container").append("g").attr("class","svg-perm svg-category").attr("id",v.locations[u].key).attr("data-order",u+1),j.select("g.svg-category-container").select("#"+v.locations[u].key).append("rect").attr("class","svg-perm title-container").attr("fill",f(d.data.color,20*u)).attr("width",p).attr("height",18).attr("x",n-p).attr("y",u*t+s),j.select("g.svg-category-container").select("#"+v.locations[u].key).append("rect").attr("class","svg-perm value-container").attr("fill","transparent").attr("stroke",f(d.data.color,20*u)).attr("stroke-width",3).attr("width",50).attr("height",25).attr("x",n-p-50).attr("y",u*t+1+s),j.select("g.svg-category-container").select("#"+v.locations[u].key).append("text").attr("fill","#000").attr("x",n-p+5).attr("y",u*t+12+s).style("font-size","6px").style("font-weight","bold").attr("class","svg-perm location-title").text(v.locations[u].name)}d.render=function(a){a&&(h&&clearTimeout(h),h=b(function(){for(var b=c.scale.linear().range([q[0],l]),e=c.scale.linear().range([m+q[1],q[1]]),h=[],i=[void 0,void 0],k=[void 0,void 0],o=0;o<a.locations.length;o++){var r=a.locations[o];if(r.data&&r.data.length>0){var u=g(r.data,0),v=g(r.data,1);h[o]=v,(void 0===i[1]||i[1]<u.max[0])&&(i[1]=u.max[0]),(void 0===i[0]||i[0]>u.min[0])&&(i[0]=u.min[0]),(void 0===k[1]||k[1]<v.max[1])&&(k[1]=v.max[1]),(void 0===k[0]||k[0]>v.min[1])&&(k[0]=v.min[1])}}b.domain([i[0],i[1]]),e.domain([k[0],k[1]]);var w=c.svg.line().x(function(a){return b(a[0])}).y(function(a){return e(a[1])}).interpolate("basis"),x=j.selectAll(":not(.svg-perm)"),y=[];for(o=0;o<a.locations.length;o++)if(a.locations[o].data&&a.locations[o].data.length>0){var z=a.locations[o].data;j.insert("path",":first-child").datum(z).attr("class","line "+a.locations[o].key).attr("stroke",f(d.data.color,20*o)).attr("d",w),j.append("circle").attr("fill",f(d.data.color,20*o)).attr("cx",b(h[o].max[0])).attr("cy",e(h[o].max[1])).attr("r",12),j.append("text").attr("fill","#000").attr("x",b(h[o].max[0])).attr("y",e(h[o].max[1])+3).style("font-size","7px").attr("text-anchor","middle").text(Math.round(h[o].max[1])+a.suffix),j.append("circle").attr("fill",f(d.data.color,20*o)).attr("cx",b(h[o].min[0])).attr("cy",e(h[o].min[1])).attr("r",12),j.append("text").attr("fill","#000").attr("x",b(h[o].min[0])).attr("y",e(h[o].min[1])+3).style("font-size","7px").attr("text-anchor","middle").text(Math.round(h[o].min[1])+a.suffix);var A=Math.round(z[z.length-1][1]);y.push([o,A]),j.select("g.svg-category-container").select("#"+a.locations[o].key).append("text").attr("fill","#fff").attr("x",n-p-45).attr("y",o*t+20+s).style("font-size","13px").attr("data-value",A).text(A+a.suffix)}if(x.remove(),y.sort(function(a,b){return b[1]-a[1]}),y.length>=1)for(o=0;o<y.length;o++){var B=j.select("g.svg-category-container").select("#"+a.locations[y[o][0]].key),C=0;if(parseInt(B.attr("data-order"))!==o+1){var D=o+1-B.attr("data-order"),E=B.attr("transform"),F=E;if(E){var G=E.substring(E.lastIndexOf(",")+1,E.lastIndexOf(")"));C=parseFloat(G)+t*D,E="translate(0,"+C+")"}else F="translate(0,0)",C=t*D,E="translate(0,"+C+")";B.attr("data-order",o+1),B.attr("transform",F).transition().duration(500).attr("transform",E)}var H=j.select(".line."+a.locations[y[o][0]].key).attr("d");H=H.substr(H.lastIndexOf("L")+1),H=H.split(",");var I=o*t+s,J=B.select("rect.value-container").attr("x")-1;j.append("path").attr("fill",f(d.data.color,20*y[o][0])).attr("d","M"+H[0]+","+H[1]+"L"+J+","+I+"V"+(I+27)+"Z")}},i))}})}}}]),angular.module("bocFrontendApp").directive("dottedMatrix",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{actual:"=",total:"=",label:"@",onClick:"&"},link:function(b,d,e){c.d3().then(function(c){var f=b.total,g=b.actual;g>f&&(g=f);var h=100*g/f,i=parseInt(e.dotRadius)||6,j=parseInt(e.dotMargin)||2,k={active:"#9BC741",inactive:"#3E3E3D"};e.dotColors=angular.fromJson(e.dotColors),null!==e.dotColors&&"object"==typeof e.dotColors&&(void 0!==e.dotColors.active&&(k.active=e.dotColors.active),void 0!==e.dotColors.inactive&&(k.inactive=e.dotColors.inactive));var l=!0;void 0!==e.showNumbers&&"false"===e.showNumbers.toLowerCase()&&(l=!1);var m=e.width||"100%",n=c.select(d[0]).append("svg").style("width",m),o=c.select(d[0])[0][0].offsetWidth;(void 0===o||0>=o)&&(o=n[0][0].offsetWidth);var p=parseInt(e.height)||100,q=20;n.attr("height",p),a.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(g)}),b.$watch("actual",function(a){b.updateActual(a)},!0);var r=Math.floor(o/(i+j)),s=Math.floor((p-q)/(i+j)),t=Math.round(r*s*(h/100)),u=1;n.append("g").attr("id","dot-container");for(var v=0;s>v;v++)for(var w=0;r>w;w++){var x=k.active;u>t&&(x=k.inactive),n.select("#dot-container").append("circle").attr("fill",x).attr("cx",(i+j)*(w+1)).attr("cy",(i+j)*(v+1)).attr("r",i/2).attr("id","dot-"+u).attr("class","dot"),u++}l===!0&&(n.append("text").attr("fill","#FFF").attr("x",16).attr("y",p).style("font-size","14px").attr("text-anchor","middle").text(g).attr("id","text-actual"),n.append("text").attr("fill","#FFF").attr("x",40).attr("y",p).style("font-size","9px").attr("text-anchor","middle").text(" / "+f).attr("id","text-total")),b.updateActual=function(a){if(a){for(var b=100*a/f,c=Math.round(r*s*(b/100)),d=1,e=0;s>e;e++)for(var g=0;r>g;g++){var h=k.active;d>c&&(h=k.inactive),n.select("#dot-container").select("#dot-"+d).attr("fill",h),d++}l===!0&&n.select("#text-actual").text(a)}}})}}}]),angular.module("bocFrontendApp").directive("arcGauge",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{actual:"=",label:"@",onClick:"&"},link:function(b,d,e){c.d3().then(function(c){function f(){return"translate("+n/2+","+o+")"}function g(a){return(a-90)*Math.PI/180}var h=parseInt(e.sections)||18,i=2,j=b.actual;j>100&&(j=100);var k=Math.floor(j*h/100),l=["#9BC741","#EDBC3E","#AB1D5D"];e.colors=angular.fromJson(e.colors),null!==e.colors&&"object"==typeof e.colors&&(l=e.colors);var m=c.select(d[0]).append("svg").style("width","100%"),n=c.select(d[0])[0][0].offsetWidth;(void 0===n||0>=n)&&(n=m[0][0].offsetWidth);var o=parseInt(e.height)||55;m.attr("height",o),a.onresize=function(){},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(j)}),b.$watch("actual",function(a){b.updateActual(a)},!0),m.append("g").attr("id","arc-container").attr("transform",f());var p=c.svg.arc().innerRadius(.65*o).outerRadius(o-5).startAngle(function(a,b){var c=Math.floor(180/h);return g(c*b)}).endAngle(function(a,b){var c=Math.floor(180/h);return g(c*b+(c-i))});m.select("#arc-container").selectAll("path").data(new Array(h)).enter().append("path").attr("fill",function(a,b){if(b===k){var c=Math.floor(j*l.length/100);return l[c]}return"#3E3E3D"}).attr("id",function(a,b){return"sec-"+b}).attr("d",p),m.append("text").attr("fill","#FFF").attr("x",n/2-4).attr("y",o-2).style("font-size",.35*o+"px").style("font-weight","bold").attr("text-anchor","middle").text(j).attr("id","text-actual"),m.append("text").attr("fill","#FFF").attr("x",n/2-4+2*(.35*o*.45)).attr("y",o-7).style("font-size",.21*o+"px").attr("text-anchor","middle").text("%"),b.updateActual=function(a){if(a){var b=Math.floor(a*l.length/100);k=Math.floor(a*h/100),m.select("#arc-container").selectAll("path").attr("fill","#3E3E3D"),m.select("#sec-"+k).attr("fill",l[b]),m.select("#text-actual").text(a)}}})}}}]),angular.module("bocFrontendApp").directive("floorMap",["$window",function(a){return{restrict:"AE",scope:{occupancy:"="},link:function(b,c,d){var e=d.src,f='<img src="'+e+'" class="" style="width:100%;" id="bg_layer"/>';c.append(f);var g=0;d.layerTotal&&!isNaN(parseInt(d.layerTotal))&&(g=parseInt(d.layerTotal));for(var h='<div id="layer_container" class="col-xs-12" style="position:absolute; top:-0px; width:93%;">',i=1;g>=i;i++)h+='<img id="map_layer-'+i+'" src="'+d.layerSrc+i+d.layerExt+'" class="img-responsive img-layer" style="position:absolute; top:0px; left:0px; display:none;" />';h+="</div>",c.append(h);var j=b.occupancy;b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateOccupancy(j)}),b.$watch("occupancy",function(a){b.updateOccupancy(a)},!0),b.updateOccupancy=function(a){if(a)for(i=0;i<a.length;i++){var b=$("#layer_container").find("#map_layer-"+(i+1));a[i]===!1?$(b).css("display","block"):$(b).css("display","none")}}}}}]),angular.module("bocFrontendApp").directive("dualGraph",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(d,e,f){c.d3().then(function(c){var g,h=500,i=parseInt(f.height)||100,j=c.select(e[0]).append("svg").style("width","100%").attr("height",i),k=c.select(e[0])[0][0].offsetWidth;(void 0===k||0>=k)&&(k=j[0][0].offsetWidth);var l=d.data.length;a.onresize=function(){},d.$watch(function(){return angular.element(a)[0].innerWidth},function(){d.render(d.data)}),d.$watch("data",function(a){d.render(a)},!0),d.render=function(a){a&&(g&&clearTimeout(g),g=b(function(){var b,d,e,f=0;for(d=0;l>d;d++)for(b=0;b<a[d].data.length;b++)e=a[d].data[b],e.value>f&&(f=e.value);var g=i-20,h=c.scale.linear().domain([f,0]).range([20,g]);j.selectAll("*").remove();var m=k/l;for(d=0;l>d;d++){j.append("g").attr("id","groupdata-"+d).attr("transform","translate("+d*m+",0)").append("text").text(a[d].title).attr("fill","#FFF").style("font-size","6px").attr("y",i).attr("x",m/2).attr("text-anchor","middle");var n=m/a[d].data.length;for(b=0;b<a[d].data.length;b++)e=a[d].data[b],j.select("#groupdata-"+d).append("g").attr("id","bar-"+d+"-"+b).attr("transform","translate("+b*n+",0)").append("text").text(e.tag).attr("fill","#FFF").style("font-size","5px").attr("y",i-10).attr("x",n/2).attr("text-anchor","middle"),j.select("#groupdata-"+d).select("#bar-"+d+"-"+b).append("rect").attr("fill",e.color).attr("width",n-.5*n).attr("x",n/2-(n-.5*n)/2).attr("y",h(e.value)).attr("height",g-h(e.value)),j.select("#groupdata-"+d).select("#bar-"+d+"-"+b).append("circle").attr("fill",e.color).attr("r",(n-.5*n)/2).attr("cx",n/2).attr("cy",h(e.value)),j.select("#groupdata-"+d).select("#bar-"+d+"-"+b).append("text").text(e.value).attr("fill","#FFF").style("font-size","8px").attr("y",h(e.value)-10).attr("x",n/2).style("font-weight","bold").attr("text-anchor","middle")}j.append("rect").attr("fill","#000").attr("y",i-20).attr("x",0).attr("height",6).attr("width",k)},h))}})}}}]),angular.module("bocFrontendApp").directive("waitClock",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{time:"=",label:"@",onClick:"&"},link:function(b,d,e){c.d3().then(function(c){function f(){return"translate("+o/2+","+p/2+")"}function g(a){return a*Math.PI/180}var h=100,i=b.time;isNaN(parseInt(i))&&(i=0);var j=100*i/h,k=["#9BC741","#EDBC3E","#EDBC3E","#AB1D5D"];e.colors=angular.fromJson(e.colors),null!==e.colors&&"object"==typeof e.colors&&(k=e.colors);var l=e.negativeValue||"Closed",m=k[Math.floor(j*k.length/100)],n=c.select(d[0]).append("svg").style("width","100%"),o=c.select(d[0])[0][0].offsetWidth;(void 0===o||0>=o)&&(o=n[0][0].offsetWidth);var p=e.height||100;n.attr("height",p),a.onresize=function(){},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(b.time)}),b.$watch("time",function(a){b.updateActual(a)},!0),n.append("g").attr("id","clock-container").attr("transform",f());var q=o/2;o>p&&(q=p/2);var r=c.svg.arc().innerRadius(q-20).outerRadius(q-5).startAngle(g(0)).endAngle(function(a){var b=360*a/100;return b=Math.floor(b),g(b)}),s=c.svg.arc().innerRadius(q-3).outerRadius(q).startAngle(function(a,b){var c=Math.floor(30);return g(c*b)}).endAngle(function(a,b){var c=Math.floor(30);return g(c*b+1)});n.select("#clock-container").selectAll("path").data(new Array(12)).enter().append("path").attr("fill","#FFF").attr("d",s),n.select("#clock-container").append("circle").attr("fill","#3E3E3D").attr("r",q-5).attr("cx",0).attr("cy",0),n.select("#clock-container").append("circle").attr("id","cover-circle").attr("fill","#000").attr("stroke",m).attr("stroke-width","1px").attr("r",q-20).attr("cx",0).attr("cy",0),n.select("#clock-container").append("text").attr("id","min-placeholder").text("%").attr("fill","#FFF").attr("y",-3).attr("x",23).style("font-size","24px"),n.select("#clock-container").append("g").attr("data-direction","down").attr("id","arrow-container"),n.select("#arrow-container").append("path").attr("d","M0,0H10L5,8L0,0").attr("stroke","transparent").attr("fill","#AEAEAE").attr("transform","translate(-36,-3)").attr("x",-30),n.select("#arrow-container").append("path").attr("d","M0,0H10L5,8L0,0").attr("stroke","transparent").attr("fill","#848484").attr("transform","translate(-36,-15)").attr("x",-30),n.select("#arrow-container").append("path").attr("d","M0,0H10L5,8L0,0").attr("stroke","transparent").attr("fill","#222221").attr("transform","translate(-36,-27)").attr("x",-30),n.select("#clock-container").append("text").attr("id","min").text(i).attr("fill","#FFF").attr("y",-3).attr("x",-0).attr("text-anchor","middle").style("font-size","37px").style("font-weight","bold"),n.select("#clock-container").append("text").attr("id","closed").text("").attr("fill","#FFF").attr("y",9).attr("x",-37).style("font-size","22px").style("font-weight","bold"),n.select("#clock-container").append("text").attr("id","msg-placeholder").text("Great moment for:").attr("fill","#FFF").attr("y",18).attr("x",0).attr("text-anchor","middle").style("font-size","9px").style("font-weight",""),n.select("#clock-container").append("text").attr("id","message").text("").attr("fill","#FFF").attr("y",30).attr("x",0).attr("text-anchor","middle").style("font-size","9px").style("font-weight",""),b.updateActual=function(a){if(a){var b,c=!0;if(isNaN(parseInt(a))?c=!1:b=a,c===!0){var d=100*b/h,e=k[Math.floor(d*k.length/100)],f=parseInt(n.select("#min").text()),g="down";b>f&&(g="up");var i="";switch(!0){case 5>b:i="RELAX";break;case b>=5&&40>b:i="MEETINGS";break;case b>=40&&70>b:i="NETWORKING";break;case b>=70&&100>b:i="BACK TO WORK"}n.select("#min").text(b),n.select("#closed").text(""),n.select("#min-placeholder").text("%"),n.select("#message").text(i),n.select("#arrow-container").style("display","block"),n.select("#arrow-container").attr("data-direction")!==g&&(n.select("#arrow-container").attr("data-direction",g),"down"===g?n.select("#arrow-container").attr("transform","rotate(0 -30 0)"):n.select("#arrow-container").attr("transform","rotate(180 -30 -15)")),n.select("#gauge-arc").remove(),n.select("#cover-circle").attr("stroke",e),n.select("#clock-container").append("path").attr("fill",e).attr("id","gauge-arc").data([d]).attr("d",r)}else n.select("#closed").text(l),n.select("#min").text(""),n.select("#seg-placeholder").text(""),n.select("#arrow-container").style("display","none"),n.select("#gauge-arc").remove(),n.select("#clock-container").append("path").attr("fill",k[0]).attr("id","gauge-arc").data([0]).attr("d",r)}}})}}}]),angular.module("bocFrontendApp").directive("electricGauge",["$window","$timeout","$interval","d3Service",function(a,b,c,d){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(b,e,f){d.d3().then(function(d){function g(){var a=moment().hour()-k;a!==b.actualSection&&a>=0&&a<l.length&&(b.actualSection=a)}function h(){return"translate("+t/2+","+u/2+")"}function i(a){return a*Math.PI/180}function j(a,b){var c=parseInt(a.slice(1),16),d=Math.round(2.55*b),e=(c>>16)+d,f=(c>>8&255)+d,g=(255&c)+d;return"#"+(16777216+65536*(255>e?1>e?0:e:255)+256*(255>f?1>f?0:f:255)+(255>g?1>g?0:g:255)).toString(16).slice(1)}var k=parseInt(f.startHour)||0,l=b.data,m=l.length;b.actualSection=moment().hour()-k,parseInt(f.checkEvery)&&c(g,6e4*parseInt(f.checkEvery));var n={prefix:"Last",suffix:""},o={prefix:"Total",suffix:""},p={prefix:"",suffix:"",value:null};f.lastEventTag=angular.fromJson(f.lastEventTag),null!==f.lastEventTag&&"object"==typeof f.lastEventTag&&(void 0!==f.lastEventTag.prefix&&(n.prefix=f.lastEventTag.prefix),void 0!==f.lastEventTag.suffix&&(n.suffix=f.lastEventTag.suffix)),f.totalEventTag=angular.fromJson(f.totalEventTag),null!==f.totalEventTag&&"object"==typeof f.totalEventTag&&(void 0!==f.totalEventTag.prefix&&(o.prefix=f.totalEventTag.prefix),void 0!==f.totalEventTag.suffix&&(o.suffix=f.totalEventTag.suffix)),f.costEventTag=angular.fromJson(f.costEventTag),null!==f.costEventTag&&"object"==typeof f.costEventTag&&(void 0!==f.costEventTag.prefix&&(p.prefix=f.costEventTag.prefix),void 0!==f.costEventTag.suffix&&(p.suffix=f.costEventTag.suffix),void 0===f.costEventTag.value||isNaN(parseFloat(f.costEventTag.value))||(p.value=f.costEventTag.value));var q=f.colorActive||"#9BC741",r=f.colorInactive||"#6F6F6F",s=d.select(e[0]).append("svg").style("width","100%"),t=d.select(e[0])[0][0].offsetWidth;(void 0===t||0>=t)&&(t=s[0][0].offsetWidth);var u=f.height||100;s.attr("height",u),a.onresize=function(){},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(b.data)}),b.$watch("data",function(a){b.updateActual(a)},!0),b.$watch("actualSection",function(){b.updateActual(b.data)},!0),s.append("g").attr("id","energy-container").attr("transform",h());var v=t/2;t>u&&(v=u/2),s.select("#energy-container").append("circle").attr("id","cover-circle").attr("fill","#000").attr("stroke",q).attr("stroke-width","1px").attr("r",v-45).attr("cx",0).attr("cy",0),s.append("g").attr("id","hours-container");for(var w=i(-90),x=2*Math.PI/m,y=0;m>y;y++){var z=Math.round(t/2-6+(v-5)*Math.cos(w)),A=Math.round(u/2+3+(v-5)*Math.sin(w));w+=x,s.select("#hours-container").append("text").text(k+y+"h").attr("fill","#FFF").style("font-size","7px").attr("x",z).attr("y",A)}s.select("#energy-container").append("text").text("").attr("id","last-hour-value").attr("fill","#FFF").attr("y",-7).attr("x",0).style("font-size","8px").attr("text-anchor","middle"),s.select("#energy-container").append("text").text("").attr("id","event-value").attr("fill","#FFF").attr("y",3).attr("x",0).style("font-size","8px").attr("text-anchor","middle"),null!==p.value&&s.select("#energy-container").append("text").text("350 €").attr("id","cost-value").attr("fill","#FFF").attr("y",13).attr("x",0).style("font-size","8px").attr("text-anchor","middle");var B=d.svg.arc().innerRadius(function(a){var b=4*a.value;return v-43+b}).outerRadius(function(a){var b=4*a.value;return v-41+b}).startAngle(function(a){var b=360*a.section/m;return i(b)}).endAngle(function(a){var b=360*(a.section+1)/m;return b-=2,i(b)});b.updateActual=function(a){if(a){var c,d,e;for(c=0;c<a.length;c++)(void 0===d||d<a[c])&&(d=a[c]),(void 0===e||e>a[c])&&(e=a[c]);var f=(d-e)/7;s.selectAll(".electric-arc").remove();var g=0,h=0;if(b.actualSection>=0){for(c=0;c<b.actualSection;c++){var i=r;c===b.actualSection-1&&(i=q,h=a[c]),g+=a[c];var k=Math.ceil((a[c]-e)/f)+1;s.select("#energy-container").append("g").attr("class","electric-arc").attr("id","arc-group-"+c);
for(var l=0;k>l;l++)s.select("#arc-group-"+c).append("path").attr("fill",j(i,-5*l)).data([{section:c,value:l}]).attr("d",B)}if(s.select("#last-hour-value").text(n.prefix+" "+h+" "+n.suffix),s.select("#event-value").text(o.prefix+" "+g+" "+o.suffix),null!==p.value&&!isNaN(p.value)){var m=Math.round(g*parseFloat(p.value));s.select("#cost-value").text(p.prefix+" "+m+" "+p.suffix)}}}}})}}}]);