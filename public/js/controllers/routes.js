angular.module('sundaControllers', [])
	.controller('routesController', ['$scope','$http','Routes', function($scope, $http, Routes) {
		$scope.editForm = true;
		$scope.group = null;
		$scope.callForm = {params:[]};
		$scope.showDeleteCall = false;
		$scope.headersClass = '';
		$scope.headers = {}
		Routes.get().success(function(data) {
			$scope.calls = data;
		});
		
		$scope.select = function(call){
			console.log(call);
			$scope.callForm = angular.copy(call);
		}
		
		$scope.save = function(){
			if(validateCallForm()){
				Routes.create($scope.callForm)
					.success(function(data) {
						$scope.calls.push(data);
					});
				resetCallForm();
			}
		}
		
		$scope.update = function(){
			if(validateCallForm()){
				Routes.update($scope.callForm)
					.success(function() {
						Routes.get().success(function(data) {
							$scope.calls = data;
						});
				});		
			}
		}
		
		$scope.remove = function(id){
			Routes.delete(id)
				.success(function() {
					Routes.get().success(function(data) {
						$scope.calls = data;
					});
			});
			resetCallForm();
		}

		$scope.invoke = function(){
			var time0 = new Date().getTime();
			$http({method: $scope.callForm.method, url: "http://localhost:3000"+$scope.callForm.path})
			.success(function(data, status, headers, config){
				var time1 = new Date().getTime();
				$scope.invocationResult = {};
				$scope.invocationResult.data = data;
				$scope.invocationResult.status = status;
				$scope.invocationResult.headers = headers;
				$scope.invocationResult.time = time1-time0;
				$scope.invocationResult.format = 'pretty';
			})
			.error(function(data, status, headers, config) {
				console.log("error")
			});
		}
		
		$scope.cancelEdit = function(){
			resetCallForm();
		}

		$scope.toggleURLParams = function(){
			if($scope.callForm.params.length == 0){
				$scope.callForm.params.push({ key: '', value: '' });
			}else{
				$scope.callForm.params = [];
			}
		}

		$scope.addURLParam = function(last){
			if(last){
				$scope.callForm.params.push({ key: '', value: '' });
			}
		}

		$scope.removeURLParam = function(index){
			$scope.callForm.params.splice(index,1);
		}

		$scope.changeResponseType = function(){
			$scope.routeForm.responseData.$setValidity('parse', true);
		}

		$scope.changeResponseData = function(){
			$scope.routeForm.responseData.$setValidity('parse', true);
		}

		function resetCallForm(){
			$scope.callForm = {params:[]};
			$scope.routeForm.$setPristine();
			$scope.routeForm.responseData.$setValidity('parse', true);
			$scope.invocationResult = null;
		}
		
		function validateCallForm(){
			var valid = true;
			if($scope.callForm.response.type != null && $scope.callForm.response.type != ''){
				var data = $scope.callForm.response.data;
				try{
					if($scope.callForm.response.type == 'application/json'){
						$.parseJSON(data)
					}else if($scope.callForm.response.type == 'application/xml'){
						valid = validateXML(data)
					}
				}catch(err){
					valid = false;
				}
			}else{
				$scope.callForm.response.data = '';
			}
			if(!valid){
				$scope.routeForm.responseData.$setValidity('parse', false);
			}

			var filteredParams = [];
			for(var i = 0; i< $scope.callForm.params.length;i++){
				if($scope.callForm.params[i].key!=''){
					filteredParams.push($scope.callForm.params[i]);
				}
			}
			$scope.callForm.params=filteredParams;

			return valid;
		}
		
		function validateXML(str){
			try{
				if(window.DOMParser){
					parser=new DOMParser();
					xmlDoc=parser.parseFromString(str,"text/xml");
					return xmlDoc.documentElement.innerHTML.indexOf("error")==-1;
				}else{
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async=false;
					xmlDoc.loadXML(str);
					return true;
			  	}
				return true
			}catch(err){
				console.log(err);
				return false;
			}
		}

	}]);