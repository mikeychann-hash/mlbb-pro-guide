export const JG_PATHS=[
{name:"Assassin Path (Blue Start)",steps:["Purple/Blue Buff","Lithowanderer","Small Camps","Red/Orange Buff","Level 4 Gank or Turtle"],heroes:["Fanny","Hayabusa","Ling","Joy","Gusion","Nolan"],note:"For energy/mana dependent assassins. Blue buff = sustain for ability spam. Hit level 4 by 1:45-2:00."},
{name:"Tank Jungler Path (Red Start)",steps:["Red/Orange Buff","Golems/Small Camp","Lithowanderer","Purple/Blue Buff","Gank Mid or EXP"],heroes:["Fredrinn","Akai","Baxia"],note:"Red buff slow enhances ganks. Tank junglers don't need blue buff as urgently. Focus on enabling lanes."},
{name:"Aggressive Invade Path",steps:["Your Core Buff","Enemy Core Buff (steal)","Small Camp","Second Buff","Gank"],heroes:["Hayabusa","Saber","Helcurt"],note:"High risk/reward. Only when you have early lane priority. Track enemy jungler's gold on scoreboard."},
{name:"Fast Turtle Rush",steps:["Core Buff","Second Buff","Scuttler/Crab","Turtle (at 2:00)"],heroes:["Saber","Fredrinn","Yi Sun-shin"],note:"Fastest path to level 4 + Turtle. Requires team coordination. Get both buffs before 2:00 Turtle spawn."},
];
export const JG_TIMERS=[
{obj:"Turtle",spawn:"2:00",respawn:"Every 2 min",despawn:"8:00 (Lord replaces)",reward:"+Gold/XP team-wide + Shield buff",tip:"Setup 15-20s before spawn. Lure toward your side. Retribution at red HP line."},
{obj:"Lord",spawn:"9:00",respawn:"After death",despawn:"—",reward:"+~300g per player + Turret damage buff",tip:"Only take after winning fight or enemy dead. Vision 30-45s before. Never solo Lord."},
{obj:"Buffs",spawn:"0:20",respawn:"75 seconds",despawn:"—",reward:"Purple=Mana/CDR. Orange=Slow+Damage",tip:"Buff respawn at 75s = sync rotations for double buff before Turtle at 2:00."},
{obj:"Lithowanderer",spawn:"0:30",respawn:"90 seconds",despawn:"—",reward:"Gold + small heal",tip:"Contest this for early gold lead. Position matters — river control wins early game."},
];
export const JG_TIPS=[
"Hit Level 4 by 1:45-2:00 through optimized pathing",
"60/40 Rule: 60% farm, 40% ganks in first 8 minutes",
"Track enemy jungler gold: +23g = Purple Buff small, ~120g = Orange Buff taken",
"Gank priority: Squishy MMs/Mages without escape > EXP laners",
"After 5 min, lane minions outfarm camps (30-50g). Share lanes",
"Save Retribution for Turtle/Lord contests. Don't waste on small camps late",
"Ping 10-15s before engaging objectives for team coordination",
"Check minimap every 3-5 seconds. Missing enemy = potential ambush",
"After successful gank, push tower immediately while enemy respawns",
"Late game: give Blue Buff to mage, Red Buff to MM if they need it",
];
