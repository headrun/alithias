;(function (angular) {
  "use strict";

  angular.module("dashboard", ["ui.router", "auth", "header", "sidebar", "datatables",
  					"companynetworks", "procedurepricing", "procedurepriceview", 
  					"procedurepricingdetail", "providerpricingdetail"]);

}(window.angular));
