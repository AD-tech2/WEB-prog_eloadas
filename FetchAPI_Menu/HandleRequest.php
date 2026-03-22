<?php
    //Adatbázis beállítása:
    header("Content-Type: application/json");
    require "./Connect.php";

    function ReadInventors() {
        global $DatabaseAPI;
        $SQLstmnt = $DatabaseAPI->query("SELECT * FROM kutato");
        return $SQLstmnt->fetchAll();
    }

    function CreateInventor($NewInventor) {
        global $DatabaseAPI;
        $SQLstmnt = $DatabaseAPI->prepare("INSERT INTO kutato(nev, szul, meghal) VALUES (?,?,?)");
        $SQLstmnt->execute(
            $NewInventor["Name"],
            $NewInventor["Born"],
            $NewInventor["Died"]
        );
    }

    function UpdateInventor($Id, $NewAttributes) {
        global $DatabaseAPI;
        $SQLstmnt = $DatabaseAPI->prepare("UPDATE kutato SET nev = ? szul = ? meghal = ? WHERE fkod = ?");
        $SQLstmnt->execute(
            $NewAttributes["Name"],
            $NewAttributes["Born"],
            $NewAttributes["Died"],
            $Id
        );
    }
    function DeleteInventor($Id) {
        global $DatabaseAPI;
        $SQLstmnt = $DatabaseAPI->prepare("DELETE FROM kutato WHERE fkod = ?");
        $SQLstmnt->execute($Id);
    }
    
    /*Methode szerint feldolgozás
      - GET ===> READ kérelem
      - POST ===> CREATE kérelem
      - PUT ===> UPDATE kérelem
      - DELETE => Törlés kérelem
    */

    $RequestType = $_SERVER["REQUEST_METHOD"];
    switch ($RequestType) {
        case "GET":
            try {
                echo json_encode([
                    "Fail" => false,
                    "Records" => ReadInventors()
                ]);
            } catch(Exception $e) {
                echo json_encode([
                    "Fail" => true
                ]);
            }
            break;
        case "POST":
            try {
                $Data = json_decode(file_get_contents("php://input", true));
                CreateInventor($Data["Record"]);
                echo json_encode([
                    "Fail" => false
                ]);
            } catch(Exception $e) {
                echo json_encode([
                    "Fail" => true
                ]);
            }
            break;
        case "PUT":
            try {
                $Data = json_decode(file_get_contents("php://input", true));
                UpdateInventor($Data["Id"], $Data["UpdateToThis"]);
                echo json_encode([
                    "Fail" => false
                ]);
            } catch(Exception $e) {
                echo json_encode([
                    "Fail" => true
                ]);
            }
            break;
        case "DELETE":
            try {
                $Data = json_decode(file_get_contents("php://input", true));
                DeleteInventor($Data["Id"]);
                echo json_encode([
                    "Fail" => false
                ]);
            } catch(Exception $e) {
                echo json_encode([
                    "Fail" => true
                ]);
            }
            break;
        default:
            //Ha nincs talált methode akkor egyszerűen hiba üzenet minden más kérelemre!
            echo json_encode([
                "Fail" => true
            ]);
            break;
    }
?>