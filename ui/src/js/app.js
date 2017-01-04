;(function (angular) {
  "use strict";

  angular.module("bootstrap", ["ui.router", "auth", "login",
                               "dashboard", "sidebar", "companynetworks", 
                               "procedurepricing", "procedurepriceview", "datatables",
                               "procedurepricingdetail", "providerpricingdetail", "ngCookies"]);

}(window.angular));