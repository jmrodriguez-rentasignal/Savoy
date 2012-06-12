<?php

  function loadObjects()
  {
      $buf="";
     $op=opendir("../objects");
     $k=0;
     while($curD=readdir($op))
     {
         if($curD!="." && $curD!="..")
         {
             if(is_file("../objects/$curD/".$curD."_Definition.php"))
             {
                 include_once("../objects/$curD/".$curD."_Definition.php");
                 global $objectDefinitions;
                 if($k>0)
                    $buf.=",";   
                 $buf.="'".$curD."':".json_encode($objectDefinitions[$curD]);
                 $k++;
             }
         }
     }  
     if($k==0)
        return "{}";
     return $buf;      
  }
  
  function loadPages()
  {
      include_once("../../Website.php");
      global $website;
      return json_encode($website);
  }
  

  echo "{objects:{";
  echo loadObjects();
  echo "},system:";
  echo loadPages();
  echo "}";
  
  
?>
