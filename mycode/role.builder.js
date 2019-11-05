const roleUpgrader = require('role.upgrader');
const profiler = require('screeps-profiler');
const roleBuilder = {
	/** @param {Creep} creep **/
	run: function(creep) {
		//state change based off energy
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('🚧 build');
		}
		//if working
		if (creep.memory.working) {
			//get target
			if (!creep.memory.target) {
				creep.getTarget();
			}
			//get flag from memory
			let flag = Game.flags[creep.memory.flag];
			//if builder has target get it from memory
			if (creep.memory.target) {
				//get target, and it's room
				let target = Game.getObjectById(creep.memory.target);
				let targetRoom = Game.rooms[creep.memory.targetRoom];
				//if creep is in target's room
				if (creep.room == targetRoom) {
					//if target not valid clear from memory and get new one
					if (!target) {
						delete creep.memory.target;
					}
					//build target
					if (creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target, {range: 3});
					}
				} else {
					if (!creep.memory.targetRoom) {
						creep.memory.targetRoom = target.room.name;
					}
					creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom));
				}
			}//if flag is set in memory and no target and there is stuff to build in its room move to it
			else if (flag && !creep.memory.target && flag.room != creep.room) {
				creep.travelTo(flag);
			}//if no target and not in home room move back to homeroom
			else if (!creep.memory.target && creep.memory.home != creep.room.name) {
				creep.travelTo(Game.rooms[creep.memory.home].controller);
			}//if nothing to build run upgrader code
			else {
				roleUpgrader.run(creep);
			}
		}//if no energy get some
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleBuilder, 'roleBuilder');
module.exports = roleBuilder;
