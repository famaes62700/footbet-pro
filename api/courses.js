export default async function handler(req, res) {
    const { date, r, c } = req.query;
    
    if (!date) {
        return res.status(400).json({ error: "Date manquante" });
    }

    // Construction de l'URL officielle PMU
    let url = `https://offline.turfinfo.api.pmu.fr/rest/client/1/programme/${date}`;
    
    // Si la requête cible une course précise (R et C)
    if (r && c) {
        url += `/R${r}/C${c}`;
    }

    try {
        // Ajout du déguisement "Navigateur Web" pour contourner le blocage du PMU
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://www.pmu.fr',
                'Referer': 'https://www.pmu.fr/'
            }
        });
        
        if (!response.ok) throw new Error('Erreur de connexion API PMU');
        
        const data = await response.json();
        
        // Autorise le navigateur à lire les données (Anti-CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Serveur PMU indisponible" });
    }
}
