<?php 

include_once('conexao.php');

$postjson = json_decode(file_get_contents("php://input"), true);

 $query = $pdo->prepare("UPDATE turismo SET cidade = :cidade, estado = :estado, transporte = :transporte WHERE id = :id ");
  
       $query->bindValue(":cidade", $postjson['cidade']);
       $query->bindValue(":estado", $postjson['estado']);
       $query->bindValue(":transporte", $postjson['transporte']);
       $query->bindValue(":id", $postjson['id']);
      
       $query->execute();
  
             
  
      if($query){
        $result = json_encode(array('success'=>true));
  
        }else{
        $result = json_encode(array('success'=>false));
    
        }
     echo $result;


?>

