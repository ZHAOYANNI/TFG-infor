<?php 
    include("../connection.php");
    $data = json_decode(file_get_contents("php://input"));
    
    $username = $data->username;
    $company = $data->company;
    $base = $data->base;
    $numAction = $data->acction;

    $stm = $db->prepare("UPDATE user_company_acction SET number_acction='$numAction', base='$base' WHERE user_name='$username' AND company='$company'");
    $stm->execute();
    echo $stm->rowCount() . " records UPDATED successfully";
?>