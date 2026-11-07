function getFromLocalStorage(){return{user:localStorage.getItem('github_user'),repo:localStorage.getItem('github_repo'),branch:localStorage.getItem('github_branch')||'main',token:localStorage.getItem('github_token')}}
async function validateToken(token){const r=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${token}`}});return r.ok}
async function saveToGithub(path,data){
const{user,repo,branch,token}=getFromLocalStorage(),url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`,H={Authorization:`Bearer ${token}`};
const get=await fetch(`${url}?ref=${branch}`,{headers:H});let sha;
if(get.ok)({sha}=await get.json());else if(get.status!==404)throw new Error('Gagal membaca file: '+get.status);
const content=btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2))));
const put=await fetch(url,{method:'PUT',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({message:`CMS update ${path}`,content,sha,branch})});
if(!put.ok)throw new Error(put.status==401?'Token tidak valid atau kedaluwarsa':put.status==403||put.status==404?'Gagal menyimpan ('+put.status+'): token butuh izin Contents Read and write, atau nama user/repo/branch salah':put.status==409||put.status==422?'Konflik data ('+put.status+'). Muat ulang halaman admin lalu coba lagi':'Gagal menyimpan: '+put.status);return put.json()}
async function compressImage(file,max=1600){
if(!/^image\/(jpeg|png|webp)$/.test(file.type))return file;
const bmp=await createImageBitmap(file),k=Math.min(1,max/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');
c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
const blob=await new Promise(r=>c.toBlob(r,'image/webp',0.82));
return blob&&blob.type=='image/webp'&&blob.size<file.size?new File([blob],file.name.replace(/\.\w+$/,'')+'.webp',{type:'image/webp'}):file}
async function uploadImage(file){
if(file.size>15*1024*1024)throw new Error('Ukuran gambar asli maksimal 15 MB');
file=await compressImage(file);
if(file.size>1.5*1024*1024)throw new Error('Gambar masih di atas 1,5 MB setelah dikompres. Gunakan gambar yang lebih kecil.');
const{user,repo,branch,token}=getFromLocalStorage();
const b64=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.onerror=()=>no(new Error('Gagal membaca file'));r.readAsDataURL(file)});
const path='img/'+Date.now()+'-'+file.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-');
const res=await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${path}`,{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({message:'CMS upload '+path,content:b64,branch})});
if(!res.ok)throw new Error('Gagal mengunggah: '+res.status);return path}
async function loadFromGithub(path){const{user,repo,branch,token}=getFromLocalStorage();if(!token)return null;try{const r=await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${branch}&t=${Date.now()}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github.raw+json'},cache:'no-store'});return r.ok?await r.json():null}catch{return null}}
