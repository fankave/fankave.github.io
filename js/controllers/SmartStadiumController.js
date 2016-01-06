var smartSModule = angular.module("SmartStadiumModule", []);
smartSModule.controller("SmartStadiumController", ["$scope", function ($scope){
  
  var _this = this;
  this.viewScreen = false;
  this.ssActiveScreen;

  this.viewHighlights = function() {
    _this.ssActiveScreen = 'highlights';
    _this.viewScreen = true;
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_highlights@3x.png)');
  };

  this.viewRoster = function() {
    _this.ssActiveScreen = 'roster';
    _this.viewScreen = true;
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_roster@3x.png)');
  };

  this.viewStats = function() {
    _this.ssActiveScreen = 'stats';
    _this.viewScreen = true;
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_stats@3x.png)');
  };

  this.viewProfileStats = function() {
    _this.ssActiveScreen = 'profileStats';
    _this.viewScreen = true;
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_profile_stats@3x.png)');
  };

  this.exitView = function() {
    _this.viewScreen = false;
  };

}]);