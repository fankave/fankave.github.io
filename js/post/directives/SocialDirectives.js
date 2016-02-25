angular.module('SocialModule')
.directive('shareToChatDialog', function () {
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
      var $el = elem[0];
    },
    templateUrl: 'partials/sharePreview.html'
  };
});