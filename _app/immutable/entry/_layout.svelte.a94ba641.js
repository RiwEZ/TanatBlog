import{S as G,i as H,s as J,k as w,q as K,a as D,C as A,l as y,m as g,r as M,h as m,c as I,D as E,n as t,E as T,b as C,F as d,G as W,H as L,I as O,J as P,K as Q,y as U,z as X,A as Y,L as Z,M as ee,N as te,g as R,d as S,B as se}from"../chunks/index.cf4e1bb2.js";import{b as N}from"../chunks/paths.b82e3ada.js";import{p as re}from"../chunks/stores.8af7bfa2.js";function j(l,e,a){const c=l.slice();return c[4]=e[a],c}function F(l){let e,a=l[4].name+"",c,o;return{c(){e=w("a"),c=K(a),o=D(),this.h()},l(n){e=y(n,"A",{href:!0,class:!0});var r=g(e);c=M(r,a),o=I(r),r.forEach(m),this.h()},h(){t(e,"href",l[4].href),t(e,"class","svelte-x7xvyt"),T(e,"active",l[4].href===l[0].url.pathname)},m(n,r){C(n,e,r),d(e,c),d(e,o)},p(n,r){r&5&&T(e,"active",n[4].href===n[0].url.pathname)},d(n){n&&m(e)}}}function ae(l){let e,a,c,o,n,r,s,i,p,v,x,V,q,k=l[2],h=[];for(let u=0;u<k.length;u+=1)h[u]=F(j(l,k,u));return{c(){e=w("nav"),a=w("a"),c=K("TANAT"),o=D(),n=w("div");for(let u=0;u<h.length;u+=1)h[u].c();r=D(),s=w("div"),i=A("svg"),p=A("line"),v=A("line"),x=A("line"),this.h()},l(u){e=y(u,"NAV",{class:!0});var _=g(e);a=y(_,"A",{href:!0,class:!0});var f=g(a);c=M(f,"TANAT"),f.forEach(m),o=I(_),n=y(_,"DIV",{class:!0});var b=g(n);for(let B=0;B<h.length;B+=1)h[B].l(b);b.forEach(m),r=I(_),s=y(_,"DIV",{class:!0,"aria-hidden":!0});var z=g(s);i=E(z,"svg",{width:!0,preserveAspectRatio:!0,viewBox:!0,fill:!0,xmlns:!0});var $=g(i);p=E($,"line",{x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0,"stroke-width":!0,"stroke-linecap":!0}),g(p).forEach(m),v=E($,"line",{x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0,"stroke-width":!0,"stroke-linecap":!0}),g(v).forEach(m),x=E($,"line",{x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0,"stroke-width":!0,"stroke-linecap":!0}),g(x).forEach(m),$.forEach(m),z.forEach(m),_.forEach(m),this.h()},h(){t(a,"href",N+"/"),t(a,"class","logo text3d text-5xl font-bold svelte-x7xvyt"),t(n,"class","dropdown-link-container flex text-center text-xl font-light md:mt-4 md:space-x-4 svelte-x7xvyt"),t(p,"x1","1"),t(p,"y1","1"),t(p,"x2","79"),t(p,"y2","1"),t(p,"stroke","white"),t(p,"stroke-width","3"),t(p,"stroke-linecap","round"),t(v,"x1","1"),t(v,"y1","41"),t(v,"x2","79"),t(v,"y2","41"),t(v,"stroke","white"),t(v,"stroke-width","3"),t(v,"stroke-linecap","round"),t(x,"x1","1"),t(x,"y1","21"),t(x,"x2","79"),t(x,"y2","21"),t(x,"stroke","white"),t(x,"stroke-width","3"),t(x,"stroke-linecap","round"),t(i,"width","30"),t(i,"preserveAspectRatio","none"),t(i,"viewBox","0 0 80 42"),t(i,"fill","none"),t(i,"xmlns","http://www.w3.org/2000/svg"),t(s,"class","bars mt-5 svelte-x7xvyt"),t(s,"aria-hidden","true"),t(e,"class","flex justify-between font-sans svelte-x7xvyt"),T(e,"dropdown-opened",l[1])},m(u,_){C(u,e,_),d(e,a),d(a,c),d(e,o),d(e,n);for(let f=0;f<h.length;f+=1)h[f].m(n,null);d(e,r),d(e,s),d(s,i),d(i,p),d(i,v),d(i,x),V||(q=W(s,"click",l[3]),V=!0)},p(u,[_]){if(_&5){k=u[2];let f;for(f=0;f<k.length;f+=1){const b=j(u,k,f);h[f]?h[f].p(b,_):(h[f]=F(b),h[f].c(),h[f].m(n,null))}for(;f<h.length;f+=1)h[f].d(1);h.length=k.length}_&2&&T(e,"dropdown-opened",u[1])},i:L,o:L,d(u){u&&m(e),O(h,u),V=!1,q()}}}function ne(l,e,a){let c;P(l,re,s=>a(0,c=s));let o=!1;const n=[{name:"Works",href:N+"/works"},{name:"About",href:N+"/about"},{name:"Contact",href:N+"/contact"}],r=()=>{a(1,o=!o)};return l.$$.update=()=>{l.$$.dirty&1&&c.url.href&&a(1,o=!1)},[c,o,n,r]}class le extends G{constructor(e){super(),H(this,e,ne,ae,J,{})}}function oe(l){let e,a,c,o;a=new le({});const n=l[1].default,r=Q(n,l,l[0],null);return{c(){e=w("div"),U(a.$$.fragment),c=D(),r&&r.c(),this.h()},l(s){e=y(s,"DIV",{class:!0});var i=g(e);X(a.$$.fragment,i),c=I(i),r&&r.l(i),i.forEach(m),this.h()},h(){t(e,"class","mx-auto mt-6 p-4 text-zinc-50 sm:max-w-3xl lg:p-2 3xl:max-w-7xl")},m(s,i){C(s,e,i),Y(a,e,null),d(e,c),r&&r.m(e,null),o=!0},p(s,[i]){r&&r.p&&(!o||i&1)&&Z(r,n,s,s[0],o?te(n,s[0],i,null):ee(s[0]),null)},i(s){o||(R(a.$$.fragment,s),R(r,s),o=!0)},o(s){S(a.$$.fragment,s),S(r,s),o=!1},d(s){s&&m(e),se(a),r&&r.d(s)}}}function ie(l,e,a){let{$$slots:c={},$$scope:o}=e;return l.$$set=n=>{"$$scope"in n&&a(0,o=n.$$scope)},[o,c]}class he extends G{constructor(e){super(),H(this,e,ie,oe,J,{})}}export{he as default};