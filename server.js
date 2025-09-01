const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const  { parse } = require( 'node-html-parser');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

const httpsAgent = new https.Agent({
  secureOptions: require('crypto').constants.SSL_OP_NO_SSLv3 | require('crypto').constants.SSL_OP_NO_TLSv1 | require('crypto').constants.SSL_OP_NO_TLSv1_1,  // Force TLSv1.2 and TLSv1.3 only
  rejectUnauthorized:true
});

const app = express();
app.use(bodyParser.json())
const headers = {
  "Host": "api.divar.ir",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
"Accept": "application/json, text/plain, */*",
"Accept-Language": "en-US,en;q=0.5",
"Accept-Encoding": "gzip, deflate, br, zstd",
"Content-Type": "application/json",
"Content-Length": "428",
"Referer": "https://divar.ir/",
"X-Standard-Divar-Error": "true",
"Origin": "https://divar.ir",
"Sec-Fetch-Dest": "empty",
"Sec-Fetch-Mode": "cors",
"Sec-Fetch-Site": "same-site",
"Connection": "keep-alive",
"Cookie": "did=54f94f6f-14ea-4b17-be84-327c10a11d38; _ga=GA1.2.1995042045.1690452011; _ga_SXEW31VJGJ=GS1.1.1722939450.93.1.1722939499.11.0.0; multi-city=shiraz%7C; city=shiraz; player_id=29979727-3890-4094-bc86-8c693bb9067d; FEATURE_FLAG=%7B%22flags%22%3A%7B%22enable-post-list-v2-web%22%3A%7B%22name%22%3A%22enable-post-list-v2-web%22%2C%22bool_value%22%3Atrue%2C%22routeLabels%22%3A%5B%22browse%22%2C%22new-browse%22%5D%7D%2C%22location_selector_enabled%22%3A%7B%22name%22%3A%22location_selector_enabled%22%2C%22bool_value%22%3Afalse%7D%2C%22navbar_first_tab_android%22%3A%7B%22name%22%3A%22navbar_first_tab_android%22%2C%22string_value%22%3A%22home%22%2C%22routeLabels%22%3A%5B%22browse%22%2C%22new-browse%22%5D%7D%2C%22custom_404_experiment%22%3A%7B%22name%22%3A%22custom_404_experiment%22%2C%22bool_value%22%3Afalse%7D%2C%22web_shopping_assistant_enabled%22%3A%7B%22name%22%3A%22web_shopping_assistant_enabled%22%2C%22bool_value%22%3Afalse%7D%2C%22web_shopping_assistant_test2_enabled%22%3A%7B%22name%22%3A%22web_shopping_assistant_test2_enabled%22%2C%22bool_value%22%3Afalse%7D%2C%22web_shopping_assistant_test3_enabled%22%3A%7B%22name%22%3A%22web_shopping_assistant_test3_enabled%22%2C%22bool_value%22%3Afalse%7D%2C%22dark_mode_enabled%22%3A%7B%22name%22%3A%22dark_mode_enabled%22%2C%22bool_value%22%3Atrue%7D%2C%22explore%22%3A%7B%22name%22%3A%22explore%22%2C%22bool_value%22%3Afalse%7D%7D%2C%22evaluatedAt%22%3A%222024-08-06T10%3A17%3A27.453490653Z%22%2C%22maximumCacheUsageSecondsOnError%22%3A86400%2C%22minimumRefetchIntervalSeconds%22%3A3600%2C%22expireDate%22%3A1722943047442%7D; _ga_WC29FSMWTF=GS1.1.1713877630.1.1.1713878251.23.0.0; LANGUAGE=fa; _gcl_au=1.1.608605986.1718221015; token=; chat_opened=; sessionid=; theme=dark; _gid=GA1.2.1171520809.1722939452; _gat=1; _gat_UA-32884252-2=1",
"TE": "trailers",
}
// Define the target server



app.post('/',async (req,res) => {
  const {data:requestData,url,method,headers:reqHeders} = req.body
  
  try {
    const getRes = await axios[method](url,requestData,{...headers,...reqHeders})
    const {data,headers:resHeaders,status} = getRes
    
    res.set(resHeaders)
    res.status(status)
    res.send(data)
  } catch (error) { 
    console.log(error)
    res.send({status:500,...error?.response?.data})
  }
});

app.post('/finnotech',async (req,res) => {
  const {body,url,method} = req.body
    
    
  const config = {headers:{
    ...req.headers,
    connection:undefined,
    'content-length': undefined,
    host:undefined,
  }}
  
  const params = method === 'get'? [url,config] :[url,body,config]

  try {
    const getRes = await axios[method](...params)
    
    res.send(getRes.data)
  } catch (error) { 
    console.log(error)
    const status = error?.response?.status ?? 500
    res.status(status).send({status,...error?.response?.data})
  }
});


const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
