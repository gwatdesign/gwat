/* Loads data/site.json (edited from the admin panel) before the page scripts run.
   If it can't be read (e.g. opened from disk), window.SITE stays null and the page keeps its built-in content. */
window.SITE=(function(){try{const x=new XMLHttpRequest();x.open('GET','data/site.json?v='+Date.now(),false);x.send();
  if((x.status===200||x.status===0)&&x.responseText)return JSON.parse(x.responseText)}catch(e){}return null})();
