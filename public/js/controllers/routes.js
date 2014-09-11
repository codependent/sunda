angular.module('sundaControllers', [])
	.controller('routesController', ['$scope','$http','Routes', function($scope, $http, Routes) {
		$scope.editForm = true;
		$scope.group = null;
		$scope.callForm = null;
		Routes.get().success(function(data) {
			$scope.calls = data;
			$scope.loading = false;
		});
		
		$scope.select = function(call){
			$scope.callForm = {id: call.id, method : call.method, path : call.path};
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
				.success(function(data) {
					console.log($scope.calls);
					//TODO
			});
			$scope.callForm = null;
		}
		
		$scope.remove = function(){
			Routes.delete($scope.callForm)
				.success(function(data) {
					console.log(data);
					//TODO
			});
			$scope.callForm = null;
		}
		
		$scope.cancelEdit = function(){
			$scope.callForm = null;
		}
	}]);