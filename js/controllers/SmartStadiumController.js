var smartSModule = angular.module("SmartStadiumModule", []);
smartSModule.controller("SmartStadiumController", ["$scope", function ($scope){
  
  var _this = this;
  this.viewScreen = false;
  this.ssActiveScreen;

  this.viewHighlights = function() {
    _this.ssActiveScreen = 'highlights';
    _this.viewScreen = true;
  };

  this.viewRoster = function() {
    _this.ssActiveScreen = 'roster';
    _this.viewScreen = true;
  };

  this.viewStats = function() {
    _this.ssActiveScreen = 'stats';
    _this.viewScreen = true;
  };

  this.viewProfileStats = function() {
    _this.ssActiveScreen = 'profileStats';
    _this.viewScreen = true;
  };

  this.exitView = function() {
    _this.viewScreen = false;
  };

}]);