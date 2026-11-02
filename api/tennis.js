export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    try {
        // Appel sécurisé côté serveur vers l'agrégateur de scores en direct
        const response = await fetch(`https://api.sofascore.com/api/v1/sport/tennis/scheduled-events/${targetDate}`);
        if (!response.ok) throw new Error("Erreur de récupération externe");

        const data = await response.json();
        const events = data.events || [];

        const matches = events.map(ev => ({
            id: ev.id.toString(),
            status: ev.status.type === 'inprogress' ? 'IN_PLAY' : (ev.status.type === 'finished' ? 'FINISHED' : 'TIMED'),
            utcDate: new Date(ev.startTimestamp * 1000).toISOString(),
            competition: { name: ev.tournament?.name || "ATP / WTA Tour" },
            homeTeam: { name: ev.homeTeam?.name || "Joueur 1" },
            awayTeam: { name: ev.awayTeam?.name || "Joueur 2" },
            score: {
                current: { home: ev.homeScore?.current ?? 0, away: ev.awayScore?.current ?? 0 },
                fullTime: { home: ev.homeScore?.display ?? ev.homeScore?.current ?? 0, away: ev.awayScore?.display ?? ev.awayScore?.current ?? 0 }
            }
        }));

        return res.status(200).json({ matches });
    } catch (error) {
        return res.status(500).json({ error: "Impossible de charger les matchs en direct." });
    }
}
