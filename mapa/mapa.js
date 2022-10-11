$(document).ready(function () {
  let mymap = L.map("mymap", { center: [49.25, 19.95], zoom: 12 });  
  let adresOSM = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  // dodanie własnych danych
  let staw = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/staw/wms", {
    layers: "staw:staw",
    format: "image/png",
    transparent: "true",
    version: "1.1.1",
  });
  //dodaje własą kompozycję z geoservera
  let nosal = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/nosal/wms", {
    layers: "nosal:nosal",
    format: "image/png",
    transparent: "true",
    version: "1.1.1",
  });
  //dodaje własą kompozycję z geoservera
  let staroro = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/staroro/wms", {
    layers: "staroro:staroro",
    format: "image/png",
    transparent: "true",
    version: "1.1.1",
  });
  //dodaje własą kompozycję z geoservera
  let wierch = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/wierch/wms", {
    layers: "wierch:wierch",
    format: "image/png",
    transparent: "true",
    version: "1.1.1",
  });
  // obsługa warstw
  let baseMaps = {
    "dane z OSM": adresOSM,
  };
  let overlays = {
    "Czarny staw": staw,
    "Nosal": nosal,
    "Wołowiec": wierch,
    "Starorobociański": staroro
  };
  L.control.layers(baseMaps, overlays).addTo(mymap);
  mymap.addLayer(adresOSM); 
  // obsługa modala do dodawania
  //okodowanie onclicka na mapie
  let lat;
  let lng;
  mymap.on('click',(event)=>{
    lat = event.latlng.lat;
    lng = event.latlng.lng;
    $("#object_lat").val(lat);
    $("#object_lng").val(lng);
  });
  // okodowanie guzika który ma otwierać modala
  $("#button_open_modal").click(() => {
    $(".modalBox").show();
  });
  // okodowanie guzika który ma zamykać modal
  $(".button_close_modal").click(() => {
    $(".modalBox").hide();
    $(".modalBox_edit").hide();
    $(".modalBox_delete").hide();
  });
  // okodowanie guzika który ma otwierać modala
  $(".guzik").click(() => {
    $(".modalBox_delete").show();
  });
       // okodowanie dodania do listy w pamięci
       $("#data_save").on("click", function (event) {
        adres = window.location.href;
        event.preventDefault();
        $.ajax({
          url: "../query_insert.php",
          type: "POST",
         data: {button:1, $object_date:$("#object_date").val(),
         button:2,$object_location:$("#object_location").val(),
         button:3,$object_description:$("#object_description").val(),
         button:4,$object_lat:$("#object_lat").val(),
         $object_lng:$("#object_lng").val(),
         button:5,$object_image:$("#object_image").val()
        },
    
          success: function (data) {
            console.log("poszło");
          },
        });      
        window.location.assign(adres);
  });
  // okodowanie dodania do listy w pamięci
  $("#delete_save").on("click", function (event) {
    adres = window.location.href;
    event.preventDefault();
    $.ajax({
      url: "../query_delete.php",
      type: "POST",
     data: {button:1, $object_id:$("#object_id_delete").val()
    },
      success: function (data) {
        console.log(data);
      },
    });
    window.location.assign(adres);
});
  // lokalizacja
  // mymap.locate({setView:true, maxZoom:10});

  function nazwaFunkcji(param){
    return parametr+2;
  }
  function onLocationFound(e){
    let radius = e.accuracy /2;
    L.marker(e.latlng)
      .addTo(mymap)
      .bindPopup(`Znajdujesz sie w promieniu ${radius} metrów w od tego punktu`
      )
      .openPopup();
  }
  function onLocationError(e){
    alert(e.message);
  }
  mymap.on('locationerror', onLocationError);
  mymap.on('locationfound', onLocationFound);
  let layer_group;
  let filtered = [];
  // generowanie listy wszystkich dat
  let raw_marker_list = [];
  let dane = [];
  // generowanie listy na podstawie surowych danych
    $.ajax({
      url: "../query_load.php",
      success: function (response) {
        let a = JSON.parse(response);
        for (let i in a.features) {
          dane.push({
            id: a.features[i].id,
            date: a.features[i].date,
            latitude: a.features[i].geometry.coordinates[1],
            longitude: a.features[i].geometry.coordinates[0],
            location: a.features[i].location,
            description: a.features[i].description,
            image: a.features[i].image
          });
          $("#lista").append(
          // generowanie listy
          `<div class='item'>
            <div><span class='grubas'>Data: </span>${a.features[i].date}
            <span style='float:right'  class='textid'> ${a.features[i].id}</span></div>
            <div><span class='grubas'>Lokalizacja: </span>${a.features[i].location}</div>
            <div><span class='grubas'>Opis: </span>${a.features[i].description}<div>
            <a href='#' class='link_open_modal' id=${a.features[i].id}>Edytuj pinezke</a>
          </div>`
           );
    // generowanie markerów
    raw_marker_list.push(
      L.circle([a.features[i].geometry.coordinates[1], a.features[i].geometry.coordinates[0]],{radius: 20}).bindPopup(
        `${a.features[i].description}<br>${a.features[i].image}`
      )
    );
  };
   daty = [...new Set(dane.map((item) => item.date))];
let zmienna_na_THIS;
 // obsługa modala do efdycji
 $('.link_open_modal').click(function(){
  $('.modalBox_edit').show();
  zmienna_na_THIS = this.id;
  // filtorniwa z danych z którego uzyskujemy tablie z danymi, które chcemy edytować
  wynik_filtrowania_do_edycji = 
  dane.filter(function(item){
    return item.id==zmienna_na_THIS;
  });
  // to jest wpisanie przefiltrowanych danych do modala (formularz)
  $("#object_id_edit").val(wynik_filtrowania_do_edycji[0].id);
  $("#object_date_edit").val(wynik_filtrowania_do_edycji[0].date);
  $("#object_location_edit").val(wynik_filtrowania_do_edycji[0].location);
  $("#object_description_edit").val(
    wynik_filtrowania_do_edycji[0].description
  );
  $("#object_image_edit").val(
    wynik_filtrowania_do_edycji[0].image
  );
// nadpisywanie danych w zmiennej dane
$('#save_edits').click(function(event){
  adres = window.location.href;
  event.preventDefault();
  $.ajax({
    url: "../query_update.php",
    type: "POST",
   data: {button:1, $object_id:$("#object_id_edit").val(),
   button:2, $object_date:$("#object_date_edit").val(),
   button:3,$object_location:$("#object_location_edit").val(),
   button:4,$object_description:$("#object_description_edit").val(),
   button:5,$object_description:$("#object_description_edit").val(),
   button:6,$object_image:$("#object_image_edit").val()
  },
    success: function (data) {
      console.log(data);
    },
  });
  window.location.assign(adres);
  });
});
  layer_group?.removeFrom(mymap);
  layer_group = L.layerGroup(raw_marker_list);
  layer_group.addTo(mymap);
  // koniec generowania listy na podstawie danych
  // Generowanie listy z wyfiltrowanych danych
  // najpierw obsługa slidera
  $("#myRange").replaceWith(
    `<input type="range" min="1" max=${daty.length} value="10" class="slider" id="myRange"/>`
  );

  //poniżej obsługa zdarzenia gdy slider ulegnie zmianie

  $("#myRange").change((event) => {
    // filtrowanie danych z warunkiem daty
    filtered = dane.filter(function (pojedyncza_dana) {
      return pojedyncza_dana.date == daty[event.target.value];
    });
    let marker_list = [];
    // petla przez dane przefiltrowane
    $("#lista").empty(); // opróżnienie listy
    for (let item in filtered) {
      $("#lista").append(
        // generowanie listy
        `<div class='item'>
         <div><span class='grubas'>Data: </span>${filtered[item].date}
         <span style='float:right'  class='textid'> ${filtered[item].id}</span></div>
         <div><span class='grubas'>Lokalizacja: </span>${filtered[item].location}</div>
         <div><span class='grubas'>Opis: </span>${filtered[item].description}<div>
         <a href='#' class='link_open_modal' id=${filtered[item].id} >Edytuj pinezke</a>
         </div>`
      );
      // generowanie markerów
      marker_list.push(
        L.circle([filtered[item].latitude, filtered[item].longitude]).bindPopup(
          `${filtered[item].description}`
        )
      );
    } //tu się kończy pętla generująca element listy oraz listę marerów z filtrowanych danych
    layer_group?.removeFrom(mymap);
    layer_group = L.layerGroup(marker_list);
    layer_group.addTo(mymap);
  }); // koniec Generowanie listy z wyfiltrowanych danych
    }}
  )}
);