const profiler = require('screeps-profiler');
const roleRoom = {
	run: function(room) {
		const hitsPercentage = (s) => (s.hits/s.hitsMax);
		//construction site variables
		room.constuctSites = room.find(FIND_CONSTRUCTION_SITES);
		room.constuctByType = _.groupBy(room.constuctSites, (s) => s.structureType);

		//structure variables
		room.structures = room.find(FIND_STRUCTURES);
		room.damStructures = _.filter(room.structures, (s) => s.hits/s.hitsMax < 0.8);
		room.structByType = _.groupBy(room.structures, (s) => s.structureType);
		room.links = structByType[STRUCTURE_LINK];
		room.storageLink = room.storage.pos.findClosestByRange(room.links);
		[room.walls, room.infrastructure] = _.partition(room.damStructures, (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART);
		room.walls = _.sortBy(room.walls, (s) => s.hits);
		room.infrastructure = _.sortBy(room.infrastructure, hitsPercentage);

		//resource variables
		room.sources = room.find(FIND_SOURCES);
		room.ruins = room.find(FIND_RUINS, {filter: (r) => r.store.getUsedCapacity() > 0});
		room.tombstones = room.find(FIND_TOMBSTONES, {filter: (t) => t.store.getUsedCapacity() > 0});
		room.droppedRes = room.find(FIND_DROPPED_RESOURCES, {filter: (r) => r.amount > 100});
		room.resByType = _.groupBy(room.droppedRes, (r) => r.resourceType);

		//friend/foe variables
		room.myCreeps = room.find(FIND_MY_CREEPS);
		room.myStructures = room.find(FIND_MY_STRUCTURES);
		room.notMyCreeps = room.find(FIND_HOSTILE_CREEPS);
		room.notMyStructures = room.find(FIND_HOSTILE_STRUCTURES);
		let allies =["_Lalaleyna", "Ratstail91", "Lampe", "M1kep", ];
		[room.allyCreeps, room.enemyCreeps] = _.partition(room.notMyCreeps, (c) => allies.includes(c.owner.username));
		[room.allyStructures, room.enemyStructures] = _.partition(room.notMyStructures, (c) => allies.includes(c.owner.username));
		room.friendlyCreeps = room.myCreeps.concat(room.allyCreeps);
		room.friendlyStructures = room.myStructures.concat(room.allyStructures);
	}
}
profiler.registerObject(roleRoom, 'roleRoom');
module.exports = roleRoom;
