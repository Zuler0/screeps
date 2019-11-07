const profiler = require('screeps-profiler');
const roleHauler = {
	run: function (creep) {
		if (!creep.memory.target) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.flag];
		if (creep.store.getUsedCapacity() == 0 && flag.room != creep.room) {
			creep.goTo(flag);
		}
		else {
			if (flag.room == creep.room) {
				creep.getEnergy();
			}
			let home = Game.rooms[creep.memory.home];
			if (creep.store.getFreeCapacity() == 0 && creep.room != home) {
				creep.goTo(home.controller);
			} else {
				let target = creep.pos.findClosestByRange(creep.room.links);
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.goTo(target);
				}
			}
		}
	}
}
profiler.registerObject(roleHauler, 'roleHauler');
module.exports = roleHauler;
