'use strict';

/**
 * @ngdoc directive
 * @name bocFrontendApp.directive:waitClock
 * @description
 * # waitClock
 */
angular.module('bocFrontendApp')
  .directive('waitClock', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'AE',
      scope: {
        time: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

          //Numero de separaciones del reloj
          var totalSecciones = 100;

          //Atributo de valor actual
          var actualValue = scope.time;
          if(isNaN(parseInt(actualValue)) ){
            actualValue = 0;
          }

          var actualPercentage = (actualValue*100)/totalSecciones;


          var gaugeColor = ['#9BC741','#EDBC3E','#EDBC3E','#AB1D5D'];
          attrs.colors = angular.fromJson(attrs.colors);
          if(attrs.colors !== null && typeof attrs.colors === 'object'){
            gaugeColor = attrs.colors;
          }

          var negativeValue = attrs.negativeValue || 'Closed';

          
          var currentColor = gaugeColor[Math.floor((actualPercentage*gaugeColor.length)/100)];

          //Elemento SVG ajustado al 100% del contenedor
          var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');

          
          //Ancho y alto total de la gráfica
          var totalWidth = d3.select(ele[0])[0][0].offsetWidth;
          if(totalWidth === undefined || totalWidth <=0){
            totalWidth = svg[0][0].offsetWidth;
          }
          var totalHeight = attrs.height || 100;

          //Establece el alto de grafica
          svg.attr('height', totalHeight);

          //Responsive, vuelve a renderizar en caso de un redimensionamiento de pantalla ACTUALMENTE NO ES RESPONSIVE
          $window.onresize = function() {
            //scope.$apply();
          };
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.updateActual(scope.time);
          });
          
          //Vuelve a renderizar la gráfica en caso de cambios en la data
          scope.$watch('time', function(newActual) {
            scope.updateActual(newActual);
          }, true);


          function centerTranslation() {
            return 'translate('+totalWidth/2 +','+ totalHeight/2 +')';
          }

          
          svg.append('g')
            .attr('id', 'clock-container')
            .attr('transform', centerTranslation());

          
          function deg2rad(deg) {
            return ((deg) * Math.PI / 180);
          }

          var radius = totalWidth/2;
          if(totalWidth > totalHeight){
            radius = totalHeight/2;
          }

          

          var arc = d3.svg.arc()
            .innerRadius(radius-20)
            .outerRadius(radius-5)
            .startAngle(deg2rad(0))
            .endAngle(function(d){
              //console.log(d);
              var deg = (d*360)/100;
              deg = Math.floor(deg);
              //console.log(deg);
              return deg2rad(deg);
            });

          var sepArc = d3.svg.arc()
            .innerRadius(radius-3)
            .outerRadius(radius)
            .startAngle(function(d,i) {
              var anchoSep = (Math.floor(360/12));
              return deg2rad(anchoSep*i);
            })
            .endAngle(function(d,i) {
              var anchoSep = (Math.floor(360/12));

              return deg2rad((anchoSep*i)+1);
            });

          svg.select('#clock-container')
            .selectAll('path')
            .data(new Array(12))
            .enter().append('path')
              .attr('fill', '#FFF')
              .attr('d', sepArc);

          svg.select('#clock-container')
            .append('circle')
              .attr('fill', '#3E3E3D')
              .attr('r', radius-5)
              .attr('cx', 0)
              .attr('cy', 0);

          svg.select('#clock-container')
            .append('circle')
              .attr('id', 'cover-circle')
              .attr('fill', '#000')
              .attr('stroke', currentColor)
              .attr('stroke-width', '1px')
              .attr('r', radius-20)
              .attr('cx', 0)
              .attr('cy', 0);

          svg.select('#clock-container')
            .append('text')
              .attr('id','min-placeholder')
              .text('%')
              .attr('fill', '#FFF')
              .attr('y',-3)
              .attr('x', 23)
              .style('font-size','24px');

          

          /*svg.select('#clock-container')
            .append('text')
              .attr('id','seg-placeholder')
              .text('seg')
              .attr('fill', '#FFF')
              .attr('y',17)
              .attr('x', 10)
              .style('font-size','14px');*/

          svg.select('#clock-container')
            .append('g')
            .attr('data-direction','down')
            .attr('id', 'arrow-container');

          svg.select('#arrow-container')
            .append('path')
              .attr('d', 'M0,0H10L5,8L0,0')
              .attr('stroke', 'transparent')
              .attr('fill', '#AEAEAE')
              .attr('transform','translate(-36,-3)')
              .attr('x', -30);

          svg.select('#arrow-container')
            .append('path')
              .attr('d', 'M0,0H10L5,8L0,0')
              .attr('stroke', 'transparent')
              .attr('fill', '#848484')
              .attr('transform','translate(-36,-15)')
              .attr('x', -30);

          svg.select('#arrow-container')
            .append('path')
              .attr('d', 'M0,0H10L5,8L0,0')
              .attr('stroke', 'transparent')
              .attr('fill', '#222221')
              .attr('transform','translate(-36,-27)')
              .attr('x', -30);

          /*svg.select('#clock-container')
              .append('text')
                .attr('id','sec')
                .text(actualValue[1])
                .attr('fill', '#FFF')
                .attr('y',17)
                .attr('x', -20)
                .style('font-size','22px')
                .style('font-weight', 'bold');*/

            svg.select('#clock-container')
              .append('text')
                .attr('id','min')
                .text(actualValue)
                .attr('fill', '#FFF')
                .attr('y',-3)
                .attr('x', -0)
                .attr('text-anchor', 'middle')
                .style('font-size','37px')
                .style('font-weight', 'bold');

            svg.select('#clock-container')
              .append('text')
                .attr('id','closed')
                .text('')
                .attr('fill', '#FFF')
                .attr('y',9)
                .attr('x', -37)
                .style('font-size','22px')
                .style('font-weight', 'bold');

          svg.select('#clock-container')
              .append('text')
                .attr('id','msg-placeholder')
                .text('Great moment for:')
                .attr('fill', '#FFF')
                .attr('y',18)
                .attr('x', 0)
                .attr('text-anchor', 'middle')
                .style('font-size','9px')
                .style('font-weight', '');

          svg.select('#clock-container')
              .append('text')
                .attr('id','message')
                .text('')
                .attr('fill', '#FFF')
                .attr('y',30)
                .attr('x', 0)
                .attr('text-anchor', 'middle')
                .style('font-size','9px')
                .style('font-weight', '');
          

          //Actualiza la gráfica y los textos asociados
          scope.updateActual = function(valorActual) {
            //Si no hay parametros no continúa
            if (!valorActual) {
                return;
            }
            var isValid = true;
            var actualValue;
            if(isNaN(parseInt(valorActual))){
              isValid = false;
            }else{
              actualValue = valorActual;
            }

            if(isValid === true){
              

              var actualPercentage = (actualValue*100)/totalSecciones;
              var currentColor = gaugeColor[Math.floor((actualPercentage*gaugeColor.length)/100)];

              var oldValueMin = parseInt(svg.select('#min').text());
              //var oldValueSeg = parseInt(svg.select('#sec').text());
              var mov = 'down';
              if(oldValueMin < actualValue){
                mov = 'up';
              }

              var message = '';

              switch(true){
                case actualValue<5:
                  message = 'RELAX';
                break;
                case actualValue>=5 && actualValue<40:
                
                  message = 'MEETINGS';
                break;
                case actualValue>=40 && actualValue<70:
                
                  message = 'NETWORKING';
                break;
                case actualValue>=70 && actualValue<100:
                  message = 'BACK TO WORK';
                break;
              }


              svg.select('#min').text(actualValue);
              svg.select('#closed').text('');
              svg.select('#min-placeholder').text('%');
              svg.select('#message').text(message);
              //svg.select('#sec').text(actualValue[1]);
              //svg.select('#seg-placeholder').text('seg');
              svg.select('#arrow-container').style('display', 'block');
              if(svg.select('#arrow-container').attr('data-direction') !== mov){
                svg.select('#arrow-container').attr('data-direction',mov);
                if(mov === 'down'){
                  svg.select('#arrow-container').attr('transform', 'rotate(0 -30 0)');
                }else{
                  svg.select('#arrow-container').attr('transform', 'rotate(180 -30 -15)');
                }
                
              }

              svg.select('#gauge-arc').remove();

              svg.select('#cover-circle').attr('stroke',currentColor);

              svg.select('#clock-container').append('path')
                .attr('fill', currentColor)
                .attr('id', 'gauge-arc')
                .data([actualPercentage])
                .attr('d', arc);
            }else{
              svg.select('#closed').text(negativeValue);
              //svg.select('#sec').text('');
              svg.select('#min').text('');
              //svg.select('#min-placeholder').text('');
              svg.select('#seg-placeholder').text('');
              svg.select('#arrow-container').style('display', 'none');

              svg.select('#gauge-arc').remove();
              svg.select('#clock-container').append('path')
                .attr('fill', gaugeColor[0])
                .attr('id', 'gauge-arc')
                .data([0])
                .attr('d', arc);
            }

          };
        });
      }};
}]);




















