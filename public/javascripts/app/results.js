var surveyApp = angular.module('SurveyApp', []);

surveyApp.controller('ResultsController', function($scope, $http, $location){
  $scope.title = "Nightshade";
  $scope.subtitle = "Survey Results";

  $scope.results = [];

  $scope.getEmail = function(result){
    var qs = result.questions.filter(q => q.name == "email");
    if(!qs.length) return result.questions[0].answers[0].split("|")[1]; //old format
    return qs[0].answers[0].split("|")[1];
  }

  $scope.showingReviewed = false;

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

  $scope.showReviewed = function(){
    $scope.showingReviewed = true;
  }

  $scope.hideReviewed = function(){
    $scope.showingReviewed = false;
  }

  $scope.resultShouldBeShown = function(result){
    return !result.reviewed || $scope.showingReviewed;
  }

  $scope.anyVisibleResults = function(){
    for(var i = 0; i < $scope.results.length; i++){
      if($scope.resultShouldBeShown($scope.results[i])){
        return true;
      }
    }
    return false;
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
