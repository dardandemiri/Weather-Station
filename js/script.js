var cities = [
  "Venice",
  "Hong+Kong",
  "Istanbul",
  "New+York",
  "London",
  "Paris",
  "Cape+Town",
  "Amsterdam",
  "Beirut",
  "Kyoto",
  "Queenstown",
  "Barcelona",
  "Singapore",
  "Havana",
  "Florence",
  "Sydney",
  "Lisbon",
  "Rio+de+Janeiro",
  "Jaipur",
  "Lucerne",
  "Shanghai",
  "San+Francisco",
  "Rome",
  "Bruges",
  "Stockholm",
  "Cartagena",
  "Budapest",
  "Prague",
  "Edinburgh",
  "Busan",
  "Mexico+City",
  "Charleston",
  "Dubrovnik",
  "Riga",
  "Quito",
  "Vienna",
  "Quebec City",
  "Jerusalem",
  "Buenos+Aires",
  "Isfahan",
  "Seville",
  "Chicago",
  "Kiev",
  "Hamburg",
  "Krakow"
];

var tempValueC;
var tempValueF;
var latANDlon;
var cityEntered;

var searchURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var locationURL = "https://api.openweathermap.org/data/2.5/find?";
var apiKey = "&APPID=f0c7f1a6071bf1c3e32c2e120091a56a&units=imperial";

$(document).ready(function() {
  $(".searchArea").hide();
  $(".results").hide();
  $(".results2").hide();
  $(".alert-area").hide();
  function tempConverter(temp) {
    tempValueF = temp;
    tempValueC = Math.round(5 / 9 * (temp - 32));
    return tempValueC;
  }

  clickedSearch = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latANDlon =
        "lat=" +
        position.coords.latitude +
        "&lon=" +
        position.coords.longitude +
        "&cnt=1";
    });
  }

  var clickedSearch = true;
  $(".search").click(function() {
    if (clickedSearch) {
      $(".searchArea").fadeIn(300);
      clickedSearch = false;
    } else {

      $(".searchArea").fadeOut(300);
      clickedSearch = true;
    }
  });

  $("#celcius").click(function() {
    $("#celcius").addClass("active");
    $("#farenheid").removeClass("active");
    $("#tempVal").text(tempValueC);
  });

  $("#farenheid").click(function() {
    $("#farenheid").addClass("active");
    $("#celcius").removeClass("active");
    $("#tempVal").text(tempValueF);
  });

  $(".randomWeather").click(function() {
    $(".searchArea").fadeOut(300);
    $(".alert-area").hide();
    clickedSearch = true;
    var randomNr = Math.round(Math.random() * cities.length);

    function getWeather(locationURL) {
      $.ajax({
        url: searchURL + cities[randomNr] + apiKey,
        success: function(result) {
          var city = result.city.name;
          var temp = tempConverter(result.list[0].main.temp);
          var wind = result.list[0].wind.speed + " km/h";
          var humidity = result.list[0].main.humidity;
          var description = result.list[0].weather[0].description;
          var icon = result.list[0].weather[0].icon;
          var country ="";
          $("body").css("background-image","url('img/" + icon + ".jpg')");

          if(result.city.country !== "undefined"){
            country = result.city.country;
          }
          valUpdater(city, temp, wind, humidity, description, icon, country);
        }
      });
    }
    getWeather(locationURL);
    $(".results").show();
    $(".results2").show();
  });

  $(".myLocation").click(function() {
    $(".searchArea").fadeOut(300);
    clickedSearch = true;
    $(".results").show();
    $(".results2").show();
    $(".alert-area").hide();

    function getWeather(searchURL) {
      $.ajax({
        url: locationURL + latANDlon + apiKey,
        success: function(result) {
          var city = result.list[0].name;
          var temp = tempConverter(result.list[0].main.temp);
          var wind = result.list[0].wind.speed + " km/h";
          var humidity = result.list[0].main.humidity;
          var description = result.list[0].weather[0].description;
          var icon = result.list[0].weather[0].icon;
          $("body").css("background-image","url('img/" + icon + ".jpg')");
          valUpdater(city, temp, wind, humidity, description, icon, "");
        }
      });
    }
    getWeather(locationURL);
  });

  $("#searchBTN").click(function() {
    cityEntered = $("#searchIn")
      .val()
      .split();
    if (cityEntered !== "") {
      $(".alert-area").hide();
      $(document).keypress(function(e) {
    if(e.which == 13) {
        getWeather(searchURL);
    }
});
    } else {
      $(".alert-area").show();
    }
    function getWeather(searchURL) {
      $.ajax({
        url: searchURL + cityEntered.join("+") + apiKey,
        success: function(result) {
          var city = result.city.name;
          var temp = tempConverter(result.list[0].main.temp);
          var wind = result.list[0].wind.speed + " km/h";
          var humidity = result.list[0].main.humidity;
          var description = result.list[0].weather[0].description;
          var icon = result.list[0].weather[0].icon;
          var country = result.city.country;

          valUpdater(city, temp, wind, humidity, description, icon, country);
          $(".results").show();
          $(".results2").show();
          $("body").css("background-image","url('img/" + icon + ".jpg')");
        },
        statusCode: {
          404: function() {
            $(".alert-area").show();
            $(".results").hide();
            $(".results2").hide();
          }
        }
      });
    }
    getWeather(searchURL);
  });

  function valUpdater(city, temp, wind, humidity, description, icon, country) {
    $("#city").text(city + " " + country);
    $("#tempVal").text(temp);
    $("#wind").text(wind);
    $("#humidity").text(humidity);
    $("#description").text(titleCase(description));
    $("#weather-icon").attr(
      "src",
      "img/weather/" + icon + ".png"
    );

  }

  function titleCase(str) {
    var strToArr = str.toLowerCase().split(" ");

    var result = strToArr.map(function(val) {
      return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
    });

    return result.join(" ");
  }
});
