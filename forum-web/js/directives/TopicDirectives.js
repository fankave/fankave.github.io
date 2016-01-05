topicModule.directive('repeatFinishedNotify', function () {
  return function (scope, element, attrs) {
    if (scope.$last){
      // scope.scrollToBookmark();
      console.log("DONE LOADING COMMENTS");
      scope.hideLoading();
      scope.setLinksOnComments();
      scope.setDocVars();
    }
  };
});

topicModule.directive('embedSharedContent', function() {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=embedPost',
      imageZoom: '&',
      trustSource: '&',
      preventNav: '&'      
    },
    templateUrl: '/partials/shared.html'
  };
});

