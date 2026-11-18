'use strict';
const el=id=>document.getElementById(id),key='freex-yarn-drafts-v1';
let queue=[],known=[];
try{queue=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(queue))queue=[]}catch(e){queue=[]}
const say=t=>{el('capture-status').textContent=t};
function persist(){try{localStorage.setItem(key,JSON.stringify(queue))}catch(e){say('Device storage unavailable. Download your drafts before leaving.')} }
function download(data,name){const u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function field(label,value,tag='input'){const box=document.createElement('label');box.textContent=label;const input=document.createElement(tag);input.value=value;input.required=true;box.append(input);return {box,input}}
function renderQueue(){
 el('inbox').replaceChildren();el('inbox-count').textContent=queue.length+' draft ideas on this device';
 queue.forEach((d,i)=>{
  const form=document.createElement('form');form.className='draft-card';form.style.cssText='padding:20px;border:1px solid #668b71;border-radius:14px;margin-bottom:16px';
  const t=field('Public title',d.title),s=field('Public summary — edit the suggestion before sharing',d.summary,'textarea'),n=field('One practical next step',d.next_step);
  s.input.rows=4;
  const related=document.createElement('p');
  const matches=known.filter(p=>p.title.split(/\s+/).some(w=>w.length>5&&d.summary.toLowerCase().includes(w.toLowerCase())));
  related.textContent=matches.length?'Possible connections: '+matches.map(p=>p.id+' '+p.title).join('; '):'New thread suggestion. Check existing threads before creating one.';
  const save=document.createElement('button');save.type='button';save.textContent='Save edits on this device';
  save.onclick=()=>{Object.assign(d,{title:t.input.value.trim(),summary:s.input.value.trim(),next_step:n.input.value.trim()});persist();say('Draft edits saved on this device.')};
  const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.required=true;check.style.minWidth='auto';label.append(check,document.createTextNode('I have reviewed this summary and approve these edited fields for public sharing.'));
  const publish=document.createElement('button');publish.textContent='Prepare public GitHub submission';
  form.onsubmit=e=>{e.preventDefault();const body='## Idea\n'+s.input.value.trim()+'\n\n## Next step\n'+n.input.value.trim()+'\n\nPublic summary reviewed and approved by submitter. Original transcript excluded.';const url='https://github.com/hoodwinky/unravelling-yarn/issues/new?title='+encodeURIComponent('[Idea] '+t.input.value.trim())+'&body='+encodeURIComponent(body);window.open(url,'_blank','noopener,noreferrer');say('GitHub submission prepared for final review. Submit the issue there to publish it.');};
  const remove=document.createElement('button');remove.type='button';remove.textContent='Discard draft';remove.onclick=()=>{queue.splice(i,1);persist();renderQueue()};
  form.append(t.box,s.box,n.box,related,save,label,publish,remove);el('inbox').append(form);
 });
}
el('extract').onclick=()=>{
 try{
  const candidates=Yarn.extract(el('transcript').value),existing=new Set([...queue.map(p=>Yarn.normalize(p.summary)),...known.map(p=>Yarn.normalize(p.summary))]);
  let added=0;for(const d of candidates){const n=Yarn.normalize(d.summary);if(existing.has(n))continue;existing.add(n);queue.push(d);added++}
  persist();renderQueue();say(added+' new suggestions added. Exact normalized duplicates skipped. These are keyword suggestions, not an AI interpretation.');el('transcript').value='';
 }catch(e){say(e.message)}
};
el('transcript-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1024*1024){say('Choose an excerpt or a file under 5 MB.');return}el('transcript').value=await f.text();say('File read on this device. Select Find idea suggestions to process it.');e.target.value=''};
el('export-inbox').onclick=()=>download(queue,'yarn-draft-inbox.json');
el('clear-inbox').onclick=()=>{queue=[];persist();renderQueue();say('Drafts removed from this device.')};
fetch('projects.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(p=>{Yarn.validate(p);known=p;renderQueue()}).catch(()=>say('Project index unavailable. Suggestions can be captured, but related-thread checks are unavailable.'));
renderQueue();
