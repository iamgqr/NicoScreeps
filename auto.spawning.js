const consts = require('consts');
const maxSpawn=consts.maxSpawn;
const template=consts.template;
var autoSpawning = {
    spawnA: function(spawn,role){
        if(spawn.memory.lists==undefined) spawn.memory.lists={};
        if(spawn.memory.lists[role]==undefined) spawn.memory.lists[role]={};
        const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
        //console.log("SpawnA",spawn.name,role);
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
                var ret=spawn.spawnCreep(Ntemplate, newName, 
                    {memory: {role: role,spawn:spawn.name,behaviour:id}});
                //console.log(spawn.name,id,"return",ret);
                if(ret==OK){
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
        for(var role in maxSpawn[spawn.name]) if(spawn.memory.lists&&spawn.memory.lists[role]) for(var id in spawn.memory.lists[role]){
            const listCreep=spawn.memory.lists[role][id];
            if(id>=maxSpawn[spawn.name][role]||listCreep==null||typeof listCreep=='string'&&Game.creeps[listCreep]==null) delete spawn.memory.lists[role][id];
        }
        if(spawn.spawning) {
            spawn.spawning.setDirections([BOTTOM,LEFT,BOTTOM_RIGHT,TOP_LEFT,TOP_RIGHT]);
            var spawningCreep = Game.creeps[spawn.spawning.name];
            if(spawn.pos.x>30){
                spawn.room.visual.text(
                    spawningCreep.memory.role + '('+(100-Math.round((spawn.spawning.remainingTime-1)/spawn.spawning.needTime*100))+'%)'
                    +'🛠️' ,
                    spawn.pos.x - 1, 
                    spawn.pos.y, 
                    {align: 'right', opacity: 0.8}).text(
                    spawningCreep.name+'📝️',
                    spawn.pos.x - 1, 
                    spawn.pos.y + 1, 
                    {align: 'right', opacity: 0.8});
            }else{
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
        }
        
        if(!spawn.spawning) {
            //if(spawn.id=='5b78e5d6f79358042e76ff2e'){
                if(this.spawnA(spawn,'harvester')!=undefined) return 0;
                if(spawn.memory.needRenew.time>=Game.time-1) return -9999;
                if(this.spawnA(spawn,'supporter')!=undefined) return 1;
                
                if(this.spawnA(spawn,'carrier')!=undefined) return 2;
                
                if(this.spawnB(spawn,'upgrader')!=undefined) return 3;
                
                if(this.spawnA(spawn,'dismantler')!=undefined) return 4;
                
                if(Math.random()<maxSpawn[spawn.name]['minecart']/(maxSpawn[spawn.name]['minecart']+maxSpawn[spawn.name]['distantHarvester'])){
                    if(this.spawnA(spawn,'minecart')!=undefined) return 5;
                    else if(this.spawnA(spawn,'distantHarvester')!=undefined) return 6;
                }
                else{
                    if(this.spawnA(spawn,'distantHarvester')!=undefined) return 6;
                    else if(this.spawnA(spawn,'minecart')!=undefined) return 5;
                }
                
                // if(_.filter(Game.creeps, (creep) => creep.memory.role == 'distantHarvester').length<_.compact(template[spawn.name]['distantHarvester']).length||
                //   _.filter(Game.creeps, (creep) => creep.memory.role == 'minecart').length<_.compact(template[spawn.name]['distantHarvester']).length)
                //     return 6;
                
                //if(Math.random()>0.6) 
                
                if(Math.random()>0.3)
                    if(this.spawnA(spawn,'repairer')!=undefined) return 7;
                
                if(Math.random()>0.3)
                    if(this.spawnB(spawn,'builder')!=undefined) return 8;
                
                if(Math.random()>0.3)
                    if(this.spawnB(spawn,'defender')!=undefined) return 9;
                
                if(!spawn.room.find(FIND_MINERALS)[0].ticksToRegeneration||spawn.room.find(FIND_MINERALS)[0].ticksToRegeneration<150)
                    if(this.spawnA(spawn,'miner')!=undefined) return 10;
                
                if(this.spawnA(spawn,'dealer')!=undefined) return 10;
                
                // var role='upgrader';
                // var upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
                // var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            
                // if(upgraders.length < 5) {
                //     var beh=Math.round(Math.random());
                //     var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+beh;
                //     if(spawn.spawnCreep(template[spawn.name][role][beh], newName, 
                //         {memory: {role: role,spawn:spawn.name,behaviour:beh}})==OK){
                //             console.log('Spawning new '+role+': ' + newName);
                //         }
                //     return 0;
                // }
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
