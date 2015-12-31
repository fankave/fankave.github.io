socialModule.directive('shareToChatDialog', function () {
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
    templateUrl: '/partials/sharePreview.html'
  };
});