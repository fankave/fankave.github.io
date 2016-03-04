angular.module('BannerModule', [])
.controller('BannerController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    $scope.peelChannelBanner = "https://storage.googleapis.com/forumus/channel/" + $routeParams.channelID + "/cover";
}]);