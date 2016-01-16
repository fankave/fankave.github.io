angular.module("SplashModule", [])
.factory("SplashService", function(){
  var _hidePeelSplash = true;
  var _hideSSSplash = true;
 
  return {
    hidePeelSplash: function(){
      return _hidePeelSplash;
    },
    hideSSSplash: function(){
      return _hideSSSplash;
    },
    setPeelSplash: function(val){
      _hidePeelSplash = val;
    },
    setSSSplash: function(val){
      _hideSSSplash = val;
    }
  }
});