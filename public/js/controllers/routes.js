angular.module('sundaControllers', [])
	.controller('routesController', ['$scope','$http','Routes', function($scope, $http, Routes) {
		$scope.editForm = true;
		$scope.group = null;
		$scope.callForm = null;
		$scope.showDeleteCall = false;
		Routes.get().success(function(data) {
			$scope.calls = data;
			$scope.loading = false;
		});
		
		$scope.select = function(call){
			$scope.callForm = {_id: call._id, method : call.method, path : call.path};
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
		
		$scope.remove = function(id){
			Routes.delete(id)
				.success(function() {
					Routes.get().success(function(data) {
						$scope.calls = data;
						$scope.loading = false;
					});
			});
			$scope.callForm = null;
		}
		
		$scope.cancelEdit = function(){
			$scope.callForm = null;
		}
	}]);