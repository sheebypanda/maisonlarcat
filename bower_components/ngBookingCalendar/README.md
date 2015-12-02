#### ngBookingCalendar
AngularJS Availability Booking Calendar

#### Dependencies
    - moment.js
    - fontawesome

#### Example 

Check out [the live demo](http://demo.jankuri.com/ngBookingCalendar/)

Install
-------

#### With bower:

    $ bower install ngBookingCalendar
    
#### Example Configuration
```html
<!DOCTYPE html>
<html ng-app="app">
<head>
	<title>AngularJS DatePicker</title>
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="bower_compoments/ngBookingCalendar/src/css/ngBookingCalendar.css">
</head>
<body ng-controller="Ctrl as ctrl">

<ng-booking-calendar></ng-booking-calendar>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales.min.js"></script>
<script type="text/javascript" src="bower_components/ngBookingCalendar/src/js/ngBookingCalendar.js"></script>
<script type="text/javascript">
var app = angular.module('app', ['jkuri.bookingcalendar']);
app.controller('Ctrl', [function() {
	var self = this;
}]);
</script>
</body>
</html>
``` 

For more information please see [http://demo.jankuri.com/ngBookingCalendar/](http://demo.jankuri.com/ngBookingCalendar/)
