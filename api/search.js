module.exports = async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const query=String(req.query.query||'').trim().slice(0,80);
  const key=process.env.SCRAPECREATORS_API_KEY||req.headers['x-api-key'];
  if(!key)return res.status(400).json({error:'ScrapeCreators API key is missing'});
  if(!query)return res.status(400).json({error:'Username is required'});
  try{
    const upstream=await fetch('https://api.scrapecreators.com/v1/tiktok/search/users?query='+encodeURIComponent(query),{headers:{'x-api-key':key,'accept':'application/json'}});
    const data=await upstream.json();
    if(!upstream.ok)return res.status(upstream.status).json({error:data.error||data.message||'ScrapeCreators request failed'});
    return res.status(200).json({users:data.users||data.results||[]});
  }catch(e){return res.status(502).json({error:'Could not reach ScrapeCreators'})}
};
