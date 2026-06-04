// Calmer, higher-contrast palette for low-DPI readability (softer dark bg, more
// visible borders, lighter secondary text, less retina-searing neons).
export const P = { bg:"#101725", bg2:"#162031", cd:"#1b2638", gold:"#f5c542", goldD:"#d6a52a", neon:"#39d2ec", nG:"#4cd97e", red:"#f8556e", blue:"#5f9bff", purp:"#b074f5", pink:"#f48ac0", t1:"#f2f5fa", t2:"#aebacc", t3:"#7d8da8", brd:"#2b3850" };
export const tc = t => ({ "S+":"#ff4d6a", S:"#ffd036", A:"#5ddb6f", B:"#5da8e8", C:"#7a8599" }[t] || P.t3);
export const rc = r => ({ Tank:P.blue, Fighter:P.gold, Assassin:P.red, Mage:P.purp, Marksman:P.nG, Support:P.neon }[r] || P.t3);
export const ri = r => ({ Tank:"🛡️", Fighter:"⚔️", Assassin:"🗡️", Mage:"🔮", Marksman:"🏹", Support:"💚" }[r] || "❓");
export const ROLES = ["Tank","Fighter","Assassin","Mage","Marksman","Support"];
export const TIERS = ["S+","S","A","B","C"];
