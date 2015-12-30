socialModule.directive('shareToChatDialog', function () {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      trustSource: '&',
      shareSubmit: '&',
      exitShare: '&'
    },
    templateUrl: '/partials/sharePreview.html'
  };
});