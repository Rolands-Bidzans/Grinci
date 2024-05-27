const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

db.insertInvice('SIA Valsts', 'Rīgas iela 6, Daugavpils', 'Reinis Velmeris', 'Zilo iela 17, Tukums', 12.12, '2024-01-01', '2024-01-01', false, null, 1, 4, '2024-01-01')
db.insertInvice('SIA Enefit', 'Rīgas iela 12, Daugavpils', 'Rolands Bidzāns', 'Zilo iela 23, Tukums', 1212.12, '2024-04-01', '2024-06-01', false, null, 1, 4, '2024-01-01')
db.insertInvice('SIA Lakstīgala', 'Rīgas iela 90, Daugavpils', 'Andrejs Kopņins', 'Zilo iela 44, Tukums', 4000.12, '2024-05-01', '2024-06-01', false, null, 1, 4, '2024-01-01')
