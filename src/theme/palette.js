export const P = { bg:"#060a13", bg2:"#0c1220", cd:"#111a2e", gold:"#f0b232", goldD:"#c8941a", neon:"#00e5ff", nG:"#39ff14", red:"#ff3b5c", blue:"#4d8bff", purp:"#a855f7", pink:"#f472b6", t1:"#eef2f8", t2:"#8899b3", t3:"#4a5873", brd:"#1a2540" };
export const tc = t => ({ "S+":"#ff4d6a", S:"#ffd036", A:"#5ddb6f", B:"#5da8e8", C:"#7a8599" }[t] || P.t3);
export const rc = r => ({ Tank:P.blue, Fighter:P.gold, Assassin:P.red, Mage:P.purp, Marksman:P.nG, Support:P.neon }[r] || P.t3);
export const ri = r => ({ Tank:"🛡️", Fighter:"⚔️", Assassin:"🗡️", Mage:"🔮", Marksman:"🏹", Support:"💚" }[r] || "❓");
export const ROLES = ["Tank","Fighter","Assassin","Mage","Marksman","Support"];
export const TIERS = ["S+","S","A","B","C"];
