"use strict";angular.module("quasarFrontendApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","nvd3ChartDirectives","d3"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"ApihourCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("quasarFrontendApp").controller("ApihourCtrl",["$scope","quasarApi","$http","$interval",function(a,b,c,d){function e(){a.hour.split(":")[0]}function f(b,c,d){for(var e=a.hour.split(":")[0],f=[[9,12,81,92],[13,14,28,32],[15,17,67,83],[18,18,25,43],[19,21,11,18]],g=[],h=0;h<f.length;h++)if(e>=f[h][0]&&e<=f[h][1]){g[0]=f[h][2],g[1]=f[h][3];break}return b=b<=g[0]?parseFloat(b)+Math.random()*(d-c)+c:b>=g[1]?parseFloat(b)-Math.random()*(d-c)+c:parseFloat(b)+Math.random()*(d- -d)+-d,Math.round(b)}function g(){0!=a.loadState.locations&&(j(),i())}function h(){a.loadState.dataGenerics>=a.genericLoad.length&&a.loadState.dataDevices>=a.devices.length&&(a.monitorizeData=angular.copy(a.monitorize),l())}function i(){if(1!=a.loadState.initialGenerics)for(var b=0;b<a.genericLoad.length;b++)a.loadGenericData(a.genericLoad[b])}function j(){1!=a.loadState.devices&&b.getDevices().then(function(b){a.devices=b.data,b.data.length>0?(a.loadState.devices=!0,k()):a.loadState.devices=!1},function(b){console.log("Fallo al cargar los sensortags "+b),a.loadState.devices=!1})}function k(){if(1!=a.loadState.initialData)for(var b=0;b<a.devices.length;b++)a.loadDeviceData(a.devices[b])}function l(){a.loadState.mqttConnection!==!0&&(a.loadState.mqttConnection=!0,a.mqttClient=mqtt.connect("mqtt://52.18.80.55:8081"),a.mqttClient.on("connect",function(){console.log("Im connected "+Date()),a.mqttClient.subscribe("quasar/#"),a.loadState.mqttConnection=!0}),a.mqttClient.on("reconnect",function(){console.log("Im reconnected "+Date()),a.mqttClient.subscribe("quasar/#"),a.loadState.mqttConnection=!1}),a.mqttClient.on("close",function(){console.log("Im close "+Date()),a.loadState.mqttConnection=!1}),a.mqttClient.on("offline",function(){console.log("Im offline "+Date()),a.loadState.mqttConnection=!1}),a.mqttClient.on("error",function(b){console.log("Im error "+b+Date()),a.loadState.mqttConnection=!1}),a.mqttClient.on("message",function(b,c){a.manageMqttMessage(b,c)}))}function m(b,c,d){var e=!1;Object.keys(d).indexOf("device")>=0&&(b=b+"#"+d.device);for(var f=0;f<a.dataPool.length;f++)a.dataPool[f].mqtt_topic==b&&(e=!0,a.dataPool[f].mqtt_object.push(d));if(!e){var g={mqtt_topic:b,topic_var:c,mqtt_object:[d]};a.dataPool.push(g)}}a.devices=[],a.mqttClient=null,a.monitorize=[],a.monitorizeData=[],a.dataPushTimer=2e3,a.testHoursToAdd=0,a.hour=moment().add(a.testHoursToAdd,"hours").format("HH:mm"),a.cDay=moment().format("D MMM"),a.schedule=[],a.currentTalks=[],a.hoursToMonitorize=4,a.lastMonitorizedMoment=moment().add(a.testHoursToAdd,"hours").subtract(a.hoursToMonitorize,"hours"),a.loadState={locations:!1,devices:!1,initialGenerics:!1,initialData:!1,mqttConnection:!1,dataDevices:0,dataGenerics:0,schedule:!1},a.tweetData=[{title:"#theAPIHourIoT",data:[{tag:"Yesterday",value:27,color:"#3E3E3D"},{tag:"Today",value:48,color:"#9BC741"}]},{title:"@theapihour",data:[{tag:"Yesterday",value:1,color:"#3E3E3D"},{tag:"Today",value:50,color:"#9BC741"}]}],a.wifiData=[{title:"",data:[{tag:"Friday",value:223,color:"#3E3E3D"},{tag:"Saturday",value:38,color:"#3E3E3D"},{tag:"Sunday",value:27,color:"#3E3E3D"},{tag:"Monday",value:245,color:"#3E3E3D"},{tag:"Tuesday",value:238,color:"#3E3E3D"},{tag:"Wednesday",value:205,color:"#3E3E3D"},{tag:"API Hour",value:650,color:"#9BC741"}]}],a.metrics={costeElectrico:[50,60,70,20,60,20,30,70,50,30,60,30],esperaCafeteria:"5:23",asistentes:{total:150,actual:0},ocupacion:{planta1:10,planta2:8,planta3:5},detalleOcupacion:[{nombre:"planta3",ocupacion:{"bano-mujer-1":!1,"bano-hombre-1":!0,"bano-mujer-2":!1,"bano-hombre-2":!0,"bano-minus":!0,tower2:!0,coconut2:!1}},{nombre:"planta2",ocupacion:{"bano-mujer-1":!1,"bano-hombre-1":!0,"bano-mujer-2":!1,"bano-hombre-2":!0,"bano-minus":!1,tower1:!1,coconut1:!0}},{nombre:"entreplanta",ocupacion:{"bano-mujer":!1,"bano-hombre":!0,"creative-room":!0,"war-room":!0}},{nombre:"planta1",ocupacion:{"bano-mujer-1":!1,"bano-hombre-1":!0,"bano-mujer-2":!1,"bano-hombre-2":!0,"bano-minus":!0}}],edificio:{entradas:20,salidas:5}},a.checkAvailability=function(){for(var b={},c=0;c<a.metrics.detalleOcupacion.length;c++)for(var d=a.metrics.detalleOcupacion[c],e=0;e<Object.keys(d.ocupacion).length;e++){var f=Object.keys(d.ocupacion)[e],g="";"bano"==f.substring(0,f.indexOf("-"))?(g=f.substring(f.indexOf("-")+1),g.indexOf("-")>=0&&(g=g.substring(0,g.indexOf("-")))):g="salas",Object.keys(b).indexOf(g)<0&&(b[g]=[0,0]),b[g][1]++,1==d.ocupacion[f]&&b[g][0]++}a.metrics.disponibilidad=b},a.checkAvailability(),1!=a.loadState.locations&&c.get("misc/locations.json").then(function(b){a.monitorize=b.data,a.loadState.locations=!0,g()}),1!=a.loadState.schedule&&b.getScheduleData().then(function(c){a.schedule=c.data,a.schedule.sort(function(a,b){var c=a.hour.split(":"),d=b.hour.split(":");return c[0]==d[0]?c[1]-d[1]:c[0]-d[0]}),angular.forEach(a.schedule,function(c,d){c.endHour=c.hour,d<a.schedule.length-1&&a.schedule[d+1]&&(c.endHour=a.schedule[d+1].hour),c.speaker&&b.getGenericData("speaker",c.speaker).then(function(a){c.speaker=a.data},function(a){console.log("Fallo al cargar ponente del evento "+c.talk+" "+a)})}),a.loadState.schedule=!0,a.loadCurrentTalks()},function(a){console.log("Fallo al cargar el programa del evento "+a)}),a.tick=function(){a.hour=moment().add(a.testHoursToAdd,"hours").format("HH:mm"),a.lastMonitorizedMoment=moment().add(a.testHoursToAdd,"hours").subtract(a.hoursToMonitorize,"hours"),a.loadCurrentTalks(),a.cleanMonitorData(),a.randomizeData()},d(a.tick,6e3),a.randomCounter=0,a.randomizeData=function(){a.randomCounter>=3&&(a.randomCounter=0,a.metrics.detalleOcupacion[0].ocupacion["bano-mujer-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[0].ocupacion["bano-mujer-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[0].ocupacion["bano-hombre-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[0].ocupacion["bano-hombre-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[0].ocupacion["bano-minus"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[0].ocupacion.tower2=!(Math.random()+.5|0),a.metrics.detalleOcupacion[0].ocupacion.coconut2=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion["bano-mujer-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion["bano-mujer-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion["bano-hombre-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion["bano-hombre-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion["bano-minus"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion.tower1=!(Math.random()+.5|0),a.metrics.detalleOcupacion[1].ocupacion.coconut1=!(Math.random()+.5|0),a.metrics.detalleOcupacion[2].ocupacion["bano-mujer-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[2].ocupacion["bano-mujer-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[2].ocupacion["creative-room"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[2].ocupacion["war-room"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[3].ocupacion["bano-mujer-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[3].ocupacion["bano-mujer-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[3].ocupacion["bano-hombre-1"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[3].ocupacion["bano-hombre-2"]=!(Math.random()+.5|0),a.metrics.detalleOcupacion[3].ocupacion["bano-minus"]=!(Math.random()+.5|0),a.checkAvailability(),e()),a.metrics.ocupacion.planta1=f(a.metrics.ocupacion.planta1,1,5),a.metrics.ocupacion.planta2=f(a.metrics.ocupacion.planta2,1,5),a.metrics.ocupacion.planta3=f(a.metrics.ocupacion.planta3,1,5),a.randomCounter++},a.loadCurrentTalks=function(){if(1==a.loadState.schedule){a.currentTalks=[];var b=a.hour.split(":");b=moment().hour(b[0]).minute(b[1]);var c=moment(b).format("x")-moment(a.lastMonitorizedMoment).format("x");angular.forEach(a.schedule,function(d,e){var f=d.hour.split(":"),g=moment().hour(f[0]).minute(f[1]),h=a.lastMonitorizedMoment;if(moment(g).isBetween(h,b)){var i=moment(g).format("x")-moment(a.lastMonitorizedMoment).format("x"),j=95*i/c;switch(d.relativePosition=Math.round(100*j)/100,d.position=e,d.talk){case"COFFEE BREAK":d.image="images/lecture-coffee.png";break;case"LUNCH & NETWORKING":d.image="images/lecture-lunch.png";break;case"MESA REDONDA: IoT dónde estamos y hacia dónde vamos":d.image="images/lecture-mesa.png";break;case"Recepción y acreditaciones":d.image="images/lecture-entrada.png";break;default:d.image="images/lecture-mesa.png"}a.currentTalks.push(d)}}),a.currentTalks.sort(function(a,b){return a.relativePosition-b.relativePosition})}},a.cleanMonitorData=function(){if(a.monitorizeData.length>0)for(var b=moment().add(a.testHoursToAdd,"hours").subtract(a.hoursToMonitorize+2,"hours").format("x"),c=0;c<a.monitorizeData.length;c++)for(var d=0;d<a.monitorizeData[c].locations.length;d++){var e=a.monitorizeData[c].locations[d];if(e.data&&e.data.length>0){for(var f=0,g=0;g<e.data.length&&!(e.data[g][0]>=b);g++)f++;e.data.splice(0,f)}}},a.genericLoad=[{key:"volume"}],a.loadGenericData=function(c){b.getGenericVolumeData(c.key).then(function(b){for(var d=0;d<a.monitorize.length;d++)for(var e=a.monitorize[d],f=0;f<e.locations.length;f++)if(e.locations[f].generic&&e.locations[f].generic.indexOf(c.key)>=0){void 0===e.locations[f].data&&(e.locations[f].data=[]);for(var g=0;g<b.data.length;g++){var i=b.data[g],j=parseInt(moment(i.date).format("x"));e.datum&&i[e.datum]&&e.locations[f].data.push([j,i[e.datum]])}e.locations[f].data.sort(function(a,b){return a[0]-b[0]})}a.loadState.dataGenerics++,h()},function(a){console.log("Fallo al cargar los historicos de "+c.key+" "+a)})},a.loadDeviceData=function(c){b.getSensorData(c.device).then(function(b){for(var d=0;d<a.monitorize.length;d++)for(var e=a.monitorize[d],f=0;f<e.locations.length;f++)if(e.locations[f].devices&&e.locations[f].devices.indexOf(c.device)>=0){void 0===e.locations[f].data&&(e.locations[f].data=[]);for(var g=0;g<b.data.length;g++){var i=b.data[g],j=parseInt(moment(i.date).format("x"));e.datum&&i[e.datum]&&e.locations[f].data.push([j,i[e.datum]])}e.locations[f].data.sort(function(a,b){return a[0]-b[0]})}a.loadState.dataDevices++,h()},function(a){console.log("Fallo al cargar los historicos de "+c.device+" "+a)})},a.dataPool=[],a.pushDataPool=function(){var b=angular.copy(a.dataPool);a.dataPool=[];for(var c=0;c<b.length;c++){var d=b[c].mqtt_object;if(d.length>0){for(var e={},f=0;f<d.length;f++)for(var g in d[f])isNaN(d[f][g])?e[g]=d[f][g]:(e[g]||(e[g]=0),e[g]+=parseFloat(d[f][g]));for(var h in e)isNaN(e[h])||(e[h]=e[h]/d.length,e[h]=Math.round(100*e[h])/100);for(b[c].mqtt_object=e,f=0;f<a.monitorizeData.length;f++){var i=a.monitorizeData[f];if(b[c].mqtt_topic.lastIndexOf("#")>=0&&(b[c].mqtt_topic=b[c].mqtt_topic.substring(0,b[c].mqtt_topic.lastIndexOf("#"))),i.mqtt==b[c].mqtt_topic&&b[c].mqtt_object[i.datum])for(var j=0;j<i.locations.length;j++){var k=!1;i.locations[j].generic&&i.locations[j].generic.indexOf(b[c].topic_var)>=0&&(k=!0),i.locations[j].devices&&b[c].mqtt_object.device&&i.locations[j].devices.indexOf(b[c].mqtt_object.device)>=0&&(k=!0),void 0===i.locations[j].data&&(i.locations[j].data=[]);var l=moment().format("x");1==k&&i.locations[j].data.push([l,b[c].mqtt_object[i.datum]])}}}}b=[]},d(a.pushDataPool,a.dataPushTimer),a.manageMqttMessage=function(b,c){var d=b.split("/");if(console.log(b,c.toString()),"quasar"==d[0])switch(d[d.length-1]){case"volume":case"datum":m(b,d[d.length-1],angular.fromJson(c.toString()));break;case"tweet":a.tweetData[1].data[1].value=parseInt(a.tweetData[1].data[1].value)+1;break;case"hashtag":a.tweetData[0].data[1].value=parseInt(a.tweetData[0].data[1].value)+1;break;default:if("metrics"==d[1])switch(d[2]){case"cafeteria":a.metrics.esperaCafeteria=c.toString();break;case"ocupacion":a.metrics.ocupacion.planta1=c.toString();break;case"asistentes":a.metrics.asistentes.actual=c.toString();break;case"bano-mujer-1":case"bano-mujer-2":case"bano-hombre-1":case"bano-hombre-2":case"bano-minus":var e=!1;"true"==c.toString()&&(e=!0),a.metrics.detalleOcupacion[3].ocupacion[d[2]]=e,a.checkAvailability()}}},a.getCurrentTimeWidth=function(b,c){if(void 0!=b&&void 0!=c){var d=a.hour.split(":");b=b.split(":"),c=c.split(":"),d=moment().hour(d[0]).minute(d[1]).format("x"),b=moment().hour(b[0]).minute(b[1]).format("x"),c=moment().hour(c[0]).minute(c[1]).format("x");var e=c-b,d=d-b;return Math.round(100*d/e)}return 0}}]),angular.module("quasarFrontendApp").factory("quasarApi",["$http",function(a){function b(){return a.get(g+"sensortag")}function c(b){return a.get(g+"datum?device="+b+"&after="+i+"&limit="+j)}function d(b,c){return c=void 0!=c?"/"+c:"",a.get(g+"generic/"+b+c+"?after="+i+"&limit="+j)}function e(b){return a.get(g+"generic/aggregate/"+b+"?index=volume&threshold=2&after="+i+"&limit="+j)}function f(){return a.get(g+"generic/schedule?limit=100")}var g,h=!1;g=h?"http://localhost:9000/api/":"http://52.18.80.55/api/";var i=moment().subtract(6,"hours").format("YYYY-MM-DD hh:mm:ss"),j=500;return{getDevices:b,getSensorData:c,getGenericData:d,getScheduleData:f,getGenericVolumeData:e}}]),angular.module("quasarFrontendApp").directive("barChart",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(d,e,f){c.d3().then(function(c){var g,h=parseInt(f.margin)||20,i=parseInt(f.barHeight)||20,j=parseInt(f.barPadding)||5,k=c.select(e[0]).append("svg").style("width","100%");a.onresize=function(){d.$apply()},d.$watch(function(){return angular.element(a)[0].innerWidth},function(){d.render(d.data)}),d.$watch("data",function(a){d.render(a)},!0),d.render=function(a){k.selectAll("*").remove(),a&&(g&&clearTimeout(g),g=b(function(){var b=c.select(e[0])[0][0].offsetWidth-h,f=d.data.length*(i+j),g=c.scale.category20(),l=c.scale.linear().domain([0,c.max(a,function(a){return a.score})]).range([0,b]);k.attr("height",f),k.selectAll("rect").data(a).enter().append("rect").on("click",function(a){return d.onClick({item:a})}).attr("height",i).attr("width",140).attr("x",Math.round(h/2)).attr("y",function(a,b){return b*(i+j)}).attr("fill",function(a){return g(a.score)}).transition().duration(1e3).attr("width",function(a){return l(a.score)}),k.selectAll("text").data(a).enter().append("text").attr("fill","#fff").attr("y",function(a,b){return b*(i+j)+15}).attr("x",15).text(function(a){return a.name+" (scored: "+a.score+")"})},200))}})}}}]),angular.module("quasarFrontendApp").directive("sparkline",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(d,e){c.d3().then(function(c){function f(a,b){var c=parseInt(a.slice(1),16),d=Math.round(2.55*b),e=(c>>16)+d,f=(c>>8&255)+d,g=(255&c)+d;return"#"+(16777216+65536*(255>e?1>e?0:e:255)+256*(255>f?1>f?0:f:255)+(255>g?1>g?0:g:255)).toString(16).slice(1)}function g(a,b){var c,d,e,f;if(a&&a.length>0){for(var g=0;g<a.length;g++)("number"!=typeof c||a[g][b]>e)&&(c=g,e=a[g][b]),("number"!=typeof d||a[g][b]<f)&&(d=g,f=a[g][b]);return{max:a[c],min:a[d]}}return{max:null,min:null}}var h,i=500,j=c.select(e[0]).append("svg").style("width","100%"),k=.2,l=c.select(e[0])[0][0].offsetWidth-c.select(e[0])[0][0].offsetWidth*k-40,m=45,n=c.select(e[0])[0][0].offsetWidth,o=88,p=c.select(e[0])[0][0].offsetWidth*k*.7,q=[15,18];j.attr("height",o),a.onresize=function(){d.$apply()},d.$watch(function(){return angular.element(a)[0].innerWidth},function(){d.render(d.data)}),d.$watch("data",function(a){d.render(a)},!0);var r=d.data.locations.length,s=0;1==r&&(s=40);var t=30;j.append("g").attr("class","svg-perm svg-category-container");for(var u=0;r>u;u++){var v=d.data;j.select("g.svg-category-container").append("g").attr("class","svg-perm svg-category").attr("id",v.locations[u].key).attr("data-order",u+1),j.select("g.svg-category-container").select("#"+v.locations[u].key).append("rect").attr("class","svg-perm title-container").attr("fill",f(d.data.color,20*u)).attr("width",p).attr("height",18).attr("x",n-p).attr("y",u*t+s),j.select("g.svg-category-container").select("#"+v.locations[u].key).append("rect").attr("class","svg-perm value-container").attr("fill","transparent").attr("stroke",f(d.data.color,20*u)).attr("stroke-width",3).attr("width",50).attr("height",25).attr("x",n-p-50).attr("y",u*t+1+s),j.select("g.svg-category-container").select("#"+v.locations[u].key).append("text").attr("fill","#000").attr("x",n-p+5).attr("y",u*t+12+s).style("font-size","6px").style("font-weight","bold").attr("class","svg-perm location-title").text(v.locations[u].name)}d.render=function(a){a&&(h&&clearTimeout(h),h=b(function(){for(var b=c.scale.linear().range([q[0],l]),e=c.scale.linear().range([m+q[1],q[1]]),h=[],i=[void 0,void 0],k=[void 0,void 0],o=0;o<a.locations.length;o++){var r=a.locations[o];if(r.data&&r.data.length>0){var u=g(r.data,0),v=g(r.data,1);h[o]=v,(void 0==i[1]||i[1]<u.max[0])&&(i[1]=u.max[0]),(void 0==i[0]||i[0]>u.min[0])&&(i[0]=u.min[0]),(void 0==k[1]||k[1]<v.max[1])&&(k[1]=v.max[1]),(void 0==k[0]||k[0]>v.min[1])&&(k[0]=v.min[1])}}b.domain([i[0],i[1]]),e.domain([k[0],k[1]]);var w=c.svg.line().x(function(a){return b(a[0])}).y(function(a){return e(a[1])}).interpolate("basis"),x=j.selectAll(":not(.svg-perm)"),y=[];for(o=0;o<a.locations.length;o++)if(a.locations[o].data&&a.locations[o].data.length>0){var z=a.locations[o].data;j.insert("path",":first-child").datum(z).attr("class","line "+a.locations[o].key).attr("stroke",f(d.data.color,20*o)).attr("d",w),j.append("circle").attr("fill",f(d.data.color,20*o)).attr("cx",b(h[o].max[0])).attr("cy",e(h[o].max[1])).attr("r",12),j.append("text").attr("fill","#000").attr("x",b(h[o].max[0])).attr("y",e(h[o].max[1])+3).style("font-size","7px").attr("text-anchor","middle").text(Math.round(h[o].max[1])+a.suffix),j.append("circle").attr("fill",f(d.data.color,20*o)).attr("cx",b(h[o].min[0])).attr("cy",e(h[o].min[1])).attr("r",12),j.append("text").attr("fill","#000").attr("x",b(h[o].min[0])).attr("y",e(h[o].min[1])+3).style("font-size","7px").attr("text-anchor","middle").text(Math.round(h[o].min[1])+a.suffix);var A=Math.round(z[z.length-1][1]);y.push([o,A]),j.select("g.svg-category-container").select("#"+a.locations[o].key).append("text").attr("fill","#fff").attr("x",n-p-45).attr("y",o*t+20+s).style("font-size","13px").attr("data-value",A).text(A+a.suffix)}if(x.remove(),y.sort(function(a,b){return b[1]-a[1]}),y.length>=1)for(o=0;o<y.length;o++){var B=j.select("g.svg-category-container").select("#"+a.locations[y[o][0]].key),C=0;if(B.attr("data-order")!=o+1){var D=o+1-B.attr("data-order"),E=B.attr("transform"),F=E;if(E){var G=E.substring(E.lastIndexOf(",")+1,E.lastIndexOf(")"));C=parseFloat(G)+t*D,E="translate(0,"+C+")"}else F="translate(0,0)",C=t*D,E="translate(0,"+C+")";B.attr("data-order",o+1),B.attr("transform",F).transition().duration(500).attr("transform",E)}var H=j.select(".line."+a.locations[y[o][0]].key).attr("d");H=H.substr(H.lastIndexOf("L")+1),H=H.split(",");var I=o*t+s,J=B.select("rect.value-container").attr("x")-1;j.append("path").attr("fill",f(d.data.color,20*y[o][0])).attr("d","M"+H[0]+","+H[1]+"L"+J+","+I+"V"+(I+27)+"Z")}},i))}})}}}]),angular.module("quasarFrontendApp").directive("dottedMatrix",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{actual:"=",total:"=",label:"@",onClick:"&"},link:function(b,d){c.d3().then(function(c){var e=b.total,f=b.actual;f>e&&(f=e);var g=100*f/e,h=6,i=2,j={active:"#9BC741",inactive:"#3E3E3D"},k=c.select(d[0]).append("svg").style("width","80%"),l=c.select(d[0])[0][0].offsetWidth,m=100,n=20;k.attr("height",m),a.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(f)}),b.$watch("actual",function(a){b.updateActual(a)},!0);var o=Math.floor(l/(h+i)),p=Math.floor((m-n)/(h+i)),q=Math.round(o*p*(g/100)),r=1;k.append("g").attr("id","dot-container");for(var s=0;p>s;s++)for(var t=0;o>t;t++){var u=j.active;r>q&&(u=j.inactive),k.select("#dot-container").append("circle").attr("fill",u).attr("cx",(h+i)*(t+1)).attr("cy",(h+i)*(s+1)).attr("r",h/2).attr("id","dot-"+r).attr("class","dot"),r++}k.append("text").attr("fill","#FFF").attr("x",16).attr("y",m).style("font-size","14px").attr("text-anchor","middle").text(f).attr("id","text-actual"),k.append("text").attr("fill","#FFF").attr("x",40).attr("y",m).style("font-size","9px").attr("text-anchor","middle").text(" / "+e).attr("id","text-total"),b.updateActual=function(a){if(f&&e){for(var b=100*a/e,c=Math.round(o*p*(b/100)),d=1,g=0;p>g;g++)for(var h=0;o>h;h++){var i=j.active;d>c&&(i=j.inactive),k.select("#dot-container").select("#dot-"+d).attr("fill",i),d++}k.select("#text-actual").text(a)}}})}}}]),angular.module("quasarFrontendApp").directive("arcGauge",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{actual:"=",label:"@",onClick:"&"},link:function(b,d){c.d3().then(function(c){function e(){return"translate("+m/2+","+n+")"}function f(a){return(a-90)*Math.PI/180}var g=18,h=2,i=b.actual;i>100&&(i=100);var j=Math.floor(i*g/100),k=["#9BC741","#EDBC3E","#AB1D5D"],l=c.select(d[0]).append("svg").style("width","100%"),m=c.select(d[0])[0][0].offsetWidth,n=55;l.attr("height",n),a.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(i)}),b.$watch("actual",function(a){b.updateActual(a)},!0),l.append("g").attr("id","arc-container").attr("transform",e());var o=c.svg.arc().innerRadius(n-18).outerRadius(n-5).startAngle(function(a,b){var c=Math.floor(180/g);return f(c*b)}).endAngle(function(a,b){var c=Math.floor(180/g);return f(c*b+(c-h))});l.select("#arc-container").selectAll("path").data(new Array(g)).enter().append("path").attr("fill",function(a,b){if(b==j){var c=Math.floor(i*k.length/100);return k[c]}return"#3E3E3D"}).attr("id",function(a,b){return"sec-"+b}).attr("d",o),l.append("text").attr("fill","#FFF").attr("x",m/2-4).attr("y",n-2).style("font-size","20px").style("font-weight","bold").attr("text-anchor","middle").text(i).attr("id","text-actual"),l.append("text").attr("fill","#FFF").attr("x",m/2-4+18).attr("y",n-7).style("font-size","13px").attr("text-anchor","middle").text("%"),b.updateActual=function(a){if(a){var b=Math.floor(a*k.length/100);j=Math.floor(a*g/100),l.select("#arc-container").selectAll("path").attr("fill","#3E3E3D"),l.select("#sec-"+j).attr("fill",k[b]),l.select("#text-actual").text(a)}}})}}}]),angular.module("quasarFrontendApp").directive("floorMap",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{occupancy:"="},link:function(b,d,e){var f=e.src,g='<img src="'+f+'" class="img-responsive"/>';d.append(g),c.d3().then(function(c){var e=b.occupancy,f={free:"#9BC741",occupied:"#AB1D5D"},g=c.select(d[0])[0][0].offsetWidth,h=c.select(d[0])[0][0].offsetHeight,i=c.select(d[0]).append("svg").style("width",g);i.attr("height",h).style("position","absolute").style("top","0px").style("left","0px"),a.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateOccupancy(e)}),b.$watch("occupancy",function(a){b.updateOccupancy(a)},!0);for(var j=c.scale.linear().domain([0,1e3]).range([0,g]),k=c.scale.linear().domain([0,1e3]).range([0,h]),l=[{nombre:"planta3",coord:{"bano-mujer-1":[[460.957,88.05],[483.627,97.484],[493.702,88.05],[478.589,81.761]],"bano-hombre-1":[[498.74,103.773],[516.372,110.062],[534.005,103.773],[508.816,94.339]],"bano-mujer-2":[[498.74,261.006],[523.929,264.15],[541.561,261.006],[516.372,248.427]],"bano-hombre-2":[[536.523,267.295],[561.712,276.729],[574.307,267.295],[556.675,261.006]],"bano-minus":[[559.193,257.861],[581.863,270.44],[594.458,261.006],[571.788,248.427]],tower2:[[914.357,135.364],[974.811,157.232],[1037.783,135.22],[977.329,110.062]],coconut2:[[722.921,207.547],[790.931,229.559],[833.753,210.691],[755.667,185.534]]}},{nombre:"planta2",coord:{"bano-hombre-1":[[498.74,451.773],[516.372,458.062],[534.005,451.773],[508.816,442.339]],"bano-hombre-2":[[536.523,615.2950000000001],[561.712,624.729],[574.307,615.2950000000001],[556.675,609.006]],"bano-minus":[[559.193,605.861],[581.863,618.44],[594.458,609.006],[571.788,596.427]],"bano-mujer-1":[[460.957,436.05],[483.627,445.484],[493.702,436.05],[478.589,429.76099999999997]],"bano-mujer-2":[[498.74,609.006],[523.929,612.15],[541.561,609.006],[516.372,596.427]],coconut2:[[722.921,555.547],[790.931,577.559],[833.753,558.691],[755.667,533.534]],tower2:[[914.357,483.36400000000003],[974.811,505.23199999999997],[1037.783,483.22],[977.329,458.062]]}},{nombre:"entreplanta",coord:{"bano-hombre":[[408.74,703.773],[426.37199999999996,710.062],[444.005,703.773],[418.816,694.3389999999999]],"bano-mujer":[[370.957,688.05],[393.627,697.484],[403.702,688.05],[388.589,681.761]],"creative-room":[[183.879,745.283],[277.078,798.742],[410.579,738.993],[279.596,691.823]],"war-room":[[443.324,694.968],[501.259,723.27],[589.42,685.534],[534.005,660.377]]}},{nombre:"planta1",coord:{"bano-hombre-1":[[498.74,799.773],[516.372,806.062],[534.005,799.773],[508.816,790.3389999999999]],"bano-hombre-2":[[536.523,963.2950000000001],[561.712,972.729],[574.307,963.2950000000001],[556.675,957.006]],"bano-minus":[[559.193,953.861],[581.863,966.44],[594.458,957.006],[571.788,944.427]],"bano-mujer-1":[[460.957,784.05],[483.627,793.4839999999999],[493.702,784.05],[478.589,777.761]],"bano-mujer-2":[[498.74,957.006],[523.929,960.15],[541.561,957.006],[516.372,944.427]]}}],m=0;m<l.length;m++){var n=l[m];i.append("g").attr("id","group-"+n.nombre);for(var o=0;o<Object.keys(n.coord).length;o++){var p=Object.keys(n.coord)[o];if(0!=n.coord[p]){var q="M"+j(n.coord[p][0][0])+","+k(n.coord[p][0][1]);q=q+"L"+j(n.coord[p][1][0])+","+k(n.coord[p][1][1]),q=q+"L"+j(n.coord[p][2][0])+","+k(n.coord[p][2][1]),q=q+"L"+j(n.coord[p][3][0])+","+k(n.coord[p][3][1]),q=q+"L"+j(n.coord[p][0][0])+","+k(n.coord[p][0][1]);var r=f.free;0==e[m].ocupacion[p]&&(r=f.occupied),i.select("#group-"+n.nombre).append("path").attr("d",q).attr("stroke","transparent").attr("fill",r).attr("id","path-"+n.nombre+"-"+p)}}}b.updateOccupancy=function(a){if(a)for(var b=0;b<a.length;b++)for(var c=a[b],d=0;d<Object.keys(c.ocupacion).length;d++){var e=Object.keys(c.ocupacion)[d],g=f.free;0==c.ocupacion[e]&&(g=f.occupied),i.select("#path-"+c.nombre+"-"+e).attr("fill",g)}}})}}}]),angular.module("quasarFrontendApp").directive("dualGraph",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(d,e,f){c.d3().then(function(c){var g,h=500,i=parseInt(f.height)||100,j=c.select(e[0]).append("svg").style("width","100%").attr("height",i),k=c.select(e[0])[0][0].offsetWidth,l=(d.data,d.data.length);a.onresize=function(){d.$apply()},d.$watch(function(){return angular.element(a)[0].innerWidth},function(){d.render(d.data)}),d.$watch("data",function(a){d.render(a)},!0),d.render=function(a){a&&(g&&clearTimeout(g),g=b(function(){for(var b=0,d=0;l>d;d++)for(var e=0;e<a[d].data.length;e++){var f=a[d].data[e];f.value>b&&(b=f.value)}for(var g=i-20,h=c.scale.linear().domain([b,0]).range([20,g]),m=k/l,d=0;l>d;d++){j.append("g").attr("id","groupdata-"+d).attr("transform","translate("+d*m+",0)").append("text").text(a[d].title).attr("fill","#FFF").style("font-size","6px").attr("y",i).attr("x",m/2).attr("text-anchor","middle");for(var n=m/a[d].data.length,e=0;e<a[d].data.length;e++){var f=a[d].data[e];j.select("#groupdata-"+d).append("g").attr("id","bar-"+d+"-"+e).attr("transform","translate("+e*n+",0)").append("text").text(f.tag).attr("fill","#FFF").style("font-size","5px").attr("y",i-10).attr("x",n/2).attr("text-anchor","middle"),j.select("#groupdata-"+d).select("#bar-"+d+"-"+e).append("rect").attr("fill",f.color).attr("width",n-.5*n).attr("x",n/2-(n-.5*n)/2).attr("y",h(f.value)).attr("height",g-h(f.value)),j.select("#groupdata-"+d).select("#bar-"+d+"-"+e).append("circle").attr("fill",f.color).attr("r",(n-.5*n)/2).attr("cx",n/2).attr("cy",h(f.value)),j.select("#groupdata-"+d).select("#bar-"+d+"-"+e).append("text").text(f.value).attr("fill","#FFF").style("font-size","8px").attr("y",h(f.value)-10).attr("x",n/2).style("font-weight","bold").attr("text-anchor","middle")}}j.append("rect").attr("fill","#000").attr("y",i-20).attr("x",0).attr("height",6).attr("width",k)},h))}})}}}]),angular.module("quasarFrontendApp").directive("waitClock",["$window","$timeout","d3Service",function(a,b,c){return{restrict:"AE",scope:{time:"=",label:"@",onClick:"&"},link:function(b,d,e){c.d3().then(function(c){function f(){return"translate("+n/2+","+o/2+")"}function g(a){return a*Math.PI/180}var h=60,i=b.time;i=i.indexOf(":")<0?["0","0"]:i.split(":");var j=100*i[0]/h,k=["#9BC741","#EDBC3E","#EDBC3E","#AB1D5D"],l=k[Math.floor(j*k.length/100)],m=c.select(d[0]).append("svg").style("width","100%"),n=c.select(d[0])[0][0].offsetWidth,o=e.height||100;m.attr("height",o),a.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(b.time)}),b.$watch("time",function(a){b.updateActual(a)},!0),m.append("g").attr("id","clock-container").attr("transform",f());var p=n/2;n>o&&(p=o/2);var q=c.svg.arc().innerRadius(p-20).outerRadius(p-5).startAngle(g(0)).endAngle(function(a){var b=360*a/100;return b=Math.floor(b),g(b)});m.select("#clock-container").append("circle").attr("fill","#3E3E3D").attr("r",p-5).attr("cx",0).attr("cy",0),m.select("#clock-container").append("circle").attr("id","cover-circle").attr("fill","#000").attr("stroke",l).attr("stroke-width","1px").attr("r",p-20).attr("cx",0).attr("cy",0),m.select("#clock-container").append("text").text("min").attr("fill","#FFF").attr("y",-3).attr("x",10).style("font-size","14px"),m.select("#clock-container").append("text").text("seg").attr("fill","#FFF").attr("y",17).attr("x",10).style("font-size","14px"),m.select("#clock-container").append("g").attr("data-direction","down").attr("id","arrow-container"),m.select("#arrow-container").append("path").attr("d","M0,0H10L5,8L0,0").attr("stroke","transparent").attr("fill","#AEAEAE").attr("transform","translate(-36,7)").attr("x",-30),m.select("#arrow-container").append("path").attr("d","M0,0H10L5,8L0,0").attr("stroke","transparent").attr("fill","#848484").attr("transform","translate(-36,-5)").attr("x",-30),m.select("#arrow-container").append("path").attr("d","M0,0H10L5,8L0,0").attr("stroke","transparent").attr("fill","#222221").attr("transform","translate(-36,-17)").attr("x",-30),m.select("#clock-container").append("text").attr("id","sec").text(i[1]).attr("fill","#FFF").attr("y",17).attr("x",-20).style("font-size","22px").style("font-weight","bold"),m.select("#clock-container").append("text").attr("id","min").text(i[0]).attr("fill","#FFF").attr("y",-3).attr("x",-20).style("font-size","22px").style("font-weight","bold"),b.updateActual=function(a){if(a){var b;b=a.indexOf(":")<0?["0","0"]:a.split(":");var c=100*b[0]/h,d=k[Math.floor(c*k.length/100)],e=parseInt(m.select("#min").text()),f="down";e<b[0]&&(f="up"),m.select("#min").text(b[0]),m.select("#sec").text(b[1]),m.select("#arrow-container").attr("data-direction")!=f&&(m.select("#arrow-container").attr("data-direction",f),"down"==f?m.select("#arrow-container").attr("transform","rotate(0 -30 0)"):m.select("#arrow-container").attr("transform","rotate(180 -30 0)")),m.select("#gauge-arc").remove(),m.select("#cover-circle").attr("stroke",d),m.select("#clock-container").append("path").attr("fill",d).attr("id","gauge-arc").data([c]).attr("d",q)}}})}}}]),angular.module("quasarFrontendApp").directive("electricGauge",["$window","$timeout","$interval","d3Service",function(a,b,c,d){return{restrict:"AE",scope:{data:"=",label:"@",onClick:"&"},link:function(b,e,f){d.d3().then(function(d){function g(){var a=moment().hour()-l;if(a!=b.actualSection&&a>=0&&a<m.length){b.actualSection=a;m[b.actualSection]}}function h(){
return"translate("+p/2+","+q/2+")"}function i(a){return a*Math.PI/180}function j(a,b){var c=parseInt(a.slice(1),16),d=Math.round(2.55*b),e=(c>>16)+d,f=(c>>8&255)+d,g=(255&c)+d;return"#"+(16777216+65536*(255>e?1>e?0:e:255)+256*(255>f?1>f?0:f:255)+(255>g?1>g?0:g:255)).toString(16).slice(1)}var k=12,l=9,m=b.data;if(b.actualSection=moment().hour()-l,b.actualSection>=0&&b.actualSection<m.length){m[b.actualSection]}c(g,9e5);var n="#9BC741",o=d.select(e[0]).append("svg").style("width","100%"),p=d.select(e[0])[0][0].offsetWidth,q=f.height||100;o.attr("height",q),a.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(a)[0].innerWidth},function(){b.updateActual(b.data)}),b.$watch("data",function(a){b.updateActual(a)},!0),b.$watch("actualSection",function(a){b.updateActual(b.data)},!0),o.append("g").attr("id","energy-container").attr("transform",h());var r=p/2;p>q&&(r=q/2),o.select("#energy-container").append("circle").attr("id","cover-circle").attr("fill","#000").attr("stroke",n).attr("stroke-width","1px").attr("r",r-45).attr("cx",0).attr("cy",0),o.append("g").attr("id","hours-container");for(var s=i(-90),t=2*Math.PI/k,u=0;k>u;u++){var v=Math.round(p/2-6+(r-5)*Math.cos(s)),w=Math.round(q/2+3+(r-5)*Math.sin(s));s+=t,o.select("#hours-container").append("text").text(l+u+"h").attr("fill","#FFF").style("font-size","7px").attr("x",v).attr("y",w)}o.select("#energy-container").append("text").text("Last hour").attr("fill","#FFF").attr("y",-7).attr("x",-32).style("font-size","8px"),o.select("#energy-container").append("text").text("Event").attr("fill","#FFF").attr("y",3).attr("x",-28).style("font-size","8px"),o.select("#energy-container").append("text").text("Total cost").attr("fill","#FFF").attr("y",13).attr("x",-29).style("font-size","8px"),o.select("#energy-container").append("text").text("30 kW/h").attr("id","last-hour-value").attr("fill","#FFF").attr("y",-7).attr("x",4).style("font-size","8px"),o.select("#energy-container").append("text").text("280 kW/h").attr("id","event-value").attr("fill","#FFF").attr("y",3).attr("x",-4).style("font-size","8px"),o.select("#energy-container").append("text").text("350 €").attr("id","cost-value").attr("fill","#FFF").attr("y",13).attr("x",10).style("font-size","8px");var x=d.svg.arc().innerRadius(function(a){var b=4*a.value;return r-43+b}).outerRadius(function(a){var b=4*a.value;return r-41+b}).startAngle(function(a){var b=360*a.section/k;return i(b)}).endAngle(function(a){var b=360*(a.section+1)/k;return b-=2,i(b)});b.updateActual=function(a){if(a){var c="#6F6F6F";o.selectAll(".electric-arc").remove();var d=0,e=0;if(b.actualSection>=0){for(var f=0;f<b.actualSection;f++){var g=c;f==b.actualSection-1&&(g=n,e=a[f]),d+=a[f];var h=Math.round(a[f]/10);o.select("#energy-container").append("g").attr("class","electric-arc").attr("id","arc-group-"+f);for(var i=0;h>i;i++)o.select("#arc-group-"+f).append("path").attr("fill",j(g,-5*i)).data([{section:f,value:i}]).attr("d",x)}o.select("#last-hour-value").text(e+" kW/h"),o.select("#event-value").text(d+" kW/h"),o.select("#cost-value").text(Math.round(.14*d)+" €")}}}})}}}]);