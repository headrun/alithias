;(function (angular) {
  "use strict";

  // Decalare Pages that are available in this component
  var pages = {
                 "companynetworks": {

                   "name"    : "companynetworks",
                   "fullName": "dashboard.companynetworks",
                   "text"    : "company Networks",
                   "state"   : {},
                   "stateStr": "{}"
                 },
                 "procedurepricing": {

                   "name"    : "procedurepricing",
                   "fullName": "dashboard.procedurepricing",
                   "text"    : "procedure Pricing",
                   "state"   : {},
                   "stateStr": "{}"
                 },
                 "procedurepriceview": {

                   "name"    : "procedurepriceview",
                   "fullName": "dashboard.procedurepriceview",
                   "text"    : "procedure Pricing View",
                   "state"   : {},
                   "stateStr": "{}"
                 },
                 "procedurepricingdetail": {

                   "name"    : "procedurepricingdetail",
                   "fullName": "dashboard.procedurepricingdetail",
                   "text"    : "procedure Pricing Details",
                   "state"   : {},
                   "stateStr": "{}"
                 },
                 "providerpricingdetail": {

                   "name"    : "providerpricingdetail",
                   "fullName": "dashboard.providerpricingdetail",
                   "text"    : "Provider Pricing Details",
                   "state"   : {},
                   "stateStr": "{}"
                 },
                 "procedurecodesummary": {

                   "name"    : "procedurecodesummary",
                   "fullName": "dashboard.procedurecodesummary",
                   "text"    : "Procedure Code Summary for Procedure",
                   "state"   : {},
                   "stateStr": "{}"
                 },
                 "ppepisodedetails": {

                   "name"    : "ppepisodedetails",
                   "fullName": "dashboard.ppepisodedetails",
                   "text"    : "Procedure Provider Episode Details",
                   "state"   : {},
                   "stateStr": "{}"
                 },
              };

  // If one uses a menu bar, the order of appearance is here
  var pagesOrder = ["companynetworks", "procedurepricing", "procedurepriceview", 
                  "procedurepricingdetail", "providerpricingdetail", "procedurecodesummary",
                  "ppepisodedetails"];

  angular.module("dashboard")
         .component("dashboard", {

           "templateUrl": "/js/dashboard/dashboard.html",
           "controller" : ["Session", "$state", "$rootScope",

             function (Session, $state, $rootScope) {

               var stateName = $state.current.name.split(".")[1];

               var that = this;

               // Storing user data in scope
               this.user = Session.get();


               // Loading scree will be shown when its true
               this.isLoading = true;

               this.showLoading = function () {

                 this.isLoading = true;
               };

               this.hideLoading = function () {

                 this.isLoading = false;
               };

               this.hideLoading();
               
               this.pages = pages;
               this.pagesOrder = pagesOrder;

               // Update URL without refresh (maintaining state in URL)
               function updateUrl (pageName) {

                 $state.go("dashboard." + pageName,
                           {"state" : that.pages[pageName].stateStr},
                           {"notify": false});
               }

               // The current page that is being displayed
               this.activePage = this.pagesOrder[0];

               this.setActivePage = function (pageName) {

                 this.activePage = pageName;
               };

               // Update the state of the page, and also the URL
               this.updateState = function (pageName, state) {

                 state = state || {};

                 var tab = this.pages[pageName];

                 tab.state = state;
                 tab.stateStr = JSON.stringify(state);

                 this.setActivePage(pageName);
                 updateUrl(pageName);
               };

               // on navigation, update the state of current page
               function onNavigation (event, next, params) {

                 if (next.name !== "dashboard") {

                   that.updateState(next.name.split(".")[1],
                                    JSON.parse(params.state || "{}"));
                 }
               }

               var bindedEvents = [];

               function bindEvents () {

                 bindedEvents.push($rootScope.$on("$stateChangeStart", onNavigation));
               }

               function unbindEvents () {

                 angular.forEach(bindedEvents, function (unbindFunc) {

                   unbindFunc();
                 });
               }

               this.$onInit = bindEvents;

               this.$onDestroy = unbindEvents;

               if (!stateName) {

                 $state.go("dashboard." + this.pagesOrder[0]);
                 return;
               }

               // Update the state of current page when the component is rendered
               this.updateState(stateName,
                                JSON.parse($state.params.state || "{}"));
             }]
         });

         angular.module("dashboard")
                .config(["$locationProvider", "$stateProvider",
                  "$httpProvider", "$urlRouterProvider",

           function ($lp, $sp, $hp, $urp) {

             angular.forEach(pagesOrder, function (page) {

               $sp.state("dashboard." + page, {

                 "url"     : page,
                 "template": "<" + page + "></" + page +">",
                 "authRequired": true
               });
             });

             $urp.otherwise(pagesOrder[0]);
           }
         ]);
}(window.angular));
