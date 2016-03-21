angular.module('SocialModule')
.directive('shareToChatDialog', ['URIHelper',
  function (URIHelper) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      trustSource: '&',
      shareSubmit: '&',
      exitShare: '&',
      highlight: '&',
      unhighlight: '&'
    },
    link: function (scope, elem, attr) {
      if (URIHelper.embedded()){
        scope.embed = true;
      }
    },
    templateUrl: 'partials/sharePreview.html'
  };
}]);