angular.module('Stadium', [
  'ui.router',
  'player.social',
  'player.stats'
])

.config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
  
  $stateProvider

  .state('pstats', {
    url: '/player-stats',
    templateUrl: 'templates/player-stats.html',
    controller: 'ctrl.player-stats',
    controllerAs: 'pstat'
  })

  .state('psocial', {
    url: '/player-social',
    templateUrl: 'templates/player-social.html',
    controller: 'ctrl.player-social',
    controllerAs: 'psocial'
  });

  $urlRouterProvider.otherwise('/player-social');

}])

.run(['$state', '$rootScope',
function ($state, $rootScope) {
  $rootScope.$state = $state;
}]);
