<?php
    require_once('connect.php');

    $result_of_query = pg_query("
    SELECT 
        object_date, 
        object_location, 
        object_description,
        ST_AsGeoJSON(wsp) as wsp,
        object_image,
        object_id 
        FROM 
        public.aktualnosci");

    $tablica=pg_fetch_all($result_of_query);

    // print_r($tablica);

    $tablica_na_geoJSOn=[];
    foreach($tablica AS $wiersz){
        $wiersz['wsp']=json_decode($wiersz['wsp']);
       
        $feature_GEOJSON = [
            "type"=>"Feature",
            "geometry"=>$wiersz['wsp'],
            "description"=>$wiersz['object_description'],
            "date"=>$wiersz['object_date'],
            "location"=>$wiersz['object_location'],
            "image"=>$wiersz['object_image'],
            "id"=>$wiersz['object_id'],
        ];
        array_push($tablica_na_geoJSOn,$feature_GEOJSON);
    }
    $tablica_na_kolekcje_obiektow = [
        "type"=>"FeatureCollection",
        "features"=>$tablica_na_geoJSOn,
    ];
    echo json_encode($tablica_na_kolekcje_obiektow);
    pg_close($polaczenie);

?>
