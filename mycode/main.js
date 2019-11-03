const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleSupplier = require('role.supplier');
const roleClaimer = require('role.claimer');
const roleSpawner = require('role.spawner');
const roleTower = require('role.tower');
const roleRoom = require('role.room');
const roleRanger = require('role.ranger');
const mem_clear = require('mem_clear');
const profiler = require('screeps-profiler');
const Traveler = require('Traveler');
require('prototype.spawn') ();
require('prototype.creep') ();
require('prototype.source') ();
require('mem_hack') ();
profiler.enable();
global.flagCount = 0;
module.exports.loop = function() {
	global.mem_hack();
	profiler.wrap(function() {
		if (Object.keys(Game.flags).length != global.flagCount) {
			global.reserveFlags = [];
			global.maintainFlags = [];
			global.claimFlags = [];
			global.harvestFlags = [];
			global.attackFlags = [];
			for (let name in Game.flags) {
				++global.flagCount;
				let flag = Game.flags[name];
				if (name.includes("Reserve")) {
					global.reserveFlags.push(flag);
				}
				if (name.includes("Maintain")) {
					global.maintainFlags.push(flag);
				}
				if (name.includes("Claim")) {
					global.claimFlags.push(flag);
				}
				if (name.includes("Harvest")) {
					global.harvestFlags.push(flag);
				}
				if (name.includes("Attack")) {
					global.attackFlags.push(flag);
				}
			}
			for (let name in Game.rooms) {
				let room = Game.rooms[name];
				room.memory.flagCount = 0;
				//claim ownership of flags in rooms bordering if no master room
				let rooms = Game.map.describeExits(room.name);
				let reserve = global.reserveFlags;
				let harvest = global.harvestFlags;
				let flags = reserve.concat(harvest);
				for (let flag of flags) {
					if (!flag.memory.master) {
						for (let key in rooms) {
							let roomName = rooms[key];
							if (flag.room.name == roomName) {
								flag.memory.master = room.name;
								++room.memory.flagCount;
							}
						}
					}
				}
			}
		}
		//iterate through rooms and create the variables
		for (let name in Game.rooms) {
			let room = Game.rooms[name];
			roleRoom.run(room);
		}
		//iterate through towers and run their code
		for (let name in Game.rooms) {
			let towers = Game.rooms[name].structByType[STRUCTURE_TOWER] || [];
			for (let id in towers) {
				let tower = towers[id];
				try {
					roleTower.run(tower);
				} catch(err) {
					console.log('error caused by ' + tower + ' ' + err);
				}
			}
		}
		//iterate through spawners and run their code
		for (let name in Game.spawns) {
			let spawner = Game.spawns[name];
			try {
				roleSpawner.run(spawner);
			} catch(err) {
				console.log('error caused by ' + spawn.name + ' ' + err);
			}
		}
		//iterate through creeps and run their code
		for (let name in Game.creeps) {
			let creep = Game.creeps[name];
			try {
				if (!creep.spawning) {
					switch (creep.memory.role) {
						case "harvester":
							roleHarvester.run(creep);
							break;
						case "upgrader":
							roleUpgrader.run(creep);
							break;
						case "builder":
							roleBuilder.run(creep);
							break;
						case "repairer":
							roleRepairer.run(creep);
							break;
						case "supplier":
							roleSupplier.run(creep);
							break;
						case "claimer":
							roleClaimer.run(creep);
							break;
						case "ranger":
							roleRanger.run(creep);
							break;
						default:
							console.log('error caused by ' + creep.name + " has no role or it's role isn't run");
					}
				}
			} catch(err){
				console.log('error caused by ' + creep.name + ' ' + (err.stack || err));
			}
		}
		//remove dead creeps memory
		mem_clear.run();
	});
}
