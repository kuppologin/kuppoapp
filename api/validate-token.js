export default async function handler(req, res) {
  const { token } = req.query;
  
  const response = await fetch(`https://admin.kuppo.net/getData.php?token=${token}`);
  const data = await response.json();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}
