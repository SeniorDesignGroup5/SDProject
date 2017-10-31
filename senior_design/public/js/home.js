

var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$http','$scope','$compile','$timeout', function($http, $scope, $compile,$timeout) {
    
	$scope.garageIDs = [
            "A","B","C","D","E","F","G","H","I","Libra"
    ];

    $scope.garageLevels = [];
    var currentSelectedLevel;

    $scope.test = "Hello";

    garageData();

    console.log("testing git");

    for(var i = 0; i < 3; i++){
        var number = 50;
        var svgTag = '<svg width="200" height="'+number+'"> <g><rect width="200" height="50" style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)" /><text x="55" y="39" font-family="Verdana" font-size="35" fill="blue" ng-bind ="test"></text></g></svg>';
   
         var el = document.getElementById('garageMap');
         angular.element(el).append($compile(svgTag)($scope));
    }
    

    /////stores vehicle location based on user login information
    $scope.saveSpot = function() {
     	
    	var username = $scope.userid;
    	var password = $scope.password;
        var garage_ID = $scope.garageID;
        var floor_level = $scope.floor_level;
        var spot = $scope.spot_number;
    	
    	console.log(username);
    	console.log(password);
        console.log(floor_level);


        if(spot <= 0){
            $scope.errorCheck = true;
            return;
        }
        else
            $scope.errorCheck = false;

        if((!username) || (!password)){
            $scope.errorCheckLogin = true;
            return;
        }
        else
            scope.errorCheckLogin = false;

        var data = {
            userid: username,
            pass: password,
            garageID: garage_ID,
            floorLevel: floor_level,
            spotNumber: spot,
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


    
    function garageData(){

        $http.get('/garageData').then(

            function success(response){
                $scope.garageData = response.data;
                console.log(response.data);
                $timeout(garageData, 5000);
            },
            function error(response){
                console.log("there was an error!");
            }
        )

    }

    $scope.garageStatus = function (max, current){

        if(current >= max)
            return true;
        else 
            return false;

    }

    //retrieves vehicle location based on user login information
    $scope.retrieveSpot = function() {
        
        var username = $scope.userid;
        var password = $scope.password;

        var data = {
            userid: username,
            pass: password
        };

        if((!username) || (!password)){
            $scope.errorCheckLoginRetrieve = true;
            return;
        }
        else
            $scope.errorCheckLoginRetrieve = false;

        $http.post('/retrieveSpot', data).then(

            function success(response){
            
                console.log("success?");

                console.log(response.data);    

                $scope.userSpot = "Garage: " + response.data[0].garage_id + "   Floor: " + response.data[0].floor_level + "   Number: " + response.data[0].current_numbered_spot;


            //$scope.passcode2 = response.data[0].passcode;
            //console.log($scope.passcode2);   
           }, 

           function err(response){
            
                console.log(response);
        
            }

        );





    };






}]);

