
module.exports = function(room,visible){
    return;
    var visual=new RoomVisual(room.name);
    var nArray=[];
    for(var x=0;x<=49;x++){
        nArray[x]=[];
        for(var y=0;y<=49;y++)
            nArray[x][y]=0;
    }
    var creeps=room.find(FIND_CREEPS);
    for(i in creeps){
        var creep=creeps[i];
        nArray[creep.pos.x][creep.pos.y]=255*40;
    }
    if(!Memory.visitArray) Memory.visitArray={};
    if(!Memory.visitArray[room.name]){
        Memory.visitArray[room.name]=[];
        for(var x=0;x<=49;x++){
            Memory.visitArray[room.name][x]=[];
            for(var y=0;y<=49;y++){
                Memory.visitArray[room.name][x][y]=0;
                var nPos=new RoomPosition(x,y,room.name);
                if(_.filter(nPos.lookFor(LOOK_STRUCTURES),
                    object=>OBSTACLE_OBJECT_TYPES.indexOf(object.structureType)!=-1).length!=0
                    ||nPos.lookFor(LOOK_TERRAIN)=='wall'){
                    if(Memory.visitArray[room.name][x][y]!=undefined) delete Memory.visitArray[room.name][x][y];
                    continue;
                }
            }
        }
    }
    for(var x=0;x<=49;x++) for(var y=0;y<=49;y++){
        var nPos=new RoomPosition(x,y,room.name);
        /*
        if(_.filter(nPos.lookFor(LOOK_STRUCTURES),
            object=>OBSTACLE_OBJECT_TYPES.indexOf(object.structureType)!=-1).length!=0
            ||nPos.lookFor(LOOK_TERRAIN)=='wall'){
            if(Memory.visitArray[room.name][x][y]!=undefined) delete Memory.visitArray[room.name][x][y];
            continue;
        }
        */
        if(Memory.visitArray[room.name][x][y]==undefined) continue;
        var val=nArray[x][y];
        Memory.visitArray[room.name][x][y]=Memory.visitArray[room.name][x][y]*0.999+val*0.001;
        if(Memory.visitArray[room.name][x][y]<1) continue;
        var nnum=Math.max(Math.min(Math.floor(Memory.visitArray[room.name][x][y]),255),0);
        var nstr=(255-nnum).toString(16);
        if(nstr.length==1) nstr='0'+nstr;
        if(visible)visual.circle(x,y,{radius:0.15,opacity:nnum/512,fill:'#ff'+nstr+nstr});
    }
}
