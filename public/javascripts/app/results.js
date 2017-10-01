var surveyApp = angular.module('SurveyApp', []);

surveyApp.controller('ResultsController', function($scope, $http, $location){
  $scope.title = "Nightshade";
  $scope.subtitle = "Survey Results";

  $scope.results = [];

  $scope.view = function(result){
    window.location = "/results/" + result._id;
  }

  $scope.markReviewed = function(result){
    $http.post('/results/reviewed/' + result._id, {reviewed: !result.reviewed}).success(function(data){
      if(data.error){
        console.log("An error occurred");
        return;
      }
      result.reviewed = !result.reviewed;
    }).error(function(err){
      alert("An unexpected error occurred");
      console.log(err);
    });
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
