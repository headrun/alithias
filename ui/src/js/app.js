;(function (angular) {
  "use strict";

  angular.module("bootstrap", ["ui.router", "auth", "login",
                               "dashboard", "sidebar", "companynetworks", 
                               "proceduremaintenance", "procedurepriceview", "datatables",
                               "procedurepricingdetail", "providerpricingdetail", "ngCookies",
                               "procedurecodesummary", "ppepisodedetails", "costcompsummary",
                               "episoderevenuecode"]);

}(window.angular));