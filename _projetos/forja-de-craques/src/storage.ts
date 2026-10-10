import {restore,finish,createDraft,VERSION} from './engine/draft';
import type {Build,Draft} from './engine/types';
const CURRENT='opc-forja:current:v1',HISTORY='opc-forja:builds:v1';
export function loadDraft():Draft|null {try{return restore(JSON.parse(localStorage.getItem(CURRENT)||'null'));}catch{return null;}}
export function saveDraft(d:Draft|null):boolean {try{if(d)localStorage.setItem(CURRENT,JSON.stringify(d));else localStorage.removeItem(CURRENT);return true;}catch{return false;}}
export function readBuilds():Build[] {try{const list=JSON.parse(localStorage.getItem(HISTORY)||'[]');if(!Array.isArray(list))return [];return list.slice(0,50).flatMap((b:Build)=>{try{if(!b||!Number.isFinite(Date.parse(b.createdAt))||b.picks?.length!==8)return [];const base=createDraft(b.config),d=restore({...base,version:VERSION,picks:b.picks});if(!d)return [];return [finish(d,b.createdAt)];}catch{return [];}});}catch{return [];}}
export function persistBuild(b:Build):boolean {try{const records=readBuilds();const existing=records.find(x=>x.id===b.id);localStorage.setItem(HISTORY,JSON.stringify([existing||b,...records.filter(x=>x.id!==b.id)].slice(0,50)));return true;}catch{return false;}}
