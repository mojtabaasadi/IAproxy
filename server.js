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
  
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
"Accept": "application/json, text/plain, */*",
"Accept-Language": "en-US,en;q=0.5",
"Accept-Encoding": "gzip, deflate, br, zstd",
"Content-Type": "application/json",
"Connection": "keep-alive",
}




app.post('/',async (req,res) => {
  const {data:requestData,url,method,headers:reqHeders} = req.body
  console.log({...headers,...reqHeders})
  try {
    const getRes = await axios[method](url,requestData,{...headers,...reqHeders})
    const {data,headers:resHeaders,status} = getRes
    
    res.set(resHeaders)
    res.status(status)
    res.send(data)
  } catch (error) { 
    
    res.status(500)
    res.send(error?.response?.data)
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
