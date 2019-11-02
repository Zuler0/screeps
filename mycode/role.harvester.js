const profiler = require('screeps-profiler');
const roleHarvester = {
	/** @param {Creep} creep **/
	run: function(creep) {
		//get target and put in memory if it doesn't exist
		if (!creep.memory.source) {
			creep.getTarget();
		}
		if (creep.store.getCapacity() !> 0 || creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
			creep.mine();
		} else {
			let structByType = creep.room.structByType;
			let containers = structByType[STRUCTURE_CONTAINER] || [];
			let spawns = structByType[STRUCTURE_SPAWN] || [];
			let targets = containers.concat(spawns);
			if (targets.length > 0) {
				let target = creep.pos.findClosestByRange(targets, {filter: (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target);
				}
			}
		}
	}
}
profiler.registerObject(roleHarvester, 'roleHarvester');
module.exports = roleHarvester;
