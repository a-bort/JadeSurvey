var surveyApp = angular.module('SurveyApp', []);

surveyApp.controller('ResultsController', function($scope, $http, $location){
  $scope.title = "Nightshade";
  $scope.subtitle = "Survey Results";
});
