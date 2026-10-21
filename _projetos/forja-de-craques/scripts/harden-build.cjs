// As proteções precisam acompanhar cada novo bundle publicado.
const fs=require('node:fs'),path=require('node:path');
const file=path.resolve('dist/index.html');let page=fs.readFileSync(file,'utf8');
const policy="default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' https: data: blob:; connect-src 'self'; media-src 'self' blob: data:; worker-src 'self' blob:; form-action 'self'";
page=page.replace(/(<meta\s+charset=[^>]+>)/i,'$1<meta http-equiv="Content-Security-Policy" content="'+policy+'"><script src="../opc-preferences.js?v=3"></script><link rel="stylesheet" href="../opc-preferences.css?v=3"><meta name="referrer" content="strict-origin-when-cross-origin">');
page=page.replace('</head>','<link rel="stylesheet" href="../site-base.css?v=20261014"><link rel="icon" href="../imagens/favicon-opc.png"></head>').replace('</body>','<script defer src="../site-base.js?v=20261021-social"></script></body>');
fs.writeFileSync(file,page);
