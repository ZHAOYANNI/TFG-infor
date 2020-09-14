<?php 
    include("../connection.php");
    $data = json_decode(file_get_contents("php://input"));
    
    $username = $data->username;

    $stm = $db->prepare("SELECT * FROM user_company_acction WHERE user_name='$username'");
    $stm->execute();
    $result = $stm->setFetchMode(PDO::FETCH_ASSOC);
    $userInfor = $stm->fetchAll();

    echo json_encode($userInfor);
?>