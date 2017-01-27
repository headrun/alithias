;(function (angular) {
  "use strict";

  angular.module("dashboard", ["ui.router", "auth", "header", "sidebar", "datatables",
  					"companynetworks", "proceduremaintenance", "procedurepriceview", 
  					"procedurepricingdetail", "providerpricingdetail", "procedurecodesummary",
  					"ppepisodedetails", "costcompsummary", "episoderevenuecode",
  					"providermaintenance"]);

}(window.angular));
