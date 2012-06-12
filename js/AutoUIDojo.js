dojo.require('dojo.parser');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit.form.Button');
dojo.require('dijit.layout.ContentPane');
dojo.require("dijit.form.TextBox");
dojo.require("dijit.TitlePane");
dojo.require('dijit.form.ComboBox');
dojo.require('dojo.data.ItemFileReadStore');
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");

Siviglia.AutoUI.Builders={};
Siviglia.AutoUI.Builders.dojo={};
Siviglia.AutoUI.Builders.dojo.Factory=function(nodeObj,args)
{
     var c=Siviglia.AutoUI.Builders.dojo;
     args=args || {};
     args.node=nodeObj;
     
     
     node=args;
     if(nodeObj.definition.PAINTER)
     {
         return new c[nodeObj.definition.PAINTER](node);
     }
     
    switch(nodeObj.getClassName())
    {            
        case "StringType":{return new c.StringPainter(node);}break;
        case "BooleanType":{return new c.BooleanPainter(node);}break;
        case "ContainerType":{return new c.ContainerPainter(node);}break;     
        case "DictionaryType":{return new c.DictionaryPainter(node);}break;  
        case "ArrayType":{return new c.ArrayPainter(node);}break;  
        case "KeyReferenceType":{return new c.KeyReferencePainter(node);}break;
        case "SelectorType":{return new c.SelectorPainter(node);}break;        
        case "TypeSwitcher":{return new c.TypeSwitcherPainter(node);}break;
        case "ObjectArrayType":{return new c.ObjectArrayPainter(node);}break;
        default:{
            Siviglia.debug("UNKNOWN DEFINITION");
            Siviglia.dir(node.__definition);
        }
    }    
}
Siviglia.AutoUI.Builders.dojo.DefaultLayouts=
{
    "StringType":"Symmetrical",
    "ContainerType":"Window",
    "ArrayType":"Symmetrical",
    "SelectorType":"Symmetrical",
    "DictionaryType":"LateralMenu",
    "TypeSwitcher":"Symmetrical",
    "ObjectArrayType":"LateralMenu"
}



Siviglia.AutoUI.Builders.dojo.Paint=function(node,domNode)
{
    var layout=node.definition.LAYOUT;
    if(!layout) layout=Siviglia.AutoUI.Builders.dojo.DefaultLayouts[node.getClassName()];
    if(!layout) layout='Symmetrical';
    
    layoutW=new Siviglia.AutoUI.Builders.dojo[layout+'Layout']({node:node});

    
    layoutW.placeAt(domNode);
    return layoutW;
}

/*
    LAYOUT CLASSES 
 
*/
dojo.declare("Siviglia.AutoUI.Builders.dojo.Layout",
             [dijit._Widget,dijit._Templated],
             {
                 node:null,
                 postCreate:function()
                 {
                     this.painter=Siviglia.AutoUI.Builders.dojo.Factory(this.params.node);
                     console.debug(this.params.node.definition.LABEL);
                     if(this.params.node.definition.LABEL && this.labelNode) {                         
                         this.labelNode.innerHTML=this.params.node.definition.LABEL;
                     }
                     if(this.inputNode) {
                         this.painter.placeAt(this.inputNode);
                     }
                 }
             }
             );
dojo.declare("Siviglia.AutoUI.Builders.dojo.FlowLayout",
             [Siviglia.AutoUI.Builders.dojo.Layout],
             {
                 templateString:'<span><span dojoAttachPoint="inputNode"></span></span>'
             });
dojo.declare("Siviglia.AutoUI.Builders.dojo.WindowLayout",
             [Siviglia.AutoUI.Builders.dojo.Layout],
             {
                   templateString:'<div><div dojoType="dijit.TitlePane" dojoAttachPoint="Pane"><div dojoAttachPoint="inputNode"></div></div></div>',
                    widgetsInTemplate:true,
                   postCreate:function()
                   {
                       this.Pane.set('title',this.params.node.definition.LABEL);                       
                       this.inherited(arguments);
                   }
             }
             );
dojo.declare("Siviglia.AutoUI.Builders.dojo.SymmetricalLayout",
             [Siviglia.AutoUI.Builders.dojo.Layout],
             {
                 templateString:'<div class="SymmetricalLayout"><div class="SymmetricalLayoutLabel" dojoAttachPoint="labelNode"></div><div class="SymmetricalLayoutInput" dojoAttachPoint="inputNode"></div><div style="clear:both"></div></div>'
             }
            )
dojo.declare("Siviglia.AutoUI.Builders.dojo.LateralMenuLayout",
    [Siviglia.AutoUI.Builders.dojo.Layout],
    {
    node:null,
        widgetsInTemplate:true,
    templateString:'<div>\
                        <div dojoType="dijit.TitlePane" dojoAttachPoint="Pane">\
                        <table style="font-size:10px;border:1px solid #AAA" width="100%"><tr>\
                            <td valign="top" style="background-color:#F0F0F0;border-right:2px solid #AAA;width:200px"> \
                                <b>Contents</b><hr>\
                                <div dojoAttachPoint="theMenu"></div><br> \
                                <b>New Element:</b><br>\
                                <div dojoAttachPoint="inputNode" style="float:left"></div> \
                            </td><td>\
                                <div dojoAttachPoint="subInputNode"></div>\
                            </td></tr>\
                        </table>\
                    </div>\
                </div>',
        postCreate:function()
        {
            this.subNodes=[];
            this.subWidgets=[];
            this.curSelection=null;
            this.currentWidget=null;
            
            this.Pane.set('title',this.params.node.definition.LABEL);
            this.rebuildMenu();
            this.params.node.addListener("change",this,"rebuildMenu");
            this.params.node.addListener("NewValue",this,"selectLast");
            this.inherited(arguments);
            
            
        },
        rebuildMenu:function()
        {
            for(var k=0;k<this.subNodes.length;k++) 
                this.subNodes[k].destruct();

            this.theMenu.innerHTML='';
            this.subWidgets=[];
            this.curSelection=null;

            subTypeDef={"TYPE":"STRING","PAINTER":"ReferencePainter"}; 
            var keys=this.params.node.getReference();         
            for( var k=0;k<keys.length;k++) {
                var rNode=Siviglia.AutoUI.NodeFactory(subTypeDef,null,keys[k]);
                rNode.addListener("clicked",this,"onMenuLabelClicked",keys[k]);
                rNode.addListener("delete",this,"onMenuLabelDeleted",keys[k]);
                widget=Siviglia.AutoUI.Builders.dojo.Factory(rNode);
                widget.placeAt(this.theMenu);
                widget.nodeKey=keys[k];
                this.subNodes.push(rNode);
                this.subWidgets.push(widget);
            }
                         
            if(keys.length>0) {
                this.onMenuClicked(keys[0]);
            }
        },
        onMenuClicked:function(label)
        {         
            if(this.curSelection) {
                dojo.removeClass(this.curSelection.domNode,'selectedReference');
                this.currentWidget.destroyRecursive();
            }
               this.subInputNode.innerHTML='';
            for(var k=0;k<this.subWidgets.length;k++) {
                if(this.subWidgets[k].nodeKey==label) {
                    this.curSelection=this.subWidgets[k];
                    dojo.addClass(this.curSelection.domNode,'selectedReference');
                }
            }
            this.currentNode=this.params.node.getKey(label);
            this.currentWidget=Siviglia.AutoUI.Builders.dojo.Factory(this.currentNode);
            this.currentWidget.placeAt(this.subInputNode);

        },
        onMenuLabelClicked:function(evType,data,param)
        {
            this.onMenuClicked(param);
        },
        onMenuLabelDeleted:function(evType,data,param)
        {
            this.params.node.remove(param);
        },
        selectLast:function()
        {                       
            var keys=this.params.node.getReference();
            this.onMenuClicked(keys[keys.length-1]);
        },
        destroy:function()
        {
            this.params.node.removeListeners(this);
            this.painter.removeListeners(this);
            this.inherited(arguments);
        }
    
    }
    );


dojo.declare("Siviglia.AutoUI.Builders.dojo.ReferencePainter",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        labelNode:null,        
        templateString:'<div> \
                <span  dojoAttachPoint="theBox" dojoAttachEvent="onclick:clickItem" style="padding:2px;font-weight:bold"></span> \
                <span style="font-size:10px;padding:1px;cursor:pointer;background-color:red;color:white" dojoAttachPoint="delButton" dojoAttachEvent="onclick:deleteItem">x</span> \
                </div>',
        widgetsInTemplate:true,
        postCreate: function(){                           
            this.theBox.innerHTML=this.params.node.getValue();           
        },
        onChange:function()
        {
            this.node.setValue(this.theBox.get('value'));            
        },
        showDelete:function()
        {
            this.delButton.style.display='block';
        },
        hideDelete:function()
        {
            this.delButton.style.display='none';
        },
        deleteItem:function()
        {
            this.params.node.fireEvent("delete");
        },
        clickItem:function()
        {
            this.params.node.fireEvent("clicked");
        }
});
dojo.declare("Siviglia.AutoUI.Builders.dojo.NewItemPainter",
             [dijit._Widget,dijit._Templated],
             {
                 paintValue:function()
                 {
            
                     if(this.newItemWidget)
                     {
                         this.newItemWidget.destroy();
                         this.AddItemNode.innerHTML='';
                     }                                                     
                     if(this.params.node.hasSourceInput())
                     {
                         this.newItemNode=Siviglia.AutoUI.NodeFactory({"TYPE":"SELECTOR"},null,null);
                         this.newItemWidget=Siviglia.AutoUI.Builders.dojo.Factory(this.newItemNode,{options:this.params.node.getSourceValues()});
                         this.newItemWidget.setOptions(this.params.node.getSourceValues());                
                     }
                     else
                     {
                         this.newItemNode=Siviglia.AutoUI.NodeFactory({"TYPE":"STRING"},null,null);
                         this.newItemWidget=Siviglia.AutoUI.Builders.dojo.Factory(this.newItemNode);
                
                     }            
                     this.newItemWidget.placeAt(this.AddItemNode);            
            
                 },
                 onAdd:function()
                 {
                     this.params.node.fireEvent("NewValue");
                 }
             }
             );


dojo.declare("Siviglia.AutoUI.Builders.dojo.StringPainter",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        labelNode:null,        
        allowEvents:false,
       // templateString:'<div><div dojoType="dijit.form.TextBox" dojoAttachPoint="theBox" dojoAttachEvent="onchange:onChange"></div></div>',
         templateString:'<div><input type="text" dojoAttachPoint="theBox" dojoAttachEvent="onchange:onChange"></div></div>',
        widgetsInTemplate:true,
        postCreate: function(){               
            
            this.readOnly=false;
            var cVal=this.params.node.getValue();
            this.allowEvents=true;
            if(this.params.node.definition.READONLY) {
                this.readOnly=true;
                this.domNode.innerHTML=cVal;
                return;
            }
            this.theBox.value=cVal;
        },
        onChange:function()
        {
            if(this.readOnly) return;
            if(!this.allowEvents) return;            
            this.params.node.setValue(this.theBox.value);            
        },
        getValue:function()
        {
            if(this.readOnly) {
                return this.params.node.getValue();
            }
            return this.theBox.value;
        }
});
dojo.declare("Siviglia.AutoUI.Builders.dojo.RemovableStringPainter",
    [Siviglia.AutoUI.Builders.dojo.StringPainter],
    {
        templateString:'<span> \
        <input type="text" dojoAttachPoint="theBox" dojoAttachEvent="onchange:onChange">\
        <span style="font-size:10px;padding:1px;cursor:pointer;background-color:red;color:white" dojoAttachPoint="delButton" dojoAttachEvent="onclick:deleteItem">x</span></span>',
        postCreate: function(){                           
            this.theBox.value=this.params.node.getValue();
            this.allowEvents=true;
        },
        deleteItem:function()
        {
            this.params.node.fireEvent("delete");
        }
    });


dojo.declare("Siviglia.AutoUI.Builders.dojo.ContainerPainter",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        node:null,
        label:null,        
        templateString:'<div> \
                            <div dojoAttachPoint="fieldContainer"></div> \
                            <div style="text-align:right" dojoAttachPoint="SaveButton"><span dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:doSave">Save</span></div>\
                        </div>',
        widgetsInTemplate:true,
        postCreate: function(){                 
            this.paintValue();
            if(!this.params.node.definition.SAVE_URL) 
                this.SaveButton.style.display='none';
        },
        paintValue:function()
        {
            dojo.forEach(dijit.findWidgets(this.fieldContainer), function(w) { 
                w.destroyRecursive(); 
            }); 

            this.fieldContainer.innerHTML='';
            var val=this.params.node.children;            
            for(var k in val) {                                
                Siviglia.AutoUI.Builders.dojo.Paint(val[k],this.fieldContainer);
            }
        },
        doSave:function()
        {            
            var val=this.params.node.save();
            console.dir(val);
        }
});

dojo.declare("Siviglia.AutoUI.Builders.dojo.ArrayPainter",
    [Siviglia.AutoUI.Builders.dojo.NewItemPainter], // inherit from _Widget
    {
        node:null,
        label:null,        
        templateString:'<div> \
                            <div dojoAttachPoint="fieldContainer"></div><div style="clear:both"></div> \
                            <div>\
                            <span dojoAttachPoint="AddItemNode" style="text-align:right"> \
                            </span> \
                            <span dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:onAdd">Add</span>\
                        </div>',
        widgetsInTemplate:true,
        postCreate: function(){
            this.params.node.addListener("change",this,"paintValue");
            this.paintValue();
        },
        paintValue:function()
        {                      
                dojo.forEach(dijit.findWidgets(this.fieldContainer), function(w) { 
                    w.destroyRecursive(); 
            }); 
            this.fieldContainer.innerHTML='';
            this.arrayItemNodes=[];
            var subTypeDef;
            var val=this.params.node.value;
            if(this.params.node.hasSourceInput())
                subTypeDef={"TYPE":"STRING","PAINTER":"ReferencePainter"};                
            else            
                subTypeDef={"TYPE":"STRING","PAINTER":"RemovableStringPainter"};                
                         
            if(val) {
                for(var k=0;k<val.length;k++)
                {
                    this.arrayItemNodes.push(Siviglia.AutoUI.NodeFactory(subTypeDef,null,val[k]));
                    this.arrayItemNodes[k].addListener("change",this,"onChangeInput",k);
                    this.arrayItemNodes[k].addListener("delete",this,"onDeleteInput",k);
                    Siviglia.AutoUI.Builders.dojo.Paint(this.arrayItemNodes[k],this.fieldContainer);                
                }
            }
            this.inherited(arguments);
            
        },
        onChangeInput:function(evType,data,param)
        {            
            var val=data.src.getValue();
            if(val=="") {
                this.params.node.removeItem(param);
            }
            else
                this.params.node.setItem(val,param);
        },
        onDeleteInput:function(evType,data,param)
        {
            this.params.node.removeItem(param);
        },
        
        onAdd:function()
        {
            var newVal=this.newItemWidget.getValue();            
            this.params.node.add(newVal);
        },
        destroy:function()
        {
            if(this.newItemNode) 
            {
                this.newItemNode.removeListeners(this);                
                this.newItemNode.__destruct();
            }
        }
});

dojo.declare("Siviglia.AutoUI.Builders.dojo.ObjectArrayPainter",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        node:null,
        label:null,        
        templateString:'<span> \
                            <span dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:onAdd">Add</span>\
                        </span>',
        widgetsInTemplate:true,
        postCreate: function(){
            this.params.node.addListener("change",this,"paintValue");
        
        },
        
        
        onDeleteInput:function(evType,data,param)
        {
            this.params.node.removeItem(param);
        },
        onAdd:function()
        {
          
            this.params.node.add();
            this.inherited(arguments);
            
        }
});

dojo.declare("Siviglia.AutoUI.Builders.dojo.DictionaryPainter",
    [Siviglia.AutoUI.Builders.dojo.NewItemPainter], // inherit from _Widget
    {
        node:null,
        label:null,        
        templateString:'<div> \
                            <span dojoAttachPoint="AddItemNode" style="text-align:right"> \
                            </span> \
                            <span dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:onAdd">Add</span>\
                        </div>',
        widgetsInTemplate:true,
        postCreate: function(){
            this.params.node.addListener("change",this,"paintValue");
            this.paintValue();
        },
        paintValue:function()
        {
            
            this.inherited(arguments);                    
        },
        onChangeInput:function(evType,data,param)
        {
            
            var val=data.src.getValue();
            if(val=="") {
                this.params.node.removeItem(param);
            }
            else
                this.params.node.setItem(val,param);
        },
        onDeleteInput:function(evType,data,param)
        {
            this.params.node.removeItem(param);
        },
        
        onAdd:function()
        {
            var newVal=this.newItemWidget.getValue();            
            this.params.node.add(newVal);
            this.inherited(arguments);
            
        },
        destroy:function()
        {
            if(this.newItemNode) 
            {
                this.newItemNode.removeListeners(this);                
                this.newItemNode.destruct();
            }
        }
});

dojo.declare("Siviglia.AutoUI.Builders.dojo.TypeSwitcherPainter",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        node:null,
        label:null,        
        widgetsInTemplate:true,
        templateString:'<div> \
                            <div dojoType="dijit.layout.ContentPane">\
                            <div >\
                            <span dojoAttachPoint="typeChanger"> \
                            </span> \
                            <span dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:onChangeType">Change Type</span>\
                            </div> \
                            <div dojoAttachPoint="fieldContainer"></div>\
                            </div>\
                        </div>',
        widgetsInTemplate:true,
        postCreate: function(){

            this.params.node.addListener("change",this,"paintValue");
            this.typeNode=null;
            this.paintValue();

        },
        paintValue:function()
        {

            if(this.typeNode) {
                this.typeNodeWidget.destroy();
                this.typeNode.destruct();
            }
            this.typeChanger.innerHTML='';
            this.fieldContainer.innerHTML='';
            var vals=this.params.node.getAllowedTypes();
            var typeNodeDef={TYPE:"SELECTOR"};
            var val;
            if(this.params.node.isUnset()) 
                val=null;
            else
                val=this.params.node.getCurrentType();

            this.typeNode= Siviglia.AutoUI.NodeFactory(typeNodeDef,null,null);

            this.typeNodeWidget=Siviglia.AutoUI.Builders.dojo.Factory(this.typeNode,{options:vals}); 
            this.typeNodeWidget.placeAt(this.typeChanger);

            if(!this.params.node.isUnset()) {
                var sNode=this.params.node.getSubNode();                
                this.subNodeWidget=Siviglia.AutoUI.Builders.dojo.Paint(sNode,this.fieldContainer);                
            }

            this.inherited(arguments);
        },
        onChangeType:function()
        {
            
            var v=this.typeNodeWidget.getValue();
            
            if(!v) {
                alert("Please choose a type");
                return;
            }
            if(this.params.node.getCurrentType()==v) {
                return;
            }
            this.params.node.setType(v);
        },
        
        destroy:function()
        {
            if(this.typeNode) 
            {
                this.typeNode.removeListeners(this);                
                this.typeNode.destruct();

            }
        }
});

dojo.declare("Siviglia.AutoUI.Builders.dojo.SelectorPainter",
    [dijit._Widget,dijit._Templated], // inherit from _Widget
    {
        node:null,
        label:null,  
        options:null,
        allowEvents:false,
        templateString:'<span> \
                            <span dojoAttachPoint="fieldContainer"><span dojoType="dijit.form.ComboBox" dojoAttachPoint="combo" searchAttr="name"></span></span> \
                        </span>',
        widgetsInTemplate:true,
        postCreate: function(){                 
            this.paintValue();
            this.allowEvents=true;
        },
        setOptions:function(opt)
        {        
           this.options=opt;
        },
        paintValue:function()
        {        
            var k;
            var dsData={identifier:'value',label:'name'};

             if(this.options!=null)
                 dsData.items=this.options;
             else
             {
                 dsData.items=[];
                 vals=this.params.node.definition.OPTIONS;
                 for(k in vals) 
                     dsData.items.push({name:k,value:vals[k]});
             }

             var ds=new dojo.data.ItemFileReadStore({data:dsData});
             this.combo.set('store',ds);

             if(!this.params.node.isUnset())
                 this.combo.set('value',this.params.node.save());
                                     
        },
        onChange:function()
        {

        },
        getValue:function()
        {
            return this.combo.getValue();
        },
        destroy:function()
        {            
            this.combo.destroyRecursive();
            this.params.node.removeListeners(this);
        }
});

/* <div style="text-align:right;border:0px" class="dijitTitlePaneTitle" dojoAttachPoint="addButton"><div dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:onNew">New element</div></div> \
 
 
   <div id="dialogOne" dojoType="dijit.Dialog" title="My Dialog Title">
    <div dojoType="dijit.layout.TabContainer" style="width: 200px; height: 300px;">
        <div dojoType="dijit.layout.ContentPane" title="foo">
            Content of Tab "foo"
        </div>
        <div dojoType="dijit.layout.ContentPane" title="boo">
            Hi, I'm Tab "boo"
        </div>
    </div>
</div>
   */




