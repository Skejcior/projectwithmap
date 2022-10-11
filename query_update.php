<?php

$hostname = "localhost";
$dbname = "postgres";
$username = "postgres";
$pass = "X15755746x";

// Create connection
$db_conn = pg_connect(" host = $hostname dbname = $dbname 
user = $username password = $pass ");

if (isset($_POST['button'])) {
    $object_id = $_POST['$object_id'];
    $object_date = $_POST['$object_date'];
    $object_location = $_POST['$object_location'];
    $object_description = $_POST['$object_description'];
    $object_image = $_POST['$object_image'];

    $query = pg_query($db_conn, "UPDATE aktualnosci SET object_date = '$object_date', object_location = '$object_location', object_description = '$object_description',
    object_image = '$object_image' WHERE object_id = '$object_id';");
    if ( $query ) {
        echo  "Record Successfully Added!";
    }};
?>