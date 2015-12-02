var splashModule = angular.module("SplashModule", []);

splashModule.factory("SplashService", function(){
  var hidePeelSplash = false;
  return {
    hidePeelSplash: hidePeelSplash
  }
});