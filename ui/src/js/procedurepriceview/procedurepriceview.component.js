;(function (angular) {
  "use strict";

  	angular.module("procedurepriceview")
        .component("procedurepriceview", {

           	"templateUrl": "/js/procedurepriceview/procedurepriceview.html",
           	"controller" : [ "$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder","$compile",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder, $compile) {
                   var that = this;
                   var vm = this;

                   this.collapsed = true;
                   that.TableData = [];
                   vm.authorized = false;

                   this.toggleCollapse = function () {
                   
                     this.collapsed = !this.collapsed;
                   }

                 $http({method: "GET", url: domainName+"api/proc_pricing_dropdowns/"})
                    .then(function(response){
                        that.states = response.data[0]['states'];
                        that.networks = response.data[0]['table_Networks'];
                        that.procedures = response.data[0]['table_Procedures'];
                    });

                 this.subLinkFun = function(FacilityNPI){
                    var url = domainName+'api/procedure_pricing_breakdown/?ProcedureID='+that.procedureID+'&NetworkID='+that.networkId+'&FacilityNPI='+FacilityNPI;
                    $rootScope.pro_pric_det_form_det = { 'ProcedureID': that.procedureID,
                                                      'FacilityNPI': FacilityNPI,
                                                      'NetworkID': that.networkId,
                                                      'url': url
                                                    };
                    window.location.href = '/#!/procedurepricingdetail';
                    //window.open('/#!/procedurepricingdetail', '_blank');
                 }

                 this.subLinkEpi = function(FacilityNPI){
                    var url = domainName+'api/procedure_pricing_episode/?ProcedureID='+that.procedureID+'&NetworkID='+that.networkId+'&FacilityNPI='+FacilityNPI;
                    $rootScope.pp_epi_form_det = { 'ProcedureID': that.procedureID,
                                                      'FacilityNPI': FacilityNPI,
                                                      'NetworkID': that.networkId,
                                                      'url': url
                                                    };
                    window.location.href = '/#!/ppepisodedetails';
                 }

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.networkId = param.networkName ? param.networkName : '';
                    that.procedureID = param.procedureName ? param.procedureName : '';
                    that.stateID = param.stateName ? param.stateName : '';
                    that.requirements = param.requirements ? true : false;

                    that.apiUrl = domainName+'api/procedure_pricing/?ProcedureID='+that.procedureID+'&NetworkID='+that.networkId+'&EnforceRequirements='+that.requirements+'&state='+that.stateID;
                    $http({method: "GET", url: that.apiUrl})
                    .then(function(response){
                        if (response.data.length > 0) {
                          vm.authorized = true;
                          $('#loadingDiv').hide();
                          that.data = response.data;
                          $('#notFound').hide();
                        }else{
                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }
                        
                    });
                        /*vm.dtOptions = DTOptionsBuilder.newOptions()
                           .withOption('ajax', {
                                  url: that.apiUrl,
                                  type: 'GET'
                               })
                           .withOption('processing', true)
                           .withOption('serverSide', false)
                           .withOption('createdRow', function(row) {
                              // Recompiling so we can bind Angular directive to the DT
                              $compile(angular.element(row).contents())($scope);
                           })
                           .withPaginationType('full_numbers');

                          vm.dtColumns = [
                              DTColumnBuilder.newColumn('col_5').withTitle('NPI'),
                              DTColumnBuilder.newColumn('col_1').withTitle('Facility'),
                              DTColumnBuilder.newColumn('col_2').withTitle('City'),
                              DTColumnBuilder.newColumn('col_4').withTitle('Facility Type'),
                              DTColumnBuilder.newColumn('col_30').withTitle('Breakdown').renderWith(function(col_30, col_5) {
                                return '<p style="cursor: pointer; color: blue" ng-click="$ctrl.subLinkFun('+that.procedureID+','+that.networkId+','+col_5+')">'+col_30+'</p>'
                              }),
                              DTColumnBuilder.newColumn('col_31').withTitle('Episode').renderWith(function(col_31, col_5) {
                                return '<p style="cursor: pointer; color: blue" ng-click="$ctrl.subLinkFun('+that.procedureID+','+that.networkId+','+col_5+')">'+col_31+'</p>'
                              }),
                              DTColumnBuilder.newColumn('col_24').withTitle('Min Total'),
                              DTColumnBuilder.newColumn('col_25').withTitle('Likely Total'),
                              DTColumnBuilder.newColumn('col_26').withTitle('Max Total'),
                              DTColumnBuilder.newColumn('col_6').withTitle('Min Facility'),
                              DTColumnBuilder.newColumn('col_7').withTitle('Likely Facility'),
                              DTColumnBuilder.newColumn('col_8').withTitle('Max Facility'),
                              DTColumnBuilder.newColumn('col_9').withTitle('Min Physician'),
                              DTColumnBuilder.newColumn('col_10').withTitle('Likely Physician'),
                              DTColumnBuilder.newColumn('col_11').withTitle('Max Physician'),
                              DTColumnBuilder.newColumn('col_12').withTitle('Min Anesthesia'),
                              DTColumnBuilder.newColumn('col_13').withTitle('Likely Anesthesia'),
                              DTColumnBuilder.newColumn('col_14').withTitle('Max Anesthesia'),
                              DTColumnBuilder.newColumn('col_15').withTitle('Min Radiology'),
                              DTColumnBuilder.newColumn('col_16').withTitle('Likely Radiology'),
                              DTColumnBuilder.newColumn('col_17').withTitle('Max Radiology'),
                              DTColumnBuilder.newColumn('col_18').withTitle('Min Lab'),
                              DTColumnBuilder.newColumn('col_19').withTitle('Likely Lab'),
                              DTColumnBuilder.newColumn('col_20').withTitle('Max lab'),
                              DTColumnBuilder.newColumn('col_23').withTitle('ID22').notVisible(),
                              DTColumnBuilder.newColumn('col_24').withTitle('ID23').notVisible(),
                              DTColumnBuilder.newColumn('col_25').withTitle('ID24').notVisible(),
                              DTColumnBuilder.newColumn('col_26').withTitle('ID25').notVisible(),
                              DTColumnBuilder.newColumn('col_27').withTitle('ID26').notVisible(),
                              DTColumnBuilder.newColumn('col_28').withTitle('Network').notVisible(),
                              DTColumnBuilder.newColumn('col_29').withTitle('ID28').notVisible(),
                          ];*/
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