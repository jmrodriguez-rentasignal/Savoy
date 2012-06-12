{
    "ROOT":{
        "TYPE":"DICTIONARY",
        "LABEL":"Definition",
        "MODULE":"Root",
        "VALUETYPE":{
            "TYPE":"NODE"
        }
    },
    "NODE":{
        "TYPE":"TYPESWITCH",
        "TYPE_FIELD":"TYPE",
        "LABEL":"Node",
        "ALLOWED_TYPES":[
             {"TYPE":"DEF_INTEGER","LABEL":"Number"},
             {"TYPE":"DEF__STRING","LABEL":"String","DEFAULT":true},
             {"TYPE":"DEF_BOOLEAN","LABEL":"Boolean"},
             {"TYPE":"DEF_CONTAINER","LABEL":"Container"},
             {"TYPE":"DEF_DICTIONARY","LABEL":"Dictionary"},
             {"TYPE":"DEF_ARRAY","LABEL":"Array"},
             {"TYPE":"DEF_KEYREFERENCE","LABEL":"KeyReference"},
             {"TYPE":"DEF_SELECTOR","LABEL":"Selector"},
             {"TYPE":"DEF_TYPESWITCH","LABEL":"Type Switch"},
             {"TYPE":"DEF_OBJECTARRAY","LABEL":"Object Array"}
            ]
    },
    "DEF_INTEGER":{
        "TYPE":"CONTAINER",
        "LABEL":"Integer",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":"y"},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "MODULE":{"LABEL":"Module","TYPE":"_STRING","HELP":"If this field is a module, its handler will receive Save requests"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "DEFAULT":{"LABEL":"Default Value","TYPE":"_STRING","HELP":"Default value for field"}
            }
    },
    "DEF__STRING":{
        "TYPE":"CONTAINER",
        "LABEL":"String",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":"y"},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "MODULE":{"LABEL":"Module","TYPE":"_STRING","HELP":"If this field is a module, its handler will receive Save requests"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "DEFAULT":{"LABEL":"Default Value","TYPE":"_STRING","HELP":"Default value for field"}
            }
        
    },
   "DEF_BOOLEAN":{
    "TYPE":"CONTAINER",
        "LABEL":"Boolean",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":"y"},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "MODULE":{"LABEL":"Module","TYPE":"_STRING","HELP":"If this field is a module, its handler will receive Save requests"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "DEFAULT":{"LABEL":"Default Value","TYPE":"BOOLEAN","HELP":"Default value for field"}
            }
        },
    "DEF_CONTAINER":{
        "TYPE":"CONTAINER",
        "LABEL":"Container",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":"y"},

            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REMOTEURL":{"LABEL":"Datasource URL","TYPE":"_STRING","HELP":"If defined, this element will fill itself with values received from this datasource in JSON format"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "MODULE":{"LABEL":"Module","TYPE":"_STRING","HELP":"If this field is a module, its handler will receive Save requests"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "DEFAULT":{"LABEL":"Default Value","TYPE":"_STRING","HELP":"Default value for field"},
            "FIELDS":{
                "LABEL":"Fields",
                "TYPE":"DICTIONARY",
                "HELP":"Container Fields",
                "VALUETYPE":{"TYPE":"NODE"}
            }
            
        }
        },
     
    "DEF_DICTIONARY":{
            "TYPE":"CONTAINER",
        "LABEL":"Dictionary",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":"y"},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REMOTEURL":{"LABEL":"Datasource URL","TYPE":"_STRING","HELP":"If defined, this element will fill itself with values received from this datasource in JSON format"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "MODULE":{"LABEL":"Module","TYPE":"_STRING","HELP":"If this field is a module, its handler will receive Save requests"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "SOURCE":{"LABEL":"Source","TYPE":"_STRING","HELP":"If set, this defines the source for the allowed keys in this dictionary"},
            "FIELDS":{
                "LABEL":"Fields",
                "TYPE":"DICTIONARY",
                "HELP":"Container Fields",
                "VALUETYPE":{"TYPE":"NODE"}
            
            }
        }
        },    
    "DEF_ARRAY":{
        "TYPE":"CONTAINER",
        "LABEL":"Array",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":"y"},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REMOTEURL":{"LABEL":"Datasource URL","TYPE":"_STRING","HELP":"If defined, this element will fill itself with values received from this datasource in JSON format"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "MODULE":{"LABEL":"Module","TYPE":"_STRING","HELP":"If this field is a module, its handler will receive Save requests"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "DEFAULT":{"LABEL":"Default Value","TYPE":"_STRING","HELP":"Default value for field"},
            "SOURCE":{"LABEL":"Source","TYPE":"_STRING","HELP":"If set, this defines the source for the allowed values in this array"},            
            "FIELDS":{
                "LABEL":"Fields",
                "TYPE":"DICTIONARY",
                "HELP":"Container Fields",
                "VALUETYPE":{"TYPE":"NODE"}
            }
        }
        },
    "DEF_KEYREFERENCE":{
        "TYPE":"CONTAINER",
        "LABEL":"Key reference",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":true},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "KEYSOURCE":{"LABEL":"Key Source","REQUIRED":true,"TYPE":"_STRING","HELP":"If set, this defines the source for the allowed values of this field"}
            }                        
        },
    "DEF_SELECTOR":{
        "TYPE":"CONTAINER",
        "LABEL":"Selector",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":true},
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"},
            "OPTIONS":{"LABEL":"Options","REQUIRED":true,
                        "TYPE":"OBJECTARRAY",
                        "VALUETYPE":{"TYPE":"DEF_OPTION"}
                      }
            }
    },
    "DEF_TYPESWITCH":{
        "TYPE":"CONTAINER",
        "LABEL":"Type Switch",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":true},
            "TYPE_FIELD":{"LABEL":"Type field","TYPE":"_STRING","REQUIRED":true},
            "ALLOWED_TYPES":{
                "LABEL":"Allowed Types",
                "TYPE":"OBJECTARRAY",
                "REQUIRED":true,
                "VALUETYPE":{"TYPE":"DEF_ALLOW_TYPE"}
            },
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"}            
            }
    },

    "DEF_OBJECTARRAY":{
        "TYPE":"CONTAINER",
        "LABEL":"Object Array",
        "FIELDS":{
            "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":true},
            "VALUETYPE":{"LABEL":"Value Type",
                         "TYPE":"DEF_OBJARRAY_VALUE"},            
            "HANDLER":{"LABEL":"Class Handler","TYPE":"_STRING","HELP":"Instances of this class (in format a.b.c) will be created to handle this input events"},
            "REQUIRED":{"LABEL":"Required?","TYPE":"BOOLEAN"},
            "DESC":{"LABEL":"Description","TYPE":"_STRING","HELP":"Description to accompany this field"},
            "HELP":{"LABEL":"Help","TYPE":"_STRING","HELP":"Field Help"}
            }
            },

    "DEF_OPTION":{
        "TYPE":"DICTIONARY",
        "FIELDS":{
                "LABEL":{"LABEL":"Label","TYPE":"_STRING","REQUIRED":true},
                "VALUE":{"LABEL":"Value","TYPE":"_STRING","REQUIRED":true},
                "DEFAULT":{"LABEL":"Is default","TYPE":"BOOLEAN"}
        }
    },
    "DEF_ALLOW_TYPE":{
        "TYPE":"CONTAINER",
        "FIELDS":{
                "TYPE":{
                        "TYPE":"KEYREFERENCE",
                        "LABEL":"Type",
                        "KEYSOURCE":"/",
                        "REQUIRED":true
                        },
                 "LABEL":{
                        "TYPE":"_STRING",
                        "LABEL":"Label",
                        "REQUIRED":true
                        }

        }
    },
    "DEF_OBJARRAY_VALUE":{
        "TYPE":"CONTAINER",
        "FIELDS":{
                     "TYPE":{
                        "TYPE":"KEYREFERENCE",
                        "LABEL":"Type",
                        "KEYSOURCE":"/",
                        "REQUIRED":true
                        }   
                }
    }
        }


  
