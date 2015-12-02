var splashModule = angular.module("SplashModule", []);

splashModule.factory("SplashService", function(){
  var hidePeelSplash = true;
  return {
    hidePeelSplash: hidePeelSplash
  }
});