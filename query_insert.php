<?php

$hostname = "localhost";
$dbname = "postgres";
$username = "postgres";
$pass = "X15755746x";

// Create connection
$db_conn = pg_connect(" host = $hostname dbname = $dbname 
user = $username password = $pass ");

if (isset($_POST['button'])) {
    $object_date = $_POST['$object_date'];
    $object_location = $_POST['$object_location'];
    $object_description = $_POST['$object_description'];
    $object_lat = $_POST['$object_lat'];
    $object_lng = $_POST['$object_lng'];
    $object_image = $_POST['$object_image'];

    $query = pg_query($db_conn, "INSERT  INTO aktualnosci
    VALUES ('$object_date','$object_location','$object_description','POINT($object_lng $object_lat)','$object_image');");
    if ( $query ) {
        echo  "Record Successfully Added!";
    }};
?>