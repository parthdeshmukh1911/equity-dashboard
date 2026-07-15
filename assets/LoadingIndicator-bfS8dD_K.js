import{_ as e,a as t,b as n,m as r,n as i,r as a,x as o}from"./index-yUM3Hthq.js";var s=t(`refresh-cw`,[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`,key:`v9h5vc`}],[`path`,{d:`M21 3v5h-5`,key:`1q7to0`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`,key:`3uifl3`}],[`path`,{d:`M8 16H3v5`,key:`1cv678`}]]),c=t(`settings`,[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]),l=e();function u(){let{isPrivacyMode:e,togglePrivacyMode:t}=r();return(0,l.jsx)(`button`,{onClick:t,className:`flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/70 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`,"aria-label":e?`Disable privacy mode`:`Enable privacy mode`,children:e?(0,l.jsx)(a,{size:18}):(0,l.jsx)(i,{size:18})})}var d=o(n(),1);function f({onRefresh:e,label:t=`Refresh data`}){let[n,r]=(0,d.useState)(!1);async function i(){if(!(n||!e)){r(!0);try{await e()}finally{r(!1)}}}return(0,l.jsx)(`button`,{type:`button`,onClick:i,disabled:n,"aria-label":n?`Refreshing data`:t,title:t,className:`flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/70 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`,children:(0,l.jsx)(s,{size:17,className:n?`animate-spin`:``,"aria-hidden":`true`})})}function p({loading:e}){return e?(0,l.jsxs)(`span`,{className:`relative flex h-3 w-3`,children:[(0,l.jsx)(`span`,{className:`
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
        `})]}):null}export{s as a,c as i,f as n,u as r,p as t};