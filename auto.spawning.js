const consts = require('consts');
const maxSpawn=consts.maxSpawn;
const template=consts.template;
var autoSpawning = {
    spawnA: function(spawn,role){
        if(spawn.memory.lists==undefined) spawn.memory.lists={};
        if(spawn.memory.lists[role]==undefined) spawn.memory.lists[role]={};
        const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
        for(var id=0;id<maxSpawn[spawn.name][role];id++){
            const listCreep=spawn.memory.lists[role][id];
            const Ntemplate=template[spawn.name][role][id];
            if(Ntemplate==null) continue;
            if(listCreep==null||Game.creeps[listCreep]==null||
                Game.creeps[listCreep].ticksToLive<
                Game.map.getRoomLinearDistance(spawn.room.name,Game.creeps[listCreep].room.name)*50
                +Memory.constReactTime+Ntemplate.length*3
                ){
                var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+id;
                if(spawn.spawnCreep(Ntemplate, newName, 
                    {memory: {role: role,spawn:spawn.name,behaviour:id}})==OK){
                        console.log('Spawning new '+upperRole+': ' + newName);
                        spawn.memory.lists[role][id]=newName;
                    }
                return 0;
            }
        }
    },
    spawnB: function(spawn,role){
        const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role&&creep.room.name==spawn.room.name);
        //console.log('Harvesters: ' + harvesters.length);
    
        if(creeps.length < maxSpawn[spawn.name][role]) {
            var beh=Math.round(Math.random());
            var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+beh;
            if(spawn.spawnCreep(template[spawn.name][role][beh], newName, 
                {memory: {role: role,spawn:spawn.name,behaviour:beh}})==OK){
                    console.log('Spawning new '+role+': ' + newName);
                }
            return 0;
        }
    },
    run: function(spawn){
        // for(arr in spawn.memory.lists) if(maxSpawn[arr]&&spawn.memory.lists[arr].length>maxSpawn[arr]){
        //     spawn.memory.lists[arr]=_.slice(spawn.memory.lists[arr],0,maxSpawn[arr]);
        // }
        for(var role in maxSpawn) if(spawn.memory.lists&&spawn.memory.lists[role]) for(var id=0;id<spawn.memory.lists[role].length;id++){
            const listCreep=spawn.memory.lists[role][id];
            if(id>=maxSpawn[role]||listCreep==null||Game.creeps[listCreep]==null) delete spawn.memory.lists[role][id];
        }
        if(spawn.spawning) {
            spawn.spawning.setDirections([BOTTOM_RIGHT,BOTTOM_LEFT,TOP_LEFT,TOP_RIGHT]);
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' 
                + spawningCreep.memory.role + '('+(100-Math.round((spawn.spawning.remainingTime-1)/spawn.spawning.needTime*100))+'%)',
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8}).text(
                '📝️' + spawningCreep.name,
                spawn.pos.x + 1, 
                spawn.pos.y + 1, 
                {align: 'left', opacity: 0.8});
        }
        if(spawn.memory.needRenew.time>=Game.time-1) return -9999;
        if(!spawn.spawning) {
            //if(spawn.id=='5b78e5d6f79358042e76ff2e'){
                if(this.spawnA(spawn,'harvester')!=undefined) return 0;
                
                if(this.spawnA(spawn,'supporter')!=undefined) return 1;
                
                if(this.spawnA(spawn,'carrier')!=undefined) return 2;
                if(this.spawnB(spawn,'upgrader')!=undefined) return 3;
                
                if(this.spawnA(spawn,'dismantler')!=undefined) return 4;
                
                if(Math.random()<maxSpawn[spawn.name]['minecart']/(maxSpawn[spawn.name]['minecart']+maxSpawn[spawn.name]['distantHarvester'])){
                    if(this.spawnA(spawn,'minecart')!=undefined) return 5;
                }
                else{
                    if(this.spawnA(spawn,'distantHarvester')!=undefined) return 6;
                }
                
                if(_.filter(Game.creeps, (creep) => creep.memory.role == 'distantHarvester').length<maxSpawn['distantHarvester']||
                   _.filter(Game.creeps, (creep) => creep.memory.role == 'minecart').length<maxSpawn['minecart'])
                    return 6;
                
                //if(Math.random()>0.6) 
                
                if(Math.random()>0.3)
                    if(this.spawnA(spawn,'repairer')!=undefined) return 7;
                
                if(Math.random()>0.3)
                    if(this.spawnB(spawn,'builder')!=undefined) return 8;
                
                if(Math.random()>0.3)
                    if(this.spawnB(spawn,'defender')!=undefined) return 9;
                
                if(this.spawnA(spawn,'miner')!=undefined) return 9;
                
                
                var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            
                if(Math.random()>0.8) if(upgraders.length < 4) {
                    var newName = 'Upgrader' + Game.time+'_'+spawn.name.substring(5);
                    if(spawn.spawnCreep(template[spawn.name]['upgrader'], newName, 
                        {memory: {role: 'upgrader',spawn:spawn.name,behaviour:Math.round(Math.random())}})==OK){
                            console.log('Spawning new upgrader: ' + newName);
                        }
                    return 10;
                }
                return 9999;
            /*}
            else{
                role='upgrader';
                var upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
                var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role&&creep.room.name==spawn.room.name);
                //console.log('Harvesters: ' + harvesters.length);
            
                if(creeps.length < 1) {
                    var newName = upperRole + Game.time+'_'+spawn.name.substring(5);
                    if(spawn.spawnCreep([MOVE,WORK,CARRY], newName, 
                        {memory: {role: role,spawn:spawn.name,behaviour:Math.round(Math.random())}})==OK){
                            console.log('Spawning new '+role+': ' + newName);
                        }
                }
                
                role='distantHarvester';
                var upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
                var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role&&creep.room.name==spawn.room.name);
                //console.log('Harvesters: ' + harvesters.length);
            
                if(creeps.length < 1) {
                    var newName = upperRole + Game.time+'_'+spawn.name.substring(5);
                    if(spawn.spawnCreep([MOVE,WORK,CARRY], newName, 
                        {memory: {role: role,spawn:spawn.name,behaviour:5}})==OK){
                            console.log('Spawning new '+role+': ' + newName);
                        }
                }
                return 1;
            }*/
            //return run();
        }
        else return -9999;
    }
}
module.exports=autoSpawning;
