IDE={};
IDE.utils={};
IDE.initialize=function(definition)
{
    var c=new IDE.node(definition,null);       
    IDE.rootNode=c;    
}

IDE.setValue=function(val,definition)
{
    IDE.value=val;    
    IDE.rootNode.__setValue(val);    
}

IDE.utils.ArrayCompare=function(total, partial,storeEq)
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
IDE.utils.ArrayIntersect=function(total,partial)
{
    if(!total)return [];
    if(!partial)return [];
    return IDE.utils.ArrayCompare(total,partial,true);    
}
IDE.utils.ArrayDiff=function(total,partial)
{
    if(!total)return partial;
    if(!partial)return [];
    return IDE.utils.ArrayCompare(total,partial,false);
}
IDE.utils.ArrayRemove=function(arr,val)
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


IDE.debug=function(str)
{
    if(console)
        console.debug(str);
}
IDE.dir=function(val)
{
    if(console)
        console.dir(val);
}


IDE.node=function(definition,parent,value)
{
    this.init(definition,parent,value);
}
IDE.node.prototype.init=function(definition,parent,value)
{   
    if(value==undefined)
        this.__unset=true;
    else
        this.__unset=false; 
        
    if(typeof(parent)=='string')
    {
        alert("AQUI");
        this.__parent=this.__getReference(parent);
    }       
    else
        this.__parent=parent;
        
    this.__children=null;        
    if(!definition)
        IDE.debug("SIN DEFINICION");
    this.__sourceType=definition.TYPE;
    this.__showExpandButton=true;
    if(!parent)
        this.__drawExpanded=false;
    else
        this.__drawExpanded=parent.__drawExpanded;
        
    var baseDef=IDE.types.definitions[definition.TYPE];  
    
    var k;
    this.__definition={};    
        
    if(baseDef)
    {                    
        for(k in baseDef)
        {
            this.__definition[k]=baseDef[k];
        }
    }
    for(k in definition)
    {
        if(k!="TYPE" || (k=="TYPE" && !this.__definition["TYPE"]))
        {            
            this.__definition[k]=definition[k];
        }
    }    
         //*/
    //this.__definition=definition;
    this.__value=value;        
    this.__uinode=null;
    this.__listeners={};
    this.__type=IDE.types.Factory(this);    
            
}

IDE.node.prototype.__save=function()
{
    return this.__type.__save();
}
IDE.node.prototype.__paint=function()
{
    
    var wrapupNode;
    if(this.__uinode)
    {
         this.__uinode.innerHTML='';
         wrapupNode=this.__uinode;
    }   
    else
    {
        wrapupNode=document.createElement("div");    
    }
            
    wrapupNode.className=this.__definition["TYPE"]+"_container type_container "+this.__sourceType;
    if(this.__isUnset())
        wrapupNode.className+=" unset";
    else
    {
        this.__type.paintContents(wrapupNode);
    }
    
    if(this.__definition["LABEL"])
    {
    var labelNode=document.createElement("div");
    labelNode.className="label";
    labelNode.innerHTML=this.__definition["LABEL"];
    wrapupNode.appendChild(labelNode);
    }
    this.TypeNode=document.createElement("div");           
    this.TypeNode.className="type_contents";        
    if(!this.__type)
        console.dir(this.__definition);
    this.TypeNode.appendChild(this.__type.paint());
    wrapupNode.appendChild(this.TypeNode);
    this.__uinode=wrapupNode;
    return wrapupNode;
}
IDE.node.prototype.__onContract=function()
{
    
    this.className="expandButton";
    
    this._manager.TypeNode.className="contents_hidden";
    this.onclick=this._manager.__onExpand;
    
}
IDE.node.prototype.__onExpand=function()
{
    this.className="contractButton";
    this._manager.TypeNode.className='type_contents';
    this.onclick=this._manager.__onContract;
    
}


IDE.node.prototype.__getType=function(){return this.__definition["TYPE"]};
IDE.node.prototype.__getValue=function(){return this.__value}
IDE.node.prototype.__isUnset=function(){return this.__unset;}
IDE.node.prototype.__setValue=function(val)
{
    if(this.__parent)
    {
        if(this.__parent.__unset)
        {
            this.__parent.__unset=false;
        }
    }
    this.__unset=false;
    this.__value=val;
    if(this.__type)
        this.__type.setValue(val);
}
IDE.node.prototype.dispatchEvent=function(ev)
{
    if(this.__listeners[ev])
    {
        var k;
        for(k=0;k<this.__listeners[ev].length;k++)        
            this.__listeners[ev][k].method.call(this.__listeners[ev][k].object,this);        
    }
        
}
IDE.node.prototype.addListener=function(evName,object,methodName)
{
    if(!this.__listeners[evName])
        this.__listeners[evName]=[];
    this.__listeners[evName].push({object:object,method:methodName});
    
}
IDE.node.prototype.removeListener=function(evName,object,methodName)
{
        
}
IDE.node.prototype.__getReference=function(pathSrc)
{
    subPaths=pathSrc.split("@");
    this.__sourcePathExpression=pathSrc;
    
    if(subPaths.length>1)
    {
        var k;
        for(k=1;k<subPaths.length;k+=2)
        {
            var nestedRef=this.__getReference(subPaths[k]);
            if(!nestedRef)
            {
                IDE.debug("No se encuentra referencia anidada : "+nestedRef);
            }
            var val=nestedRef.__getValue();
            // Como dependemos del valor de este objeto, tenemos que "escuchar" cambios en su valor.
            nestedRef.addListener("change",this,__onSourceExpressionChanged)
            
            if(val.__isUnset())
                return null;
            subPaths[k]=val;
        }
        pathSrc=subPaths.join();
        
    }
    path=pathSrc.split("/");
    
    if(path[0]=='..')
    {                
        return this.__parent.__getPath(path,1);
    }
    else
        return IDE.rootNode.__getPath(path,1);
}

IDE.node.prototype.__onSourceExpressionChanged=function(node)
{
    this.__paint();
    //this.dispatchEvent("sourceExpressionChanged");    
}

IDE.node.prototype.__getPath=function(path,position)
{
    // Los nodos TYPESWITCH no consumen path, deben ser transparentes.
    if(this.__definition.type=="TYPESWITCH")
        return this.__parent.__getPath(path,position);
    
    if(position==path.length)
    {     
        return this;
    }
    if(path[position]=="..")
    {
        return this.__parent.__getPath(path,position+1);
    }    
    var k; 
    for(k in this.__value)
    {
        if(k==path[position])
        { 
            if(!this[k])
            {
                console.dir(path);
                console.debug(k);
            }                       
            return this[k].__getPath(path,position+1);
        }
    }
    return null;
}
    
IDE.node.prototype.__unset=function()
{    
    if(this.__value!=undefined)
        delete this.__value;
    this.dispatchEvent('delete');
    this.__paint();
}

IDE.types={};
IDE.types.definitions={};

IDE.types.Factory=function(node)
{
    switch(node.__getType())
    {
    case "INTEGER":
    case "_STRING":{return new IDE.types.StringType(node);}break;
    case "BOOLEAN":{return new IDE.types.BooleanType(node);}break;
        case "CONTAINER":{return new IDE.types.ContainerType(node);}break;     
        case "DICTIONARY":{return new IDE.types.DictionaryType(node);}break;  
        case "ARRAY":{return new IDE.types.ArrayType(node);}break;  
        case "KEYREFERENCE":{return new IDE.types.KeyReferenceType(node);}break;
        case "SELECTOR":{return new IDE.types.SelectorType(node);}break;        
        case "TYPESWITCH":{return new IDE.types.TypeSwitcher(node);}break;
        case "OBJECTARRAY":{return new IDE.types.ObjectArrayType(node);}break;
        default:{
            console.debug("UNKNOWN DEFINITION");
            console.dir(node.__definition);
        }
    }    
}


/**************************************************************************************
*     COMIENZO DE TIPO :: BASEType
**************************************************************************************/
IDE.types.BaseType=function(valNode){
    if(!valNode)
        return;
    if(!valNode.__value)
        valNode.__value={};
    this.empty=true;
    
    this.node=null;
    this.valNode=valNode;
    valNode.__type=this;
    if(this.valNode.__definition["FIELDS"])
    {
        this.valNode.__children=[];
        var k=0;
        for(k in this.valNode.__definition["FIELDS"])
        {
            if(valNode.__value && valNode.__value[k])            
            {
                var newNode=new IDE.node(this.valNode.__definition["FIELDS"][k],this.valNode,
                                         valNode.__value[k]);
            }
            else
            {
                console.debug("CREANDO COMPONENTE DE CONTAINER VACIO:"+k)
                var newNode=new IDE.node(this.valNode.__definition["FIELDS"][k],this.valNode);
            }
            
           
            this.valNode[k]=newNode;
            this.valNode.__value[k]=newNode;
            this.valNode.__children.push(k);
        }
    }
}
IDE.types.BaseType.prototype.createInput=function()
{
    this.node=document.createElement("div");
    
}
IDE.types.BaseType.prototype.paint=function()
{
    var baseNode=document.createElement("div");
    baseNode.classname="Type_holder";
    this.createInput();
    baseNode.appendChild(this.node);        
    return baseNode;
}

IDE.types.BaseType.prototype.hasSourceInput=function()
{
    return this.valNode.__definition["SOURCE"];
}
IDE.types.BaseType.prototype.initializeSourceInput=function()
{    
    
    this.refNode=this.valNode.__getReference(this.valNode.__definition["SOURCE"]);        
    if(!this.refNode)
    {
            IDE.debug(this.valNode.__definition["SOURCE"]);
    }
    this.refNode.addListener("change",this,this.onSourceChanged);
    this.refNode.addListener("keyrename",this,this.onKeyRenamed);
}
IDE.types.BaseType.prototype.onSourceChanged=function(node)
{
    // Hay que ver si alguna key de las que tenemos nosotros, ha sido eliminada en la fuente.
    // En ese caso, tenemos que eliminarla de nuestras keys, y , ademas, si existe como 
    // propiedad en este objeto, eliminarla.
    var k,j;
    var removedKeys=IDE.utils.ArrayDiff(this.valNode.__keys,node.__keys);
    
    if(removedKeys.length>0)
    {
        for(k=0;k<removedKeys.length;k++)
        {
            // Se ha eliminado algo.Si a ese algo simplemente le hacemos un delete,
            // es decir, lo eliminamos del objeto javascript, cualquier contenido que
            // haya por debajo, no va a poder notificar a objetos que dependan de el.
        
            // Esto va a hacer que necesitemos construir un sistema de "delete" mas tarde.
            
            // Se elimina la propiedad de ValNode.Esto ocurre si el objeto es un diccionario.
            if(this.valNode[removedKeys[k]])
            {
                
                delete(this.valNode[removedKeys[k]]);            
                delete this.valNode.__value[removedKeys[k]];
            }                    
                
        }
        
        
        this.valNode.__keys=IDE.utils.ArrayIntersect(node.__keys,this.valNode.__keys);        
        if(this.keys)
            this.keys=this.valNode.__keys;
            
        if(this.valNode.__definition.TYPE=="ARRAY")
            this.valNode.__value=this.valNode.__keys;
        // Si hemos borrado algo, este objeto lanza tambien un onchange
        this.valNode.dispatchEvent("change");
        
    }
    // finalmente, hay que repintar.
    this.valNode.__paint();    
}

IDE.types.BaseType.prototype.onKeyRenamed=function(node)
{
    
}

IDE.types.BaseType.prototype.createSourceInput=function()
{
    var newVals=this.filterSourceValues(this.refNode.__keys);
    this.newKeyNode=new IDE.node({"TYPE":"SELECTOR","LABEL":"Añadir","OPTIONS":newVals},null);        
}

IDE.types.BaseType.prototype.filterSourceValues=function(sourceValues)
{
    // Solamente podemos aniadir valores que existan en la fuente, pero que no existan en el elemento actual.
    var k,j,results;
    
    if(this.valNode.__isUnset())
        return sourceValues;
    
    return IDE.utils.ArrayDiff(sourceValues,this.valNode.__keys);    
}
IDE.types.BaseType.prototype.setValue=function(val)
{
}


/**************************************************************************************
*     COMIENZO DE TIPO :: STRINGType 
**************************************************************************************/

IDE.types.StringType=function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);    
}   

IDE.types.StringType.prototype=new IDE.types.BaseType;

IDE.types.StringType.prototype.empty=function(){return this.empty};
IDE.types.StringType.prototype.createInput=function()
{
    this.node=document.createElement("input");
    this.node.className="Type_string";
    if(this.valNode.__isUnset())    
        this.node.className+=" Type_unset"    
    else    
        this.node.value=this.valNode.__getValue();    
    
    this.node.manager=this;
    this.node.onchange=function(){
        this.manager.valNode.__setValue(this.value);
        this.manager.valNode.dispatchEvent("change");}
    return this.node;    
}
IDE.types.StringType.prototype.__save=function()
{
    return this.node.value;
}


/************************************************************************************
    COMIENZO DE TIPO: BooleanType


*/
IDE.types.BooleanType=function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);    
}  
IDE.types.BooleanType.prototype=new IDE.types.BaseType;

IDE.types.BooleanType.prototype.empty=function(){return this.empty};
IDE.types.BooleanType.prototype.createInput=function()
{
    this.node=document.createElement("input");
    this.node.type="CHECKBOX";
    this.node.className="Type_checkbox";
    if(this.valNode.__isUnset())    
        this.node.className+=" Type_unset"    
    else    
        this.node.value=this.valNode.__getValue();    
    
    this.node.manager=this;
    this.node.onchange=function(){
        this.manager.valNode.__setValue(this.value);
        this.manager.valNode.dispatchEvent("change");}
    return this.node;    
}
IDE.types.BooleanType.prototype.__save=function()
{
    return this.node.value;
}
/**************************************************************************************
*     COMIENZO DE TIPO :: CONTAINERType
*     Un container contiene claves definidas.Indicado para definiciones con un numero
*     concreto de campos (tipo, objeto, etc)
**************************************************************************************/

IDE.types.ContainerType = function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);    
    
}
IDE.types.ContainerType.prototype=new IDE.types.BaseType;

IDE.types.ContainerType.prototype.__save=function()
{
    var result={};
    var k;
    for(k in this.valNode.__children)
    {    
        if(!this.valNode[this.valNode.__children[k]].__isUnset())
            result[this.valNode.__children[k]]=this.valNode[this.valNode.__children[k]].__save();
        else
            console.debug(this.valNode.__children[k]+" NO ESTA DEFINIDO");
    }
    return result;

}
IDE.types.ContainerType.prototype.setValue=function(val)
{
    if(this.valNode.__childen)
        delete this.valNode.__children;

    for(k in val)
    {
        // def, parent, value.
        this.valNode.__children[k]=new IDE.node(this.valNode.definition[k],this.valNode,val[k]);
    }
}

IDE.types.ContainerType.prototype.createInput=function()
{
    this.node=document.createElement("div");
    this.node.className="Type_container";
    var k;    
    for(k in this.valNode.__children)
    {    
        this.node.appendChild(this.valNode[this.valNode.__children[k]].__paint());
    }
    return this.node;    
}

/*************************************************************************************
*    TIPO : DICTIONARY
*    Un dictionary contiene un numero indefinido de elementos, cada uno de los
*    cuales tiene una misma definicion.Cada objeto tiene una label asociada.
*    Si la definicion tiene un SOURCE, las keys tienen que pertenecer a ese source.
* 
*/
IDE.types.DictionaryType=function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);            
    this.keys=[];
    
    this.init();
    
}
IDE.types.DictionaryType.prototype=new IDE.types.BaseType;

IDE.types.DictionaryType.prototype.init=function()
{    
    
    var valNode=this.valNode;
    var val=valNode.__value;
    
    
    // Aunque tecnicamente, el valor de este objeto es un array de claves,
    // su representacion javascript es  un objeto json (diccionario).
    // El objeto Dictionary se encarga de mantener este array de claves, añadirlas y 
    // borrarlas, y notificar al respecto.
    // A la vez, para que la navegacion por los valores sea simple, se mapean estas claves
    // como atributos de valNode.
    
    // Ademas, este objeto tiene que incluir que definicion es la de los subelementos.
    // Por ahora, esta subdefinicion va a suponerse que esta dentro de la definicion del
    // objeto actual.Luego, que las definiciones se puedan encontrar en un array global o algo asi.
    
    
    var fieldDef=valNode.__definition.VALUETYPE;
    
    if(val) // val es un objeto.Las claves son nombres
    {
        var k;
        for(k in val)
        {
            // Se guarda como valor
            this.keys.push(k);
            this.valNode[k]=new IDE.node(fieldDef,this.valNode,
                                         val[k]);                                         
        }        
        this.valNode.__keys=this.keys;
    }
    else
        this.valNode.__keys=[];
        
        
}
IDE.types.DictionaryType.prototype.setValue=function(val)
{
    var k;
    if(this.valNode.__childen)
        delete this.valNode.__children;

    var fieldDef=this.valNode.__definition.VALUETYPE;

    if(!this.valNode.__children)
        this.valNode.__children=[];
    targetDef=IDE.types.definitions[fieldDef.TYPE];
    console.dir(targetDef);
    for(k in val)
    {
        // def, parent, value.
        this.valNode.__children[k]=new IDE.node(targetDef,this.valNode,val[k]);
    }
}


IDE.types.DictionaryType.prototype.__save=function()
{
    var result={};
    var k;
    for(k=0;k<this.keys.length;k++)
    {    
        if(!this.valNode[this.keys[k]].__isUnset())
            result[this.keys[k]]=this.valNode[this.keys[k]].__save();
    }
    return result;

}

IDE.types.DictionaryType.prototype.onNewItem=function(node)
{
    var newKey=this.newKeyNode.__value;
    // Se crea un nuevo nodo.
    this.newKeyNode.__setValue('');
    var newNode=new IDE.node(this.valNode.__definition.VALUETYPE,this.valNode); 
    newNode.__unset=false;
    var value=this.valNode.__getValue();
    if(!value)
    {
        value={};
    }
    this.keys[this.keys.length]=newKey;
    this.valNode[newKey]=newNode;
    this.valNode.__keys=this.keys;
    this.valNode.__value[newKey]=null;
    this.valNode.__paint();
    this.valNode.__unset=false;
    this.valNode.dispatchEvent("change");    
}

IDE.types.DictionaryType.prototype.layout2Columns=function()
{
    this.node=document.createElement("div");
    this.node.className="Type_dictionary dictionary_2columns";
    var keyListNode=document.createElement("div");
    keyListNode.className="keyList";
    var editKeyNode=document.createElement("div");
    editKeyNode.className="currentKey";
    this.node.appendChild(keyListNode);
    this.node.appendChild(editKeyNode);
    
    var addItemNode=document.createElement("div");
    addItemNode.className="newitem";
    addItemNode.appendChild(this.newKeyNode.__paint());
    keyListNode.appendChild(addItemNode);
    
    
    var currentKeys=document.createElement("div");
    currentKeys.className="current_keys";
    keyListNode.appendChild(currentKeys);
    var fieldNode;
    
    var k;
    
    for(k=0;k<this.keys.length;k++)
    {    
        fieldNode=document.createElement("div");    
        fieldNode.className="Type_dictionary_key";        
        titleNode=document.createElement("div");
        contentNode=document.createElement("div");
        
        titleNode.className="title";
        titleNode.__showStatus='hidden';
        titleNode.style.cursor='pointer';
        titleNode.__content=contentNode;
        titleNode.onclick=function()
        {
            if(editKeyNode.__curShown)
            {
                editKeyNode.__curShown.style.display='none';
                editKeyNode.__curShownLabel.className='title';
            }
            
            editKeyNode.__curShown=this.__content;
            editKeyNode.__curShownLabel=this;
            this.__content.style.display='block';            
            this.className="title title_selected";
            
        }        
        titleNode.innerHTML=this.keys[k];
        fieldNode.appendChild(titleNode);        
        deleteButton=document.createElement("input");
        deleteButton.manager=this;
        deleteButton.type="button";
        deleteButton.managerValue=this.keys[k];
        deleteButton.className="deleteButton";
        deleteButton.onclick=this.removeValue;
        fieldNode.appendChild(titleNode);
        fieldNode.appendChild(deleteButton);
    
                                    
        contentNode.className="content";                
        this.valNode[this.keys[k]].__showExpandButton=false;
        this.valNode[this.keys[k]].__drawExpanded=true;       
        contentNode.appendChild(this.valNode[this.keys[k]].__paint());
        fieldNode.appendChild(contentNode);        
        currentKeys.appendChild(fieldNode);
        editKeyNode.appendChild(contentNode);                     
    }    
}
IDE.types.DictionaryType.prototype.createInput=function()
{

    // Creo un nodo de tipo string, que me va a servir para introducir nuevas claves.
    if(!this.hasSourceInput())    
    {
        this.newKeyNode=new IDE.node({"TYPE":"_STRING","LABEL":"Nuevo elemento"},null);
        this.newKeyNode.addListener("change",this,this.onNewItem);        
    }
    
    
    if(this.hasSourceInput())
    {
        this.initializeSourceInput();
        //this.newKeyNode.addListener("change",this,this.onNewItem);        
    }
    if(this.valNode.__definition.DISPLAY)
    {
        if(this.valNode.__definition.DISPLAY=="2COLUMNS")
            return this.layout2Columns();
    }
    
    this.node=document.createElement("div");
    this.node.classname="Type_dictionary";
    var titleNode;
    var contentNode;              
    var fieldsNode;      
    fieldsNode=document.createElement("div");
    fieldsNode.className="contents";
    this.node.appendChild(fieldsNode);
        
    var addItemNode=document.createElement("div");
    addItemNode.className="newitem";
    addItemNode.appendChild(this.newKeyNode.__paint());
    
    fieldsNode.appendChild(addItemNode);
        
    var k;    
    var fieldNode;
    
    for(k=0;k<this.keys.length;k++)
    {    
        fieldNode=document.createElement("div");
    
        fieldNode.className="Type_dictionary_key";        
        titleNode=document.createElement("div");
        titleNode.className="title";
        titleNode.innerHTML=this.keys[k];
        fieldNode.appendChild(titleNode);
        
        deleteButton=document.createElement("input");
        deleteButton.manager=this;
        deleteButton.type="button";
        deleteButton.managerValue=this.keys[k];
        deleteButton.className="deleteButton";
        deleteButton.onclick=this.removeValue;
        titleNode.appendChild(deleteButton);        
        contentNode=document.createElement("div");
        contentNode.className="content";                
        contentNode.appendChild(this.valNode[this.keys[k]].__paint());
        fieldNode.appendChild(contentNode);        
        fieldsNode.appendChild(fieldNode);        
    }
    
    this.node.appendChild(fieldsNode);  
    // Se añade un div .. para la guarrada de css.
    var clearDiv=document.createElement("div");
    clearDiv.className="doClear";
    fieldsNode.appendChild(clearDiv);  
    return this.node;    
}
IDE.types.DictionaryType.prototype.removeValue=function()
{
    var valNode=this.manager.valNode;
    if(valNode.__isUnset())
        return;
    this.manager.keys=IDE.utils.ArrayRemove(this.manager.keys,this.managerValue);
    if(this.manager.keys.length==0)
    {
        valNode.__unset=true;
    }
    valNode.__keys=this.manager.keys;
    delete valNode.__value[this.managerValue];
    delete valNode[this.managerValue];
    
    valNode.__paint();
    valNode.dispatchEvent("change");
}


/*************************************************************************************
*    TIPO : ARRAY
*    Un dictionary contiene un numero indefinido de elementos, todos ellos de tipo STRING 
*/
IDE.types.ArrayType=function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);           
    this.valNode.__keys=this.valNode.__value;
     
    if(!this.hasSourceInput())    
    {
        this.newKeyNode=new IDE.node({"TYPE":"_STRING","LABEL":"Nuevo elemento"},null);
        this.newKeyNode.addListener("change",this,this.onNewItem);        
    }
    else    
        this.initializeSourceInput();        
    
    
}
IDE.types.ArrayType.prototype=new IDE.types.BaseType;

IDE.types.ArrayType.prototype.__save=function()
{
    return this.valNode.__getValue();

}


IDE.types.ArrayType.prototype.onNewItem=function(node)
{
    var newKey=this.newKeyNode.__value;
    // Se crea un nuevo nodo.
    this.newKeyNode.__setValue('');
    
    if(this.valNode.__isUnset())
        this.valNode.__setValue([newKey]);
    else
        {
            var val=this.valNode.__getValue();
            val.push(newKey);
            this.valNode.__setValue(val);
        }               
    this.valNode.__keys=this.valNode.__value;
    
    this.valNode.__paint();
    this.valNode.dispatchEvent("change");    
}
IDE.types.ArrayType.prototype.setValue=function(val)
{

    this.valNode.__value=val;                
    this.valNode.__keys=this.valNode.__value;
    

}

IDE.types.ArrayType.prototype.createInput=function()
{
    this.node=document.createElement("div");
    this.node.classname="Type_keycontainer";
    var titleNode;
    var contentNode;      
    if(this.hasSourceInput())
    {
        this.createSourceInput();
        this.newKeyNode.addListener("change",this,this.onNewItem);     
    }
    
    fieldsNode=document.createElement("div");
    fieldsNode.classname="contents";
    this.node.appendChild(fieldsNode);    
    var addItemNode=document.createElement("div");
    addItemNode.className="newitem";
    addItemNode.appendChild(this.newKeyNode.__paint());    
    fieldsNode.appendChild(addItemNode);        
    if(this.valNode.__isUnset())
        return this.node;
        
    var k;    
    var fieldNode;
    var valueNode;
    var vals=this.valNode.__getValue();
    var deleteButton;
    for(k=0;k<vals.length;k++)
    {    
        fieldNode=document.createElement("div");
        fieldNode.classname="Type_Array_Value";
        valueNode=document.createElement("input");
        // Si tenemos un source, no se pueden editar estos elementos.
        if(this.valNode.__definition["SOURCE"])
        {
            
            valueNode.disabled=true;
        }
        valueNode.manager=this;
        valueNode.currentValue=vals[k];
        valueNode.value=vals[k];
        fieldNode.appendChild(valueNode); 
        // Boton de delete
        deleteButton=document.createElement("input");
        deleteButton.manager=this;
        deleteButton.type="button";
        deleteButton.managerValue=vals[k];
        deleteButton.className="deleteButton";
        deleteButton.onclick=this.removeValue;
        fieldNode.appendChild(deleteButton);
        fieldsNode.appendChild(fieldNode);
        
    }
    
    this.node.appendChild(fieldsNode);    
    return this.node;    
}
IDE.types.ArrayType.prototype.removeValue=function()
{
    var valNode=this.manager.valNode;
    if(valNode.__isUnset())
        return;
    valNode.__value=IDE.utils.ArrayRemove(valNode.__value,this.managerValue);
    valNode.__paint();
    valNode.dispatchEvent("change");
}

/****************************************************************************************
* DEFINITION DE INPUT KEYREFERENCE
* Una keyreference tiene como valor una key de un keyContainer.
* Esto significa que tiene que haber una forma de obtener una referencia a ese keyContainer,
* a traves de un path.
* Este path podria ser relativo (desde el nodo actual), o absoluto, siendo el nodo raiz
* un nodo imaginario "aplicacion", a partir del cual se tendria acceso a cualquier nodo
* del sistema.Ej:
* /objects/user/views/login  o  /pages/sections/3/home
* Un ejemplo de path relativo seria algo asi como ../FIELDS, siendo FIELDS un KeyContainer.
* Logicamente, los objetos de este tipo tienen que estar preparados para reaccionar ante
* cambios en el KeyContainer al que pertenecen.
*/

IDE.types.KeyReferenceType=function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);    
    var val=valNode.__value;
    this.keys=null;
    var val=valNode.__value;    
    this.sourceNode=null;
    this.selectInput=null;
}

IDE.types.KeyReferenceType.prototype=new IDE.types.BaseType;

IDE.types.KeyReferenceType.prototype.fillSelect=function()
{
    var i;
    var nItems=this.selectInput.childNodes.length;
    for(i=0;i<nItems;i++)
        this.selectInput.removeChild(this.selectInput.childNodes[0]);
    
    var k;    
    var opt;
    // Se introduce un valor vacio.
    opt=document.createElement("option");
    opt.value="-99999999";
    opt.innerHTML="";
    this.selectInput.appendChild(opt);
    for(k in this.sourceNode.__value)
    {
        opt=document.createElement("option");
        opt.value=k;
        opt.innerHTML=k;
        if(this.valNode.__value==k)
            opt.selected=true;
       this.selectInput.appendChild(opt); 
    }
    this.selectInput.manager=this;
    this.selectInput.onchange=function()
    {
        var k;
        for(k=0;k<this.options.length;k++)
        {
            if(this.options[k].selected)
            {
                this.manager.valNode.__setValue(this.options[k].value);
                return;
            }
            this.manager.valNode.__unset=true;
        }
    }
}
IDE.types.KeyReferenceType.prototype.__save=function()
{
    return this.valNode.__value;    
}


IDE.types.KeyReferenceType.prototype.createInput=function()
{   
    if(!this.sourceNode)
    { 
        this.sourceNode=this.valNode.__getReference(this.valNode.__definition["KEYSOURCE"]);
    
        if(!this.sourceNode)
        {
            IDE.debug(this.valNode.__definition["KEYSOURCE"]);
        }
        else
            this.sourceNode.addListener("change",this,this.fillSelect);
    }
    
    var cDiv=document.createElement("div");
    cDiv.classname='Type_KeyReference';
    
    if(!this.selectInput)
    {
        this.selectInput=document.createElement("select");
        this.fillSelect();        
    }
    cDiv.appendChild(this.selectInput);
        
    this.node=cDiv;
    return cDiv;
}
/************************************************************************************
* Tipo selector.Recibe las opciones de un array.
*/

IDE.types.SelectorType=function(valNode)
{
    
    this.base=IDE.types.BaseType;
    this.base(valNode);        
    this.def=valNode.__definition;        
}
IDE.types.SelectorType.prototype=new IDE.types.BaseType;

IDE.types.SelectorType.prototype.getSelected=function()
{
    var k;
    for(k=0;k<this.node.childNodes.length;k++)
    {
        if(this.node.childNodes[k].selected)
            return this.node.childNodes[k].value;
    }
    return null;
}
IDE.types.SelectorType.prototype.fillOptions=function()
{
    var opt;
    opt=document.createElement("option");
    opt.value="-99999999";
    if(this.valNode.__value==this.valNode.__value)
        opt.selected=true;
    this.node.appendChild(opt);
    for(k in this.def.OPTIONS)
    {
        opt=document.createElement("option");
        var val=this.def.OPTIONS[k];
        opt.innerHTML=k;
        opt.value=val;
                
        if(this.valNode.__value==val)
            opt.selected=true;
        this.node.appendChild(opt);                        
    }
    
}
IDE.types.SelectorType.prototype.__save=function()
{
    return this.value;
}

IDE.types.SelectorType.prototype.createInput=function()
{
    var curVal="-99999999";
    if(this.valNode.__isUnset())
    {
        if(this.def.DEFAULT)
             curVal=this.def.DEFAULT;
    }
    else
        curVal=this.valNode.__value;
    this.value=curVal;
    
    var cSelect=document.createElement("select");
    this.node=cSelect;
    cSelect.manager=this;
    cSelect.onchange=function()
    {
        val=this.manager.getSelected();
        if(val=="-99999999")
        {            
           this.manager.valNode.__unset=true;            
        }
        else
           this.manager.valNode.__setValue(val);
        this.manager.valNode.dispatchEvent("change");
    };    
    this.fillOptions();
    return cSelect;            
}

/************************************************************************************
*  El tipo TypeSwitcher permite que, dependiendo del valor de un campo, se use
* una definicion u otra de un tipo.
* Logicamente, esto hace que un elemento en blanco (null), o nuevo, al menos tenga
* un campo, que es el propio campo que define el tipo.
* En el objeto TypeSwitcher se va a almacenar el valor inicial recibido, y, en caso de que
* se edite el tipo del objeto, (lo cual haria que se invalidaran los valores iniciales), y
* se vuelva al inicial, se cargue lo que habia inicialmente.
* 
* Es decir. Supongamos que tenemos un array, que puede contener elementos de varios tipos
* distintos.
* 
* La estructura creada es : un nodo container (el array), y por cada uno de los elementos
* del array, se crea un nodo TypeSwitcher.Este nodo TypeSwitcher, a su vez, contiene un nodo
* que representa el tipo que actualmente tiene ese elemento hijo.
* Si se cambia el tipo del elemento hijo, el TypeSwitcher se mantiene, y crea un nuevo nodo
* que representa el nuevo tipo.
* Graficamente, es algo asi:
* 
*  Si la estructura es [{"TYPE":"INT"},{"TYPE":"_STRING"}]
*  Y cambiamos el tipo del segundo elemento, de STRING a INT, la estructura generada es:
* 
* Container    TypeSwitcher    Diferentes nodos segun tipo
*    []-----------[]--------|-------[]  <--Nodo de tipo "INT"
*                  |        
*                  |
*                 []--------|--------[] <--Nodo de tipo "_STRING" (el original)
*                           |--------[] <--Nodo de tipo "INT" (creado al cambiar el tipo)
* 
* Logicamente, el padre real de los "nodos segun tipo", es el Container, no el TypeSwitcher.
* Por eso, al ir creando esos nodos dentro del TypeSwitcher, el padre que se le pasa es
* el container, no el propio TypeSwitcher.
*/

IDE.types.TypeSwitcher=function(valNode)
{    
    this.base=IDE.types.BaseType;
    this.base(valNode);    
    var val=valNode.__value;
    this.typeField=valNode.__definition.TYPE_FIELD;
    this.allowedTypes=valNode.__definition.ALLOWED_TYPES; 
    this.savedValues={};   
    if(!valNode.__isUnset())
    {
        this.currentType=val[this.typeField];
        // Aqui creamos la vista del nodo, con el tipo actual.
        //         
        this.savedValues[this.currentType]=new IDE.node(this.getTypeDefinition(this.currentType),
                                                        valNode.__parent,
                                                        valNode.__value);
    }
    else
        this.currentType=null;
}
IDE.types.TypeSwitcher.prototype=new IDE.types.BaseType;

IDE.types.TypeSwitcher.prototype.getTypeDefinition=function(def)
{
    var k;  

    for(k=0;k<this.allowedTypes.length;k++)
    {
        if(this.allowedTypes[k].TYPE==def)
        {            
            return IDE.types.definitions[this.allowedTypes[k].TYPE];                                
        }
        if(this.allowedTypes[k].TYPE=="DEF_"+def)
        {
            return IDE.types.definitions[this.allowedTypes[k].TYPE];                                

        }
    }
    IDE.debug("PEDIDO TIPO EN TYPESWITCHER, PERO NO EXISTE DEFINICION:"+def);
    return null;    
}
IDE.types.TypeSwitcher.prototype.setValue=function(val)
{
    var k;
    for(k=0;k<this.allowedTypes.length;k++)
    {
        if(this.allowedTypes[k].TYPE==val[this.typeField])
        {

            if(this.valNode.__childen)
                delete this.valNode.__children;

            this.currentType=this.allowedTypes[k].type;
                // def, parent, value.
                this.savedValues[this.typeField]=new IDE.node(this.getTypeDefinition(this.currentType),
                                                        this.valNode.__parent,
                                                        val);                        
            return;
        }
    }
    
}

IDE.types.TypeSwitcher.prototype.__save=function()
{
    var res= this.savedValues[this.currentType].__save();
    res.TYPE=this.currentType;
    return res;
}

IDE.types.TypeSwitcher.prototype.onTypeChange=function(node)
{
    // Se ha cambiado el tipo.Hay que hacer varias cosas aqui.
    // Guardar el valor actual del objeto, para el tipo actual.
    // Hay que destruir todas las propiedades (subobjetos) que tenia este objeto.
    // En caso de que hubiera un valor almacenado para este objeto, con este tipo, cargarlo.
    // Repintar el objeto.
        
    
    // Se almacena el tipo nuevo (node aqui es el selector de tipo)
    
    
    if(node.__isUnset())
    {        
        this.currentType=null;
    }
    else
    {
        this.currentType=this.allowedTypes[parseInt(node.__value)].TYPE;
        

        
        if(!this.savedValues[node.__value])
        {
            this.savedValues[this.currentType]=new IDE.node(this.getTypeDefinition(this.currentType),
                                                        this.valNode.__parent);
            this.savedValues[this.currentType].__unset=false;
                                                        //this.valNode=this.savedValues[this.currentType];        
        }
    }
        this.valNode.__unset=(this.currentType==null);
    // Se repinta el contenedor del valor
    this.currentValueContainer.innerHTML='';
    if(this.currentType!=null)
        this.currentValueContainer.appendChild(this.savedValues[this.currentType].__paint());    
}

IDE.types.TypeSwitcher.prototype.createTypeSelector=function()
{    
    var options=[];
    var k;
    var val;
    for(k=0;k<this.allowedTypes.length;k++)
    {
        if(this.currentType==this.allowedTypes[k]["TYPE"])
            val=k;
        options[this.allowedTypes[k]["LABEL"]]=k;
    }
     var typeSelectorDef={
         "TYPE":"SELECTOR",
         "OPTIONS":options,
         "LABEL":"Tipo"
     };

     if(val==null)
        val="-99999999";
     
     this.selectorNode=new IDE.node(typeSelectorDef,null,val);
     this.selectorNode.addListener("change",this,this.onTypeChange)
     return this.selectorNode.__paint();          
}

IDE.types.TypeSwitcher.prototype.createInput=function()
{
    
    this.node=document.createElement("div");
    this.node.appendChild(this.createTypeSelector());
    this.currentValueContainer=document.createElement("div");
    if(this.currentType)
    {
        this.currentValueContainer.appendChild(this.savedValues[this.currentType].__paint());    
    }
    this.node.appendChild(this.currentValueContainer);
    
    return this.node;    
}

/*********************************************************************************************************
*  TIPO : OBJECTARRAY
*  Un array de objetos (como un diccionario, sin claves)
*/
IDE.types.ObjectArrayType=function(valNode)
{
    this.base=IDE.types.BaseType;
    this.base(valNode);       
    var k;
    if(valNode.__isUnset())
        return;

    valNode.__children=[];        
    for(k=0;k<valNode.__value.length;k++)
    {
        valNode.__children[k]=new IDE.node(this.valNode.__definition.VALUETYPE,valNode,valNode.__value[k]);
    }   
}

IDE.types.ObjectArrayType.prototype=new IDE.types.BaseType;
IDE.types.ObjectArrayType.prototype.__save=function()
{
    var result=[];
    var k=0;
    for(k=0;k<this.valNode.__children.length;k++)
    {
        if(!this.valNode.__children[k].__isUnset())
        {
            result.push(this.valNode.__children[k].__save());
        }
        
    }
    return result;
}
IDE.types.ObjectArrayType.prototype.onNewItem=function(node)
{
    var newNode=new IDE.node(this.valNode.__definition.VALUETYPE,this.valNode);    
    if(!this.valNode.__children)
        this.valNode.__children=[];
    this.valNode.__children.push(newNode);            
    this.valNode.__setValue(this.valNode.__children);
    this.valNode.__paint();
    this.valNode.dispatchEvent("change");    
}
IDE.types.ObjectArrayType.prototype.setValue=function(val)
{
    var k;
    if(!this.valNode.__children)
        this.valNode.__children=[];


    for(k=0;k<val.length;k++)
    {
        this.valNode.__children.push(new IDE.node(this.valNode.__definition.VALUETYPE,
                                                  this.valNode,
                                                  val[k]));
    }
    
}


IDE.types.ObjectArrayType.prototype.createInput=function()
{
        
    this.node=document.createElement("div");
    this.node.classname="Type_objectArray";
    var titleNode;
    var contentNode;                    
    fieldsNode=document.createElement("div");
    fieldsNode.classname="contents";
    this.node.appendChild(fieldsNode);
            
        
    if(!this.valNode.__isUnset())
    {    
        var k;    
        var fieldNode;
    
        for(k=0;k<this.valNode.__children.length;k++)
        {    
            fieldNode=document.createElement("div");
            
            deleteButton=document.createElement("input");
            deleteButton.manager=this;
            deleteButton.type="button";
            deleteButton.managerValue=k;
            deleteButton.className="deleteButton";
            deleteButton.onclick=this.removeValue;
            fieldNode.appendChild(deleteButton);
                
            contentNode=document.createElement("div");
            contentNode.className="content";                
            contentNode.appendChild(this.valNode.__children[k].__paint());
            fieldNode.appendChild(contentNode);
            fieldsNode.appendChild(fieldNode);        
        }
    }
    var addItemNode=document.createElement("input");
    addItemNode.type="button";
    addItemNode.className="newitem";    
    addItemNode.valNode=this.valNode;    
    addItemNode.onclick=this.onNewItem;
    this.node.appendChild(addItemNode);
    
    this.node.appendChild(fieldsNode);  
    // Se añade un div .. para la guarrada de css.
    var clearDiv=document.createElement("div");
    clearDiv.className="doClear";
    fieldsNode.appendChild(clearDiv);  
    return this.node;    
}

IDE.types.ObjectArrayType.prototype.removeValue=function()
{
    var valNode=this.manager.valNode;
    if(valNode.__isUnset())
        return;
    
    
    valNode.__children.splice(this.managerValue,1);    
    if(valNode.__children.length==0)
    {
        valNode.__value=null;
        valNode.__unset=true;
    }
    else
        valNode.__setValue(valNode.__children);
    valNode.__paint();
    valNode.dispatchEvent("change");
}

