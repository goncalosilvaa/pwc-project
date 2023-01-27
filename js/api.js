// Conts
const apiKey="4370a3696759946025d80d1f810c9702";

// Vars globais
var arrayRecentes=[];
var arrayMeses=["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
var arrayFavs=[];

// Verificar se existe linguagem definina
if(localStorage.getItem("lang")===null) {
    localStorage.setItem("lang", "PT");
    $("#lang-select").val("PT");
} else if(localStorage.getItem("lang")=="PT") {
    $("#lang-select").val("PT");
} else {
    $("#lang-select").val("EN");
}

// Verificar se existe sistema de medição definido
if(localStorage.getItem("system-degrees")==null) {
    localStorage.setItem("system-degrees", "metric");
    var degreeSufix="°C";
} else if(localStorage.getItem("system-degrees")=="metric") {
    var degreeSufix="°C";
    $("#system-degrees-select").val("metric");
} else if(localStorage.getItem("system-degrees")=="imperial") {
    var degreeSufix="°F";
    $("#system-degrees-select").val("imperial");
}

// Verificar se existe cidade para visualizar detalhes
if(localStorage.getItem("cityDetalhes")==null) {
    localStorage.setItem("cityDetalhes", "Leiria");
    
    // Cidade default
    $.get("https://api.openweathermap.org/data/2.5/weather?q=Leiria&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
        $("#searchCity").val(data.name);
        $("#cityNameCL").text(data.name+", "+data.sys.country);
        $("#imgWeatherCL").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
        $("#imgWeatherCL").attr("alt", data.weather[0].description);
        $("#tempMaxCL").text(Math.floor(data.main.temp_max)+degreeSufix);
        $("#tempMinCL").text(Math.floor(data.main.temp_min)+degreeSufix);
        $("#feel-weather").text("Sensação de "+Math.floor(data.main.feels_like)+""+degreeSufix);
        $("#weatherDescCL").text(data.weather[0].description);
    });
} else {
    $.get("https://api.openweathermap.org/data/2.5/weather?q="+localStorage.getItem("cityDetalhes")+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
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

            let sunrise=new Date(data.sys.sunrise*1000);
            let sunset=new Date(data.sys.sunset*1000);

            $("#sunrise").text(sunrise.getHours()+":"+sunrise.getMinutes()+" "+arrayMeses[sunrise.getMonth()+1]+" "+sunrise.getDate());
            $("#sunset").text(sunset.getHours()+":"+sunset.getMinutes()+" "+arrayMeses[sunset.getMonth()+1]+" "+sunset.getDate());

            localStorage.setItem("cityDetalhes", data.name);
            $("#cityDetailsTitle").text("Meteorologia, hoje, "+data.name);
            $("#searchCity").val(data.name);
            $("#cityNameCL").text(data.name+", "+data.sys.country);
            $("#imgWeatherCL").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
            $("#imgWeatherCL").attr("alt", data.weather[0].description);
            $("#tempMaxCL").text(Math.floor(data.main.temp_max)+degreeSufix);
            $("#tempMinCL").text(Math.floor(data.main.temp_min)+degreeSufix);
            $("#feel-weather").text("Sensação de "+Math.floor(data.main.feels_like)+""+degreeSufix);
            $("#weatherDescCL").text(data.weather[0].description);
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
    localStorage.setItem("cityDetalhes", $("#searchCity").val());
    $.get("https://api.openweathermap.org/data/2.5/weather?q="+$("#searchCity").val()+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
        console.log("Pesquisa pelo utilizador:");
        console.log(data);

        $("#cityDetailsTitle").text("Meteorologia, hoje, "+data.name);
        $("#searchCity").val(data.name);
        $("#cityNameCL").text(data.name+", "+data.sys.country);
        $("#imgWeatherCL").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
        $("#imgWeatherCL").attr("alt", data.weather[0].description);
        $("#tempMaxCL").text(Math.floor(data.main.temp_max)+degreeSufix);
        $("#tempMinCL").text(Math.floor(data.main.temp_min)+degreeSufix);
        $("#feel-weather").text("Sensação de "+Math.floor(data.main.feels_like)+""+degreeSufix);
        $("#weatherDescCL").text(data.weather[0].description);

        let pontosCardiais=["N", "S", "O", "E", "NE", "NO", "SE", "SO"];
        let pontoCardialVento;
        let sunrise=new Date(data.sys.sunrise*1000);
        let sunset=new Date(data.sys.sunset*1000);

        $("#sunrise").text(sunrise.getHours()+":"+sunrise.getMinutes()+" "+arrayMeses[sunrise.getMonth()+1]+" "+sunrise.getDate());
        $("#sunset").text(sunset.getHours()+":"+sunset.getMinutes()+" "+arrayMeses[sunset.getMonth()+1]+" "+sunset.getDate());

        if(data.wind.deg==0 || data.wind.deg==360) {
            pontoCardialVento=pontosCardiais[0];
        } else if(data.wind.deg>0 && data.wind.deg<90) {
            pontoCardialVento=pontosCardiais[4];
        } else if(data.wind.deg==90) {
            pontoCardialVento=pontosCardiais[3];
        } else if(data.wind.deg>90 && data.wind.deg<180) {
            pontoCardialVento=pontosCardiais[6];
        } else if(data.wind.deg==180) {
            pontoCardialVento=pontosCardiais[1];
        } else if(data.wind.deg>180 && data.wind.deg<270) {
            pontoCardialVento=pontosCardiais[7];
        } else if(data.wind.deg==270) {
            pontoCardialVento=pontosCardiais[2];
        } else {
            pontoCardialVento=pontosCardiais[5];
        }

        $("#humidadeVal").text(data.main.humidity+"%");
        $("#pressaoVal").text(data.main.pressure+" hPa");
        $("#ventoVal").empty();
        $("#ventoVal").append("<b>"+pontoCardialVento+"</b><i class='fa-solid fa-arrow-up' style='rotate: "+data.wind.deg+"deg;'></i> "+data.wind.speed+" km/h");
        $("#visibilidadeVal").text(data.visibility/1000+" km");
        $("#nuvensVal").text(data.clouds.all+"%");
        $("#coordVal").empty();
        $("#coordVal").append("<b>"+data.coord.lat+", "+data.coord.lon+"</b>");

    });
});

// Pesquisa ao clicar nos recentes
function searchRecent(cityName) {
    localStorage.setItem("cityDetalhes", cityName);
    $("#cityDetailsTitle").text("Meteorologia, hoje, "+cityName);
    $("#searchCity").val(cityName);
    $.get("https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
        $("#searchCity").val(data.name);
        $("#cityNameCL").text(data.name+", "+data.sys.country);
        $("#imgWeatherCL").attr("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
        $("#imgWeatherCL").attr("alt", data.weather[0].description);
        $("#tempMaxCL").text(Math.floor(data.main.temp_max)+degreeSufix);
        $("#tempMinCL").text(Math.floor(data.main.temp_min)+degreeSufix);
        $("#feel-weather").text("Sensação de "+Math.floor(data.main.feels_like)+""+degreeSufix);
        $("#weatherDescCL").text(data.weather[0].description);

        let pontosCardiais=["N", "S", "O", "E", "NE", "NO", "SE", "SO"];
        let pontoCardialVento;
        let sunrise=new Date(data.sys.sunrise*1000);
        let sunset=new Date(data.sys.sunset*1000);

        $("#sunrise").text(sunrise.getHours()+":"+sunrise.getMinutes()+" "+arrayMeses[sunrise.getMonth()+1]+" "+sunrise.getDate());
        $("#sunset").text(sunset.getHours()+":"+sunset.getMinutes()+" "+arrayMeses[sunset.getMonth()+1]+" "+sunset.getDate());

        if(data.wind.deg==0 || data.wind.deg==360) {
            pontoCardialVento=pontosCardiais[0];
        } else if(data.wind.deg>0 && data.wind.deg<90) {
            pontoCardialVento=pontosCardiais[4];
        } else if(data.wind.deg==90) {
            pontoCardialVento=pontosCardiais[3];
        } else if(data.wind.deg>90 && data.wind.deg<180) {
            pontoCardialVento=pontosCardiais[6];
        } else if(data.wind.deg==180) {
            pontoCardialVento=pontosCardiais[1];
        } else if(data.wind.deg>180 && data.wind.deg<270) {
            pontoCardialVento=pontosCardiais[7];
        } else if(data.wind.deg==270) {
            pontoCardialVento=pontosCardiais[2];
        } else {
            pontoCardialVento=pontosCardiais[5];
        }

        $("#humidadeVal").text(data.main.humidity+"%");
        $("#pressaoVal").text(data.main.pressure+" hPa");
        $("#ventoVal").empty();
        $("#ventoVal").append("<b>"+pontoCardialVento+"</b><i class='fa-solid fa-arrow-up' style='rotate: "+data.wind.deg+"deg;'></i> "+data.wind.speed+" km/h");
        $("#visibilidadeVal").text(data.visibility/1000+" km");
        $("#nuvensVal").text(data.clouds.all+"%");
        $("#coordVal").empty();
        $("#coordVal").append("<b>"+data.coord.lat+", "+data.coord.lon+"</b>");

    });
}

// Informações de 6 cidades
var cidadesPredefinidas=["Porto", "Lisboa", "Chaves", "Faro", "Évora", "Coimbra"];
for(let i=0;i<cidadesPredefinidas.length;i++) {
    $.get("https://api.openweathermap.org/data/2.5/weather?q="+cidadesPredefinidas[i]+", PT&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
        $("#cidadesList").append('<div class="col"><div class="card"><div class="card-body d-flex justify-content-between align-items-center"><div><h5 class="card-title">'+cidadesPredefinidas[i]+'</h5><p class="card-text"><span class="temp-max">'+Math.floor(data.main.temp_max)+degreeSufix+'</span>/<span class="temp-min">'+Math.floor(data.main.temp_min)+degreeSufix+'</span></p></div> <img src="http://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png" /></div></div></div>');
    });
}

// Redirecionamento para página de detalhes
function detalhesRef() {
    window.location.href="./detalhes.html";
}


// Página de detalhes
$("#cityDetailsTitle").text("Meteorologia, hoje, "+localStorage.getItem("cityDetalhes"));

$.get("https://api.openweathermap.org/data/2.5/weather?q="+localStorage.getItem("cityDetalhes")+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
    console.log(data);
    let pontosCardiais=["N", "S", "O", "E", "NE", "NO", "SE", "SO"];
    let pontoCardialVento;
    let sunrise=new Date(data.sys.sunrise*1000);
    let sunset=new Date(data.sys.sunset*1000);

    $("#sunrise").text(sunrise.getHours()+":"+sunrise.getMinutes()+" "+arrayMeses[sunrise.getMonth()+1]+" "+sunrise.getDate());
    $("#sunset").text(sunset.getHours()+":"+sunset.getMinutes()+" "+arrayMeses[sunset.getMonth()+1]+" "+sunset.getDate());

    if(data.wind.deg==0 || data.wind.deg==360) {
        pontoCardialVento=pontosCardiais[0];
    } else if(data.wind.deg>0 && data.wind.deg<90) {
        pontoCardialVento=pontosCardiais[4];
    } else if(data.wind.deg==90) {
        pontoCardialVento=pontosCardiais[3];
    } else if(data.wind.deg>90 && data.wind.deg<180) {
        pontoCardialVento=pontosCardiais[6];
    } else if(data.wind.deg==180) {
        pontoCardialVento=pontosCardiais[1];
    } else if(data.wind.deg>180 && data.wind.deg<270) {
        pontoCardialVento=pontosCardiais[7];
    } else if(data.wind.deg==270) {
        pontoCardialVento=pontosCardiais[2];
    } else {
        pontoCardialVento=pontosCardiais[5];
    }

    $("#humidadeVal").text(data.main.humidity+"%");
    $("#pressaoVal").text(data.main.pressure+" hPa");
    $("#ventoVal").append("<b>"+pontoCardialVento+"</b><i class='fa-solid fa-arrow-up' style='rotate: "+data.wind.deg+"deg;'></i> "+data.wind.speed+" km/h");
    $("#visibilidadeVal").text(data.visibility/1000+" km");
    $("#nuvensVal").text(data.clouds.all+"%");
    $("#coordVal").append("<b>"+data.coord.lat+", "+data.coord.lon+"</b>");

});

// --------------------

// Página de forecast
// Forecast (Auto)
var diasSemana=["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function showRecordsPrev(day) {
    if($("#tablePrevisoes > tr").hasClass("data-bs-day-"+day)) {
        $(".data-bd-day-"+day).fadeIn();
    } else {
        $(".data-bd-day").fadeIn();
    }
    
}

$.get("https://api.openweathermap.org/data/2.5/forecast?q="+localStorage.getItem("cityDetalhes")+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
    for(let i=0;i<40;i++) {
        if(i>0)
            var dataAnt=new Date(data.list[i-1].dt*1000);
            
        var dataR=new Date(data.list[i].dt*1000);
        var proxData=new Date(data.list[i+1].dt*1000);
        var dataHj=new Date();
        console.log(dataR.getDate());
        console.log(diasSemana[dataR.getDay()]);

        if(i>0) {
            if(dataAnt.getDate()!=dataR.getDate()) {
                $("#weatherGroup").append('<div class="card card-weather me-4" onclick="showRecordsPrev('+dataR.getDate()+')"><h5 class="text-center mt-2">'+diasSemana[dataR.getDay()]+'</h5><p class="text-center">'+dataR.getDate()+" "+arrayMeses[dataR.getMonth()+1]+'</p><div class="text-center"><img src="http://openweathermap.org/img/wn/'+data.list[i].weather[0].icon+'@2x.png" class="card-img-top img-weather" alt="..."></div><div class="card-body"><p class="text-center"><span class="temp-max">'+Math.floor(data.list[i].main.temp_max)+degreeSufix+'</span>/<span class="temp-min">'+Math.floor(data.list[i].main.temp_min)+degreeSufix+'</span></p><p class="text-center">'+data.list[i].wind.speed+' km/h</p></div></div>');
            }
        } else {
            $("#weatherGroup").append('<div class="card card-weather me-4" onclick="showRecordsPrev('+dataR.getDate()+')"><h5 class="text-center mt-2">Hoje</h5><p class="text-center">'+dataR.getDate()+" "+arrayMeses[dataR.getMonth()+1]+'</p><div class="text-center"><img src="http://openweathermap.org/img/wn/'+data.list[i].weather[0].icon+'@2x.png" class="card-img-top img-weather" alt="..."></div><div class="card-body"><p class="text-center"><span class="temp-max">'+Math.floor(data.list[i].main.temp_max)+degreeSufix+'</span>/<span class="temp-min">'+Math.floor(data.list[i].main.temp_min)+degreeSufix+'</span></p><p class="text-center">'+data.list[i].wind.speed+' km/h</p></div></div>');
        }

        $("#tablePrevisoes").append('<tr class="data-bs-day-'+dataR.getDate()+'"><th scope="row">'+dataR.getHours()+':'+dataR.getMinutes()+'</th><td><img src="http://openweathermap.org/img/wn/'+data.list[i].weather[0].icon+'@2x.png" class="card-img-top img-weather" alt="..."></td><td>'+data.list[i].main.feels_like+' '+degreeSufix+'</td><td>'+data.list[i].weather[0].description+'</td><td>'+data.list[i].wind.speed+' km/h</td><td id=""></td></tr>');
        
        if(dataR.getDate()==dataHj.getDate()) {
            $(".data-bs-day-"+dataR.getDate()).fadeIn();
        } else {
            $(".data-bs-day-"+dataR.getDate()).fadeIn();
        }
    }
    console.log("Forecast");
    console.log(data);
});





// ---------------------
$("#fakeFav").hide();
// Listar favoritos
if(localStorage.getItem("favs")!=null) {
    arrayFavs=JSON.parse(localStorage.getItem("favs"));
    for(let i=0;i<arrayFavs.length;i++) {
        if(arrayFavs[i]==localStorage.getItem("cityDetalhes")) {
            $("#addFav").hide();
            $("#fakeFav").show();
        }

        $.get("https://api.openweathermap.org/data/2.5/weather?q="+arrayFavs[i]+"&lang="+localStorage.getItem("lang")+"&units="+localStorage.getItem("system-degrees")+"&appid="+apiKey, function(data, status) {
            $("#listFavoritos").append("<li class='list-group-item mb-4 d-flex justify-content-between align-items-center'><div class='ms-2 me-auto'><div class='fw-bold'>"+arrayFavs[i]+"</div><span class='temp-max'>"+Math.floor(data.main.temp_max)+" "+degreeSufix+"</span> / <span class='temp-min'>"+Math.floor(data.main.temp_min)+" "+degreeSufix+"</span></div><i class='fa-solid fa-arrow-up-right-from-square me-2' onclick='redirectFav(\""+arrayFavs[i]+"\")'></i><i class='fa-solid fa-circle-xmark' onclick='removeFav(\""+arrayFavs[i]+"\")'></i></li>");
        });
    }
}

// Adicionar favoritos

$("#addFav").click(function() {
    $(this).hide();
    $("#fakeFav").fadeIn();
    arrayFavs.push(localStorage.getItem("cityDetalhes"));
    localStorage.setItem("favs", JSON.stringify(arrayFavs));
});

// Remover favoritos
function removeFav(city) {
    var index=arrayFavs.indexOf(city);
    arrayFavs.splice(index, 1);
    localStorage.setItem("favs", JSON.stringify(arrayFavs));
    location.reload();
}

// Redirecionar do favorito
function redirectFav(city) {
    localStorage.setItem("cityDetalhes", city);
    window.location.href="./detalhes.html";
}