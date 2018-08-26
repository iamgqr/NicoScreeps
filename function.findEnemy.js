/*
 * MODULE function.findEnemy
 */

module.exports = function(creep){
    var pos=creep;
    if(pos.pos) pos=pos.pos;
    var target = pos.findClosestByRange(FIND_HOSTILE_CREEPS,{filter: object => Memory.whitelist.indexOf(object.owner.username)==-1});
    var invader = pos.findClosestByRange(FIND_CREEPS, {filter: { owner: { username: 'Invader' } }});
    if(invader) target=invader;
    if(target) Game.notify('Creep '+creep.name+' has been visited by '+target.owner.username+'\'s '+target.name+' at '+Game.time,60);
    return target;
};