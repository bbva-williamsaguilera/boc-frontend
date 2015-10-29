'use strict';

/**
 * @ngdoc directive
 * @name bocFrontendApp.directive:floorMap
 * @description
 * # floorMap
 */
angular.module('bocFrontendApp')
  .directive('floorMap', ['$window', 
  function($window) {
    return {
      restrict: 'AE',
      scope: {
        occupancy: '='
      },
      link: function(scope, ele, attr) {

        //Imagen de fondo
        var imgSrc = attr.src;

        //var occupiedColor = '#AB1D5D';
        
        var tag = '<img src="'+imgSrc+'" class="" style="width:100%;" id="bg_layer"/>';

        ele.append(tag);

        var totalLayers = 0;
        if(attr.layerTotal && !isNaN(parseInt(attr.layerTotal)) ){
          totalLayers = parseInt(attr.layerTotal);
        }

        var container = '<div id="layer_container" class="col-xs-12" style="position:absolute; top:-0px; width:93%;">';
        for(var i=1; i<=totalLayers; i++){
          container += '<img id="map_layer-'+i+'" src="'+attr.layerSrc+i+attr.layerExt+'" class="img-responsive img-layer" style="position:absolute; top:0px; left:0px; display:none;" />';          
        }
        container += '</div>';
        ele.append(container);

        //Datos de ocupación
        var occupancy = scope.occupancy;

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.updateOccupancy(occupancy);
        });
        
        //Vuelve a renderizar la gráfica en caso de cambios en la data
        scope.$watch('occupancy', function(newOccupancy) {
          scope.updateOccupancy(newOccupancy);
        }, true);

        
        //Actualiza la gráfica y los textos asociados
        scope.updateOccupancy = function(newOccupancy) {

          
          //Si no hay parametros no continúa
          if (!newOccupancy) {
              return;
          }

          for(i=0; i<newOccupancy.length; i++){
            var layer = $('#layer_container').find('#map_layer-'+(i+1));
            if(newOccupancy[i]===false){

              $(layer).css('display','block');
            }else{
              $(layer).css('display','none');
            }
          }


        };
      }};
}]);