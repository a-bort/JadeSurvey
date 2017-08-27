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
  new Question(
    {
      title: "What are you looking to get out of your outdoor space? (Select all that apply)",
      type: "checkbox",
      items: [
        {label: "Fresh Produce", val: "produce"},
        {label: "Fresh Herbs", val: "herbs"},
        {label: "Nature and Serenity", val: "nature"},
        {label: "Habitat for Wildlife", val: "wildlife"},
        {label: "Utility (i.e mosquito repellent, catnip, privacy)", val: "utility"}
      ],
      other: true,
      options: {
        required: "any"
      }
    }),
  new Question({
      title: "Which do you value more?",
      type: "radio",
      items: [
        {label: "Practicality & Utility", val: "utility"},
        {label: "Beautiy & Aesthetics", val: "beauty"},
        {label: "Both about the same", val: "both"}
      ]
    }),
  new Question({
      title: "Do you cook at home?",
      type: "radio",
      items: [
        {label: "Yes!", val: "yes"},
        {label: "Not often", val: "meh"},
        {label: "Never", val: "no"}
      ],
      enabled: function(){
        return questions[0].getValues().includes("produce")
                || questions[0].getValues().includes("herbs");
      }
    }),
  new Question({
      title: "What type(s) of cuisine do you regularly cook? (Please excuse our gross overgeneralizations)",
      type: "checkbox",
      items: [
        {label: "American, Western European", val: "euro"},
        {label: "Asian (Eastern, Southeastern)", val: "asian"},
        {label: "Italian", val: "italian"},
        {label: "Indian, Middle Eastern, African", val: "indian"},
        {label: "Mexican, Central & South American", val: "mexican"}
      ],
      other: true,
      enabled: function(){
        return questions[0].getValues().includes("produce")
                || questions[0].getValues().includes("herbs");
      }
    }),
  new Question({
      title: "What types of fresh produce do you typically purchase? (Select all that apply)",
      type: "checkbox",
      items: [
        {label: "Vegetables", val: "veggies"},
        {label: "Fruit", val: "fruit"},
        {label: "Nuts", val: "nuts"}
      ],
      other: true,
      enabled: function(){
        return questions[0].getValues().includes("produce");
      }
    }),
  new Question({
      title: "Do you make cocktails at home?",
      type: "radio",
      items: [
        {label: "Yes", val: "yes"},
        {label: "No", val: "no"}
      ],
      options: {
        required: "any"
      },
      enabled: function(){
        return questions[0].getValues().includes("herbs");
      }
    }),
  new Question({
      title: "Do you make Medicinal or Herbal tea at home?",
      type: "radio",
      items: [
        {label: "Yes", val: "yes"},
        {label: "No", val: "no"}
      ],
      enabled: function(){
        return questions[0].getValues().includes("herbs");
      }
    }),
  new Question({
      title: "Do you enjoy colorful flowers?",
      type: "radio",
      items: [
        {label: "Yes! The brighter the better", val: "yes"},
        {label: "In moderation", val: "some"},
        {label: "Not so much", val: "no"}
      ],
      enabled: function(){
        return questions[0].getValues().includes("nature");
      }
    }),
  new Question({
      title: "Do you enjoy lush green landscapes?",
      type: "radio",
      items: [
        {label: "Yes! I want a forest in my yard", val: "yes"},
        {label: "Some greenery is nice", val: "some"},
        {label: "Not thanks, too plain", val: "no"}
      ],
      enabled: function(){
        return questions[0].getValues().includes("nature");
      }
    }),
  new Question({
    title: "What types of wildlife would you like to attract? (Select all that apply)",
    type: "checkbox",
    items: [
      {label: "Birds", val: "birds"},
      {label: "Bees", val: "bees"},
      {label: "Butterflies", val: "butterflies"},
      {label: "Bats", val: "bats"}
    ],
    other: true,
    enabled: function(){
      return questions[0].getValues().includes("wildlife");
    }
  }),
  new Question({
    title: "What other types of utility would you like to get out of your space? (Select all that apply)",
    type: "checkbox",
    items: [
      {label: "Mosquito repellent", val: "mosquito"},
      {label: "Catnip (for my cat)", val: "catnip"},
      {label: "Fragrance", val: "smell"},
      {label: "Privacy", val: "privacy"},
    ],
    other: true,
    enabled: function(){
      return questions[0].getValues().includes("utility");
    }
  }),
  new Question({
    title: "How much time do you foresee spending in your space?",
    type: "radio",
    items: [
      {label: "5-10 minutes most days", val: "frequent"},
      {label: "At least half an hour a day", val: "alot"},
      {label: "Hard to say, my schedule is unpredictable", val: "dunno"},
      {label: "I don’t really have free time", val: "none"}
    ]
  }),
  new Question({
    title: "If you had expert advice easily available on your smartphone, would you be more confident when gardening or caring for a landscape?",
    type: "radio",
    items: [
      {label: "Yes! Sounds appealing", val: "yes"},
      {label: "No thanks, I’m confident in my abilities", val: "nah"},
      {label: "Leave technology out of it!", val: "no"}
    ]
  }),
  new Question({
    title: "Are there certain plants you would like to specifically request?",
    type: "textarea"
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
