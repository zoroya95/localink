import { NextRequest, NextResponse } from 'next/server';
import polyline from '@mapbox/polyline';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';
import { parse } from 'cookie';


interface KMLPoint {
  Nom: string;
  Latitude: number;
  Longitude: number;
  Description: string;
}


// Interface pour typer les données reçues du formulaire
interface KMLRequestData {
    nomEntreprise: string;
    urlEntreprise: string;
    telEntreprise: string;
    motsCles: string;
    adresseDepart: string;
    nombrePoints: number;
    nombreCercles: number;
    nombreItineraires: number;
}

// Fonction pour générer les points de données (équivalent de generer_donnees)
function generateDataPoints(data: KMLRequestData, center: { lat: number; lng: number }) {
  const keywords = data.motsCles.split(';').map(kw => kw.trim()).filter(Boolean);
  if (!keywords.length) return { points: [], circleRadii: [] };

  const companyDescription =
    `${data.nomEntreprise} — <a href="${data.urlEntreprise}" target="_blank">Site web</a>, Tel : <a href="tel:${data.telEntreprise}">${data.telEntreprise}</a>`;

  const allPoints: KMLPoint[] = [];
  const circleRadii: number[] = [];
  let keywordIndex = 0;
  const pointsPerCircle = Math.max(1, Math.floor(data.nombrePoints / data.nombreCercles));
  const circleSpacing = 0.05;
  const firstCircleRadius = 0.04;

  for (let i = 0; i < data.nombreCercles; i++) {
    const currentRadius = firstCircleRadius + (i * circleSpacing);
    circleRadii.push(currentRadius);

    for (let j = 0; j < pointsPerCircle; j++) {
      const angle = (2 * Math.PI / pointsPerCircle) * j;
      const latOffset = currentRadius * Math.sin(angle);
      const lngOffset = currentRadius * Math.cos(angle) / Math.cos(center.lat * Math.PI / 180);
      const currentKeyword = keywords[keywordIndex % keywords.length];

      allPoints.push({
        Nom: currentKeyword,
        Latitude: center.lat + latOffset,
        Longitude: center.lng + lngOffset,
        Description: `<b>Service :</b> ${currentKeyword}<br>${companyDescription}`,
      });
      keywordIndex++;
    }
  }
  return { points: allPoints, circleRadii };
}

// Fonction pour construire la chaîne de caractères KML (équivalent de generer_carte_complete)
async function generateKMLString(
  data: KMLRequestData,
  center: { lat: number; lng: number },
  points: KMLPoint[],
  circleRadii: number[]
): Promise<string> {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    // Fonction utilitaire pour générer les coordonnées d'un cercle
    const createCircleCoords = (lat: number, lng: number, radius: number, segments = 100) => {
        let coords = '';
        for (let i = 0; i <= segments; i++) {
            const angle = (2 * Math.PI / segments) * i;
            const dx = radius * Math.cos(angle) / Math.cos(lat * Math.PI / 180);
            const dy = radius * Math.sin(angle);
            coords += `${lng + dx},${lat + dy},0\n`;
        }
        return coords;
    };

    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Carte SEO pour ${data.nomEntreprise}</name>
    <Style id="poly-red"><PolyStyle><color>640000ff</color></PolyStyle></Style>
    <Style id="poly-blue"><PolyStyle><color>64ff0000</color></PolyStyle></Style>
    <Style id="poly-green"><PolyStyle><color>6400ff00</color></PolyStyle></Style>
    <Style id="route-style"><LineStyle><color>ff0000ff</color><width>4</width></LineStyle></Style>
`;

    // 1. Polygones en anneau
    const polyColors = ['#poly-red', '#poly-blue', '#poly-green'];
    let innerRadius = 0;
    for (let i = 0; i < circleRadii.length; i++) {
        const outerRadius = circleRadii[i];
        kmlContent += `<Placemark>
      <name>Zone ${i + 1}</name>
      <styleUrl>${polyColors[i % polyColors.length]}</styleUrl>
      <Polygon>
        <outerBoundaryIs><LinearRing><coordinates>${createCircleCoords(center.lat, center.lng, outerRadius)}</coordinates></LinearRing></outerBoundaryIs>
        ${innerRadius > 0 ? `<innerBoundaryIs><LinearRing><coordinates>${createCircleCoords(center.lat, center.lng, innerRadius)}</coordinates></LinearRing></innerBoundaryIs>` : ''}
      </Polygon>
    </Placemark>
`;
        innerRadius = outerRadius;
    }

    // 2. Points
    for (const point of points) {
        kmlContent += `<Placemark>
      <name>${point.Nom}</name>
      <description><![CDATA[${point.Description}]]></description>
      <Point><coordinates>${point.Longitude},${point.Latitude},0</coordinates></Point>
    </Placemark>
`;
    }

    // 3. Itinéraires
    if (points.length > 0 && data.nombreItineraires > 0) {
        for (let i = 0; i < data.nombreItineraires; i++) {
            const destPoint = points[Math.floor(i * (points.length / data.nombreItineraires))];
            try {
                const response = await fetch(
                    "https://routes.googleapis.com/directions/v2:computeRoutes",
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": GOOGLE_API_KEY!,
                            "X-Goog-FieldMask": "routes.polyline.encodedPolyline"
                        },
                        body: JSON.stringify({
                            origin: { location: { latLng: { latitude: center.lat, longitude: center.lng } } },
                            destination: { location: { latLng: { latitude: destPoint.Latitude, longitude: destPoint.Longitude } } },
                            travelMode: "DRIVE",
                        })
                    }
                );
                if (!response.ok)
                    throw new Error(`Google Routes API error: ${response.statusText}`);
                const routeData = await response.json();
                
                if (routeData.routes && routeData.routes.length > 0) {
                    const encodedPolyline = routeData.routes[0].polyline.encodedPolyline;
                    const decodedCoords = polyline
                        .decode(encodedPolyline)
                        .map(([lat, lng]) => `${lng},${lat},0`)
                        .join('\n');
                    kmlContent += `<Placemark>
            <name>Itinéraire ${i + 1}</name>
            <styleUrl>#route-style</styleUrl>
            <LineString><coordinates>${decodedCoords}</coordinates></LineString>
          </Placemark>
`;
                }
            } catch (error) {
                console.error("Route generation error:", error);
            }
        }
    }

    kmlContent += `  </Document>
</kml>`;

    return kmlContent;
}

export async function POST(request: NextRequest) {
    try {
        // 1. Vérification de l'authentification
        const cookiesHeader = request.headers.get('cookie');
        if (!cookiesHeader) {
            return new NextResponse(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
        }

        const cookies = parse(cookiesHeader);
        const token = cookies.session;

        if (!token) {
            return new NextResponse(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
        }

        const sessionResult = await validateSessionToken(token);
        if (!sessionResult.user || !sessionResult.user.id) {
            return new NextResponse(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
        }

        const userId = sessionResult.user.id;

        // 2. Récupération des données du corps
        const data: KMLRequestData = await request.json();
        const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

        if (!GOOGLE_API_KEY) {
            return new NextResponse(JSON.stringify({ error: "Clé API Google non configurée." }), { status: 500 });
        }

        // 3. Upsert avec le userId de la session
        await prisma.client.upsert({
            where: {
                userId_nomEntreprise: {
                    userId: userId,
                    nomEntreprise: data.nomEntreprise,
                }
            },
            update: {
                urlEntreprise: data.urlEntreprise,
                telEntreprise: data.telEntreprise,
                motsCles: data.motsCles,
                adresseDepart: data.adresseDepart,
                updatedAt: new Date(),
            },
            create: {
                userId: userId,
                nomEntreprise: data.nomEntreprise,
                urlEntreprise: data.urlEntreprise,
                urlMyBusiness: "",
                telEntreprise: data.telEntreprise,
                motsCles: data.motsCles,
                adresseDepart: data.adresseDepart,
            }
        });

        // 1. Géocoder l'adresse de départ
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.adresseDepart)}&key=${GOOGLE_API_KEY}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData.results || geocodeData.results.length === 0) {
            return new NextResponse(JSON.stringify({ error: `Adresse introuvable: ${data.adresseDepart}` }), { status: 400 });
        }

        const center = geocodeData.results[0].geometry.location; // { lat, lng }

        // 2. Générer les données
        const { points, circleRadii } = generateDataPoints(data, center);
        if (points.length === 0) {
            return new NextResponse(JSON.stringify({ error: "Aucun mot-clé fourni, impossible de générer les points." }), { status: 400 });
        }

        // 3. Construire le KML et le renvoyer
        const kmlString = await generateKMLString(data, center, points, circleRadii);
        
        const fileName = `carte_seo_${data.nomEntreprise.replace(/\s+/g, '_').toLowerCase()}.kml`;

        return new Response(kmlString, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.google-earth.kml+xml',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });

    } catch (error: unknown) {
  console.error(error);

  const message = error instanceof Error ? error.message : "Une erreur interne est survenue.";
  return new NextResponse(JSON.stringify({ error: message }), { status: 500 });
}
}