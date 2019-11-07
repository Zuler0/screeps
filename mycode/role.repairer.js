const roleUpgrader = require('role.upgrader');
const profiler = require('screeps-profiler');
const roleRepairer = {
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
		//if creep is working
		if (creep.memory.working) {
			//repair damaged structures on its path
			let structures = creep.room.lookForAtArea(LOOK_STRUCTURES,
				Math.max(creep.pos.y - 3, 1),
				Math.max(creep.pos.x - 3, 1),
				Math.min(creep.pos.y + 3, 48),
				Math.min(creep.pos.x + 3, 48), true);
			for (let structure of structures) {
				let targets = [];
				let target = structure['structure'];
				targets.push(target);
				//if it won't over repair target repair it
				if (targets.length == structures.length) {
					targets.sort(s => s.hits);
					target = targets[0];
					if (target.hits <= target.hitsMax - creep.memory.workParts * 100) {
						creep.repair(target);
					}
				}
			}
			//get target if it doesn't have one
			if (!creep.memory.target) {
				creep.getTarget();
			}
			//if repairer has target get from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				let flag = Game.flags[creep.memory.flag];
				//if target not valid clear from memory
				if (!target) {
					delete creep.memory.target;
					delete creep.memory.targetOldHits;
				}
				//if repairer's target would be over repaired or has been repaired over 50000 hits purge from memory
				if ((target.hits / (target.hitsMax - creep.memory.workParts * 100) >= 1) || (target.hits - creep.memory.targetOldHits) > 50000) {
					delete creep.memory.target;
					delete creep.memory.targetOldHits;
				}
				//if target is still in memory, and in range repair it, if it isn't move into range of it
				if (creep.memory.target) {
					if (target.room != creep.room) {
						creep.travelTo(flag);
					}
					else if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target,{ range: 3});
					}
				}
			}//if no target and not in home room move back to homeroom
			else if (!creep.memory.target && creep.memory.home != creep.room.name) {
				creep.travelTo(Game.rooms[creep.memory.home].controller);
			}//If nothing to repair run upgrader code
			else {
				roleUpgrader.run(creep);
			}
		}//if not working get energy
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleRepairer, 'roleRepairer');
module.exports = roleRepairer;
