# node_react_app

Projekti jaoks on vaja installida Node.js oma arvutisse, sobib uusim LTS versioon.
Projekti käivitamiseks on vaja kõigepealt installida vajalikud npm paketid. 
Selle jaoks käivitada käsk "npm install" projekti juurkataloogis ning ka kaustades
client ja server. Server kausta peaks paigutama ka .env faili, seal sees on kasutusel olevad API keyd ja muud tähtsad asjad. Kui nüüd seejärel käivitada käsk "npm start" projekti juurkataloogis, siis
peaksid frontend ja backend rakendused minema tööle samaaegselt. React rakendus peaks avama 
ennast ise automaatselt brauseris, kui on algse laadimise lõpetanud.

Mõned asjad, mis on rakenduses natuke erinevad nõuetest:
1) Postmark asemel kasutasin Sendgridi. Kuna Postmarki jaoks sai registreeruda vaid 
töö emailiga, siis otsustasin kasutada mingit muud teenust. See tähendab aga, 
et kirjad mis saadetakse võivad minna spami alla. Ise kasutasin testimiseks Mailsac-i,
 mis võimaldab luua kiiresti test email kontosi.

2) ESLint konfi fail pole ilmselt see sama, mis nõutud oli. Kasutasin Reacti rakenduse 
loomiseks Create-React-App nimelist abimeest. Hiljem aga avastasin, et enda ESLint 
konfi faili pole lihtsat moodi võimalik lisada. ESLint on küll seal kasutusel, 
aga mitte ilmselt täpselt sama reeglistikuga.
