// Conts
const apiKey="4370a3696759946025d80d1f810c9702";

// Vars globais
var arrayRecentes=[];

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

// Definições
$("#lang-select").change(function() {
    localStorage.setItem("lang", $("#lang-select").val());
    location.reload();
}); // Função para alterar a linguagem quando o select for alterado.

$("#system-degrees-select").change(function() {
    localStorage.setItem("system-degrees", $("#system-degrees-select").val());
    location.reload();
}); // Função para alterar o sistema de medição quando o select for alterado.

/* Alteração da key "view" para "user-search" quando o input de pesquisa é selecionado
$("#searchCity").focus(function() {
    localStorage.setItem("view", "user-search");
});
*/

$("#searchByLocation").click(function() {
    // Geolocation
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
});


// Verificar se existe pesquisas recentes
if(localStorage.getItem("recentes")!=null) {
    var parsedRecentes=JSON.parse(localStorage.getItem("recentes"));

    for(var i=0;i<parsedRecentes.length;i++) {
        arrayRecentes[i]=parsedRecentes[i];
    }

    parsedRecentes.reverse()

    for(var i=0;i<=2;i++) {
        if(parsedRecentes[i]!=null)
            $("#dropdownRecentes").append('<li><a class="dropdown-item" onclick="searchRecent(\''+parsedRecentes[i]+'\')">'+parsedRecentes[i]+'</a></li>');
    }
}

// Pesquisa feita pelo utilizador
$("#searchCityBtn").click(function() {
    arrayRecentes.push($("#searchCity").val());
    localStorage.setItem("recentes", JSON.stringify(arrayRecentes));
    $.get("https://api.openweathermap.org/data/2.5/weather?q="+$("#searchCity").val()+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
        console.log("Pesquisa pelo utilizador:");
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
});

// Pesquisa ao clicar nos recentes
function searchRecent(cityName) {
    $.get("https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
        $("#searchCity").val(data.name);
        $("#cityNameCL").text(data.name+", "+data.sys.country);
        $("#imgWeatherCL").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
        $("#imgWeatherCL").attr("alt", data.weather[0].description);
        $("#tempMaxCL").text(Math.floor(data.main.temp_max)+degreeSufix);
        $("#tempMinCL").text(Math.floor(data.main.temp_min)+degreeSufix);
        $("#feel-weather").text("Sensação de "+Math.floor(data.main.feels_like)+""+degreeSufix);
        $("#weatherDescCL").text(data.weather[0].description);
    });
}

