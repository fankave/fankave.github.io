angular.module('player.social')
.directive('expandedTweet', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    link: function (scope, elem, attrs) {

      scope.authorName = 'French Montana';
      scope.authorAlias = '@FrencHMonTanA';
      scope.authorPhoto = 'https://pbs.twimg.com/profile_images/541443539805421568/IN34whoL_200x200.jpeg';

      scope.tweetType = 'text';
      scope.tweetHtml = $sce.trustAsHtml("I love what Ayesha curry had to say, but we just got to Miami I ain"+"'"+"t tryin to hear about nothing being covered up lol");
      scope.retweetCount = '541';
      scope.likeCount = '501';
      scope.createdAt = '12/6/15, 12:37 PM';

    },
    templateUrl: 'templates/expanded-tweet.html'
  };
}]);