const screen=document.querySelector('#screen');
const progress=document.querySelector('#progress');
let step=0;
const happy='😊'.repeat(34)+'yay 😊'.repeat(3)+'😊'.repeat(20);
function render(html){screen.innerHTML=html;progress.style.width=`${[20,40,60,80,100][step]||20}%`;}
function meme(name,alt){return `<img class="meme" src="meme/${name}.png" alt="${alt}">`;}
function go(next){step=next;}
function home(){step=0;render(`<p class="eyebrow">una domanda importantissima</p><h1>Confermato che mi porti in giro per Berlino venerdì???</h1><div class="emoji">🇩🇪👩🏻‍🦰</div><p>no pressure scegli quello che ovviamente preferisci</p><div class="buttons"><button class="btn" onclick="yes()">si</button><button class="btn secondary" onclick="explodeNo(this)">no</button></div>`)}
function explodeNo(button){button.disabled=true;button.classList.add('explode');setTimeout(nope,450);}
function nope(){step=0;render(`<p class="eyebrow">errore di sistema</p><h1>dude ......</h1>${meme('no-berlino','Meme per la risposta no')}<p>ma come ti permetti</p><div class="buttons single"><button class="btn" onclick="home()">Riprova con la risposta giusta</button></div>`)}
function yes(){step=1;render(`<p class="eyebrow">risposta corretta ✅</p><h1>bravissima!!!</h1>${meme('si-berlino','Meme di approvazione')}<p>sono felice della tua presenza d'altronde non c'erano opzioni migliori i guess</p><div class="buttons single"><button class="btn" onclick="gift()">continua →</button></div>`);celebrate();}
function celebrate(){const layer=document.createElement('div');layer.className='confetti-burst';layer.setAttribute('aria-hidden','true');for(let i=0;i<18;i++){const bit=document.createElement('i');bit.style.setProperty('--x',`${Math.random()*100}vw`);bit.style.setProperty('--drift',`${(Math.random()-.5)*100}px`);bit.style.setProperty('--delay',`${Math.random()*100}ms`);bit.style.setProperty('--color',['#ff7f87','#ffd166','#7ac7a1','#8bb9ed'][i%4]);layer.appendChild(bit);}document.body.appendChild(layer);setTimeout(()=>layer.remove(),1100);}
function gift(){step=2;render(`<p class="eyebrow">un piccolo bonus per te</p><h1>happiness bait</h1><div class="confetti">${happy}</div><div class="buttons single"><button class="btn" onclick="runQuestion()">un'altra cosa →</button></div>`)}
function runQuestion(){step=3;render(`<p class="eyebrow">completamente opzionale…</p><h1>Scarpette da corsa 👟</h1><p>eh eh eh facciamo un giretto piu energico</p><div class="buttons"><button class="btn" onclick="runYes()">vuoi correre</button><button class="btn secondary" onclick="runNo()">non vuoi correre</button></div>`)}
function runNo(){step=3;render(`<p class="eyebrow">imprevisto! 🃏</p><h1>NOOOOOOOOOOOOOOOOO</h1>${meme('no-corsa','Meme per la risposta no alla corsa')}<p>aspetta aspetta aspetta dai torna indietro</p><div class="buttons single"><button class="btn" onclick="runQuestion()">torna indietro ↩</button></div>`)}
function runYes(){step=4;render(`<p class="eyebrow">piano approvato</p><h1>BENE!!!</h1>${meme('si-corsa','Meme per la corsa')}<p>non corriamo cioè non corriamo seriamente non voglio che accupi quindi poi vediamo però si l'idea è figa</p><div class="buttons single"><button class="btn" onclick="thanks()">mi sembra ragionevole →</button></div>`)}
function thanks(){step=5;render(`<h1>grazie chiara</h1><div class="emoji">👍</div><p>sempre se l ' etna non esplode</p><div class="buttons single"><button class="btn secondary" onclick="home()">ricomincia ↺</button></div>`)}
home();
