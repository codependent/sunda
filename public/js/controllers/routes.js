angular.module('sundaControllers', [])
	.controller('routesController', ['$scope','$http','Routes', function($scope, $http, Routes) {
		$scope.editForm = true;
		$scope.group = null;
		$scope.callForm = null;
		$scope.showDeleteCall = false;
		$scope.urlParamsClass = '';
		$scope.headersClass = '';
		$scope.urlParams = [{key : '', value : ''}];
		$scope.headers = {}
		Routes.get().success(function(data) {
			$scope.calls = data;
		});
		
		$scope.select = function(call){
			$scope.callForm = {_id: call._id, method : call.method, path : call.path, response: {code : call.response.code, type : call.response.type, data : call.response.data} };
		}
		
		$scope.save = function(){
			Routes.create($scope.callForm)
				.success(function(data) {
					$scope.calls.push(data);
			});
			$scope.callForm = null;
		}
		
		$scope.update = function(){
			Routes.update($scope.callForm)
				.success(function() {
					Routes.get().success(function(data) {
						$scope.calls = data;
					});
			});			
		}
		
		$scope.remove = function(id){
			Routes.delete(id)
				.success(function() {
					Routes.get().success(function(data) {
						$scope.calls = data;
					});
			});
			$scope.callForm = null;
		}
		
		$scope.cancelEdit = function(){
			$scope.callForm = null;
		}

		$scope.toggleURLParams = function(){
			$scope.urlParamsClass = ($scope.urlParamsClass == '') ? 'active' : '';			
		}

		$scope.addURLParam = function(last){
			if(last){
				$scope.urlParams.push({ key: '', value: '' });
			}
		}

		$scope.removeURLParam = function(index){
			$scope.urlParams.splice(index,1);
		}

		$scope.changeResponseType = function(){

		}

	}]);