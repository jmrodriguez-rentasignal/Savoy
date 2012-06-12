{
    "ROOT":{
        "HANDLER":"Editor.WebsiteHandler",
        "TYPE":"DICTIONARY",
        "LABEL":"Websites",
        "ALIAS":"Websites",
        "REMOTEURL":"?ds=websiteList",
        "VALUETYPE":{
            "TYPE":"WEBSITE"
        }
    },
    "WEBSITE": {
        "TYPE": "CONTAINER",
        "FIELDS": {
           /* "userProfiles": {
                "TYPE": "ARRAY",
                "LABEL": "Perfiles de usuario"
            },*/
            
            "appObjects":{
                "HANDLER":"Editor.ObjectHandler",
                "TYPE": "DICTIONARY",
                "ALIAS": "OBJECTS",
                "LABEL": "Objetos de Aplicacion",
                "REMOTEURL":"?ds=appobjectList",
                "REMOTEACTION":"?action=appObject",                
                "VALUETYPE": {
                    "TYPE": "OBJECTMODEL"
                }
            },
            "webObjects":{
                "HANDLER":"Editor.ObjectHandler",
                "TYPE": "DICTIONARY",
                "ALIAS":"OBJECTS",
                "LABEL": "Objetos de web",
                "REMOTEURL":"?ds=webobjectList",
                "REMOTEACTION":"?action=webObject",               
                "VALUETYPE": {
                    "TYPE": "OBJECTMODEL"
                }
            },
            "system":{
                "HANDLER":"Editor.SystemHandler",
                "TYPE":"CONTAINER",
                "LABEL":"Website",
                "REMOTEURL":"?ds=config",
                "REMOTEACTION":"?action=changeConfig",
                "FIELDS":{
                    "PROJECTPATH":{"TYPE":"_STRING","LABEL":"Path del proyecto","RONLY":true,"NODELETE":true},
                    "WEBPATH":{"NODELETE":true,"TYPE":"_STRING","LABEL":"Url del proyecto","HELP":"Esta url debe apuntar a la carpeta /html del proyecto"},
                    "SERIALIZERS":{"TYPE":"CONTAINER",
                                   "LABEL":"Bases de datos",
                                   "FIELDS":{
                                       "app":{"TYPE":"CONTAINER",
                                              "LABEL":"Storage for the App subsystem",
                                              "FIELDS":{
                                                  "HOST":{"TYPE":"_STRING","LABEL":"Host"},
                                                  "PORT":{"TYPE":"_STRING","LABEL":"Port"},
                                                  "TYPE":{"TYPE":"SELECTOR","LABEL":"Tipo","OPTIONS":{"Mysql":1,"Cassandra":2},"DEFAULT":1},
                                                  "USERNAME":{"TYPE":"_STRING","LABEL":"User name"},
                                                  "PASSWORD":{"TYPE":"_STRING","LABEL":"Password"},
                                                  "DATABASE":{"TYPE":"_STRING","LABEL":"Database"}
                                                  }
                                              },
                                       "web":{"TYPE":"CONTAINER",
                                              "LABEL":"Storage for the Web subsystem ",
                                              "FIELDS":{
                                                  "HOST":{"TYPE":"_STRING","LABEL":"Host"},
                                                  "PORT":{"TYPE":"_STRING","LABEL":"Port"},
                                                  "TYPE":{"TYPE":"SELECTOR","LABEL":"Tipo","OPTIONS":{"Mysql":1,"Cassandra":2},"DEFAULT":1},
                                                  "USERNAME":{"TYPE":"_STRING","LABEL":"User name"},
                                                  "PASSWORD":{"TYPE":"_STRING","LABEL":"Password"},
                                                  "DATABASE":{"TYPE":"_STRING","LABEL":"Database"}
                                                  }
                                              }
                                       }
                                   }
                    }
                },
            "preferences":{
                "HANDLER":"Editor.SystemPreferences",
                "TYPE":"CONTAINER",
                    "LABEL":"Preferences",
                    "REMOTEURL":"?ds=preferences",                    
                    "REMOTEACTION":"?action=preferences",
                    "FIELDS":{
                        "REQUIRE_UNIQUE_EMAIL":{"TYPE":"BOOLEAN","LABEL":"Emails are unique?","HELP":"Require unique emails on sign-up"},
                        "PLAINTEXT_PASSWORDS":{"TYPE":"SELECTOR","OPTIONS":{"Plain Text":1,"MD5":2,"CRYPT":3},"DEFAULT":3,"LABEL":"Password encryption"},                        
                        "ATTEMPTS_BEFORE_LOCKOUT":{"TYPE":"INTEGER","LABEL":"Attempts before freeze","DEFAULT":0},
                        "REQUIRE_ACCOUNT_VALIDATION":{"TYPE":"BOOLEAN","LABEL":"Requires account validation","DEFAULT":false},
                        "LOGIN_ON_CREATE":{"TYPE":"BOOLEAN","LABEL":"Autolog user after sign-up","DEFAULT":true,"DISABLE_IF":{"../REQUIRE_ACCOUNT_VALIDATION":true},
                        "NOT_ALLOWED_NICKS":{"TYPE":"ARRAY","LABEL":"Not allowed nicks (regexps)"}
                        }
                    }
                }
        }
                    

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
    "EXTERNAL_ALIAS":{"LABEL":"Temp","TYPE":"_STRING"},      

    "STATE_SPEC":{
        "TYPE":"CONTAINER",
        "LABEL":"Especificacion de estado",
        "FIELDS":{
            "LABEL":{"TYPE":"_STRING","LABEL":"Nombre del estado"},
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
            "OBJECT":{"TYPE":"_STRING","LABEL":"Objeto"},
            "METHOD":{"TYPE":"_STRING","LABEL":"Metodo"}
        }
    }

}