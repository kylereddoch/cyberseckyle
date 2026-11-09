// Isolated build-only trial. No deploy or publishing step.
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const fixtures={
'listening.js':{configured:true,error:null,clientApiKey:null,username:'trial-fixture',profileUrl:'https://example.invalid/listening',nowPlaying:null,recentTracks:[{name:'Fixture track',artist:'Fixture artist',album:'Fixture album',image:'',url:null,nowPlaying:false,listenedAt:'2026-11-09',listenedAtUnix:'1794225600'}],topArtists:[],topAlbums:[]},
'bookshelf.js':{configured:true,error:null,profileUrl:'https://example.invalid/books',username:'trial-fixture',reading:[{title:'Fixture book',authors:['Test author'],statusLabel:'Currently Reading',url:'https://example.invalid/book',image:null}],finished:[],wantToRead:[],counts:{reading:1,finished:0,wantToRead:0}},
'webmentions.js':{configured:true,error:null,count:0,byTarget:{}},
'watchingApi.js':{url:''},
'newsletter.js':{apiUrl:'',turnstileSiteKey:'',previewMode:true,configured:false},
 'trakt.js':{configured:true,posterConfigured:false,error:null,username:'trial-fixture',profileUrl:'https://example.invalid/watching',recentActivity:[],movies:[],shows:[],stats:{movies:0,shows:0,episodes:0}}
};
for(const [name,value] of Object.entries(fixtures)){fs.writeFileSync('src/_data/'+name,'export default '+JSON.stringify(value,null,2)+';\n');}
fs.writeFileSync('trial-fixtures.json',JSON.stringify(fixtures,null,2));

fs.writeFileSync('trial-network-guard.cjs',"const fs=require('node:fs');\nconst deny=(kind)=>function(){fs.appendFileSync('blocked-network-second.log',kind+' blocked\\n');throw new Error('TRIAL_NETWORK_DISABLED: '+kind);};\nglobalThis.fetch=async function(input,opts={}){const u=new URL(typeof input==='string'?input:input.url||String(input));if(['d2gdx5nv84sdx2.cloudfront.net','upload.wikimedia.org'].includes(u.hostname)&&/\\.(png|svg)$/i.test(u.pathname)&&(!opts.method||opts.method==='GET')){fs.appendFileSync('image-fixture-requests.log',u.origin+u.pathname+'\\n');return new Response(fs.readFileSync('src/assets/images/logo.png'),{status:200,headers:{'content-type':'image/png'}});}return deny('fetch '+u.hostname)();};\nfor(const name of ['node:http','node:https']){const m=require(name);m.request=deny(name+'.request');m.get=deny(name+'.get');}const net=require('node:net');net.connect=deny('net.connect');net.createConnection=deny('net.createConnection');net.Socket.prototype.connect=deny('Socket.connect');require('node:tls').connect=deny('tls.connect');require('node:module').syncBuiltinESMExports();\r\n");
const names=['PATH','Path','SystemRoot','WINDIR','TEMP','TMP','COMSPEC','PATHEXT','HOME','USERPROFILE'];
const env=Object.fromEntries(names.filter(k=>process.env[k]).map(k=>[k,process.env[k]]));
Object.assign(env,{TZ:'America/Chicago',ELEVENTY_ENV:'production',CI:'true',NODE_OPTIONS:'--require="'+path.resolve('trial-network-guard.cjs').replaceAll('\\','/')+'"'});
const r=spawnSync(process.execPath,['node_modules/@11ty/eleventy/cmd.cjs','--pathprefix=/'],{env,stdio:'inherit'});
if(r.status!==0)process.exit(r.status||1);
console.log('TRIAL BUILD PASS',process.version,process.platform);
console.log('No deployment performed. Output contains fixtures and must not be published.');

