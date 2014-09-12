angular.module('sundaServices', [])
	.factory('Routes', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/user-routes');
			},
			getByGroup : function(group) {
				return $http.get('/user-routes/'+group);
			},
			create : function(callData) {
				return $http.post('/user-routes', callData);
			},
			update : function(callData) {
				return $http.put('/user-routes', callData);
			},
			delete : function(id) {
				return $http.delete('/user-routes/'+id)
			}
		}
	}]);