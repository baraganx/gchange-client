// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('gchange', ['ionic', 'ionic-material', 'ngMessages', 'pascalprecht.translate',
  'ngApi', 'angular-cache', 'angular.screenmatch', 'angular.bind.notifier', 'angular-fullscreen-toggle',
  'ImageCropper', 'ngFileSaver', 'ngIdle',
  // removeIf(no-device)
  'ngCordova',
  // endRemoveIf(no-device)
  'cesium.plugins',
  'cesium.filters', 'cesium.config', 'cesium.platform', 'cesium.controllers', 'cesium.templates', 'cesium.translations', 'cesium.components', 'cesium.directives'
  ])

  // Override the automatic sync between location URL and state
  // (see watch event $locationChangeSuccess in the run() function bellow)
  .config(function ($urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.deferIntercept();
  })

  .run(function($rootScope, $translate, $state, $window, ionicReady, $urlRouter, Device, UIUtils, $ionicConfig, PluginService,
                csPlatform) {
    'ngInject';

    // Must be done before any other $stateChangeStart listeners
    csPlatform.disableChangeState();

    var preventStateChange = false; // usefull to avoid duplicate login, when a first page with auth
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
      if (event.defaultPrevented) return;

      var skip = !next.data || $rootScope.tour || event.currentScope.tour; // disabled for help tour
      if (skip) return;

      if (preventStateChange) {
        event.preventDefault();
        return;
      }

      // removeIf(android)
      // removeIf(ios)
      // -- Automatic redirection to large state (if define) (keep this code for platforms web and ubuntu build)
      if (next.data.large && !UIUtils.screen.isSmall()) {
        event.preventDefault();
        $state.go(next.data.large, nextParams);
        return;
      }
      // endRemoveIf(ios)
      // endRemoveIf(android)

    });

    // Prevent $urlRouter's default handler from firing (don't sync ui router)
    $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
      if ($state.current.data && $state.current.data.silentLocationChange === true) {
        // Skipping propagation, because same URL, and state configured with 'silentLocationChange' options
        var sameUrl = oldUrl && (oldUrl.split('?')[0] === newUrl.split('?')[0]);
        if (sameUrl) event.preventDefault();
      }
    });

    // Configures $urlRouter's listener *after* the previous listener
    $urlRouter.listen();

    // Start plugins eager services
    PluginService.start();
    
    ionicReady().then(function() {
      if (ionic.Platform.isIOS()) {
        if(window.StatusBar) {
          // fix font color not white on iOS 11+
          StatusBar.styleLightContent();
        }
      }
    });
  })
;

window.ionic.Platform.ready(function() {
  angular.bootstrap(document, ['gchange']);
});
