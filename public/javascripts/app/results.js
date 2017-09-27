var surveyApp = angular.module('SurveyApp', []);

surveyApp.controller('ResultsController', function($scope, $http, $location){
  $scope.title = "Nightshade";
  $scope.subtitle = "Survey Results";

  $scope.results = [];

  $scope.view = function(result){
    window.location = "/results/" + result._id;
  }

  $scope.init = function(){
    $http.post('/results').success(function(data){
      if(data.error){
        console.log("An error occurred");
        return;
      }
      $scope.results = data.results;
    }).error(function(err){
      console.log(err);
    });
  }

  $scope.init();
});
