angular.module('jkuri.bookingcalendar', [])

.factory('MultiCalendarService', ['$http', function($http) {
	var self = this;

	self.getData = function (url, id, from, to) {
		var params = {
			id: id,
			from: from,
			to: to
		};
		return $http.get(url, params);
	};

	return self;
}])

.directive('ngBookingCalendar', ['$timeout', 'MultiCalendarService', function($timeout, MultiCalendarService) {
	'use strict';

	var setScopeValues = function (scope, attrs) {
		scope.firstWeekDaySunday = scope.$eval(attrs.firstWeekDaySunday) || false;
		scope.locale = attrs.locale || 'en';
		scope.num = attrs.num || 3;
		scope.numMonthsText = attrs.numMonthsText || 'Number of months:';
		scope.id = attrs.id || null;
		scope.url = attrs.url || 'data/example_data.json';
	};

	return {
		restrict: 'EA',
		link: function (scope, element, attrs) {
			setScopeValues(scope, attrs);

			scope.calendars = [];
			scope.dayNames = [];
			scope.displayMonthsOpts = [3, 6, 9, 12];
			scope.num = scope.displayMonthsOpts[scope.displayMonthsOpts.indexOf(parseInt(scope.num, 10))];

			moment.locale(scope.locale);
			var date = moment(),
				today = moment();

			var generateDayNames = function () {
				var date = scope.firstWeekDaySunday === true ?  moment('2015-06-07') : moment('2015-06-01');
				for (var i = 0; i < 7; i += 1) {
					scope.dayNames.push(date.format('ddd'));
					date.add('1', 'd');
				}
			};

			generateDayNames();

			var generateCalendar = function (date, data) {
				var calendar = {},
					lastDayOfMonth = date.endOf('month').date(),
					month = date.month(),
					year = date.year(),
					n = 1,
					busy = false,
					past_day = false,
					is_today = false;
			
				var firstWeekDay = scope.firstWeekDaySunday === true ? date.set('date', 2).day() : date.set('date', 1).day();
				if (firstWeekDay !== 1) {
					n -= firstWeekDay - 1;
				}

				scope.dateValue = date.format('MMMM YYYY');
				calendar.days = [];

				for (var i = n; i <= lastDayOfMonth; i += 1) {
					busy = false;
					var cmpDate = moment(year + '-' + (month + 1) + '-' + i, 'YYYY-MM-DD'),
						cmpDateFormatted = cmpDate.format('YYYY-MM-DD');

					if (i > 0) {
						busy = calData[cmpDateFormatted] === false ? true : false;
						past_day = cmpDate < today ? true : false;
						is_today = cmpDateFormatted === today.format('YYYY-MM-DD') ? true : false;
						calendar.days.push({day: i, month: month + 1, year: year, enabled: true, busy: busy, past_day: past_day, is_today: is_today});
					} else {
						calendar.days.push({day: null, month: null, year: null, enabled: false, busy: busy});
					}
				}

				calendar.dateValue = date.format('MMMM YYYY');

				return calendar;
			};

			var calData = {};
			var initCalendars = function (n) {
				scope.calendars = [];
				calData = {};
				scope.loading = true;

				var d = angular.copy(date),
					dateFrom = d.set('date', 1).format('YYYY-MM-DD'),
					dateTo = d.set('month', d.month() + scope.num - 1).set('date', d.endOf('month').date()).format('YYYY-MM-DD');

				MultiCalendarService.getData(scope.url, scope.id, dateFrom, dateTo).then(function(resp) {
					resp.data.forEach(function(d) {
						calData[d.date] = d.is_available;
					});

					for (var i = 0; i < n; i += 1) {
						scope.calendars.push(generateCalendar(date, calData));
						date.add('1', 'M');
					}

					scope.loading = false;
				});
			};

			scope.prevMonth = function () {
				var d = angular.copy(date);
				if (d.subtract(3, 'M').month() === today.month()) return;
				date.subtract(parseInt(scope.num, 10) + 1, 'M');
				initCalendars(scope.num);
			};

			scope.nextMonth = function () {
				date.subtract(parseInt(scope.num, 10) - 1, 'M');
				initCalendars(scope.num);
			};

			scope.$watch('num', function() {
				date = moment();
				initCalendars(parseInt(scope.num, 10));
			});

		},
		template:
		'<div class="ng-multi-calendar">' +
		'  <div class="ng-multi-calendar-select">' +
		'    <label>{{ numMonthsText }}' +
		'    <select ng-model="num" ng-options="n for n in displayMonthsOpts">' +
		'    </select>' +
		'    </label>' +
		'  </div>' +
		'  <div class="ng-multi-calendar-loader" ng-show="loading"><div class="uil-ring-css"><div></div></div></div>' +
		'  <div class="left">' +
		'    <i class="fa fa-angle-left" ng-click="prevMonth()"></i>' +
		'  </div>' +
		'  <div class="calendar" ng-repeat="c in calendars">' +
		'    <div class="month-name"><span ng-bind="c.dateValue" class="date"></span></div>' +
		'    <div class="day-names">' +
		'      <span ng-repeat="dn in dayNames">' +
		'        <span ng-bind="dn"></span>' +
		'      </span>' +
		'    </div>' +
		'    <div class="days">' +
		'      <span ng-repeat="d in c.days">' +
		'        <span class="day" ng-click="selectDate($event, d)" ng-class="{busy: d.busy, past: d.past_day, today: d.is_today}">{{ d.day }}</span>' +
		'      </span>' +
		'    </div>' +
		'  </div>' +
		'  <div class="right">' +
		'    <i class="fa fa-angle-right" ng-click="nextMonth()"></i>' +
		'  </div>' +
		'</div>'
	};

}]);