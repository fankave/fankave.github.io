var smartSModule = angular.module("SmartStadiumModule", []);
smartSModule.controller("SmartStadiumController", ["$scope", function ($scope){
  
  var _this = this;
  this.viewScreen = false;
  this.ssActiveScreen;

  this.viewHighlights = function() {
    _this.ssActiveScreen = 'highlights';
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_highlights@3x.png)');
    _this.viewScreen = true;
  };

  this.viewRoster = function() {
    _this.ssActiveScreen = 'roster';
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_roster@3x.png)');
    _this.viewScreen = true;
  };

  this.viewStats = function() {
    _this.ssActiveScreen = 'stats';
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_stats@3x.png)');
    _this.viewScreen = true;
  };

  this.viewProfileStats = function() {
    _this.ssActiveScreen = 'profileStats';
    $('#ssStaticContainer').css('background-image','url(img/SS/ss_profile_stats@3x.png)');
    _this.viewScreen = true;
  };

  this.exitView = function() {
    _this.viewScreen = false;
  };

}]);