/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('auto.link');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run:function(link){
        if(link.cooldown==null||link.cooldown!=0) return -1;
        if(link.id=='5b7fcfc2851fd3567cc41a3c'){
            var target=Game.getObjectById('5b7fc8b754c0a0179f4fa684');
            if(link.energy>500){
                link.transferEnergy(target,500);
            }
        }
    }
};