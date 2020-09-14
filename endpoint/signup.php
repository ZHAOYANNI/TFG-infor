<?php 
    include("../connection.php");
    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $password = $data->password;
    $email = $data->email;
    
    $query = $db->prepare("SELECT user_name FROM user_data WHERE user_name='$username'");
    $query->execute();
    $result = $query->setFetchMode(PDO::FETCH_ASSOC);
    $userInfor = $query->fetchAll();
    if(count($userInfor) != 0){
        echo "ERROR";
    }
    else{
        $q = "INSERT INTO user_data (user_name, user_password, user_email) VALUES (:user_name, :user_password, :user_email)";
    
        $query = $db->prepare($q);
        $execute = $query->execute(array(
            ':user_name'=>$username,
            ':user_password'=>$password,
            ':user_email'=>$email,
        ));
        echo $username;
    }



?>