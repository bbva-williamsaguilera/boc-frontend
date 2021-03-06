'use strict';

/**
 * @ngdoc service
 * @name bocFrontendApp.backendApi
 * @description
 * # backendApi
 * Factory in the bocFrontendApp.
 */
angular.module('bocFrontendApp')
	.factory('backendApi', ['$http', function ($http) {
		
		var host;
		var local = false;
		if(local){
			host = 'http://localhost:9000/api/';
		}else{
			host = 'http://52.18.80.55/api/';	
		}

		var today = moment().subtract((4+2),'hours').format('YYYY-MM-DD hh:mm:ss');
		var limit = 20;


		function getDevices(){
			return $http.get(host+'sensortag');
		}

		function getSensorData(device){
			return $http.get(host+'datum?device='+device+'&after='+today+'&limit='+limit);
		}

		function getGenericData(generic,extra){
			if(extra !== undefined){
				extra = '/'+extra;
			}else{
				extra = '';
			}
			return $http.get(host+'generic/'+generic+extra+'?after='+today+'&limit='+limit);
		}

		function getSpeakers(){
			return $http.get('misc/speakers.json');
		}

		function getGenericVolumeData(generic){
			return $http.get(host+'generic/aggregate/'+generic+'?index=volume&threshold=2&after='+today+'&limit='+limit);
		}

		function getScheduleData(){
			return $http.get('misc/schedule.json');
			//return $http.get(host+'generic/schedule?limit=100');
		}

		return {
			getDevices: getDevices,
			getSensorData: getSensorData,
			getGenericData: getGenericData,
			getScheduleData: getScheduleData,
			getGenericVolumeData: getGenericVolumeData,
			getSpeakers: getSpeakers
		};
	}]);
