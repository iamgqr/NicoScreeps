
module.exports = {
    run:function(link){
        if(link.cooldown==null||link.cooldown!=0) return -1;
        if(link.id=='5b7fcfc2851fd3567cc41a3c'||link.id=='5b85213207411e3d54fdb9ce'){
            var target=Game.getObjectById('5b7fc8b754c0a0179f4fa684');
            if(link.energy>=200){
                link.transferEnergy(target,Math.min(Math.floor(link.energy/100),Math.floor((target.energyCapacity-target.energy)/100))*100);
            }
        }
    }
};