// Datos de los laboratorios y lógica de disponibilidad.
// Se separó de index.html para poder probarlo con Node en el pipeline (CI).
const BLOQUES=[["7:30","8:20"],["8:20","9:10"],["9:10","10:00"],["10:00","10:50"],["10:50","11:40"],["11:40","12:30"],["12:30","13:20"],["13:20","14:10"],["14:10","15:00"],["15:00","15:50"],["15:50","16:40"],["16:40","17:30"],["17:30","18:20"],["18:20","19:10"]];
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes"];
const MATERIAS={EstrucDatos:"Estructura de Datos",ComHabDig:"Com. y Habilidades Digitales",EtiProf:"Ética Profesional",AyDdS:"Análisis y Diseño de Software",FundProgra:"Fund. de Programación",TutoriaGpo:"Tutoría Grupal",Asesorias:"Asesorías académicas",DevOps:"DevOps",EticaLegisTI:"Ética y Legislación TI",Opt1_BDNube:"Optativa I: BD en la Nube",Ingles6:"Inglés 6",HG:"HG",FundProyTI:"Fund. de Proyectos TI",Seg_Inform:"Seguridad Informática",FdR:"Fund. de Redes",WebApps:"Aplicaciones Web",DesaMovInt:"Desarrollo Móvil Integral",DesApliMoviles:"Des. de Apps Móviles",PWA:"Apps Web Progresivas",OptIVideo:"Optativa I: Videojuegos",Int:"Integradora",Fund_IA:"Fund. de IA",Ingles1:"Inglés 1",Ingles9:"Inglés 9"};
// Formato: "bloque|materia|grupo|profe". Un arreglo por día (Lu..Vie).
const LABS=[
 {id:"1103",nombre:"Lab. Pruebas 1103",codigo:"Lab1103",d:[
  ["2|EstrucDatos|DSM4B|JBrindis","3|EstrucDatos|DSM4B|JBrindis","4|EstrucDatos|DSM4A|Kcantú","5|Asesorias|DSM1B|"],
  ["4|TutoriaGpo|DSM4A|FélixCarlos","5|AyDdS|DSM4A|FélixCarlos","6|ComHabDig|DSM1C|Kcantú","7|EstrucDatos|DSM4A|Kcantú","8|EstrucDatos|DSM4A|Kcantú"],
  ["1|ComHabDig|DSM1C|Kcantú","2|ComHabDig|DSM1C|Kcantú","3|EtiProf|DSM4A|SharinePiña","4|AyDdS|DSM4A|FélixCarlos","5|Asesorias|DSM1B|"],
  ["6|AyDdS|DSM4A|FélixCarlos","8|EstrucDatos|DSM4A|Kcantú"],
  ["3|FundProgra|DSM1D|CésarGarcía","4|FundProgra|DSM1D|CésarGarcía","6|ComHabDig|DSM1D|ErikaVazquez"]]},
 {id:"1101",nombre:"Lab. 1101",codigo:"Lab1101",d:[
  ["2|DevOps|IDyGS10A|FélixCarlos","3|DevOps|IDyGS10A|FélixCarlos","5|EticaLegisTI|ITIID7A|ErikaVazquez","8|Opt1_BDNube|ITIID7A|JBrindis"],
  ["1|Ingles6|ITIID7A|JoseLuna","2|HG|ITIID7A|GildaDuarte","4|TutoriaGpo|ITIID7A|ErikaVazquez","5|FundProyTI|ITIID7A|KTolano","6|FundProyTI|ITIID7A|KTolano","7|Seg_Inform|ITIID7A|AlfonsoFlo","8|Seg_Inform|ITIID7A|AlfonsoFlo"],
  ["1|EticaLegisTI|ITIID7A|ErikaVazquez","2|Opt1_BDNube|ITIID7A|JBrindis","3|Opt1_BDNube|ITIID7A|JBrindis","4|Seg_Inform|ITIID7A|AlfonsoFlo","5|DevOps|IDyGS10A|FélixCarlos","6|Asesorias|DSM4A|","8|Ingles6|ITIID7A|JoseLuna","9|Ingles6|ITIID7A|JoseLuna"],
  ["1|EticaLegisTI|ITIID7A|ErikaVazquez","2|HG|ITIID7A|GildaDuarte","3|HG|ITIID7A|GildaDuarte","5|FundProyTI|ITIID7A|KTolano","6|FundProyTI|ITIID7A|KTolano","7|Opt1_BDNube|ITIID7A|JBrindis","8|Opt1_BDNube|ITIID7A|JBrindis"],
  ["1|EticaLegisTI|ITIID7A|ErikaVazquez","2|Opt1_BDNube|ITIID7A|JBrindis","3|DevOps|IDyGS10A|FélixCarlos","5|DevOps|IDyGS10B|FélixCarlos","6|DevOps|IDyGS10B|FélixCarlos","8|Seg_Inform|ITIID7A|AlfonsoFlo"]]},
 {id:"cisco",nombre:"Lab. Cisco",codigo:"Lab Cisco",d:[
  ["1|FdR|DSM1C|KTolano","2|FdR|DSM1C|KTolano","3|Seg_Inform|ITIID7A|AlfonsoFlo","4|Seg_Inform|ITIID7A|AlfonsoFlo","5|WebApps|DSM4B|CésarGarcía","6|WebApps|DSM4B|CésarGarcía","8|FundProgra|DSM1B|CésarGarcía"],
  ["1|ComHabDig|DSM1B|ErikaVazquez","4|TutoriaGpo|DSM1D|TPortela","5|FdR|DSM1D|TPortela","6|AyDdS|DSM4B|FélixCarlos","7|AyDdS|DSM4B|FélixCarlos","8|EstrucDatos|DSM4B|JBrindis"],
  ["1|FdR|DSM1B|KTolano","2|FdR|DSM1B|KTolano","3|FdR|DSM1A|KTolano","4|FdR|DSM1A|KTolano","6|EstrucDatos|DSM4B|JBrindis","8|FdR|DSM1D|TPortela"],
  ["1|AyDdS|DSM4B|FélixCarlos","2|FdR|DSM1A|KTolano","3|FdR|DSM1A|KTolano","4|ComHabDig|DSM1B|ErikaVazquez","6|FdR|DSM1D|TPortela"],
  ["1|FdR|DSM1B|KTolano","2|FdR|DSM1B|KTolano","3|FdR|DSM1C|KTolano","4|FdR|DSM1C|KTolano","5|ComHabDig|DSM1D|ErikaVazquez"]]},
 {id:"micro",nombre:"Lab. Microsoft",codigo:"Lab Micro",d:[
  ["1|FundProgra|DSM1D|CésarGarcía","2|FundProgra|DSM1A|CésarGarcía","3|FundProgra|DSM1A|CésarGarcía","6|ComHabDig|DSM1C|Kcantú","7|ComHabDig|DSM1C|Kcantú","8|AyDdS|DSM4A|FélixCarlos","9|AyDdS|DSM4A|FélixCarlos"],
  ["1|WebApps|DSM4B|CésarGarcía","4|TutoriaGpo|DSM1B|KTolano","5|Asesorias|DSM1B|","6|FundProgra|DSM1A|CésarGarcía","7|FundProgra|DSM1A|CésarGarcía","8|FundProgra|DSM1B|CésarGarcía"],
  ["1|WebApps|DSM4A|CésarGarcía","2|AyDdS|DSM4B|FélixCarlos","3|AyDdS|DSM4B|FélixCarlos","5|FundProgra|DSM1C|CésarGarcía","6|FundProgra|DSM1C|CésarGarcía"],
  ["1|FundProgra|DSM1B|CésarGarcía","2|FundProgra|DSM1B|CésarGarcía","3|WebApps|DSM4A|CésarGarcía","5|WebApps|DSM4B|CésarGarcía","6|WebApps|DSM4B|CésarGarcía","7|FundProgra|DSM1C|CésarGarcía","8|FundProgra|DSM1C|CésarGarcía"],
  ["1|WebApps|DSM4A|CésarGarcía","2|WebApps|DSM4A|CésarGarcía","3|ComHabDig|DSM1A|ErikaVazquez","4|ComHabDig|DSM1A|ErikaVazquez","8|EstrucDatos|DSM4B|JBrindis","9|EtiProf|DSM4B|SharinePiña"]]},
 {id:"aula",nombre:"Aula Activa TIC",codigo:"Edif. H, planta alta",d:[
  ["1|DesaMovInt|IDyGS10A|MiguelLopez","2|DesApliMoviles|DSM4A|MiguelLopez","3|DesApliMoviles|DSM4A|MiguelLopez","5|PWA|IDyGS10A|JBrindis","6|DesaMovInt|IDyGS10B|MiguelLopez","8|ComHabDig|DSM1A|ErikaVazquez"],
  ["1|PWA|IDyGS10B|JBrindis","2|PWA|IDyGS10B|JBrindis","4|TutoriaGpo|DSM4B|JBrindis","5|DesaMovInt|IDyGS10B|MiguelLopez"],
  ["1|DesaMovInt|IDyGS10A|MiguelLopez","2|DesaMovInt|IDyGS10A|MiguelLopez","3|DesaMovInt|IDyGS10B|MiguelLopez","4|DesaMovInt|IDyGS10B|MiguelLopez","5|DesApliMoviles|DSM4A|MiguelLopez","6|OptIVideo|IDyGS10A|Kcantú","7|DesApliMoviles|DSM4B|MiguelLopez","8|DesApliMoviles|DSM4B|MiguelLopez"],
  ["1|DesApliMoviles|DSM4A|MiguelLopez","2|Int|IDyGS10A|L-Amavizca","3|Int|IDyGS10B|L-Amavizca","5|ComHabDig|DSM1A|ErikaVazquez","6|ComHabDig|DSM1A|ErikaVazquez","7|DesApliMoviles|DSM4B|MiguelLopez","8|DesApliMoviles|DSM4B|MiguelLopez"],
  ["1|DesaMovInt|IDyGS10B|MiguelLopez","2|DesaMovInt|IDyGS10B|MiguelLopez","3|DesApliMoviles|DSM4B|MiguelLopez","4|DesApliMoviles|DSM4B|MiguelLopez","5|DesaMovInt|IDyGS10A|MiguelLopez","6|DesApliMoviles|DSM4A|MiguelLopez","7|DesApliMoviles|DSM4A|MiguelLopez","8|EstrucDatos|DSM4A|Kcantú"]]},
 {id:"iot",nombre:"Lab. IoT e IA",codigo:"CDS-IoT",d:[
  ["1|DevOps|IDyGS10B|FélixCarlos","2|OptIVideo|IDyGS10B|Kcantú","3|OptIVideo|IDyGS10B|Kcantú","6|Fund_IA|ITIID7A|TPortela","7|Fund_IA|ITIID7A|TPortela"],
  ["1|DesaMovInt|IDyGS10A|MiguelLopez","2|DesaMovInt|IDyGS10A|MiguelLopez","4|TutoriaGpo|IDyGS10A|L-Amavizca","5|Int|IDyGS10A|L-Amavizca","6|Int|IDyGS10B|L-Amavizca"],
  ["1|DevOps|IDyGS10B|FélixCarlos","2|WebApps|DSM4A|CésarGarcía","4|PWA|IDyGS10A|JBrindis","5|PWA|IDyGS10B|JBrindis","6|Fund_IA|ITIID7A|TPortela","7|Fund_IA|ITIID7A|TPortela"],
  ["1|OptIVideo|IDyGS10B|Kcantú","2|OptIVideo|IDyGS10B|Kcantú","3|Ingles1|DSM1B|AleLagarda","5|OptIVideo|IDyGS10A|Kcantú","6|OptIVideo|IDyGS10A|Kcantú"],
  ["1|OptIVideo|IDyGS10A|Kcantú","2|Ingles9|IDyGS10A|AlfonsoFlo","3|Ingles1|DSM1B|AleLagarda","4|PWA|IDyGS10A|JBrindis","5|Fund_IA|ITIID7A|TPortela","6|Fund_IA|ITIID7A|TPortela"]]}
];
// Índice rápido: OC[lab][dia][bloque] = clase o undefined
const OC={};
LABS.forEach(l=>{OC[l.id]=l.d.map(dia=>{const m={};dia.forEach(s=>{const[b,mat,g,p]=s.split("|");m[+b]={mat:MATERIAS[mat]||mat,g,p};});return m;});});

const mins=t=>{const[h,m]=t.split(":").map(Number);return h*60+m};
function ahora(){
  const d=new Date(),dow=d.getDay(),m=d.getHours()*60+d.getMinutes();
  if(dow<1||dow>5) return {dia:0,bloque:1,fuera:"Es fin de semana, te muestro el lunes temprano."};
  const i=BLOQUES.findIndex(([a,b])=>m>=mins(a)&&m<mins(b));
  if(i>=0) return {dia:dow-1,bloque:i+1};
  if(m<mins(BLOQUES[0][0])) return {dia:dow-1,bloque:1,fuera:"Todavía no empiezan las clases."};
  return {dia:dow-1,bloque:14,fuera:"Ya terminaron los bloques de hoy."};
}
// Desde el bloque b: si está libre, hasta cuándo; si está ocupado, cuándo se libera
function estado(lab,dia,b){
  const m=OC[lab][dia],c=m[b];
  if(!c){let e=b;while(e<14&&!m[e+1])e++;return {libre:true,hasta:BLOQUES[e-1][1],n:e-b+1,todoDia:e===14};}
  let e=b;while(e<14&&m[e+1])e++;
  return {libre:false,c,seLibera:e<14?BLOQUES[e-1][1]:null};
}


// En el navegador 'module' no existe y esta línea no hace nada; en Node exporta todo para las pruebas.
if (typeof module !== "undefined") module.exports = { BLOQUES, DIAS, MATERIAS, LABS, OC, mins, ahora, estado };
