
var getStructuresMatrix = require('function.getStructuresMatrix');
var battleGroup = {
    run:function(creep){
        //return;
        var members=Game.spawns[creep.memory.spawn].memory.lists['battleGroup'][creep.memory.behaviour];
        if(members[0]!=creep.name) return;
        var leader=creep;
        var target=leader.pos.findClosestByRange(FIND_STRUCTURES,{filter:structure=>structure.structureType==STRUCTURE_EXTENSION});
        if(target) leader.dismantle(target);
        leader.moveTo(target);
        return;
        var dxy=[{x:0,y:0},{x:-1,y:0},{x:0,y:1},{x:-1,y:1}];
        var ready=1;
        for(var i=0;i<=3;i++){
            creep=Game.creeps[members[i]];
            // creep.moveTo(new RoomPosition(28,21,"W46N32"));
            // continue;
            if(!creep||creep.spawning){ready=0;continue;}
            
            var toughs=_.filter(creep.body,o=>o.type==TOUGH);
            if(toughs.length!=_.filter(toughs,o=>o.boost!=undefined).length){
                //goto boost
                var lab=creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:l=>l.structureType==STRUCTURE_LAB&&l.mineralType&&l.mineralType in BOOSTS.tough});
                if(lab){
                    if(lab.boostCreep(creep)!=OK){
                        creep.moveTo(lab);
                    }
                }
                ready=0;
            }
        }
        // return;;
        for(var i=1;i<=3;i++){
            creep=Game.creeps[members[i]];
            if(!creep||creep.spawning){ready=0;continue;}
            
            var heals=_.filter(creep.body,o=>o.type==HEAL);
            if(heals.length!=_.filter(heals,o=>o.boost!=undefined).length){
                //goto boost
                var lab=creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:l=>l.structureType==STRUCTURE_LAB&&l.mineralType&&l.mineralType in BOOSTS.heal});
                if(lab){
                    if(lab.boostCreep(creep)!=OK){
                        creep.moveTo(lab);
                    }
                }
                ready=0;
            }
            else{
                //go together
                if(creep.room.name!=leader.room.name) continue;
                var tPos=new RoomPosition(leader.pos.x+dxy[i].x,leader.pos.y+dxy[i].y,leader.room.name);
                if(!tPos.isEqualTo(creep.pos)){
                    creep.moveTo(tPos);
                    ready=0;
                }
            }
        }
        
        var visual=new RoomVisual(roomName);
        var matrix=new PathFinder.CostMatrix,roomName=leader.room.name;
        console.log(leader.room.name);
        var structures=getStructuresMatrix(roomName);
        for(var x=0;x<50;x++) for(var y=0;y<50;y++){
            if(structures.get(x,y)==255||Game.map.getTerrainAt(x,y,roomName)=='wall'){
                matrix.set(x,y,255);
                continue;
            }
            else matrix.set(x,y,Game.map.getTerrainAt(x,y,roomName)=='swamp'?5:1);
        }
        var newMatrix=new PathFinder.CostMatrix;
        for(var x=0;x<50;x++) for(var y=0;y<50;y++){
            for(var i=0;i<4;i++){
                if(x+dxy[i].x<50&&y+dxy[i].y<50){
                    newMatrix.set(x,y,Math.max(newMatrix.get(x,y),matrix.get(x+dxy[i].x,y+dxy[i].y)));
                }
            }
            //visual.text(newMatrix.get(x,y).toString(),x,y,{color:'green',font:0.4,opacity:0.5});
            
        }
        if(!ready){
            console.log(leader.name);
            if(newMatrix.get(leader.pos.x,leader.pos.y)==255){
                console.log(leader.name,leader.move(Math.floor(Math.random()*8)+1));
                return;
            }
            //leader.moveTo(10,20);
            return;
        }
        var targetRoomName="W46N33";
        if(leader.room.name!=targetRoomName){
            var exit=Game.map.findExit(leader.room.name,targetRoomName);
                console.log("leader",leader.name,"goto exit",exit);
            if(exit>=0){
                console.log("leader",leader.name,"goto exit",exit);
                var exit=leader.pos.findClosestByPath(exit);
                console.log("leader",leader.name,"goto exit",exit);
                if(!exit) return;
                var path=leader.room.findPath(leader.pos,exit,{costCallback:function(roomName){return newMatrix;}});
                if(path.length){
                    for(i in members){
                       // if(!Game.creeps[members[i]])return;
                        if(Game.creeps[members[i]].fatigue!=0) return;
                    }
                    for(i in members){
                        Game.creeps[members[i]].move(path[0].direction);
                    }
                }
            }
            return;
        }
        var memberhits=[Game.creeps[members[0]].hits,Game.creeps[members[1]].hits,Game.creeps[members[2]].hits,Game.creeps[members[3]].hits];
        for(var i=1;i<4;i++){
            console.log(i,JSON.stringify(memberhits));
            var heal=Game.creeps[members[i]].getActiveBodyparts(HEAL)*12*3;
            for(var j=0;j<4;j++){
                console.log(i,"see",j,JSON.stringify(memberhits),heal);
                if(Game.creeps[members[j]].hitsMax-memberhits[j]>=heal){
                    Game.creeps[members[i]].heal(Game.creeps[members[j]]);
                    memberhits[j]+=heal;
                    console.log(i,"healed",j,JSON.stringify(memberhits));
                    break;
                }
            }
        }
        
        var target=leader.pos.findClosestByRange(FIND_STRUCTURES,{filter:structure=>structure.structureType==STRUCTURE_EXTENSION});
        if(target) leader.dismantle(target);
        else return;
        
        if(!target.pos.isNearTo(leader.pos)){
            console.log(target);
            var path=leader.room.findPath(leader.pos,target.pos,{costCallback:function(roomName){return newMatrix;}});
            if(path.length){
                for(i in members){
                    if(Game.creeps[members[i]].fatigue!=0) return;
                }
                for(i in members){
                    Game.creeps[members[i]].move(path[0].direction);
                }
            }
            // if(path.length) leader.move(path[0].direction);
            return;
        }
        
        
        
    }
};

module.exports=battleGroup;
