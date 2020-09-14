<?php 
    include("../connection.php");
    $data = json_decode(file_get_contents("php://input"));
    
    $username = $data->username;
    $password = $data->password;

    $stm = $db->prepare("SELECT user_name FROM user_data WHERE user_name='$username' AND 
    user_password='$password'");
    $stm->execute();
    $result = $stm->setFetchMode(PDO::FETCH_ASSOC);
    $userInfor = $stm->fetchAll();
    if(count($userInfor) === 1){
        echo $username;
    }
    else{
        echo "ERROR";
    }
?>