$(document).ready(function(){
	var wurl;
	const kelvin = 273.15;
	var t = setInterval(displayToWatch, 300000);
	var lat, long;
	if(localStorage.length>0){
		lat = localStorage.getItem('lat');
		long = localStorage.getItem('long');
		getApi();
	}
	else if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(success, error);
		}
	
	function success(pos){
		var crd = pos.coords;
		lat = crd.latitude;
		long = crd.longitude;
		localStorage.setItem('lat', lat);
		localStorage.setItem('long', long);
		getApi();
	}

	function getApi(){
		var city, country, mainWeather, mainDeskWeather, fTemp, code;
		wurl = `http://api.openweathermap.org/data/2.5/weather?APPID=e0210d5b01c91ded42f3da89ab592d65&lat=${lat}&lon=${long}`;
		displayToWatch();
	}

	function displayToWatch(){		
		$.getJSON(wurl, function(data){
			city = data.name;
			mainWeather = data.weather[0].main;
			mainDeskWeather = data.weather[0].description;
			fTemp = Math.floor(data.main.temp - kelvin);
			code = data.weather[0].id;
			country = data.sys.country;
			var iconic = [], counter=0, icon;
		$.getJSON('https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json', 
			function(data){
				for(key in data){
						if(mainDeskWeather == data[key]['label']){
							icon = data[key]['icon'];
						}
						counter++;
				}
			$('.wi').removeClass('wi-day-sunny').addClass(function(){
				var timeOfNow = new Date();
				var timeHours = timeOfNow.getHours();
				if(timeHours > 6 && timeHours <21){
					document.documentElement.style.setProperty(`--main-background`, 'rgb(255, 77, 71)');
					return 'wi-day-'+icon;
				}
				else{
					document.documentElement.style.setProperty(`--main-background`, 'rgb(66, 61, 61)');
					return 'wi-night-'+icon;
				}
			})
			$('#country__city').html(city);
			$('#country__name').html(country);
			$('.main__temp').html(fTemp);
			$('.main__main').html(mainWeather);
			$('.main__description').html(mainDeskWeather);

			});


		});

	}

	$('.btn').on('click', function(){
		localStorage.clear();
		if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(success, error);
		}
	})

	function error(err){
		console.log(err.code);
		alert("Please, reboot the page");
	}
});