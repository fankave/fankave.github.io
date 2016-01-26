angular.module('PostModule')
.directive('ngElementReady', [function() {
  return {
    priority: -1000,
    restrict: "A",
    link: function($scope, $element, $attributes) {
        $scope.$eval($attributes.ngElementReady); // execute expression from attribute
    }
  };
}]);