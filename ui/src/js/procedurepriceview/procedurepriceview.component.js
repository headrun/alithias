;(function (angular) {
  "use strict";

  	angular.module("procedurepriceview")
        .component("procedurepriceview", {

           	"templateUrl": "/js/procedurepriceview/procedurepriceview.html",
           	"controller" : [ "$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder) {
                   var that = this;
                   var vm = this;

                   this.collapsed = true;
                   that.TableData = [];
                   vm.authorized = false;

                   this.toggleCollapse = function () {
                   
                     this.collapsed = !this.collapsed;
                   }

                 $http({method: "GET", url: "http://localhost:1122/api/proc_pricing_dropdowns/"})
                    .then(function(response){
                        that.states = response.data[0]['states'];
                        that.networks = response.data[0]['table_Networks'];
                        that.procedures = response.data[0]['table_Procedures'];
                    });

                 $scope.submit = function(param){
                    that.networkId = param.networkName ? param.networkName : '';
                    that.procedureID = param.procedureName ? param.procedureName : '';
                    that.stateID = param.stateName ? param.stateName : '';
                    that.requirements = param.requirements ? true : false;

                    vm.authorized = true;
                    that.apiUrl = 'http://localhost:1122/api/procedure_pricing/?ProcedureID='+that.procedureID+'&NetworkID='+that.networkId+'&EnforceRequirements='+that.requirements+'&state='+that.stateID
                    vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: that.apiUrl,
                              type: 'GET'
                           })
                       .withOption('processing', true)
                       .withOption('serverSide', false)
                       .withPaginationType('full_numbers');

                      vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_1').withTitle('Facility'),
                          DTColumnBuilder.newColumn('col_2').withTitle('City'),
                          DTColumnBuilder.newColumn('col_3').withTitle('ID2'),
                          DTColumnBuilder.newColumn('col_4').withTitle('Facility Type'),
                          DTColumnBuilder.newColumn('col_5').withTitle('NPI'),
                          DTColumnBuilder.newColumn('col_6').withTitle('ID5'),
                          DTColumnBuilder.newColumn('col_7').withTitle('ID6'),
                          DTColumnBuilder.newColumn('col_8').withTitle('ID7'),
                          DTColumnBuilder.newColumn('col_9').withTitle('ID8'),
                          DTColumnBuilder.newColumn('col_10').withTitle('ID9'),
                          DTColumnBuilder.newColumn('col_11').withTitle('ID10'),
                          DTColumnBuilder.newColumn('col_12').withTitle('ID11'),
                          DTColumnBuilder.newColumn('col_13').withTitle('ID12'),
                          DTColumnBuilder.newColumn('col_14').withTitle('ID13'),
                          DTColumnBuilder.newColumn('col_15').withTitle('ID14'),
                          DTColumnBuilder.newColumn('col_16').withTitle('ID15'),
                          DTColumnBuilder.newColumn('col_17').withTitle('ID16'),
                          DTColumnBuilder.newColumn('col_18').withTitle('ID17'),
                          DTColumnBuilder.newColumn('col_19').withTitle('ID18'),
                          DTColumnBuilder.newColumn('col_20').withTitle('ID19'),
                          DTColumnBuilder.newColumn('col_21').withTitle('ID20'),
                          DTColumnBuilder.newColumn('col_22').withTitle('ID21'),
                          DTColumnBuilder.newColumn('col_23').withTitle('ID22'),
                          DTColumnBuilder.newColumn('col_24').withTitle('ID23'),
                          DTColumnBuilder.newColumn('col_25').withTitle('ID24'),
                          DTColumnBuilder.newColumn('col_26').withTitle('ID25'),
                          DTColumnBuilder.newColumn('col_27').withTitle('ID26'),
                          DTColumnBuilder.newColumn('col_28').withTitle('Network'),
                          DTColumnBuilder.newColumn('col_29').withTitle('ID28'),
                      ];
                 }
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