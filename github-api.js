function getFromLocalStorage(){return{user:localStorage.getItem('github_user'),repo:localStorage.getItem('github_repo'),branch:localStorage.getItem('github_branch')||'main',token:localStorage.getItem('github_token')}}
async function validateToken(token){const r=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${token}`}});return r.ok}
async function saveToGithub(path,data){
const{user,repo,branch,token}=getFromLocalStorage(),url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`,H={Authorization:`Bearer ${token}`};
const get=await fetch(`${url}?ref=${branch}`,{headers:H});let sha;
if(get.ok)({sha}=await get.json());else if(get.status!==404)throw new Error('Gagal membaca file: '+get.status);
const content=btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2))));
const put=await fetch(url,{method:'PUT',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({message:`CMS update ${path}`,content,sha,branch})});
if(!put.ok)throw new Error('Gagal menyimpan: '+put.status);return put.json()}
