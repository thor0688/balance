angular.module('services',[])

.factory('Prof', function($http, $rootScope) {

	var getGraphData = function() {

		return $http.get('/basicInfo')
		.then( (d) => {
			return [[0, 100], [1, 4], [2, 6], [3, 13], [4, 18], [5, 25]]
		})
		.catch((e) => {
			return [[0, 100], [1, 4], [2, 6], [3, 13], [4, 18], [5, 25]]
		});
	}

	var getDateSelected = function(date) {
		console.log('gemo should fuck off!', date);
	};

	var getProfileInfo = function(user) {
		return $http({
			method: 'GET',
			url: '/basicInfo'
		}).then(function(result){
			console.log('================THIS ONE====>', result.data)
			return result.data;
		});
	};

	var getFood =function(user) {
		return $http({
			method: 'GET',
			url: '/foodHistory'
		}).then(function(result){
			return result.data;
		});
	};

	var getExercises =function(user) {
		return $http({
			method: 'GET',
			url: `/exerciseHistory`
		}).then(function(result){
			return result.data;
		});
	};

	var getWeight =function(user) {
		return $http({
			method: 'GET',
			url: `/weightHistory`
		}).then(function(result){
			return result.data;
		});
	};

	var tabView = function(item) {
		var tabs = {
			greeting: false,
			weight: false,
			exercise: false,
			consumables: false,
			calendar: false,
			graphs: false
		}

		if(item) {
			tabs[item] = true;
			// if(item === 'calendar') {
			// 	$(function(){
			// 		$('#calendar').fullCalendar()
			// 	});
			// }
		} else {
			tabs.greeting = true;
		}

		return tabs;
	};

	var postWeight = function(weight) {
		return $http.post('/weight', {weight: weight});
	}
	
	var postExercise = function(exercise, calories, miles) {
		return $http.post('/exercise', {exercise: exercise, calories: calories, miles: miles});
	}

	var postFood = function(food, calories) {
		return $http.post('/food', {food: food, calories: calories});
	}

	var onDayClick = function(day) {
		getWeight()
	}


	return {
		getGraphData: getGraphData,

		postWeight: postWeight,
		postFood: postFood,
		postExercise: postExercise,
		getDateSelected: getDateSelected,
		getProfileInfo: getProfileInfo,
		tabView: tabView,
		getFood: getFood,
		getExercises: getExercises,
		getWeight: getWeight,

		weightEvents: [],
		exerciseEvents: [],
		foodEvents: [],
		onDayClick: (function(day) {
			getFood().then(function(res){
				this.foodEvents = res;
				$rootScope.$broadcast('foodChange', res, day)
				console.log('foods ', res);
			});
			getExercises().then(function(res){
				this.exerciseEvents = res;
				$rootScope.$broadcast('exerciseChange', res, day)
				console.log('exercises', res);
			});
			getWeight().then(function(res) {
				this.weightEvents = res;
				$rootScope.$broadcast('weightChange', res, day)
				console.log('weights', res);
			});
		}).bind(this)
	};
});