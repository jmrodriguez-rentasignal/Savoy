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

<script type="application/javascript" src="js/dojo/dojo.js" djConfig="isDebug:true,parseOnLoad:true,baseUrl:'./js/dojo/'"></script>
<script>dojo.require('dojo.parser');</script>
<link rel="stylesheet" type="text/css" href="js/dijit/themes/claro/claro.css"
        />
<script type="application/javascript" src="js/jquery.js">

</script>
<script type="application/javascript" src="js/Siviglia.js">

</script>
<script type="application/javascript" src="js/AutoUI.js">

</script>
<script type="application/javascript" src="js/AutoUIDojo.js">

</script>


<script type="application/javascript">

function doLoaded()
{
    var def={
        "ROOT":{
            LABEL:'GRUPO',
            TYPE:'CONTAINER',
            SAVE_URL:'ww',
            FIELDS:{                
                'FIELD2':{
                    TYPE:'ARRAY',
                    LABEL:'Campo 2'
                },
               
                'FIELD3':{
                    TYPE:'CONTAINER',
                    LABEL:'Sub Elementos',
                    FIELDS:{
                            'FIELD1':{
                                    TYPE:'ARRAY',
                                    'SOURCE':'../../FIELD2',
                                    LABEL:'SubCampo 1'
                                    },
                            'FIELD2':{
                                     TYPE:'SELECTOR',
                                     LABEL:'SubCampo 2',
                                     OPTIONS:{OPTION1:1,OPTION2:2,OPTION3:3}                                     
                                    },
                           'FIELD3':{
                                        TYPE:'DICTIONARY',
                                        VALUETYPE:'SUBTYPE1',
                                        LABEL:'My dictionary'
                                                                               
                                    }
                    }
                }                
            }
        },
        "SUBTYPE1":{
            LABEL:'MiSubtipo',
            TYPE:'TYPESWITCH',
            TYPE_FIELD:'TYPE',
            ALLOWED_TYPES:['TYPE1','TYPE2']
        },
        "TYPE1":
        {
            'LABEL':'Tipo1 de TypeSwitch',
            'TYPE':'CONTAINER',
            FIELDS:{
                 'TYPE':{'TYPE':'STRING','LABEL':'Type','READONLY':true},                 
                 'FIELD1':{
                    TYPE:'OBJECTARRAY',
                    VALUETYPE:'TYPE3',
                    LABEL:'Campo 1'
                },
                 'FIELD2':{
                    TYPE:'ARRAY',
                    LABEL:'Campo 12',                    
                }
            }
        },
        "TYPE2":
        {
            'LABEL':'Tipo2 de TypeSwitch',
            'TYPE':'CONTAINER',
            FIELDS:{
                 'TYPE':{'TYPE':'STRING','LABEL':'Type'},                 
                 'FIELD3':{
                    TYPE:'STRING',
                    LABEL:'Campo 1 deT2'
                },
                 'FIELD4':{
                    TYPE:'ARRAY',
                    LABEL:'Campo 12 deT2',                    
                }
            }
        },
        "TYPE3":
        {
            "LABEL":"El tercer tipo",
            "TYPE":"CONTAINER",
            "FIELDS":{
                "FIRST FIELD":{"TYPE":"STRING","LABEL":"FIRST"},
                "SECOND FIELD":{"TYPE":"STRING","LABEL":"SECOND"}
                
            }
        }

    };
    var n=Siviglia.AutoUI.initialize(def,{
                                           
                                           'FIELD2':['a','b','c'],
                                           'FIELD3':{
                                                        'FIELD3':{p1:{TYPE:'TYPE2',FIELD3:'baba',FIELD4:['a','b','c']}}
                                               }                                           
                                         });
    var painter=Siviglia.AutoUI.Builders.dojo.Paint(n,document.getElementById("debug"));
    

}

</script>
    <style type="text/css">
    body {font-family:Verdana;font-size:10px}

    .selectedReference {background-color:#CCC;border:1px solid #AAA}
    .SymmetricalLayoutLabel {float: left;
        width: 49%;
        text-align: right;
        margin: 2px;
        background-color: #F0F0F0;
        padding: 4px;
        font-weight: bold;
        font-size: 12px;
        margin-top: 3px;
    }  
    .SymmetricalLayoutInput {float:left;width:49%;margin:2px}    
    .SymmetricalLayout {margin:2px}
    </style>
</head>

<body class="claro" onload="doLoaded()">
    <div id="debug">
    
    </div>
</body>
</html>
