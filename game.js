(() => {
"use strict";
const parts=window.__AETHERUM_CHUNKS||[];
if(parts.length<3){document.body.insertAdjacentHTML("beforeend","<pre style=\"color:#f88;padding:1rem\">Missing game chunks</pre>");}
else (0,eval)(parts.join(""));
})();
