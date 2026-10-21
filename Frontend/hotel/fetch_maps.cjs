const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.google.com/maps/place/The+Kasar+Himalyan+Heights+(Satya%E2%80%99s)/@29.6414511,79.6604264,18.2z/data=!4m10!3m9!1s0x39a0b759f096cefd:0xfd1e3780fb315c22!5m3!1s2027-01-11!4m1!1i2!8m2!3d29.641388!4d79.6635582!16s%2Fg%2F11h0ykmn2s';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [...new Set(data.match(/https:\/\/lh[0-9]\.googleusercontent\.com\/[^\s"'\\]+/g) || [])];
    console.log('Found', urls.length, 'googleusercontent URLs');
    fs.writeFileSync(path.join(__dirname, 'extracted_maps_urls.json'), JSON.stringify(urls, null, 2));
    console.log(urls.slice(0, 20));
  });
}).on('error', (err) => {
  console.error(err);
});
