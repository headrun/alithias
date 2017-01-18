;(function (angular) {
  "use strict";

  angular.module("bootstrap", ["ui.router", "auth", "login",
                               "dashboard", "sidebar", "companynetworks", 
                               "procedurepricing", "procedurepriceview", "datatables",
                               "procedurepricingdetail", "providerpricingdetail", "ngCookies",
                               "procedurecodesummary", "ppepisodedetails"]);

}(window.angular));