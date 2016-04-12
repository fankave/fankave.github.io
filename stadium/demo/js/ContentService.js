angular.module('Stadium')
.factory('ContentService', [
  '$http',
function ($http) {

  var _socialContent;

  function initContent () {
    return $http.get('http://dev.fankave.com/stadium/demo/curry/social/tweets.json');
  }

  function getSocialContent (idx) {
    idx = idx || 0;
    return _socialContent[idx];
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
