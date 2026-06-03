export const PHASES=[
{ph:"Early (0-5 min)",i:"🌅",g:"Farm, first Turtle, lane priority",r:["Laners: Last-hit minions. 15 min farming > chasing kills","Jungler: Level 4 by 1:45. Gank nearest lane. Turtle at 2:00","Roamer: Vision, escort JG, protect gold lane MM","Push tower after kills — turrets = permanent gold advantage","DON'T chase into fog. DON'T overstay after kills"]},
{ph:"Mid (5-12 min)",i:"☀️",g:"Group objectives, outer turrets, snowball",r:["Contest EVERY Turtle — gold/XP compounds over time","After 5 min, lane minions > jungle camps. Share waves","Group 3-4 for turret pushes. Leave 1 in opposite lane","Rotate to lane where you got a kill — push that tower","Counter-build: check enemy items, buy anti-heal/armor/MR"]},
{ph:"Late (12+ min)",i:"🌙",g:"Lord control, teamfights, end game",r:["Lord at 9:00. Only after winning fight or enemy dead","One death = 40-60s timer. One bad fight loses the game","Stick with team. Solo farming late = getting picked off","Push with Lord immediately — don't recall","If behind: defend turrets. Trade objectives. Don't force lost fights"]},
];
export const MACRO_CATS=[
{c:"Laning",t:["Last-hit for max gold — don't auto-push mindlessly","Freeze wave near YOUR turret when behind","Slow push (big wave) then rotate for numbers advantage","Watch minimap — missing enemy = ganking someone"]},
{c:"Objectives",t:["Turrets > Kills > Camps. Push after kills ALWAYS","Turtle every 2 min. Lord at 9:00","Never solo Lord. Always 2+ teammates","Enemy used Retribution on camp? 35s free contest window"]},
{c:"Teamfights",t:["Tanks engage first. Carries stay BEHIND frontline","Focus enemy carry (MM/Mage), NOT the tank","Peel for YOUR carry if enemy dives them","Wait for key CDs before engaging (Diggie ult, Purify, WoN)"]},
{c:"Climbing",t:["Master 2-3 heroes per role. Don't play everything","Counter-build every match. Check enemy items","Mute toxic players. Tilt = bad decisions = lost stars","Review losses: died to ganks? Wrong items? Missed objectives?"]},
];
export const ANTI_HEAL={
when:"Buy when enemy has sustain hero (Estes, Uranus, Ruby, Yu Zhong, Alucard, Alice, Thamuz, Esmeralda)",
items:[{n:"Dominance Ice",r:"Tanks",e:"Aura: -50% Heal, -30% AS"},{n:"Sea Halberd",r:"Phys Carries",e:"AA reduces healing 50%"},{n:"Necklace of Durance",r:"Mages",e:"Skills reduce healing 50%"}],
tip:"Buy as 2nd-3rd item. Team should have 1-2 anti-heal items vs sustain comps."
};
