var surveyApp = angular.module('SurveyApp', []);

surveyApp.controller('ResultController', function($scope, $http, $location){
  $scope.title = "Nightshade";
  $scope.subtitle = "Survey Results";

  $scope.result = {};

  $scope.parseAnswer = function(question){
    if(question.na){
      return "N/A";
    }
    if(question.answers && question.answers.length){
      if(question.answers.length == 1){
        if(question.answers[0]){
          return question.answers[0];
        }
        return "N/A"
      } else{
        var res = "";
        for(var i = 0; i < question.answers.length; i++){
          var ans = question.answers[i];
          if(ans && ans.indexOf("|") >= 0){
            var split = ans.split("|");
            res += (split[0] + ": " + split[1] + "\n");
          } else{
            res += (ans + "\n");
          }
        }
        return res;
      }
    }
    return "N/A";
  }

  $scope.init = function(){
    $http.post($location.path()).success(function(data){
      if(data.error){
        console.log("An error occurred");
        return;
      }
      $scope.result = data.result;
    }).error(function(err){
      console.log(err);
    });
  }

  $scope.init();
});
