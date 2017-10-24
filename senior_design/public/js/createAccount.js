

var myApp = angular.module('createAccount', []);

myApp.controller('myCtrl', ['$http','$scope', function($http, $scope) {
    

    $scope.create = function() {
     	
    	var username = $scope.userid;
    	var password = $scope.paw;
    	

    	console.log(username);
    	console.log(password);

        var data = {
            userid: username,
            pass: password
        };

        if(password == $scope.pawconfirm){

            $http.post('/create', data).then(

                function (response){
                   $scope.Message = "Account Created Successfully";

                   
       
            }, function (response){
               
                if(response.data == 'Duplicate User')
                    $scope.Message = 'Username already exists';

                console.log(response.data);
            });
        }
        else{
            console.log("Your passwords do not match");
        }

    	
			
    };

}]);