;(function (angular) {
  "use strict";

  	angular.module("procedurecodesummary")
        .component("procedurecodesummary", {

           	"templateUrl": "/js/procedurecodesummary/procedurecodesummary.html",
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

                 $http({method: "GET", url: domainName+"api/proc_code_summary_proc_dropdowns/"})
                    .then(function(response){
                        that.procedures = response.data[0].table_Procedures;
                    });
                    
                 that.printDiv = function(divName) {
                      var w=window.open();
                      w.document.write($('#'+divName).html());
                      w.print();
                      w.close();
                  }

                  that.excelDownload = function(){
                    var excelUrl = domainName+'api/pr_code_summary/?ProcedureID='+
                                  that.ProcedureID+"&file_type=excel&procName="+
                                  $('#procedureName :selected').text();

                    window.location = excelUrl;
                  }

                 $scope.submit = function(param){
                    $('#loadingDiv').show();
                    that.ProcedureID = param.ProcedureID ? param.ProcedureID : '';

                    //that.apiUrl = 'http://localhost:1122/api/pr_code_summary/?ProcedureID='+that.ProcedureID;
                    that.apiUrl = domainName+'api/pr_code_summary/?ProcedureID='+that.ProcedureID;

                    vm.dtOptions = DTOptionsBuilder.newOptions()
                       .withOption('ajax', {
                              url: that.apiUrl,
                              type: 'GET'
                           })
                       .withOption('processing', true)
                       .withOption('serverSide', false)
                       .withOption('scrollY', '450px')
                       .withOption('lengthMenu', [[10, 50, 100, -1], [10, 50, 100, "All"]])
                       .withPaginationType('full_numbers');

                      vm.dtColumns = [
                          DTColumnBuilder.newColumn('col_3').withTitle('Code'),
                          DTColumnBuilder.newColumn('col_4').withTitle('Procedure Name').renderWith(function(col_4) {
                                return '<p style="text-align: left">'+col_4+'</p>'
                              }),
                          DTColumnBuilder.newColumn('col_7').withTitle('Claims'),
                          DTColumnBuilder.newColumn('col_5').withTitle('Episodes'),
                          DTColumnBuilder.newColumn('col_6').withTitle('% Of Episodes'),
                          DTColumnBuilder.newColumn('col_8').withTitle('Min Amount'),
                          DTColumnBuilder.newColumn('col_9').withTitle('Max Amount'),
                          DTColumnBuilder.newColumn('col_10').withTitle('Avg Amount'),
                          DTColumnBuilder.newColumn('col_12').withTitle('Mapping'),
                          DTColumnBuilder.newColumn('col_1').withTitle('sample Ids').notVisible(),
                          DTColumnBuilder.newColumn('col_2').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_11').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_13').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_14').withTitle('sample ids').notVisible(),
                          DTColumnBuilder.newColumn('col_15').withTitle('sample ids').notVisible()
                      ];
                      that.pdfUrl = domainName+'api/pr_code_summary/?ProcedureID='+
                                  that.ProcedureID+"&file_type=pdf&procName="+
                                  $('#procedureName :selected').text();
                      $('#loadingDiv').hide();
                      vm.authorized = true;
                  }
	            }	
           	]
        });
}(window.angular));
