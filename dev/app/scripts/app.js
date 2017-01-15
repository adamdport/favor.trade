'use strict';

/**
 * @ngdoc overview
 * @name devApp
 * @description
 * # devApp
 *
 * Main module of the application.
 */
var devApp = angular.module('devApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'parse-angular', 'xeditable', 'angular-confirm', 'ui.router.tabs', 'ngAnimate', 'angularMoment', 'infinite-scroll', 'angulartics', 'angulartics.google.analytics', 'ui.router.title']);

devApp.config(['$stateProvider', '$urlRouterProvider', '$animateProvider', '$uibTooltipProvider',
  function ($stateProvider, $urlRouterProvider, $animateProvider, $uibTooltipProvider) {

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states

  function title(t, noDash){
    if (noDash){
      return t;
    }else{
      return t + ' - Favor.trade';
    }
  }

  $stateProvider
    .state('error', {
      templateUrl: 'views/error.html',
      controller: 'ErrorCtrl',
      data: {
        loginRequired: false
      },
      params: {error: ""}
    })
    .state('help', {
      url: "/help",
      templateUrl: 'views/help.html',
      data: {
        loginRequired: false
      },
      resolve: {
        $title: function(){
          return title('Help');
        }
      }
    })
    .state('terms', {
      url: "/terms",
      templateUrl: 'views/terms.html',
      data: {
        loginRequired: false
      },
      resolve: {
        $title: function(){
          return title('Terms');
        }
      }
    })
    .state('landing', {
      url: "/",
      templateUrl: 'views/landing.html',
      controller: 'LandingCtrl',
      data: {
        loginRequired: false
      },
      resolve: {
        $title: function(){
          return title('Favor.trade - Meet people, doing what you love', true);
        }
      }
    })
    .state('home', {
      url: "/home",
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      data: {
        loginRequired: false
      },
      resolve: {
        user: function(userRepo){
          return userRepo.getMappedUser();
        },
        $title: function(){
          return title('Home');
        }
      }
    })
    .state('welcome', {
      url: "/welcome",
      templateUrl: 'views/welcome.html',
      controller: 'WelcomeCtrl',
      data: {
        loginRequired: true,
        isOnboarding: true
      },
      resolve: {
        favors: function(favorRepo){
          return favorRepo.getMyFavors();
        },
        user: function(userRepo){
          return userRepo.getMappedUser();
        },
        userWithLocation: function(user, location){
          return location.fromParseLocation(user.obj.get("location")).then(function(l){
            user.location = l;
            return user;
          });
        },
        $title: function(){
          return title('Welcome');
        }
      }
    })
    .state('me', {
      url: "/me",
      templateUrl: 'views/me.html',
      controller: 'MeCtrl',
      data: {
        loginRequired: true
      },
      abstract: true,
      resolve: {
        tabData: function(){
          return [{
              heading: 'My Favors',
              route: 'me.favors'
            }, {
              heading: 'My Profile',
              route: 'me.profile'
            }, {
              heading: 'My Settings',
              route: 'me.settings'
            }
          ];
        },
        user: function(userRepo){
          return userRepo.getMappedUser();
        }
      }
    })
    .state('me.favors', {
      url: "/favors",
      controller: 'FavorsCtrl',
      templateUrl: 'views/me/favors.html',
      resolve: {
        favors: function(favorRepo){
          return favorRepo.getMyFavors();
        },
        $title: function(){
          return title('My Favors');
        }
      }
    })
    .state('me.profile', {
      url: "/profile",
      controller: 'ProfileCtrl',
      templateUrl: 'views/me/profile.html',
      resolve: {
        userWithLocation: function(user, auth, location){
          return location.fromParseLocation(auth.getUser().get("location")).then(function(l){
            user.location = l;
            return user;
          });
        },
        $title: function(){
          return title('My Profile');
        }
      }
    })
    .state('me.settings', {
      url: "/settings",
      controller: 'SettingsCtrl',
      templateUrl: 'views/me/settings.html',
      resolve: {
        $title: function(){
          return title('My Settings');
        }
      }
    })
    .state('messages', {
      url: "/messages",
      templateUrl: 'views/messages.html',
      controller: function($scope, users, user, $state){
        $scope.users = Object.create(users);
        $scope.me = user;
        $scope.$state = $state;
      },
      data: {
        loginRequired: true
      },
      resolve: {
        user: function(userRepo){
          return userRepo.getMappedUser();
        },
        messages: function(messageRepo){
          return messageRepo.getMessages();
        },
        users: function(messages, _){
          var usersWithUnread = [];
          var users = _.chain(messages).map(function(m) {
            if(!m.read){
              usersWithUnread.push(m.sender.id);
            }
            return [ m.sender, m.receiver ];
          }).flatten().uniq("id").value();

          usersWithUnread = _.uniq(usersWithUnread);
          users.forEach(function(user, i){
            if (_.includes(usersWithUnread,user.id)){
              users[i].unread = true;
            }else{
              users[i].unread = false;
            }
          });
          return users;
        },
        $title: function(){
          return title('Messages');
        }
      }
    }).state('messages.withUser', {
      url: "/{userId}",
      controller: 'MessagesCtrl',
      templateUrl: 'views/messages/messagelist.html',
      params: {
        subject: ""
      },
      resolve: {
        them: function($stateParams){
          return $stateParams.userId;
        },
        users: function(users, _, them, userRepo){
          if(!_(users).pluck('id').includes(them)){
            return userRepo.getPublicUser(them).then(function(user){
              users.push(user);
              return users;
            });
          }else{
            return users;
          }
        },
        $title: function(users, them, _){
          var user = _.find(users, { 'id': them});
          return title("Messages (" + user.first_name + " " + user.last_name + ")");
        }
      }
    })
    .state('people', {
      url: "/people",
      abstract: true,
      data: {
        loginRequired: true
      }
    })
    .state('people.withUser', {
      url: "/{userId}",
      views: {
        '@': { templateUrl: 'views/people.html',controller: 'PeopleCtrl' }
      },
      resolve: {
        user: function($stateParams, userRepo){
          return userRepo.getPublicUser($stateParams.userId);
        },
        references: function(referenceRepo, $stateParams){
          return referenceRepo.getReferences($stateParams.userId);
        },
        me: function(userRepo){
          return userRepo.getMappedUser();
        },
        alreadyLeftReference: function(references, me, _){
          return _.chain(references).map(function(reference){
            return reference.writtenBy.id;
          }).includes(me.id)
          .value();
        },
        favors: function(favorRepo, user){
          return favorRepo.getFavorsByUser(user.id);
        },
        $title: function(user){
          return title(user.first_name + " " + user.last_name);
        }
      }
    });

    //gets rid of bug that makes fontawesome spinners linger after they're supposed to hide
    $animateProvider.classNameFilter(/^((?!(fa-spinner)).)*$/);

    //allows tooltips to have a width greater than the element being hovered
    $uibTooltipProvider.options({ appendToBody: true });

}]).run(function(Parse, $rootScope, $state, auth, editableOptions, editableThemes, onboarding) {
  //dev
  //Parse.initialize("iQ5jTnBFl7XhhGz1gHyI93tZmyOildZMXVyvMbDx", "m9P1ZJX1Nb8A2aExYflruLnpQHgj8zbdsvJDI6xn");
  //prod
  Parse.initialize("rN3NaKcc8mBTfoFcZBEYp8SvetqhJr7P9J0Nwf4H", "nJkkd8TcfcJH3sVwQt8diH4piQFrgHhGAATZBKGY");

  editableOptions.theme = 'bs3';
  editableThemes.bs3.formTpl = '<form class="editable-wrap" role="form" ng-class="xformClass"></form>';
  editableThemes.bs3.controlsTpl = '<div class="editable-controls form-group row" ng-class="{\'has-error\': $error}"></div>';

  $rootScope.$on('$stateChangeStart', function(event, toState){
    //console.log("switching to state " + toState.name);
    if (!toState.resolve) {
      toState.resolve = {};
    }

    if(toState.data.loginRequired){ //requires that user be resolved
      toState.resolve.loginRequired = ['user', '$q', function(user, $q){
        if(!user){
          return $q.reject("You must be logged in to view this page.");
        }
      }];
    }

    if (toState.resolve.user){ //if the state users a logged in user
      toState.resolve.onboardingCheck = ['user', function(user){
        if(user && !toState.data.isOnboarding){ //if the user is logged in
          return onboarding.checkIfComplete();
        }else{
          return false;
        }
      }];
    }
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
    event.preventDefault();  // this is required if you want to prevent the $UrlRouter reverting the URL to the previous valid location
    if (error === 'onboarding'){
      $state.go('welcome');
    }else{
      $state.go('error',{error: error},{location: false});
    }
  });
})
.constant('_', window._)
.constant('Parse', window.Parse)
.constant('ga', window.ga);
