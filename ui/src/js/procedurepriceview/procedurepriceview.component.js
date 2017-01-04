;(function (angular) {
  "use strict";

  	angular.module("procedurepriceview")
        .component("procedurepriceview", {

           	"templateUrl": "/js/procedurepriceview/procedurepriceview.html",
           	"controller" : [ "$http", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",

              function ($http, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder) {
                   var that = this;
                   var vm = this;

                   this.collapsed = true;
                   that.TableData = [];

                   this.toggleCollapse = function () {
                   
                     this.collapsed = !this.collapsed;
                   }

                 vm.dtOptions = DTOptionsBuilder.newOptions()
                   .withOption('ajax', {
                          url: 'data.json',
                          type: 'GET'
                       })
                   .withOption('processing', true)
                   .withOption('serverSide', false)
                   .withPaginationType('full_numbers');

                  vm.dtColumns = [
                      DTColumnBuilder.newColumn('id').withTitle('ID'),
                      DTColumnBuilder.newColumn('firstName').withTitle('First name'),
                      DTColumnBuilder.newColumn('lastName').withTitle('Last name')
                  ];
              }
            ]
        });

}(window.angular));



/*vm.dtOptions = DTOptionsBuilder.newOptions().withSource('http://176.9.181.36:2222/clinicalapi/clinicaltrail/')
                      .withPaginationType('full_numbers');

                  vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajaxSource', 'http://176.9.181.36:2222/clinicalapi/clinicaltrail/')
                      .withOption('serverSide', true)
                      .withOption('pagingType', 'full_numbers');*/