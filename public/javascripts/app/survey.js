var surveyApp = angular.module('SurveyApp', []);

var questions = [
  new Question({
    title: "Let's get some info about you",
    type: "text",
    items: [
      {label: "Name"},
      {label: "Email"},
      {label: "Phone"},
      {label: "Street Address"},
      {label: "Apartment / Suite", required: false},
      {label: "Zip"}
    ],
    options: {
      required: "all"
    }
  }),
  new Question({
    title: "Sample checkbox",
    type: "checkbox",
    items: [
      {label: "Option 1", value: "1"},
      {label: "Option 2", value: "2"},
      {label: "Option 3", value: "3"}
    ],
    other: true,
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "Sample Radio",
    type: "radio",
    items: [
      {label: "Yes", value: "yes"},
      {label: "No", value: "no"}
    ],
    other: true,
    options: {
      required: "any"
    },
    enabled: function(){
      return questions[1].getValues().includes("2");
    }
  }),
  new Question({
    title: "Anything else you'd like to share with us?",
    type: "textarea"
  })
];

function Question(obj){
  $.extend(this, obj);
}

Question.prototype.otherChanged = function(){
  if(this.otherValue){
    this.otherSelected = true;
  } else {
    this.otherSelected = false;
  }
}

Question.prototype.isComplete = function(){
  if(!this.options || !this.options.required){ return true; }

  if(this.type == "radio"){
    if(this.value == "other"){
      return this.otherValue;
    }
    return this.value;
  }

  var requirement = this.options.required;

  if(this.type == "textarea"){
    return this.value;
  }

  if(requirement == "all"){
    for(var i = 0; i < this.items.length; i++){
      var item = this.items[i];
      if(!this.extractValue(item) && item.required !== false){ return false; }
    }
    return true;
  }
  if(requirement == "any"){
    for(var i = 0; i < this.items.length; i++){
      var item = this.items[i];
      if(this.extractValue(item)){ return true; }
    }
    if(this.other && this.otherValue){ return true; }
    return false;
  }
  return true;
}

Question.prototype.getValues = function(){
  var values = [];
  if(this.type == "text"){
    for(var i = 0; i < this.items.length; i++){
      values.push(this.items[i].value);
    }
  } else if(this.type == "checkbox"){
    for(var i = 0; i < this.items.length; i++){
      var item = this.items[i];
      if(item.selected){
        values.push(item.value);
      }
    }
  } else if(this.type == "radio" || this.type == "textarea"){
    values.push(this.value);
  }
  return values;
}

Question.prototype.getDisplayValues = function(){
  var values = [];
  if(this.type == "text"){
    for(var i = 0; i < this.items.length; i++){
      values.push(this.items[i].label + "|" + this.items[i].value);
    }
  } else if(this.type == "checkbox"){
    for(var i = 0; i < this.items.length; i++){
      var item = this.items[i];
      if(item.selected){
        values.push(item.value);
      }
    }
  } else if(this.type == "radio" || this.type == "textarea"){
    values.push(this.value);
  }
  return values;
}

Question.prototype.extractValue = function(lineItem){
  if(this.type == "text"){
    return lineItem.value;
  } else if(this.type == "checkbox" && lineItem.selected){
    return lineItem.value;
  }
}

Question.prototype.toJSON = function(){
  var json = {};

  json.question = this.title;
  json.answers = this.getDisplayValues();
  json.otherValue = this.other ? this.otherValue : null;

  if(this.enabled && typeof(this.enabled) == "function" && !this.enabled()){
    json.na = true;
  }

  return json;
}

surveyApp.controller('SurveyController', function($scope, $http, $location){
  $scope.activeIndex = 0;
  $scope.activeQuestion = questions[$scope.activeIndex];

  $scope.questionComplete = function(){
    return $scope.activeQuestion ? $scope.activeQuestion.isComplete() : true;
  }

  $scope.next = function(){
    answerStack.push($scope.activeIndex);
    var found = false;
    var q;
    while(!found){
      $scope.activeIndex++;
      q = questions[$scope.activeIndex];
      if(q.enabled === undefined || (typeof(q.enabled) == "function" && q.enabled())){
        found = true;
      }
    }
    $scope.activeQuestion = q;
  };

  $scope.prev = function(){
    previousQuestion = answerStack.pop();
    $scope.activeIndex = previousQuestion;
    $scope.activeQuestion = questions[previousQuestion];
  };

  $scope.lastQuestion = function(){
    return $scope.activeIndex == questions.length - 1;
  };

  $scope.submit = function(){
    var model = [];
    for(var i = 0; i < questions.length; i++){
      model.push(questions[i].toJSON());
    }

    $http.post('/submit/', model).success(function(data){
      if(data.error){
        console.log(data.error);
        alert(data.error);
        return;
      }
      alert('Success! (Redirect instead)');
    }).error(function(err){
      console.log(err);
      alert('Error saving game');
    });
  }

  var answerStack = [];
});
