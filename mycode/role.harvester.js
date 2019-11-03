const profiler = require('screeps-profiler');
const roleHarvester = {
	/** @param {Creep} creep **/
	run: function(creep) {
		//get target and put in memory if it doesn't exist
		if (!creep.memory.source) {
			creep.getTarget();
		}
		if (creep.store.getUsedCapacity() < creep.store.getCapacity()) {
			let structByType = creep.room.structByType;
			let spawns = structByType[STRUCTURE_SPAWN] || [];
			let targets = spawns;
			if (targets.length > 0) {
				let target = creep.pos.findClosestByRange(targets, {filter: (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target);
				}
			}
		} else {
			creep.mine();
		}
	}
}
profiler.registerObject(roleHarvester, 'roleHarvester');
module.exports = roleHarvester;
