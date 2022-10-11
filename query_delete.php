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

    $query = pg_query($db_conn, "DELETE FROM aktualnosci
    WHERE object_id = '$object_id';");
    if ( $query ) {
        echo  "Record Successfully Added!";
    }};

?>