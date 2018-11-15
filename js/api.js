sensibel.factory('sensibelAPI', function($http, baseURL, assetsURL, openApiPageName) {

	var requests = [];

	return{
		//variables & strings
		baseURL:assetsURL,
		assetsURL:assetsURL,

		getObjects:getObjects
	}

	function getObjects(className,query){

		if(query){
			var url = baseURL+className+query;
		}else{
			var url = baseURL+className;
		}

		return $http({
			'url': url,
			'method': 'GET',
	        'headers': {
	        	'Content-Type': 'application/json'
	        }
    	}).then(getDataComplete).catch(getDataFailed);

	}

	
	function getDataComplete(response) {
		subRequest();
	    return response.data;
	}

	function getDataFailed(error) {
		subRequest();
	}
	
	function subRequest() {
		requests.pop();
		if (requests.length == 0) {
		}
	}

});

angular.module('app.core.sensibelErrorHandler', [
	'sensibel'
])

//Just console log for now, later we can add more functionality to communicate with unity, analytics etc.
.factory('sensibelErrorHandler', function(){
	return{
		error: function(msg,error){
			console.log(msg);
			console.log(error);
		}
	}
})