import{t as e}from"./refresh-cw-CPqlLdji.js";import{C as t,D as n,O as r,_ as i,a,c as o,i as s}from"./index-IMxOUXoa.js";var c=o(`settings`,[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]),l=t();function u(){let{isPrivacyMode:e,togglePrivacyMode:t}=i();return(0,l.jsx)(`button`,{onClick:t,className:`flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)]`,style:{border:`1px solid var(--card-border)`,background:`var(--card-bg)`,color:`var(--text-2)`},"aria-label":e?`Disable privacy mode`:`Enable privacy mode`,children:e?(0,l.jsx)(a,{size:18}):(0,l.jsx)(s,{size:18})})}var d=r(n(),1);function f({onRefresh:t,label:n=`Refresh data`}){let[r,i]=(0,d.useState)(!1);async function a(){if(!(r||!t)){i(!0);try{await t()}finally{i(!1)}}}return(0,l.jsx)(`button`,{type:`button`,onClick:a,disabled:r,"aria-label":r?`Refreshing data`:n,title:n,className:`flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)]`,style:{border:`1px solid var(--card-border)`,background:`var(--card-bg)`,color:`var(--text-2)`},children:(0,l.jsx)(e,{size:17,className:r?`animate-spin`:``,"aria-hidden":`true`})})}function p({loading:e}){return e?(0,l.jsxs)(`span`,{className:`relative flex h-3 w-3`,children:[(0,l.jsx)(`span`,{className:`
          absolute
          inline-flex
          h-full
          w-full
          rounded-full
          bg-sky-400
          opacity-60
          animate-ping
        `}),(0,l.jsx)(`span`,{className:`
          relative
          inline-flex
          h-3
          w-3
          rounded-full
          bg-sky-500
        `})]}):null}export{c as i,f as n,u as r,p as t};