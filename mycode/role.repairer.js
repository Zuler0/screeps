var roleBuilder = require('role.builder');
module.exports = {
	/** @param {Creep} creep **/
	run: function(creep) {
		// if creep is trying to repair something but has no energy left
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
			// if creep is full
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('🛠️ repair');
		}
		//repair damaged structures within its path while still moving toward target if it has one
		var structures = creep.room.lookForAtArea(LOOK_STRUCTURES,creep.pos.y - 3,creep.pos.x - 3,creep.pos.y + 3,creep.pos.x + 3, true);
		for (let structure of structures) {
			structure = structure['structure'];
			if (structure.hits < structure.hitsMax - creep.memory.workParts * 100) {
				creep.repair(structure);
				break;
			}
		}
		//if creep is working
		if (creep.memory.working) {
			//get room vars
			var walls = Game.rooms[creep.room.name].walls;
			var infrastructure = Game.rooms[creep.room.name].infrastructure;
			//if repairer doesn't have a target, find one
			if (!creep.memory.target) {
				for (let percentage = 0.1; percentage <= 1; percentage = percentage + 0.1) {
					for (let structure of infrastructure) {
						if (structure.hits / (structure.hitsMax - creep.memory.workParts * 100) < percentage) {
							//set target to memory
							creep.memory.target = structure.id;
							break;
						}
					}
					if (creep.memory.target) {
						break;
					}
				}
			}
			//if repairer has target retrieve from memory
			if (creep.memory.target) {
				var target = Game.getObjectById(creep.memory.target);
				//if repairer's target would be over repaired purge from memory
				if (target.hits / (target.hitsMax - creep.memory.workParts * 100) >= 1) {
					delete creep.memory.target;
				}
				if (creep.memory.target) {
					//if target is still in memory, and in range repair it, if it isn't move into range of it
					if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target,{ignoreCreeps: false, range: 3});
					}
				}
				//if walls are repairable repair up to target health
			} else if (creep.room.controller.level > 1) {
				var target;
				var targetHealth = 3000000;
				for (let percentage = 0.01; percentage <= 1; percentage = percentage + 0.01) {
					for (let wall of walls) {
						if (wall.hits / targetHealth < percentage) {
							target = wall;
							break;
						}
					}
					if (target != undefined) {
						break;
					}
				}
				if (target != undefined) {
					if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target,{ignoreCreeps: false, range: 3});
					}
				}
			} else {
				roleBuilder.run(creep);
			}
		} else {
			creep.getEnergy();
		}
	}
};