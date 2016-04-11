angular.module('Stadium')
.factory('ContentService', [
  '$http',
function ($http) {

  var _socialContent;
  var _socialStats;
  var _playerStats;
  var _teamStats;

  function initContent () {
    return $http.get('http://dev.fankave.com/stadium/demo/curry/social/tweets.json');
    // .then(function (response) {
    //   _socialContent = response.data;
    // });
  }

  function getSocialContent () {
    return _socialContent;
  }

  function setSocialContent (content) {
    _socialContent = content;
  }

  function getSocialStats () {
    return _socialStats;
  }

  function getPlayerStats () {
    return _playerStats;
  }

  function getTeamStats () {
    return _teamStats;
  }

  return {
    initContent: initContent,
    setSocialContent: setSocialContent,
    getSocialContent: getSocialContent,
    getSocialStats: getSocialStats,
    getPlayerStats: getPlayerStats,
    getTeamStats: getTeamStats
  };

}]);
