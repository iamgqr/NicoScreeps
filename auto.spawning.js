const maxSpawn={
    harvester           :2,
    supporter           :2,
    upgrader            :1,
    dismantler          :1,
    minecart            :5,
    distantHarvester    :3,
    carrier             :3,
    repairer            :3,
    builder             :1,
    defender            :4,
};
const template={
    harvester:[
        [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE],
        [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE],
    ],
    supporter:[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    upgrader:[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],//800
    dismantler:[
        [WORK,WORK,MOVE,WORK,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
    ],
    minecart:[
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],//1500
    ],
    distantHarvester:[
        [MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
        [MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
        [MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
    ],//1150
    carrier:[
        [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
    ],//1050
    repairer:[
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,MOVE,MOVE],
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
    ],//1200
    builder:[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],//1100
    defender:[WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK],//1240
};

var autoSpawning = {
    spawnA: function(spawn,role){
        if(spawn.memory.lists==undefined) spawn.memory.lists={};
        if(spawn.memory.lists[role]==undefined) spawn.memory.lists[role]={};
        const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
        for(var id=0;id<maxSpawn[role];id++){
            const listCreep=spawn.memory.lists[role][id];
            const Ntemplate=template[role][id];
            if(listCreep==null||Game.creeps[listCreep]==null||
                Game.creeps[listCreep].ticksToLive<
                Game.map.getRoomLinearDistance(spawn.room.name,Game.creeps[listCreep].room.name)*50
                +Memory.constReactTime+Ntemplate.length*3
                ){
                var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+id;
                if(spawn.spawnCreep(Ntemplate, newName, 
                    {memory: {role: role,behaviour:id}})==OK){
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
    
        if(creeps.length < maxSpawn[role]) {
            var beh=Math.round(Math.random());
            var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+beh;
            if(spawn.spawnCreep(template[role], newName, 
                {memory: {role: role,behaviour:beh}})==OK){
                    console.log('Spawning new '+role+': ' + newName);
                }
            return 0;
        }
    },
    run: function(spawn){
        if(spawn.spawning) {
            spawn.spawning.setDirections([BOTTOM_RIGHT,BOTTOM_LEFT,TOP_LEFT]);
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
        if(spawn.memory.needRenew.time>=Game.time-1){
            var renewingCreepName = spawn.memory.needRenew.name;
            spawn.room.visual.text(
                '🔄 ' + renewingCreepName,
                spawn.pos.x + 1, 
                spawn.pos.y-1, 
                {align: 'left', opacity: 0.8});
            console.log('Renewing creep '+renewingCreepName);
            return -9999;
        }
        if(!spawn.spawning) {
            if(spawn.id=='5b78e5d6f79358042e76ff2e'){
                if(this.spawnA(spawn,'harvester')!=undefined) return 0;
                
                if(this.spawnB(spawn,'supporter')!=undefined) return 1;
                
                if(this.spawnB(spawn,'upgrader')!=undefined) return 2;
                
                if(this.spawnA(spawn,'dismantler')!=undefined) return 3;
                
                if(Math.random()>0.6){
                    if(this.spawnA(spawn,'minecart')!=undefined) return 4;
                }
                else{
                    if(this.spawnA(spawn,'distantHarvester')!=undefined) return 5;
                }
                
                if(_.filter(Game.creeps, (creep) => creep.memory.role == 'distantHarvester').length<maxSpawn['distantHarvester']||
                   _.filter(Game.creeps, (creep) => creep.memory.role == 'minecart').length<maxSpawn['minecart'])
                    return 5;
                
                //if(Math.random()>0.6) 
                if(this.spawnA(spawn,'carrier')!=undefined) return 6;
                
                if(Math.random()>0.3)
                    if(this.spawnA(spawn,'repairer')!=undefined) return 7;
                
                if(Math.random()>0.3)
                    if(this.spawnB(spawn,'builder')!=undefined) return 8;
                
                if(Math.random()>0.3)
                    if(this.spawnB(spawn,'builder')!=undefined) return 9;
                
                
                var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            
                if(Math.random()>0.9) if(upgraders.length < 8) {
                    var newName = 'Upgrader' + Game.time+'_'+spawn.name.substring(5);
                    if(spawn.spawnCreep(template['upgrader'], newName, 
                        {memory: {role: 'upgrader',behaviour:Math.round(Math.random())}})==OK){
                            console.log('Spawning new upgrader: ' + newName);
                        }
                    return 10;
                }
                return 9999;
            }
            else{
                role='upgrader';
                const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
                var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role&&creep.room.name==spawn.room.name);
                //console.log('Harvesters: ' + harvesters.length);
            
                if(creeps.length < 2) {
                    var newName = upperRole + Game.time+'_'+spawn.name.substring(5);
                    if(spawn.spawnCreep([MOVE,WORK,CARRY], newName, 
                        {memory: {role: role,behaviour:Math.round(Math.random())}})==OK){
                            console.log('Spawning new '+role+': ' + newName);
                        }
                }
                    return 1;
            }
            //return run();
        }
        else return -9999;
    }
}
module.exports=autoSpawning;
