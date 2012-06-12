<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Expires" content="Fri, Jan 01 1900 00:00:00 GMT">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Lang" content="en">
<meta name="author" content="">
<meta http-equiv="Reply-to" content="@.com">
<meta name="generator" content="PhpED 5.8">
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="creation-date" content="01/01/2009">
<meta name="revisit-after" content="15 days">
<title>Untitled</title>
<link rel="stylesheet" type="text/css" href="my.css">
<style type="text/css">
body {font-family:Arial}
body {font-size:12px}
.CONTAINER_container {background-color:#E0E0E0;margin-left:10px}
.CONTAINER_container > .label {padding:3px;background-color:#F0F0F0;border-bottom:2px solid #AAAAAA;font-weight:bold}
.STRING_container > .label {float:left;padding-top:5px;margin-right:5px;}
.Type_container {clear:both;margin-bottom:5px}
.contents_hidden {display:none}
.type_contents {padding:5px 30px;background-color:#F5F5F5}
.expandButton {width:16px;height:16px;float:left;background-image:url('images/open.png')}
.contractButton {width:16px;height:16px;float:left;background-image:url('images/close.png')}

.SELECTOR_container .label {float:left}
.SELECTOR_container .type_contents {padding:0px;border:0px;}
.newitem .STRING_container  .type_contents {border:0px;padding:2px}
.newitem .STRING_container * {font-size:10px}
.Type_dictionary_key {clear:both}
.Type_dictionary_key .title {float:left}
.Type_dictionary_key .content {float:left;white-space:nowrap;margin-left:5px}
.DICTIONARY > .type_contents {border:1px solid #AAAAAA}

.deleteButton {background-image:url('images/delete.png');width:20px;height:20px;}
.doClear {clear:both}

</style>
<script src="js/IDE_inputs.js">
</script>
<script>
IDE.types.definitions={
    "ROOT":{
        "TYPE":"CONTAINER",
        "FIELDS":{
            "userProfiles":{"TYPE":"ARRAY","LABEL":"Perfiles de usuario"},
            "objects":{"TYPE":"DICTIONARY","LABEL":"Objetos","VALUETYPE":{"TYPE":"OBJECTMODEL"}}      
        }
    },
    "OBJECTMODEL":{
        "TYPE":"CONTAINER",
        "FIELDS":{
            "INDEXFIELD":{"TYPE":"_STRING","LABEL":"Campo Indice","DESC":"Campo indice (autoincremental) del objeto"},
            "FIELDS":{"TYPE":"DICTIONARY","DISPLAY":"2COLUMNS","LABEL":"Campos","DESC":"Campos del objeto","VALUETYPE":{"TYPE":"FIELDTYPE"}},
            "OWNERSHIP":{"TYPE":"KEYREFERENCE","LABEL":"Campo de propiedad","KEYSOURCE":"../FIELDS","DESC":"Campo a partir del cual derivar la propiedad de este objeto.Puede ser una relacion con la tabla de usuarios."},
            "PERMISSIONS":{"TYPE":"ARRAY","LABEL":"Permisos","DESC":"Nombres de permisos asignables a los distintos estados del objeto"},
            "DEFAULT_PERMISSIONS":{"TYPE":"DICTIONARY","SOURCE":"/userProfiles","LABEL":"Permisos por defecto","DESC":"Permisos por defecto de los distintos tipos de usuario","VALUETYPE":{"TYPE":"PERMISSION_SPEC2"}},
            "STATES":{"TYPE":"CONTAINER","LABEL":"Estados del objeto","DESC":"Descripcion de la maquina de estados que gobierna este objeto",
                      "FIELDS":{
                        "FIELD":{"TYPE":"KEYREFERENCE","LABEL":"Campo de estado","KEYSOURCE":"../../FIELDS"},
                        "STATES":{"TYPE":"DICTIONARY","LABEL":"Estados","VALUETYPE":{"TYPE":"STATE_SPEC"}}                   
                        
                      }
            }
        }
    },
    "FIELDTYPE":{
        "TYPE":"TYPESWITCH",
        "TYPE_FIELD":"TYPE",
        "ALLOWED_TYPES":[
            {"TYPE":"ID","LABEL":"Identificador"},
            {"TYPE":"UUID","LABEL":"Identificador uuid"},
            {"TYPE":"STRING","LABEL":"Cadena"},
            {"TYPE":"TEXT","LABEL":"Texto"},
            {"TYPE":"INT","LABEL":"Entero"},
            {"TYPE":"BOOL","LABEL":"Booleano"},
            {"TYPE":"STATUS","LABEL":"Estado"},
            {"TYPE":"DATETIME","LABEL":"Fecha"},
            {"TYPE":"FLOAT","LABEL":"Punto flotante"},           
            {"TYPE":"CSV","LABEL":"Valores separados por comas"},
            {"TYPE":"RELATIONSHIP_ALIAS","LABEL":"Campo alias"},
            {"TYPE":"RELATIONSHIP","LABEL":"Relacion"},
            {"TYPE":"EXTERNAL_ALIAS","LABEL":"Relacion externa"}
        ]
    },
    "ID":{"LABEL:":"Identificador", "TYPE":"CONTAINER","FIELDS":{"LENGTH":{"TYPE":"_STRING","LABEL":"Longitud","DEFAULT":"8"}}},
    
    "UUID":{"TYPE":"CONTAINER","FIELDS":{},"LABEL":"<i>Sin propiedades adicionales</i>"},
    
    "STRING":{"LABEL":"Cadena","TYPE":"CONTAINER",
              "FIELDS":{
                  "MINLENGTH":{
                            "TYPE":"_STRING",
                            "LABEL":"Longitud minima",
                            "REQUIRED":"n"
                      
                  },
                  "MAXLENGTH":{
                                "TYPE":"_STRING",
                                "LABEL":"Longitud maxima",
                                "REQUIRED":"y",
                                "DEFAULT":"15"},
                  "REGEXP":{
                            "TYPE":"_STRING",
                            "LABEL":"Expresion regular",
                            "REQUIRED":"n"
                            }
                       }
             },    
    "INT":{"LABEL":"Entero","TYPE":"CONTAINER",
           "FIELDS":
           {
               "MIN":{"TYPE":"_STRING",
                      "LABEL":"Minimo",
                      "REQUIRED":"n"},
               "MAX":{"TYPE":"_STRING",
                      "LABEL":"Maximo",
                      "REQUIRED":"y"
                      },
               "DEFAULT":{"TYPE":"_STRING",
                          "LABEL":"Valor por defecto",
                          "REQUIRED":"n"
                          }
           }
    },
    "BOOL":{
            "LABEL":"Booleano",
            "TYPE":"CONTAINER",
            "FIELDS":
            {
                "DEFAULT":{
                    "TYPE":"BOOLEAN",
                    "LABEL":"Por defecto"                    
                    }
            }
    },
    "STATUS":{"LABEL":"Estado",
              "TYPE":"CONTAINER",
              "FIELDS":
              {
                  "DEFAULT":
                    {"TYPE":"KEYREFERENCE",
                    "KEYSOURCE":"../../../STATES/STATES",
                    "LABEL":"Valor por defecto",
                    "REQUIRED":"y"
                    }
              }
    },
    "DATETIME":{"LABEL":"Fecha",
                "TYPE":"CONTAINER",
                "FIELDS":
                {
                    "STRICTLY_FUTURE":{
                        "TYPE":"BOOLEAN",
                        "LABEL":"Futura",
                        "HELP":"A true significa que la fecha debe ser futura"},
                    "REQUIRED":{
                        "TYPE":"BOOLEAN",
                        "LABEL":"Requerido",
                        "DEFAULT":"false"
                    }
                }
    },
    "FLOAT":{"LABEL":"Decimal","TYPE":"CONTAINER",
            "FIELDS":{
                "INTEGER":{"LABEL":"Digitos enteros",
                           "TYPE":"_STRING",
                           "HELP":"Numero de digitos en la parte entera",
                           "REQUIRED":"y"
                },
                "DECIMAL":{"LABEL":"Digitos decimales",
                           "TYPE":"_STRING",
                           "HELP":"Numero de digitos de la parte decimal",
                           "REQUIRED":"y"
                           
                },
                "DEFAULT":{"LABEL":"Valor por defecto",
                            "TYPE":"_STRING"},
                "REQUIRED":{"LABEL":"Requerido",
                             "TYPE":"BOOLEAN",
                             "DEFAULT":"FALSE"
                            }
                
            }
    },
    "CSV":{"LABEL":"Valores separados por comas",
            "TYPE":"CONTAINER",
            "FIELDS":{
                "REQUIRED":{
                    "LABEL":"Requerido",
                    "TYPE":"BOOLEAN",
                    "DEFAULT":"FALSE"
                },
                "DEFAULT":{
                    "LABEL":"Valor por defecto",
                    "TYPE":"_STRING"
                }
            }
           
    },    
    
    "RELATIONSHIP_ALIAS":
        {"LABEL":"Alias",
         "TYPE":"CONTAINER",
         "FIELDS":{
             "OBJECT":{
                 "TYPE":"KEYREFERENCE",
                 "KEYSOURCE":"/objects",
                 "LABEL":"Objeto",
                 "REQUIRED":"y"
             },
             "FIELD":{
                 "TYPE":"KEYREFERENCE",
                 "KEYSOURCE":"../..",
                 "LABEL":"Campo local",
                 "REQUIRED":"y"
             }
             
         }
        }, 
    "RELATIONSHIP":{"LABEL":"Relacion",
                    "TYPE":"CONTAINER",
                    "FIELDS":{
                        "OBJECT":{
                           "TYPE":"KEYREFERENCE",
                           "KEYSOURCE":"/objects",
                           "LABEL":"Objeto",
                           "REQUIRED":"y"
                           },
                           "FIELD":{
                           "TYPE":"KEYREFERENCE",
                           "KEYSOURCE":"/objects/@../OBJECT@/FIELDS/",
                           "LABEL":"Campo remoto",
                           "REQUIRED":"y"
                           }                        
                    }
    },
    "EXTERNAL_ALIAS":{"LABEL":"Temp","TYPE":"STRING"},      
    
    "STATE_SPEC":{
        "TYPE":"CONTAINER",
        "LABEL":"Especificacion de estado",
        "FIELDS":{
            "LABEL":{"TYPE":"STRING","LABEL":"Nombre del estado"},
            "CALLBACKS":{"TYPE":"CONTAINER","LABEL":"Eventos generados",
                        "FIELDS":{
                            "ON_ENTER":{"TYPE":"OBJECTARRAY",
                                        "VALUETYPE":{"TYPE":"CALLBACK_SPEC"},
                                        "LABEL":"Eventos de entrada",
                                        "DESC":"Objeto/metodo a llamar al entrar en este estado"                                
                                       },
                            "ON_LEAVE":{"TYPE":"OBJECTARRAY",
                                        "VALUETYPE":{"TYPE":"CALLBACK_SPEC"},
                                        "LABEL":"Eventos de salida",
                                        "DESC":"Objeto/metodo a llamar al salir de este estado"}
                        }
                        },
            "ALLOWED_TRANSITIONS":{"TYPE":"ARRAY","SOURCE":"../..","LABEL":"Transiciones permitidas","DESC":"Estados a los que puede ir un objeto que se encuentre en este estado"},
            "PERMISSIONS":{"TYPE":"DICTIONARY","SOURCE":"/userProfiles","VALUETYPE":{"TYPE":"PERMISSION_SPEC"},"LABEL":"Permisos","DESC":"Permisos agregados/eliminados de los permisos por defecto, a cada perfil de usuario, cuando el objeto se encuentra en este estado."}
        }
    },
    "PERMISSION_SPEC":{
        "TYPE":"CONTAINER",
        "LABEL":"",
        "FIELDS":{
            "ALLOW":{"TYPE":"ARRAY","SOURCE":"../../../PERMISSIONS","LABEL":"Permitir","DESC":"Permisos agregados para este perfil de usuario"},
            "DENY":{"TYPE":"ARRAY","SOURCE":"../../../PERMISSIONS","LABEL":"Denegar","DESC":"Permisos denegados a este perfil de usuario"}
        }
    },
    "PERMISSION_SPEC2":{
        "TYPE":"CONTAINER",
        "LABEL":"",
        "FIELDS":{
            "ALLOW":{"TYPE":"ARRAY","SOURCE":"../../../PERMISSIONS","LABEL":"Permitir","DESC":"Permisos agregados para este perfil de usuario"},
            "DENY":{"TYPE":"ARRAY","SOURCE":"../../../PERMISSIONS","LABEL":"Denegar","DESC":"Permisos denegados a este perfil de usuario"}
        }
    },
    "CALLBACK_SPEC":{
        "TYPE":"CONTAINER",
        "LABEL":"",
        "FIELDS":{
            "OBJECT":{"TYPE":"STRING","LABEL":"Objeto"},
            "METHOD":{"TYPE":"STRING","LABEL":"Metodo"}
        }
    }
    
};
/*
IDE.types.definitions={
    "SOURCE1":{"TYPE":"ARRAY","LABEL":"Origen 1"},
    "SOURCE2":{"TYPE":"DICTIONARY","LABEL":"Origen2","VALUETYPE":{"TYPE":"DBLSTDSTRING"}},
    "VALUE":{
        "LABEL":"VALOR",
        "TYPE":"CONTAINER",
        "FIELDS":{
            "REF1":{"TYPE":"ARRAY","LABEL":"Array con referencia a SOURCE1","SOURCE":"../../SOURCE1"},
            "REF2":{"TYPE":"ARRAY","LABEL":"Array con referencia a SOURCE2","SOURCE":"../../SOURCE2"},
            "REF3":{"TYPE":"DICTIONARY","VALUETYPE":{"TYPE":"STDSTRING"},"LABEL":"Diccionario con referencia a SOURCE1","SOURCE":"../../SOURCE1"},
            "REF4":{"TYPE":"DICTIONARY","VALUETYPE":{"TYPE":"STDSTRING"},"LABEL":"Diccionario con referencia a SOURCE2","SOURCE":"../../SOURCE2"}
            }
        },
    "STDSTRING":{"TYPE":"STRING"},
    "DBLSTDSTRING":{"TYPE":"CONTAINER",
                    "LABEL":"",
                    "FIELDS":{
                        "STRING1":{"TYPE":"STRING","LABEL":"STRING1"},
                        "STRING2":{"TYPE":"STRING","LABEL":"STRING2"}
                    }},
    "OBJECTLIST":{"TYPE":"OBJECTARRAY",
                  "VALUETYPE":{"TYPE":"STDSTRING","LABEL":"CONTENT"},
                  "LABEL":"Object List"}
};
*/    

//IDE.types.definitions=<?php /*include_once("definitions.js");*/ ?>;
IDE.types.definitions=<?php include_once("js/metadesc.js");?>;

function test()
{  
    var od={
        "TYPE":"ROOT",
        "LABEL":"System"        
    };
    //return;
   IDE.initialize(IDE.types.definitions.ROOT);
   
   IDE.setValue(<?php include_once("definitions.js"); ?>,od);     
  document.getElementById("debug").appendChild(IDE.rootNode.__paint());
}
</script>
</head>
<body onload="test()">
<div id="debug"></div>
  
</body>
</html>
