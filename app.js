const APP_VERSION='2.0.8';
const STORAGE_KEY='cockpit-v1';
const LEGACY_KEYS=['dm-cockpit-v05','dm-cockpit-v04','dm-cockpit-v03','dm-cockpit-v02'];
const BACKUP_KEY='cockpit-v1-backups';
const LEGACY_BACKUP_KEYS=['dm-cockpit-v05-backups'];
const SAVED_SESSIONS_KEY='cockpit-v1-sessions';
const LEGACY_SAVED_SESSIONS_KEYS=['dm-cockpit-v05-sessions'];
const AUTO_BACKUP_MS=30*60*1000;
const MAX_SAVED_SESSIONS=15;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const uid=(p='id')=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const uiIcon=(name,cls='ui-icon')=>`<img src="${name}.png" class="${cls}" alt="" aria-hidden="true">`;
const lines=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean);
const nowStamp=()=>new Date().toISOString();
const clone=v=>JSON.parse(JSON.stringify(v));

const DEMO={
  version:'2.0.6',
  title:'Démo · Le Relais de la Lune Brisée',
  view:'prep',
  activeLocationId:'l1',
  previewLocationId:'l1',
  contextTab:'npcs',
  libraryTab:'secrets',
  sessionStartedAt:null,
  lastAutoBackupAt:null,
  saveSlotId:null,
  players:[
    {id:'p1',name:'Pik Ekrok',spotlightIdeas:['Donner à Pik une personne vulnérable à protéger ou à soigner sous pression.'],spotlightCount:0},
    {id:'p2',name:'Tuskhan',spotlightIdeas:['Proposer à Tuskhan un obstacle où l’intimidation et la force ne sont pas les seules solutions.'],spotlightCount:0},
    {id:'p3',name:'Wonq',spotlightIdeas:['Faire apparaître un disparu, un nom oublié ou un témoignage incomplet qui parle à son rôle de Gardien des Absents.'],spotlightCount:0},
    {id:'p4',name:'Silas',spotlightIdeas:['Placer un détail matériel ou une piste discrète que Silas peut remarquer avant les autres.'],spotlightCount:0}
  ],
  thread:{
    goal:'Skarz, chef gobelours du clan Dent-Cassée, veut mettre la main sur une vieille carte de contrebandiers avant qu’une patrouille de Daggerford ne sécurise la région.',
    steps:[
      {id:'ts1',text:'Les gobelins identifient qui possède la carte.',done:false},
      {id:'ts2',text:'Ils enlèvent un témoin et récupèrent une partie de l’itinéraire.',done:false},
      {id:'ts3',text:'Skarz atteint la cache avant les PJ et arme sa bande avec son contenu.',done:false},
      {id:'ts4',text:'Le clan quitte la région avant l’arrivée des renforts de Daggerford.',done:false}
    ]
  },
  strongStart:{
    text:'Alors que les PJ prennent leur repas au Relais de la Lune Brisée, un chariot marchand dévale la route et s’écrase contre l’abreuvoir. Le conducteur est blessé, une flèche gobeline plantée dans l’épaule. Il agrippe le premier aventurier à sa portée : « Ils ont pris ma fille… et ils cherchent la carte. » Au même instant, un cor retentit dans les bois. Que faites-vous ?',
    used:false
  },
  locations:[
    {id:'l1',name:'Relais de la Lune Brisée',tier:'main',status:'current',concept:'Une auberge fortifiée sur la route entre Daggerford et le Bois d’Ardeep, refuge des voyageurs et carrefour des rumeurs.',visuals:['Une grande enseigne de lune fendue grince au vent.','Des chariots boueux s’entassent autour d’un abreuvoir de pierre.','Une cheminée monumentale domine une salle commune pleine de voyageurs.'],impulse:'Réunir des inconnus qui ont tous quelque chose à perdre sur la route.',situation:'Un marchand vient d’arriver blessé après une embuscade gobeline ; sa fille a été enlevée et une carte ancienne intéresse les ravisseurs.',faction:'Voyageurs et marchands de la Côte des Épées',localPlot:'Plusieurs clients soupçonnent qu’un informateur des gobelins fréquente l’auberge.',regionalPlot:'Les attaques sur la route deviennent assez nombreuses pour inquiéter Daggerford.',mainPlot:'La carte recherchée mène à une ancienne cache de contrebandiers.',danger:'Des éclaireurs gobelins surveillent les sorties du relais.',reward:'Des chevaux frais, des provisions et la confiance des marchands.',ifIgnored:'Les gobelins reviennent de nuit pour fouiller le chariot du marchand.',npcIds:[]},
    {id:'l2',name:'Vieux Moulin d’Ardeep',tier:'main',status:'unvisited',concept:'Un moulin abandonné au bord d’un ruisseau, utilisé comme point de rendez-vous par les éclaireurs gobelins.',visuals:['Une roue à aubes immobile couverte de mousse.','Des sacs de grain éventrés servent de couchettes.','Une cloche rouillée pend sous l’auvent.'],impulse:'Transformer tout bruit ou mouvement en alerte.',situation:'Deux gobelins surveillent une prisonnière pendant qu’un troisième attend un messager.',faction:'Clan Dent-Cassée',localPlot:'L’un des gobelins envisage de déserter avec une bourse volée.',regionalPlot:'Le moulin sert de relais entre plusieurs groupes de pillards.',mainPlot:'Un fragment de la carte est caché dans la doublure d’un sac de grain.',danger:'La cloche peut prévenir des renforts cachés dans les bois.',reward:'La prisonnière, un fragment de carte et une petite caisse de marchandises volées.',ifIgnored:'La prisonnière est déplacée vers le camp de Skarz avant la nuit.',npcIds:[]},
    {id:'l3',name:'Chapelle de Tymora',tier:'main',status:'unvisited',concept:'Une petite chapelle de route entretenue par un prêtre qui accueille voyageurs, blessés et superstitieux.',visuals:['Des rubans porte-bonheur flottent autour d’une statue de Tymora.','Une vasque de cuivre recueille les pièces laissées par les voyageurs.','Des lits de fortune occupent l’arrière de la nef.'],impulse:'Offrir une seconde chance à ceux qui osent la saisir.',situation:'Un éclaireur de Daggerford blessé affirme avoir vu des gobelins transporter une captive vers le nord.',faction:'Clergé de Tymora',localPlot:'Un pèlerin a volé une offrande et n’ose plus quitter la chapelle.',regionalPlot:'La patrouille de Daggerford est dispersée et manque d’informations fiables.',mainPlot:'Le prêtre reconnaît le symbole gravé sur la carte comme une ancienne marque de contrebandiers.',danger:'Un espion peut entendre ce que les PJ apprennent ici.',reward:'Soins, bénédiction mineure et informations sur les vieux chemins.',ifIgnored:'L’éclaireur repart seul et tombe dans une nouvelle embuscade.',npcIds:[]},
    {id:'l4',name:'Bosquet du Bois d’Ardeep',tier:'reserve',status:'unvisited',concept:'Un petit bosquet ancien où les pistes ordinaires deviennent difficiles à suivre.',visuals:[],impulse:'',situation:'Les gobelins ont laissé des marques de passage et un paquet abandonné dans les fougères.',faction:'',localPlot:'',regionalPlot:'',mainPlot:'',danger:'',reward:'',ifIgnored:'',npcIds:[]},
    {id:'l5',name:'Gué de la Delimbiyr',tier:'reserve',status:'unvisited',concept:'Un passage peu profond utilisé par marchands, contrebandiers et patrouilles.',visuals:[],impulse:'',situation:'Des traces fraîches montrent qu’un groupe chargé a traversé récemment vers l’ouest.',faction:'',localPlot:'',regionalPlot:'',mainPlot:'',danger:'',reward:'',ifIgnored:'',npcIds:[]}
  ],
  npcs:[
    {id:'n1',name:'Mara Vell',role:'Aubergiste humaine',identity:'Une aubergiste pragmatique qui connaît les habitués de la route mieux que les gardes.',wants:'Maintenir son relais sûr et fréquenté.',fears:'Que les attaques gobelines fassent fuir les caravanes.',knows:'Un voyageur encapuchonné a posé beaucoup de questions sur le marchand blessé.',hides:'Elle conserve sous son comptoir une arbalète chargée et un petit coffre de contrebande.',trait:'Essuie toujours le même verre lorsqu’elle réfléchit.'},
    {id:'n2',name:'Frère Edran',role:'Prêtre de Tymora',identity:'Un prêtre souriant qui croit que la chance récompense surtout ceux qui prennent des risques raisonnables.',wants:'Ramener les voyageurs blessés vivants jusqu’à Daggerford.',fears:'Voir les gens confondre chance et imprudence.',knows:'Les symboles de la carte appartiennent à d’anciens contrebandiers de la région.',hides:'Il a lui-même utilisé ces chemins lorsqu’il était jeune aventurier.',trait:'Fait tourner une pièce entre ses doigts avant de donner un conseil.'},
    {id:'n3',name:'Sarya Feuilleclaire',role:'Éclaireuse elfe',identity:'Une rôdeuse du Bois d’Ardeep qui préfère les preuves aux rumeurs.',wants:'Identifier le camp principal du clan Dent-Cassée.',fears:'Que les humains de Daggerford incendient une partie du bois pour déloger les gobelins.',knows:'Les pillards utilisent le vieux moulin comme relais.',hides:'Elle a laissé partir un jeune gobelin qui refusait de combattre.',trait:'Interrompt parfois une conversation pour écouter un bruit lointain.'},
    {id:'n4',name:'Borin Barbegrise',role:'Marchand nain',identity:'Un marchand obstiné dont le chariot contient plus de secrets que de marchandises ordinaires.',wants:'Récupérer sa fille Lysa et sauver sa cargaison.',fears:'Que les PJ découvrent qu’il transportait aussi des objets non déclarés.',knows:'Les gobelins cherchent une carte trouvée dans un vieux coffre acheté à Waterdeep.',hides:'Une seconde moitié de la carte est cousue dans sa veste.',trait:'Jure par Moradin dès qu’on touche à ses affaires.'}
  ],
  secrets:[
    {id:'c1',title:'Deux moitiés de carte',text:'La carte des contrebandiers a été séparée en deux morceaux ; Borin possède encore la seconde moitié.',revealed:false,revealedAt:null,method:''},
    {id:'c2',title:'Le moulin est un relais',text:'Le Vieux Moulin d’Ardeep n’est pas le camp principal mais un poste de surveillance et de transfert.',revealed:false,revealedAt:null,method:''},
    {id:'c3',title:'Un informateur au relais',text:'Quelqu’un renseigne les gobelins sur les caravanes qui quittent le Relais de la Lune Brisée.',revealed:false,revealedAt:null,method:''},
    {id:'c4',title:'La captive est vivante',text:'Lysa est encore vivante et les gobelins veulent l’échanger contre le reste de la carte.',revealed:false,revealedAt:null,method:''},
    {id:'c5',title:'Skarz cherche des armes',text:'Le chef gobelours pense que la cache contient des armes et de l’or capables de renforcer son clan.',revealed:false,revealedAt:null,method:''},
    {id:'c6',title:'Ancien chemin sous les racines',text:'Une vieille piste de contrebandiers traverse le Bois d’Ardeep sans passer par la route principale.',revealed:false,revealedAt:null,method:''},
    {id:'c7',title:'La patrouille arrive tard',text:'Des renforts de Daggerford sont en route mais ne seront pas là avant demain matin.',revealed:false,revealedAt:null,method:''},
    {id:'c8',title:'Le clan n’est pas uni',text:'Plusieurs gobelins suivent Skarz par peur et pourraient fuir ou négocier si sa position faiblit.',revealed:false,revealedAt:null,method:''},
    {id:'c9',title:'La cache est piégée',text:'Les contrebandiers ont protégé l’accès final avec un mécanisme simple mais dangereux.',revealed:false,revealedAt:null,method:''},
    {id:'c10',title:'Le symbole de Tymora',text:'Un ancien signe gravé près de la cache indique un passage sûr que Frère Edran peut reconnaître.',revealed:false,revealedAt:null,method:''}
  ],
  threats:[
    {id:'t1',name:'Éclaireurs gobelins',type:'ordinary',summary:'Deux ou trois gobelins observent, harcèlent puis se replient vers un terrain favorable.',notes:'Menace mobile.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'t2',name:'Worg affamé',type:'ordinary',summary:'Un worg dressé suit une piste ou bloque une retraite.',notes:'Menace physique simple.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'t3',name:'Chamane Dent-Cassée',type:'ordinary',summary:'Un gobelin superstitieux utilise fumée, clochettes et magie mineure pour soutenir les pillards.',notes:'Soutien.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'t4',name:'Skarz le Briseur',type:'serious',summary:'Un gobelours rusé qui préfère obtenir la carte sans perdre inutilement ses guerriers.',notes:'Adversaire sérieux.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'t5',name:'Effondrement de galerie',type:'event',summary:'Une vieille galerie ou un plancher fragilisé cède au pire moment.',notes:'Événement dangereux.',used:false,injected:false,activeInjected:false,injectedLocationId:null}
  ],
  situations:[
    {id:'s1',text:'Un messager gobelin arrive en pensant parler à un allié.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'s2',text:'Une caravane apeurée exige une escorte immédiate vers Daggerford.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'s3',text:'La captive laisse discrètement tomber un objet personnel sur la piste.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'s4',text:'Un gobelin blessé propose des informations en échange de sa liberté.',used:false,injected:false,activeInjected:false,injectedLocationId:null},
    {id:'s5',text:'Un orage brutal transforme les chemins du bois en bourbier.',used:false,injected:false,activeInjected:false,injectedLocationId:null}
  ],
  rewards:[
    {id:'r1',type:'Ressource',text:'50 po, provisions et matériel de voyage récupérés sur les pillards.',used:false},
    {id:'r2',type:'Information',text:'Une carte des anciens chemins autour de Daggerford et du Bois d’Ardeep.',used:false},
    {id:'r3',type:'Faveur / contact',text:'Borin et Mara deviennent des contacts fiables pour de futures aventures sur la Côte des Épées.',used:false}
  ],
  blanks:[
    {id:'b1',prompt:'Qui renseigne réellement les gobelins depuis le relais ?',resolution:'',resolved:false},
    {id:'b2',prompt:'Que contient exactement la cache en plus de l’or attendu ?',resolution:'',resolved:false}
  ],
  pins:[],
  journal:[
    {id:'jd10',type:'question',text:'Le groupe se demande qui renseigne réellement les gobelins depuis le relais ; aucune réponse définitive n’a encore été trouvée.',locationId:'l2',createdAt:'2026-09-13T18:33:00+02:00'},
    {id:'jd9',type:'canon',text:'Le jeune gobelin épargné se nomme Rikk. Il affirme que plusieurs membres du clan Dent-Cassée obéissent à Skarz uniquement par peur.',locationId:'l2',createdAt:'2026-09-13T18:29:00+02:00'},
    {id:'jd8',type:'loot',text:'Le groupe récupère le fragment de carte dissimulé dans la doublure d’un sac de grain ainsi que 18 po et deux fioles d’huile.',locationId:'l2',createdAt:'2026-09-13T18:24:00+02:00'},
    {id:'jd7',type:'decision',text:'Tuskhan accepte de laisser partir un gobelin blessé en échange de l’emplacement approximatif de Lysa et d’un mot de passe utilisé par les sentinelles.',locationId:'l2',createdAt:'2026-09-13T18:17:00+02:00'},
    {id:'jd6',type:'secret',text:'Secret révélé (Interrogatoire) : Le moulin est un relais — le camp principal de Skarz se trouve plus profondément dans le bois.',locationId:'l2',createdAt:'2026-09-13T18:08:00+02:00'},
    {id:'jd5',type:'location',text:'Les PJ quittent le relais et atteignent le Vieux Moulin d’Ardeep en contournant la route principale.',locationId:'l2',createdAt:'2026-09-13T17:52:00+02:00'},
    {id:'jd4',type:'quote',text:'Mara Vell : « Si vous suivez la grande route, eux vous verront venir. Le vieux chemin du moulin est plus discret. »',locationId:'l1',createdAt:'2026-09-13T17:31:00+02:00'},
    {id:'jd3',type:'lead',text:'Silas repère trois séries de traces quittant la route vers le nord ainsi qu’un morceau de corde marqué du symbole Dent-Cassée.',locationId:'l1',createdAt:'2026-09-13T17:23:00+02:00'},
    {id:'jd2',type:'decision',text:'Le groupe choisit de sécuriser Borin avant de poursuivre les ravisseurs ; Pik stabilise le marchand pendant que Silas inspecte les traces autour du chariot.',locationId:'l1',createdAt:'2026-09-13T17:14:00+02:00'},
    {id:'jd1',type:'location',text:'Strong Start joué — le chariot de Borin s’est écrasé devant le relais et les PJ ont décidé d’aider immédiatement.',locationId:'l1',createdAt:'2026-09-13T17:06:00+02:00'}
  ]
};

const EMPTY=()=>({version:'2.0.4',title:'Nouvelle session',view:'prep',activeLocationId:null,previewLocationId:null,contextTab:'npcs',libraryTab:'secrets',sessionStartedAt:null,sessionTimer:{elapsedMs:0,running:false,startedAt:null},lastAutoBackupAt:null,saveSlotId:null,players:[],thread:{goal:'',steps:[]},strongStart:{text:'',used:false},locations:[],npcs:[],secrets:[],threats:[],situations:[],rewards:[],blanks:[],pins:[],journal:[]});

let state=load();
let history=[];
let editingLocationId=null;
let editingNpcId=null;
let genericContext={type:null,id:null};
let revealPendingId=null;
let saveTimer=null;
let spotlightEditingId=null;
let spotlightFlashId=null;
let recentlyRevealedSecretId=null;
let homeOpen=true;
let pendingImportedSession=null;
let locationBackgroundDraft='';
let locationBackgroundDbPromise=null;
let liveBackgroundRenderToken=0;
let locationBackgroundImportToken=0;
let activeMusicLocationId=null;
let sessionTimerInterval=null;

function normalize(s){
  const base=EMPTY(), out={...base,...s};
  for(const k of ['players','locations','npcs','secrets','threats','situations','rewards','blanks','pins','journal','ambiences'])if(!Array.isArray(out[k]))out[k]=[];
  out.thread=out.thread&&typeof out.thread==='object'?out.thread:base.thread;
  if(!Array.isArray(out.thread.steps))out.thread.steps=[];
  out.strongStart=out.strongStart&&typeof out.strongStart==='object'?out.strongStart:base.strongStart;
  const rawTimer=out.sessionTimer&&typeof out.sessionTimer==='object'?out.sessionTimer:{};
  out.sessionTimer={elapsedMs:Math.max(0,Number(rawTimer.elapsedMs)||0),running:!!rawTimer.running,startedAt:Number.isFinite(Number(rawTimer.startedAt))?Number(rawTimer.startedAt):null};
  if(!out.sessionStartedAt){out.sessionTimer={elapsedMs:0,running:false,startedAt:null}}
  if(out.sessionTimer.running&&!out.sessionTimer.startedAt)out.sessionTimer.startedAt=Date.now();
  out.version=APP_VERSION;
  if(!out.previewLocationId)out.previewLocationId=out.activeLocationId||out.locations[0]?.id||null;
  if(out.contextTab==='threats')out.contextTab='rhythm';
  if(!['npcs','secrets','rhythm','pins'].includes(out.contextTab))out.contextTab='npcs';
  out.players.forEach(p=>{
    if(!Array.isArray(p.spotlightIdeas))p.spotlightIdeas=p.spotlight?[p.spotlight]:[];
    p.spotlightCount=Math.max(0,Number.isFinite(Number(p.spotlightCount))?Number(p.spotlightCount):(p.done?1:0));
    delete p.done; delete p.spotlight;
  });
  out.locations.forEach(l=>{l.npcIds=Array.isArray(l.npcIds)?l.npcIds:[];l.visuals=Array.isArray(l.visuals)?l.visuals:[];l.spotifyUrl=String(l.spotifyUrl||'').trim();if(!l.status)l.status='unvisited'});
  out.secrets.forEach(s=>{s.revealed=!!s.revealed;s.method=s.method||''});
  out.situations.forEach(x=>{if(typeof x.injected!=='boolean')x.injected=!!x.used;if(typeof x.activeInjected!=='boolean')x.activeInjected=!!x.injected;if(!x.injectedLocationId)x.injectedLocationId=x.injected?(out.activeLocationId||null):null});
  out.threats.forEach(x=>{if(typeof x.injected!=='boolean')x.injected=!!x.used;if(typeof x.activeInjected!=='boolean')x.activeInjected=!!x.injected;if(!x.injectedLocationId)x.injectedLocationId=x.injected?(out.activeLocationId||null):null});
  return out;
}
function load(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw)return normalize(JSON.parse(raw));
    for(const key of LEGACY_KEYS){const legacy=localStorage.getItem(key);if(legacy){const migrated=normalize(JSON.parse(legacy));localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated));return migrated}}
  }catch(e){console.warn(e)}
  return normalize(EMPTY());
}
function persist(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  if(state.saveSlotId){const list=getSavedSessions(),idx=list.findIndex(x=>x.id===state.saveSlotId);if(idx>=0){list[idx]={...list[idx],name:state.title||list[idx].name,updatedAt:nowStamp(),state:clone(state)};setSavedSessions(list)}}
  const stamp=new Date();
  const el=$('#saveStatus');if(el)el.innerHTML=`${uiIcon('coche','ui-icon status-ui-icon')} <span>Sauvegardé ${stamp.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>`;
  maybeAutoBackup(stamp.getTime());
}
function snapshot(){history.push(JSON.stringify(state));if(history.length>50)history.shift()}
function commit(mut,msg){snapshot();mut();persist();render();if(msg)toast(msg)}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200)}
function activeLocation(){return state.locations.find(l=>l.id===state.activeLocationId)||null}
function previewLocation(){return state.locations.find(l=>l.id===state.previewLocationId)||activeLocation()||state.locations[0]||null}
function locationName(id){return state.locations.find(l=>l.id===id)?.name||'Hors lieu'}
function initials(name=''){return name.split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'?'}
function fmtTime(iso){try{return new Date(iso).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}catch{return ''}}
function statusLabel(l){return l.status==='current'?'ACTUEL':l.status==='visited'?'VISITÉ':'À EXPLORER'}
function threatTypeLabel(t){return t==='ordinary'?'ORDINAIRE':t==='serious'?'SÉRIEUX':'ÉVÉNEMENT'}
function getBackups(){try{const raw=localStorage.getItem(BACKUP_KEY);if(raw)return JSON.parse(raw);for(const key of LEGACY_BACKUP_KEYS){const legacy=localStorage.getItem(key);if(legacy){const parsed=JSON.parse(legacy);localStorage.setItem(BACKUP_KEY,JSON.stringify(parsed));return parsed}}return []}catch{return []}}
function setBackups(v){localStorage.setItem(BACKUP_KEY,JSON.stringify(v.slice(0,5)))}
function getSavedSessions(){try{const raw=localStorage.getItem(SAVED_SESSIONS_KEY);if(raw)return JSON.parse(raw);for(const key of LEGACY_SAVED_SESSIONS_KEYS){const legacy=localStorage.getItem(key);if(legacy){const parsed=JSON.parse(legacy);localStorage.setItem(SAVED_SESSIONS_KEY,JSON.stringify(parsed));return parsed}}return []}catch{return []}}
function setSavedSessions(v){
  const demos=v.filter(x=>x?.builtInDemo).slice(0,1),users=v.filter(x=>!x?.builtInDemo).slice(0,MAX_SAVED_SESSIONS);
  localStorage.setItem(SAVED_SESSIONS_KEY,JSON.stringify([...demos,...users]));
}
function ensureDemoSavedSession(){
  const list=getSavedSessions(),entry={id:'demo-forgotten-realms',name:'Démo · Le Relais de la Lune Brisée',updatedAt:nowStamp(),builtInDemo:true,state:clone({...DEMO,saveSlotId:null})},idx=list.findIndex(x=>x.id==='demo-forgotten-realms');
  if(idx>=0)list[idx]=entry;else list.unshift(entry);
  setSavedSessions(list);
}

function createBackup(reason='Automatique'){
  const backups=getBackups();backups.unshift({id:uid('bk'),createdAt:nowStamp(),reason,state:clone(state)});setBackups(backups);
  state.lastAutoBackupAt=Date.now();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}
function maybeAutoBackup(now=Date.now()){
  if(!state.sessionStartedAt)return;
  if(!state.lastAutoBackupAt||now-state.lastAutoBackupAt>=AUTO_BACKUP_MS)createBackup('Auto 30 min');
}

function currentSessionElapsedMs(){
  const t=state.sessionTimer||{elapsedMs:0,running:false,startedAt:null};
  return Math.max(0,(Number(t.elapsedMs)||0)+(t.running&&t.startedAt?Math.max(0,Date.now()-Number(t.startedAt)):0));
}
function formatSessionDuration(ms){const total=Math.max(0,Math.floor(ms/1000)),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),sec=total%60;return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`}
function updateSessionTimerDisplay(){const display=$('#sessionTimerDisplay');if(display)display.textContent=formatSessionDuration(currentSessionElapsedMs())}
function syncSessionTimerTicker(){clearInterval(sessionTimerInterval);sessionTimerInterval=null;if(state.sessionStartedAt&&state.sessionTimer?.running){sessionTimerInterval=setInterval(updateSessionTimerDisplay,1000)}}
function renderSessionTimer(){
  const wrap=$('#sessionTimer'),toggle=$('#btnSessionTimer'),stop=$('#btnStopSessionTimer');if(!wrap||!toggle||!stop)return;
  const visible=!!state.sessionStartedAt;wrap.classList.toggle('hidden',!visible);if(!visible){clearInterval(sessionTimerInterval);sessionTimerInterval=null;return}
  const paused=!state.sessionTimer?.running;wrap.classList.toggle('paused',paused);toggle.classList.toggle('paused',paused);toggle.title=paused?'Reprendre le compteur':'Mettre le compteur en pause';toggle.setAttribute('aria-label',toggle.title);stop.classList.toggle('hidden',!paused);updateSessionTimerDisplay();syncSessionTimerTicker();
}
function ensureSessionTimerRunning(){
  state.sessionTimer=state.sessionTimer&&typeof state.sessionTimer==='object'?state.sessionTimer:{elapsedMs:0,running:false,startedAt:null};
  if(!state.sessionTimer.running){state.sessionTimer.running=true;state.sessionTimer.startedAt=Date.now()}
}
function toggleSessionTimer(){
  if(!state.sessionStartedAt)return;
  state.sessionTimer=state.sessionTimer||{elapsedMs:0,running:false,startedAt:null};
  if(state.sessionTimer.running){state.sessionTimer.elapsedMs=currentSessionElapsedMs();state.sessionTimer.running=false;state.sessionTimer.startedAt=null}else{state.sessionTimer.running=true;state.sessionTimer.startedAt=Date.now()}
  persist();renderSessionTimer();
}
function requestSessionTimerReset(){if(!state.sessionStartedAt||state.sessionTimer?.running)return;$('#timerResetDialog').showModal()}
function resetSessionTimer(){state.sessionTimer={elapsedMs:0,running:false,startedAt:null};persist();renderSessionTimer();$('#timerResetDialog').close();toast('Compteur remis à zéro')}

function render(){
  state=normalize(state);
  $('#sessionTitle').value=state.title||'';
  renderPlayers();renderPrep();renderTable();renderLibrary();renderJournal();if(state.view==='illustrations')renderIllustrations();renderBackupButton();renderHome();const launch=$('#btnLaunchSession');if(launch)launch.innerHTML=`${uiIcon('jouer','ui-icon button-ui-icon')} ${state.sessionStartedAt?'Reprendre la table':'Lancer la session'}`;renderSessionTimer();switchView(state.view||'prep',false);
}
function switchView(view,persistView=true){
  const valid=['prep','table','library','journal','illustrations'];if(!valid.includes(view))view='prep';const previous=state.view;state.view=view;
  for(const v of valid)$(`#${v}View`).classList.toggle('hidden',v!==view);
  $$('.nav-btn[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  if(previous==='illustrations'&&view!=='illustrations')cleanupIllustrationObjectUrls();
  if(view==='illustrations')renderIllustrations();
  if(persistView)persist();
}

function renderPlayers(){
  const el=$('#playerRibbon');
  document.documentElement.style.setProperty('--players-h','60px');
  const indexed=state.players.map((p,i)=>({p,i})).sort((a,b)=>(b.p.spotlightCount||0)-(a.p.spotlightCount||0)||a.i-b.i);
  const counts=indexed.map(x=>x.p.spotlightCount||0),max=counts.length?Math.max(...counts):0;
  const chips=indexed.map(({p})=>{
    const count=p.spotlightCount||0,gap=max-count;
    let rank='';if(max>0&&count===max)rank='leader';else if(gap>=5)rank='lag-red';else if(gap>=2)rank='lag-orange';
    const flash=spotlightFlashId===p.id?' spotlight-flash':'';
    return `<div class="player-chip ${rank}${flash}" data-player-id="${p.id}"><button class="spotlight-star" data-add-spotlight="${p.id}" title="Ajouter un moment de spotlight">${uiIcon('spotlight','ui-icon spotlight-ui-icon')}</button><button class="player-main" data-open-spotlight="${p.id}"><strong>${esc(p.name)}</strong><span class="spotlight-count">${count}</span></button></div>`;
  }).join('');
  el.innerHTML=`<div class="player-chips">${chips||'<span class="player-empty">Aucun PJ</span>'}</div><div class="player-tools"><button id="btnEditPlayers" class="ghost ui-icon-button" title="Gérer les joueurs" aria-label="Gérer les joueurs">${uiIcon('groupe','ui-icon player-tools-ui-icon')}</button></div>`;
  $$('[data-add-spotlight]').forEach(b=>b.onclick=e=>{e.stopPropagation();incrementSpotlight(b.dataset.addSpotlight)});
  $$('[data-open-spotlight]').forEach(b=>b.onclick=()=>openSpotlightDialog(b.dataset.openSpotlight));
  $('#btnEditPlayers').onclick=openPlayersEditor;
}
function incrementSpotlight(id){
  spotlightFlashId=id;
  commit(()=>{const p=state.players.find(x=>x.id===id);if(p)p.spotlightCount=(p.spotlightCount||0)+1},null);
  setTimeout(()=>{if(spotlightFlashId===id){spotlightFlashId=null;renderPlayers()}},3000);
}
function openSpotlightDialog(id){
  const p=state.players.find(x=>x.id===id);if(!p)return;spotlightEditingId=id;$('#spotlightDialogTitle').textContent=p.name;$('#spotlightDialogCount').textContent=`${p.spotlightCount||0} moment${(p.spotlightCount||0)>1?'s':''} de spotlight comptabilisé${(p.spotlightCount||0)>1?'s':''}`;renderSpotlightIdeaRows(p.spotlightIdeas||[]);$('#spotlightDialog').showModal();
}
function renderSpotlightIdeaRows(ideas){
  const box=$('#spotlightIdeaRows');box.innerHTML='';(ideas.length?ideas:['']).forEach(text=>addSpotlightIdeaRow(text));
}
function addSpotlightIdeaRow(text=''){
  const row=document.createElement('div');row.className='spotlight-idea-row';row.innerHTML=`<textarea rows="2" data-spotlight-idea placeholder="Situation, thème ou élément à mettre en valeur…">${esc(text)}</textarea><button type="button" class="danger" title="Supprimer cette ligne">×</button>`;row.querySelector('button').onclick=()=>row.remove();$('#spotlightIdeaRows').appendChild(row);
}

function renderPrep(){renderThreadCard();renderStrongCard();renderPrepLocations();renderPrepSecrets();renderPrepResources();renderPrepSituations()}
function renderThreadCard(){
  const steps=state.thread.steps||[];
  $('#threadCard').innerHTML=`<div class="thread-goal">${esc(state.thread.goal||'Définis ce que cherche la force active.')}</div><div class="thread-steps">${steps.length?steps.map((s,i)=>`<div class="thread-step ${s.done?'done':''}"><button data-toggle-thread="${s.id}">${s.done?'✓':i+1}</button><span>${esc(s.text)}</span></div>`).join(''):'<div class="empty-mini">Aucune conséquence préparée.</div>'}</div>`;
  $$('[data-toggle-thread]').forEach(b=>b.onclick=()=>commit(()=>{const s=state.thread.steps.find(x=>x.id===b.dataset.toggleThread);if(s)s.done=!s.done},'Fil rouge mis à jour'));
}
function renderStrongCard(){const s=state.strongStart;$('#strongCard').innerHTML=`<div class="${s.used?'strong-used':''}"><div class="strong-copy">${esc(s.text||'Une situation immédiatement active, puis : « Que faites-vous ? »')}</div><div class="strong-status"><span class="eyebrow">${s.used?'JOUÉ':'PRÊT'}</span>${s.used?`<button id="btnResetStrong" class="ghost">${uiIcon('actualiser','ui-icon button-ui-icon')} Réinitialiser</button>`:''}</div></div>`;if($('#btnResetStrong'))$('#btnResetStrong').onclick=()=>commit(()=>state.strongStart.used=false,'Strong Start réinitialisé')}

function renderPrepLocations(){
  const main=state.locations.filter(l=>l.tier!=='reserve'),reserve=state.locations.filter(l=>l.tier==='reserve');
  const lane=(title,arr)=>`<div class="location-lane"><div class="location-lane-head"><strong>${title}</strong><span>${arr.length}</span></div>${arr.length?arr.map(l=>`<button class="location-tile ${esc(l.status)}" data-edit-location="${l.id}"><span class="location-status">${statusLabel(l)}</span><strong>${esc(l.name)}</strong><small>${esc(l.concept||l.situation||'Lieu à développer')}</small></button>`).join(''):'<div class="empty-mini">Aucun lieu.</div>'}</div>`;
  $('#prepLocations').innerHTML=lane('PRINCIPAUX',main)+lane('RÉSERVE',reserve);$$('[data-edit-location]').forEach(b=>b.onclick=()=>openLocationEditor(b.dataset.editLocation));
}
function renderPrepSecrets(){
  const un=state.secrets.filter(s=>!s.revealed);$('#prepSecrets').innerHTML=un.length?un.slice(0,10).map(s=>`<button class="prep-secret" data-edit-secret="${s.id}"><strong>${esc(s.title)}</strong><span>${esc(s.text)}</span></button>`).join(''):'<div class="empty-card">Ajoute 8 à 10 informations flottantes.</div>';
  $('#prepSecretCount').textContent=`${un.length} flottant${un.length>1?'s':''}`;$$('[data-edit-secret]').forEach(b=>b.onclick=()=>openGenericEditor('secret',b.dataset.editSecret));
}
function renderPrepResources(){
  const resources=[['npcs','PNJ',state.npcs.length],['threats','Menaces',state.threats.filter(x=>!x.injected).length],['situations','Situations',state.situations.filter(x=>!x.injected).length],['rewards','Récompenses',state.rewards.filter(x=>!x.used).length],['blanks','Blancs',state.blanks.filter(x=>!x.resolved).length]];
  $('#prepResources').innerHTML=resources.map(([tab,label,count])=>`<button class="resource-summary" data-open-resource="${tab}"><strong>${count}</strong><span>${label}</span></button>`).join('');
  $$('[data-open-resource]').forEach(b=>b.onclick=()=>{state.libraryTab=b.dataset.openResource;switchView('library');renderLibrary()});
}
function renderPrepSituations(){
  const arr=state.situations;$('#situationsCard').innerHTML=arr.length?arr.slice(0,5).map(s=>`<button class="ammo-line ${s.injected?'injected':''}" data-edit-situation="${s.id}"><span>${s.injected?'✓':'○'}</span><span>${esc(s.text)}</span></button>`).join(''):'<div class="empty-mini">Aucune situation.</div>';
  $$('[data-edit-situation]').forEach(b=>b.onclick=()=>openGenericEditor('situation',b.dataset.editSituation));
}

function renderTable(){renderTableStrongStart();renderTableLocations();renderTableThread();renderLiveLocation(previewLocation());renderContextPanel()}
function renderTableStrongStart(){const b=$('#tableStrongStart'),s=state.strongStart;if(s.used){b.classList.add('hidden');b.onclick=null;return}b.classList.remove('hidden');b.innerHTML=`<span class="eyebrow">STRONG START</span><strong>${uiIcon('etoile','ui-icon inline-ui-icon strong-start-ui-icon')} ${esc(s.text||'Aucun Strong Start préparé.')}</strong>`;b.onclick=openStrongStartPlay}
function renderTableLocations(){
  const main=state.locations.filter(l=>l.tier!=='reserve'),reserve=state.locations.filter(l=>l.tier==='reserve');
  const group=(label,arr)=>`<span class="eyebrow rail-label">${label}</span>${arr.map(l=>`<button class="rail-location ${esc(l.status)} ${state.previewLocationId===l.id?'previewing':''}" data-preview-location="${l.id}"><strong>${esc(l.name)}</strong><small>${esc(l.concept||l.situation||'')}</small><span class="marker">${l.status==='current'?uiIcon('marqueur_carte','ui-icon marker-ui-icon'):l.status==='visited'?uiIcon('coche','ui-icon marker-ui-icon'):'○'}</span></button>`).join('')}`;
  $('#tableLocationList').innerHTML=state.locations.length?group('PRINCIPAUX',main)+group('RÉSERVE',reserve):'<div class="empty-mini">Aucun lieu.</div>';
  $$('[data-preview-location]').forEach(b=>b.onclick=()=>{state.previewLocationId=b.dataset.previewLocation;persist();renderTable()});
}
function renderLiveLocation(l){
  renderLocationBackground(l?.backgroundImage);
  const el=$('#liveLocationContent');if(!l){el.innerHTML=`<div class="live-empty"><div><span class="eyebrow">TABLE</span><h2>Aucun lieu</h2><button id="emptyLocationBtn" class="primary">${uiIcon('plus','ui-icon button-ui-icon')} Créer un lieu</button></div></div>`;$('#emptyLocationBtn').onclick=()=>openLocationEditor();return}
  const isCurrent=l.id===state.activeLocationId, visuals=l.visuals||[], npcs=(l.npcIds||[]).map(id=>state.npcs.find(n=>n.id===id)).filter(Boolean);
  const sit=state.situations.filter(x=>x.injected&&x.injectedLocationId===l.id),thr=state.threats.filter(x=>x.injected&&x.injectedLocationId===l.id);
  const npcStrip=npcs.length?`<div class="live-npc-strip"><span class="eyebrow">PNJ PRÉSENTS</span><div class="live-npc-list">${npcs.map(n=>`<button class="live-npc" data-live-npc="${n.id}"><span class="avatar">${initials(n.name)}</span><strong>${esc(n.name)}</strong></button>`).join('')}</div></div>`:'';
  const injections=(sit.length||thr.length)?`<div class="live-injections"><div class="injection-strip">${thr.map(t=>`<button class="injection-chip threat ${t.activeInjected?'active':'inactive'}" data-toggle-injection="threat:${t.id}"><span class="eyebrow injection-label">MENACE INJECTÉE</span><b>${uiIcon('point_exclamation','ui-icon inline-ui-icon')} ${esc(t.name)}</b><small>${esc(t.summary||'')}</small></button>`).join('')}${sit.map(s=>`<button class="injection-chip situation ${s.activeInjected?'active':'inactive'}" data-toggle-injection="situation:${s.id}"><span class="eyebrow injection-label">SITUATION INJECTÉE</span><b>${uiIcon('etoile','ui-icon inline-ui-icon')} ${esc(s.text)}</b></button>`).join('')}</div></div>`:'';
  const musicButton=l.spotifyUrl?`<button id="btnLocationMusic" class="location-music-btn ${activeMusicLocationId===l.id?'active':''}" aria-label="Lancer le son Spotify de ${esc(l.name)}" title="Lancer la musique / ambiance"><img src="music-note.png" alt=""></button>`:'';
  el.innerHTML=`<div class="live-hero"><div><span class="eyebrow">${isCurrent?'LIEU ACTUEL':'APERÇU · LE JEU EST AILLEURS'}</span><div class="live-title-row">${musicButton}<h2>${esc(l.name)}</h2></div><p class="concept">${esc(l.concept||'')}</p>${npcStrip}</div><div class="live-actions">${!isCurrent?`<button id="btnMakeCurrent" class="primary">${uiIcon('marqueur_carte','ui-icon button-ui-icon')} Rendre actuel</button><button id="btnReturnCurrent" class="ghost">${uiIcon('fleche_gauche','ui-icon button-ui-icon')} Actuel</button>`:''}<button id="btnEditPreview" class="ghost edit-pencil" aria-label="Modifier le lieu" title="Modifier le lieu">${uiIcon('crayon','ui-icon edit-ui-icon')}</button></div></div>${injections}
  <div class="live-core">
    <article><h3>Qu’est-ce qu’on voit ?</h3>${visuals.length?`<ul>${visuals.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:'<p class="muted">À improviser.</p>'}</article>
    <article class="impulse"><h3>Impulsion</h3><p>${esc(l.impulse||'Comment ce lieu tend-il à agir ?')}</p></article>
    <article class="wide"><h3>Qu’est-ce qui se passe ?</h3><p>${esc(l.situation||'Aucune situation préparée.')}</p></article>
    <article><h3>Danger</h3><p>${esc(l.danger||'—')}</p></article>
    <article><h3>À obtenir</h3><p>${esc(l.reward||'—')}</p></article>
    <article class="wide consequence"><h3>Si les PJ n’agissent pas</h3><p>${esc(l.ifIgnored||'Le lieu reste stable pour le moment.')}</p></article>
  </div>
  <details class="location-context"><summary>Contexte du lieu</summary><div class="context-grid">${l.faction?`<div><b>Faction</b><p>${esc(l.faction)}</p></div>`:''}${l.localPlot?`<div><b>Local</b><p>${esc(l.localPlot)}</p></div>`:''}${l.regionalPlot?`<div><b>Régional</b><p>${esc(l.regionalPlot)}</p></div>`:''}${l.mainPlot?`<div><b>Fil rouge</b><p>${esc(l.mainPlot)}</p></div>`:''}</div></details>`;
  $('#btnEditPreview').onclick=()=>openLocationEditor(l.id);if($('#btnMakeCurrent'))$('#btnMakeCurrent').onclick=()=>makeCurrentLocation(l.id);if($('#btnReturnCurrent'))$('#btnReturnCurrent').onclick=()=>{state.previewLocationId=state.activeLocationId;persist();renderTable()};
  const musicBtn=$('#btnLocationMusic');if(musicBtn)musicBtn.onclick=()=>{const url=String(l.spotifyUrl||'').trim();if(!/^(https?:\/\/|spotify:)/i.test(url))return toast('Lien Spotify invalide');activeMusicLocationId=l.id;musicBtn.classList.add('active');const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';document.body.appendChild(a);a.click();a.remove()};
  $$('[data-live-npc]').forEach(b=>b.onclick=()=>showNpcSheet(b.dataset.liveNpc));$$('[data-toggle-injection]').forEach(b=>b.onclick=()=>toggleInjectedHighlight(b.dataset.toggleInjection));
}
function renderTableThread(){
  const el=$('#tableThread');if(!el)return;
  const steps=state.thread.steps||[];
  el.innerHTML=`<div class="table-thread-goal">${esc(state.thread.goal||'Aucune direction définie.')}</div><div class="table-thread-steps">${steps.length?steps.map((step,i)=>`<div class="table-thread-step ${step.done?'done':''}"><button data-table-thread="${step.id}">${step.done?'✓':i+1}</button><span>${esc(step.text)}</span></div>`).join(''):'<div class="empty-mini">Aucune conséquence préparée.</div>'}</div>`;
  $$('[data-table-thread]').forEach(b=>b.onclick=()=>commit(()=>{const step=state.thread.steps.find(x=>x.id===b.dataset.tableThread);if(step)step.done=!step.done},'Fil rouge mis à jour'));
}
function renderContextPanel(){
  const current=activeLocation(),ids=current?.npcIds||[],allNpcs=state.npcs,secrets=state.secrets,threats=state.threats;
  const counts={npcs:ids.length,secrets:secrets.filter(s=>!s.revealed).length,rhythm:state.situations.filter(x=>!x.injected).length+threats.filter(t=>!t.injected).length,pins:state.pins.length};
$$('.context-tab').forEach(b=>{b.classList.toggle('active',b.dataset.context===state.contextTab);const c=b.querySelector('i');if(c)c.textContent=counts[b.dataset.context]||0});
  const el=$('#contextContent');
  if(state.contextTab==='npcs'){
    el.innerHTML=`<div class="context-toolbar"><span>${current?esc(current.name):'Aucun lieu actuel'} · ${ids.length} présent${ids.length>1?'s':''}</span><button id="btnCreateNpc" class="primary">${uiIcon('plus','ui-icon button-ui-icon')} Créer</button></div>${allNpcs.length?allNpcs.map(n=>{const here=ids.includes(n.id);return `<div class="context-card npc-row ${here?'present':''}"><button class="npc-row-main" data-show-npc="${n.id}"><span class="avatar">${initials(n.name)}</span><span><strong>${esc(n.name)}</strong><small>${esc(n.role||'PNJ')}</small></span></button><button class="npc-location-toggle ${here?'here':''}" data-toggle-location-npc="${n.id}">${here?'✓ Ici':'+ Ici'}</button></div>`}).join(''):'<div class="empty-mini">Aucun PNJ. Crée-en un à la volée.</div>'}`;
    $$('[data-show-npc]').forEach(b=>b.onclick=()=>showNpcSheet(b.dataset.showNpc));$$('[data-toggle-location-npc]').forEach(b=>b.onclick=()=>toggleNpcAtCurrentLocation(b.dataset.toggleLocationNpc));$('#btnCreateNpc').onclick=()=>openNpcEditor();
  }else if(state.contextTab==='secrets'){
    el.innerHTML=secrets.length?secrets.map(s=>{const revealed=!!s.revealed,recent=recentlyRevealedSecretId===s.id;return `<div class="context-card secret ${revealed?'revealed':''} ${recent?'recently-revealed':''}"><div class="secret-copy"><strong>${esc(s.title)}</strong><small>${esc(s.text)}</small>${revealed?`<span class="secret-method-badge">${methodIcon(s.method)} ${esc(s.method||'Révélé')}</span>`:''}</div>${revealed?'':revealPendingId===s.id?`<div class="reveal-methods"><button data-secret-method="${s.id}|Conversation" title="Conversation">${uiIcon('bulle_dialogue','ui-icon reveal-ui-icon')}</button><button data-secret-method="${s.id}|Observation" title="Observation">${uiIcon('oeil','ui-icon reveal-ui-icon')}</button><button data-secret-method="${s.id}|Document" title="Document">${uiIcon('parchemin','ui-icon reveal-ui-icon')}</button><button data-secret-method="${s.id}|Magie" title="Magie">${uiIcon('magie','ui-icon reveal-ui-icon')}</button><button data-secret-method="${s.id}|Déduction des joueurs" title="Déduction">${uiIcon('cerveau','ui-icon reveal-ui-icon')}</button><button data-secret-method="${s.id}|Autre" title="Autre">${uiIcon('etoile','ui-icon reveal-ui-icon')}</button></div>`:`<button class="primary reveal-btn" data-start-reveal="${s.id}">◆ Révéler</button>`}</div>`}).join(''):'<div class="empty-mini">Aucun secret préparé.</div>';
    $$('[data-start-reveal]').forEach(b=>b.onclick=()=>{revealPendingId=b.dataset.startReveal;renderContextPanel()});$$('[data-secret-method]').forEach(b=>b.onclick=()=>{const [id,method]=b.dataset.secretMethod.split('|');revealSecret(id,method)});
  }else if(state.contextTab==='rhythm'){
    const row=(kind,item,label,detail='')=>`<button type="button" class="rhythm-row ${kind} ${item.injected?'injected':''}" data-rhythm-kind="${kind}" data-rhythm-id="${esc(item.id)}" aria-pressed="${!!item.injected}" title="${item.injected?'Rendre disponible':'Injecter dans le lieu actuel'}"><span class="rhythm-state" aria-hidden="true">${item.injected?'✓':'○'}</span><span>${kind==='threat'?`<strong>${esc(label)}</strong><small>${esc(detail)}</small>`:esc(label)}</span></button>`;
    const situationRows=state.situations.map(x=>row('situation',x,x.text)).join('')||'<div class="empty-mini">Aucune situation.</div>';
    const threatRows=threats.map(t=>row('threat',t,t.name,t.summary||'')).join('')||'<div class="empty-mini">Aucune menace.</div>';
    el.innerHTML=`<div class="context-toolbar rhythm-toolbar"><span>Appuyer pour injecter · Appuyer de nouveau pour restaurer</span></div><section class="rhythm-section"><h3>SITUATIONS</h3>${situationRows}</section><section class="rhythm-section"><h3>MENACES</h3>${threatRows}</section>`;
    $$('[data-rhythm-kind]').forEach(b=>b.onclick=()=>toggleLibraryInjection(b.dataset.rhythmKind,b.dataset.rhythmId));
  }else{
    el.innerHTML=`<div class="context-toolbar"><span>Informations sous les yeux</span><button id="btnAddPin" class="ghost ui-icon-button" aria-label="Épingler une information">${uiIcon('plus','ui-icon button-ui-icon')}</button></div>${state.pins.length?state.pins.map(p=>`<div class="pin-item"><span>${uiIcon('epingle','ui-icon inline-ui-icon')}</span><span>${esc(p.text)}</span><button data-remove-pin="${p.id}">×</button></div>`).join(''):'<div class="empty-mini">Rien d’épinglé.</div>'}`;
    $('#btnAddPin').onclick=()=>openGenericEditor('pin');$$('[data-remove-pin]').forEach(b=>b.onclick=()=>commit(()=>state.pins=state.pins.filter(p=>p.id!==b.dataset.removePin),null));
  }
}
function toggleNpcAtCurrentLocation(id){const l=activeLocation();if(!l)return toast('Choisis d’abord un lieu actuel');commit(()=>{l.npcIds=Array.isArray(l.npcIds)?l.npcIds:[];l.npcIds=l.npcIds.includes(id)?l.npcIds.filter(x=>x!==id):[...l.npcIds,id]},null)}
function makeCurrentLocation(id){
  const next=state.locations.find(l=>l.id===id);if(!next)return;if(state.activeLocationId===id)return toast('Ce lieu est déjà actuel');
  commit(()=>{const prev=activeLocation();if(prev&&prev.id!==id)prev.status='visited';next.status='current';state.activeLocationId=id;state.previewLocationId=id;state.journal.unshift({id:uid('j'),type:'location',text:`Le jeu se déplace vers ${next.name}.`,locationId:id,createdAt:nowStamp()})},`Lieu actuel : ${next.name}`);
}
function openStrongStartPlay(){if(state.strongStart.used)return;$('#strongStartPlayText').textContent=state.strongStart.text||'Aucun Strong Start préparé.';$('#strongStartPlayDialog').showModal()}
function playStrongStart(){if(state.strongStart.used)return;commit(()=>{const startsSession=!state.sessionStartedAt;state.strongStart.used=true;if(startsSession)state.sessionStartedAt=nowStamp();if(startsSession||(!state.sessionTimer?.running&&!(state.sessionTimer?.elapsedMs>0)))ensureSessionTimerRunning();state.journal.unshift({id:uid('j'),type:'location',text:'Strong Start joué — la session commence.',locationId:state.activeLocationId,createdAt:nowStamp()})},'Strong Start joué');$('#strongStartPlayDialog').close();playSessionStartFx()}
function hideSessionStartFx(){const fx=$('#sessionStartFx');if(!fx)return;fx.classList.remove('show');fx.setAttribute('aria-hidden','true');clearTimeout(playSessionStartFx._t)}
function playSessionStartFx(){const fx=$('#sessionStartFx');if(!fx)return;fx.classList.add('show');fx.setAttribute('aria-hidden','false');clearTimeout(playSessionStartFx._t);playSessionStartFx._t=setTimeout(hideSessionStartFx,5500)}
function methodIcon(method){const map={'Conversation':'bulle_dialogue','Observation':'oeil','Document':'parchemin','Magie':'magie','Déduction des joueurs':'cerveau','Autre':'etoile'};const icon=map[method]||'etoile';return uiIcon(icon,'ui-icon inline-ui-icon method-ui-icon');}
function revealSecret(id,method){const s=state.secrets.find(x=>x.id===id);if(!s||s.revealed)return;recentlyRevealedSecretId=id;commit(()=>{s.revealed=true;s.revealedAt=nowStamp();s.method=method;state.journal.unshift({id:uid('j'),type:'secret',text:`Secret révélé (${method}) : ${s.title} — ${s.text}`,locationId:state.activeLocationId,createdAt:nowStamp()})},'Secret révélé');revealPendingId=null;setTimeout(()=>{if(recentlyRevealedSecretId===id){recentlyRevealedSecretId=null;renderContextPanel()}},4000)}
function injectItem(type,id){const arr=type==='threat'?state.threats:state.situations,item=arr.find(x=>x.id===id);if(!item)return;if(item.injected){toast('Déjà injectée');return}const loc=activeLocation();if(!loc)return toast('Choisis d’abord un lieu actuel');commit(()=>{item.injected=true;item.activeInjected=true;item.injectedLocationId=loc.id;item.injectedAt=nowStamp();item.used=true},type==='threat'?'Menace injectée':'Situation injectée');renderInjection()}
function makeInjectionAvailable(type,id){const arr=type==='threat'?state.threats:state.situations,item=arr.find(x=>x.id===id);if(!item||!item.injected)return;commit(()=>{item.injected=false;item.activeInjected=false;item.injectedLocationId=null;item.injectedAt=null;item.used=false},type==='threat'?'Menace rendue disponible':'Situation rendue disponible')}
function toggleLibraryInjection(type,id){const arr=type==='threat'?state.threats:state.situations,item=arr.find(x=>x.id===id);if(!item)return;if(item.injected)makeInjectionAvailable(type,id);else injectItem(type,id)}
function toggleInjectedHighlight(token){const [type,id]=token.split(':'),arr=type==='threat'?state.threats:state.situations,item=arr.find(x=>x.id===id);if(!item)return;commit(()=>item.activeInjected=!item.activeInjected,null)}

function showNpcSheet(id){
  const n=state.npcs.find(x=>x.id===id);if(!n)return;$('#npcSheetContent').innerHTML=`<div class="sheet-head"><div class="avatar big">${initials(n.name)}</div><div><span class="eyebrow">PNJ</span><h2>${esc(n.name)}</h2><p>${esc(n.role||'')}</p></div></div><div class="npc-facts"><section><b>IDENTITÉ</b><p>${esc(n.identity||'—')}</p></section><section><b>VEUT</b><p>${esc(n.wants||'—')}</p></section><section><b>CRAINT</b><p>${esc(n.fears||'—')}</p></section><section><b>SAIT</b><p>${esc(n.knows||'—')}</p></section><section><b>CACHE</b><p>${esc(n.hides||'—')}</p></section><section><b>TRAIT DE JEU</b><p>${esc(n.trait||'—')}</p></section></div><div class="sheet-actions"><button id="btnPinNpc" class="ghost">${uiIcon('epingle','ui-icon button-ui-icon')} Épingler</button><button id="btnEditNpcFromSheet" class="ghost">Modifier</button></div>`;$('#sheetScrim').classList.remove('hidden');$('#npcSheet').classList.add('open');$('#btnPinNpc').onclick=()=>commit(()=>state.pins.push({id:uid('pi'),text:`${n.name} — ${n.wants||n.role||''}`}),`${n.name} épinglé`);$('#btnEditNpcFromSheet').onclick=()=>{closeNpcSheet();openNpcEditor(id)}}
function closeNpcSheet(){$('#npcSheet').classList.remove('open');$('#sheetScrim').classList.add('hidden')}

function openLocationEditor(id=null){
  editingLocationId=id;const l=id?state.locations.find(x=>x.id===id):{name:'',tier:'main',concept:'',visuals:[],impulse:'',situation:'',faction:'',localPlot:'',regionalPlot:'',mainPlot:'',danger:'',reward:'',ifIgnored:'',spotifyUrl:''};setLocationBackgroundDraft(l.backgroundImage||'');$('#locationBackgroundFile').value='';const f=$('#locationForm');for(const k of ['name','tier','concept','impulse','situation','faction','localPlot','regionalPlot','mainPlot','danger','reward','ifIgnored','spotifyUrl'])f.elements[k].value=l[k]||'';f.elements.visuals.value=(l.visuals||[]).join('\n');$('#locationDialogTitle').textContent=id?`Modifier · ${l.name}`:'Nouveau lieu vivant';$('#btnDeleteLocation').classList.toggle('hidden',!id);updateLocationEditorMode();$('#locationDialog').showModal();
}
function updateLocationEditorMode(){const tier=$('#locationForm').elements.tier.value;$('#mainLocationFields').classList.toggle('hidden',tier==='reserve');$('#locationEditorHint').textContent=tier==='reserve'?'Réserve : nom, concept et situation suffisent.':'Principal : prépare seulement ce qui aide à improviser.'}
function openNpcEditor(id=null){editingNpcId=id;const n=id?state.npcs.find(x=>x.id===id):{name:'',role:'',identity:'',wants:'',fears:'',knows:'',hides:'',trait:''};const f=$('#npcForm');for(const k of ['name','role','identity','wants','fears','knows','hides','trait'])f.elements[k].value=n[k]||'';$('#npcDialogTitle').textContent=id?`Modifier · ${n.name}`:'Nouveau PNJ';$('#btnDeleteNpc').classList.toggle('hidden',!id);$('#npcDialog').showModal()}
function openThreadEditor(){const f=$('#threadForm');f.elements.goal.value=state.thread.goal||'';f.elements.steps.value=(state.thread.steps||[]).map(x=>x.text).join('\n');$('#threadDialog').showModal()}
function openStrongEditor(){const f=$('#strongForm');f.elements.text.value=state.strongStart.text||'';$('#strongDialog').showModal()}
function openPlayersEditor(){const box=$('#playersEditor');box.innerHTML='';(state.players.length?state.players:[{id:uid('p'),name:'',spotlightIdeas:[],spotlightCount:0}]).forEach(p=>addPlayerRow(p));$('#playersDialog').showModal()}
function addPlayerRow(p={id:uid('p'),name:'',spotlightIdeas:[],spotlightCount:0}){const row=document.createElement('div');row.className='player-editor-row';row.dataset.playerId=p.id;row.innerHTML=`<input data-pname placeholder="Nom" value="${esc(p.name)}"><button type="button" title="Supprimer ce joueur">×</button>`;row.querySelector('button').onclick=()=>row.remove();$('#playersEditor').appendChild(row)}

const genericDefs={
  ambience:{eyebrow:'AMBIANCE',title:'Ambiance',collection:'ambiences',fields:[{name:'name',label:'Nom de l’ambiance',type:'input'},{name:'spotifyUrl',label:'Lien Spotify',type:'input',span:2}]},
  secret:{eyebrow:'SECRET / INDICE',title:'Secret flottant',collection:'secrets',fields:[{name:'title',label:'Titre',type:'input'},{name:'text',label:'Information importante',type:'textarea',span:2}]},
  threat:{eyebrow:'MENACE',title:'Menace',collection:'threats',fields:[{name:'name',label:'Nom',type:'input'},{name:'type',label:'Type',type:'select',options:[['ordinary','Ordinaire'],['serious','Adversaire sérieux'],['event','Événement dangereux']]},{name:'summary',label:'Ce qu’elle met en jeu',type:'textarea',span:2},{name:'notes',label:'Note de pilotage',type:'textarea',span:2}]},
  situation:{eyebrow:'SITUATION',title:'Situation potentielle',collection:'situations',fields:[{name:'text',label:'Situation possible',type:'textarea',span:2}]},
  reward:{eyebrow:'RÉCOMPENSE',title:'Récompense',collection:'rewards',fields:[{name:'type',label:'Type',type:'select',options:[['Ressource','Argent / ressource'],['Information','Information'],['Objet / faveur / contact','Objet / faveur / contact']]},{name:'text',label:'Récompense',type:'textarea'}]},
  blank:{eyebrow:'BLANC VOLONTAIRE',title:'Question laissée ouverte',collection:'blanks',fields:[{name:'prompt',label:'Ce qui reste indéterminé',type:'textarea',span:2},{name:'resolution',label:'Si la partie a fourni une réponse, laquelle ?',type:'textarea',span:2}]},
  pin:{eyebrow:'ÉPINGLE',title:'Information à garder sous les yeux',collection:'pins',fields:[{name:'text',label:'Information',type:'textarea',span:2}]}
};
function openGenericEditor(type,id=null){const def=genericDefs[type];if(!def)return;genericContext={type,id};const arr=state[def.collection],item=id?arr.find(x=>x.id===id):null;$('#genericEyebrow').textContent=def.eyebrow;$('#genericDialogTitle').textContent=id?`Modifier · ${def.title}`:def.title;$('#genericFields').innerHTML=def.fields.map(f=>{const v=item?.[f.name]??'',cls=f.span===2?'span2':'';if(f.type==='select')return `<label class="${cls}">${esc(f.label)}<select name="${f.name}">${f.options.map(o=>`<option value="${esc(o[0])}" ${String(v)===o[0]?'selected':''}>${esc(o[1])}</option>`).join('')}</select></label>`;if(f.type==='textarea')return `<label class="${cls}">${esc(f.label)}<textarea name="${f.name}" rows="4">${esc(v)}</textarea></label>`;return `<label class="${cls}">${esc(f.label)}<input name="${f.name}" value="${esc(v)}" required></label>`}).join('');$('#btnDeleteGeneric').classList.toggle('hidden',!id);$('#genericDialog').showModal()}

function libraryToolbar(tab){
  const defs={
    ambiences:{label:'Ambiances',type:'ambience'},
    secrets:{label:'Secret',type:'secret'},
    npcs:{label:'PNJ',type:'npc',importKind:'npc'},
    locations:{label:'Lieu',type:'location',importKind:'location'},
    threats:{label:'Menace',type:'threat'},
    situations:{label:'Situation',type:'situation'},
    rewards:{label:'Récompense',type:'reward'},
    blanks:{label:'Blanc',type:'blank'}
  },d=defs[tab];if(!d)return '';
  return `<div class="component-toolbar"><div><span class="eyebrow">COMPOSANTS</span><strong>${esc(d.label)}${tab==='npcs'||tab==='locations'?'s':''}</strong></div><div class="component-toolbar-actions"><button class="primary" data-create-component="${d.type}">${uiIcon('plus','ui-icon button-ui-icon')} ${esc(d.label)}</button>${d.importKind?`<button class="ghost" data-import-component="${d.importKind}">${uiIcon('fleche_bas','ui-icon button-ui-icon')} Importer</button>`:''}</div></div>`;
}
function renderLibrary(){
  $$('.library-tab').forEach(b=>b.classList.toggle('active',b.dataset.library===state.libraryTab));const el=$('#libraryContent'),tab=state.libraryTab;let html='';
  if(tab==='ambiences')html=state.ambiences.map(a=>`<article class="library-card"><header><h3>${esc(a.name)}</h3></header><footer>${ambiencePlayButton(a)}<button data-edit-generic="ambience:${esc(a.id)}">Modifier</button></footer></article>`).join('');
  if(tab==='secrets')html=state.secrets.map(s=>`<article class="library-card ${s.revealed?'revealed-secret':''}"><header><div><h3>${esc(s.title)}</h3><div class="subtitle">${s.revealed?`${methodIcon(s.method)} RÉVÉLÉ · ${esc(s.method||'')}`:'SECRET FLOTTANT'}</div></div><span>${s.revealed?'✓':'○'}</span></header><p>${esc(s.text)}</p><footer>${!s.revealed?`<button class="primary" data-lib-reveal="${s.id}">Révéler</button>`:''}<button data-edit-secret="${s.id}">Modifier</button></footer></article>`).join('');
  if(tab==='npcs')html=state.npcs.map(n=>`<article class="library-card"><header><div><h3>${esc(n.name)}</h3><div class="subtitle">${esc(n.role||'PNJ')}</div></div><span>${initials(n.name)}</span></header><p><strong>Veut :</strong> ${esc(n.wants||'—')}<br><strong>Craint :</strong> ${esc(n.fears||'—')}<br><strong>Sait :</strong> ${esc(n.knows||'—')}<br><strong>Cache :</strong> ${esc(n.hides||'—')}</p><footer><button data-show-npc="${n.id}">Voir</button><button data-edit-npc="${n.id}">Modifier</button></footer></article>`).join('');
  if(tab==='locations')html=state.locations.map(l=>`<article class="library-card"><header><div><h3>${esc(l.name)}</h3><div class="subtitle">${l.tier==='reserve'?'RÉSERVE':'PRINCIPAL'} · ${statusLabel(l)}</div></div><span>◈</span></header><p><strong>Concept :</strong> ${esc(l.concept||'—')}<br><strong>Situation :</strong> ${esc(l.situation||'—')}</p><footer><button data-open-location="${l.id}">Voir en Table</button><button data-edit-location-lib="${l.id}">Modifier</button></footer></article>`).join('');
  if(tab==='threats')html=state.threats.map(t=>`<article class="library-card ${t.injected?'revealed-secret':''}"><header><div><h3>${esc(t.name)}</h3><div class="subtitle">${threatTypeLabel(t.type)} · ${t.injected?'INJECTÉE':'DISPONIBLE'}</div></div><span>${t.injected?'✓':'○'}</span></header><p>${esc(t.summary||'')}</p><footer><button class="${t.injected?'ghost':'primary'}" data-toggle-used="threat:${t.id}">${t.injected?`${uiIcon('actualiser','ui-icon button-ui-icon')} Rendre disponible`:`${uiIcon('eclair','ui-icon button-ui-icon')} Injecter`}</button><button data-edit-generic="threat:${t.id}">Modifier</button></footer></article>`).join('');
  if(tab==='situations')html=state.situations.map(x=>`<article class="library-card ${x.injected?'revealed-secret':''}"><header><div><h3>Situation</h3><div class="subtitle">${x.injected?'INJECTÉE':'DISPONIBLE'}</div></div><span>${x.injected?'✓':'○'}</span></header><p>${esc(x.text||'')}</p><footer><button class="${x.injected?'ghost':'primary'}" data-toggle-used="situation:${x.id}">${x.injected?`${uiIcon('actualiser','ui-icon button-ui-icon')} Rendre disponible`:`${uiIcon('eclair','ui-icon button-ui-icon')} Injecter`}</button><button data-edit-generic="situation:${x.id}">Modifier</button></footer></article>`).join('');
  if(tab==='rewards')html=state.rewards.map(r=>`<article class="library-card"><header><div><h3>${esc(r.type)}</h3><div class="subtitle">${r.used?'ATTRIBUÉE':'DISPONIBLE'}</div></div></header><p>${esc(r.text)}</p><footer><button data-toggle-used="reward:${r.id}">${r.used?'Réouvrir':'Utilisée'}</button><button data-edit-generic="reward:${r.id}">Modifier</button></footer></article>`).join('');
  if(tab==='blanks')html=state.blanks.map(b=>`<article class="library-card"><header><div><h3>${esc(b.prompt)}</h3><div class="subtitle">${b.resolved?'DEVENU CANON':'INDÉTERMINÉ'}</div></div></header><p>${b.resolved?esc(b.resolution):'La partie peut fournir la réponse.'}</p><footer><button data-edit-generic="blank:${b.id}">${b.resolved?'Modifier':'Définir'}</button></footer></article>`).join('');
  el.innerHTML=`${libraryToolbar(tab)}<div class="library-grid">${html||'<div class="journal-empty">Aucun élément.</div>'}</div>`;bindLibraryActions();
}
function bindLibraryActions(){
  bindAmbiencePlayback();
  $$('[data-create-component]').forEach(b=>b.onclick=()=>{const type=b.dataset.createComponent;if(type==='npc')openNpcEditor();else if(type==='location')openLocationEditor();else openGenericEditor(type)});
  $$('[data-import-component]').forEach(b=>b.onclick=()=>openComponentImport(b.dataset.importComponent));
  $$('[data-edit-secret]').forEach(b=>b.onclick=()=>openGenericEditor('secret',b.dataset.editSecret));
  $$('[data-edit-npc]').forEach(b=>b.onclick=()=>openNpcEditor(b.dataset.editNpc));
  $$('[data-show-npc]').forEach(b=>b.onclick=()=>showNpcSheet(b.dataset.showNpc));
  $$('[data-edit-location-lib]').forEach(b=>b.onclick=()=>openLocationEditor(b.dataset.editLocationLib));
  $$('[data-open-location]').forEach(b=>b.onclick=()=>{state.previewLocationId=b.dataset.openLocation;persist();switchView('table');renderTable()});
  $$('[data-edit-generic]').forEach(b=>b.onclick=()=>{const [type,id]=b.dataset.editGeneric.split(':');openGenericEditor(type,id)});
  $$('[data-toggle-used]').forEach(b=>b.onclick=()=>{const [type,id]=b.dataset.toggleUsed.split(':');if(type==='threat'||type==='situation')toggleLibraryInjection(type,id);else commit(()=>{const item=state.rewards.find(x=>x.id===id);if(item)item.used=!item.used},null)});
  $$('[data-lib-reveal]').forEach(b=>b.onclick=()=>{state.contextTab='secrets';revealPendingId=b.dataset.libReveal;switchView('table');renderTable()});
}
function renderJournal(){
  const icon={note:uiIcon('plume','ui-icon inline-ui-icon'),decision:'⚑',quote:'💬',question:'❓',death:'💀',loot:'🎁',lead:'🔗',secret:'◆',location:'◈',canon:uiIcon('etoile','ui-icon inline-ui-icon')};
  $('#journalContent').innerHTML=state.journal.length?state.journal.map(j=>`<article class="journal-entry"><time>${fmtTime(j.createdAt)}</time><div><strong>${icon[j.type]||uiIcon('plume','ui-icon inline-ui-icon')} ${esc(locationName(j.locationId))}</strong><p>${esc(j.text)}</p></div><div class="journal-entry-side"><small>${new Date(j.createdAt).toLocaleDateString('fr-FR')}</small><div class="journal-entry-actions"><button class="ghost" data-edit-journal="${j.id}" title="Modifier cette ligne" aria-label="Modifier cette ligne">${uiIcon('crayon','ui-icon edit-ui-icon small-edit-ui-icon')}</button><button class="ghost journal-delete" data-delete-journal="${j.id}" title="Effacer cette ligne" aria-label="Effacer cette ligne">×</button></div></div></article>`).join(''):'<div class="journal-empty">Rien n’est encore devenu canon.</div>';
  $$('[data-edit-journal]').forEach(b=>b.onclick=()=>editJournalEntry(b.dataset.editJournal));
  $$('[data-delete-journal]').forEach(b=>b.onclick=()=>deleteJournalEntry(b.dataset.deleteJournal));
}
function editJournalEntry(id){
  const item=state.journal.find(j=>j.id===id);if(!item)return;
  const next=prompt('Modifier cette ligne du journal :',item.text);if(next===null)return;
  const text=String(next).trim();if(!text)return toast('La ligne ne peut pas être vide');
  commit(()=>item.text=text,'Ligne du journal modifiée');
}
function deleteJournalEntry(id){
  const item=state.journal.find(j=>j.id===id);if(!item)return;
  if(!confirm('Effacer cette ligne du journal ?'))return;
  commit(()=>state.journal=state.journal.filter(j=>j.id!==id),'Ligne du journal effacée');
}
function journalTypeLabel(type){return ({note:'Note',decision:'Décision',quote:'Citation',question:'Question ouverte',death:'Mort / chute',loot:'Butin / récompense',lead:'Piste',secret:'Secret révélé',location:'Déplacement / lieu',canon:'Canon'})[type]||'Note'}
function safeTextFileName(value){return String(value||'Résumé').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').trim().slice(0,120)||'Résumé'}
async function exportJournal(){
  if(!state.journal.length)return toast('Le journal est vide');
  const chronological=[...state.journal].sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0));
  const firstDate=chronological[0]?.createdAt||state.sessionStartedAt||nowStamp(),dateLabel=new Date(firstDate).toLocaleDateString('fr-FR'),title=`Résumé - ${state.title||'Session sans titre'} - ${dateLabel}`;
  const players=(state.players||[]).map(p=>p.name).filter(Boolean).join(', ')||'Non renseignés';
  const lines=[title,'='.repeat(title.length),'',`Session : ${state.title||'Session sans titre'}`,`Date de référence : ${dateLabel}`,`Personnages : ${players}`,`Entrées du journal : ${chronological.length}`,'',"JOURNAL CHRONOLOGIQUE",'----------------------',''];
  chronological.forEach((j,i)=>{const d=new Date(j.createdAt),stamp=Number.isNaN(d.getTime())?'Date inconnue':d.toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}),place=locationName(j.locationId);lines.push(`${i+1}. ${stamp} — ${place} — ${journalTypeLabel(j.type)}`);lines.push(j.text);lines.push('')});
  lines.push('---');lines.push('Ce document reprend l’intégralité du journal de Cockpit dans l’ordre chronologique. Il peut servir de source pour rédiger le compte rendu détaillé de la session.');
  const text=lines.join('\n'),name=`${safeTextFileName(title)}.txt`,file=new File([text],name,{type:'text/plain;charset=utf-8'});
  try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title,files:[file]});toast('Résumé du journal prêt à enregistrer');return}}catch(err){if(err?.name==='AbortError')return;console.warn(err)}
  downloadBlob(name,file);toast('Journal exporté');
}

function renderQuickNoteHistory(){
  const el=$('#quickNoteHistory');if(!el)return;
  const noteTypes=new Set(['note','decision','quote','question','death','loot','lead']);
  const arr=state.journal.filter(j=>noteTypes.has(j.type));
  const icon={note:uiIcon('plume','ui-icon inline-ui-icon'),decision:'⚑',quote:'💬',question:'❓',death:'💀',loot:'🎁',lead:'🔗'};
  el.innerHTML=arr.length?arr.map(j=>`<article class="note-history-row"><div><span>${icon[j.type]||uiIcon('plume','ui-icon inline-ui-icon')}</span><strong>${esc(j.text)}</strong></div><small>${esc(locationName(j.locationId))} · ${fmtTime(j.createdAt)}</small></article>`).join(''):'<div class="empty-mini">Aucune note écrite pour cette session.</div>';
}
function openQuickNote(){const f=$('#quickNoteForm');f.reset();renderQuickNoteHistory();$('#quickNoteDialog').showModal();setTimeout(()=>f.elements.text.focus(),50)}
function renderBackupButton(){const n=getBackups().length;$('#btnBackups').textContent=`Backups de sécurité${n?` · ${n}`:''}`}
function openBackups(){$('#moreMenu').classList.add('hidden');const b=getBackups();$('#backupList').innerHTML=b.length?b.map(x=>`<div class="backup-row"><div><strong>${esc(x.reason)}</strong><small>${new Date(x.createdAt).toLocaleString('fr-FR')}</small></div><button data-restore-backup="${x.id}" class="ghost">Restaurer</button></div>`).join(''):'<div class="empty-mini">Aucun backup.</div>';$$('[data-restore-backup]').forEach(btn=>btn.onclick=()=>{const x=getBackups().find(z=>z.id===btn.dataset.restoreBackup);if(!x)return;if(confirm('Restaurer ce backup ?')){snapshot();state=normalize(clone(x.state));persist();render();$('#backupsDialog').close();toast('Backup restauré')}});$('#backupsDialog').showModal()}
function userSavedSessions(){return getSavedSessions().filter(x=>!x.builtInDemo)}
function openSessions(){$('#moreMenu').classList.add('hidden');$('#sessionSaveName').value=state.title||'';$('#saveChoicePanel').classList.add('hidden');renderSavedSessions();$('#sessionsDialog').showModal()}
function renderSavedSessions(){
  const list=getSavedSessions(),users=list.filter(x=>!x.builtInDemo),count=$('#sessionSlotCount');if(count)count.textContent=`${users.length} / ${MAX_SAVED_SESSIONS} sauvegardes`;
  $('#savedSessionsList').innerHTML=list.length?list.map(s=>`<article class="saved-session-row ${state.saveSlotId===s.id?'current-slot':''}"><div><span class="session-state ${s.builtInDemo?'demo':s.state?.sessionStartedAt?'running':'prepared'}">${s.builtInDemo?'DÉMO ROYAUMES OUBLIÉS':s.state?.sessionStartedAt?'PARTIE EN COURS':'PRÉPARÉE'}</span><strong>${esc(s.name)}</strong><small>${s.builtInDemo?'Modèle standard prêt à tester':`${state.saveSlotId===s.id?'EMPLACEMENT ACTUEL · ':''}Mis à jour ${new Date(s.updatedAt).toLocaleString('fr-FR')}`}</small></div><div class="saved-session-actions"><button data-load-session="${s.id}" class="primary">${s.builtInDemo?'Charger':'Reprendre'}</button>${s.builtInDemo?'':`<button data-export-saved-session="${s.id}" class="violet">Exporter</button><button data-delete-session="${s.id}" class="danger" title="Supprimer">×</button>`}</div></article>`).join(''):'<div class="empty-mini">Aucune session sauvegardée.</div>';
  $$('[data-load-session]').forEach(b=>b.onclick=()=>loadSavedSession(b.dataset.loadSession));
  $$('[data-export-saved-session]').forEach(b=>b.onclick=()=>exportSavedSessionSlot(b.dataset.exportSavedSession));
  $$('[data-delete-session]').forEach(b=>b.onclick=()=>deleteSavedSession(b.dataset.deleteSession));
}
function openSaveChoices(){
  const panel=$('#saveChoicePanel'),users=userSavedSessions(),current=users.find(x=>x.id===state.saveSlotId),canCreate=users.length<MAX_SAVED_SESSIONS;
  panel.innerHTML=`<div class="save-choice-head"><div><span class="eyebrow">DESTINATION</span><strong>Où sauvegarder l’état actuel ?</strong></div><span>${users.length}/${MAX_SAVED_SESSIONS}</span></div><div class="save-choice-actions">${current?`<button class="primary" data-save-current-slot="${current.id}">${uiIcon('actualiser','ui-icon button-ui-icon')} Mettre à jour « ${esc(current.name)} »</button>`:''}<button class="${canCreate?'primary':'ghost'}" data-save-new-slot ${canCreate?'':'disabled'}>${uiIcon('plus','ui-icon button-ui-icon')} Nouvelle sauvegarde ${canCreate?`(${MAX_SAVED_SESSIONS-users.length} emplacement${MAX_SAVED_SESSIONS-users.length>1?'s':''} libre${MAX_SAVED_SESSIONS-users.length>1?'s':''})`:'— 15/15'}</button></div>${users.length?`<div class="save-overwrite-title">Ou écraser une sauvegarde existante</div><div class="save-overwrite-list">${users.map(x=>`<button data-overwrite-slot="${x.id}"><strong>${esc(x.name)}</strong><small>${new Date(x.updatedAt).toLocaleString('fr-FR')}</small></button>`).join('')}</div>`:''}`;
  panel.classList.remove('hidden');
  if(current)panel.querySelector('[data-save-current-slot]').onclick=()=>saveCurrentSession(current.id,false);
  const add=panel.querySelector('[data-save-new-slot]');if(add&&!add.disabled)add.onclick=()=>saveCurrentSession(null,true);
  $$('[data-overwrite-slot]').forEach(b=>b.onclick=()=>{const target=users.find(x=>x.id===b.dataset.overwriteSlot);if(target&&confirm(`Écraser la sauvegarde « ${target.name} » avec l’état actuel ?`))saveCurrentSession(target.id,false)});
}
function saveCurrentSession(targetId=null,createNew=false){
  const name=$('#sessionSaveName').value.trim()||state.title||'Session sans titre',list=getSavedSessions(),users=list.filter(x=>!x.builtInDemo);
  if(createNew&&users.length>=MAX_SAVED_SESSIONS)return toast('15 sauvegardes déjà utilisées');
  const id=createNew||!targetId?uid('ss'):targetId,entry={id,name,updatedAt:nowStamp(),state:clone({...state,saveSlotId:id,title:name})},idx=list.findIndex(x=>x.id===id);
  if(idx>=0)list[idx]=entry;else list.push(entry);state.saveSlotId=id;state.title=name;setSavedSessions(list);persist();$('#saveChoicePanel').classList.add('hidden');renderSavedSessions();toast(idx>=0?'Sauvegarde écrasée':'Nouvel emplacement créé');
}
function loadSavedSession(id){const entry=getSavedSessions().find(x=>x.id===id);if(!entry)return;snapshot();state=normalize(clone(entry.state));state.saveSlotId=entry.builtInDemo?null:id;persist();closeHome();render();$('#sessionsDialog').close();toast(entry.builtInDemo?'Démo chargée — sauvegarde-la sous ton propre nom si tu veux la conserver':state.sessionStartedAt?'Partie reprise':'Préparation chargée')}
function deleteSavedSession(id){if(!confirm('Supprimer cette session sauvegardée ?'))return;setSavedSessions(getSavedSessions().filter(x=>x.id!==id));if(state.saveSlotId===id)state.saveSlotId=null;persist();$('#saveChoicePanel').classList.add('hidden');renderSavedSessions()}
function launchSession(){const first=!state.sessionStartedAt;createBackup(first?'Début de session':'Reprise de session');commit(()=>{state.sessionStartedAt=state.sessionStartedAt||nowStamp();if(first||(!state.sessionTimer?.running&&!(state.sessionTimer?.elapsedMs>0)))ensureSessionTimerRunning();state.lastAutoBackupAt=Date.now();state.view='table';if(first)state.players.forEach(p=>p.spotlightCount=0)},first?'Session prête à jouer':'Session reprise');switchView('table')}

function isDemoState(s){return !s?.saveSlotId&&String(s?.title||'').startsWith('Démo ·')}
function hasMeaningfulState(s){return !!(s&&!isDemoState(s)&&(s.sessionStartedAt||s.saveSlotId||(s.title&&s.title!=='Nouvelle session')||s.players?.length||s.locations?.length||s.npcs?.length||s.ambiences?.length||s.secrets?.length||s.threats?.length||s.situations?.length||s.rewards?.length||s.journal?.length||s.thread?.goal||s.strongStart?.text))}
function latestSavedResume(){return getSavedSessions().filter(x=>!x.builtInDemo).sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0))[0]||null}
function renderHome(){
  const view=$('#homeView');if(!view)return;view.classList.toggle('hidden',!homeOpen);
  const resume=$('#btnHomeResume'),title=$('#homeResumeTitle');if(!resume||!title)return;
  const current=hasMeaningfulState(state),saved=current?null:latestSavedResume(),can=current||!!saved;
  resume.disabled=!can;title.textContent=current?(state.title||'Session sans titre'):saved?(saved.name||saved.state?.title||'Session sauvegardée'):'Aucune session en cours';
}
function showHome(){homeOpen=true;renderHome()}
function closeHome(){homeOpen=false;renderHome()}
function resumeFromHome(){
  if(hasMeaningfulState(state)){closeHome();switchView(state.sessionStartedAt?'table':'prep');return}
  const saved=latestSavedResume();if(saved)loadSavedSession(saved.id);
}
function archiveCurrentForSafety(){
  if(!hasMeaningfulState(state)||state.saveSlotId)return;
  const list=getSavedSessions(),users=list.filter(x=>!x.builtInDemo),name=state.title||'Session sans titre';
  if(users.length>=MAX_SAVED_SESSIONS){createBackup('Sécurité avant changement de session');return}
  const id=uid('ss');list.push({id,name,updatedAt:nowStamp(),state:clone({...state,saveSlotId:id})});setSavedSessions(list);
}
function createNewSession(name){archiveCurrentForSafety();snapshot();state=normalize(EMPTY());state.title=(name||'').trim()||'Nouvelle session';state.view='prep';persist();closeHome();render();toast('Nouvelle session créée')}
function safeFileName(value){return String(value||'session').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9-_]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70)||'session'}
async function buildExportPayload(sessionState=state){
  sessionState=await embedLocationBackgrounds(sessionState);
  return {format:'cockpit-session',formatVersion:1,appVersion:APP_VERSION,exportedAt:nowStamp(),session:clone({...sessionState,version:APP_VERSION})};
}
function downloadBlob(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
async function exportSession(){
  try{
  const payload=JSON.stringify(await buildExportPayload(),null,2),name=`Cockpit-${safeFileName(state.title)}-${new Date().toISOString().slice(0,10)}.json`,file=new File([payload],name,{type:'application/json'});
  try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:`Sauvegarde Cockpit · ${state.title}`,files:[file]});toast('Sauvegarde prête à enregistrer dans Fichiers');return}}catch(err){if(err?.name==='AbortError')return;console.warn(err)}
  downloadBlob(name,file);toast('Sauvegarde exportée');
  }catch(err){console.error(err);toast('Export impossible : une illustration est indisponible. Réimporte son image avant de réessayer.')}
}
function savedSlotExportPayload(slot){
  const exportedState=normalize(clone(slot.state||EMPTY()));
  exportedState.saveSlotId=null;
  exportedState.title=slot.name||exportedState.title||'Session sauvegardée';
  return buildExportPayload(exportedState);
}
async function exportSavedSessionSlot(id){
  try{
  const slot=getSavedSessions().find(x=>x.id===id&&!x.builtInDemo);if(!slot)return toast('Sauvegarde introuvable');
  const payload=JSON.stringify(await savedSlotExportPayload(slot),null,2),date=new Date().toISOString().slice(0,10),name=`Cockpit-Sauvegarde-${safeFileName(slot.name)}-${date}.json`,file=new File([payload],name,{type:'application/json'});
  try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:`Exporter · ${slot.name}`,files:[file]});toast('Copie externe prête à enregistrer dans Fichiers');return}}catch(err){if(err?.name==='AbortError')return;console.warn(err)}
  downloadBlob(name,file);toast('Sauvegarde exportée');
  }catch(err){console.error(err);toast('Export impossible : une illustration est indisponible. Réimporte son image avant de réessayer.')}
}
function extractImportedSession(parsed){
  const incoming=parsed?.format==='cockpit-session'&&parsed?.session?parsed.session:parsed?.session&&typeof parsed.session==='object'?parsed.session:parsed;
  if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))throw new Error('Format invalide');
  const normalized=normalize(clone(incoming));
  normalized.saveSlotId=null;
  return normalized;
}
function importedSessionName(session,fileName=''){
  const fromState=String(session?.title||'').trim();
  if(fromState)return fromState;
  return String(fileName||'Session importée').replace(/\.(json|cockpit)$/i,'').replace(/^Cockpit-(Sauvegarde-)?/i,'').replace(/[-_]+/g,' ').trim()||'Session importée';
}
function storeImportedSavedSession(session,name,targetId=null){
  const list=getSavedSessions(),users=list.filter(x=>!x.builtInDemo);
  if(!targetId&&users.length>=MAX_SAVED_SESSIONS)return false;
  const id=targetId||uid('ss'),cleanName=String(name||session.title||'Session importée').trim()||'Session importée';
  const prepared=normalize(clone(session));prepared.saveSlotId=id;prepared.title=cleanName;prepared.version=APP_VERSION;
  const entry={id,name:cleanName,updatedAt:nowStamp(),state:clone(prepared)},idx=list.findIndex(x=>x.id===id);
  if(idx>=0)list[idx]=entry;else list.push(entry);
  setSavedSessions(list);
  pendingImportedSession=null;
  $('#saveChoicePanel')?.classList.add('hidden');
  renderSavedSessions();
  toast(idx>=0?'Sauvegarde importée et emplacement remplacé':'Sauvegarde importée');
  return true;
}
function showImportOverwriteChoices(session,name){
  pendingImportedSession={session:clone(session),name};
  const users=userSavedSessions(),panel=$('#saveChoicePanel');
  panel.innerHTML=`<div class="save-choice-head"><div><span class="eyebrow">IMPORT · 15/15</span><strong>Choisir une sauvegarde à remplacer</strong></div><span>${users.length}/${MAX_SAVED_SESSIONS}</span></div><div class="save-overwrite-title">L’import est valide, mais les 15 emplacements sont utilisés.</div><div class="save-overwrite-list">${users.map(x=>`<button data-import-overwrite-slot="${x.id}"><strong>${esc(x.name)}</strong><small>${new Date(x.updatedAt).toLocaleString('fr-FR')}</small></button>`).join('')}</div>`;
  panel.classList.remove('hidden');
  $$('[data-import-overwrite-slot]').forEach(b=>b.onclick=()=>{const target=users.find(x=>x.id===b.dataset.importOverwriteSlot);if(target&&pendingImportedSession&&confirm(`Remplacer « ${target.name} » par « ${pendingImportedSession.name} » ?`))storeImportedSavedSession(pendingImportedSession.session,pendingImportedSession.name,target.id)});
}
async function importSavedSessionPayload(parsed,fileName=''){
  const incoming=await storeLocationBackgrounds(extractImportedSession(parsed)),name=importedSessionName(incoming,fileName);
  if(userSavedSessions().length>=MAX_SAVED_SESSIONS){showImportOverwriteChoices(incoming,name);return {status:'needs-overwrite',name}}
  storeImportedSavedSession(incoming,name);
  return {status:'imported',name};
}
async function importSavedSessionFile(file){
  const parsed=JSON.parse(await file.text());
  return importSavedSessionPayload(parsed,file.name||'');
}
async function importSessionFile(file){
  const parsed=JSON.parse(await file.text()),incoming=await storeLocationBackgrounds(extractImportedSession(parsed));
  archiveCurrentForSafety();snapshot();state=normalize(clone(incoming));state.saveSlotId=null;persist();closeHome();render();toast('Sauvegarde importée');
}

function openComponentImport(kind){if(kind==='npc')$('#npcImportFile').click();else if(kind==='location')$('#locationImportFile').click()}
function parseNpcImport(parsed){
  const raw=Array.isArray(parsed)?parsed:Array.isArray(parsed?.npcs)?parsed.npcs:parsed?.npc?[parsed.npc]:(parsed&&typeof parsed==='object'&&parsed.name?[parsed]:[]);
  return raw.map(n=>({id:uid('n'),name:String(n?.name||'').trim(),role:String(n?.role||'').trim(),identity:String(n?.identity||'').trim(),wants:String(n?.wants||'').trim(),fears:String(n?.fears||'').trim(),knows:String(n?.knows||'').trim(),hides:String(n?.hides||'').trim(),trait:String(n?.trait||'').trim()})).filter(n=>n.name);
}
function parseLocationImport(parsed){
  const raw=Array.isArray(parsed)?parsed:Array.isArray(parsed?.locations)?parsed.locations:parsed?.location?[parsed.location]:(parsed&&typeof parsed==='object'&&parsed.name?[parsed]:[]);
  return raw.map(l=>({id:uid('l'),name:String(l?.name||'').trim(),tier:l?.tier==='reserve'?'reserve':'main',status:'unvisited',concept:String(l?.concept||'').trim(),visuals:Array.isArray(l?.visuals)?l.visuals.map(x=>String(x).trim()).filter(Boolean):lines(l?.visuals),impulse:String(l?.impulse||'').trim(),situation:String(l?.situation||'').trim(),faction:String(l?.faction||'').trim(),localPlot:String(l?.localPlot||'').trim(),regionalPlot:String(l?.regionalPlot||'').trim(),mainPlot:String(l?.mainPlot||'').trim(),danger:String(l?.danger||'').trim(),reward:String(l?.reward||'').trim(),ifIgnored:String(l?.ifIgnored||'').trim(),spotifyUrl:String(l?.spotifyUrl||'').trim(),backgroundImage:safeLocationBackground(l?.backgroundImage),npcIds:[]})).filter(l=>l.name);
}
async function importNpcFile(file){const parsed=JSON.parse(await file.text()),items=parseNpcImport(parsed);if(!items.length)throw new Error('Aucun PNJ valide');commit(()=>{state.npcs.push(...items);state.libraryTab='npcs'},`${items.length} PNJ importé${items.length>1?'s':''}`);if($('#npcDialog')?.open)$('#npcDialog').close();if(state.view==='library')renderLibrary()}
async function importLocationFile(file){const parsed=JSON.parse(await file.text()),items=parseLocationImport(parsed);if(!items.length)throw new Error('Aucun lieu valide');await storeLocationBackgrounds({locations:items});commit(()=>{state.locations.push(...items);state.previewLocationId=items[0].id;state.libraryTab='locations'},`${items.length} lieu${items.length>1?'x':''} importé${items.length>1?'s':''}`);if($('#locationDialog')?.open)$('#locationDialog').close();if(state.view==='library')renderLibrary()}

// ===== V2 · Illustrations locales (IndexedDB, hors sauvegardes JSON) =====
const ILLUSTRATION_DB_NAME='cockpit-illustrations-v2';
const ILLUSTRATION_DB_VERSION=2;
const ILLUSTRATION_STORE='illustrations';
const ILLUSTRATION_META_STORE='meta';
const DEFAULT_ILLUSTRATION_CATEGORIES=[
  ['npc','PNJ'],['adversary','Adversaires'],['location','Lieux'],['object','Objets'],['misc','Divers']
];
let illustrationCategories=[...DEFAULT_ILLUSTRATION_CATEGORIES];
let illustrationCustomCategories=[];
let illustrationDbPromise=null;
let illustrationRecords=[];
let illustrationSelectedIds=new Set();
let illustrationObjectUrls=[];
let pendingIllustrationFiles=[];
let illustrationMoveMode=false;
let illustrationRenderToken=0;
function illustrationCategoryLabel(value){return Object.fromEntries(illustrationCategories)[value]||'Divers'}
function illustrationCategoryOptions(selected='misc'){return illustrationCategories.map(([value,label])=>`<option value="${value}" ${value===selected?'selected':''}>${esc(label)}</option>`).join('')}
function cleanupIllustrationObjectUrls(){illustrationObjectUrls.forEach(url=>URL.revokeObjectURL(url));illustrationObjectUrls=[]}
function openIllustrationDb(){
  if(illustrationDbPromise)return illustrationDbPromise;
  illustrationDbPromise=new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB indisponible'));return}
    const req=indexedDB.open(ILLUSTRATION_DB_NAME,ILLUSTRATION_DB_VERSION);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(ILLUSTRATION_STORE)){const store=db.createObjectStore(ILLUSTRATION_STORE,{keyPath:'id'});store.createIndex('category','category',{unique:false});store.createIndex('createdAt','createdAt',{unique:false})}if(!db.objectStoreNames.contains(ILLUSTRATION_META_STORE))db.createObjectStore(ILLUSTRATION_META_STORE,{keyPath:'key'})};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Impossible d’ouvrir la bibliothèque d’illustrations'));
  });
  return illustrationDbPromise;
}
async function getAllIllustrations(){const db=await openIllustrationDb();return new Promise((resolve,reject)=>{const tx=db.transaction(ILLUSTRATION_STORE,'readonly'),req=tx.objectStore(ILLUSTRATION_STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error)})}
async function getIllustrationCustomCategories(){const db=await openIllustrationDb();return new Promise((resolve,reject)=>{const tx=db.transaction(ILLUSTRATION_META_STORE,'readonly'),req=tx.objectStore(ILLUSTRATION_META_STORE).get('categories');req.onsuccess=()=>resolve(Array.isArray(req.result?.value)?req.result.value:[]);req.onerror=()=>reject(req.error)})}
async function putIllustrationCustomCategories(categories){const db=await openIllustrationDb();return new Promise((resolve,reject)=>{const tx=db.transaction(ILLUSTRATION_META_STORE,'readwrite');tx.objectStore(ILLUSTRATION_META_STORE).put({key:'categories',value:categories});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Enregistrement des catégories interrompu'))})}
async function putIllustrations(records){if(!records.length)return;const db=await openIllustrationDb();return new Promise((resolve,reject)=>{const tx=db.transaction(ILLUSTRATION_STORE,'readwrite'),store=tx.objectStore(ILLUSTRATION_STORE);records.forEach(record=>store.put(record));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Import interrompu'))})}
async function deleteIllustrations(ids){if(!ids.length)return;const db=await openIllustrationDb();return new Promise((resolve,reject)=>{const tx=db.transaction(ILLUSTRATION_STORE,'readwrite'),store=tx.objectStore(ILLUSTRATION_STORE);ids.forEach(id=>store.delete(id));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Suppression interrompue'))})}
function isSupportedIllustrationFile(file){const type=String(file?.type||'').toLowerCase();return type==='image/png'||type==='image/jpeg'||/\.(png|jpe?g)$/i.test(String(file?.name||''))}
function illustrationFileType(file){const type=String(file?.type||'').toLowerCase();if(type==='image/png')return 'image/png';if(type==='image/jpeg')return 'image/jpeg';return /\.png$/i.test(file?.name||'')?'image/png':'image/jpeg'}
function humanFileSize(bytes){const n=Number(bytes)||0;if(n<1024)return `${n} o`;if(n<1024*1024)return `${(n/1024).toFixed(n<10240?1:0)} Ko`;return `${(n/1024/1024).toFixed(1)} Mo`}
function renderIllustrationSelectionMeta(){const count=illustrationSelectedIds.size,meta=$('#illustrationSelectionMeta'),exportButton=$('#btnExportIllustrations'),deleteButton=$('#btnDeleteIllustrations'),moveButton=$('#btnMoveIllustrations'),panel=$('.illustrations-panel');if(!count&&illustrationMoveMode)illustrationMoveMode=false;if(meta)meta.textContent=illustrationMoveMode?'Choisis la catégorie de destination':(count?`${count} sélectionnée${count>1?'s':''}`:'Aucune sélection');if(exportButton){exportButton.disabled=!count;exportButton.innerHTML=`${uiIcon('fleche_haut','ui-icon button-ui-icon')} Exporter${count?` (${count})`:''}`;}if(deleteButton){deleteButton.disabled=!count;deleteButton.textContent=count?`Supprimer (${count})`:'Supprimer'}if(moveButton){moveButton.disabled=!count;moveButton.classList.toggle('active',illustrationMoveMode);moveButton.textContent=illustrationMoveMode?'Annuler déplacement':(count?`Déplacer (${count})`:'Déplacer')}if(panel)panel.classList.toggle('move-mode',illustrationMoveMode)}
async function renderIllustrations(){
  const content=$('#illustrationsContent');if(!content)return;
  const token=++illustrationRenderToken;
  content.innerHTML='<div class="journal-empty">Chargement des illustrations…</div>';
  try{
    const [records,customCategories]=await Promise.all([getAllIllustrations(),getIllustrationCustomCategories()]);if(token!==illustrationRenderToken)return;
    illustrationCustomCategories=customCategories.filter(x=>Array.isArray(x)&&x.length===2&&String(x[0]||'').trim()&&String(x[1]||'').trim());illustrationCategories=[...DEFAULT_ILLUSTRATION_CATEGORIES,...illustrationCustomCategories];
    illustrationRecords=records.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    const validIds=new Set(illustrationRecords.map(x=>x.id));illustrationSelectedIds=new Set([...illustrationSelectedIds].filter(id=>validIds.has(id)));
    cleanupIllustrationObjectUrls();
    const categories=illustrationCategories.map(([value,label],catIndex)=>{
      const arr=illustrationRecords.filter(x=>(x.category||'misc')===value),sentCount=arr.filter(x=>x.sentAt).length;
      const cards=arr.map(item=>{const url=URL.createObjectURL(item.blob);illustrationObjectUrls.push(url);const selected=illustrationSelectedIds.has(item.id);return `<button type="button" class="illustration-card ${item.sentAt?'sent':''} ${selected?'selected':''} ${selected&&illustrationMoveMode?'moving':''}" data-illustration-id="${item.id}" aria-pressed="${selected?'true':'false'}"><img src="${url}" alt="${esc(item.name||label)}"><span class="illustration-card-footer"><strong>${esc(item.name||'Illustration')}</strong><small>${item.sentAt?`Envoyée · ${new Date(item.sentAt).toLocaleDateString('fr-FR')}`:'Jamais envoyée'}</small></span></button>`}).join('')||'<div class="illustration-empty">Aucune illustration dans cette catégorie.</div>';
      return `<details class="illustration-drawer" ${catIndex===0||arr.length?'open':''} data-illustration-drawer="${value}"><summary><span class="illustration-drawer-title"><strong>${label}</strong><span class="illustration-drawer-count">${arr.length}</span></span><span class="illustration-drawer-meta">${sentCount?`${sentCount} envoyée${sentCount>1?'s':''}`:'—'}</span></summary><div class="illustration-grid">${cards}</div></details>`;
    }).join('');
    content.innerHTML=categories;
    $$('[data-illustration-id]').forEach(card=>card.onclick=()=>{const id=card.dataset.illustrationId;if(illustrationSelectedIds.has(id))illustrationSelectedIds.delete(id);else illustrationSelectedIds.add(id);const selected=illustrationSelectedIds.has(id);card.classList.toggle('selected',selected);card.classList.toggle('moving',selected&&illustrationMoveMode);card.setAttribute('aria-pressed',selected?'true':'false');renderIllustrationSelectionMeta()});
    $$('[data-illustration-drawer] > summary').forEach(summary=>summary.onclick=e=>{if(!illustrationMoveMode)return;e.preventDefault();e.stopPropagation();moveSelectedIllustrations(summary.parentElement.dataset.illustrationDrawer)});
    renderIllustrationSelectionMeta();
  }catch(err){console.error('Illustrations',err);content.innerHTML='<div class="journal-empty">La bibliothèque locale d’illustrations n’est pas disponible sur cet appareil.</div>';renderIllustrationSelectionMeta()}
}
function toggleIllustrationMoveMode(){
  if(!illustrationSelectedIds.size)return toast('Sélectionne au moins une illustration');
  illustrationMoveMode=!illustrationMoveMode;renderIllustrationSelectionMeta();
  if(illustrationMoveMode)toast('Choisis la catégorie de destination');
}
async function moveSelectedIllustrations(category){
  if(!illustrationMoveMode||!illustrationSelectedIds.size)return;
  if(!illustrationCategories.some(([value])=>value===category))return;
  const selected=illustrationRecords.filter(item=>illustrationSelectedIds.has(item.id));
  if(!selected.length){illustrationMoveMode=false;renderIllustrationSelectionMeta();return}
  selected.forEach(item=>item.category=category);
  try{
    await putIllustrations(selected);
    const count=selected.length,label=illustrationCategoryLabel(category);
    illustrationSelectedIds.clear();illustrationMoveMode=false;
    await renderIllustrations();
    toast(`${count} illustration${count>1?'s':''} déplacée${count>1?'s':''} vers ${label}`);
  }catch(err){console.error('Déplacement illustrations',err);toast('Impossible de déplacer la sélection')}
}
function openIllustrationCategoryDialog(){const f=$('#illustrationCategoryForm');f.reset();$('#illustrationCategoryDialog').showModal();setTimeout(()=>f.elements.name.focus(),40)}
async function createIllustrationCategory(name){
  const label=String(name||'').trim();if(!label)return toast('Donne un nom à la catégorie');
  if(illustrationCategories.some(([,existing])=>String(existing).localeCompare(label,'fr',{sensitivity:'accent'})===0))return toast('Cette catégorie existe déjà');
  const value=uid('cat');const next=[...illustrationCustomCategories,[value,label]];
  try{await putIllustrationCustomCategories(next);illustrationCustomCategories=next;illustrationCategories=[...DEFAULT_ILLUSTRATION_CATEGORIES,...next];$('#illustrationCategoryDialog').close();await renderIllustrations();toast(`Catégorie « ${label} » ajoutée`)}catch(err){console.error('Création catégorie',err);toast('Impossible de créer cette catégorie')}
}
function openIllustrationImporter(){const input=$('#illustrationImportFile');if(input){input.value='';input.click()}}
function prepareIllustrationImport(files){
  pendingIllustrationFiles=[...files].filter(isSupportedIllustrationFile);
  if(!pendingIllustrationFiles.length){toast('Choisis des fichiers PNG ou JPEG');return}
  const rows=$('#illustrationImportRows');rows.innerHTML=pendingIllustrationFiles.map((file,i)=>`<div class="illustration-import-row"><div><strong>${esc(file.name)}</strong><small>${humanFileSize(file.size)} · ${illustrationFileType(file)==='image/png'?'PNG':'JPEG'}</small></div><select data-illustration-import-category="${i}" aria-label="Catégorie de ${esc(file.name)}">${illustrationCategoryOptions('misc')}</select></div>`).join('');
  $('#illustrationImportDialog').showModal();
}
async function savePendingIllustrations(){
  const files=pendingIllustrationFiles;if(!files.length)return;
  const records=files.map((file,i)=>{const select=$(`[data-illustration-import-category="${i}"]`),category=select?.value||'misc',type=illustrationFileType(file);return {id:uid('img'),name:file.name||`Illustration ${i+1}`,category,type,size:file.size||0,blob:file.slice(0,file.size,type),createdAt:nowStamp(),sentAt:null}});
  await putIllustrations(records);pendingIllustrationFiles=[];$('#illustrationImportDialog').close();illustrationSelectedIds=new Set();illustrationMoveMode=false;await renderIllustrations();toast(`${records.length} illustration${records.length>1?'s':''} importée${records.length>1?'s':''}`);
}
function openIllustrationDeleteDialog(){
  const count=illustrationSelectedIds.size;if(!count)return toast('Sélectionne au moins une illustration');
  const message=$('#illustrationDeleteMessage');if(message)message.textContent=`Supprimer définitivement ${count} illustration${count>1?'s':''} sélectionnée${count>1?'s':''} de cet iPad ? Tu pourras toujours ${count>1?'les':'la'} réimporter plus tard.`;
  $('#illustrationDeleteDialog').showModal();
}
async function confirmDeleteSelectedIllustrations(){
  const ids=[...illustrationSelectedIds];if(!ids.length){$('#illustrationDeleteDialog').close();return}
  try{await deleteIllustrations(ids);illustrationSelectedIds.clear();illustrationMoveMode=false;$('#illustrationDeleteDialog').close();await renderIllustrations();toast(`${ids.length} illustration${ids.length>1?'s':''} supprimée${ids.length>1?'s':''}`)}catch(err){console.error('Suppression illustrations',err);toast('Impossible de supprimer la sélection')}
}
async function exportSelectedIllustrations(){
  const selected=illustrationRecords.filter(x=>illustrationSelectedIds.has(x.id));if(!selected.length)return toast('Sélectionne au moins une illustration');
  const files=selected.map((item,i)=>{const ext=item.type==='image/png'?'png':'jpg',base=String(item.name||`illustration-${i+1}`).replace(/\.(png|jpe?g)$/i,'').trim()||`illustration-${i+1}`;return new File([item.blob],`${base}.${ext}`,{type:item.type||'image/jpeg'})});
  try{
    if(!navigator.share)throw new Error('Partage iPad indisponible');
    if(navigator.canShare&&!navigator.canShare({files}))throw new Error('Partage de ces fichiers non pris en charge');
    await navigator.share({title:`Cockpit · ${selected.length} illustration${selected.length>1?'s':''}`,files});
    const sentAt=nowStamp();selected.forEach(item=>item.sentAt=sentAt);await putIllustrations(selected);illustrationSelectedIds.clear();illustrationMoveMode=false;await renderIllustrations();toast(`${selected.length} illustration${selected.length>1?'s':''} marquée${selected.length>1?'s':''} comme envoyée${selected.length>1?'s':''}`);
  }catch(err){if(err?.name==='AbortError')return;console.warn('Partage illustrations',err);toast('Partage direct indisponible — utilise Safari/iPadOS compatible avec le partage de fichiers')}
}

function openSearch(){const input=$('#searchInput');input.value='';$('#searchResults').innerHTML='<div class="empty-mini">Recherche lieux, PNJ, secrets et journal.</div>';$('#searchDialog').showModal();setTimeout(()=>input.focus(),50)}
function runSearch(q){q=q.trim().toLowerCase();if(!q){$('#searchResults').innerHTML='<div class="empty-mini">Commence à taper…</div>';return}const results=[];state.locations.forEach(x=>{if(`${x.name} ${x.concept} ${x.situation}`.toLowerCase().includes(q))results.push({type:'Lieu',title:x.name,text:x.situation,action:`location:${x.id}`})});state.npcs.forEach(x=>{if(`${x.name} ${x.role} ${x.identity} ${x.wants} ${x.knows}`.toLowerCase().includes(q))results.push({type:'PNJ',title:x.name,text:x.role,action:`npc:${x.id}`})});state.secrets.forEach(x=>{if(`${x.title} ${x.text}`.toLowerCase().includes(q))results.push({type:'Secret',title:x.title,text:x.text,action:'library:secrets'})});state.journal.forEach(x=>{if(x.text.toLowerCase().includes(q))results.push({type:'Journal',title:locationName(x.locationId),text:x.text,action:'journal'})});$('#searchResults').innerHTML=results.slice(0,30).map(r=>`<button class="search-result" data-search-action="${r.action}"><span class="eyebrow">${r.type}</span><strong>${esc(r.title)}</strong><small>${esc(r.text||'')}</small></button>`).join('')||'<div class="empty-mini">Aucun résultat.</div>';$$('[data-search-action]').forEach(b=>b.onclick=()=>{const [type,id]=b.dataset.searchAction.split(':');$('#searchDialog').close();if(type==='location'){state.previewLocationId=id;switchView('table');renderTable()}else if(type==='npc')showNpcSheet(id);else if(type==='library'){state.libraryTab=id;switchView('library');renderLibrary()}else switchView('journal')})}

// Navigation and global controls
$('#btnAmbiences').onclick=()=>{renderAmbienceDrawer();$('#ambienceDrawer').showModal()};
$('#ambienceDrawer').onclick=e=>{if(e.target===$('#ambienceDrawer')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
$('#btnManageAmbiences').onclick=()=>{$('#ambienceDrawer').close();state.libraryTab='ambiences';switchView('library');renderLibrary()};
$('#locationBackgroundFile').onchange=importLocationBackground;
$('#btnRemoveLocationBackground').onclick=()=>{setLocationBackgroundDraft('');$('#locationBackgroundFile').value=''};
$('#locationDialog').addEventListener('close',()=>{locationBackgroundImportToken++;$('#locationForm button[type="submit"]').disabled=false});
$('#btnSessionTimer').onclick=toggleSessionTimer;$('#btnStopSessionTimer').onclick=requestSessionTimerReset;$('#btnCancelTimerReset').onclick=()=>$('#timerResetDialog').close();$('#btnConfirmTimerReset').onclick=resetSessionTimer;$$('.nav-btn[data-view]').forEach(b=>b.onclick=()=>switchView(b.dataset.view));$('#sessionTitle').onchange=e=>commit(()=>state.title=e.target.value.trim()||'Session sans titre',null);$('#btnHome').onclick=showHome;$('#btnHome').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showHome()}};$('#btnHomeResume').onclick=resumeFromHome;$('#btnHomeNew').onclick=()=>{const f=$('#newSessionForm');f.reset();f.elements.name.value='';$('#newSessionDialog').showModal();setTimeout(()=>f.elements.name.focus(),30)};$('#btnHomeImport').onclick=()=>$('#importFile').click();$('#btnHomeSessions').onclick=openSessions;$('#btnUndo').onclick=()=>{const prev=history.pop();if(!prev)return toast('Rien à annuler');state=normalize(JSON.parse(prev));persist();render();toast('Modification annulée')};$('#btnMore').onclick=e=>{e.stopPropagation();$('#moreMenu').classList.toggle('hidden')};document.addEventListener('click',e=>{if(!e.target.closest('#moreMenu')&&!e.target.closest('#btnMore'))$('#moreMenu').classList.add('hidden')});$('#btnSearch').onclick=openSearch;$('#searchInput').oninput=e=>runSearch(e.target.value);$('#btnLaunchSession').onclick=launchSession;$('#btnSessions').onclick=openSessions;$('#btnBackups').onclick=openBackups;$('#btnQuickNote').onclick=openQuickNote;$('#btnPlayStrongStart').onclick=playStrongStart;$('#btnSaveSession').onclick=openSaveChoices;$('#sessionStartFx').onclick=hideSessionStartFx;
$$('.context-tab').forEach(b=>b.onclick=()=>{state.contextTab=b.dataset.context;revealPendingId=null;persist();renderContextPanel()});

// Prep controls
$$('[data-edit="thread"]').forEach(b=>b.onclick=openThreadEditor);$$('[data-edit="strong"]').forEach(b=>b.onclick=openStrongEditor);$('#btnAddLocation').onclick=()=>openLocationEditor();$('#btnTableAddLocation').onclick=()=>openLocationEditor();$$('[data-add]').forEach(b=>b.onclick=()=>openGenericEditor(b.dataset.add));
function renderInjection(){const s=state.situations,t=state.threats;const row=(kind,x,label,detail)=>`<button class="inject-row ${x.injected?'injected':''}" data-inject-kind="${kind}" data-inject-id="${x.id}"><span class="inject-check">${x.injected?'✓':'○'}</span><span><b>${esc(label)}</b>${detail?`<small>${esc(detail)}</small>`:''}</span></button>`;$('#injectContent').innerHTML=`<h3>Situations</h3>${s.map(x=>row('situation',x,x.text,'')).join('')||'<div class="empty-mini">Aucune.</div>'}<h3>Menaces</h3>${t.map(x=>row('threat',x,x.name,x.summary||'')).join('')||'<div class="empty-mini">Aucune.</div>'}`;$$('[data-inject-kind]').forEach(b=>b.onclick=()=>{const kind=b.dataset.injectKind,id=b.dataset.injectId,item=(kind==='threat'?state.threats:state.situations).find(x=>x.id===id);if(item?.injected){toast('Déjà injectée');return}injectItem(kind,id)})}

// Dialog close
$$('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());['spotlightDialog','strongStartPlayDialog'].forEach(id=>{const d=$('#'+id);d.addEventListener('click',e=>{if(e.target===d)d.close()})});$('#sheetScrim').onclick=closeNpcSheet;$('#btnCloseNpcSheet').onclick=closeNpcSheet;

$('#locationForm').elements.tier.onchange=updateLocationEditorMode;
$('#locationForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),data={name:String(f.get('name')).trim(),tier:f.get('tier'),concept:String(f.get('concept')||'').trim(),visuals:lines(f.get('visuals')),impulse:String(f.get('impulse')||'').trim(),situation:String(f.get('situation')||'').trim(),faction:String(f.get('faction')||'').trim(),localPlot:String(f.get('localPlot')||'').trim(),regionalPlot:String(f.get('regionalPlot')||'').trim(),mainPlot:String(f.get('mainPlot')||'').trim(),danger:String(f.get('danger')||'').trim(),reward:String(f.get('reward')||'').trim(),ifIgnored:String(f.get('ifIgnored')||'').trim(),spotifyUrl:String(f.get('spotifyUrl')||'').trim(),backgroundImage:locationBackgroundDraft};if(!commitLocationEdit(()=>{if(editingLocationId){Object.assign(state.locations.find(l=>l.id===editingLocationId),data)}else{const l={id:uid('l'),...data,status:'unvisited',npcIds:[]};state.locations.push(l);state.previewLocationId=l.id}},'Lieu enregistré'))return;$('#locationDialog').close()};$('#btnDeleteLocation').onclick=()=>{if(!editingLocationId||!confirm('Supprimer ce lieu ?'))return;commit(()=>{state.locations=state.locations.filter(l=>l.id!==editingLocationId);if(state.activeLocationId===editingLocationId)state.activeLocationId=null;if(state.previewLocationId===editingLocationId)state.previewLocationId=state.activeLocationId||state.locations[0]?.id||null},'Lieu supprimé');$('#locationDialog').close()};
$('#npcForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),data={};for(const k of ['name','role','identity','wants','fears','knows','hides','trait'])data[k]=String(f.get(k)||'').trim();commit(()=>{if(editingNpcId)Object.assign(state.npcs.find(n=>n.id===editingNpcId),data);else state.npcs.push({id:uid('n'),...data})},'PNJ enregistré');$('#npcDialog').close()};$('#btnDeleteNpc').onclick=()=>{if(!editingNpcId||!confirm('Supprimer ce PNJ ?'))return;commit(()=>{state.npcs=state.npcs.filter(n=>n.id!==editingNpcId);state.locations.forEach(l=>l.npcIds=(l.npcIds||[]).filter(id=>id!==editingNpcId))},'PNJ supprimé');$('#npcDialog').close()};
$('#threadForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),goal=String(f.get('goal')||'').trim(),newLines=lines(f.get('steps'));commit(()=>{const old=state.thread.steps||[];state.thread.goal=goal;state.thread.steps=newLines.map((text,i)=>({id:old[i]?.id||uid('ts'),text,done:old[i]?.text===text?!!old[i].done:false}))},'Fil rouge enregistré');$('#threadDialog').close()};$('#strongForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);commit(()=>state.strongStart.text=String(f.get('text')||'').trim(),'Strong Start enregistré');$('#strongDialog').close()};
$('#btnAddPlayerRow').onclick=()=>addPlayerRow();$('#playersForm').onsubmit=e=>{e.preventDefault();const arr=$$('#playersEditor .player-editor-row').map(row=>{const id=row.dataset.playerId||uid('p'),old=state.players.find(p=>p.id===id);return {id,name:row.querySelector('[data-pname]').value.trim(),spotlightIdeas:old?.spotlightIdeas||[],spotlightCount:old?.spotlightCount||0}}).filter(p=>p.name);commit(()=>state.players=arr,'Personnages enregistrés');$('#playersDialog').close()};$('#spotlightForm').onsubmit=e=>{e.preventDefault();const p=state.players.find(x=>x.id===spotlightEditingId);if(!p)return;const ideas=$$('#spotlightIdeaRows [data-spotlight-idea]').map(x=>x.value.trim()).filter(Boolean);commit(()=>p.spotlightIdeas=ideas,'Spotlight mis à jour');$('#spotlightDialog').close()};$('#btnAddSpotlightIdea').onclick=()=>addSpotlightIdeaRow('');
$('#genericForm').onsubmit=e=>{e.preventDefault();const def=genericDefs[genericContext.type];if(!def)return;const f=new FormData(e.target),data={};if(genericContext.type==='ambience'&&!validAmbienceUrl(f.get('spotifyUrl')))return toast('Colle un lien Spotify valide');def.fields.forEach(field=>data[field.name]=String(f.get(field.name)||'').trim());commit(()=>{const arr=state[def.collection];if(genericContext.id){const item=arr.find(x=>x.id===genericContext.id);Object.assign(item,data);if(genericContext.type==='blank')item.resolved=!!data.resolution}else{const base={id:uid(genericContext.type.slice(0,2))};if(genericContext.type==='reward')base.used=false;if(['threat','situation'].includes(genericContext.type))Object.assign(base,{used:false,injected:false,activeInjected:false,injectedLocationId:null});if(genericContext.type==='secret')Object.assign(base,{revealed:false,revealedAt:null,method:''});if(genericContext.type==='blank')Object.assign(base,{resolved:!!data.resolution});arr.push({...base,...data})}},'Élément enregistré');$('#genericDialog').close()};$('#btnDeleteGeneric').onclick=()=>{const def=genericDefs[genericContext.type];if(!def||!genericContext.id||!confirm('Supprimer cet élément ?'))return;commit(()=>state[def.collection]=state[def.collection].filter(x=>x.id!==genericContext.id),'Élément supprimé');$('#genericDialog').close()};
$('#newSessionForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);$('#newSessionDialog').close();createNewSession(String(f.get('name')||''))};
$('#quickNoteForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),text=String(f.get('text')||'').trim(),type=f.get('type');if(!text)return;commit(()=>state.journal.unshift({id:uid('j'),type,text,locationId:state.activeLocationId,createdAt:nowStamp()}),'Note ajoutée');e.target.reset();renderQuickNoteHistory();setTimeout(()=>e.target.elements.text.focus(),30)};

$$('.library-tab').forEach(b=>b.onclick=()=>{state.libraryTab=b.dataset.library;persist();renderLibrary()});$('#btnClearJournal').onclick=()=>{if(confirm('Effacer le journal ?'))commit(()=>state.journal=[],'Journal effacé')};$('#btnExportJournal').onclick=exportJournal;$('#btnImportNpcFromEditor').onclick=()=>openComponentImport('npc');$('#btnImportLocationFromEditor').onclick=()=>openComponentImport('location');
$('#npcImportFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{await importNpcFile(file)}catch(err){console.error(err);toast('Fichier PNJ incompatible')}e.target.value=''};
$('#locationImportFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{await importLocationFile(file)}catch(err){console.error(err);toast('Fichier lieu incompatible')}e.target.value=''};
$('#importFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{await importSessionFile(file)}catch(err){console.error(err);toast('Sauvegarde incompatible')}e.target.value=''};$('#btnImportSavedSession').onclick=()=>$('#savedSessionImportFile').click();$('#savedSessionImportFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{await importSavedSessionFile(file)}catch(err){console.error(err);toast('Sauvegarde incompatible')}e.target.value=''};$('#btnClear').onclick=()=>{if(confirm('Créer une préparation vide ?')){snapshot();state=EMPTY();persist();render();toast('Nouvelle préparation créée')}};
$('#btnDeleteIllustrations').onclick=openIllustrationDeleteDialog;$('#btnAddIllustrationCategory').onclick=openIllustrationCategoryDialog;$('#btnMoveIllustrations').onclick=toggleIllustrationMoveMode;$('#btnImportIllustrations').onclick=openIllustrationImporter;$('#btnExportIllustrations').onclick=exportSelectedIllustrations;$('#btnCancelDeleteIllustrations').onclick=()=>$('#illustrationDeleteDialog').close();$('#btnConfirmDeleteIllustrations').onclick=confirmDeleteSelectedIllustrations;$('#illustrationImportFile').onchange=e=>{prepareIllustrationImport(e.target.files);e.target.value=''};$('#illustrationImportForm').onsubmit=async e=>{e.preventDefault();try{await savePendingIllustrations()}catch(err){console.error(err);toast('Impossible d’importer ces illustrations')}};$('#illustrationImportDialog').addEventListener('close',()=>{pendingIllustrationFiles=[]});$('#illustrationCategoryForm').onsubmit=async e=>{e.preventDefault();await createIllustrationCategory(new FormData(e.target).get('name'))};

ensureDemoSavedSession();
if('serviceWorker' in navigator)window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('service-worker.js?v=2.0.8',{updateViaCache:'none'});await reg.update()}catch(e){console.warn('Service worker',e)}});
render();


// Session ambiences and portable, optimized location backgrounds.
function validAmbienceUrl(value){
  const url=String(value||'').trim();
  if(/^spotify:(track|album|playlist|artist|episode|show):[a-zA-Z0-9]+$/.test(url))return true;
  try{const u=new URL(url);return u.protocol==='https:'&&['open.spotify.com','spotify.link'].includes(u.hostname)&&!u.username&&!u.password}catch{return false}
}
function ambiencePlayButton(a){return `<button class="ambience-play" data-play-ambience="${esc(a.id)}" aria-label="Ouvrir ${esc(a.name)} dans Spotify" title="Ouvrir dans Spotify"><img src="music-note.png" alt=""></button>`}
function bindAmbiencePlayback(){
  $$('[data-play-ambience]').forEach(b=>b.onclick=()=>{const a=state.ambiences.find(x=>x.id===b.dataset.playAmbience);if(!a||!validAmbienceUrl(a.spotifyUrl))return toast('Lien Spotify invalide');const link=document.createElement('a');link.href=a.spotifyUrl.trim();link.target='_blank';link.rel='noopener noreferrer';document.body.append(link);link.click();link.remove()});
}
function renderAmbienceDrawer(){
  $('#ambienceDrawerList').innerHTML=state.ambiences.length?state.ambiences.map(a=>`<div class="ambience-row"><strong>${esc(a.name)}</strong>${ambiencePlayButton(a)}</div>`).join(''):'<p class="empty-mini">Ajoute tes ambiances dans Composants → Ambiances.</p>';bindAmbiencePlayback();
}
// Originals live in IndexedDB; sessions keep small references. Exports embed the bytes.
function isEmbeddedBackground(value){return typeof value==='string'&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)}
function safeLocationBackground(value){return isEmbeddedBackground(value)||(typeof value==='string'&&/^cockpit-background:[a-zA-Z0-9-]+$/.test(value))?value:''}
function openLocationBackgroundDb(){
  if(locationBackgroundDbPromise)return locationBackgroundDbPromise;
  locationBackgroundDbPromise=new Promise((resolve,reject)=>{
    const request=indexedDB.open('cockpit-location-backgrounds-v1',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('images',{keyPath:'id'});
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();locationBackgroundDbPromise=null};resolve(db)};
    request.onerror=()=>reject(request.error||new Error('Stockage des illustrations indisponible'));
  }).catch(err=>{locationBackgroundDbPromise=null;throw err});
  return locationBackgroundDbPromise;
}
async function storeLocationBackground(data){
  if(!isEmbeddedBackground(data))throw new Error('Image incompatible');
  const db=await openLocationBackgroundDb(),id='cockpit-background:'+uid('bg');
  await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').put({id,data});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Enregistrement interrompu'))});
  return id;
}
async function resolveLocationBackground(value){
  const safe=safeLocationBackground(value);if(!safe)return '';if(isEmbeddedBackground(safe))return safe;
  const db=await openLocationBackgroundDb();
  return new Promise((resolve,reject)=>{const tx=db.transaction('images','readonly'),req=tx.objectStore('images').get(safe);req.onsuccess=()=>{const data=req.result?.data;if(isEmbeddedBackground(data))resolve(data);else reject(new Error('Illustration introuvable'))};req.onerror=()=>reject(req.error);tx.onabort=()=>reject(tx.error||new Error('Lecture interrompue'))});
}
async function embedLocationBackgrounds(session){
  const copy=clone(session);for(const l of copy.locations||[])if(l.backgroundImage)l.backgroundImage=await resolveLocationBackground(l.backgroundImage);return copy;
}
async function storeLocationBackgrounds(session){
  const stored=new Map();for(const l of session.locations||[]){
    const value=safeLocationBackground(l.backgroundImage);if(!value){l.backgroundImage='';continue}
    if(isEmbeddedBackground(value)){if(!stored.has(value))stored.set(value,await storeLocationBackground(value));l.backgroundImage=stored.get(value)}
    else await resolveLocationBackground(value);
  }return session;
}
async function renderLocationBackground(value){
  const panel=$('#liveLocationContent').parentElement,reference=safeLocationBackground(value);
  if(panel.dataset.backgroundReference===reference)return;
  panel.dataset.backgroundReference=reference;const token=++liveBackgroundRenderToken;
  panel.classList.remove('has-location-background');panel.style.setProperty('--location-background','none');
  if(!reference)return;
  try{const data=await resolveLocationBackground(reference);if(token!==liveBackgroundRenderToken)return;panel.style.setProperty('--location-background',`url("${data}")`);panel.classList.add('has-location-background')}
  catch(err){if(token===liveBackgroundRenderToken){delete panel.dataset.backgroundReference;toast('Illustration indisponible : réimporte-la depuis Modifier le lieu.')}console.warn(err)}
}
function setLocationBackgroundDraft(value){
  const token=++locationBackgroundImportToken;locationBackgroundDraft=safeLocationBackground(value);const preview=$('#locationBackgroundPreview');preview.hidden=true;preview.removeAttribute('src');$('#btnRemoveLocationBackground').hidden=!locationBackgroundDraft;$('#locationForm button[type="submit"]').disabled=false;
  if(locationBackgroundDraft)resolveLocationBackground(locationBackgroundDraft).then(data=>{if(token!==locationBackgroundImportToken)return;preview.src=data;preview.hidden=false}).catch(()=>{if(token===locationBackgroundImportToken)toast('Aperçu indisponible : réimporte cette illustration')});
}
async function importLocationBackground(e){
  const file=e.target.files[0];if(!file)return;
  const token=++locationBackgroundImportToken,submit=$('#locationForm button[type="submit"]');submit.disabled=true;
  const url=URL.createObjectURL(file);
  try{
    if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw new Error('Choisis une image PNG, JPEG ou WebP');
    const img=new Image();img.src=url;await img.decode();
    const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Impossible de lire cette image'));reader.readAsDataURL(file)});
    if(token!==locationBackgroundImportToken)return;
    const reference=await storeLocationBackground(data);
    if(token===locationBackgroundImportToken)setLocationBackgroundDraft(reference);
  }catch(err){if(token===locationBackgroundImportToken)toast(err?.name==='QuotaExceededError'?'Stockage de l’appareil plein : impossible d’ajouter cette image.':err.message||'Impossible de lire cette image')}
  finally{URL.revokeObjectURL(url);if(token===locationBackgroundImportToken)submit.disabled=false}
}

function commitLocationEdit(mut,msg){
  const previous=JSON.stringify(state),previousHistory=history.slice(),keys=[STORAGE_KEY,SAVED_SESSIONS_KEY,BACKUP_KEY],stored=keys.map(k=>localStorage.getItem(k));
  try{commit(mut,msg);return true}catch(err){
    state=normalize(JSON.parse(previous));history=previousHistory;
    keys.forEach((k,i)=>{try{if(stored[i]===null)localStorage.removeItem(k);else localStorage.setItem(k,stored[i])}catch{}});
    render();toast('Espace de sauvegarde insuffisant. Exporte puis retire une ancienne session ou une illustration.');return false;
  }
}
