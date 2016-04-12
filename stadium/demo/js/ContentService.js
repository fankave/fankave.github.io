angular.module('Stadium')
.factory('ContentService', [
  '$http',
function ($http) {

  var _socialContent;

  function initContent () {
    return $http.get('http://dev.fankave.com/stadium/demo/curry/social/tweets.json');
  }

  function getSocialContent () {
    return _socialContent;
  }

  function setSocialContent (content) {
    _socialContent = content;
  }

  return {
    initContent: initContent,
    getSocialContent: getSocialContent,
    setSocialContent: setSocialContent
  };

}]);
