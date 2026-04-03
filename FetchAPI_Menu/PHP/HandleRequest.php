<?php
    //Adatbázis beállítása:
    header("Content-Type: application/json");
    require "Connect.php";

    function ReadInventors() {
        global $DatabaseAPI;
        $SQLstmnt = $DatabaseAPI->query("SELECT * FROM kutato");
        return $SQLstmnt->fetchAll();
    }

    function CreateInventor($NewInventor) {
        global $DatabaseAPI;
        //file_put_contents(__DIR__."/debug.log", "CREATE: ".print_r(empty($NewInventor["Died"]) ? null : $NewInventor["Died"], true)."\n", FILE_APPEND);
        try {
            $SQLstmnt = $DatabaseAPI->prepare("INSERT INTO kutato(nev, szul, meghal) VALUES (?,?,?)");
            $SQLstmnt->execute([
                $NewInventor["Name"],
                $NewInventor["Born"],
                empty($NewInventor["Died"]) ? null : $NewInventor["Died"]
            ]);
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    function UpdateInventor($Id, $NewAttributes) {
        global $DatabaseAPI;
        try {
            $SQLstmnt = $DatabaseAPI->prepare("UPDATE kutato SET nev = ?, szul = ?, meghal = ? WHERE fkod = ?");
            $SQLstmnt->execute([
                $NewAttributes["Name"],
                $NewAttributes["Born"],
                empty($NewAttributes["Died"]) ? null : $NewAttributes["Died"],
                $Id
            ]);
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
    function DeleteInventor($Id) {
        global $DatabaseAPI;
        try {
            $SQLstmnt = $DatabaseAPI->prepare("DELETE FROM kutato WHERE fkod = ?");
            $SQLstmnt->execute([$Id]);
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
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
                $Data = json_decode(file_get_contents("php://input"), true);
                CreateInventor($Data);
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
                $Data = json_decode(file_get_contents("php://input"), true);
                UpdateInventor($Data["Id"], $Data["ToThis"]);
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
                $Data = json_decode(file_get_contents("php://input"), true);
                DeleteInventor($Data);
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