angular.module('TopicModule')
.directive('secureClick', ['$location','$window','UserInfoService',
  function ($location, $window, UserInfoService) {
    return {
      restrict: 'A',
      link: function($scope, $elem, $attrs){
        var element = $elem[0];
        $(element).on('click', function(e){
          e.preventDefault();
          if (UserInfoService.isGuestUser()){
            $location.url("/login");
            $scope.$apply();
          } else {
            $scope.$eval($attrs.secureClick);
          }
        });
      }
    }
}]);

angular.module('TopicModule')
.directive('secureFocus', ['$location','$window','UserInfoService',
  function ($location, $window, UserInfoService) {
    return {
      restrict: 'A',
      link: function($scope, $elem, $attrs){
        var element = $elem[0];
        $(element).on('focus', function(e){
          e.preventDefault();
          if (UserInfoService.isGuestUser()){
            $location.url("/login");
            $scope.$apply();
          } else {
            $scope.$eval($attrs.secureFocus);
          }
        });
      }
    }
}]);

angular.module('TopicModule')
.directive('repeatFinishedNotify', function () {
  return function (scope, element, attrs) {
    if (scope.$last){
      scope.hideLoading();
      scope.setDocVars();
      scope.continueToExperience('smartS');
    }
  };
});

angular.module('TopicModule')
.directive('embedSharedContent', ['UserAgentService',
  function (UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=embedPost',
      trustSource: '&',
      preventNav: '&'      
    },
    link: function(scope,elem,attr){
      scope.mobileUserAgent = UserAgentService.getMobileUserAgent();
    },
    templateUrl: 'partials/shared.html'
  };
}]);
