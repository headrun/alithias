;(function (angular) {
  "use strict";

  	angular.module("procedurepriceview")
        .component("procedurepriceview", {

           	"templateUrl": "/js/procedurepriceview/procedurepriceview.html",
           	"controller" : [ "$http", "$scope", "Session", "$state", "$rootScope", "DTOptionsBuilder", "DTColumnBuilder","$compile", "$timeout",

              function ($http, $scope, Session, $state, $rootScope, DTOptionsBuilder, DTColumnBuilder, $compile, $timeout) {
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

                 that.printDiv = function() {
                      var printUrl = domainName+"api/procedure_pricing/?ProcedureID="+
                                  that.procedureID+"&NetworkID="+
                                  that.networkId+"&EnforceRequirements="+
                                  that.requirements+"&state="+
                                  that.stateID+"&file_type=print&stateName="+
                                  $('#stateName :selected').text()+"&networdName="+
                                  $('#networkName :selected').text()+"&procName="+
                                  $('#procedureName :selected').text();
                      $http({method: "GET", url: printUrl})
                        .then(function(response){
                            if (response.data.length > 0) {
                              that.states = response.data[0]['states'];
                              var w=window.open();
                              w.document.write($('#'+divName).html());
                              w.print();
                              w.close(); 
                            }
                        });
                  }

                  that.excelDownload = function(){
                    var excelUrl = domainName+"api/procedure_pricing/?ProcedureID="+
                                  that.procedureID+"&NetworkID="+
                                  that.networkId+"&EnforceRequirements="+
                                  that.requirements+"&state="+
                                  that.stateID+"&file_type=excel&stateName="+
                                  $('#stateName :selected').text()+"&networdName="+
                                  $('#networkName :selected').text()+"&procName="+
                                  $('#procedureName :selected').text();

                    window.location = excelUrl;
                  }

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.networkId = param.networkName ? param.networkName : '';
                    that.procedureID = param.procedureName ? param.procedureName : '';
                    that.stateID = param.stateName ? param.stateName : '';
                    that.requirements = param.requirements ? true : false;

                    that.apiUrl = domainName+'api/procedure_pricing/?ProcedureID='+that.procedureID+'&NetworkID='+that.networkId+'&EnforceRequirements='+that.requirements+'&state='+that.stateID;
                    that.pdfUrl = domainName+"api/procedure_pricing/?ProcedureID="+
                                     that.procedureID+"&NetworkID="+
                                     that.networkId+"&EnforceRequirements="+
                                     that.requirements+"&state="+
                                     that.stateID+"&file_type=pdf&stateName="+
                                     $('#stateName :selected').text()+"&networdName="+
                                     $('#networkName :selected').text()+"&procName="+
                                     $('#procedureName :selected').text();

                    vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: that.apiUrl,
                              type: 'GET'
                           })
                       .withOption('createdRow', function(row, data, dataIndex) {
                              $compile(angular.element(row).contents())($scope);
                          })
                          .withOption('headerCallback', function(header) {
                              if (!vm.headerCompiled) {
                                  vm.headerCompiled = true;
                                  $compile(angular.element(header).contents())($scope);
                              }
                          })
                       .withOption('serverSide', false)
                       .withOption('scrollY', '450px')
                       .withOption('scrollX', '600px')
                       .withOption('order', [7, 'asc'])
                       .withOption('lengthMenu', [[8, 25, 50, -1], [8, 25, 50, "All"]])
                       .withPaginationType('full_numbers');

                    vm.authenticated = true;
                    vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_5').withTitle('NPI'),
                          DTColumnBuilder.newColumn('col_1').withTitle('Facility'),
                          DTColumnBuilder.newColumn('col_2').withTitle('CIty'),
                          DTColumnBuilder.newColumn('col_4').withTitle('Facility Type'),
                          DTColumnBuilder.newColumn('col_30').withTitle('Breakdown').renderWith(function(data, type, full, meta) {
                                return '<a href="#!/procedurepricingdetail?data=%7B%20%22ProcedureID%22%20:%20'+ that.procedureID +',%20%22NetworkID%22%20:%20'+that.networkId+',%20%22FacilityNPI%22%20:%20'+full.col_5+'%7D" target="_blank">'+full.col_30+'</a>';
                            }),
                          DTColumnBuilder.newColumn('col_31').withTitle('Episode').renderWith(function(data, type, full, meta) {
                                return '<a href="#!/ppepisodedetails?data=%7B%20%22ProcedureID%22%20:%20'+ that.procedureID +',%20%22NetworkID%22%20:%20'+ that.networkId +',%20%22FacilityNPI%22%20:%20'+ full.col_5 +'%7D" target="_blank"> '+full.col_31+'</a>';
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
                          DTColumnBuilder.newColumn('col_20').withTitle('Max Lab'),
                          DTColumnBuilder.newColumn('col_3').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_21').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_23').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_22').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_24').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_25').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_26').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_27').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_28').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_29').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_30').withTitle('temp1').notVisible(),
                          DTColumnBuilder.newColumn('col_31').withTitle('temp1').notVisible(),
                        ];
                        $('#loadingDiv').hide();
                 }

              }
            ]
        });

}(window.angular));