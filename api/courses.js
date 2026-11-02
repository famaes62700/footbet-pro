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
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de connexion API PMU');
        const data = await response.json();
        
        // Autorise le navigateur à lire les données (Anti-CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Serveur PMU indisponible" });
    }
}
