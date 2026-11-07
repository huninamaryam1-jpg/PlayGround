import * as THREE from 'three';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const ui={};
['game','hud','health-fill','health-value','web-fill','web-value','objective','progress-count','progress-fill','assist-text','assist-fill','toast','damage-flash','reticle','swing-hint','boss-alert','bottom-hud','intro-screen','end-screen','end-title','end-copy','start-button','restart-button','audio-toggle','loading'].forEach(id=>ui[id]=document.getElementById(id));
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x07111e);
scene.fog=new THREE.FogExp2(0x07111e,.014);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,220);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.domElement.id='world-canvas';ui.game.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0x9fc8ff,0x15141c,2.1));
const keyLight=new THREE.DirectionalLight(0xd5e5ff,2.6);keyLight.position.set(-18,34,8);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1024,1024);scene.add(keyLight);
const cityGlow=new THREE.PointLight(0x247bff,95,55);cityGlow.position.set(-8,12,-18);scene.add(cityGlow);
const redGlow=new THREE.PointLight(0xff244c,57,38);redGlow.position.set(17,9,13);scene.add(redGlow);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:0x151b26,roughness:.92}));ground.rotation.x=-Math.PI/2;ground.position.y=-.12;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(80,40,0x34445b,0x263244);grid.position.y=-.105;scene.add(grid);
const road=new THREE.Mesh(new THREE.PlaneGeometry(9,82),new THREE.MeshStandardMaterial({color:0x090e16,roughness:1}));road.rotation.x=-Math.PI/2;road.position.set(0,-.09,0);scene.add(road);
const city=new THREE.Group();scene.add(city);
const buildingMats=[0x182439,0x202c40,0x293449,0x121d30,0x343448].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.86,emissive:0x07111d,emissiveIntensity:.3}));
const windowMat=new THREE.MeshBasicMaterial({color:0xffcb74});
for(let x=-38;x<=38;x+=6){for(let z=-38;z<=38;z+=7){if(Math.abs(x)<8)continue;const h=8+Math.random()*21,w=4+Math.random()*2,d=4+Math.random()*2;const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),buildingMats[Math.floor(Math.random()*buildingMats.length)]);b.position.set(x+(Math.random()-.5)*1.5,h/2-.1,z+(Math.random()-.5)*1.5);b.castShadow=true;b.receiveShadow=true;city.add(b);for(let y=2;y<h-1;y+=2.5)for(let wx=-w/2+.5;wx<w/2-.3;wx+=1.2){if(Math.random()<.58){const win=new THREE.Mesh(new THREE.PlaneGeometry(.45,.8),windowMat);win.position.set(b.position.x+wx,y,b.position.z+d/2+.012);city.add(win)}}}}
const streetLights=new THREE.Group();scene.add(streetLights);for(const x of [-5.5,5.5])for(let z=-30;z<=30;z+=10){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.055,.08,4,6),new THREE.MeshStandardMaterial({color:0x586579,metalness:.7,roughness:.35}));pole.position.set(x,2,z);streetLights.add(pole);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),new THREE.MeshBasicMaterial({color:0xffdca0}));lamp.position.set(x,4,z);streetLights.add(lamp)}
const motes=new THREE.Group();scene.add(motes);for(let i=0;i<70;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.045,5,4),new THREE.MeshBasicMaterial({color:Math.random()>.5?0x75d9ff:0xffbd73,transparent:true,opacity:.65}));m.position.set((Math.random()-.5)*65,Math.random()*13-1,(Math.random()-.5)*65);motes.add(m)}
const hero=new THREE.Group();scene.add(hero);hero.position.set(0,0,4);
const rig=new THREE.Group();hero.add(rig);
const suit=new THREE.MeshStandardMaterial({color:0xc81c2b,roughness:.58,metalness:.05});const blueSuit=new THREE.MeshStandardMaterial({color:0x152b70,roughness:.62});const darkSuit=new THREE.MeshStandardMaterial({color:0x101522,roughness:.65});const whiteEye=new THREE.MeshStandardMaterial({color:0xf4f8ff,emissive:0x9ebdff,emissiveIntensity:.35});
function limb(parent,mat,a,b,r1,r2){const delta=new THREE.Vector3().subVectors(b,a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,delta.length(),8),mat);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.castShadow=true;parent.add(mesh);return mesh}
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.37,.72,5,9),suit);torso.position.y=1.28;torso.castShadow=true;rig.add(torso);
const chest=new THREE.Mesh(new THREE.SphereGeometry(.34,10,8),blueSuit);chest.scale.set(1,.92,.72);chest.position.set(0,1.37,.04);rig.add(chest);
const head=new THREE.Mesh(new THREE.SphereGeometry(.31,12,10),suit);head.scale.set(.9,1.1,.86);head.position.y=2.08;head.castShadow=true;rig.add(head);
for(const side of [-1,1]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.095,10,7),whiteEye);eye.scale.set(.72,1.35,.35);eye.position.set(side*.13,2.1,.255);rig.add(eye);limb(rig,blueSuit,new THREE.Vector3(side*.27,1.56,0),new THREE.Vector3(side*.34,.77,0),.15,.095);limb(rig,darkSuit,new THREE.Vector3(side*.34,.77,0),new THREE.Vector3(side*.37,.12,.07),.095,.12);limb(rig,suit,new THREE.Vector3(side*.29,1.67,0),new THREE.Vector3(side*.49,1.31,.02),.12,.09);limb(rig,blueSuit,new THREE.Vector3(side*.49,1.31,.02),new THREE.Vector3(side*.54,.96,.08),.09,.075)}
const spiderMark=new THREE.Mesh(new THREE.SphereGeometry(.095,8,6),new THREE.MeshBasicMaterial({color:0xf0f4ff}));spiderMark.position.set(0,1.38,.36);rig.add(spiderMark);
const clock=new THREE.Clock();const keys={};let camYaw=0,camPitch=.22,started=false,ended=false,muted=false;
const player={velocity:new THREE.Vector3(),heading:0,grounded:true,health:100,web:100,attack:0,shot:0,zip:0,invuln:0};
let enemies=[],webs=[],spawned=0,total=8,spawnTimer=1,assistCooldown=0,toastTimer=0,damageTimer=0;
function toast(message){ui.toast.textContent=message;ui.toast.classList.add('show');toastTimer=2.1}
function updateHud(){ui['health-fill'].style.width=player.health+'%';ui['health-value'].textContent=Math.ceil(player.health);ui['web-fill'].style.width=player.web+'%';ui['web-value'].textContent=Math.floor(player.web)+'%';ui['progress-count'].textContent=(spawned-enemies.length)+' / '+total;ui['progress-fill'].style.width=((spawned-enemies.length)/total*100)+'%';ui['assist-fill'].style.width=((1-assistCooldown/18)*100)+'%';ui['assist-text'].innerHTML=assistCooldown>0?'IRON LEGION STRIKE <kbd>R</kbd>':'IRON LEGION STRIKE <kbd>R</kbd>'}
function startGame(){if(started&&!ended)return;started=true;ended=false;ui['intro-screen'].classList.add('hidden');ui['end-screen'].classList.add('hidden');ui.hud.classList.add('active');ui['bottom-hud'].classList.add('active');document.body.classList.add('playing');player.health=100;player.web=100;spawned=0;spawnTimer=.5;enemies.forEach(e=>scene.remove(e));enemies=[];hero.position.set(0,0,4);updateHud();toast('New York needs you. Clear the street!')}
function finish(won){ended=true;started=false;document.body.classList.remove('playing');ui.hud.classList.remove('active');ui['bottom-hud'].classList.remove('active');ui['end-screen'].classList.remove('hidden');ui['end-title'].innerHTML=won?'YOU DID<br><em>GOOD, KID.</em>':'NOT THIS<br><em>TIME.</em>';ui['end-copy'].textContent=won?'The city still has a friendly neighborhood Spider-Man.':'The city needs you. Take a breath and get back out there.'}
function takeDamage(amount){if(player.invuln>0||!started)return;player.health=Math.max(0,player.health-amount);player.invuln=.7;damageTimer=.18;ui['damage-flash'].classList.add('hit');updateHud();if(player.health<=0)finish(false)}
function jump(){if(!player.grounded)return;player.velocity.y=8.5;player.grounded=false}
function makeEnemy(boss=false){const e=new THREE.Group();const armor=new THREE.MeshStandardMaterial({color:boss?0x79301d:0x4b9b8b,metalness:.58,roughness:.32,emissive:boss?0xff4a12:0x0d6252,emissiveIntensity:.75});const body=new THREE.Mesh(new THREE.IcosahedronGeometry(boss?.78:.48,1),armor);body.position.y=.9;body.castShadow=true;e.add(body);for(let n=0;n<4;n++){const a=n*Math.PI/2;const spike=new THREE.Mesh(new THREE.ConeGeometry(.12,.58,5),armor);spike.position.set(Math.sin(a)*.35,1,Math.cos(a)*.35);spike.rotation.x=Math.cos(a)*.8;spike.rotation.z=-Math.sin(a)*.8;e.add(spike)}const eye=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),new THREE.MeshBasicMaterial({color:0xff381f}));eye.position.set(0,1.04,.42);e.add(eye);const barCanvas=document.createElement('canvas');barCanvas.width=128;barCanvas.height=20;const barTexture=new THREE.CanvasTexture(barCanvas);const bar=new THREE.Sprite(new THREE.SpriteMaterial({map:barTexture,depthTest:false}));bar.position.y=2.05;bar.scale.set(1.7,.27,1);e.add(bar);const data={boss,hp:boss?160:55,maxHp:boss?160:55,phase:Math.random()*6,attack:1+Math.random(),barCtx:barCanvas.getContext('2d'),barTexture,hitFlash:0};e.userData=data;const angle=Math.random()*Math.PI*2,r=14+Math.random()*11;e.position.set(hero.position.x+Math.cos(angle)*r,.12,hero.position.z+Math.sin(angle)*r);scene.add(e);enemies.push(e);spawned++;if(boss){ui['boss-alert'].classList.add('visible');setTimeout(()=>ui['boss-alert'].classList.remove('visible'),2600);toast('Drop ship down! Take out the commander!')}updateHud()}
function hitEnemy(e,damage){const d=e.userData;d.hp-=damage;d.hitFlash=.14;if(d.hp<=0){scene.remove(e);enemies.splice(enemies.indexOf(e),1);if(d.boss){finish(true);return}toast('Scout down!');if(spawned>=total&&enemies.length===0)finish(true);updateHud()}}
function makeWeb(a,b){const geometry=new THREE.BufferGeometry().setFromPoints([a,b]);const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0xc9f5ff,transparent:true,opacity:.9}));scene.add(line);webs.push({line,life:.17})}
function webShot(){if(!started||player.web<5||player.shot>.2)return;player.web-=5;player.shot=.24;const aim=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw));let target=null,best=13;for(const e of enemies){const delta=e.position.clone().sub(hero.position);const dist=delta.length();delta.y=0;const dot=delta.normalize().dot(aim);if(dot>.55&&dist<best){best=dist;target=e}}if(target){makeWeb(hero.position.clone().add(new THREE.Vector3(0,1.4,0)),target.position.clone().add(new THREE.Vector3(0,1,0)));hitEnemy(target,target.userData.boss?18:30);toast('WEB SHOT!')}updateHud()}
function webStrike(){if(!started||player.web<12||player.attack>.1)return;player.web-=12;player.attack=.42;let hit=false;for(const e of [...enemies])if(e.position.distanceTo(hero.position)<3.3){hitEnemy(e,e.userData.boss?25:45);hit=true}if(hit)toast('WEB STRIKE!');else toast('No enemies in range');updateHud()}
function zip(){if(!started||player.web<8||player.zip>.1)return;player.web-=8;player.zip=.38;const aim=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw));let target=null,best=30;for(const e of enemies){const d=e.position.clone().sub(hero.position),dist=d.length();d.y=0;if(d.normalize().dot(aim)>.35&&dist<best){best=dist;target=e}}if(target){const dir=target.position.clone().sub(hero.position);dir.y=0;hero.position.addScaledVector(dir.normalize(),Math.max(0,best-2.2));player.velocity.y=2;makeWeb(hero.position.clone().add(new THREE.Vector3(0,1.5,0)),target.position.clone().add(new THREE.Vector3(0,1,0)))}else{player.velocity.x+=aim.x*9;player.velocity.z+=aim.z*9}updateHud()}
function assist(){if(!started||assistCooldown>0)return;assistCooldown=18;for(const e of [...enemies])hitEnemy(e,e.userData.boss?60:100);toast('IRON LEGION STRIKE!');updateHud()}

let worldTime=0;
const cameraTarget=new THREE.Vector3();
const camPos=new THREE.Vector3();
function tick(dt){
  worldTime+=dt;player.attack=Math.max(0,player.attack-dt);player.shot=Math.max(0,player.shot-dt);player.zip=Math.max(0,player.zip-dt);player.invuln=Math.max(0,player.invuln-dt);assistCooldown=Math.max(0,assistCooldown-dt);
  player.web=Math.min(100,player.web+dt*2.7);
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show')}
  if(damageTimer>0){damageTimer-=dt;if(damageTimer<=0)ui['damage-flash'].classList.remove('hit')}
  if(started&&!ended){
    const forward=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw));const right=new THREE.Vector3(Math.cos(camYaw),0,-Math.sin(camYaw));
    const input=new THREE.Vector3();if(keys.w||keys.arrowup)input.add(forward);if(keys.s||keys.arrowdown)input.sub(forward);if(keys.d||keys.arrowright)input.add(right);if(keys.a||keys.arrowleft)input.sub(right);
    if(input.lengthSq()>0){input.normalize();const speed=keys.shift?11:7.8;player.velocity.x=THREE.MathUtils.damp(player.velocity.x,input.x*speed,7,dt);player.velocity.z=THREE.MathUtils.damp(player.velocity.z,input.z*speed,7,dt);player.heading=Math.atan2(input.x,input.z)}
    else{player.velocity.x=THREE.MathUtils.damp(player.velocity.x,0,4.2,dt);player.velocity.z=THREE.MathUtils.damp(player.velocity.z,0,4.2,dt)}
    player.velocity.y-=19*dt;hero.position.addScaledVector(player.velocity,dt);
    if(hero.position.y<=0){hero.position.y=0;player.velocity.y=0;player.grounded=true}else player.grounded=false;
    hero.position.x=clamp(hero.position.x,-34,34);hero.position.z=clamp(hero.position.z,-34,34);
    hero.rotation.y=player.heading;
    const moving=input.lengthSq()>0;rig.position.y=(player.grounded?Math.abs(Math.sin(worldTime*11))*(moving?.045:.008):0);
    rig.rotation.z=player.attack>0?Math.sin((.42-player.attack)/.42*Math.PI)*-.42:Math.sin(worldTime*6)*(moving?.035:.009);
    rig.scale.setScalar(player.invuln>0&&Math.floor(worldTime*18)%2===0?.91:1);
    if(keys[' ']){if(player.grounded)jump()}

    spawnTimer=Math.max(0,spawnTimer-dt);
    if(spawnTimer===0&&spawned<total&&enemies.length<4){makeEnemy(spawned===total-1);spawnTimer=1.1}
    for(const e of [...enemies]){
      const data=e.userData;data.phase+=dt*(data.boss?1.7:2.1);data.attack-=dt;
      const to=hero.position.clone().sub(e.position);to.y=0;const dist=to.length();const dir=dist>0?to.normalize():new THREE.Vector3(1,0,0);
      if(dist>(data.boss?3.5:2.45)){e.position.addScaledVector(dir,dt*(data.boss?1.65:2.5));e.rotation.y=Math.atan2(dir.x,dir.z)}
      e.position.y=.12+Math.sin(data.phase*2)*.14;
      e.rotation.z=Math.sin(data.phase)*.055;
      if(dist<(data.boss?4.1:3.1)&&data.attack<=0){data.attack=data.boss?1.05:1.55;takeDamage(data.boss?13:8);const push=hero.position.clone().sub(e.position);push.y=0;push.normalize();player.velocity.addScaledVector(push,4.2);}
      if(data.hitFlash>0){data.hitFlash-=dt;e.children[0].material.emissiveIntensity=2.2}else e.children[0].material.emissiveIntensity=data.boss?.75:.75;
      const pct=clamp(data.hp/data.maxHp,0,1),ctx=data.barCtx;ctx.clearRect(0,0,128,20);ctx.fillStyle='rgba(6,10,19,.78)';ctx.fillRect(0,0,128,20);ctx.fillStyle='#ff303f';ctx.fillRect(3,3,122,14);ctx.fillStyle=data.boss?'#ffd166':'#64e8ff';ctx.fillRect(3,3,122*pct,14);data.barTexture.needsUpdate=true;
    }
  } else {
    hero.position.y=.035+Math.sin(worldTime*1.7)*.035;rig.rotation.z=Math.sin(worldTime*1.2)*.018;
  }
  for(let i=webs.length-1;i>=0;i--){webs[i].life-=dt;if(webs[i].life<=0){scene.remove(webs[i].line);webs.splice(i,1)}}
  const follow=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw));
  const distance=keys.shift?8.2:10.4;
  cameraTarget.set(hero.position.x,hero.position.y+1.5,hero.position.z);
  camPos.set(hero.position.x-follow.x*distance,hero.position.y+4.0+camPitch*7,hero.position.z-follow.z*distance);
  camera.position.lerp(camPos,1-Math.exp(-4.2*dt));
  camera.lookAt(cameraTarget);
  motes.rotation.y=worldTime*.006;
  cityGlow.intensity=95+Math.sin(worldTime*1.4)*7;redGlow.intensity=57+Math.sin(worldTime*2.2)*9;
  if(started&&Math.floor(worldTime*4)%4===0)updateHud();
}
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.04);tick(dt);renderer.render(scene,camera)}

// A wider wheel zoom and the right mouse button let players pick a cinematic angle.
renderer.domElement.addEventListener('wheel',e=>{camPitch=clamp(camPitch+(e.deltaY>0?.025:-.025),-.02,.58)},{passive:true});
frame();
requestAnimationFrame(()=>{ui.loading.classList.add('done');setTimeout(()=>ui.loading.remove(),500)});

ui['start-button'].addEventListener('click',startGame);
ui['restart-button'].addEventListener('click',startGame);
ui['audio-toggle'].addEventListener('click',()=>{muted=!muted;ui['audio-toggle'].innerHTML=muted?'♫ <span>SOUND OFF</span>':'♫ <span>SOUND ON</span>'});
window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();keys[key]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();if(key==='enter'&&!started)startGame();if(key==='f')webStrike();if(key==='e')zip();if(key==='r')assist();if(key===' '&&started)jump()});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
renderer.domElement.addEventListener('pointerdown',e=>{if(e.button===0)webShot()});
window.addEventListener('mousemove',e=>{if(e.buttons===2||document.pointerLockElement===renderer.domElement){camYaw-=e.movementX*.003;camPitch=clamp(camPitch+e.movementY*.0015,-.02,.58)}});
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight)});

