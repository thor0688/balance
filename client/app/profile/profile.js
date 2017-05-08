angular.module('profile', [])

.controller('profileController', ['$scope', 'Prof', '$location', 'currentUser', function($scope, Prof, $location, currentUser) {
	$scope.username = $location.path().split('/')[2];
  console.log('cur user ', currentUser)
  $scope.signout = function() {
    currentUser.user.signOut();
  }

	Prof.getProfileInfo($scope.username).then(function(info) {
		$scope.info = info;
	});

  $scope.$on('exerciseChange', function(e, stuff, day) {
    day = new Date(day.getTime() + 1000 * 60 * 60 * 24)
    $scope.exercises = stuff.filter((exer) => {
      //console.log(new Date(weight.date), "vs" , day);
      return (''+new Date(exer.created_at)).slice(0, 15) === (''+day).slice(0,15);
    });
    console.log('exerciseChanged', $scope.exercises, day)
  })
  $scope.$on('foodChange', function(event, stuff, day) {
    day = new Date(day.getTime() + 1000 * 60 * 60 * 24)
    $scope.foods = stuff.filter((food) => {
      //console.log(new Date(weight.date), "vs" , day);
      console.log('=====>', day.toString())
      console.log('asdfasdfasdfasdf.', food)
      console.log((''+new Date(food.created_at)).slice(0, 15), 'vs', (''+day).slice(0,15))
      return (''+new Date(food.created_at)).slice(0, 15) === (''+day).slice(0,15);
    });
    console.log('foodChanged', $scope.foods, day)
  })
  $scope.$on('weightChange', function(e, stuff, day) {
    day = new Date(day.getTime() + 1000 * 60 * 60 * 24)
    $scope.weights = stuff.filter((weight) => {
      //console.log(new Date(weight.date), "vs" , day);
      return (''+new Date(weight.date)).slice(0, 15) === (''+day).slice(0,15);
    });
    console.log('weightChanged', $scope.weights, day)
  })
  $scope.weights = [];
  $scope.foods = [];
  $scope.exercises = [];
 

	$scope.tabs = Prof.tabView();

  $scope.postWeight = function() {
      Prof.postWeight($scope.weight).then(function() {
          $scope.info.weight = $scope.weight;
      }).then(()=>{
        $scope.weight = '';
      })
  }

  $scope.postExercise = function() {
      Prof.postExercise($scope.exercise, $scope.burned, 0)
          .then(() => {
              $scope.exercise = '';
              $scope.burned = '';
              console.log('exercise posted in a satisfatorily way')
          });
  }

  $scope.postFood = function() {
      Prof.postFood($scope.food, $scope.consumed)
          .then(() => { 
              $scope.food = '';
              $scope.consumed = '';
              console.log('food posted successfully!!')
          })
  }

  $scope.tabView = (item) => $scope.tabs = Prof.tabView(item);
}])

.directive('anything', function(Prof) {
  return {
    restrict: 'AE',
    replace: true,
    link: function(scope, element, attrs) {
      angular.element(element).fullCalendar({

        dayClick: function(date, jsEvent, view) {
          Prof.onDayClick(new Date(date._d));
        }
      });
    }
  }
})

.directive('graph', function(Prof) {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div></div>',
    link: function(scope, element, attrs) {
      Prof.getGraphData().then(function(d){
        scope.chart = google.charts;
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawBasic);
        var graphData;
        function drawBasic() {

          var data = new google.visualization.DataTable();
          data.addColumn('number', 'X');
          data.addColumn('number', 'Pounds');
          //the frist number is weeks the second number is pounds
          data.addRows(
            //[[0, 0], [1, 4], [2, 6], [3, 13], [4, 18], [5, 25]]
            d
          );
          var options = {
            hAxis: {
              title: 'Weeks'
            },
            vAxis: {
              title: 'Pounds lost'
            }
          };
          
          element[0].style = "width: 900px; height: 900px";
          var chart = new google.visualization.LineChart(element[0]);

          chart.draw(data, options);
          graphData = data;

          
        }
      });
      
    }
  }
})

