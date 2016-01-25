angular.module('PostModule')
.directive('ngElementReady', [function() {
  return {
    priority: -1000, // execute last, after all other directives if any.
    restrict: "A",
    link: function($scope, $element, $attributes) {
        $scope.$eval($attributes.ngElementReady); // execute the expression in the attribute.
    }
  };
}]);