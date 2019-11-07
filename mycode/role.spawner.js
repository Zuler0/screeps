const profiler = require('screeps-profiler');
/** @param {Room.energyAvailable} energyAvail
 * @param {Creep.memory.role} roleName
 * @param {StructureSpawn} spawner */
function spawnNew(energyAvail, roleName, spawner) {
	/** @type {String} */
	let newName = spawner.name + ' ' + roleName + ' ' + Game.time;
	console.log('Spawning new ' + roleName + ': ' + newName);
	switch (roleName) {
		case 'supplier': {
			return spawner.spawnSupplier(energyAvail, newName, roleName);
			break;
		}
		case 'hauler': {
			return spawner.spawnSupplier(energyAvail, newName, roleName);
			break;
		}
		case 'harvester': {
			let structByType = spawner.room.structByType;
			let containers = structByType[STRUCTURE_CONTAINER] || [];
			if (containers.length == 0) {
				return spawner.spawnHarvester(energyAvail, newName);
			} else {
				return spawner.spawnCanHarvester(energyAvail, newName);
			}
			break;
		}
		case 'ranger': {
			return spawner.spawnRanger(energyAvail, newName);
			break;
		}
		default: {
			return spawner.spawnDynamicCreep(energyAvail, newName, roleName);
		}
	}
}
const roleSpawner = {
	/** @param {StructureSpawn} spawner */
	run: function(spawner) {
		/*Gets count of creeps with each role in the room of the spawn,
		and energy available to spawn with and get time since last spawn*/
		let structByType = spawner.room.structByType;
		let containers = structByType[STRUCTURE_CONTAINER] || [];
		let energyAvail = spawner.room.energyAvailable;
		let maxEnergy = spawner.room.energyCapacityAvailable;
		if (!spawner.room.memory.harvesters){
			let creeps = spawner.room.myCreeps;
			let creepsByRole = _.groupBy(creeps, 'memory.role');
			let harvesters = creepsByRole['harvester'] || [];
			let builders = creepsByRole['builder'] || [];
			let upgraders = creepsByRole['upgrader'] || [];
			let repairers = creepsByRole['repairer'] || [];
			let suppliers = creepsByRole['supplier'] || [];
			spawner.room.memory.harvesters = harvesters.length;
			spawner.room.memory.suppliers = suppliers.length;
			spawner.room.memory.repairers = repairers.length;
			spawner.room.memory.upgraders = upgraders.length;
			spawner.room.memory.builders = builders.length;
		}
		++spawner.memory.timeSinceSpawn;
		/*If spawning show next to spawner what role is being spawned,
		as well as prevent from trying to spawn a new creep while it is already spawning*/
		if (spawner.spawning) {
			spawner.memory.timeSinceSpawn = 0;
			let spawningCreep = Game.creeps[spawner.spawning.name];
			spawner.room.visual.text(
				'🛠️' + spawningCreep.memory.role,
				spawner.pos.x + 1,
				spawner.pos.y,
				{align: 'left', opacity: 0.8});
			/*If 300 energy or more energy spawn a new creep
			if there are less than I want of a certain role*/
		} else if ((energyAvail >= 300 && spawner.memory.timeSinceSpawn >= 100) || energyAvail == maxEnergy) {
			if (spawner.room.memory.harvesters < 2) {
				if (spawnNew(energyAvail, 'harvester', spawner) == OK) {
					++spawner.room.memory.harvesters;
				}
			} else if (spawner.room.memory.suppliers < 2 && containers.length > 0) {
				if (spawnNew(energyAvail, 'supplier', spawner) == OK) {
					++spawner.room.memory.suppliers;
				}
			} else if (spawner.room.memory.repairers < 1) {
				if (spawnNew(energyAvail, 'repairer', spawner) == OK) {
					++spawner.room.memory.repairers;
				}
			} else if (spawner.room.memory.upgraders < 1) {
				if (spawnNew(energyAvail, 'upgrader', spawner) == OK) {
					++spawner.room.memory.upgraders;
				}
			} else if (spawner.room.memory.builders < 1) {
				if (spawnNew(energyAvail, 'builder', spawner) == OK) {
					++spawner.room.memory.builders;
				}
			}
			else if (spawner.room.memory.rangers < 1 && global.attackFlags.length > 0) {
				if (spawnNew(energyAvail, 'ranger', spawner) == OK) {
					++spawner.room.memory.rangers;
				}
			}
			else if (spawner.room.memory.claimers < 1) {
				if (spawner.spawnCreep([CLAIM, CLAIM, MOVE, MOVE], (spawner.name + ' claimer ' + Game.time), {memory: {role: 'claimer', moveParts: 1, totalParts: 2, home: spawner.room.name}}) == OK) {
					++spawner.room.memory.claimers;
				}
			}
		}
	}
}
profiler.registerObject(roleSpawner, 'roleSpawner');
module.exports = roleSpawner;
