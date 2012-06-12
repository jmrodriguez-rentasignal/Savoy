Siviglia.AutoUI={};
Siviglia.AutoUI.root=new Siviglia.model.PathRoot();

Siviglia.AutoUI.initialize=function(definition,value)
{
    Siviglia.AutoUI.root={definitions:definition};
    Siviglia.AutoUI.rootNode=Siviglia.AutoUI.NodeFactory(definition.ROOT,null,value);
    
    return Siviglia.AutoUI.rootNode;
}

Siviglia.AutoUI.setValue=function(value)
{
    Siviglia.AutoUI.rootNode.setValue(value);
}


Siviglia.Utils.buildClass({

    context:'Siviglia.AutoUI',
    classes:
    {
        /**
         * NodeType
         * 
         * @author ICSW (11/06/2012)
         */
        Node:{
            inherits:'Siviglia.Dom.EventManager',
            construct:function(className,definition,parent,value)
            {
                this.className=className;
                this.unset=true;
                if(typeof(parent)=="string")
                    this.parent=this.getPath(parent);                 
                else
                    this.parent=parent;
                 this.sourceType=definition.TYPE;      

                 var baseDef=Siviglia.AutoUI.root.definitions[definition.TYPE];  
    
                 var k;
                 this.definition={};    
        
                 if(baseDef)
                 {                    
                     for(k in baseDef)
                     {
                         this.definition[k]=baseDef[k];
                     }
                 }
                 for(k in definition)
                 {
                     if(k!="TYPE" || (k=="TYPE" && !this.definition["TYPE"]))
                     {            
                         this.definition[k]=definition[k];
                     }
                 }
                 this.initSubType();
                 
                 //*/
                 //this.__definition=definition;
                 if(typeof value != "undefined" && value!=null)
                     this.setValue(value);     
                 else
                     this.value=null;
            },
            methods:
            {
                initSubType:function(){},
                getClassName:function(){return this.className;},
                
                setValue:function(value)
                {
                    this.value=value;
                    this.unset=false;
                    this.fireEvent("change");

                    if(this.parent)
                    {
                        if(this.parent.unset)
                        {
                            this.parent.unset=false;
                            this.parent.fireEvent("change");
                        }
                    }                    
                },
                save:function()
                {
                    return this.value;
                                                                      
                },
                getType:function(){return this.definition["TYPE"]},
                getValue:function(){return this.value},
                getReference:function(){return this.value},
                
                isUnset:function(){return this.unset;},               
                unset:function(){
                    if(typeof this.value!="undefined")
                        delete this.value;
                    this.unset=true;
                    this.fireEvent("delete");
                    
                },
                hasSourceInput:function()
                {
                    return this.definition["SOURCE"];
                },
                getPath:function(path,position)
                {
                     // Los nodos TYPESWITCH no consumen path, deben ser transparentes.
                    /*if(this.__definition.type=="TYPESWITCH")
                            return this.__parent.__getPath(path,position);*/
    
                    if(position==path.length)
                    {     
                        return this;
                    }
                    
                    if(path[position]=="..")
                    {
                        return this.parent.getPath(path,position+1);
                    }    
                    return null;                    
                }
            }
                                         
        },
        /**
         * StringType
         * 
         * @author ICSW (11/06/2012)
         */
        StringType:{
            inherits:"Siviglia.AutoUI.Node",
            construct:function(definition,parent,value)
            {
                this.Node("StringType",definition,parent,value);
            }
        },  
        /**
         * BooleanType
         * 
         * @author ICSW (11/06/2012)
         */
        BooleanType:
        {
            inherits:"Siviglia.AutoUI.Node",
            construct:function(definition,parent,value)
            {
                this.Node("BooleanType",definition,parent,value);
            }
        },
        /**
         * ContainerType
         * 
         * @author ICSW (11/06/2012)
         */
        ContainerType:
        {

            inherits:'Siviglia.AutoUI.Node',
            construct:function(definition,parent,value)
            {
                this.Node("ContainerType",definition,parent,value);
            },
            methods:{
                initSubType:function()
                {
                    
                     this.children={};
                     var k=0;
                     for(k in this.definition["FIELDS"])
                         this.children[k]=Siviglia.AutoUI.NodeFactory(this.definition["FIELDS"][k],this);
                },

                setValue:function(val)
                {
                    this.value=val;
                    for(k in val)
                    {
                        if(this.children[k])
                            this.children[k].setValue(val[k]);
                    }
                    this.unset=false;
                    this.fireEvent("change");
                                                                      
                },
                save:function()
                {

                    var v={};
                    for(var k in this.children)
                    {    
                        if(this.children[k].isUnset())
                             v[k]=null;
                        else
                            v[k]=this.children[k].save();

                    }
                    return v;

                },
                getPath:function(path,position)
                {
                    var p=this.Node$getPath(path,position);
                    if(p) return p;
                    
                    if(this.children[path[position]]) 
                        return this.children[path[position]].getPath(path,position+1);
                        
                    return null;                    
                },
                getReference:function()
                {
                    var results=[];
                    for(var k in this.value)
                        results.push(k);
                    return results;
                },
                getKey:function()
                {
                    return this.children[k];
                }
            }
        },
        /**
         *  
         * SourcedType 
         * 
         * @author ICSW (11/06/2012)
         */
        SourcedType:
        {
            inherits:'Siviglia.AutoUI.Node',
            construct:function()
            {
                

                this.listeningTo=null;
            },
            methods:{
                loadSource:function(pathSrc)
                {
                        var subPaths=pathSrc.split("@");
                        this.__sourcePathExpression=pathSrc;
    
                        if(subPaths.length>1)
                        {
                            var k;
                            for(k=1;k<subPaths.length;k+=2)
                            {
                                var nestedRef=this.getPath(subPaths[k]);
                                if(!nestedRef)
                                {
                                    console.dir("NO se encuentra referencia anidada "+subPaths[k])
                                }
                                var val=nestedRef.getValue();
                                // Como dependemos del valor de este objeto, tenemos que "escuchar" cambios en su valor.
                                nestedRef.addListener("change",this,"onSourceExpressionChanged");            
                                if(val.isUnset())
                                    return null;
                                subPaths[k]=val;
                            }
                            pathSrc=subPaths.join();
        
                        }
                        var path=pathSrc.split("/");
                        var el;
                        if(path[0]=='..')
                        {                
                            el=this.parent.getPath(path,1);
                            
                        }
                        else
                            el=Siviglia.AutoUI.rootNode.getPath(path,1);
                        var mustSet=false;

                        if(!this.listeningTo)
                            mustSet=true;
                        else
                        {
                            if(this.listeningTo!=el)
                            {
                                this.listeningTo.removeListeners(this);
                                mustSet=true;
                            }
                            
                        }
                        if(mustSet)
                        {
                            this.listeningTo=el;
                            el.addListener("change",this,"onSourceExpressionChanged");
                        }

                        return el;
                },
                onSourceExpressionChanged:function()
                {

                },
                getSourceValues:function()
                {
                    var curVals=this.save();
                    var srcValObject=this.loadSource(this.definition["SOURCE"]);
                    var val=srcValObject.getReference();
                    var k;
                    var sVals=new Array();                    
                    var sourceExclusive=true;
                    var curVal;
                    if(this.definition.SOURCE_REPEAT) {
                        sourceExclusive=false;                        
                    }
                    else
                    {
                        curVal=this.save();
                        if(Siviglia.typeOf(curVal)!="array") {
                            curVal=[curVal];
                        }
                    }

                    var sVal;

                    
                        for(k=0;k<val.length;k++) {
                            sVal=val[k];
                            if(sourceExclusive && array_contains(curVal,sVal))
                               continue;

                            sVals.push({name:sVal,value:sVal});
                        }

                        console.debug("NVALS:::"+sVals.length);
                    return sVals;
                }                
            }
        },
        /**
         * ArrayType
         * 
         * @author ICSW (11/06/2012)
         */
        ArrayType:
        {
             inherits:'Siviglia.AutoUI.SourcedType',
            construct:function(definition,parent,value)
            {
                this.value=[];
                this.Node("ArrayType",definition,parent,value);
                this.SourcedType();
            },
            methods:{
                initSubType:function()
                {                                        
                },
                setValue:function(val)
                {
                    this.value=val;                    
                    this.unset=false;
                    this.fireEvent("change");
                                                                      
                },
                save:function()
                {
                    return this.value;                    
                },
                
                getReference:function()
                {
                   return this.value;
                   
                },
                getKey:function(key)
                {
                    return this.value[key];
                },
                getKeys:function()
                {
                    var res;
                    for(var k=0;k<this.value.length;k++) res.push(k);
                    return res;
                },
                add:function(val)
                {
                    if(!this.value)this.value=[];
                    
                    this.value.push(val);
                    if(this.unset)
                        this.unset=false;
                    this.fireEvent("change");
                },               
                removeItem:function(position)
                {
                    this.value.splice(position,1);
                    this.fireEvent("change");
                },
                setItem:function(val,position)
                {
                    this.value[position]=val;
                    this.fireEvent("change");
                },
                onSourceExpressionChanged:function()
                {
                    var srcValObject=this.loadSource(this.definition["SOURCE"]);
                    var val=srcValObject.getReference();
                    this.value=array_intersect(this.value,val);
                    this.fireEvent("change");
                }

            }

        },
        /**
         * SelectorType
         * 
         * @author ICSW (11/06/2012)
         */
        SelectorType:
        {
            inherits:'Siviglia.AutoUI.SourcedType',
             construct:function(definition,parent,value)
            {
                this.Node("SelectorType",definition,parent,value);
                this.options=[];
                this.SourcedType();
            },
            methods:{
                initSubType:function()
                {                    
                     
                },
                setValue:function(val)
                {
                    this.value=val;
                    this.unset=false;
                    this.fireEvent("change");
                                                                      
                },
                save:function()
                {

                    return this.value;

                }
            }
        },
        /**
         * DictionaryType
         * 
         * @author ICSW (11/06/2012)
         */
        DictionaryType:
        {

            inherits:'Siviglia.AutoUI.SourcedType',
            construct:function(definition,parent,value)
            {
                this.Node("DictionaryType",definition,parent,value);
                this.SourcedType();
                this.childType=this.definition.VALUETYPE;
                this.children={};
            },
            methods:{
                initSubType:function()
                {                                        
                },

                setValue:function(val)
                {
                    this.value=val;
                    
                    
                    for(var k in val)
                    {
                        var newInstance=Siviglia.AutoUI.NodeFactory({"TYPE":this.childType},this,val[k])
                        this.children[k]=newInstance;                            
                    }
                    this.unset=false;
                    this.fireEvent("change");
                                                                      
                },
                getKey:function(k)
                {
                    return this.children[k];
                },
                save:function()
                {
                    var v={};
                    for(var k in this.children)
                    {    
                        if(this.children[k].isUnset())
                             v[k]={};
                        else
                            v[k]=this.children[k].save();
                    }
                    return v;

                },
                getPath:function(path,position)
                {
                    var p=this.Node$getPath(path,position);
                    if(p) return p;
                    
                    if(this.children[path[position]]) 
                        return this.children[path[position]].getPath(path,position+1);
                        
                    return null;                    
                },
                getReference:function()
                {
                    var results=[];
                    for(var k in this.children)
                        results.push(k);
                    return results;
                },
                getKeys:function()
                {
                    return this.getReference();
                },
                add:function(newVal)
                {
                    if(this.children[newVal])
                    {
                        alert("Key already exists");
                        return;
                    }
                    this.children[newVal]=Siviglia.AutoUI.NodeFactory({"TYPE":this.childType},this,null);
                    this.fireEvent("change");
                },
                remove:function(key)
                {
                    this.children[key].destruct();
                    delete this.children[key];
                    this.fireEvent("change");
                }
            }
        },
        /**
         * TypeSwitcher
         * 
         * @author ICSW (11/06/2012)
         */
        TypeSwitcher:{
            inherits:'Siviglia.AutoUI.Node',
            construct:function(definition,parent,value)
            {
                this.subNode=null;
                this.Node("TypeSwitcher",definition,parent,value);
                this.currentType=null;
                
            },
            destruct:function()
            {
                this.subNode.destruct();
            },
            methods:
            {
                setValue:function(val)
                {
                    if(this.subNode)
                        this.subNode.destruct();
                    var typeField=this.definition.TYPE_FIELD;
                    subType=val[typeField];
                    this.currentType=val[typeField];
                    this.subNode=Siviglia.AutoUI.NodeFactory({"TYPE":subType},this,val);
                    this.unset=false;
                    this.fireEvent("change");
                },
                getValue:function()
                {
                    if(this.subNode && !this.subNode.isUnset())
                        return this.subNode.getValue();
                    return null;                        
                },
                save:function()
                {
                    if(this.subNode && !this.subNode.isUnset())
                        return this.subNode.save();
                    return null;                    
                },
                setType:function(typeName)
                {
                    var c={};
                    c[this.definition.TYPE_FIELD]=typeName;
                    this.setValue(c);
                },
                getAllowedTypes:function()
                {
                    var result=[];
                    for(var k=0;k<this.definition.ALLOWED_TYPES.length;k++)
                    {                        
                        var n=this.definition.ALLOWED_TYPES[k];
                        result.push({name:n,value:n});
                    }
                    return result;
                },
                getCurrentType:function()
                {
                    return this.currentType;
                },
                getSubNode:function()
                {
                    return this.subNode;
                }
            }

        },
        /**
         * ObjectArrayType
         * 
         * @author ICSW (11/06/2012)
         */
        ObjectArrayType:
        {
            inherits:'Siviglia.AutoUI.Node',
            construct:function(definition,parent,value)
            {
                this.value=[];
                this.children=[];
                this.Node("ObjectArrayType",definition,parent,value);
                
            },
            methods:{
                initSubType:function()
                {                                        
                },
                setValue:function(val)
                {
                    this.value=val;
                    if(this.children)
                    {
                        for(var k=0;k<this.children.length;k++)                        
                            this.children[k].destruct();
                        
                    }
                    for(var k=0;k<val.length;k++)
                    {
                        this.children.push(Siviglia.AutoUI.NodeFactory({"TYPE":this.definition.VALUETYPE},this,val[k]));
                    }
                    this.unset=false;
                    this.fireEvent("change");
                                                                      
                },
                save:function()
                {
                    if(this.unset)
                        return null;
                    var ret=[];
                    for(var k=0;k<this.children.length;k++)
                    {
                        ret[k]=this.children[k].save();
                    }
                    return ret;   
                },

                add:function()
                {
                    if(!this.children)this.children
                    var newNode=Siviglia.AutoUI.NodeFactory({"TYPE":this.definition.VALUETYPE},this,null);
                    this.children.push(newNode);
                    this.unset=false;
                    this.fireEvent("change");
                },               
                removeItem:function(position)
                {
                    this.children.splice(position,1);
                    this.fireEvent("change");
                },
                getReference:function()
                {
                    var res=[];
                    var nEls=this.children.length;
                    for(var k=0;k<nEls;k++) {
                        res.push(k);
                    }
                    return res;
                },
                getKey:function(key)
                {
                    return this.children[key];
                },
                getKeys:function()
                {
                    return this.getReference();
                }

            }
        }
    }

});
 
 
Siviglia.AutoUI.NodeFactory=function(definition,parent,value)
{
    var type=definition.TYPE;
    if(type[0]=="*")
    {
       type=type.substr(1);
       def=Siviglia.AutoUI.root.definitions[type];
       if(!def)
       {
           Siviglia.debug("Tipo no encontrado: *type");
           return null;
       }
       return Siviglia.AutoUI.NodeFactory(def,parent,value);
    }

    def=Siviglia.AutoUI.root.definitions[type];
    if(def)
        return new Siviglia.AutoUI.NodeFactory(def,parent,value);

    switch(type)
    {
        case "INTEGER":
        case "STRING":{return new Siviglia.AutoUI.StringType(definition,parent,value);}break;
        case "BOOLEAN":{return new Siviglia.AutoUI.BooleanType(definition,parent,value);}break;
        case "CONTAINER":{return new Siviglia.AutoUI.ContainerType(definition,parent,value);}break;     
        case "DICTIONARY":{return new Siviglia.AutoUI.DictionaryType(definition,parent,value);}break;  
        case "ARRAY":{return new Siviglia.AutoUI.ArrayType(definition,parent,value);}break;  
        case "KEYREFERENCE":{return new Siviglia.AutoUI.KeyReferenceType(definition,parent,value);}break;
        case "SELECTOR":{return new Siviglia.AutoUI.SelectorType(definition,parent,value);}break;        
        case "TYPESWITCH":{return new Siviglia.AutoUI.TypeSwitcher(definition,parent,value);}break;
        case "OBJECTARRAY":{return new Siviglia.AutoUI.ObjectArrayType(definition,parent,value);}break;
        default:{
            
            console.dir(definition);
        }
    }    
}
   
array_contains=function(haystack,needle)
{
     
    for(var i = 0; i < haystack.length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;

}
array_compare=function(total, partial,storeEq)
{
    if(!total)return [];
    if(!partial)return [];
    var k,j;
    var found=false;
    var result=[];
    for(k=0;k<total.length;k++)
    {
        found=false;
        for(j=0;j<partial.length;j++)
        {
            if(total[k]==partial[j])
            {
                found=true;
                break;
            }
        }
        if((found && storeEq ) || (!found && !storeEq))
         result[result.length]=total[k];       
    }
    return result;
}
array_intersect=function(total,partial)
{
    if(!total)return [];
    if(!partial)return [];
    return array_compare(total,partial,true);    
}

array_diff=function(total,partial)
{
    if(!total)return partial;
    if(!partial)return [];
    return array_compare(total,partial,false);
}

array_remove=function(arr,val)
{
    var k;
    for(k=0;k<arr.length;k++)
    {
        if(arr[k]==val)
        {
            arr.splice(k,1);
            return arr;
        }
    }
}


