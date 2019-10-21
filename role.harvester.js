function mine(creep) {
	var target = creep.pos.findClosestByPath(FIND_SOURCES,{ ignoreCreeps: false });
	if (target.energy > 0) {
		if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
			creep.travelTo(target,{ignoreCreeps: false});
		}
	}
}
module.exports = {
	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.store.getCapacity() > 0 ) {
			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = true;
				creep.say('mine');
			} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
				creep.memory.working = false;
				creep.say('dump');
			}
			if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity() - creep.memory.workParts * 2) {
				mine(creep);
			} else if (creep.store[RESOURCE_ENERGY] > 0) {
				var structByType = Game.room[creep.room.name].structByType;
				var containers = structByType[STRUCTURE_CONTAINER] || [];
				if (containers.length > 0) {
					var target = creep.pos.findClosestByRange(containers, {filter: (s) => s.store[RESOURCE_ENERGY] < s.store.getCapacity()});
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target);
					}
				}
			}
		} else {
			mine(creep);
		}
	}
};
