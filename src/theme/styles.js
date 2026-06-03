import { P } from "./palette.js";

// Ported verbatim from the original monolith (the `s` style object).
export const s = {
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
