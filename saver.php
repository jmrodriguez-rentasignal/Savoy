<?php
  $saveNode=$_POST["nodeType"];
  switch($saveNode)
  {
     case "OBJECT":
     {
        $name=$_POST["nodeName"];
        $data=json_decode($_POST["data"],true);
        $buf="<?php\nglobal \$objectDefinitions;\n";
        $buf.="\$objectDefinitions[\"".$name."\"]=".var_export($data,true);
        $buf.=";\n\n?>";
        $dir="../objects/".$name;
        @mkdir($dir,0777 ,true); 
        file_put_contents($dir."/Definition.php",$buf); 
     }break;
  }
?>
