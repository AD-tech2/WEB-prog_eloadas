<?php
    //Adatbázis beállítása:
    header("Content-Type: application/json");
    //Ez csak a vite szerver miatt kell mert CORS hibát dob ha nincs benne!
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    require "Connect.php";

    function ReadInventors() {
        global $DatabaseAPI;
        $SQLstmnt = $DatabaseAPI->query("SELECT * FROM kutato");
        return $SQLstmnt->fetchAll();
    }

    function ReadSpecInventors($Column, $Value) {
        global $DatabaseAPI;
        $ConvertedColumn = "";
        switch ($Column) {
            case "születési dátum":
                $ConvertedColumn = "szul";
                break;
            case "halálozási dátum":
                $ConvertedColumn = "meghal";
                break;
            default:
                $ConvertedColumn = "nev";
                break;
        }
        try {
            $SQLstmnt = $DatabaseAPI->prepare("SELECT * FROM kutato WHERE $ConvertedColumn LIKE ?");
            $SQLstmnt->execute(["%$Value%"]);
            return $SQLstmnt->fetchAll();
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    function CreateInventor($NewInventor) {
        global $DatabaseAPI;
        try {
            $SQLstmnt = $DatabaseAPI->prepare("INSERT INTO kutato(nev, szul, meghal) VALUES (?,?,?)");
            $SQLstmnt->execute([
                $NewInventor["Name"],
                $NewInventor["Born"],
                $NewInventor["Died"]
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
                $NewAttributes["Died"],
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
            if(isset($_GET) && isset($_GET["Spec"])) {
                try {
                    $Data = json_decode($_GET["Spec"], true);
                    echo json_encode([
                        "Fail" => false,
                        "Records" => ReadSpecInventors($Data["Column"], $Data["Value"])
                    ]);
                } catch(Exception $e) {
                    echo json_encode([
                        "Fail" => true
                    ]);
                    //file_put_contents(__DIR__."/error.log", "SpecGET: ".$e->getMessage()."\n", FILE_APPEND);
                }
            }
            else {
                try {
                    echo json_encode([
                        "Fail" => false,
                        "Records" => ReadInventors()
                    ]);
                    //file_put_contents(__DIR__."/debug.log", "Natural GET\n", FILE_APPEND);
                } catch(Exception $e) {
                    echo json_encode([
                        "Fail" => true
                    ]);
                    file_put_contents(__DIR__."/error.log", "GET: ".$e->getMessage()."\n", FILE_APPEND);
                }
            }
            break;
        case "POST":
            try {
                $Data = json_decode(file_get_contents("php://input"), true);
                CreateInventor($Data["Record"]);
                echo json_encode([
                    "Fail" => false
                ]);
            } catch(Exception $e) {
                echo json_encode([
                    "Fail" => true
                ]);
                file_put_contents(__DIR__."/error.log", "CREATE: ".$e->getMessage()."\n", FILE_APPEND);
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
                DeleteInventor($Data["Id"]);
                echo json_encode([
                    "Fail" => false
                ]);
            } catch(Exception $e) {
                echo json_encode([
                    "Fail" => true
                ]);
                file_put_contents(__DIR__."/error.log", "DELETE: ".$e->getMessage()."\n", FILE_APPEND);
            }
            break;
        default:
            //Ha nincs talált methode akkor egyszerűen hiba üzenet minden más kérelemre!
            echo json_encode([
                "Fail" => true
            ]);
            file_put_contents(__DIR__."/error.log", "Unknown request:\n", FILE_APPEND);
            break;
    }
?>