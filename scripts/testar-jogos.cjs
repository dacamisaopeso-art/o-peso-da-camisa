'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');let failed=0;
for(const file of fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.test.cjs')).sort()){
 const result=cp.spawnSync(process.execPath,[path.join(root,'tests',file)],{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:2*1024*1024});
 if(result.status!==0){failed++;console.error('FALHOU: '+file+'\n'+result.stdout+'\n'+result.stderr);}
 else console.log('OK: '+file);
}
if(failed)process.exitCode=1;
