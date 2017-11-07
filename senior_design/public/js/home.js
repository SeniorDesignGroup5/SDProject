

var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$http','$scope','$compile','$timeout', function($http, $scope, $compile,$timeout) {
    
	$scope.garageIDs = [
            "A","B","C","D","E","F","G","H","I","Libra"
    ];

    $scope.garageLevels = [];
    $scope.successSaveSpot = false;
  

    $scope.test = 222;

    garageData();

    console.log("testing git");


    $scope.onFileSelected = function(){

        console.log("we here")
        var filesUpload = document.getElementById("fileImg").files
        console.log(filesUpload[0]);
        
        var reader = new FileReader();

        $scope.fileID = filesUpload[0].name;

        reader.onload = function(event) {

            
                

            var file = event.target.result;

            //this just displays the photo back onto a HTML element
            //imgtag.src = file;

            //make sure file gets read in
            //console.log(file);

            //create new image
            var img = new Image();

            //load image
            img.src = event.target.result;

            //once image loads, run parser
            img.onload = function(){


                console.log(this.width);
                console.log(this.height);


                var mycanvas = document.createElement('canvas');
                mycanvas.id = "myimage";
                mycanvas.width = this.width;
                mycanvas.height = this.height;

                var imgtag = document.getElementById("myimage");
                var ctx    = mycanvas.getContext("2d");
                ctx.drawImage(this, 0, 0, this.width, this.height);
               

                var imgdata = ctx.getImageData(0,0,this.width,this.height);

                var rgba = imgdata.data;
                console.log(rgba.length);

                //bitmap works and gets returned
                var binarizedImage = jsQR.binarizeImage(rgba, this.width, this.height);
                console.log(binarizedImage);

                
                var location = jsQR.locateQRInBinaryImage(binarizedImage);
                console.log(location);

                if (!location) {
                  return;
                }


                var rawQR = jsQR.extractQRFromBinaryImage(binarizedImage, location);
                console.log(rawQR);
                if (!rawQR) {
                  return;
                }

                var myvar = jsQR.decodeQR(rawQR);
                var myjson = JSON.parse(myvar);
                console.log(myjson.garage_id);
                
                if(myjson)
                {
                     $scope.fileID = myjson;
                }

                console.log(jsQR.decodeQR(rawQR));


            }

        };

        reader.readAsDataURL(filesUpload[0]);

    }







    for(var i = 0; i < 3; i++){
        var number = 50;
        var svgTag = '<svg width="200" height="'+number+'"> <g><rect width="200" height="50" style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)" /><text x="55" y="39" font-family="Verdana" font-size="35" fill="blue" ng-bind ="test"></text></g></svg>';
   
         var el = document.getElementById('garageMap');
         angular.element(el).append($compile(svgTag)($scope));
    }
    

    /////stores vehicle location based on user login information
    $scope.saveSpot = function() {
     	
        $scope.userDoesntExistSub = false;
        $scope.incorrectPasswordSub = false;
        $scope.errorCheck = false;

    	var username = $scope.userid;
    	var password = $scope.password;
        var garage_ID = $scope.garageID;
        var floor_level = $scope.floor_level;
        var spot = $scope.spot_number;
    	
    	console.log(username);
    	console.log(password);
        console.log(floor_level);


         if((!username) || (!password) || (!garage_ID) || (!floor_level) || (!spot)){
            console.log("check worked");
            $scope.errorCheckLogin = true;
            return;
        }



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
            $scope.errorCheckLogin = false;

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

                $scope.successSaveSpot = true;    

    		//$scope.passcode2 = response.data[0].passcode;
    		//console.log($scope.passcode2);   
    	   }, 

           function err(response){
    		
                console.log(response);
                if(response.status == 403)
                {
                    console.log("we made it?");
                    $scope.userDoesntExistSub = true;
                }
                else if(response.status == 400){
                    $scope.incorrectPasswordSub = true;
                }
                else{
                    $scope.incorrectPasswordSub = false;
                    $scope.userDoesntExistSub = false;
                }
    	
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

        $scope.userDoesntExist = false;
        $scope.incorrectPassword = false;

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
            
                console.log(response.status);

                if(response.status == 403)
                {
                    console.log("we made it?");
                    $scope.userDoesntExist = true;
                }
                else if(response.status == 400){
                    $scope.incorrectPassword = true;
                }
                else{
                    $scope.incorrectPassword = false;
                    $scope.userDoesntExist = false;
                }
            }

        );





    };






}]);

