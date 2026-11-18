(function(root){
'use strict';
const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function extract(input){
 let chunks=[],text=String(input).trim();
 if(text.startsWith('[')||text.startsWith('{')){
  let data;try{data=JSON.parse(text)}catch(e){throw Error('That JSON file is incomplete or invalid.')}
  const conversations=Array.isArray(data)?data:[data];
  for(const c of conversations){
   if(c.mapping){for(const v of Object.values(c.mapping)){const m=v.message;if(m&&m.author&&m.author.role==='user')chunks.push((m.content.parts||[]).filter(x=>typeof x==='string').join('\n'));}}
   else if(c.role==='user'&&typeof c.content==='string')chunks.push(c.content);
   else if(c.title&&c.summary)chunks.push(c.summary);
  }
  if(!chunks.length)throw Error('No supported user messages found. Paste selected text or use a ChatGPT conversation export.');
 }else if(/\b(?:user|assistant):/i.test(text)){
  const turns=text.split(/(?:^|\n)\s*(?:\d+\s*\n)?(?:\d{2}:\d{2}:\d{2}[,.]\d+\s*-->[^\n]*\n)?\s*(?=(?:user|assistant):)/i);
  chunks=turns.filter(s=>/^\s*user:/i.test(s)).map(s=>s.replace(/^\s*user:\s*/i,'').replace(/\n\s*\d+\s*\n\d{2}:\d{2}:\d{2}[\s\S]*$/,''));
 }else chunks=[text];
 const seen=new Set(),out=[];
 for(const chunk of chunks){
  for(const sentence of chunk.split(/\n+|(?<=[.!?])\s+/)){
   const summary=sentence.replace(/\s+/g,' ').trim();
   if(summary.length<15||!/\b(idea|project|campaign|build|create|start|design|develop|i want|we should|let.s|i need)\b/i.test(summary))continue;
   const key=normalize(summary);if(seen.has(key))continue;seen.add(key);
   out.push({title:summary.slice(0,100),summary,next_step:'',connections:[],stage:'concept',review_status:'pending',publication_approved:false});
  }
 }
 return out;
}
function validate(records){
 if(!Array.isArray(records))throw Error('Project data must be an array.');
 const ids=new Set(),titles=new Set(),stages=new Set(['concept','building','active','completed','archived']);
 for(const p of records){
  if(!p||typeof p!=='object')throw Error('Invalid project record.');
  for(const k of ['id','title','summary','next_step','source'])if(typeof p[k]!=='string'||!p[k].trim())throw Error('Missing required field: '+k);
  if(!/^yarn-[a-z0-9-]+$/.test(p.id)||ids.has(p.id))throw Error('Invalid or duplicate project ID: '+p.id);
  ids.add(p.id);const title=normalize(p.title);if(titles.has(title))throw Error('Duplicate project title: '+p.title);titles.add(title);
  if(!stages.has(p.stage))throw Error('Unknown project stage: '+p.stage);
  if(p.publication_approved!==true)throw Error('Public records require explicit approval: '+p.id);
  if(!Array.isArray(p.connections)||p.connections.some(x=>typeof x!=='string'))throw Error('Connections must be thread IDs.');
 }
 for(const p of records)for(const id of p.connections)if(!ids.has(id)||id===p.id)throw Error('Invalid project connection: '+id);
 return true;
}
const api={normalize,extract,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Yarn=api;
})(typeof globalThis==='undefined'?this:globalThis);
