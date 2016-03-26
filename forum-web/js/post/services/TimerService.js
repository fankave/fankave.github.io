angular.module('NetworkModule')
.factory('TimerService',
  ['$routeParams',
  '$window',
  '$timeout',
  '$interval',
  'networkService',
  'AnalyticsService',
  'ChannelService',
  'TopicService',
function ($routeParams, $window, $timeout, $interval, networkService, AnalyticsService, ChannelService, TopicService) {
  var visProp;
  var timer;
  var time = 0;
  var count = 1;
  var minutes = 1;
  var _globalTimerStarted = false;

  var _timeout;
  var _restartSession = false;
  var _lastActiveTab;

  function initTimer() {
    visProp = getPrefix();
    setVisEvent();
    timer = $interval(timeAndReport, 1000);
    _globalTimerStarted = true;
    if (GEN_DEBUG) console.log('TimeOnPage: 1 second');
    if (GOOGLE_ANALYTICS === true){
      ga('send', 'event', 'TimeOnPage', '0', '1 second', { 'nonInteraction': 1 });
    }
  }

  // Get vendor prefix for document hidden state property
  function getPrefix() {
    var prefixes = ['webkit','moz','ms','o'];

    // First check if hidden is natively supported
    if ('hidden' in $window.document) return 'hidden';
    // Then check all known prefixes
    for (var i = 0; i < prefixes.length; i++){
      if ((prefixes[i] + 'Hidden') in $window.document){
        return prefixes[i] + 'Hidden';
      }
    }
    // otherwise not supported
    return null;
  }

  // Determine if window is in background or not
  function isHidden() {
    if (!visProp) return false;
    return $window.document[visProp];
  }

  // Event listener for visibility change event
  function setVisEvent() {
    if (visProp) {
      var visEvent = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
      // add event listener to start/stop TimeOnPage timer
      $window.document.addEventListener(visEvent, function(){
        visChange(startTimer, stopTimer);
      });
    }
  }

  function endSession() {
    if (NETWORK_DEBUG) console.log("Disconnect & End Session");
    AnalyticsService.leaveSessionEvent(ChannelService.getChannel() || TopicService.getChannelId(), $routeParams.topicID, _lastActiveTab);
    if (TopicService.currentTimer(null, true)){
      $timeout.cancel(TopicService.currentTimer(false, true));
    }
    if (TopicService.currentTimer()){
      $interval.cancel(TopicService.currentTimer(false));
    }
    networkService.closeSocket();
    _timeout = undefined;
    _restartSession = true;
  }

  function restartSession() {
    if (NETWORK_DEBUG) console.log("Reconnect & Start New Session");
    $window.location.reload();
  }

  // Helper function to run on visibility change; takes two callbacks
    // ** Register a new visibility-state-dependent event listener via:
    // window.document.addEventListener(event, visChange(vis, hid))
  function visChange(visCallback, hidCallback) {
    if (isHidden()) {
      if (GEN_DEBUG) console.log('hidden callback fired');
      hidCallback();
      _timeout = $timeout(endSession, 120000);
    } else {
      if (GEN_DEBUG) console.log('visible callback fired');
      visCallback();
      if (_timeout){
        $timeout.cancel(_timeout);
      }
      if (_restartSession){
        restartSession();
      }
    }
  }

  function startTimer() {
    if (GEN_DEBUG) console.log('Starting Timer at: ' + time + 'seconds');
    if (time <= 1800){
      timer = $interval(timeAndReport, 1000);
    }
  }
  function stopTimer() {
    if (GEN_DEBUG) console.log('Stopping Timer at: ' + time + 'seconds');
    $interval.cancel(timer);
  }

  // Send analytics to google at appropriate intervals
  function timeAndReport() {
    time += 1;

    if (time > 1800){
      $interval.cancel(timer);
      return;
    }
    if (time === 10 || time === 30 || time === 60){
      if (GEN_DEBUG) console.log('TimeOnPage: ' + time + ' seconds | Count: ' + count);
    if(GOOGLE_ANALYTICS === true){
      ga('send', 'event', 'TimeOnPage', count.toString(), (time + ' seconds'), { 'nonInteraction': 1 });
    }
      count++;
    } 
    if (time > 60 && time % 60 === 0){
      minutes++;
      if (minutes <= 5 || minutes === 10 || minutes === 20 || minutes === 30){
        if (GEN_DEBUG) console.log('TimeOnPage: ' + minutes + ' mins | Count: ' + count);
      if(GOOGLE_ANALYTICS === true){
        ga('send', 'event', 'TimeOnPage', count.toString(), (minutes + ' mins'), { 'nonInteraction': 1 });
      }
        count++;
      }
    }
  }

  return {
    initTimer: initTimer,
    endSession: endSession,
    globalTime: function() {
      return time;
    },
    globalTimerStarted: function() {
      return _globalTimerStarted;
    },
    sessionReset: function() {
      return _restartSession;
    },
    setLastActiveTab: function (tab) {
      _lastActiveTab = tab;
    }
  };

}]);
