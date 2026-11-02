export default async function handler(req, res) {
    const { target } = req.query;
    if (!target) return res.status(400).json({ error: "Cible manquante" });

    // Canal 61 = Programme "Point de Vente" (Filtre uniquement les réunions principales)
    const url = `https://offline.turfinfo.api.pmu.fr/rest/client/61/programme/${target}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Origin': 'https://www.pmu.fr',
                'Referer': 'https://www.pmu.fr/'
            }
        });
        
        if (!response.ok) return res.status(response.status).json({ error: "PMU bloqué" });
        
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur réseau PMU" });
    }
}
