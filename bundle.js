!function(t){var e={};function r(a){if(e[a])return e[a].exports;var i=e[a]={i:a,l:!1,exports:{}};return t[a].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(a,i,function(e){return t[e]}.bind(null,i));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){t.exports=r(1)},function(t,e,r){"use strict";function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.r(e);class i{static info(t){i.level>=1&&i.log(t)}static debug(t){i.level>=2&&i.log(t)}static trace(t){i.level>=3&&i.log(t)}}function n(t,e){return i.trace("Creating notification..."),t.alert({message:e,duration:10,display:"success"})}async function s(t,e,r){return i.trace("Starting new set"),t.set("card","shared",{POMORELLO_ACTIVE:!0,POMORELLO_BREAK:!1,POMORELLO_START:Date.now(),POMORELLO_SET_LENGTH:6e4*e,POMORELLO_BREAK_LENGTH:6e4*r})}function o(t){i.trace("Showing dropdown powerup menu");const e={text:"Short Set:\n 15m active, 3m break, 9m long break",callback:t=>s(t,15,3)},r={text:"Standard Set:\n25m active, 5m break, 15m long break",callback:t=>s(t,25,5)},a={text:"Long Set:\n 45m active, 10m break, 30m long break",callback:t=>s(t,45,5)};let n={};i.level>=2&&(n={text:"Debug Set: 1m active, 10s break, 30s long break",callback:t=>s(t,1,1/6)}),t.popup({title:"Start a Pomodoro",items:[e,r,a,n]})}a(i,"level",3),a(i,"log",console.log);const c="./target.svg",l="./clock.svg",d="./single-bed.svg";function h(t){i.trace(`Formatting time from ${t}`);const e=Math.floor(t/3600)%24,r=e.toFixed(0),a=(Math.floor(t/60)%60).toFixed(0),n=(t%60).toFixed(0);return e?`${r} hrs, ${a} mins`:`${a} mins, ${n} seconds`}class u{constructor(t=10){i.trace(`Constructing new card with refresh ${t}`),this.is_active=!1,this.is_break=!1,this.start_ms=0,this.set_length=15e5,this.break_length=3e5,this.break_parity=0,this.set_hist={},this.name="?",this.refresh=t}async fetch(t){i.trace("Fetching data");const e=t.card("name");let r=await t.getAll();r=r.card.shared||{},i.trace("Got data"),this.is_active=r.POMORELLO_ACTIVE||this.is_active,this.is_break=r.POMORELLO_BREAK||this.is_break,this.start_ms=r.POMORELLO_START||this.start_ms,this.set_length=r.POMORELLO_SET_LENGTH||this.set_length,this.break_length=r.POMORELLO_BREAK_LENGTH||this.break_length,this.break_parity=r.POMORELLO_BREAK_PARITY||this.break_parity,this.set_hist=r.POMORELLO_SET_HISTORY||this.set_hist,this.name=(await e).name,i.info(JSON.stringify(this,null,2))}async sync(t){return i.trace(`Syncing card ${this.name}`),t.set("card","shared",{POMORELLO_ACTIVE:this.is_active,POMORELLO_BREAK:this.is_break,POMORELLO_START:this.start_ms,POMORELLO_SET_LENGTH:this.set_length,POMORELLO_BREAK_LENGTH:this.break_length,POMORELLO_BREAK_PARITY:this.break_parity,POMORELLO_SET_HISTORY:this.set_hist})}age(){const t=Date.now()-this.start_ms;return i.trace(`Computing age for card ${this.name}: ${t}`),t}timeStr(){let t;i.trace(`Formatting time for card ${this.name}`),this.is_active?t=this.set_length:this.is_break&&(t=this.break_length,this.break_parity%3==0&&(t*=3));const e=t-this.age();let r=Math.floor(e/1e3);return this.refresh&&(r=this.refresh*Math.ceil(r/this.refresh)),h(r)}addSet(){i.trace(`Incrementing history of completed set for card ${this.name}`);const t=this.set_hist[this.set_length]||0;this.set_hist[this.set_length]=t+1,this.break_parity+=1}}function _(t,e){return t.refresh?{refresh:t.refresh,...e}:e}function g(t){i.debug(`Displaying empty badge for card ${t.name}`);return _(t,{})}function f(t){i.debug(`Displaying status badge for card ${t.name}`);const e={icon:l,title:"Pomorello",text:`Pomodoro: ${t.timeStr()}`,color:"green"};return _(t,e)}function b(t){if(t.break_parity%3==0)return m(t);i.debug(`Displaying break badge for card ${t.name}`);const e={icon:d,title:"Pomorello",text:`Break: ${t.timeStr()}`,color:"blue"};return _(t,e)}function m(t){i.debug(`Displaying long break badge for card ${t.name}`);t.timeStr();return _(t,break_badge)}window.TrelloPowerUp.initialize({"card-buttons":async()=>[{icon:c,text:"Pomorello",callback:o}],"card-badges":t=>(i.trace("Loading card-badges"),[{dynamic:async()=>{const e=new u;i.debug("State initialized"),await e.fetch(t),i.info(`State retrieved for card ${e.name}`);const r=e.age();return e.is_active?(i.trace("Pomodoro active"),r>e.set_length?(i.trace("Pomodoro expired"),await async function(t,e){return i.trace(`Pomodoro for card ${e.name} finished.`),n(t,`Pomodoro for card ${e.name} complete.\nTime to take a break!`),e.is_active=!1,e.is_break=!0,e.start_ms=Date.now(),e.addSet(),e.sync(t)}(t,e),b(e)):(i.trace("Pomodoro in progress"),f(e))):e.is_break?(i.trace("Break active"),r>e.break_length?(i.trace("Break expired"),await async function(t,e){return i.trace(`Break for card ${e.name} finished.`),n(t,`Break for card ${e.name} has ended!`),e.is_active=!1,e.is_break=!1,e.sync(t)}(t,e),g(e)):(i.trace("Break in progress"),b(e))):(i.trace("No Pomodoro active"),g(e))}}]),"card-detail-badges":t=>(i.trace("Loading card-detail-badges"),[{dynamic:async()=>{const e=new u;return await e.fetch(t),e.is_active?f(e):e.is_break?b(e):g(e)}},{dynamic:async()=>{const e=new u;return await e.fetch(t),StatsBadge(e)}}])})}]);