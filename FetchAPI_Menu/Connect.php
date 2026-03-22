<?php
    //Adatbázis metaadatok:
    $Host = "localhost";
    $DatabaseName = "feltalalok";
    $User = "root";
    $PassCode = "";

    $DatabaseAPI = null;

    //Csatlakozás:
    try {
        $DatabaseAPI = new PDO("mysql:host=$Host;dbname=$DatabaseName;charset=UTF8", $User, $PassCode, 
        [PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    } catch(Exception $e) {
        //Azonnali leállítás ha exception van:
        echo json_encode(["Fail" => true]);
        die("Database Connection Failed!".$e->getMessage());
    }
?>