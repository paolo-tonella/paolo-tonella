(function() {
  var app = angular.module('papers', ['ngRoute', 'akoenig.deckgrid']);

  angular.module("papers").filter("isNotArray", function() {
        return function(input) {
            return angular.isDefined(input) && !angular.isArray(input);
        };
  });

  angular.module("papers").filter("isValidAuthor", function() {
        return function(input) {
            return angular.isDefined(input) && !(input == "Fondazione Bruno Kessler");
        };
  });

  angular.module("papers").filter("isFirstAuthorValid", function() {
        return function(input) {
            return angular.isArray(input) || !(input.__text == "Fondazione Bruno Kessler");
        };
  });

  angular.module("papers").filter("isArray", function() {
        return function(input) {
            return angular.isDefined(input) && angular.isArray(input);
        };
  });

  app.controller('ParentController', ['$scope', 
    function($scope) {
	    $scope.pub = {papers: [], coauthors: []};
	}]);
	
  app.controller('PanelController', ['$scope', '$location', 
    function($scope, $location) {
		this.tab = 1;
		
		this.selectTab = function(setTab) {
			this.tab = setTab;
			if (setTab === 1) {
				$location.path('/');
			}
			if (setTab === 2) {
				$location.path('papersbyyear');
			}
			if (setTab === 3) {
				$location.path('papersbytype');
			}
			if (setTab === 4) {
				$location.path('papersbycoauthor/0');
			}
			if (setTab === 5) {
				$location.path('projects');
			}
			if (setTab === 6) {
				$location.path('tools');
			}
			if (setTab === 7) {
				$location.path('photos');
			}
		};
		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
  }]);

  app.controller('PaperController', ['$http', '$scope', '$location', '$routeParams', 
    function($http, $scope, $location, $routeParams) {
		$scope.pub = $scope.$parent.pub;
		$scope.coauthors = $scope.$parent.pub.coauthors;
		$scope.coauthor = $routeParams.coauthor;
		$scope.selectedPapers = [];
		$scope.photos = [
    		{ id: 'p1', 'title': 'SSBSE 2015', rotate: 90,
    		  src: "photos/p1.jpg", 
    		  text: 'International Symposium on Search-Based Software Engineering (General Chair), Bergamo, Italy, 2015'}
    		,{ id: 'p5', 'title': 'ICSM 2012', rotate: 0,
    		  src: "photos/p5.jpg", 
    		  text: 'International Conference on Software Maintenance (General Chair), Riva del Garda, Trento, Italy, 2012'}
    		,{ id: 'p2', 'title': 'ICSE MIP 2011', rotate: 0,
    		  src: "photos/p2.png", 
    		  text: 'Most Influential Paper award, International Conference on Software Engineering, Waikiki, Honolulu, Hawaii, USA, 2011'}
    		,{ id: 'p6', 'title': 'Lecture at UNILU 2014', rotate: 0,
    		  src: "photos/p6.png", 
    		  text: 'Distinguished Lecture on Model Based Testing at the University of Luxembourg, 2014'}
    		,{ id: 'p3', 'title': 'ICSM 2011', rotate: 0,
    		  src: "photos/p3.jpg", 
    		  text: 'International Conference on Software Maintenance (Program Co-Chair), Williamsburg, Virginia, USA, 2011'}
    		,{ id: 'p4', 'title': 'ISSTA 2010', rotate: 0,
    		  src: "photos/p4.jpg", 
    		  text: 'International Symposium on Software Testing and Analysis (General Chair), Trento, Italy, 2010'}
    		,{ id: 'p7', 'title': 'Dagstuhl 2011', rotate: 0,
    		  src: "photos/p7.jpg", 
    		  text: 'Dagstuhl Seminar on Practical Software Testing: Tool Automation and Human Factors, Dagstuhl, Germany, 2011'}
		];

		selectPapers = function() {
			 if ($scope.coauthor != "") {
				var i = 0, j = 0;
				var k = 0, coauth = new String($scope.coauthor);
				k = coauth.lastIndexOf(' ');
				if (k != -1) {
					coauth = $scope.coauthor.substr(k+1);
				}
				for (i = 0 ; i < $scope.pub.papers.length ; i++) {
					for (j = 0 ; (typeof $scope.pub.papers[i].book != "undefined") && 
								  j < $scope.pub.papers[i].book.author.length ; j++) {
						if ($scope.pub.papers[i].book.author[j].indexOf(coauth) > -1) {
							$scope.selectedPapers.push($scope.pub.papers[i]);
						}
					}
					for (j = 0 ; (typeof $scope.pub.papers[i].article != "undefined") && 
								  j < $scope.pub.papers[i].article.author.length ; j++) {
						if ($scope.pub.papers[i].article.author[j].indexOf(coauth) > -1) {
							$scope.selectedPapers.push($scope.pub.papers[i]);
						}
					}
					for (j = 0 ; (typeof $scope.pub.papers[i].inproceedings != "undefined") && 
								  j < $scope.pub.papers[i].inproceedings.author.length ; j++) {
						if ($scope.pub.papers[i].inproceedings.author[j].indexOf(coauth) > -1) {
							$scope.selectedPapers.push($scope.pub.papers[i]);
						}
					}
				}
			}		
		}

		var url = "";
		if ($location.host() == "localhost") {
			url = 'http://localhost/~tonella/mysite/';
		} else {
			url = 'https://paolo-tonella.github.io/paolo-tonella/';
		}
		if ($scope.pub.papers.length == 0) {  
		   $http.get(url + 'Tonella-Paolo.xml', {
			 transformResponse: function(response) {
				var x2js = new X2JS();
                var json = x2js.xml_str2json(response);
                return x2js.asArray(json.dblpperson.r);
			 }		
		  }).then(function(response) {
			 $scope.pub.papers = response.data;
		  });
		}
		if ($scope.coauthors.length == 0) { 
		   $http.get(url + 'Tonella-Paolo.xml', {
			 transformResponse: function(response) {
				var x2js = new X2JS();
                var json = x2js.xml_str2json(response);
                return x2js.asArray(json.dblpperson.coauthors.co);
			 }		
		  }).then(function(response) {
			 $scope.pub.coauthors = response.data; 
			 $scope.coauthors = response.data; 
			 selectPapers();
		  });
		} else {
			selectPapers();
		}
  }]);
	
  app.config(['$routeProvider', function($routeProvider) { 
    $routeProvider.when('/', {
       controller: 'PanelController', 
       templateUrl: 'selectedpapers.html' 
    }).when('/papersbytype', {
       controller: 'PaperController', 
       templateUrl: 'papersbytype.html' 
    }).when('/papersbyyear', {
       controller: 'PaperController', 
       templateUrl: 'papersbyyear.html' 
    }).when('/papersbycoauthor/:coauthor', {
       controller: 'PaperController', 
       templateUrl: 'papersbycoauthor.html' 
    }).when('/projects', {
       controller: 'PaperController', 
       templateUrl: 'projects.html' 
    }).when('/tools', {
       controller: 'PaperController', 
       templateUrl: 'tools.html' 
    }).when('/photos', {
       controller: 'PaperController', 
       templateUrl: 'photos.html' 
    }).otherwise({
       controller: 'PanelController', 
       templateUrl: 'selectedpapers.html'     
    });
  }]); 

})();
