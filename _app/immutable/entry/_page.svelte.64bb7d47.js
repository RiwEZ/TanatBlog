import{S as w,i as z,s as B,k as f,a as k,O as C,l as m,h as d,c as A,m as p,n as _,F as h,b as H,H as T,I as F,q as D,r as x}from"../chunks/index.cf4e1bb2.js";import{b as G}from"../chunks/paths.b82e3ada.js";function P(c,a,n){const l=c.slice();return l[2]=a[n],l}function $(c){let a,n,l,i=c[2].title+"",o,s,e,r,t=new Date(c[2].updatedAt).toLocaleDateString("en-gb",{year:"numeric",month:"long",day:"numeric"})+"",u,v,V=c[2].description+"",I,S;return{c(){a=f("a"),n=f("div"),l=f("h3"),o=D(i),s=k(),e=f("p"),r=f("strong"),u=D(t),v=D(`
            • `),I=D(V),S=k(),this.h()},l(g){a=m(g,"A",{href:!0});var b=p(a);n=m(b,"DIV",{class:!0});var E=p(n);l=m(E,"H3",{class:!0});var q=p(l);o=x(q,i),q.forEach(d),s=A(E),e=m(E,"P",{class:!0});var y=p(e);r=m(y,"STRONG",{});var O=p(r);u=x(O,t),O.forEach(d),v=x(y,`
            • `),I=x(y,V),y.forEach(d),E.forEach(d),S=A(b),b.forEach(d),this.h()},h(){_(l,"class","text-2xl font-bold"),_(e,"class","mt-2 text-zinc-400"),_(n,"class","cursor-pointer border-b border-gray-500 py-4"),_(a,"href",`${G}/blog/${c[2].slug}`)},m(g,b){H(g,a,b),h(a,n),h(n,l),h(l,o),h(n,s),h(n,e),h(e,r),h(r,u),h(e,v),h(e,I),h(a,S)},p:T,d(g){g&&d(a)}}}function L(c){let a,n,l,i,o=c[0],s=[];for(let e=0;e<o.length;e+=1)s[e]=$(P(c,o,e));return{c(){a=f("meta"),n=k(),l=f("div"),i=f("div");for(let e=0;e<s.length;e+=1)s[e].c();this.h()},l(e){const r=C("svelte-139mbn2",document.head);a=m(r,"META",{name:!0,content:!0}),r.forEach(d),n=A(e),l=m(e,"DIV",{class:!0});var t=p(l);i=m(t,"DIV",{class:!0});var u=p(i);for(let v=0;v<s.length;v+=1)s[v].l(u);u.forEach(d),t.forEach(d),this.h()},h(){document.title="Home | Tanat",_(a,"name","description"),_(a,"content","Developer Blog"),_(i,"class","container"),_(l,"class","mt-5")},m(e,r){h(document.head,a),H(e,n,r),H(e,l,r),h(l,i);for(let t=0;t<s.length;t+=1)s[t].m(i,null)},p(e,[r]){if(r&1){o=e[0];let t;for(t=0;t<o.length;t+=1){const u=P(e,o,t);s[t]?s[t].p(u,r):(s[t]=$(u),s[t].c(),s[t].m(i,null))}for(;t<s.length;t+=1)s[t].d(1);s.length=o.length}},i:T,o:T,d(e){d(a),e&&d(n),e&&d(l),F(s,e)}}}function M(c,a,n){let{data:l}=a,{posts:i}=l;return c.$$set=o=>{"data"in o&&n(1,l=o.data)},[i,l]}class j extends w{constructor(a){super(),z(this,a,M,L,B,{data:1})}}export{j as default};