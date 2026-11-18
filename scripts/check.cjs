'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {extract,validate}=require('../capture.js');
const projects=JSON.parse(fs.readFileSync('projects.json','utf8'));
validate(projects);
for(const patch of [{id:projects[1].id},{title:projects[1].title},{publication_approved:false},{summary:''},{connections:['missing']},{connections:[projects[0].id]}]){
 const bad=structuredClone(projects);Object.assign(bad[0],patch);assert.throws(()=>validate(bad));
}
const text='I want to create a garden project. I want to create a garden project.\nThe weather is nice.';
const ideas=extract(text);assert.equal(ideas.length,1);assert.equal(ideas[0].publication_approved,false);assert.equal(ideas[0].review_status,'pending');
const srt='1\n00:00:01,000 --> 00:00:03,000\nuser: I want to build a community garden.\n\n2\n00:00:04,000 --> 00:00:05,000\nassistant: Create a different project.';
const turns=extract(srt);assert.equal(turns.length,1);assert.match(turns[0].summary,/community garden/);assert.doesNotMatch(turns[0].summary,/assistant|different project|00:00/);
const exported=[{mapping:{a:{message:{author:{role:'user'},content:{parts:['I want to create an accessible art project.']}}},b:{message:{author:{role:'assistant'},content:{parts:['Create another project.']}}}}}];
assert.equal(extract(JSON.stringify(exported)).length,1);assert.throws(()=>extract('{oops'));
assert.equal(extract('I want to create a garden project!\nI WANT TO CREATE A GARDEN PROJECT.').length,1);
assert.equal(extract('<script>alert(1)</script>').length,0);
for(const file of ['capture.js','inbox.js'])new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
const html=fs.readFileSync('index.html','utf8');
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
for(const file of ['capture.js','inbox.js'])assert.ok(html.includes('src="'+file+'"'));
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
console.log('PASS: public records, rejection gates, duplicate detection, SRT/JSON speaker filtering and JavaScript syntax.');
if(process.argv.includes('--build')){
 fs.mkdirSync('_site',{recursive:true});
 const built=html.replace(/const seed=\[[\s\S]*?\];\nlet projects=/,'const seed='+JSON.stringify(projects)+';\nlet projects=');
 fs.writeFileSync('_site/index.html',built);
 for(const file of ['capture.js','inbox.js','projects.json'])fs.copyFileSync(file,'_site/'+file);
 fs.writeFileSync('_site/.nojekyll','');
 console.log('Built explicit public assets in _site.');
}
