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

                 that.printDiv = function(divName) {
                      var w=window.open();
                      w.document.write($('#'+divName).html());
                      w.print();
                      w.close();
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
                          setTimeout(function(){ 
                              $('#contentTable').DataTable({
                                  "scrollY": "450px",
                                  "scrollX": "600px",
                                  "lengthMenu": [[8, 25, 50, -1], [8, 25, 50, "All"]]
                              });

                          }, 200);
                          $('#notFound').hide();

                        }else{
                          $('#loadingDiv').hide();
                          $('#notFound').show();
                        }                        
                    });
                 }

              }
            ]
        });

}(window.angular));