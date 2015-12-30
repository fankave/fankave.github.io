socialModule.directive('shareToChatDialog', function () {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      trustSource: '&',
      shareSubmit: '&'
    },
    templateUrl: '/partials/sharePreview.html'
  };
});