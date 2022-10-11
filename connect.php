<?php

    require_once('database.php');
    $conn_tekst=
    "host=".$db_host.
    " port=".$db_port.
    " dbname=".$db_name.
    " user=".$db_user.
    " password=".$db_pass;
    $polaczenie=pg_connect("$conn_tekst");

    $stat = pg_connection_status($polaczenie);
    if ($stat !== PGSQL_CONNECTION_OK) {
        echo 'Connection status bad';
        }
    ?>