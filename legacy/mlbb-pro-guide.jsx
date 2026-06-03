import { useState, useMemo, useReducer, useEffect } from "react";

// ═══ HERO DATABASE (100+ heroes) ═══
// Format: [name, role, role2, tier, lane, difficulty, winRate, pickRate, banRate, specialty, counters, strongVs, build, emblem, spells, tip, synergies]
const RAW=[
["Sora","Fighter","","S+","EXP",2,52.3,14.2,22,"AoE CC Stance Switch",["Phoveus","Chou","Khufra"],["Esmeralda","Uranus","Terizla"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Assassin",["Flicker","Execute"],"#1 EXP. Thunder for 1v1, Cloud for AoE teamfight.",["Tigreal","Pharsa","Atlas"]],
["Fredrinn","Fighter","Tank","S+","Jungle",2,51.9,12.8,28,"Utility Tank Jungler",["Karrie","Wanwan","Valir"],["Chou","Lancelot","Fanny"],["Tough Boots","Dominance Ice","Radiant Armor","Antique Cuirass","Immortality","Athena's Shield"],"Tank",["Retribution","Flicker"],"THE utility jungler. Build full tank. Taunt peels, ult = absorbed damage burst.",["Sora","Angela","Pharsa"]],
["Julian","Fighter","Mage","S+","EXP",3,52.1,11.5,18,"6-Combo Burst",["Phoveus","Khufra","Chou"],["Lapu-Lapu","Esmeralda","Yu Zhong"],["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Blood Wings","Winter Truncheon"],"Mage",["Flicker","Purify"],"6 unique combos. 1-2-3=burst, 2-1-3=CC, 3-2-1=sustain.",["Tigreal","Khufra","Angela"]],
["Zhuxin","Mage","","S+","Mid",2,51.7,13.1,15,"Displacement Execute",["Valentina","Lancelot","Ling"],["Layla","Miya","Hanabi"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"S1 displacement + execute is devastating. Controls space.",["Tigreal","Atlas","Fredrinn"]],
["Helcurt","Assassin","","S+","Jungle",2,51.4,8.2,79,"Silence + Darkness",["Tanky lineups","Khufra","Akai"],["Squishy carries","Pharsa","Layla"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"79% ban. Silence shuts skill heroes. Global darkness = info advantage.",["Tigreal","Atlas","Angela"]],
["Tigreal","Tank","","S+","Roam",1,51.2,16.4,8,"AoE Engage",["Valir","Diggie","Wanwan"],["Layla","Miya","Hanabi"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Radiant Armor"],"Tank",["Flicker","Vengeance"],"Flicker+Ult = game-winning engage. Hide in bush, wait for 3+ grouped.",["Pharsa","Zhuxin","Sora"]],
["Khufra","Tank","","S+","Roam",2,51.5,11.3,14,"Anti-Dash",["Valir","Karrie","Diggie"],["Fanny","Lancelot","Ling"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Radiant Armor"],"Tank",["Flicker","Vengeance"],"Bouncing Ball interrupts ALL dashes. Priority vs Fanny/Lance/Ling.",["Pharsa","Zhuxin","Julian"]],
["Joy","Assassin","","S","Jungle",3,51.8,6.1,82,"Unavoidable Burst",["Khufra","Phoveus","Heavy CC"],["Squishy mages","Layla"],["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Concentrated Energy","Winter Truncheon"],"Mage",["Retribution"],"82% ban — highest. Damage unavoidable. First-pick if open.",["Tigreal","Angela","Estes"]],
["Phoveus","Fighter","","S","EXP",2,52.0,9.8,12,"Anti-Dash Punisher",["Esmeralda","Valir","Karrie"],["Fanny","Lancelot","Ling"],["Arcane Boots","Enchanted Talisman","Concentrated Energy","Holy Crystal","Divine Glaive","Immortality"],"Mage",["Flicker","Execute"],"Pick vs 2+ dash heroes. Each dash resets ult.",["Khufra","Tigreal","Pharsa"]],
["Hayabusa","Assassin","","S","Jungle",3,51.6,10.5,11,"Safest Jungler",["Saber","Khufra","Chou"],["Miya","Layla","Pharsa"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Can't jungle? Learn Haya. Shadow teleport = free escape.",["Tigreal","Angela","Mathilda"]],
["Arlott","Fighter","","S","EXP",2,51.4,8.9,9,"Wall-Pin Burst",["Chou","Phoveus","Khufra"],["Esmeralda","Uranus","Alice"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Flicker","Execute"],"Wall pin doubles stun. Fight near walls for max pressure.",["Tigreal","Atlas","Angela"]],
["Lapu-Lapu","Fighter","","S","EXP",2,51.1,8.4,7,"Dual Stance Shield",["Chou","Paquito","Phoveus"],["Esmeralda","Alice","Uranus"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Heavy stance = shield + burst. Alternate stances to poke then commit.",["Tigreal","Pharsa","Angela"]],
["Freya","Fighter","","S","EXP",1,51.3,9.1,10,"Sacred Orb Duelist",["Chou","Phoveus","Esmeralda"],["Zilong","Alucard","Roger"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Nerfed 2.1.61 (33% regen cut) but still S. Jump stun ult = unmatched 1v1.",["Tigreal","Angela","Estes"]],
["Leomord","Fighter","","S","Jungle",2,51.0,7.8,35,"Mount Burst Chase",["Khufra","Phoveus","Chou"],["Layla","Miya","Hanabi"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Assassin",["Retribution","Flicker"],"35% ban. Mount = unstoppable chase + AoE. Ban or pick.",["Tigreal","Angela","Mathilda"]],
["Saber","Assassin","","S","Jungle",1,51.2,9.5,41,"Point-Click Delete",["Chou","Purify users","Diggie"],["Pharsa","Layla","Miya"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution","Execute"],"Easiest assassin. See squishy alone → S1→S2→Ult = dead.",["Tigreal","Atlas","Angela"]],
["Pharsa","Mage","","S","Mid",2,51.9,8.7,6,"Artillery Zone",["Lancelot","Ling","Saber"],["Layla","Tigreal","Atlas"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Nerfed 2.1.61 but still S. Ult zones entire areas. Stay MAX range.",["Tigreal","Khufra","Atlas"]],
["Kimmy","Marksman","Mage","S","Gold",2,51.5,10.2,5,"Move + Shoot",["Saber","Lancelot","Helcurt"],["Tigreal","Atlas","Uranus"],["Arcane Boots","Genius Wand","Glowing Wand","Ice Queen Wand","Holy Crystal","Divine Glaive"],"Mage",["Flicker","Purify"],"Build MAGIC. Spray+move = constant damage while repositioning.",["Tigreal","Khufra","Angela"]],
["Yi Sun-shin","Marksman","Assassin","S","Jungle",2,51.0,7.3,8,"Global Vision Ship",["Khufra","Chou","Saber"],["Fanny","Ling","Natalia"],["Swift Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Nerfed 2.1.61 (10s from 15s) but still strong. Vision = info advantage.",["Tigreal","Angela","Mathilda"]],
["Gloo","Tank","","S","Roam",2,51.1,8.5,9,"Sticky Isolation",["Purify","Valir","Karrie"],["Immobile carries","Layla","Miya"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Attach to carry = useless. Forces peel or lose damage dealer.",["Pharsa","Zhuxin","Sora"]],
["Angela","Support","","S","Roam",1,51.3,9.8,4,"Global Attach",["Burst AoE","Atlas","Tigreal"],["Saber","Lancelot"],["Tough Boots","Fleeting Time","Necklace of Durance","Immortality","Athena's Shield","Dominance Ice"],"Support",["Flicker","Heal"],"Global ult. Attach to jungler before ganks = guaranteed kills.",["Fredrinn","Hayabusa","Sora"]],
["Mathilda","Support","Assassin","S","Roam",2,51.4,8.1,44,"Aggressive Roam",["Diggie","Heavy CC","Khufra"],["Immobile carries","Layla"],["Tough Boots","Fleeting Time","Dominance Ice","Necklace of Durance","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"44% ban. Best roam for engage AND escape.",["Hayabusa","Leomord","Granger"]],
["Nolan","Assassin","","S","Jungle",3,51.0,6.5,12,"Dimensional Rift",["Khufra","Phoveus","Heavy CC"],["Squishy mages","Backline"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Rift geometry = instant kills when mastered. High skill ceiling.",["Tigreal","Angela","Atlas"]],
["Chip","Support","","S","Roam",2,50.8,7.2,6,"Global Teleport",["Burst damage","Saber"],["Split push teams"],["Tough Boots","Fleeting Time","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"Global ult = arrive everywhere first. Map pressure is insane.",["Sora","Julian","Hayabusa"]],
["Chou","Fighter","","A","EXP",3,50.5,11.2,5,"Kick Isolation",["Phoveus","Esmeralda","Yu Zhong"],["Layla","Pharsa","Miya"],["Tough Boots","Blade of Despair","Endless Battle","Malefic Roar","Immortality","Hunter Strike"],"Assassin",["Flicker","Purify"],"Flicker+Ult kicks carry into team. Immune frames on S1.",["Pharsa","Zhuxin","Sora"]],
["Guinevere","Fighter","Mage","A","EXP",2,51.8,7.4,4,"Jump Knock-Up",["Chou","Diggie","Purify"],["Miya","Layla","Hanabi"],["Arcane Boots","Concentrated Energy","Holy Crystal","Divine Glaive","Genius Wand","Blood Wings"],"Mage",["Flicker","Execute"],"Rising S40. Land S2 = guaranteed ult + burst = delete squishy.",["Tigreal","Atlas","Angela"]],
["Valentina","Mage","","A","Mid",3,52.8,7.3,5,"Ultimate Copy",["Heroes with bad ults"],["Pharsa","Tigreal","Atlas"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Highest WR mage. Copy best enemy ult. Valentina+Tigreal ult = devastating.",["Tigreal","Khufra","Angela"]],
["Wanwan","Marksman","","A","Gold",3,50.9,7.2,7,"Weakness-Point Ult",["Khufra","Phoveus","Burst CC"],["Tanks","Tigreal","Uranus"],["Swift Boots","Corrosion Scythe","Demon Hunter Sword","Golden Staff","Wind of Nature","Malefic Roar"],"Marksman",["Inspire","Purify"],"Built-in Purify. Hit weakness points = untargetable ult.",["Tigreal","Angela","Estes"]],
["Karrie","Marksman","","A","Gold",2,51.2,6.8,3,"True DMG Tank Killer",["Saber","Lancelot","Burst"],["All tanks","Hylos","Uranus"],["Swift Boots","Corrosion Scythe","Demon Hunter Sword","Golden Staff","Athena's Shield","Immortality"],"Marksman",["Purify","Inspire"],"THE tank killer. True damage ignores defense. 2+ tanks = pick Karrie.",["Tigreal","Angela","Estes"]],
["Beatrix","Marksman","","A","Gold",3,50.7,8.6,4,"4-Weapon Arsenal",["Saber","Lancelot","Helcurt"],["Tigreal","Atlas","Slow tanks"],["Swift Boots","Blade of Despair","Windtalker","Berserker's Fury","Malefic Roar","Immortality"],"Marksman",["Flicker","Purify"],"Master 4 weapons: Sniper=poke, Shotgun=burst, SMG=sustain, Rocket=AoE.",["Tigreal","Angela","Mathilda"]],
["Brody","Marksman","","A","Gold",2,52.5,11.5,3,"Early-Game Stack",["Saber","Lancelot","Gap closers"],["Slow tanks","Poke lanes"],["Warrior Boots","Blade of Despair","Endless Battle","Malefic Roar","Immortality","Hunter Strike"],"Marksman",["Flicker","Purify"],"DON'T build attack speed — fixed AA. Raw damage only.",["Tigreal","Angela","Mathilda"]],
["Lancelot","Assassin","","A","Jungle",3,50.8,7.1,8,"Triple Dash Immune",["Khufra","Phoveus","Saber"],["Pharsa","Layla","Miya"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"S2 immunity dodges everything. Chain dashes for resets.",["Tigreal","Angela","Chip"]],
["Ling","Assassin","","A","Jungle",3,50.6,6.3,61,"Wall Walker",["Khufra","Phoveus","Saber"],["Pharsa","Layla","Miya"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"61% ban. Walls = unmatched mobility. Master energy management.",["Tigreal","Angela","Chip"]],
["Fanny","Assassin","","A","Jungle",3,50.4,4.8,58,"Cable Swing",["Khufra","Phoveus","Saber"],["Immobile mages","Layla"],["Warrior Boots","Blade of Despair","Hunter Strike","Malefic Roar","Endless Battle","Immortality"],"Assassin",["Retribution"],"Highest skill ceiling. Khufra alone counters entire kit.",["Tigreal","Angela","Estes"]],
["Atlas","Tank","","A","Roam",2,51.8,7.2,4,"Mass Grab",["Diggie","Purify","Valir"],["Grouped enemies","Miya"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Radiant Armor"],"Tank",["Flicker","Vengeance"],"Flicker+Ult grabs 5 enemies. Pair with AoE damage.",["Pharsa","Zhuxin","Sora"]],
["Ruby","Fighter","","A","EXP",2,51.5,6.9,2,"Lifesteal Queen",["Esmeralda","Karrie","Anti-heal"],["Tigreal","Atlas","Akai"],["Warrior Boots","Haas's Claws","Endless Battle","Oracle","Queen's Wings","Immortality"],"Fighter",["Flicker","Purify"],"Sleeper OP. Flicker+Ult = Tigreal-level engage. Unkillable w/o anti-heal.",["Pharsa","Zhuxin","Angela"]],
["Esmeralda","Mage","Tank","A","EXP",2,50.9,6.4,3,"Shield Vampire",["Baxia","Anti-heal","Karrie"],["Lolita","Athena users","Hylos"],["Arcane Boots","Enchanted Talisman","Concentrated Energy","Holy Crystal","Divine Glaive","Immortality"],"Mage",["Flicker","Purify"],"Every enemy shield becomes your HP. Destroys shield comps.",["Tigreal","Angela","Estes"]],
["Diggie","Support","","A","Roam",2,51.0,5.8,3,"Anti-CC Cleanser",["Burst damage","Saber"],["Tigreal","Atlas","Khufra"],["Tough Boots","Fleeting Time","Necklace of Durance","Dominance Ice","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"THE CC counter. Press Ult when enemy Tigreal/Atlas engages.",["Any carry"]],
["Estes","Support","","A","Roam",1,51.3,6.2,4,"Fountain Healer",["Anti-heal","Baxia","Sea Halberd"],["Poke comps","Sustain"],["Tough Boots","Enchanted Talisman","Oracle","Necklace of Durance","Dominance Ice","Immortality"],"Support",["Flicker","Heal"],"Best healer. ALWAYS buy anti-heal vs Estes.",["Yu Zhong","Thamuz"]],
["Marcel","Tank","Support","A","Roam",3,50.4,5.1,2,"True DMG Support",["Poke comps","Valir"],["Grouped enemies"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"S40 newest. True damage from tank build. 3s stasis ult.",["Pharsa","Zhuxin","Sora"]],
["Granger","Marksman","","A","Jungle",2,50.8,7.5,3,"6th Bullet Burst",["Khufra","Chou","Saber"],["Pharsa","Layla","Miya"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Master 6-bullet rhythm. Reload cancel = higher DPS.",["Tigreal","Angela","Mathilda"]],
["Gusion","Assassin","","A","Jungle",3,50.5,5.8,5,"10-Dagger Burst",["Khufra","Phoveus","Saber"],["Squishy mages","Layla"],["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Concentrated Energy","Winter Truncheon"],"Mage",["Retribution"],"10-dagger combo: S1→S2→S1→S2 return. Instant kill.",["Tigreal","Angela","Chip"]],
["Franco","Tank","","A","Roam",2,50.6,6.1,2,"Hook & Suppress",["Diggie","Purify","Minion block"],["Squishy carries","Isolated"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Radiant Armor"],"Tank",["Flicker","Vengeance"],"One hook on carry = win fight. Practice angles.",["Any burst damage"]],
["Uranus","Tank","","A","EXP",1,50.8,6.5,3,"Unkillable Regen",["Anti-heal","Baxia","Esmeralda"],["Low damage poke","Zilong"],["Warrior Boots","Oracle","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor"],"Tank",["Flicker","Vengeance"],"Without anti-heal he CANNOT die. Can jungle or EXP.",["Estes","Angela"]],
["Lylia","Mage","","A","Mid",2,51.2,5.9,2,"Zone + Rewind",["Lancelot","Ling","Dive"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Ult rewinds HP/position = free death save. Very safe mid.",["Tigreal","Khufra","Atlas"]],
["Bruno","Marksman","","A","Gold",1,51.7,5.2,1,"Passive Crit Stack",["Saber","Lancelot","Dive"],["Tanks","Late game"],["Swift Boots","Windtalker","Berserker's Fury","Endless Battle","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Purify"],"SECRET WEAPON. Low pick = never banned. Crit stacking is broken.",["Tigreal","Angela","Estes"]],
["Hilda","Fighter","Tank","A","Roam",1,51.4,5.3,2,"Bush Ambush",["Kite heroes","Karrie"],["Squishy roamers","Layla"],["Tough Boots","Blade of Despair","Dominance Ice","Antique Cuirass","Immortality","Athena's Shield"],"Fighter",["Flicker","Execute"],"Rising. Ult stacks PERMANENTLY per kill. Snowball machine.",["Any team"]],
["Thamuz","Fighter","","A","EXP",1,51.0,6.1,2,"Fire Sustain",["Esmeralda","Karrie","Lunox"],["Zilong","Alucard","Roger"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Dominance Ice","Immortality"],"Fighter",["Vengeance","Flicker"],"Ult = unkillable in zone. Great for beginners.",["Estes","Angela"]],
["Yu Zhong","Fighter","","A","EXP",2,50.6,6.3,3,"Black Dragon",["Anti-heal","Karrie","Esmeralda"],["Zilong","Alucard"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Dominance Ice","Immortality"],"Fighter",["Flicker","Execute"],"Dragon form = CC immune AoE beast. Anti-heal destroys him.",["Estes","Angela"]],
["Selena","Assassin","Mage","A","Roam",3,50.3,5.4,3,"Long Stun Arrow",["Purify","Diggie","Minion block"],["Immobile targets"],["Arcane Boots","Lightning Truncheon","Holy Crystal","Divine Glaive","Genius Wand","Blood Wings"],"Mage",["Flicker","Execute"],"Arrow from fog = 3s stun. Practice trajectories.",["Any carry"]],
["Kagura","Mage","","A","Mid",3,50.4,4.5,2,"Umbrella Master",["Lancelot","Ling","Saber"],["Grouped enemies"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Built-in purify on umbrella recall. Very high skill ceiling.",["Tigreal","Atlas","Khufra"]],
["Melissa","Marksman","","A","Gold",2,51.0,5.8,2,"Anti-Dive MM",["Long range poke","Pharsa"],["Dive heroes","Saber"],["Swift Boots","Windtalker","Berserker's Fury","Haas's Claws","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Inspire"],"Ult prevents anyone approaching. Best vs dive comps.",["Tigreal","Angela","Estes"]],
["Lolita","Tank","Support","A","Roam",2,50.9,4.8,2,"Projectile Shield",["Non-projectile heroes"],["Pharsa","Miya","Layla"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Radiant Armor"],"Tank",["Flicker","Vengeance"],"Shield blocks ALL projectiles including ults.",["Melee carries"]],
["Hylos","Tank","","A","Roam",1,50.7,5.5,2,"HP Drain Ring",["Karrie","DHS users"],["Low mobility heroes"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Ring + Vengeance = massive reflected damage.",["Any team"]],
["Khaleed","Fighter","","A","EXP",1,50.8,5.7,1,"Sand Sustain",["Esmeralda","Anti-heal","Burst"],["Zilong","Alucard"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Dominance Ice","Immortality"],"Fighter",["Flicker","Execute"],"Sand walk heals. Long-range ult for engage/escape.",["Tigreal","Angela"]],
["Badang","Fighter","","A","EXP",2,50.5,5.0,2,"Wall Trap Burst",["Purify","Dash heroes"],["Immobile heroes","Layla"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Wall trap + Ult in tight spaces is devastating.",["Tigreal","Atlas"]],
["Cici","Fighter","","A","EXP",2,50.7,5.4,2,"Yo-Yo Sustain",["Phoveus","Khufra","Anti-heal"],["Immobile fighters"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Immortality","Dominance Ice"],"Fighter",["Flicker","Execute"],"Unique yo-yo swing = mobility + sustain.",["Tigreal","Angela"]],
["Edith","Tank","Marksman","A","Roam",2,50.6,4.7,2,"Transform Tank→MM",["Karrie","Esmeralda"],["Squishy teams"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Tank form CC → fly up → rain magic damage.",["Any team"]],
["Baxia","Tank","","A","Roam",1,50.5,4.9,2,"Anti-Heal Tank",["Burst damage","Phoveus"],["Healers","Estes","Uranus"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Best anti-heal tank. Passive reduces all enemy healing/shields.",["Any team"]],
["Gatotkaca","Tank","Fighter","A","Roam",1,50.4,4.6,2,"Global Dive Taunt",["Karrie","Esmeralda"],["Physical teams"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Global ult dive + taunt. Great counter-engage.",["Any team"]],
["Belerick","Tank","","A","Roam",1,50.3,4.4,1,"Reflect Tank",["Magic damage","Esmeralda"],["Physical attackers","AA heroes"],["Tough Boots","Dominance Ice","Antique Cuirass","Blade Armor","Athena's Shield","Immortality"],"Tank",["Vengeance","Flicker"],"Passive reflects damage. Counters dive. CC immune ult.",["Any team"]],
["Claude","Marksman","","A","Gold",2,50.5,5.1,2,"Mirror DPS",["Saber","Lancelot","Burst"],["Grouped teams"],["Swift Boots","Demon Hunter Sword","Golden Staff","Corrosion Scythe","Athena's Shield","Immortality"],"Marksman",["Purify","Inspire"],"Ult = massive AoE DPS circle. Use monkey for positioning.",["Tigreal","Angela"]],
["Natalia","Assassin","","A","Jungle",3,50.2,3.9,3,"Stealth Burst",["Detection","Grouped teams"],["Isolated squishies"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution","Execute"],"Invisible in bush. Silence on first stealth hit.",["Any team"]],
["Lunox","Mage","","A","Mid",2,50.6,4.8,2,"Light/Dark Dual Mode",["Saber","Lancelot","Burst"],["Tanks","Sustain fights"],["Arcane Boots","Clock of Destiny","Concentrated Energy","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Purify"],"Light = sustain/invincibility. Dark = burst. Switch per situation.",["Tigreal","Angela"]],
["Yve","Mage","","A","Mid",2,50.5,4.5,2,"Real-Time Target Ult",["Lancelot","Ling","Dive"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Ult lets you manually target zones in real-time.",["Tigreal","Khufra"]],
["Xavier","Mage","","A","Mid",2,50.4,4.3,2,"Global Snipe",["Lancelot","Ling","Dive"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Global ult snipes across map. Stack passive for damage.",["Tigreal","Khufra"]],
["Johnson","Tank","","A","Roam",2,50.3,4.6,2,"Car Engage",["Diggie","Purify","Walls"],["Squishy carries"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Blade Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Ult = car form carrying an ally into enemies. Fun and effective.",["Eudora","Odette"]],
["Harith","Mage","","A","Mid",2,50.7,4.6,2,"Dash Spam Mage",["Khufra","Phoveus","Saber"],["Layla","Miya"],["Arcane Boots","Enchanted Talisman","Concentrated Energy","Holy Crystal","Divine Glaive","Winter Truncheon"],"Mage",["Flicker","Purify"],"Ult enables rapid dash spam. High-mobility mage.",["Tigreal","Angela"]],
["Obsidia","Marksman","","A","Gold",2,50.3,3.8,1,"Bone Shard Scaling",["Early aggression","Saber"],["Tanks","Late game"],["Swift Boots","Demon Hunter Sword","Golden Staff","Corrosion Scythe","Wind of Nature","Malefic Roar"],"Marksman",["Inspire","Purify"],"Farm to max Bone Energy. Shreds tanks when stacked.",["Tigreal","Angela"]],
["Kalea","Support","Tank","A","Roam",2,50.5,4.2,2,"Engage Healer",["Burst damage","Anti-heal"],["Dive comps"],["Tough Boots","Fleeting Time","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"Engage bruiser AND healer. Immediate meta impact.",["Any team"]],
["Miya","Marksman","","B","Gold",1,49.8,8.5,1,"Hyper Carry",["Saber","Lancelot","Helcurt"],["Slow tanks"],["Swift Boots","Windtalker","Berserker's Fury","Haas's Claws","Golden Staff","Malefic Roar"],"Marksman",["Flicker","Purify"],"Classic late-game carry. Farm and melt everything.",["Tigreal","Angela","Estes"]],
["Layla","Marksman","","B","Gold",1,49.5,9.2,0,"Longest Range",["Any assassin","Saber"],["Tanks w/o gap close"],["Swift Boots","Windtalker","Berserker's Fury","Haas's Claws","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Flameshot"],"Stay BEHIND team. Zero escape. Range is only defense.",["Tigreal","Angela","Estes"]],
["Eudora","Mage","","B","Mid",1,50.5,6.8,1,"One-Combo Delete",["Athena's Shield","Magic resist"],["Squishy heroes","Layla"],["Arcane Boots","Lightning Truncheon","Holy Crystal","Divine Glaive","Genius Wand","Blood Wings"],"Mage",["Flicker","Flameshot"],"Revamped 2.1.61 Superconductor. Rising pick. Great for beginners.",["Tigreal","Atlas"]],
["Hanabi","Marksman","","B","Gold",1,49.6,4.5,0,"Bounce AA + CC Immune",["Saber","Lancelot","Burst"],["Grouped teams"],["Swift Boots","Windtalker","Berserker's Fury","Haas's Claws","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Purify"],"Bouncing AAs hit grouped enemies. CC immune shield passive.",["Tigreal","Angela"]],
["Paquito","Fighter","","B","EXP",2,49.8,4.5,1,"Boxing Combo",["Phoveus","Khufra","Kite"],["Melee fighters"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Chain skills into enhanced versions for burst.",["Tigreal","Angela"]],
["Alpha","Fighter","","B","Jungle",2,50.2,4.3,1,"Sustain True DMG",["Anti-heal","Esmeralda"],["Squishy teams"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Retribution","Execute"],"Sustain + true damage ult. More forgiving than flashy junglers.",["Tigreal","Angela"]],
["Balmond","Fighter","","B","Jungle",1,50.2,5.1,0,"Spin Execute",["Kite heroes","Karrie"],["Low HP targets"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Dominance Ice","Immortality"],"Fighter",["Retribution","Execute"],"Best beginner jungler. Spin, ult execute.",["Tigreal","Angela"]],
["Alice","Mage","Tank","B","EXP",2,50.1,4.2,1,"Blood Drain Diver",["Anti-heal","Baxia","Burst"],["Prolonged fights"],["Arcane Boots","Enchanted Talisman","Concentrated Energy","Holy Crystal","Divine Glaive","Immortality"],"Mage",["Flicker","Purify"],"Stack blood orbs for permanent HP. Dive and drain.",["Tigreal","Estes"]],
["Sun","Fighter","","B","EXP",1,50.3,4.8,1,"Clone Split Push",["AoE damage","Esmeralda"],["Towers","Single target"],["Warrior Boots","Corrosion Scythe","Demon Hunter Sword","Golden Staff","Malefic Roar","Immortality"],"Fighter",["Arrival","Execute"],"Clones melt towers. Split push specialist.",["Chip","Angela"]],
["Masha","Fighter","Tank","B","EXP",1,50.0,3.8,0,"3 HP Bar Push",["Burst damage","Saber"],["Towers","Slow fighters"],["Warrior Boots","Corrosion Scythe","Demon Hunter Sword","Wind of Nature","Malefic Roar","Immortality"],"Fighter",["Arrival","Retribution"],"3 HP bars = deceptively tanky. Insane tower push.",["Chip","Angela"]],
["Argus","Fighter","","B","EXP",1,49.7,3.5,0,"Immortal Ult DPS",["Kite heroes","CC chains"],["All-in fights"],["Warrior Boots","Blade of Despair","Berserker's Fury","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Ult = full immortality for seconds. Time it perfectly.",["Angela","Estes"]],
["Terizla","Fighter","","B","EXP",1,49.9,4.1,1,"Damage Reduction",["Ranged poke","Kite"],["Melee fighters"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Dominance Ice","Immortality"],"Fighter",["Flicker","Execute"],"Nearly impossible to dive under tower. Safe laner.",["Tigreal","Angela"]],
["X.Borg","Fighter","","B","EXP",2,49.8,3.9,0,"Fire Spray Area",["Ranged poke","Karrie"],["Melee fighters"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Immortality","Dominance Ice"],"Fighter",["Flicker","Execute"],"Spray fire for area damage. Ult pulls and explodes.",["Tigreal","Angela"]],
["Jawhead","Fighter","Tank","B","Roam",2,50.0,4.0,1,"Throw Mechanic",["Grouped teams","Heavy CC"],["Isolated targets"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Radiant Armor"],"Tank",["Flicker","Vengeance"],"Throw enemies into team or behind turrets.",["Any team"]],
["Natan","Marksman","","B","Gold",2,50.0,3.7,1,"Magic MM",["Saber","Lancelot","Dive"],["Slow teams"],["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Concentrated Energy","Blood Wings"],"Mage",["Flicker","Purify"],"Magic damage marksman. Reverse clone doubles DPS.",["Tigreal","Angela"]],
["Chang'e","Mage","","B","Mid",1,50.1,4.0,0,"Long Beam Poke",["Lancelot","Ling","Gap closers"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Long-range beam ult. Shield absorbs damage. Stay max range.",["Tigreal","Khufra"]],
["Luo Yi","Mage","","B","Mid",2,50.0,3.5,0,"Yin-Yang CC Teleport",["Purify","Dive assassins"],["Grouped enemies"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Matching marks stun. Ult teleports entire team.",["Tigreal","Atlas"]],
["Rafaela","Support","","B","Roam",1,50.2,3.8,0,"Speed + Heal + Stun",["Anti-heal","Burst"],["Engage comps"],["Tough Boots","Fleeting Time","Necklace of Durance","Dominance Ice","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"Underrated. Speed boost for rotations. Ult stuns in line.",["Any team"]],
["Floryn","Support","","B","Roam",1,50.1,3.5,0,"Global Heal + Item Share",["Burst","Anti-heal"],["Sustain fights"],["Tough Boots","Fleeting Time","Necklace of Durance","Dominance Ice","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"Only global heal ult support. Shares lantern item with ally.",["Any team"]],
["Akai","Tank","","B","Roam",1,49.8,3.9,1,"Pinball Ult Push",["Purify","Diggie","Valir"],["Wall-pinnable targets"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Ult pins enemies vs walls. Use near terrain.",["Any team"]],
["Zilong","Fighter","Assassin","C","EXP",1,49.2,5.5,0,"Chase & Flip",["CC","Khufra","Chou"],["Miya","Layla","Isolated"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Arrival","Execute"],"Split push king. Ult = immune to slows + massive speed.",["Chip","Angela"]],
["Alucard","Fighter","Assassin","C","Jungle",1,49.0,5.8,0,"Lifesteal King",["Anti-heal","Esmeralda","Baxia"],["Low CC teams"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution","Execute"],"Countered by anti-heal. Best in lower ranks.",["Tigreal","Angela"]],
["Aldous","Fighter","","C","EXP",1,48.8,4.2,0,"Infinite Stack Global",["Wind of Nature","Early aggression"],["Late squishies"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Fighter",["Arrival","Execute"],"Infinite stacking punch. Global ult. Weak early, scary late.",["Chip","Angela"]],
["Martis","Fighter","","C","EXP",2,49.4,5.1,38,"CC Chain Execute",["Ranged poke","Valir","Karrie"],["Melee fighters","Zilong"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Was #1 ban Feb. Fallen but CC chain still devastating.",["Tigreal","Angela"]],
["Roger","Fighter","Marksman","C","Jungle",2,49.3,3.8,0,"Ranged↔Melee Transform",["CC","Burst","Khufra"],["Low HP targets"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Human ranged → Wolf melee transform. Execute with wolf.",["Tigreal","Angela"]],
["Silvanna","Fighter","Mage","C","EXP",1,49.1,3.2,0,"Imperial Prison",["Purify","Dash heroes"],["Immobile heroes"],["Arcane Boots","Concentrated Energy","Holy Crystal","Divine Glaive","Immortality","Genius Wand"],"Mage",["Flicker","Execute"],"Ult traps enemies in prison zone.",["Tigreal","Angela"]],
["Bane","Fighter","Mage","C","EXP",1,49.0,3.0,0,"Shark Push",["Burst","Gap closers"],["Towers","Poke lanes"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Fighter",["Arrival","Execute"],"Shark ult damages towers. Good for split push.",["Chip","Angela"]],
["Yin","Fighter","","C","Jungle",2,49.2,3.4,0,"1v1 Dimension",["Wind of Nature","Escape heroes"],["Isolated squishies"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Drags enemy into 1v1 arena. Useless if they have escape.",["Tigreal","Angela"]],
["Dyrroth","Fighter","","C","EXP",1,49.0,3.3,0,"Armor Shred",["Kite heroes","Ranged poke"],["Low armor targets"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Shreds armor for physical damage teams.",["Tigreal","Angela"]],
["Minsitthar","Fighter","","B","EXP",2,50.2,4.0,1,"Anti-Dash Ult Zone",["Ranged poke","Kite heroes"],["Dash-heavy comps"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Ult zone prevents ALL dashes inside. Rising counter-pick.",["Tigreal","Phoveus"]],
["Novaria","Mage","","B","Mid",2,50.3,3.6,0,"Star Burst Poke",["Dive assassins","Saber"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed in 2.1.61. Improved damage + CD.",["Tigreal","Khufra"]],
["Gord","Mage","","B","Mid",1,50.1,3.4,0,"Laser Beam",["Dive assassins","Saber"],["Immobile grouped"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed 2.1.61. Long-range laser ult shreds grouped enemies.",["Tigreal","Atlas"]],
["Vale","Mage","","B","Mid",2,50.2,3.5,0,"Wind CC/Burst Choice",["Dive assassins","Saber"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed 2.1.61. Choose CC or burst on each skill upgrade.",["Tigreal","Atlas"]],
["Nana","Mage","Support","B","Mid",1,50.4,3.8,0,"Molina Transform",["Dive assassins","Lancelot"],["Grouped enemies"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed 2.1.61. Molina transforms enemies. Zone control queen.",["Tigreal","Atlas"]],
["Karina","Assassin","","B","Jungle",2,50.4,4.5,1,"Execute Resets",["CC chains","Grouped teams"],["Isolated squishies"],["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Concentrated Energy","Winter Truncheon"],"Mage",["Retribution"],"Beginner-friendly jungler. Ult resets on kills. Build magic.",["Tigreal","Angela"]],
["Harley","Mage","Assassin","B","Jungle",2,50.2,3.8,1,"Burst Teleport",["Khufra","Chou","Heavy CC"],["Squishy mages","Layla"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Retribution"],"Teleport in, burst combo, teleport back out. Very safe mage jungler.",["Tigreal","Angela"]],
["Zhask","Mage","","B","Mid",2,50.1,3.2,0,"Spawn Turret",["Dive assassins","Lancelot"],["Immobile teams","Siege"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Spawn turret for zone control. Ult = mega turret mode.",["Tigreal","Atlas"]],
["Popol and Kupa","Marksman","","B","Gold",2,49.9,3.1,0,"Pet + Traps",["Saber","Lancelot","Dive"],["Zone control","Pushing"],["Swift Boots","Windtalker","Berserker's Fury","Haas's Claws","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Inspire"],"Set traps for vision+CC. Kupa (wolf) provides extra DPS.",["Tigreal","Angela"]],
["Lesley","Marksman","","B","Gold",2,49.7,4.8,0,"Sniper Crit",["Saber","Lancelot","Gap closers"],["Immobile targets","Late game"],["Swift Boots","Berserker's Fury","Windtalker","Endless Battle","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Purify"],"Long-range AA from stealth. Crit-based sniper. Weak vs dive.",["Tigreal","Angela"]],
["Moskov","Marksman","","B","Gold",2,49.8,3.4,0,"Penetrating AA",["Saber","Lancelot","Burst"],["Grouped enemies","Late"],["Swift Boots","Corrosion Scythe","Demon Hunter Sword","Golden Staff","Malefic Roar","Immortality"],"Marksman",["Inspire","Purify"],"AAs penetrate through enemies. Stun enemies against walls.",["Tigreal","Angela"]],
["Aamon","Assassin","","B","Jungle",2,50.0,4.0,2,"Stealth Burst Mage",["Detection","AOE","Khufra"],["Squishy carries","Isolated"],["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Concentrated Energy","Blood Wings"],"Mage",["Retribution"],"Nerfed 2.1.61 ult shard damage. Still viable. Invisible burst mage assassin.",["Tigreal","Angela"]],
["Benedetta","Assassin","","B","EXP",3,49.8,3.5,1,"Dash Immune Fighter",["CC chains","Phoveus"],["Squishy targets"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Flicker","Execute"],"Charge dash gives brief immunity. High skill ceiling EXP laner.",["Tigreal","Angela"]],
["Ixia","Marksman","","B","Gold",2,49.5,4.2,3,"Long Range Poke MM",["Saber","Lancelot","Dive"],["Immobile teams"],["Swift Boots","Windtalker","Berserker's Fury","Haas's Claws","Malefic Roar","Blade of Despair"],"Marksman",["Flicker","Purify"],"Biggest nerf this patch: S1+regen cut. Was S-tier, now B.",["Tigreal","Angela"]],
["Odette","Mage","","B","Mid",1,50.0,3.3,0,"Channeling AoE Ult",["CC interrupts","Saber"],["Grouped immobile"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Purify"],"Buffed 2.1.61. Channeling ult deals massive AoE. Pair with Johnson.",["Johnson","Tigreal"]],
["Aurora","Mage","","C","Mid",1,49.3,2.8,0,"Freeze Burst",["Athena's Shield","Dive"],["Squishy clumped"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed 2.1.61. Stack passive → freeze + burst combo.",["Tigreal","Atlas"]],
["Cyclops","Mage","","C","Mid",1,49.2,2.5,0,"Rapid Fire Mage",["Dive assassins","Saber"],["Immobile targets"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Purify"],"Buffed 2.1.61. Fast skill spam. Ult locks onto target.",["Tigreal","Angela"]],
["Kadita","Mage","","C","Mid",2,49.1,2.3,0,"Ocean Burst Immune",["Poke","Long range"],["Dive comps"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed 2.1.61. Brief immunity during skills. Ocean burst combo.",["Tigreal","Atlas"]],
["Vexana","Mage","","C","Mid",1,49.0,2.1,0,"Summon + Burst",["Dive assassins"],["Immobile teams"],["Arcane Boots","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings"],"Mage",["Flicker","Flameshot"],"Buffed 2.1.61. Kill enemy → summon their clone to fight for you.",["Tigreal","Atlas"]],
["Hanzo","Assassin","","C","Jungle",2,48.8,2.5,0,"Soul Projection",["Body hunters","Grouped"],["Isolated squishies"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Retribution"],"Buffed recently. Soul leaves body to assassinate. Protect your body.",["Tigreal","Angela"]],
["Minotaur","Tank","","C","Roam",1,49.0,2.8,0,"Rage Heal + CC",["Karrie","Esmeralda"],["Physical teams"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Heal in normal mode. Rage mode = massive AoE CC.",["Any team"]],
["Grock","Tank","","C","Roam",2,48.5,2.2,0,"Wall Builder",["Karrie","Magic damage"],["Physical teams"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Build walls to block paths. Strong early but falls off late.",["Any team"]],
["Carmilla","Support","","C","Roam",2,49.0,2.0,0,"Chain Link CC",["Burst","Saber"],["Grouped enemies"],["Tough Boots","Fleeting Time","Dominance Ice","Necklace of Durance","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"Improved 2.1.61. Ult chains enemies — damage shared between linked targets.",["Tigreal","Atlas"]],
["Faramis","Support","Mage","C","Roam",2,49.1,2.2,0,"Resurrect Zone",["Burst","Anti-heal"],["Teamfight comps"],["Arcane Boots","Fleeting Time","Clock of Destiny","Holy Crystal","Divine Glaive","Immortality"],"Mage",["Flicker","Flameshot"],"Ult = resurrection zone. Allies who die inside revive instantly.",["Any teamfight comp"]],
["Clint","Marksman","","A","Gold",2,50.8,4.8,1,"Enhanced AA Burst",["Saber","Lancelot","Gap closers"],["Tanks","Poke lanes"],["Swift Boots","Endless Battle","Berserker's Fury","Blade of Despair","Malefic Roar","Immortality"],"Marksman",["Flicker","Purify"],"Each skill enhances next AA. Weave skills between autos.",["Tigreal","Angela"]],
["Lukas","Fighter","","B","EXP",2,49.7,3.5,1,"Naruto Collab Fighter",["Phoveus","Khufra","CC"],["Squishy targets"],["Warrior Boots","War Axe","Blade of Despair","Endless Battle","Malefic Roar","Immortality"],"Fighter",["Flicker","Execute"],"Buffed in recent patch. Naruto collab hero. Dash combo fighter.",["Tigreal","Angela"]],
["Suyou","Fighter","Assassin","B","EXP",2,49.8,3.2,1,"Sasuke Collab",["Phoveus","Khufra"],["Squishy targets"],["Warrior Boots","Blade of Despair","Endless Battle","Hunter Strike","Malefic Roar","Immortality"],"Assassin",["Flicker","Execute"],"Buffed recently. Sasuke collab. Quick burst combo.",["Tigreal","Angela"]],
["Phylax","Tank","Marksman","B","Roam",2,49.5,2.8,0,"Transform Tank→MM",["Karrie","Esmeralda"],["Squishy teams"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Tank form → ranged form transformation. Similar to Edith.",["Any team"]],
["Barats","Tank","Fighter","B","EXP",2,50.0,3.0,1,"Grow + Devour",["Karrie","Esmeralda","Kite"],["Melee fighters"],["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Immortality"],"Tank",["Flicker","Vengeance"],"Grow by stacking passive. Ult devours enemy hero.",["Tigreal","Angela"]],
["Kaja","Support","Mage","A","Roam",2,51.0,4.5,5,"Suppress Grab",["Purify","Diggie"],["Isolated carries"],["Tough Boots","Fleeting Time","Dominance Ice","Necklace of Durance","Athena's Shield","Immortality"],"Support",["Flicker","Heal"],"S+ ban priority. Suppress ult GRABS enemy and drags them. Guaranteed pick.",["Any burst carry"]],
["Aulus","Fighter","","C","EXP",1,48.9,3.0,0,"Stacking Axe",["Kite heroes","Burst"],["Extended fights"],["Warrior Boots","War Axe","Blade of Despair","Oracle","Dominance Ice","Immortality"],"Fighter",["Flicker","Execute"],"Passive stacks axe power on AAs. Slow start but devastating late game.",["Tigreal","Angela"]],
];

const H=RAW.map(r=>({n:r[0],r:r[1],r2:r[2],t:r[3],l:r[4],d:r[5],wr:r[6],pr:r[7],br:r[8],sp:r[9],c:r[10],s:r[11],b:r[12],e:r[13],sp2:r[14],tip:r[15],sy:r[16]}));


// ═══ ITEMS ═══
const ITEMS={"Attack":[{n:"Blade of Despair",st:"+160 ATK, +5% MS",pa:"+25% ATK vs <50% HP",g:3010,i:"⚔️",tg:["burst"]},{n:"Endless Battle",st:"+65 ATK, +250 HP, +10% CDR, +10% LS",pa:"After skill→next AA 60% True DMG",g:2470,i:"🗡️",tg:["sustain"]},{n:"Hunter Strike",st:"+80 ATK, +10% CDR",pa:"5 hits→+50% MS 3s",g:2010,i:"🏹",tg:["mobility"]},{n:"War Axe",st:"+35 ATK, +550 HP, +10% CDR",pa:"Stacking ATK+PEN 8x",g:2100,i:"🪓",tg:["sustain"]},{n:"Malefic Roar",st:"+60 ATK, +35% PEN",pa:"Extra PEN vs turrets",g:2060,i:"💥",tg:["pen"]},{n:"Sea Halberd",st:"+80 ATK, +25% AS",pa:"AA reduces healing 50%",g:2050,i:"🔱",tg:["anti-heal"]},{n:"Bloodlust Axe",st:"+70 ATK, +10% CDR",pa:"+20% Spell Vamp",g:1960,i:"🩸",tg:["sustain"]}],"Magic":[{n:"Holy Crystal",st:"+100 MP",pa:"+21-35% MP scaling",g:2180,i:"💎",tg:["burst"]},{n:"Lightning Truncheon",st:"+75 MP, +10% CDR",pa:"Skill bounces lightning 3x",g:2250,i:"⚡",tg:["burst"]},{n:"Divine Glaive",st:"+65 MP, +35% MPEN",pa:"Extra PEN vs high MDEF",g:1970,i:"✨",tg:["pen"]},{n:"Clock of Destiny",st:"+60 MP, +615 HP",pa:"Stacking HP+MP 12x",g:1950,i:"⏰",tg:["scaling"]},{n:"Genius Wand",st:"+75 MP, +5% MS",pa:"-9 enemy MDEF per hit 3x",g:2000,i:"🪄",tg:["pen"]},{n:"Necklace of Durance",st:"+60 MP, +10% MPEN",pa:"Skills reduce healing 50%",g:1870,i:"📿",tg:["anti-heal"]},{n:"Fleeting Time",st:"+70 MP, +15% CDR",pa:"Kill/assist→ult CD -30%",g:2050,i:"⌛",tg:["support"]}],"Defense":[{n:"Antique Cuirass",st:"+920 HP, +54 PDEF",pa:"Enemy ATK -10% on hit 3x",g:2170,i:"🛡️",tg:["phys"]},{n:"Athena's Shield",st:"+900 HP, +62 MDEF",pa:"Magic shield every 12s",g:2150,i:"🏛️",tg:["magic"]},{n:"Dominance Ice",st:"+70 PDEF, +10% CDR",pa:"Nearby enemy Heal-50% AS-30%",g:2010,i:"🧊",tg:["anti-heal"]},{n:"Immortality",st:"+800 HP, +40 PDEF",pa:"Resurrect 16% HP. 210s CD",g:2120,i:"✨",tg:["revive"]},{n:"Radiant Armor",st:"+950 HP, +52 MDEF",pa:"Stacking magic DMG reduction",g:1880,i:"🌟",tg:["magic"]},{n:"Oracle",st:"+850 HP, +42 MDEF, +10% CDR",pa:"Shield/Regen/LS +30%",g:2060,i:"🔮",tg:["sustain"]},{n:"Wind of Nature",st:"+30 ATK, +20% AS",pa:"Active: 2s phys immunity",g:1910,i:"🌿",tg:["active"]}],"Speed":[{n:"Windtalker",st:"+40% AS, +20% Crit",pa:"Chain-bounce magic DMG",g:1870,i:"🌀",tg:["crit"]},{n:"Berserker's Fury",st:"+65 ATK, +25% Crit",pa:"+40% Crit DMG",g:2350,i:"😤",tg:["crit"]},{n:"Golden Staff",st:"+65 ATK, +30% AS",pa:"Converts Crit→AS",g:2100,i:"🥢",tg:["on-hit"]},{n:"Demon Hunter Sword",st:"+35 ATK, +25% AS",pa:"AA 9% enemy current HP",g:2180,i:"👹",tg:["tank-kill"]},{n:"Corrosion Scythe",st:"+35 ATK, +25% AS",pa:"AA slow 8% 5x",g:1750,i:"🌙",tg:["slow"]},{n:"Haas's Claws",st:"+70 ATK, +20% Crit",pa:"+20% LS. <50% HP +15%",g:1810,i:"🦇",tg:["sustain"]}],"Boots":[{n:"Warrior Boots",st:"+22 PDEF, +40 MS",pa:"+5 PDEF per AA 3x",g:720,i:"🥾",tg:["phys"]},{n:"Tough Boots",st:"+22 MDEF, +40 MS",pa:"+22% CC Reduction",g:710,i:"👢",tg:["cc"]},{n:"Swift Boots",st:"+15% AS, +40 MS",pa:"Attack speed",g:710,i:"👟",tg:["speed"]},{n:"Arcane Boots",st:"+10 MPEN, +40 MS",pa:"Flat magic pen",g:690,i:"🧙",tg:["mpen"]}]};

// ═══ SPELLS ═══
const SPELLS=[{n:"Flicker",cd:120,d:"Teleport short distance",b:"Tanks, Fighters, Mages",i:"⚡"},{n:"Retribution",cd:35,d:"Smite camps. Mandatory jungle",b:"All junglers",i:"🔥"},{n:"Execute",cd:90,d:"True damage to low HP",b:"Assassins, fighters",i:"💀"},{n:"Flameshot",cd:50,d:"Long-range knockback",b:"Mages, Layla",i:"🔫"},{n:"Purify",cd:90,d:"Remove CC + 1.2s immune",b:"MM vs CC, Esmeralda",i:"✨"},{n:"Inspire",cd:75,d:"Massive AS boost 5s",b:"AA marksmen",i:"⚔️"},{n:"Vengeance",cd:75,d:"Reflect damage 3s",b:"Tanks",i:"🛡️"},{n:"Heal",cd:90,d:"Heal self + allies",b:"Supports",i:"💚"},{n:"Arrival",cd:75,d:"Teleport to turret/minion",b:"Split pushers",i:"🌀"},{n:"Sprint",cd:100,d:"+50% MS 6s, slow immune",b:"Kiting MMs",i:"🏃"}];

// ═══ META ═══
const PATCH={v:"2.1.61",s:40,d:"Mar 11 2026",nx:"2.1.62"};
const BANS=[{n:"Joy",r:82,tr:"→"},{n:"Helcurt",r:79,tr:"↑"},{n:"Ling",r:61,tr:"→"},{n:"Fanny",r:58,tr:"→"},{n:"Mathilda",r:44,tr:"↑"},{n:"Saber",r:41,tr:"↑"},{n:"Martis",r:38,tr:"↓"},{n:"Leomord",r:35,tr:"→"}];
const RISING=[{n:"Helcurt",ch:"+18% ban",w:"Silence+darkness dominating"},{n:"Saber",ch:"+12% pick",w:"Ult kills from higher HP"},{n:"Marcel",ch:"🆕 New",w:"True damage support"},{n:"Eudora",ch:"+8% pick",w:"Revamped Superconductor"},{n:"Guinevere",ch:"+6% WR",w:"Fighters dominating S40"},{n:"Bruno",ch:"+4% WR",w:"Sleeper crit stacking"}];
const FALLING=[{n:"Ixia",ch:"-11%",w:"S1 + regen nerfed hard"},{n:"Pharsa",ch:"-8%",w:"Burst + CD nerfed"},{n:"Freya",ch:"-6%",w:"33% ult regen cut"},{n:"Gloo",ch:"-4%",w:"Passive DR nerfed"},{n:"YSS",ch:"-3%",w:"Ult 15s→10s"}];
const LANES=[{l:"EXP",i:"⚔️",top:["Sora","Julian","Phoveus","Arlott","Lapu-Lapu"],nt:"8 fighters S-tier. Sora leads. Phoveus = must counter-pick vs dashes."},{l:"Mid",i:"🔮",top:["Zhuxin","Valentina","Pharsa","Lylia","Kagura"],nt:"13 mages buffed. Pool expanded 4→8+ viable. Eudora rising."},{l:"Jungle",i:"🗡️",top:["Fredrinn","Hayabusa","Saber","Leomord","Joy"],nt:"Utility junglers define meta. Tank jungling frees EXP for damage."},{l:"Gold",i:"🏹",top:["Kimmy","Wanwan","Brody","Beatrix","Karrie"],nt:"Farm & carry. Brody = rare early MM. Bruno = sleeper crit."},{l:"Roam",i:"🛡️",top:["Tigreal","Khufra","Gloo","Atlas","Mathilda"],nt:"Flicker+Ult engage is king. Khufra anti-dash. Marcel competing."}];
const TEAMS=[{nm:"Standard",cp:["Tank","Fighter","Mage","MM","JG"],ex:["Tigreal","Sora","Zhuxin","Kimmy","Fredrinn"],ds:"Balanced. Frontline + magic + physical."},{nm:"Hyper Carry",cp:["Tank","Tank","Mage","MM","Assassin"],ex:["Khufra","Uranus","Pharsa","Wanwan","Hayabusa"],ds:"Protect MM. Two frontliners peel."},{nm:"Dive",cp:["Tank","Fighter","Mage","MM","Assassin"],ex:["Atlas","Chou","Zhuxin","Beatrix","Lancelot"],ds:"All-in. Lock targets, assassin cleans."},{nm:"Anti-Dash",cp:["Tank","Fighter","Mage","MM","Tank JG"],ex:["Khufra","Phoveus","Zhuxin","Karrie","Fredrinn"],ds:"Punish every dash."},{nm:"Sustain",cp:["Tank","Fighter","Mage","MM","Support"],ex:["Hylos","Yu Zhong","Lylia","Wanwan","Estes"],ds:"Group & sustain. Need anti-heal to beat."},{nm:"Global",cp:["Tank","Fighter","Mage","MM JG","Support"],ex:["Atlas","Sora","Pharsa","Yi Sun-shin","Chip"],ds:"Vision + teleport = everywhere first."}];

// ═══ JUNGLE GUIDE DATA ═══
const JG_PATHS=[
{name:"Assassin Path (Blue Start)",steps:["Purple/Blue Buff","Lithowanderer","Small Camps","Red/Orange Buff","Level 4 Gank or Turtle"],heroes:["Fanny","Hayabusa","Ling","Joy","Gusion","Nolan"],note:"For energy/mana dependent assassins. Blue buff = sustain for ability spam. Hit level 4 by 1:45-2:00."},
{name:"Tank Jungler Path (Red Start)",steps:["Red/Orange Buff","Golems/Small Camp","Lithowanderer","Purple/Blue Buff","Gank Mid or EXP"],heroes:["Fredrinn","Akai","Baxia"],note:"Red buff slow enhances ganks. Tank junglers don't need blue buff as urgently. Focus on enabling lanes."},
{name:"Aggressive Invade Path",steps:["Your Core Buff","Enemy Core Buff (steal)","Small Camp","Second Buff","Gank"],heroes:["Hayabusa","Saber","Helcurt"],note:"High risk/reward. Only when you have early lane priority. Track enemy jungler's gold on scoreboard."},
{name:"Fast Turtle Rush",steps:["Core Buff","Second Buff","Scuttler/Crab","Turtle (at 2:00)"],heroes:["Saber","Fredrinn","Yi Sun-shin"],note:"Fastest path to level 4 + Turtle. Requires team coordination. Get both buffs before 2:00 Turtle spawn."},
];
const JG_TIMERS=[
{obj:"Turtle",spawn:"2:00",respawn:"Every 2 min",despawn:"8:00 (Lord replaces)",reward:"+Gold/XP team-wide + Shield buff",tip:"Setup 15-20s before spawn. Lure toward your side. Retribution at red HP line."},
{obj:"Lord",spawn:"9:00",respawn:"After death",despawn:"—",reward:"+~300g per player + Turret damage buff",tip:"Only take after winning fight or enemy dead. Vision 30-45s before. Never solo Lord."},
{obj:"Buffs",spawn:"0:20",respawn:"75 seconds",despawn:"—",reward:"Purple=Mana/CDR. Orange=Slow+Damage",tip:"Buff respawn at 75s = sync rotations for double buff before Turtle at 2:00."},
{obj:"Lithowanderer",spawn:"0:30",respawn:"90 seconds",despawn:"—",reward:"Gold + small heal",tip:"Contest this for early gold lead. Position matters — river control wins early game."},
];
const JG_TIPS=[
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

// ═══ STYLES ═══
const P={bg:"#060a13",bg2:"#0c1220",cd:"#111a2e",gold:"#f0b232",goldD:"#c8941a",neon:"#00e5ff",nG:"#39ff14",red:"#ff3b5c",blue:"#4d8bff",purp:"#a855f7",pink:"#f472b6",t1:"#eef2f8",t2:"#8899b3",t3:"#4a5873",brd:"#1a2540"};
const tc=t=>({"S+":"#ff4d6a",S:"#ffd036",A:"#5ddb6f",B:"#5da8e8",C:"#7a8599"}[t]||P.t3);
const rc=r=>({Tank:P.blue,Fighter:P.gold,Assassin:P.red,Mage:P.purp,Marksman:P.nG,Support:P.neon}[r]||P.t3);
const ri=r=>({Tank:"🛡️",Fighter:"⚔️",Assassin:"🗡️",Mage:"🔮",Marksman:"🏹",Support:"💚"}[r]||"❓");
const ROLES=["Tank","Fighter","Assassin","Mage","Marksman","Support"],TIERS=["S+","S","A","B","C"];
const TABS=["Meta","Heroes","Tiers","Items","Counter","Teams","Spells","Jungle","Roam","Macro","Compare","Emblems","Pro Picks","Glossary","Learn","My Stats","Build","Draft"];

// ═══ PRO PICKS (MPL S15 / M6 2026 data) ═══
const PRO_PICKS=[
{role:"Roam",heroes:[{n:"Mathilda",pk:89,bn:42,wr:54,note:"#1 pro roam. Mobility+shield engage."},{n:"Khufra",pk:72,bn:55,wr:52,note:"Anti-dash priority. Bouncing Ball dominates."},{n:"Tigreal",pk:68,bn:30,wr:53,note:"Flicker+Ult gold standard engage."},{n:"Atlas",pk:55,bn:25,wr:51,note:"AoE grab for wombo combo comps."},{n:"Chip",pk:48,bn:18,wr:50,note:"Global teleport for fast rotations."}]},
{role:"Jungle",heroes:[{n:"Fredrinn",pk:82,bn:65,wr:55,note:"Utility tank JG defines the meta."},{n:"Hayabusa",pk:70,bn:38,wr:53,note:"Safest pro JG pick. Shadow escape."},{n:"Joy",pk:15,bn:92,wr:58,note:"Highest ban rate. Near-permaban."},{n:"Ling",pk:22,bn:78,wr:51,note:"Wall mobility too strong."},{n:"Lancelot",pk:45,bn:32,wr:50,note:"Immune frames clutch in pro play."}]},
{role:"Mid",heroes:[{n:"Zhuxin",pk:85,bn:28,wr:54,note:"Displacement execute. First-rotation pick."},{n:"Pharsa",pk:62,bn:22,wr:52,note:"Artillery zoning. Nerfed but still picked."},{n:"Valentina",pk:55,bn:18,wr:53,note:"Copy enemy ult = infinite versatility."},{n:"Lylia",pk:40,bn:10,wr:51,note:"Zone + death save ult."},{n:"Yve",pk:35,bn:8,wr:50,note:"Real-time targeting ult."}]},
{role:"EXP",heroes:[{n:"Sora",pk:78,bn:68,wr:55,note:"#1 EXP laner. Stance switching god."},{n:"Julian",pk:65,bn:45,wr:53,note:"Unpredictable 6-combo system."},{n:"Arlott",pk:55,bn:22,wr:52,note:"Wall-pin burst. Lane dominance."},{n:"Chou",pk:50,bn:15,wr:50,note:"Kick isolation for pick comps."},{n:"Phoveus",pk:42,bn:35,wr:54,note:"Counter-pick vs dash comps."}]},
{role:"Gold",heroes:[{n:"Kimmy",pk:72,bn:18,wr:53,note:"Magic spray MM. Move+shoot."},{n:"Wanwan",pk:58,bn:28,wr:51,note:"Weakness points→untargetable."},{n:"Brody",pk:55,bn:12,wr:52,note:"Early-game MM. Raw damage build."},{n:"Beatrix",pk:48,bn:15,wr:50,note:"4-weapon versatility."},{n:"Karrie",pk:35,bn:10,wr:52,note:"True damage vs tank meta."}]},
];
const PRO_TIPS_DATA=["Pro teams average 2.5 Turtles per win — objective control is king","First-pick Mathilda or Sora = highest contested picks in MPL S15","Fredrinn's tank JG frees EXP lane for Julian/Sora damage builds","Pros track enemy gold to predict jungler location (+23g = small camp, ~120g = buff)","5-man Lord attempts only after winning a teamfight — never force","Marcel's Golden Hour (3s stasis) is being explored as an objective contest tool"];

// ═══ GLOSSARY ═══
const GLOSSARY=[
{term:"CC",def:"Crowd Control — any effect that restricts movement or actions (stun, knock-up, slow, silence, suppress, freeze, root, taunt)",cat:"Combat"},
{term:"Peel",def:"Protecting your carry by using CC/abilities to keep enemies away from them during fights",cat:"Teamplay"},
{term:"Kiting",def:"Attacking while moving backward to maintain distance from melee enemies pursuing you",cat:"Combat"},
{term:"Gank",def:"Surprise attack on an enemy laner by rotating from another position (usually by JG or roam)",cat:"Strategy"},
{term:"Rotate/Rotation",def:"Moving from one area of the map to another to help teammates, contest objectives, or gank",cat:"Strategy"},
{term:"Split Push",def:"Pushing a lane alone while your team pressures elsewhere, forcing enemies to split their defense",cat:"Strategy"},
{term:"Dive",def:"Aggressively engaging past enemy frontline to reach their backline carries, even under turret",cat:"Combat"},
{term:"Poke",def:"Dealing damage from a safe distance without committing to a full fight",cat:"Combat"},
{term:"Burst",def:"Dealing massive damage in a very short time window (usually a full skill combo)",cat:"Combat"},
{term:"Sustain",def:"Ability to heal/regenerate HP during fights through lifesteal, spell vamp, or abilities",cat:"Combat"},
{term:"Anti-Heal",def:"Items that reduce enemy healing (Dominance Ice, Sea Halberd, Necklace of Durance)",cat:"Items"},
{term:"Penetration (PEN)",def:"Stats that ignore enemy defense. Physical PEN vs armor, Magic PEN vs magic resist",cat:"Items"},
{term:"CDR",def:"Cooldown Reduction — reduces time between skill uses. Capped at 40% (45% with Enchanted Talisman)",cat:"Items"},
{term:"Spell Vamp",def:"Heal a percentage of damage dealt by skills (NOT basic attacks — that's lifesteal)",cat:"Items"},
{term:"True Damage",def:"Damage that ignores ALL defense. Cannot be reduced by armor or magic resist",cat:"Combat"},
{term:"Retribution",def:"Battle spell for junglers. Deals damage to camps and is used to secure Turtle/Lord (last-hit)",cat:"Spells"},
{term:"Flicker",def:"Battle spell that teleports you a short distance. Used for engage (Flicker+Ult) or escape",cat:"Spells"},
{term:"Face-Check",def:"Walking into an unwarded bush to see if enemies are hiding there. Dangerous if done carelessly",cat:"Strategy"},
{term:"Freeze (Wave)",def:"Keeping the minion wave near your turret by only last-hitting. Safe farming technique",cat:"Strategy"},
{term:"Slow Push",def:"Building up a large minion wave by only killing caster minions, then crashing it into enemy turret",cat:"Strategy"},
{term:"Cut Wave/Lane",def:"Intercepting enemy minions between turrets before they reach your minions. Denies enemy farm",cat:"Strategy"},
{term:"Turret Hug",def:"Staying very close to your turret for protection when behind or under threat",cat:"Strategy"},
{term:"Objective",def:"Turrets, Turtle, Lord — things that give permanent advantages. Always more important than kills",cat:"Strategy"},
{term:"Trade",def:"Exchanging damage or objectives with the enemy. Good trades give you more value than you lose",cat:"Strategy"},
{term:"Flex Pick",def:"A hero that can play multiple roles/lanes, making it hard for enemies to counter-pick in draft",cat:"Draft"},
{term:"First Rotation",def:"Heroes picked in the first phase of draft. Usually the most contested/versatile picks",cat:"Draft"},
{term:"Counter-Pick",def:"Choosing a hero specifically because their kit counters an enemy hero already picked",cat:"Draft"},
{term:"Hyper Carry",def:"A late-game damage dealer (usually MM) that the entire team protects and enables to carry",cat:"Teamplay"},
{term:"Initiator",def:"Hero who starts fights (usually tank). Responsible for finding good engage angles",cat:"Teamplay"},
{term:"Backline",def:"Squishy damage dealers (MM, Mage) who stay behind the frontline during fights",cat:"Teamplay"},
{term:"Frontline",def:"Tanky heroes (Tank, Fighter) who absorb damage and CC at the front of teamfights",cat:"Teamplay"},
{term:"Snowball",def:"Building an early lead and using it to grow the advantage faster (kills→towers→objectives→more kills)",cat:"Strategy"},
{term:"Comeback",def:"Winning a game from behind, usually by defending well and winning a crucial Lord/teamfight",cat:"Strategy"},
{term:"MVP",def:"Most Valuable Player — awarded post-game based on performance metrics (KDA, damage, objectives)",cat:"General"},
{term:"KDA",def:"Kills / Deaths / Assists — the primary performance metric shown on scoreboard",cat:"General"},
{term:"Meta",def:"Most Effective Tactics Available — the currently strongest heroes, strategies, and team compositions",cat:"General"},
];

// ═══ LEARNING PATH ═══
const LEARN_PATH=[
{level:"1. Absolute Beginner",icon:"🌱",color:P.nG,rank:"Warrior → Elite",hours:"0-20 hours",goals:["Complete all tutorials and training modes","Learn the map layout — 3 lanes, jungle, river, turrets","Pick 1 easy hero and play 20+ games with them","Understand basic roles: Tank, Fighter, Assassin, Mage, Marksman, Support","Learn to last-hit minions for gold","Don't chase kills into fog — turrets matter more than kills"],heroes:"Layla, Miya, Tigreal, Eudora, Balmond, Zilong",focus:"Survival. Don't die. That's the #1 skill to learn."},
{level:"2. Getting Comfortable",icon:"🌿",color:P.blue,rank:"Master → Grandmaster",hours:"20-80 hours",goals:["Master 2-3 heroes per role you enjoy","Learn the item shop — start with recommended builds, then understand why","Learn when to push tower after kills","Start checking minimap every 5-10 seconds","Learn what each role does and how lanes work","Understand Turtle (2:00) and Lord (9:00) timing"],heroes:"Saber, Freya, Pharsa, Bruno, Angela, Franco",focus:"Map awareness. Glance at minimap constantly."},
{level:"3. Ranked Ready",icon:"🌳",color:P.gold,rank:"Epic → Legend",hours:"80-200 hours",goals:["Draft Pick mode — learn to counter-pick and communicate roles","Master counter-building (anti-heal, armor, magic resist per match)","Learn wave management (freeze, slow push, cut lane)","Understand emblem talents and optimize per hero/matchup","Learn 2+ roles so you can fill when needed","Start tracking objectives: contest every Turtle, coordinate Lord"],heroes:"Chou, Hayabusa, Khufra, Valentina, Wanwan, Mathilda",focus:"Adaptation. Change builds, spells, and playstyle per match."},
{level:"4. Climbing Seriously",icon:"🏔️",color:P.purp,rank:"Legend → Mythic",hours:"200-500 hours",goals:["Master macro: wave timing, rotation patterns, objective sequencing","Learn to predict enemy movements via gold tracking on scoreboard","Shot-call objectives for your team via pings","Maintain a 55-60% win rate on your main heroes","Master 2-3 flex picks that work in multiple lanes/roles","Review replays of losses — find your recurring mistakes"],heroes:"Sora, Julian, Fredrinn, Zhuxin, Phoveus, Atlas",focus:"Macro > Micro. Game sense wins more than mechanics."},
{level:"5. Mythical Glory",icon:"👑",color:P.red,rank:"Mythic → Mythical Glory",hours:"500+ hours",goals:["Master draft phase — understand 10-ban system, flex picks, counter-rotations","Lead team communication — call ganks, objectives, retreats","Track ALL enemy cooldowns mentally (ults, Purify, Flicker, Retribution)","Perfect your laning phase — first 3 minutes should feel automatic","Build hero pool of 7-10 heroes across 3+ roles","Study MPL pro matches for rotation patterns and draft strategies"],heroes:"All S/S+ tier heroes. Flex between roles.",focus:"Leadership. Your calls win or lose games at this level."},
];

// ═══ EMBLEM DATA ═══
const EMBLEM_SETS=[
{name:"Tank",icon:"🛡️",color:P.blue,stats:"HP +700, Hybrid DEF +14, HP Regen +10",best:"Tanks, tanky supports, frontliners",
t1:[{n:"Vitality",e:"+225 Max HP",use:"Default for most tanks"},{n:"Firmness",e:"+6 Hybrid DEF",use:"vs aggressive early laners"},{n:"Agility",e:"+4% Move Speed",use:"Roaming tanks needing rotation speed"}],
t2:[{n:"Tenacity",e:"+15 Hybrid DEF when <50% HP",use:"Default survivability choice"},{n:"Wilderness Blessing",e:"+10% MS in jungle/river",use:"Rotation-focused roamers"},{n:"Pull Yourself Together",e:"-15% Battle Spell CD",use:"More Flicker uptime = more engages"}],
t3:[{n:"Concussive Blast",e:"After skill, deal HP-based magic DMG in area",use:"DEFAULT for tanks. Scales with HP items."},{n:"Brave Smite",e:"Heal when landing CC on enemies",use:"Sustain tanks like Belerick, Hylos"},{n:"Focusing Mark",e:"Mark enemies → allies deal +6% DMG to them",use:"Coordinated play, peeling supports"}]},
{name:"Fighter",icon:"⚔️",color:P.gold,stats:"ATK +14, Hybrid DEF +8, HP +250",best:"Fighters, bruisers, EXP laners",
t1:[{n:"Bravery",e:"+12 Adaptive ATK",use:"Default damage choice"},{n:"Firmness",e:"+6 Hybrid DEF",use:"Defensive laning"},{n:"Vitality",e:"+225 Max HP",use:"Sustain matchups"}],
t2:[{n:"Festival of Blood",e:"+6% Spell Vamp",use:"Sustain fighters (Ruby, Thamuz, Yu Zhong)"},{n:"Weapons Master",e:"+5% stats from equipment",use:"Late-game scaling"},{n:"Tenacity",e:"+15 Hybrid DEF when <50% HP",use:"Tanky fighters"}],
t3:[{n:"Killing Spree",e:"+15% HP restored + 20% MS after kill",use:"Snowball fighters (Chou, Arlott)"},{n:"War Cry",e:"After 5s charging, next skill +12% DMG",use:"Burst combo fighters (Julian, Paquito)"},{n:"Brave Smite",e:"Heal on CC landing",use:"CC-heavy fighters (Ruby, Guinevere)"}]},
{name:"Assassin",icon:"🗡️",color:P.red,stats:"Adaptive PEN +10, Adaptive ATK +7, CDR +3%",best:"Assassins, burst junglers, aggressive fighters",
t1:[{n:"Rupture",e:"+5 Adaptive PEN",use:"DEFAULT for all assassins"},{n:"Thrill",e:"+16 Adaptive ATK",use:"Raw damage early"},{n:"Agility",e:"+4% Move Speed",use:"Rotation speed"}],
t2:[{n:"Seasoned Hunter",e:"+15% DMG to Lord/Turtle",use:"MANDATORY for junglers. No exceptions."},{n:"Master Assassin",e:"+7% DMG when only 1 enemy nearby",use:"1v1 duelists, pick heroes"},{n:"Weapons Master",e:"+5% stats from equipment",use:"Late-game scaling carries"}],
t3:[{n:"Killing Spree",e:"+15% HP restored + 20% MS after kill",use:"DEFAULT for snowball assassins"},{n:"Lethal Ignition",e:"3 hits in 5s → 162-750 adaptive DMG burn",use:"Burst combo heroes (Gusion, Lancelot)"},{n:"Quantum Charge",e:"AA triggers MS + HP sustain",use:"AA-based assassins"}]},
{name:"Mage",icon:"🔮",color:P.purp,stats:"Magic Power +14, CDR +3%, Magic PEN +5",best:"Mages, magic fighters, some supports",
t1:[{n:"Agility",e:"+4% Move Speed",use:"DEFAULT for rotation speed"},{n:"Rupture",e:"+5 Adaptive PEN",use:"When extra pen needed"},{n:"Inspire",e:"+5% CDR",use:"CDR-hungry mages"}],
t2:[{n:"Weapons Master",e:"+5% stats from equipment",use:"DEFAULT for scaling mages"},{n:"Bargain Hunter",e:"Equipment costs -5%",use:"Rush core items faster"},{n:"Wilderness Blessing",e:"+10% MS in jungle/river",use:"Roaming mages"}],
t3:[{n:"Impure Rage",e:"Skills deal %HP magic DMG + mana regen",use:"DEFAULT for most mages"},{n:"Lethal Ignition",e:"3 hits in 5s → adaptive DMG burn",use:"Burst mages (Eudora, Kagura)"},{n:"Quantum Charge",e:"AA triggers MS + HP sustain",use:"Harith, Kimmy"}]},
{name:"Marksman",icon:"🏹",color:P.nG,stats:"ATK +9, ATK Speed +7%, Crit Chance +3%",best:"Marksmen, AA-based carries",
t1:[{n:"Fatal",e:"+5% Crit Chance, +10% Crit DMG",use:"DEFAULT for crit MMs"},{n:"Swift",e:"+10% ATK Speed",use:"On-hit MMs (Karrie, Claude)"},{n:"Thrill",e:"+16 Adaptive ATK",use:"Early game trades"}],
t2:[{n:"Weapons Master",e:"+5% stats from equipment",use:"DEFAULT — amplifies expensive builds"},{n:"Weakness Finder",e:"Crits slow enemy AS + MS",use:"Kiting MMs (Miya, Bruno, Moskov)"},{n:"Bargain Hunter",e:"Equipment costs -5%",use:"Rush core items when behind"}],
t3:[{n:"Quantum Charge",e:"AA triggers MS boost + HP sustain",use:"DEFAULT — kiting + sustain tool"},{n:"Weakness Finder",e:"Slow on crit",use:"Kite-focused MMs"},{n:"Killing Spree",e:"+15% HP + 20% MS on kill",use:"Snowball MMs like Brody"}]},
{name:"Support",icon:"💚",color:P.neon,stats:"Heal Effect +10%, CDR +5%, Move Speed +4%",best:"Supports, roaming tanks, utility heroes",
t1:[{n:"Agility",e:"+4% Move Speed",use:"DEFAULT for roam speed"},{n:"Mastery",e:"+5% CDR",use:"Spam heals/shields"},{n:"Firmness",e:"+6 Hybrid DEF",use:"Defensive supports"}],
t2:[{n:"Pull Yourself Together",e:"-15% Battle Spell CD",use:"DEFAULT — more Flicker/Heal uptime"},{n:"Wilderness Blessing",e:"+10% MS in jungle/river",use:"Rotation speed"},{n:"Tenacity",e:"+15 Hybrid DEF <50% HP",use:"Survivability"}],
t3:[{n:"Focusing Mark",e:"Mark enemies → allies +6% DMG to them",use:"DEFAULT — enables your carries"},{n:"Concussive Blast",e:"HP-based area DMG after skill",use:"Tanky supports like Marcel"},{n:"Brave Smite",e:"Heal on CC landing",use:"CC-heavy supports"}]},
];

// ═══ ROAM GUIDE ═══
const ROAM_BOOTS=[{n:"Encourage",e:"+ATK/MATK +AS to allies",use:"DEFAULT. Initiation tanks.",i:"💪"},{n:"Favor",e:"Heal lowest HP ally",use:"Healer supports (Estes, Floryn).",i:"💚"},{n:"Dire Hit",e:"+DMG to <35% HP enemies",use:"Aggressive roamers.",i:"💀"},{n:"Conceal",e:"Nearby allies invisible briefly",use:"Ambush/surprise engage.",i:"👁️"}];
const ROAM_ROTATION=[
{t:"0:00-1:00",nm:"Opening",st:["Buy Roam Boots","Leash jungler first buff","Rotate mid","Help mid clear wave 1"],tp:"Don't steal last hits. Gold comes from assists + roam passive."},
{t:"1:00-2:00",nm:"Lane Support",st:["Protect gold lane MM","Secure river vision","Face-check bushes","Prep Turtle at 1:45"],tp:"Position near enemy mid turret to deny enemy roamer gold."},
{t:"2:00-4:00",nm:"Objectives",st:["Contest Turtle with JG","Gank overextenders","Secure Lithowanderer","Ward jungle entrances"],tp:"Turtle is NON-NEGOTIABLE. If team fights for Turtle, you MUST be there."},
{t:"4:00-8:00",nm:"Mid Game",st:["Shadow strongest carry","Enable ganks","Contest every Turtle","Vision before fights"],tp:"After 5 min, help carries push waves — minions outvalue jungle camps."},
{t:"8:00+",nm:"Late Game",st:["Vision around Lord","Peel for carries","Initiate/counter-initiate","Shot-call after won fights"],tp:"One bad Lord fight = game over. Only Lord after winning teamfight."},
];
const ROAM_TIPS=["Check bushes BEFORE team walks through — you're the tank","Ward river between mid/sides — highest value vision","Ward Turtle/Lord 15-20s before spawn","Check minimap every 3-5 seconds","Track enemy jungler via buff timers","Ping 'Enemy Missing' immediately","Never face-check deep fog when enemies missing","Vision at jungle entrances enables safe invades"];

// ═══ MACRO GUIDE ═══
const PHASES=[
{ph:"Early (0-5 min)",i:"🌅",g:"Farm, first Turtle, lane priority",r:["Laners: Last-hit minions. 15 min farming > chasing kills","Jungler: Level 4 by 1:45. Gank nearest lane. Turtle at 2:00","Roamer: Vision, escort JG, protect gold lane MM","Push tower after kills — turrets = permanent gold advantage","DON'T chase into fog. DON'T overstay after kills"]},
{ph:"Mid (5-12 min)",i:"☀️",g:"Group objectives, outer turrets, snowball",r:["Contest EVERY Turtle — gold/XP compounds over time","After 5 min, lane minions > jungle camps. Share waves","Group 3-4 for turret pushes. Leave 1 in opposite lane","Rotate to lane where you got a kill — push that tower","Counter-build: check enemy items, buy anti-heal/armor/MR"]},
{ph:"Late (12+ min)",i:"🌙",g:"Lord control, teamfights, end game",r:["Lord at 9:00. Only after winning fight or enemy dead","One death = 40-60s timer. One bad fight loses the game","Stick with team. Solo farming late = getting picked off","Push with Lord immediately — don't recall","If behind: defend turrets. Trade objectives. Don't force lost fights"]},
];
const MACRO_CATS=[
{c:"Laning",t:["Last-hit for max gold — don't auto-push mindlessly","Freeze wave near YOUR turret when behind","Slow push (big wave) then rotate for numbers advantage","Watch minimap — missing enemy = ganking someone"]},
{c:"Objectives",t:["Turrets > Kills > Camps. Push after kills ALWAYS","Turtle every 2 min. Lord at 9:00","Never solo Lord. Always 2+ teammates","Enemy used Retribution on camp? 35s free contest window"]},
{c:"Teamfights",t:["Tanks engage first. Carries stay BEHIND frontline","Focus enemy carry (MM/Mage), NOT the tank","Peel for YOUR carry if enemy dives them","Wait for key CDs before engaging (Diggie ult, Purify, WoN)"]},
{c:"Climbing",t:["Master 2-3 heroes per role. Don't play everything","Counter-build every match. Check enemy items","Mute toxic players. Tilt = bad decisions = lost stars","Review losses: died to ganks? Wrong items? Missed objectives?"]},
];
const ANTI_HEAL={
when:"Buy when enemy has sustain hero (Estes, Uranus, Ruby, Yu Zhong, Alucard, Alice, Thamuz, Esmeralda)",
items:[{n:"Dominance Ice",r:"Tanks",e:"Aura: -50% Heal, -30% AS"},{n:"Sea Halberd",r:"Phys Carries",e:"AA reduces healing 50%"},{n:"Necklace of Durance",r:"Mages",e:"Skills reduce healing 50%"}],
tip:"Buy as 2nd-3rd item. Team should have 1-2 anti-heal items vs sustain comps."
};

// ═══ APP ═══
export default function App(){
const[tab,setTab]=useState("Meta");const[q,setQ]=useState("");const[rF,setRF]=useState("All");const[tF,setTF]=useState("All");
const[sel,setSel]=useState(null);const[cQ,setCQ]=useState("");const[iC,setIC]=useState("Attack");
const[bS,setBS]=useState(Array(6).fill(null));const[bC,setBC]=useState("Attack");
const[d1,sd1]=useState({b:[],p:[]});const[d2,sd2]=useState({b:[],p:[]});const[dP,sdP]=useState("ban1");const[dT,sdT]=useState(1);const[dQ,sdQ]=useState("");
const[cmpA,setCmpA]=useState("");const[cmpB,setCmpB]=useState("");
const[glsCat,setGlsCat]=useState("All");
const[tracker,setTracker]=useState([]);const[tkHero,setTkHero]=useState("");const[tkResult,setTkResult]=useState("Win");
const[savedBuilds,setSavedBuilds]=useState([]);const[buildName,setBuildName]=useState("");

// Persistent storage
useEffect(()=>{(async()=>{try{
  const r=await window.storage?.get("mlbb-tracker");if(r)setTracker(JSON.parse(r.value));
  const b=await window.storage?.get("mlbb-builds");if(b)setSavedBuilds(JSON.parse(b.value));
}catch(e){}})();},[]);
const saveTracker=async(data)=>{setTracker(data);try{await window.storage?.set("mlbb-tracker",JSON.stringify(data));}catch(e){}};
const saveBuilds=async(data)=>{setSavedBuilds(data);try{await window.storage?.set("mlbb-builds",JSON.stringify(data));}catch(e){}};

const flt=useMemo(()=>{let h=H;if(rF!=="All")h=h.filter(x=>x.r===rF||x.r2===rF);if(tF!=="All")h=h.filter(x=>x.t===tF);if(q)h=h.filter(x=>x.n.toLowerCase().includes(q.toLowerCase()));return h;},[rF,tF,q]);
const cH=useMemo(()=>cQ?H.find(h=>h.n.toLowerCase()===cQ.toLowerCase()):null,[cQ]);
const cSg=useMemo(()=>cQ.length<1?[]:H.filter(h=>h.n.toLowerCase().includes(cQ.toLowerCase())).slice(0,8),[cQ]);
const bG=useMemo(()=>bS.filter(Boolean).reduce((a,i)=>a+i.g,0),[bS]);
const heroA=useMemo(()=>cmpA?H.find(h=>h.n.toLowerCase()===cmpA.toLowerCase()):null,[cmpA]);
const heroB=useMemo(()=>cmpB?H.find(h=>h.n.toLowerCase()===cmpB.toLowerCase()):null,[cmpB]);

const allD=[...d1.b,...d2.b,...d1.p,...d2.p];
const dAv=useMemo(()=>{let h=H.filter(x=>!allD.includes(x.n));if(dQ)h=h.filter(x=>x.n.toLowerCase().includes(dQ.toLowerCase()));return h;},[allD,dQ]);
const dSl=n=>{const t1={...d1,b:[...d1.b],p:[...d1.p]},t2={...d2,b:[...d2.b],p:[...d2.p]};if(dP.startsWith("ban")){if(dT===1)t1.b.push(n);else t2.b.push(n);const tb=t1.b.length+t2.b.length;if(dP==="ban1"&&tb>=6){sdP("pick1");sdT(1);}else if(dP==="ban2"&&tb>=10){sdP("pick2");sdT(1);}else sdT(dT===1?2:1);}else{if(dT===1)t1.p.push(n);else t2.p.push(n);const tp=t1.p.length+t2.p.length;if(dP==="pick1"&&tp>=6){sdP("ban2");sdT(1);}else if(tp>=10)sdP("done");else sdT(dT===1?2:1);}sd1(t1);sd2(t2);sdQ("");};
const dR=()=>{sd1({b:[],p:[]});sd2({b:[],p:[]});sdP("ban1");sdT(1);sdQ("");};

const s={
root:{fontFamily:"'Rajdhani',system-ui,sans-serif",background:P.bg,color:P.t1,minHeight:"100vh"},
hdr:{background:`linear-gradient(135deg,${P.bg2},#0d1628,#121830)`,padding:"14px 12px 10px",borderBottom:`1px solid ${P.brd}`,textAlign:"center",position:"relative",overflow:"hidden"},
glow:{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",width:200,height:80,background:`radial-gradient(ellipse,${P.gold}22,transparent 70%)`,pointerEvents:"none"},
title:{fontSize:18,fontWeight:900,background:`linear-gradient(90deg,${P.gold},${P.pink},${P.neon})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0},
sub:{fontSize:9,color:P.t3,marginTop:2,letterSpacing:2,textTransform:"uppercase",fontWeight:600},
tbs:{display:"flex",overflowX:"auto",gap:0,background:P.bg2,borderBottom:`1px solid ${P.brd}`,WebkitOverflowScrolling:"touch"},
tb:a=>({padding:"8px 10px",fontSize:10,fontWeight:a?800:500,color:a?P.gold:P.t3,background:a?`${P.gold}08`:"transparent",border:"none",borderBottom:a?`2px solid ${P.gold}`:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}),
ct:{padding:"10px 10px 20px"},
ip:{width:"100%",padding:"10px 14px",background:P.cd,border:`1px solid ${P.brd}`,borderRadius:10,color:P.t1,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:8,fontFamily:"inherit"},
fR:{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8},
fb:(a,c)=>({padding:"4px 10px",fontSize:10,fontWeight:a?700:500,background:a?(c||P.gold)+"18":"transparent",color:a?(c||P.gold):P.t3,border:`1px solid ${a?(c||P.gold)+"55":P.brd}`,borderRadius:20,cursor:"pointer",fontFamily:"inherit"}),
cd2:{background:P.cd,border:`1px solid ${P.brd}`,borderRadius:10,padding:"10px 12px",marginBottom:6,cursor:"pointer"},
bg:(c,fl)=>({display:"inline-block",padding:"2px 8px",borderRadius:12,fontSize:9,fontWeight:700,background:fl?c:(c||P.gold)+"18",color:fl?"#000":c||P.gold,marginRight:3}),
sc:{fontSize:14,fontWeight:800,color:P.t1,margin:"14px 0 8px",paddingBottom:5,borderBottom:`1px solid ${P.brd}`},
tp:{background:`${P.blue}0c`,border:`1px solid ${P.blue}28`,borderRadius:8,padding:"10px 12px",fontSize:11,color:`${P.blue}dd`,lineHeight:1.6,marginTop:8},
bk:{background:"transparent",border:`1px solid ${P.brd}`,borderRadius:8,padding:"6px 14px",color:P.t2,fontSize:11,cursor:"pointer",marginBottom:10,fontFamily:"inherit"},
ch:c=>({display:"inline-flex",alignItems:"center",gap:3,padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:600,background:c+"15",color:c,border:`1px solid ${c}33`,marginRight:3,marginBottom:3,cursor:"pointer"}),
wr:v=>({fontSize:12,fontWeight:800,color:v>=52?P.nG:v>=51?P.gold:v>=50?P.t2:P.red}),
br2:(pct,c)=>({height:4,borderRadius:2,background:`${c}22`,overflow:"hidden",position:"relative",marginTop:3}),
bf2:(pct,c)=>({position:"absolute",left:0,top:0,bottom:0,width:`${Math.min(pct,100)}%`,background:c,borderRadius:2}),
};

// ── HERO DETAIL ──
if(sel){const h=sel;return(<div style={s.root}><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet"/><div style={s.hdr}><div style={s.glow}/><div style={s.title}>MLBB GUIDE</div></div><div style={s.ct}>
<button style={s.bk} onClick={()=>setSel(null)}>← Back</button>
<div style={{background:P.cd,border:`1px solid ${P.brd}`,borderRadius:12,padding:16,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.04}}>{ri(h.r)}</div>
<div style={{fontSize:20,fontWeight:900}}>{ri(h.r)} {h.n}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}><span style={s.bg(rc(h.r))}>{h.r}</span>{h.r2&&<span style={s.bg(rc(h.r2))}>{h.r2}</span>}<span style={s.bg(tc(h.t),true)}>{h.t}</span><span style={s.bg(P.neon)}>{h.l}</span><span style={s.bg(P.t2)}>{"⭐".repeat(h.d)}</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
{[["Win",h.wr+"%",h.wr>=52?P.nG:h.wr>=51?P.gold:P.t2],["Pick",h.pr+"%",P.blue],["Ban",h.br+"%",h.br>=30?P.red:P.t2]].map(([l,v,c])=>(<div key={l} style={{background:P.bg,borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:8,color:P.t3,letterSpacing:1,textTransform:"uppercase"}}>{l} Rate</div></div>))}</div>
<div style={{fontSize:12,color:P.t2,marginTop:12,lineHeight:1.7}}>
<div style={{marginBottom:4}}><strong style={{color:P.gold}}>Specialty:</strong> {h.sp}</div>
<div style={{marginBottom:4}}><strong style={{color:P.gold}}>Emblem:</strong> {h.e} · <strong style={{color:P.gold}}>Spells:</strong> {h.sp2?.join(" / ")}</div></div>
<div style={s.sc}>Build</div>
<div style={{display:"flex",flexWrap:"wrap"}}>{h.b.map((x,i)=><span key={i} style={{display:"inline-block",padding:"3px 8px",background:`${P.gold}12`,border:`1px solid ${P.gold}30`,borderRadius:6,fontSize:10,fontWeight:600,color:P.goldD,marginRight:3,marginBottom:3}}>{i+1}. {x}</span>)}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
<div><div style={{fontSize:10,fontWeight:700,color:P.red,letterSpacing:1,marginBottom:4}}>🚫 WEAK VS</div>{h.c.map((x,i)=><div key={i} style={{fontSize:11,color:P.red,padding:"2px 0"}}>• {x}</div>)}</div>
<div><div style={{fontSize:10,fontWeight:700,color:P.nG,letterSpacing:1,marginBottom:4}}>✅ STRONG VS</div>{h.s.map((x,i)=><div key={i} style={{fontSize:11,color:P.nG,padding:"2px 0"}}>• {x}</div>)}</div></div>
{h.sy&&<><div style={{fontSize:10,fontWeight:700,color:P.neon,letterSpacing:1,marginTop:12,marginBottom:4}}>🤝 SYNERGIES</div><div style={{display:"flex",flexWrap:"wrap"}}>{h.sy.map(x=><span key={x} style={s.ch(P.neon)} onClick={()=>{const f=H.find(z=>z.n===x);if(f)setSel(f);}}>{x}</span>)}</div></>}
<div style={s.tp}>💡 {h.tip}</div></div></div></div>);}

// ── MAIN ──
const SugBox=({val,onPick,placeholder})=>{const sg=val.length<1?[]:H.filter(h=>h.n.toLowerCase().includes(val.toLowerCase())).slice(0,6);const found=H.find(h=>h.n.toLowerCase()===val.toLowerCase());return(<div style={{position:"relative",flex:1}}><input style={{...s.ip,marginBottom:0}} placeholder={placeholder} value={val} onChange={e=>onPick(e.target.value)}/>{val&&!found&&sg.length>0&&<div style={{position:"absolute",top:40,left:0,right:0,background:P.cd,border:`1px solid ${P.brd}`,borderRadius:8,zIndex:10,maxHeight:180,overflow:"auto"}}>{sg.map(h=><div key={h.n} style={{padding:"5px 10px",fontSize:12,cursor:"pointer",borderBottom:`1px solid ${P.brd}`}} onClick={()=>onPick(h.n)}>{ri(h.r)} {h.n}</div>)}</div>}</div>);};

return(<div style={s.root}><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<div style={s.hdr}><div style={s.glow}/><div style={s.title}>MOBILE LEGENDS: BANG BANG</div><div style={s.sub}>{H.length} Heroes · Patch {PATCH.v} · Season {PATCH.s}</div></div>
<div style={s.tbs}>{TABS.map(t=><button key={t} style={s.tb(tab===t)} onClick={()=>setTab(t)}>{t}</button>)}</div>
<div style={s.ct}>

{tab==="Meta"&&<><div style={{background:`linear-gradient(135deg,${P.gold}0c,${P.pink}08)`,border:`1px solid ${P.gold}33`,borderRadius:12,padding:14,marginBottom:12}}><div style={{fontSize:17,fontWeight:900,color:P.gold}}>Season {PATCH.s} Meta</div><div style={{fontSize:10,color:P.t2,marginTop:2}}>Patch {PATCH.v} · {PATCH.d}</div><div style={{fontSize:11,color:P.t2,marginTop:8,lineHeight:1.6}}>Utility junglers + mobility assassins + dominant mages. 13 mages buffed, 6 nerfed. Fighters dominate EXP with 8 S-tier heroes.</div></div>
<div style={s.sc}>🚫 Top Bans</div>{BANS.map(h=>(<div key={h.n} style={{...s.cd2,display:"flex",alignItems:"center",gap:10}} onClick={()=>{const f=H.find(x=>x.n===h.n);if(f)setSel(f);}}><div style={{fontSize:18,fontWeight:900,color:P.red,minWidth:38}}>{h.r}%</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>{h.n} <span style={{color:h.tr==="↑"?P.nG:h.tr==="↓"?P.red:P.t3}}>{h.tr}</span></div><div style={s.br2(h.r,P.red)}><div style={s.bf2(h.r,P.red)}/></div></div></div>))}
<div style={s.sc}>📈 Rising</div>{RISING.map(h=>(<div key={h.n} style={{...s.cd2,borderLeft:`3px solid ${P.nG}`}} onClick={()=>{const f=H.find(x=>x.n===h.n);if(f)setSel(f);}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:700}}>{h.n}</span><span style={{fontSize:10,color:P.nG,fontWeight:700}}>{h.ch}</span></div><div style={{fontSize:10,color:P.t2,marginTop:2}}>{h.w}</div></div>))}
<div style={s.sc}>📉 Falling</div>{FALLING.map(h=>(<div key={h.n} style={{...s.cd2,borderLeft:`3px solid ${P.red}`}} onClick={()=>{const f=H.find(x=>x.n===h.n);if(f)setSel(f);}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:700}}>{h.n}</span><span style={{fontSize:10,color:P.red,fontWeight:700}}>{h.ch}</span></div><div style={{fontSize:10,color:P.t2,marginTop:2}}>{h.w}</div></div>))}
<div style={s.sc}>🗺️ Lane Meta</div>{LANES.map(ln=>(<div key={ln.l} style={{...s.cd2,cursor:"default"}}><div style={{fontSize:13,fontWeight:800,color:P.gold}}>{ln.i} {ln.l}</div><div style={{display:"flex",flexWrap:"wrap",gap:0,marginTop:4}}>{ln.top.map((n,i)=><span key={n} style={s.ch(i===0?P.gold:P.blue)} onClick={()=>{const f=H.find(x=>x.n===n);if(f)setSel(f);}}>{i===0?"👑 ":""}{n}</span>)}</div><div style={{fontSize:10,color:P.t2,marginTop:4,lineHeight:1.5}}>{ln.nt}</div></div>))}</>}

{tab==="Heroes"&&<><input style={s.ip} placeholder="🔍 Search heroes..." value={q} onChange={e=>setQ(e.target.value)}/><div style={s.fR}><button style={s.fb(rF==="All")} onClick={()=>setRF("All")}>All</button>{ROLES.map(r=><button key={r} style={s.fb(rF===r,rc(r))} onClick={()=>setRF(r)}>{ri(r)} {r}</button>)}</div><div style={{...s.fR,marginBottom:6}}><button style={s.fb(tF==="All")} onClick={()=>setTF("All")}>All</button>{TIERS.map(t=><button key={t} style={s.fb(tF===t,tc(t))} onClick={()=>setTF(t)}>{t}</button>)}</div><div style={{fontSize:10,color:P.t3,marginBottom:6}}>{flt.length} heroes</div>{flt.map(h=>(<div key={h.n} style={s.cd2} onClick={()=>setSel(h)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:800}}>{ri(h.r)} {h.n}</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}><span style={s.bg(rc(h.r))}>{h.r}</span>{h.r2&&<span style={s.bg(rc(h.r2))}>{h.r2}</span>}<span style={s.bg(tc(h.t),true)}>{h.t}</span><span style={s.bg(P.t2)}>{h.l}</span></div></div><div style={{textAlign:"right"}}><div style={s.wr(h.wr)}>{h.wr}%</div><div style={{fontSize:8,color:P.t3}}>WR</div></div></div></div>))}</>}

{tab==="Tiers"&&<>{TIERS.map(t=>{const heroes=H.filter(h=>h.t===t);if(!heroes.length)return null;return(<div key={t} style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{minWidth:30,padding:"2px 0",borderRadius:4,background:tc(t),color:"#000",textAlign:"center",fontWeight:900,fontSize:11}}>{t}</span><span style={{fontSize:12,fontWeight:700,color:tc(t)}}>{t==="S+"?"Must Ban/Pick":t==="S"?"Meta":t==="A"?"Strong":t==="B"?"Viable":"Situational"}</span><span style={{fontSize:10,color:P.t3}}>({heroes.length})</span></div><div style={{display:"flex",flexWrap:"wrap"}}>{heroes.map(h=><span key={h.n} style={s.ch(tc(t))} onClick={()=>setSel(h)}>{ri(h.r)} {h.n} <span style={{opacity:.5,fontSize:8}}>{h.wr}%</span></span>)}</div></div>);})}</>}

{tab==="Items"&&<><div style={s.fR}>{Object.keys(ITEMS).map(c=><button key={c} style={s.fb(iC===c,P.neon)} onClick={()=>setIC(c)}>{c}</button>)}</div>{(ITEMS[iC]||[]).map(it=>(<div key={it.n} style={{...s.cd2,cursor:"default"}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:13,fontWeight:700}}>{it.i} {it.n}</div><span style={{fontSize:10,color:P.goldD,fontWeight:700}}>{it.g}g</span></div><div style={{fontSize:11,color:P.t2,marginTop:2}}>{it.st}</div><div style={{fontSize:10,color:P.neon,marginTop:3}}>⚡ {it.pa}</div><div style={{display:"flex",gap:3,marginTop:3}}>{it.tg.map(t=><span key={t} style={{fontSize:8,padding:"1px 6px",borderRadius:6,background:P.brd,color:P.t3}}>{t}</span>)}</div></div>))}</>}

{tab==="Counter"&&<><div style={{position:"relative"}}><input style={s.ip} placeholder="🔍 Search hero..." value={cQ} onChange={e=>setCQ(e.target.value)}/>{cQ&&!cH&&cSg.length>0&&<div style={{position:"absolute",top:40,left:0,right:0,background:P.cd,border:`1px solid ${P.brd}`,borderRadius:8,zIndex:10,maxHeight:200,overflow:"auto"}}>{cSg.map(h=><div key={h.n} style={{padding:"6px 12px",fontSize:12,cursor:"pointer",borderBottom:`1px solid ${P.brd}`}} onClick={()=>setCQ(h.n)}>{ri(h.r)} {h.n}</div>)}</div>}</div>
{cH?(<div style={{background:P.cd,border:`1px solid ${P.brd}`,borderRadius:12,padding:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:18,fontWeight:900}}>{ri(cH.r)} {cH.n}</div><div style={{display:"flex",gap:8}}><div style={{textAlign:"center"}}><div style={s.wr(cH.wr)}>{cH.wr}%</div><div style={{fontSize:8,color:P.t3}}>WR</div></div><div style={{textAlign:"center"}}><div style={{fontSize:12,fontWeight:800,color:cH.br>=30?P.red:P.t2}}>{cH.br}%</div><div style={{fontSize:8,color:P.t3}}>BAN</div></div></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><div style={{fontSize:10,fontWeight:700,color:P.red,letterSpacing:1,marginBottom:4}}>🚫 COUNTERED BY</div>{cH.c.map((x,i)=><div key={i} style={{fontSize:11,color:P.red,padding:"2px 0",cursor:"pointer"}} onClick={()=>setCQ(x)}>{x}</div>)}</div><div><div style={{fontSize:10,fontWeight:700,color:P.nG,letterSpacing:1,marginBottom:4}}>✅ STRONG VS</div>{cH.s.map((x,i)=><div key={i} style={{fontSize:11,color:P.nG,padding:"2px 0"}}>{x}</div>)}</div></div>{cH.sy&&<><div style={{fontSize:10,fontWeight:700,color:P.neon,letterSpacing:1,marginTop:10,marginBottom:4}}>🤝 SYNERGIES</div><div style={{display:"flex",flexWrap:"wrap"}}>{cH.sy.map(x=><span key={x} style={s.ch(P.neon)} onClick={()=>setCQ(x)}>{x}</span>)}</div></>}<div style={{marginTop:10}}><div style={{fontSize:10,fontWeight:700,color:P.gold,letterSpacing:1,marginBottom:4}}>🛡️ BUILD</div><div style={{display:"flex",flexWrap:"wrap"}}>{cH.b.map((x,i)=><span key={i} style={{display:"inline-block",padding:"3px 8px",background:`${P.gold}12`,border:`1px solid ${P.gold}30`,borderRadius:6,fontSize:10,fontWeight:600,color:P.goldD,marginRight:3,marginBottom:3}}>{x}</span>)}</div></div><div style={s.tp}>💡 {cH.tip}</div></div>):(<div style={{textAlign:"center",padding:"30px",color:P.t3}}><div style={{fontSize:36,marginBottom:8}}>⚔️</div><div style={{fontSize:13}}>Search hero for counters & matchups</div><div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:3,marginTop:12}}>{["Sora","Fredrinn","Julian","Zhuxin","Joy","Helcurt","Saber","Ling"].map(n=><span key={n} style={s.ch(P.gold)} onClick={()=>setCQ(n)}>{n}</span>)}</div></div>)}</>}

{tab==="Teams"&&<>{TEAMS.map((t,i)=>(<div key={i} style={{...s.cd2,cursor:"default"}}><div style={{fontSize:14,fontWeight:800,color:P.gold}}>{t.nm}</div><div style={{fontSize:10,color:P.t2,marginTop:3}}>{t.ds}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,marginTop:8}}>{t.cp.map((slot,j)=>(<div key={j} style={{background:P.bg,borderRadius:6,padding:"5px 8px"}}><div style={{fontSize:9,color:P.t3}}>{slot}</div><div style={{fontSize:11,fontWeight:700,color:P.goldD,cursor:"pointer"}} onClick={()=>{const f=H.find(h=>h.n===t.ex[j]);if(f)setSel(f);}}>{t.ex[j]} →</div></div>))}</div></div>))}</>}

{tab==="Spells"&&<>{SPELLS.map(sp=>(<div key={sp.n} style={{...s.cd2,cursor:"default"}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:14,fontWeight:800}}>{sp.i} {sp.n}</div><span style={{fontSize:10,color:P.t3}}>{sp.cd}s</span></div><div style={{fontSize:11,color:P.t2,marginTop:3}}>{sp.d}</div><div style={{fontSize:10,color:P.gold,marginTop:3,fontStyle:"italic"}}>{sp.b}</div></div>))}</>}

{/* ═══ JUNGLE GUIDE ═══ */}
{tab==="Jungle"&&<>
<div style={{background:`linear-gradient(135deg,${P.nG}0c,${P.gold}08)`,border:`1px solid ${P.nG}33`,borderRadius:12,padding:14,marginBottom:12}}><div style={{fontSize:17,fontWeight:900,color:P.nG}}>🗡️ Jungle Guide</div><div style={{fontSize:11,color:P.t2,marginTop:4,lineHeight:1.6}}>Jungle = farm camps, secure buffs, gank lanes, control Turtle/Lord. Hit Level 4 by 1:45-2:00. Rotate 60% farm / 40% ganks in first 8 minutes.</div></div>

<div style={s.sc}>📍 Jungle Paths</div>
{JG_PATHS.map((p,i)=>(<div key={i} style={{...s.cd2,cursor:"default",borderLeft:`3px solid ${P.nG}`}}>
<div style={{fontSize:13,fontWeight:800,color:P.gold}}>{p.name}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:0,marginTop:6}}>{p.steps.map((st,j)=>(<div key={j} style={{display:"flex",alignItems:"center"}}><span style={{padding:"3px 8px",background:P.bg,borderRadius:6,fontSize:10,fontWeight:600,color:P.neon,border:`1px solid ${P.neon}33`}}>{j+1}. {st}</span>{j<p.steps.length-1&&<span style={{color:P.t3,margin:"0 4px",fontSize:12}}>→</span>}</div>))}</div>
<div style={{fontSize:10,color:P.t2,marginTop:6,lineHeight:1.5}}>{p.note}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{p.heroes.map(h=><span key={h} style={s.ch(P.gold)} onClick={()=>{const f=H.find(x=>x.n===h);if(f)setSel(f);}}>{h}</span>)}</div>
</div>))}

<div style={s.sc}>⏱️ Objective Timers</div>
{JG_TIMERS.map(t=>(<div key={t.obj} style={{...s.cd2,cursor:"default"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:800,color:P.gold}}>{t.obj}</div><span style={{fontSize:11,color:P.neon,fontWeight:700}}>{t.spawn}</span></div>
<div style={{fontSize:10,color:P.t2,marginTop:4}}>Respawn: {t.respawn} · Ends: {t.despawn}</div>
<div style={{fontSize:10,color:P.nG,marginTop:3}}>🎁 {t.reward}</div>
<div style={{fontSize:10,color:P.t3,marginTop:3,fontStyle:"italic"}}>💡 {t.tip}</div>
</div>))}

<div style={s.sc}>🧠 Pro Jungle Tips</div>
{JG_TIPS.map((tip,i)=>(<div key={i} style={{padding:"6px 0",borderBottom:i<JG_TIPS.length-1?`1px solid ${P.brd}`:"none",fontSize:11,color:P.t2,lineHeight:1.5}}><span style={{color:P.gold,fontWeight:700}}>{i+1}.</span> {tip}</div>))}
</>}

{/* ═══ ROAM GUIDE ═══ */}
{tab==="Roam"&&<>
<div style={{background:`linear-gradient(135deg,${P.neon}0c,${P.blue}08)`,border:`1px solid ${P.neon}33`,borderRadius:12,padding:14,marginBottom:12}}>
<div style={{fontSize:17,fontWeight:900,color:P.neon}}>🛡️ Roaming Guide</div>
<div style={{fontSize:11,color:P.t2,marginTop:4,lineHeight:1.6}}>The most impactful early game role. Control pace through ganks, vision, and objectives. Sacrifice personal gold to create map-wide advantages.</div>
</div>

<div style={s.sc}>👢 Roaming Boots</div>
{ROAM_BOOTS.map(b=>(<div key={b.n} style={{...s.cd2,cursor:"default"}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:13,fontWeight:700}}>{b.i} {b.n}</div></div><div style={{fontSize:10,color:P.neon,marginTop:3}}>{b.e}</div><div style={{fontSize:10,color:P.t2,marginTop:2}}>{b.use}</div></div>))}

<div style={s.sc}>🗺️ Rotation Timeline</div>
{ROAM_ROTATION.map((r,i)=>(<div key={i} style={{...s.cd2,cursor:"default",borderLeft:`3px solid ${P.neon}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:800,color:P.gold}}>{r.nm}</div><span style={{fontSize:10,color:P.neon,fontWeight:700}}>{r.t}</span></div>
<div style={{display:"flex",flexWrap:"wrap",gap:0,marginTop:6}}>{r.st.map((st,j)=>(<div key={j} style={{display:"flex",alignItems:"center"}}><span style={{padding:"2px 7px",background:P.bg,borderRadius:5,fontSize:10,fontWeight:600,color:P.neon,border:`1px solid ${P.neon}33`}}>{j+1}. {st}</span>{j<r.st.length-1&&<span style={{color:P.t3,margin:"0 3px",fontSize:10}}>→</span>}</div>))}</div>
<div style={{fontSize:10,color:P.t3,marginTop:4,fontStyle:"italic"}}>💡 {r.tp}</div>
</div>))}

<div style={s.sc}>👁️ Vision Tips</div>
{ROAM_TIPS.map((tip,i)=>(<div key={i} style={{padding:"5px 0",borderBottom:i<ROAM_TIPS.length-1?`1px solid ${P.brd}`:"none",fontSize:11,color:P.t2,lineHeight:1.5}}><span style={{color:P.neon,fontWeight:700}}>{i+1}.</span> {tip}</div>))}

<div style={s.sc}>💊 Anti-Heal Guide</div>
<div style={{...s.cd2,cursor:"default",borderLeft:`3px solid ${P.red}`}}>
<div style={{fontSize:11,color:P.t2,marginBottom:6}}><strong style={{color:P.red}}>When:</strong> {ANTI_HEAL.when}</div>
{ANTI_HEAL.items.map(it=>(<div key={it.n} style={{background:P.bg,borderRadius:6,padding:"6px 8px",marginBottom:3}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:700}}>{it.n}</span><span style={{fontSize:9,color:P.gold}}>{it.r}</span></div><div style={{fontSize:10,color:P.neon}}>{it.e}</div></div>))}
<div style={{fontSize:10,color:P.t3,marginTop:4,fontStyle:"italic"}}>💡 {ANTI_HEAL.tip}</div>
</div>
</>}

{/* ═══ MACRO GUIDE ═══ */}
{tab==="Macro"&&<>
<div style={{background:`linear-gradient(135deg,${P.gold}0c,${P.purp}08)`,border:`1px solid ${P.gold}33`,borderRadius:12,padding:14,marginBottom:12}}>
<div style={{fontSize:17,fontWeight:900,color:P.gold}}>🧠 Macro Strategy</div>
<div style={{fontSize:11,color:P.t2,marginTop:4,lineHeight:1.6}}>Macro wins games more than mechanics. Understanding game phases, objective timing, wave management, and team coordination separates Mythic from Legend.</div>
</div>

<div style={s.sc}>⏱️ Game Phases</div>
{PHASES.map((p,i)=>(<div key={i} style={{...s.cd2,cursor:"default",borderLeft:`3px solid ${P.gold}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:900,color:P.gold}}>{p.i} {p.ph}</div></div>
<div style={{fontSize:10,color:P.neon,marginTop:2,fontWeight:600}}>Goal: {p.g}</div>
<div style={{marginTop:6}}>{p.r.map((r,j)=>(<div key={j} style={{padding:"3px 0",fontSize:11,color:P.t2,lineHeight:1.5}}><span style={{color:P.gold}}>•</span> {r}</div>))}</div>
</div>))}

<div style={s.sc}>📚 Strategy by Category</div>
{MACRO_CATS.map(cat=>(<div key={cat.c} style={{...s.cd2,cursor:"default"}}>
<div style={{fontSize:13,fontWeight:800,color:P.gold,marginBottom:6}}>{cat.c}</div>
{cat.t.map((t,i)=>(<div key={i} style={{padding:"3px 0",fontSize:11,color:P.t2,lineHeight:1.5}}><span style={{color:P.neon}}>•</span> {t}</div>))}
</div>))}

<div style={s.tp}>💡 <strong>The #1 Macro Rule:</strong> Turrets > Kills > Jungle Camps. Every kill should convert into a tower, objective, or map control. A 15-0 KDA means nothing if you haven't taken a single turret. Push after EVERY kill.</div>

<div style={s.sc}>🗺️ Map Variants</div>
<div style={{fontSize:10,color:P.t2,marginBottom:8}}>Map variant is shown during draft. Adapt your picks to the terrain.</div>
{[{n:"Dangerous Grass",i:"🌿",c:P.nG,fav:"Stealth/burst heroes (Natalia, Helcurt, Selena)",avoid:"Low vision teams",tip:"Extra bushes = more ambush spots. Face-check carefully. Vision is critical."},
{n:"Broken Walls",i:"🧱",c:P.gold,fav:"Mobile/dash heroes (Fanny, Ling, Lancelot, Hilda)",avoid:"Immobile heroes",tip:"Gaps in walls = flanking routes. Dash heroes bypass terrain. More gank angles."},
{n:"Expanding Rivers",i:"🌊",c:P.blue,fav:"Roamers/junglers (Mathilda, Chip, Fredrinn)",avoid:"Slow rotators",tip:"Wider rivers = faster rotations. Roamers and junglers arrive everywhere first."},
{n:"Flying Cloud",i:"☁️",c:P.purp,fav:"Defensive/counter-rotate teams",avoid:"Aggressive early comps",tip:"Movement clouds favor defensive play. Better disengages and counter-rotations."},
].map(m=>(<div key={m.n} style={{...s.cd2,cursor:"default",borderLeft:`3px solid ${m.c}`}}>
<div style={{fontSize:13,fontWeight:800,color:m.c}}>{m.i} {m.n}</div>
<div style={{fontSize:10,color:P.nG,marginTop:3}}>✅ Favors: {m.fav}</div>
<div style={{fontSize:10,color:P.red,marginTop:2}}>🚫 Avoid: {m.avoid}</div>
<div style={{fontSize:10,color:P.t3,marginTop:2,fontStyle:"italic"}}>💡 {m.tip}</div>
</div>))}

<div style={s.sc}>🏆 Rank Climbing Cheat Sheet</div>
<div style={{background:P.cd,border:`1px solid ${P.gold}33`,borderRadius:10,padding:12}}>
{[
{rank:"Warrior→Elite",tip:"Learn 1 hero well. Focus on not dying. Last-hit minions.",icon:"🥉"},
{rank:"Master→Grandmaster",tip:"Master 2-3 heroes per role. Learn when to push towers after kills.",icon:"🥈"},
{rank:"Epic→Legend",tip:"Draft phase begins. Learn counter-picking. Communicate roles. Objective focus.",icon:"🥇"},
{rank:"Legend→Mythic",tip:"Macro > Micro. Wave management, vision control, rotation timing. Counter-build.",icon:"💎"},
{rank:"Mythic→Mythical Glory",tip:"Master 2+ roles. Predict enemy movements. Lead team calls. Review replays.",icon:"👑"},
].map(r=>(<div key={r.rank} style={{padding:"8px 0",borderBottom:`1px solid ${P.brd}`,display:"flex",gap:10,alignItems:"flex-start"}}>
<span style={{fontSize:20}}>{r.icon}</span>
<div><div style={{fontSize:12,fontWeight:700,color:P.gold}}>{r.rank}</div><div style={{fontSize:11,color:P.t2,marginTop:2}}>{r.tip}</div></div>
</div>))}
</div>
</>}

{/* ═══ COMPARE ═══ */}
{tab==="Compare"&&<>
<div style={{fontSize:11,color:P.t2,marginBottom:10}}>Compare two heroes side-by-side. Win rates, roles, builds, counters & matchups.</div>
<div style={{display:"flex",gap:6,marginBottom:12}}>
<SugBox val={cmpA} onPick={setCmpA} placeholder="Hero A..."/>
<div style={{display:"flex",alignItems:"center",color:P.gold,fontWeight:900,fontSize:16}}>VS</div>
<SugBox val={cmpB} onPick={setCmpB} placeholder="Hero B..."/>
</div>
{heroA&&heroB?(<div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{[heroA,heroB].map((h,i)=>(<div key={i} style={{background:P.cd,border:`1px solid ${i===0?P.blue:P.red}33`,borderRadius:10,padding:12}}>
<div style={{fontSize:15,fontWeight:900,color:i===0?P.blue:P.red,textAlign:"center"}}>{ri(h.r)} {h.n}</div>
<div style={{textAlign:"center",marginTop:4}}><span style={s.bg(tc(h.t),true)}>{h.t}</span><span style={s.bg(rc(h.r))}>{h.r}</span><span style={s.bg(P.t2)}>{h.l}</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginTop:8}}>
{[["WR",h.wr,h.wr>=52?P.nG:h.wr>=51?P.gold:P.t2],["PR",h.pr,P.blue],["BR",h.br,h.br>=30?P.red:P.t2]].map(([l,v,c])=>(<div key={l} style={{background:P.bg,borderRadius:6,padding:4,textAlign:"center"}}><div style={{fontSize:14,fontWeight:900,color:c}}>{v}%</div><div style={{fontSize:7,color:P.t3}}>{l}</div></div>))}
</div>
<div style={{marginTop:8,fontSize:10,color:P.t2}}>
<div><strong style={{color:P.gold}}>Emblem:</strong> {h.e}</div>
<div><strong style={{color:P.gold}}>Spells:</strong> {h.sp2?.join("/")}</div>
</div>
<div style={{marginTop:6,fontSize:9,color:P.red}}>🚫 {h.c.join(", ")}</div>
<div style={{marginTop:3,fontSize:9,color:P.nG}}>✅ {h.s.join(", ")}</div>
</div>))}
</div>
{/* Head-to-head */}
<div style={{...s.cd2,marginTop:8,cursor:"default",textAlign:"center"}}>
<div style={{fontSize:12,fontWeight:800,color:P.gold,marginBottom:6}}>⚔️ Head-to-Head</div>
{heroA.c.includes(heroB.n)?<div style={{fontSize:12,color:P.red,fontWeight:700}}>🚫 {heroA.n} is COUNTERED by {heroB.n}</div>
:heroA.s.includes(heroB.n)?<div style={{fontSize:12,color:P.nG,fontWeight:700}}>✅ {heroA.n} is STRONG vs {heroB.n}</div>
:heroB.c.includes(heroA.n)?<div style={{fontSize:12,color:P.nG,fontWeight:700}}>✅ {heroA.n} COUNTERS {heroB.n}</div>
:heroB.s.includes(heroA.n)?<div style={{fontSize:12,color:P.red,fontWeight:700}}>🚫 {heroB.n} is STRONG vs {heroA.n}</div>
:<div style={{fontSize:12,color:P.t2}}>➡️ Neutral matchup — skill-dependent</div>}
<div style={{marginTop:8,display:"flex",justifyContent:"center",gap:12}}>
<div><span style={{fontSize:20,fontWeight:900,color:heroA.wr>heroB.wr?P.nG:P.t3}}>{heroA.wr}%</span><div style={{fontSize:9,color:P.t3}}>{heroA.n} WR</div></div>
<div style={{fontSize:20,color:P.t3}}>vs</div>
<div><span style={{fontSize:20,fontWeight:900,color:heroB.wr>heroA.wr?P.nG:P.t3}}>{heroB.wr}%</span><div style={{fontSize:9,color:P.t3}}>{heroB.n} WR</div></div>
</div>
</div>
</div>):(<div style={{textAlign:"center",padding:"30px",color:P.t3}}>
<div style={{fontSize:40,marginBottom:8}}>⚖️</div>
<div style={{fontSize:13}}>Select two heroes above to compare stats, matchups & builds</div>
<div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:3,marginTop:12}}>{["Sora vs Julian","Tigreal vs Atlas","Hayabusa vs Ling","Kimmy vs Brody"].map(pair=>{const[a,b]=pair.split(" vs ");return <span key={pair} style={s.ch(P.gold)} onClick={()=>{setCmpA(a);setCmpB(b);}}>{pair}</span>;})}</div>
</div>)}</>}

{/* ═══ EMBLEMS ═══ */}
{tab==="Emblems"&&<>
<div style={{fontSize:11,color:P.t2,marginBottom:10,lineHeight:1.6}}>Choose Tier 3 FIRST — it's your win condition. Then T2 for the matchup. Then T1 for lane comfort. Change emblems during hero select based on enemy comp.</div>
{EMBLEM_SETS.map(em=>(<div key={em.name} style={{background:P.cd,border:`1px solid ${em.color}33`,borderRadius:12,padding:14,marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<span style={{fontSize:22}}>{em.icon}</span>
<div><div style={{fontSize:15,fontWeight:900,color:em.color}}>{em.name} Emblem</div><div style={{fontSize:9,color:P.t3}}>{em.stats}</div></div>
</div>
<div style={{fontSize:10,color:P.t2,marginBottom:8,fontStyle:"italic"}}>Best for: {em.best}</div>
{[{tier:"Tier 1",data:em.t1,label:"Attribute Bonus"},{tier:"Tier 2",data:em.t2,label:"Triggered Ability"},{tier:"Tier 3",data:em.t3,label:"Core Talent ⭐"}].map(({tier,data,label})=>(<div key={tier} style={{marginBottom:8}}>
<div style={{fontSize:10,fontWeight:700,color:em.color,letterSpacing:1,marginBottom:4}}>{tier} — {label}</div>
{data.map(t=>(<div key={t.n} style={{background:P.bg,borderRadius:6,padding:"6px 8px",marginBottom:3,borderLeft:`2px solid ${em.color}44`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:11,fontWeight:700}}>{t.n}</span>
<span style={{fontSize:9,color:em.color}}>{t.e}</span>
</div>
<div style={{fontSize:9,color:P.t3,marginTop:2}}>When: {t.use}</div>
</div>))}
</div>))}
</div>))}
<div style={s.tp}>💡 <strong>Top Mistakes:</strong> (1) Killing Spree on tanks — does nothing, use Concussive Blast. (2) Skipping Seasoned Hunter as jungler — 15% Lord/Turtle DMG is mandatory. (3) Never switching — you CAN change emblems during hero select. (4) Choosing T1 first — T3 defines your match plan, pick it first.</div>
</>}

{/* ═══ PRO PICKS ═══ */}
{tab==="Pro Picks"&&<>
<div style={{background:`linear-gradient(135deg,${P.red}0c,${P.gold}08)`,border:`1px solid ${P.gold}33`,borderRadius:12,padding:14,marginBottom:12}}>
<div style={{fontSize:17,fontWeight:900,color:P.gold}}>🏆 MPL Pro Picks</div>
<div style={{fontSize:11,color:P.t2,marginTop:4,lineHeight:1.6}}>Pick/ban data from MPL Season 15 & M6 2026 professional tournaments. What the pros are playing in competitive.</div>
</div>
{PRO_PICKS.map(role=>(<div key={role.role} style={{marginBottom:14}}>
<div style={{fontSize:13,fontWeight:800,color:P.gold,marginBottom:6}}>{role.role}</div>
{role.heroes.map(h=>(<div key={h.n} style={{...s.cd2,cursor:"pointer"}} onClick={()=>{const f=H.find(x=>x.n===h.n);if(f)setSel(f);}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontSize:12,fontWeight:700}}>{h.n}</div>
<div style={{display:"flex",gap:8}}>
<div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:800,color:P.nG}}>{h.pk}%</div><div style={{fontSize:7,color:P.t3}}>PICK</div></div>
<div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:800,color:P.red}}>{h.bn}%</div><div style={{fontSize:7,color:P.t3}}>BAN</div></div>
<div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:800,color:h.wr>=53?P.nG:P.t2}}>{h.wr}%</div><div style={{fontSize:7,color:P.t3}}>WR</div></div>
</div></div>
<div style={{fontSize:10,color:P.t2,marginTop:3}}>{h.note}</div>
<div style={s.br2(h.pk,P.blue)}><div style={s.bf2(h.pk,P.blue)}/></div>
</div>))}
</div>))}
<div style={s.sc}>💡 Pro Insights</div>
{PRO_TIPS_DATA.map((t,i)=>(<div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${P.brd}`,fontSize:11,color:P.t2}}><span style={{color:P.gold,fontWeight:700}}>{i+1}.</span> {t}</div>))}
</>}

{/* ═══ GLOSSARY ═══ */}
{tab==="Glossary"&&<>
<div style={{fontSize:11,color:P.t2,marginBottom:10}}>All MLBB terminology explained. Essential for new players.</div>
<div style={s.fR}>{["All","Combat","Strategy","Items","Spells","Teamplay","Draft","General"].map(c=><button key={c} style={s.fb(glsCat===c,P.neon)} onClick={()=>setGlsCat(c)}>{c}</button>)}</div>
{GLOSSARY.filter(g=>glsCat==="All"||g.cat===glsCat).map(g=>(<div key={g.term} style={{...s.cd2,cursor:"default",borderLeft:`3px solid ${P.gold}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:13,fontWeight:800,color:P.gold}}>{g.term}</span>
<span style={{fontSize:9,padding:"1px 6px",borderRadius:6,background:P.brd,color:P.t3}}>{g.cat}</span>
</div>
<div style={{fontSize:11,color:P.t2,marginTop:4,lineHeight:1.5}}>{g.def}</div>
</div>))}
</>}

{/* ═══ LEARNING PATH ═══ */}
{tab==="Learn"&&<>
<div style={{background:`linear-gradient(135deg,${P.nG}0c,${P.gold}08)`,border:`1px solid ${P.nG}33`,borderRadius:12,padding:14,marginBottom:12}}>
<div style={{fontSize:17,fontWeight:900,color:P.nG}}>🏅 Learning Path</div>
<div style={{fontSize:11,color:P.t2,marginTop:4}}>Step-by-step progression from complete beginner to Mythical Glory.</div>
</div>
{LEARN_PATH.map((lv,i)=>(<div key={i} style={{background:P.cd,border:`1px solid ${lv.color}33`,borderRadius:12,padding:14,marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<span style={{fontSize:24}}>{lv.icon}</span>
<div><div style={{fontSize:15,fontWeight:900,color:lv.color}}>{lv.level}</div>
<div style={{fontSize:10,color:P.t3}}>{lv.rank} · {lv.hours}</div></div>
</div>
<div style={{fontSize:10,fontWeight:700,color:P.gold,letterSpacing:1,marginBottom:4}}>GOALS</div>
{lv.goals.map((g,j)=>(<div key={j} style={{padding:"3px 0",fontSize:11,color:P.t2,lineHeight:1.5}}>☐ {g}</div>))}
<div style={{marginTop:8,fontSize:10,color:P.neon}}>🎮 <strong>Recommended Heroes:</strong> {lv.heroes}</div>
<div style={{marginTop:4,padding:"6px 8px",background:`${lv.color}12`,borderRadius:6,fontSize:11,color:lv.color,fontWeight:600}}>🎯 Focus: {lv.focus}</div>
</div>))}
</>}

{/* ═══ MY STATS (Personal Tracker) ═══ */}
{tab==="My Stats"&&<>
<div style={{background:`linear-gradient(135deg,${P.purp}0c,${P.pink}08)`,border:`1px solid ${P.purp}33`,borderRadius:12,padding:14,marginBottom:12}}>
<div style={{fontSize:17,fontWeight:900,color:P.purp}}>📊 My Stats Tracker</div>
<div style={{fontSize:11,color:P.t2,marginTop:4}}>Log your matches to track win rate per hero. Data saves between sessions.</div>
</div>
{/* Add match */}
<div style={{background:P.cd,border:`1px solid ${P.brd}`,borderRadius:10,padding:12,marginBottom:10}}>
<div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Log a Match</div>
<div style={{position:"relative",marginBottom:6}}>
<input style={{...s.ip,marginBottom:0}} placeholder="Hero name..." value={tkHero} onChange={e=>setTkHero(e.target.value)}/>
{tkHero&&!H.find(x=>x.n.toLowerCase()===tkHero.toLowerCase())&&H.filter(x=>x.n.toLowerCase().includes(tkHero.toLowerCase())).slice(0,5).length>0&&(
<div style={{position:"absolute",top:40,left:0,right:0,background:P.cd,border:`1px solid ${P.brd}`,borderRadius:8,zIndex:10}}>
{H.filter(x=>x.n.toLowerCase().includes(tkHero.toLowerCase())).slice(0,5).map(h=>(<div key={h.n} style={{padding:"5px 10px",fontSize:12,cursor:"pointer",borderBottom:`1px solid ${P.brd}`}} onClick={()=>setTkHero(h.n)}>{ri(h.r)} {h.n}</div>))}
</div>)}
</div>
<div style={{display:"flex",gap:6}}>
{["Win","Loss","MVP"].map(r=>(<button key={r} style={{...s.fb(tkResult===r,r==="Win"?P.nG:r==="Loss"?P.red:P.gold),flex:1,textAlign:"center",padding:"8px"}} onClick={()=>setTkResult(r)}>{r}</button>))}
</div>
<button style={{marginTop:8,padding:"8px 0",background:P.gold,border:"none",borderRadius:8,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}} onClick={()=>{
if(!tkHero||!H.find(x=>x.n.toLowerCase()===tkHero.toLowerCase()))return;
const entry={hero:H.find(x=>x.n.toLowerCase()===tkHero.toLowerCase()).n,result:tkResult,date:new Date().toLocaleDateString()};
saveTracker([entry,...tracker]);setTkHero("");
}}>+ Log Match</button>
</div>
{/* Stats summary */}
{tracker.length>0&&<>
<div style={s.sc}>📈 My Performance</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
{[["Total",tracker.length,P.blue],["Wins",tracker.filter(m=>m.result==="Win"||m.result==="MVP").length,P.nG],["Win Rate",tracker.length?(((tracker.filter(m=>m.result==="Win"||m.result==="MVP").length/tracker.length)*100).toFixed(0)+"%"):"0%",P.gold]].map(([l,v,c])=>(
<div key={l} style={{background:P.cd,borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:8,color:P.t3,letterSpacing:1}}>{l}</div></div>))}
</div>
{/* Per hero stats */}
<div style={s.sc}>🦸 Hero Win Rates</div>
{Object.entries(tracker.reduce((acc,m)=>{if(!acc[m.hero])acc[m.hero]={w:0,l:0,mvp:0};if(m.result==="Win")acc[m.hero].w++;else if(m.result==="MVP"){acc[m.hero].w++;acc[m.hero].mvp++;}else acc[m.hero].l++;return acc;},{})).sort((a,b)=>(b[1].w+b[1].mvp)/(b[1].w+b[1].l||1)-(a[1].w+a[1].mvp)/(a[1].w+a[1].l||1)).map(([hero,st])=>{
const total=st.w+st.l;const wr=total?(st.w/total*100).toFixed(0):0;
return(<div key={hero} style={{...s.cd2,cursor:"default",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:12,fontWeight:700}}>{hero}</div><div style={{fontSize:10,color:P.t3}}>{st.w}W {st.l}L {st.mvp>0?`${st.mvp} MVP`:""}</div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:wr>=60?P.nG:wr>=50?P.gold:P.red}}>{wr}%</div></div>
</div>);})}
{/* Recent matches */}
<div style={s.sc}>📋 Recent Matches</div>
{tracker.slice(0,15).map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${P.brd}`}}>
<span style={{fontSize:11}}>{m.hero}</span>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<span style={{fontSize:10,color:P.t3}}>{m.date}</span>
<span style={{fontSize:10,fontWeight:700,color:m.result==="Loss"?P.red:P.nG}}>{m.result}</span>
</div>
</div>))}
<button style={{marginTop:8,padding:"6px 0",background:"transparent",border:`1px solid ${P.red}33`,borderRadius:6,color:P.red,fontSize:10,cursor:"pointer",width:"100%",fontFamily:"inherit"}} onClick={()=>saveTracker([])}>🗑️ Clear All Data</button>
</>}
{tracker.length===0&&<div style={{textAlign:"center",padding:30,color:P.t3}}><div style={{fontSize:36}}>📊</div><div style={{fontSize:13,marginTop:8}}>No matches logged yet. Start tracking above!</div></div>}
</>}

{/* ═══ BUILD (with save) ═══ */}
{tab==="Build"&&<><div style={{background:P.cd,border:`1px solid ${P.brd}`,borderRadius:12,padding:12,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{fontSize:13,fontWeight:800}}>Build ({bS.filter(Boolean).length}/6)</div><div style={{fontSize:14,fontWeight:900,color:P.gold}}>{bG}g</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>{bS.map((it,i)=>(<div key={i} style={{background:it?P.bg2:P.bg,border:`1px solid ${it?P.gold+"33":P.brd}`,borderRadius:6,padding:6,textAlign:"center",minHeight:40,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:it?"pointer":"default"}} onClick={()=>{if(it){const n=[...bS];n[i]=null;setBS(n);}}}>{it?<><div style={{fontSize:10,fontWeight:700}}>{it.i} {it.n}</div><div style={{fontSize:8,color:P.t3}}>tap remove</div></>:<div style={{fontSize:10,color:P.t3}}>#{i+1}</div>}</div>))}</div>
{/* Save build */}
<div style={{display:"flex",gap:4,marginTop:6}}>
<input style={{...s.ip,flex:1,marginBottom:0,fontSize:11,padding:"6px 10px"}} placeholder="Build name..." value={buildName} onChange={e=>setBuildName(e.target.value)}/>
<button style={{padding:"6px 12px",background:P.gold,border:"none",borderRadius:8,color:"#000",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{
if(!buildName||bS.filter(Boolean).length===0)return;
saveBuilds([...savedBuilds,{name:buildName,items:bS.filter(Boolean).map(i=>({n:i.n,g:i.g,i:i.i,st:i.st,pa:i.pa,tg:i.tg})),date:new Date().toLocaleDateString()}]);
setBuildName("");
}}>💾 Save</button>
</div>
<button style={{marginTop:4,padding:"4px 12px",background:"transparent",border:`1px solid ${P.red}33`,borderRadius:6,color:P.red,fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setBS(Array(6).fill(null))}>Clear</button>
</div>
{/* Saved builds */}
{savedBuilds.length>0&&<><div style={s.sc}>💾 Saved Builds</div>
{savedBuilds.map((sb,i)=>(<div key={i} style={{...s.cd2,cursor:"default"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontSize:12,fontWeight:700,color:P.gold}}>{sb.name}</div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<span style={{fontSize:9,color:P.t3}}>{sb.date}</span>
<button style={{fontSize:9,color:P.nG,background:"transparent",border:`1px solid ${P.nG}33`,borderRadius:4,padding:"2px 6px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{const n=Array(6).fill(null);sb.items.forEach((it,j)=>{if(j<6)n[j]=it;});setBS(n);}}>Load</button>
<button style={{fontSize:9,color:P.red,background:"transparent",border:`1px solid ${P.red}33`,borderRadius:4,padding:"2px 6px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{saveBuilds(savedBuilds.filter((_,j)=>j!==i));}}>✕</button>
</div>
</div>
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{sb.items.map((it,j)=><span key={j} style={{fontSize:9,padding:"2px 6px",background:`${P.gold}12`,borderRadius:4,color:P.goldD}}>{it.i} {it.n}</span>)}</div>
</div>))}</>}
<div style={s.fR}>{Object.keys(ITEMS).map(c=><button key={c} style={s.fb(bC===c,P.neon)} onClick={()=>setBC(c)}>{c}</button>)}</div>{(ITEMS[bC]||[]).map(it=>(<div key={it.n} style={{...s.cd2,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:bS.filter(Boolean).length>=6?.4:1}} onClick={()=>{const idx=bS.findIndex(x=>x===null);if(idx!==-1){const n=[...bS];n[idx]=it;setBS(n);}}}><div><div style={{fontSize:12,fontWeight:600}}>{it.i} {it.n} <span style={{color:P.t3}}>{it.g}g</span></div><div style={{fontSize:10,color:P.t2}}>{it.st}</div></div>{bS.filter(Boolean).length<6&&<span style={{fontSize:16,color:P.nG}}>+</span>}</div>))}</>}

{tab==="Draft"&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>{[{t:d1,l:"Blue",c:P.blue},{t:d2,l:"Red",c:P.red}].map(({t,l,c},ti)=>(<div key={ti} style={{background:P.cd,border:`1px solid ${c}33`,borderRadius:8,padding:8}}><div style={{fontSize:12,fontWeight:800,color:c,textAlign:"center",marginBottom:4}}>{l}</div><div style={{fontSize:9,color:P.t3}}>Bans:</div><div style={{display:"flex",flexWrap:"wrap",gap:2,minHeight:18,marginBottom:4}}>{t.b.map((b,i)=><span key={i} style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:`${P.red}22`,color:P.red,textDecoration:"line-through"}}>{b}</span>)}</div><div style={{fontSize:9,color:P.t3}}>Picks:</div><div style={{display:"flex",flexDirection:"column",gap:2,minHeight:18}}>{t.p.map((p,i)=>{const h=H.find(x=>x.n===p);return<span key={i} style={{fontSize:10,padding:"2px 5px",borderRadius:3,background:`${c}15`,color:c}}>{h?ri(h.r):""} {p}</span>;})}</div></div>))}</div>
<div style={{textAlign:"center",marginBottom:6}}>{dP!=="done"?<><span style={{fontSize:12,fontWeight:800,color:dT===1?P.blue:P.red}}>{dT===1?"Blue":"Red"}</span><span style={{fontSize:11,color:P.t2}}> — {dP.includes("ban")?"BAN":"PICK"}</span></>:<div style={{fontSize:13,fontWeight:800,color:P.nG}}>✅ Draft Complete!</div>}</div>
{dP!=="done"&&<><input style={s.ip} placeholder="🔍 Search..." value={dQ} onChange={e=>sdQ(e.target.value)}/><div style={{display:"flex",flexWrap:"wrap",gap:3,maxHeight:250,overflowY:"auto"}}>{dAv.slice(0,40).map(h=><span key={h.n} style={s.ch(dP.includes("ban")?P.red:dT===1?P.blue:P.red)} onClick={()=>dSl(h.n)}>{ri(h.r)} {h.n}</span>)}</div></>}
<button style={{marginTop:8,padding:"6px 0",background:"transparent",border:`1px solid ${P.gold}`,borderRadius:6,color:P.gold,fontSize:11,cursor:"pointer",width:"100%",fontFamily:"inherit"}} onClick={dR}>🔄 Reset</button>
{dP==="done"&&<>{[{t:d1,l:"Blue",c:P.blue},{t:d2,l:"Red",c:P.red}].map(({t,l,c})=>{const picks=t.p.map(p=>H.find(h=>h.n===p)).filter(Boolean);const roles=picks.map(p=>p.r);const w=[];if(!roles.includes("Tank")&&!picks.some(p=>p.r2==="Tank"))w.push("No tank");if(!roles.includes("Mage")&&!picks.some(p=>p.r2==="Mage"))w.push("No mage");if(!roles.includes("Marksman"))w.push("No MM");const avg=picks.length?(picks.reduce((a,p)=>a+p.wr,0)/picks.length).toFixed(1):0;return(<div key={l} style={{...s.cd2,borderLeft:`3px solid ${c}`,marginTop:8,cursor:"default"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:800,color:c}}>{l}</span><span style={{fontSize:11,color:P.t2}}>Avg WR: {avg}%</span></div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{picks.map(p=><span key={p.n} style={s.bg(rc(p.r))}>{ri(p.r)} {p.n}</span>)}</div>{w.length?w.map((x,i)=><div key={i} style={{fontSize:10,color:P.gold,marginTop:2}}>⚠️ {x}</div>):<div style={{fontSize:10,color:P.nG,marginTop:2}}>✅ Balanced</div>}</div>);})}</>}</>}

</div>
<div style={{textAlign:"center",padding:"16px 12px 24px",fontSize:9,color:P.t3,borderTop:`1px solid ${P.brd}`}}>MLBB Pro Guide · {H.length} Heroes · Patch {PATCH.v} · S{PATCH.s} · Not affiliated with Moonton</div>
</div>);}
