// Conts
const apiKey="4370a3696759946025d80d1f810c9702";

// Verificar se existe linguagem definina
if(localStorage.getItem("lang")===null) {
    localStorage.setItem("lang", "PT");
} else if(localStorage.getItem("lang")=="PT") {
    $("#lang-select").val("PT");
} else {
    $("#lang-select").val("EN");
}

// Verificar se existe sistema de medição definido
if(localStorage.getItem("system-degrees")===null) {
    localStorage.setItem("system-degrees", "metric");
} else if(localStorage.getItem("system-degrees")=="metric") {
    var degreeSufix="°C";
    $("#system-degrees-select").val("metric");
} else if(localStorage.getItem("system-degrees")=="imperial") {
    var degreeSufix="°F";
    $("#system-degrees-select").val("imperial");
}

// Verificar se existe view disponível
if(localStorage.getItem("view")===null) {
    localStorage.setItem("view", "current-location");
}

// Definições
$("#lang-select").change(function() {
    localStorage.setItem("lang", $("#lang-select").val());
}); // Função para alterar a linguagem quando o select for alterado.

$("#system-degrees-select").change(function() {
    localStorage.setItem("system-degrees", $("#system-degrees-select").val());
}); // Função para alterar o sistema de medição quando o select for alterado.

// Alteração da key "view" para "user-search" quando o input de pesquisa é selecionado


// Geolocation
if(localStorage.getItem("view")=="current-location") {
    $("#weatherGroup").hide();
    $("#currentLocation").show();

    const successCallback = (position) => {
        console.log(position.coords.longitude+", "+position.coords.latitude);
        $.get("https://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
            console.log(data);
            $("#searchCity").val(data.name);
            $("#cityNameCL").text(data.name+", "+data.sys.country);
            $("#imgWeatherCL").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
            $("#imgWeatherCL").attr("alt", data.weather[0].description);
            $("#tempMaxCL").text(Math.floor(data.main.temp_max)+degreeSufix);
            $("#tempMinCL").text(Math.floor(data.main.temp_min)+degreeSufix);
            $("#feel-weather").text("Sensação de "+Math.floor(data.main.feels_like)+""+degreeSufix);
            $("#weatherDescCL").text(data.weather[0].description);
        });

        // Forecast (Auto)
        $.get("https://api.openweathermap.org/data/2.5/forecast?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
            console.log("Forecast");
            console.log(data);
        });
    };
    
    const errorCallback = (error) => {
        console.log(error);
    };
    
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else if(localStorage.getItem("view")=="user-search") {
    // Pesquisa feita pelo utilizador
    $("#searchCityBtn").click(function() {
        $.get("https://api.openweathermap.org/data/2.5/weather?q="+$("#searchCity").val()+"&appid="+apiKey, function(data, status) {
            console.log("Pesquisa pelo utilizador:");
            console.log(data);
        });
    });
    
}
