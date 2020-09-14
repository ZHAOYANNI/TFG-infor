var app = angular.module('main', ["ngRoute", "chart.js"]);
var username="";

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "home.html",
    })
    .when("/login", {
      templateUrl : "./components/login.html",
    })
    .when("/signUp", {
      templateUrl : "./components/signUp.html",
    })
    .when("/user", {
      templateUrl: "components/userHome.html",
    })
});

  app.controller('homeCtrl', function($scope, $location) {
    $scope.goToLogin = function() {
      $location.path("/login");
    };
    $scope.register = function() {
      $location.path("/signUp");
    }
});
