dojo.provide("HtmlEditor.MainEditor");
// stuff needed:
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.MenuBar");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.PopupMenuItem");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");


dojo.declare("HtmlEditor.MainEditor",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        templatePath: dojo.moduleUrl("HtmlEditor","templates/index.html"),
        widgetsInTemplate:true,
    postCreate: function(){   
        this.newPageMenu.onClick=dojo.hitch(this,"onNewPage");
        this.newObjectMenu.onClick=dojo.hitch(this,"onNewObject");
        
        // Se obtienen las definiciones del sistema
        var args= {
              url:'definitions.js',
              handleAs:'json',
              load:function(data)
              {
                  var definitions=data;
                  IDE.types.definitions=definitions;
                  mainSys.loadSystem();
              },
              error:function(e)
              {
                  console.dir(e);
              }
          };
        mainSys=this;
        dojo.xhrGet(args);                 
    },
    onNewObject:function(e)
    {        
         var newObject=new IDE.node({"TYPE":"OBJECTMODEL"},"/objects");         
         this.currentObject=newObject;
         var but=document.createElement("input");
         but.type="button";
         but.value="SAVE";
         var z=this;
         but.onclick=function()
         {
              var objectInfo=z.currentObject.__save();
              var args= {
              url:'saver.php',
              handleAs:'json',
              load:function(data)
              {
              },
              content:{
                  nodeType:'OBJECT',
                  nodeName:'CTest',
                  data:dojo.toJson(objectInfo)
              },
              error:function(e)
              {
                  console.dir(e);
              }
          };
          dojo.xhrPost(args);
         }
         
         this.objectContainer.appendChild(but);
         this.currentObjectContainer=newObject.__paint();
         this.objectContainer.appendChild(this.currentObjectContainer);

    },
    __cleanObjectContainer:function()
    {
      var nChilds=this.objectContainer.childNodes.length;
      var k;
      for(k=0;k<nChilds;k++) 
          this.objectContainer.removeChild(this.objectContainer.childNodesd[k]);
      
    },

    onEditObject:function(objectName)
    {        
        if(this.currentObject) {
            this.objectContainer.removeChild(this.curObjectContainer);
        }
        this.currentObjectName=objectName;
        this.currentObject=new IDE.rootNode.__getReference("/objects/"+objectName);         
         
         var but=document.createElement("input");
         but.type="button";
         but.value="SAVE";
         var z=this;
         but.onclick=function()
         {
              var objectInfo=z.currentObject.__save();
              var args= {
              url:'saver.php',
              handleAs:'json',
              load:function(data)
              {
              },
              content:{
                  nodeType:'OBJECT',
                  nodeName:currentObjectName,
                  data:dojo.toJson(objectInfo)
              },
              error:function(e)
              {
                  console.dir(e);
              }
          };
          dojo.xhrPost(args);
         }
         this.objectContainer.appendChild(but);
         this.objectContainer.appendChild(this.currentObject.__paint());
    },

    onNewPage:function(e)
    {
    },
    loadSystem:function()
    {
        
        var args={
            url:'systemLoader.php',
            handleAs:'json',
            load:dojo.hitch(this,"initializeIDE"),
            error:function(e)
            {
                console.dir(e);
            }
        };
        dojo.xhrGet(args);
    },
    initializeIDE:function(data)
    {         
          
           var od={
               "TYPE":"ROOT",
               "LABEL":"System"        
           };
        IDE.setValue(data,od); 
        
        this.showObjectList();   
    },

    showObjectList:function()
    {
        var pag=IDE.rootNode.__getReference("/objects");
        var IDEcontrol=this;

        if(pag) {
            var k;
            var children=pag.__value;
            if(children) {
                for(k in children) {
                    
                    var n=document.createElement("div");
                    var al=document.createElement("a");
                    al.innerHTML=k;
                    n.appendChild(al);
                    al.IDEobjectName=k;
                    al.href="javascript:void(0)";
                    al.onclick=function()
                    {
                        IDEcontrol.onEditObject(this.IDEobjectName);
                        return false;
                    }
                    console.debug("MAS");
                    this.objectlist.appendChild(n);
                }
            }
            else
                alert("NO CHILDS");
        }
        else
            alert("NO PAGS");
        
    }

    
    
});

