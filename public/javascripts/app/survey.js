var surveyApp = angular.module('SurveyApp', []);

var getAnswers = function(name){
  var qs = questions.filter(q => q.name == name);
  if(!qs.length) return [];
  return qs[0].getValues();
}

var questions = [
  new Question({
    title: "Which culinary domain are you interested in taking to the next level?",
    name: "domain",
    type: "radio",
    items: [
      {label: "Cooking", value: "cooking"},
      {label: "Cocktails", value: "cocktails"},
      {label: "Both of 'em'", value: "both"},
      {label: "Erm... I think I might be in the wrong place...", value: "neither"}
    ],
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "When it comes to improving your cooking, which of the following are the most intriguing to you?",
    name: "cooking",
    type: "checkbox",
    items: [
      {label: "Exploring new and awesome flavors", value: "new flavors"},
      {label: "Improving flavor and aroma of my current dishes", value: "flavor enhancement"},
      {label: "Making my dishes more attractive with badass looking ingredients", value: "attractive dishes"},
      {label: "Having more nutritious ingredients compared to practically all other produce (even farmer’s market)", value: "nutrition"}
    ],
    enabled: function(){
      return getAnswers("domain").includes("cooking") || getAnswers("domain").includes("both");
    },
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "What are you looking to get out of your outdoor space? (Select all that apply)",
    name: "usage",
    type: "checkbox",
    items: [
      {label: "Fresh herbs out the wazoo", value: "herbs"},
      {label: "Fresh produce (legit food production)", value: "produce"},
      {label: "An awesome looking landscape", value: "nature"},
      {label: "Habitat for wildlife", value: "wildlife"},
      {label: "Misc. Utility (i.e fewer mosquitoes on your patio, catnip for your cat, herbal tea production, etc.)", value: "utility"}
    ],
    other: true,
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "Generally speaking, which do you value more?",
    name: "value",
    type: "radio",
    items: [
      {label: "Herb & Food Production", value: "utility"},
      {label: "Natural Beauty & Conservation", value: "beauty"},
      {label: "Both about the same", value: "utility and beauty"}
    ],
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "What type(s) of cuisine do you regularly cook? (Please excuse our grossly overgeneralized categories!!)",
    name: "cuisine",
    type: "checkbox",
    items: [
      {label: "American, Western European", value: "euro"},
      {label: "Asian (Eastern, Southeastern)", value: "asian"},
      {label: "Italian, Mediterranean", value: "italian"},
      {label: "Indian, Middle Eastern, African", value: "indian"},
      {label: "Mexican, Central & South American", value: "mexican"}
    ],
    other: true,
    enabled: function(){
      return getAnswers("usage").includes("produce") || getAnswers("usage").includes("herbs");
    },
  }),
  new Question({
    title: "Any interest in herbal teas?",
    name: "tea",
    type: "radio",
    items: [
      {label: "Tell me more!", value: "yes"},
      {label: "No thanks, not my style", value: "no"}
    ],
    enabled: function(){
      return getAnswers("usage").includes("herbs");
    },
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "Do you tend to walk on the wild side?",
    name: "wild",
    type: "radio",
    items: [
      {label: "Yes! I want a miniature food forest in my yard", value: "yes"},
      {label: "I can handle some nature, but let’s keep it realistic", value: "some"},
      {label: "I’d prefer things to be well kempt", value: "no"}
    ],
    enabled: function(){
      return getAnswers("usage").includes("nature");
    },
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "Day-to-day, how much time do you foresee spending in your culinary landscape?",
    name: "time",
    type: "radio",
    items: [
      {label: "5-10 minutes most days. I can commit to regular quick check-ins", value: "frequent"},
      {label: "All day e’rry day! I want to see as much interesting wildlife and plant features as possible", value: "alot"},
      {label: "Depends on how badass my culinary landscape is!", value: "dunno"},
      {label: "I don’t really have free time and need a ultra-low maintenance landscape", value: "none"}
    ],
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "If you had expert advice (e.g. plant care and recipe tips) easily available on your smartphone, would you be more confident when caring for and utilizing your culinary landscape?",
    name: "app",
    type: "radio",
    items: [
      {label: "Yes! Sounds sweet", value: "yes"},
      {label: "No thanks, I’m more of the ‘figure it out myself’ type", value: "nah"},
      {label: "Leave technology out of this!", value: "no"}
    ],
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "How long do you anticipate living in your current location? Fruit trees are awesome but they can take a while to really get going",
    name: "duration",
    type: "radio",
    items: [
      {label: "Probly just a year or so", value: "short"},
      {label: "At least another 2-3 years", value: "medium"},
      {label: "Until the next ice age", value: "long"}
    ],
    options: {
      required: "any"
    }
  }),
  new Question({
    title: "Please take a few seconds to list a few of your all-time favorite herbs and veggies that you’d definitely like to have in your landscape",
    name: "custom plants",
    type: "textarea"
  }),
  new Question({
    title: "One final thing...",
    name: "email",
    type: "text",
    items: [
      {label: "Email address?"}
    ],
    options: {
      required: "any"
    }
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
  json.name = this.name;
  json.answers = this.getDisplayValues();
  json.otherValue = this.other ? this.otherValue : null;

  if(this.enabled && typeof(this.enabled) == "function" && !this.enabled()){
    json.na = true;
  }

  return json;
}

surveyApp.controller('SurveyController', function($scope, $http, $location){
  $scope.title = "Nightshade";
  $scope.subtitle = "Culinary Landscapes";

  $scope.intro = true;
  $scope.introHeader = "Heyo!";
  $scope.introText = "We appreciate your genuine interest in our mission to transform the DC landscape and homecook scene. This quick survey will let us learn a bit more about your interests in culinary landscapes so we can better work with you to design and build your dream kitchen-garden.";

  $scope.start = function(){
    $scope.intro = false;
  }

  $scope.farewell = "Thanks for taking the time to telling us more about you and your culinary interests!";
  $scope.farewellSubhead = "We’ll shoot you an e-mail within the next few days to schedule a quick phone call.";
  $scope.url = "http://www.nightshadedc.com";

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
      $scope.complete = true;
    }).error(function(err){
      console.log(err);
      alert('Error saving game');
    });
  }

  $scope.complete = false;

  var answerStack = [];
});
