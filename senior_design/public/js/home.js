

var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$http','$scope', function($http, $scope) {
    
	$scope.garageIDs = [
            "A","B","C","D","E","F","G","H","I","Libra"
    ];

    $scope.garageLevels = [];

    console.log("testing git");

    /////stores vehicle location based on user login information
    $scope.saveSpot = function() {
     	
    	var username = $scope.userid;
    	var password = $scope.paw;
        var garage_ID = $scope.garageID;
        var floor_level = $scope.floor_level;
    	
    	console.log(username);
    	console.log(password);

        var data = {
            userid: username,
            pass: password,
            garageID: garage_ID,
            floorLevel: floor_level
        };

       
        //checks users login information
    	$http.post('/saveSpot', data).then(

            function success(response){
    		
                console.log("success?");

                    

    		//$scope.passcode2 = response.data[0].passcode;
    		//console.log($scope.passcode2);   
    	   }, 

           function err(response){
    		
                console.log(response);
    	
            }

        );
			
    };

    //gets levels when garage name changes
    $scope.getGarageLevels = function() {
        
        var data = {
            garageID: $scope.garageID
        };

        $http.put('/garageLevels', data).then(


            function success(response){
            
                $scope.garageLevels = [];
                var garageMaxLevel = response.data.number_of_floors;

                var i;
                var counter = 1;

                for(i = 0; i < garageMaxLevel;i++){

                    if((i+1) == garageMaxLevel){

                        $scope.garageLevels[i] = "Roof"
                        continue;
                    }

                    $scope.garageLevels[i] = counter;
                    counter++;

                }  
          
           }, 

           function err(response){
            
                console.log(response);
        
            }

        );

    };

    //test function of backend updating number of vehicles in a garage
    $scope.updateGarage = function() {
        
       
       var data = {
            garageID: $scope.garageID
        };

        $http.post('/carEnters', data).then(


            function success(response){
            
                console.log("Garage Updated");

          
           }, 

           function err(response){
            
                console.log(response);
        
            }

        );
            
    };

    //dunno yet
    $scope.init = function() {
        
       /* $http.post('')

        $http.post('/garageData', data).then(function success(response){
            console.log("weeeeee heerea yea");
        })*/

    };

    
  

    //retrieves vehicle location based on user login information
    $scope.retrieveSpot = function() {
        
       /* $http.post('')

        $http.post('/garageData', data).then(function success(response){
            console.log("weeeeee heerea yea");
        })*/

    };


    






}]);

