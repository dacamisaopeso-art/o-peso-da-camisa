export const attributes = ['pace','shooting','passing','dribbling','defending','physical','skills','weakFoot'] as const;
export type Attribute = typeof attributes[number];
export type Stats = Record<Attribute, number>;
export const positions = ['GOL','ZAG','ALA','VOL','MEI','MAR','PON','SA','ATA'] as const;
export type Position = typeof positions[number];
export type Mode = 'amador' | 'pro';
export type Speed = 'fast' | 'complete';
export interface Athlete {id:string; name:string; country:string; code:string; position:Position; era:number; overall:number; stats:Stats; tier:'icon'|'gold'|'silver'; source:string}
export interface Config {name:string; country:string; code:string; position:Position; mode:Mode; speed:Speed; seed:string}
export interface Pick {athleteId:string; attribute:Attribute; value:number}
export interface Draft {version:string; config:Config; deck:string[]; picks:Pick[]}
export interface Build {id:string; createdAt:string; config:Config; picks:Pick[]; stats:Stats; overall:number}
