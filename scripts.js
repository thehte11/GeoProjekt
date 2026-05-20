<!DOCTYPE html>
<html lang="de">
<head>
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VYQCXM2XRR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VYQCXM2XRR');
</script>
    <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P5NQ7X55');</script>
<!-- End Google Tag Manager -->
    <script data-cfasync="false" type="text/javascript" src="https://cache.consentframework.com/js/pa/51632/c/hz9Ky/stub?source=google-tag"></script>
<script data-cfasync="false" type="text/javascript" src="https://choices.consentframework.com/js/pa/51632/c/hz9Ky/cmp?source=google-tag" async></script>
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VYQCXM2XRR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VYQCXM2XRR');
</script>
    <!-- Google Tag Manage -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T6TKH6F9');</script>
<!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPU-Weltkarte</title>

    <!-- CookieYes -->
    <script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/d95b9c572a618c7cf3c880cf/script.js"></script>
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VYQCXM2XRR"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VYQCXM2XRR');
    </script>
    
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-T6TKH6F9');</script>
    <!-- End Google Tag Manager -->

    <!-- D3.js für Karte und Zoom-Funktionen laden -->
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* Der linke Bereich für die Karte */
        #map-container {
            flex: 2;
            background-color: #aadaff; /* Ozean-Farbe */
            position: relative;
            cursor: grab;
        }

        #map-container:active {
            cursor: grabbing;
        }

        svg {
            width: 100%;
            height: 100%;
        }

        /* Ladebildschirm */
        #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            color: #2c3e50;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }

        /* --- Suchleiste auf der Karte --- */
        #search-container {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 100;
        }

        #country-search {
            padding: 12px 15px;
            font-size: 14px;
            border: 2px solid #3498db;
            border-radius: 25px;
            outline: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            width: 220px;
            transition: width 0.3s ease, box-shadow 0.3s ease;
            font-family: inherit;
        }

        #country-search:focus {
            width: 280px;
            box-shadow: 0 6px 14px rgba(0,0,0,0.25);
            border-color: #2980b9;
        }

        /* Aussehen der Länder */
        .country {
            fill: #ecf0f1; 
            stroke: #bdc3c7;
            stroke-width: 0.5px;
            transition: fill 0.2s ease, stroke-width 0.2s ease;
            cursor: pointer;
        }

        /* Länder mit CPU-Daten */
        .country.has-data {
            fill: #3498db; /* Blaues Hervorheben */
        }

        /* Hervorgehobenes Land (durch Suche oder Klick) */
        .highlighted-country {
            fill: #f1c40f !important; /* Leuchtend gelb */
            stroke: #ffffff !important;
            stroke-width: 2.5px !important;
        }

        /* HOVER: Roter Fill und dicker weißer Umriss */
        .country.has-data:hover {
            fill: #e74c3c !important; 
            stroke: #ffffff;
            stroke-width: 2.5px;
        }
        
        /* HOVER für Länder OHNE Daten */
        .country:not(.has-data):hover {
            fill: #d5dbdb !important; 
            stroke: #ffffff;
            stroke-width: 1.5px;
        }

        /* Der rechte Informationsbereich */
        #info-panel {
            flex: 1;
            background-color: #ffffff;
            padding: 30px;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            overflow-y: auto;
            min-width: 350px;
            box-sizing: border-box;
            z-index: 10;
        }

        h1 { font-size: 1.6em; color: #2c3e50; margin-top: 0; margin-bottom: 20px; }
        .info-section { display: none; margin-top: 25px; }
        .info-section h3 { color: #2980b9; border-bottom: 2px solid #eee; padding-bottom: 5px; font-size: 1.1em; margin-top: 20px;}
        .info-section p { line-height: 1.5; color: #34495e; margin-top: 5px; }
        #default-message { color: #7f8c8d; font-style: italic; margin-top: 20px; background: #fdf2f0; padding: 15px; border-radius: 5px;}

        /* --- NEU: Styling für die Suchergebnisse im Panel --- */
        #search-results {
            display: none;
            margin-top: 20px;
        }
        #search-results h3 {
            color: #2c3e50;
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .search-result-item {
            padding: 12px 15px;
            margin-bottom: 8px;
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 15px;
            color: #2c3e50;
        }
        .search-result-item:hover {
            background-color: #eaf2f8;
            border-color: #3498db;
            color: #2980b9;
        }
        .search-result-item.has-cpu-data {
            border-left: 5px solid #3498db;
            font-weight: bold;
        }

        /* Kleines Pop-up am Mauszeiger */
        #tooltip {
            position: absolute;
            background: rgba(44, 62, 80, 0.9);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            pointer-events: none;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.2s;
            font-weight: bold;
            z-index: 20;
        }

        /* Responsive Anpassung für mobile Geräte */
        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }
            #map-container {
                flex: 1;
                min-height: 40vh;
                width: 100%;
            }
            #info-panel {
                flex: 1;
                width: 100%;
                min-width: 0;
                padding: 15px;
            }
            h1 { 
                font-size: 1.3em;
                margin-bottom: 10px; 
            }
            #tooltip {
                display: none !important;
            }
            #search-container {
                top: 10px;
                right: 10px;
                left: 10px;
            }
            #country-search {
                width: 100%;
                box-sizing: border-box;
            }
            #country-search:focus {
                width: 100%;
            }
        }
    </style>
</head>
<body>

    <div id="map-container">
        <!-- Suchleiste oben rechts auf der Karte -->
        <div id="search-container">
            <input type="text" id="country-search" placeholder="Land suchen (z.B. Deu)..." autocomplete="off">
        </div>

        <div id="loading">Lade Weltkarte...</div>
        <div id="tooltip"></div>
    </div>

    <div id="info-panel">
        <h1>Die globale CPU-Lieferkette</h1>
        
        <div id="default-message">
            Klicke auf ein beliebiges Land oder nutze die Suche auf der Karte.
        </div>

        <!-- NEU: Container für die Suchergebnisse -->
        <div id="search-results">
            <!-- Wird per JavaScript mit klickbaren Ergebnissen gefüllt -->
        </div>

        <div id="country-details" class="info-section">
            <h2 id="country-name" style="color: #e74c3c; margin-bottom: 5px;">Land</h2>
            
            <h3>Abbau (Herkunft)</h3>
            <p id="mining-data">-</p>
            
            <h3>Verarbeitung (Veredelung/Montage)</h3>
            <p id="processing-data">-</p>

            <h3>Verwendung in der CPU</h3>
            <p id="usage-data">-</p>
            
            <h3 style="color: #e67e22;">Arbeitsbedingungen & Ethik</h3>
            <p id="labor-data">-</p>
        </div>
    </div>

    <script>
        // Wörterbuch für die Übersetzung von GeoJSON (Englisch) zu Deutsch
        const countryTranslations = {
            "Afghanistan": "Afghanistan", "Albania": "Albanien", "Algeria": "Algerien", "Angola": "Angola", "Antarctica": "Antarktis", "Argentina": "Argentinien", "Armenia": "Armenien", "Australia": "Australien", "Austria": "Österreich", "Azerbaijan": "Aserbaidschan",
            "Bahamas": "Bahamas", "Bangladesh": "Bangladesch", "Belarus": "Belarus", "Belgium": "Belgien", "Belize": "Belize", "Benin": "Benin", "Bhutan": "Bhutan", "Bolivia": "Bolivien", "Bosnia and Herz.": "Bosnien und Herzegowina", "Botswana": "Botsuana", "Brazil": "Brasilien", "Brunei": "Brunei", "Bulgaria": "Bulgarien", "Burkina Faso": "Burkina Faso", "Burundi": "Burundi",
            "Cambodia": "Kambodscha", "Cameroon": "Kamerun", "Canada": "Kanada", "Central African Rep.": "Zentralafrikanische Republik", "Chad": "Tschad", "Chile": "Chile", "China": "China", "Colombia": "Kolumbien", "Congo": "Kongo", "Costa Rica": "Costa Rica", "Croatia": "Kroatien", "Cuba": "Kuba", "Cyprus": "Zypern", "Czechia": "Tschechien", "Côte d'Ivoire": "Elfenbeinküste",
            "Dem. Rep. Congo": "DR Kongo", "Democratic Republic of the Congo": "DR Kongo", "Denmark": "Dänemark", "Djibouti": "Dschibuti", "Dominican Rep.": "Dominikanische Republik",
            "Ecuador": "Ecuador", "Egypt": "Ägypten", "El Salvador": "El Salvador", "Eq. Guinea": "Äquatorialguinea", "Eritrea": "Eritrea", "Estonia": "Estland", "Eswatini": "Eswatini", "Ethiopia": "Äthiopien",
            "Falkland Is.": "Falklandinseln", "Fiji": "Fidschi", "Finland": "Finnland", "France": "Frankreich", "Fr. S. Antarctic Lands": "Französische Süd- und Antarktisgebiete",
            "Gabon": "Gabun", "Gambia": "Gambia", "Georgia": "Georgien", "Germany": "Deutschland", "Ghana": "Ghana", "Greece": "Griechenland", "Greenland": "Grönland", "Guatemala": "Guatemala", "Guinea": "Guinea", "Guinea-Bissau": "Guinea-Bissau", "Guyana": "Guyana",
            "Haiti": "Haiti", "Honduras": "Honduras", "Hungary": "Ungarn",
            "Iceland": "Island", "India": "Indien", "Indonesia": "Indonesien", "Iran": "Iran", "Iraq": "Irak", "Ireland": "Irland", "Israel": "Israel", "Italy": "Italien",
            "Jamaica": "Jamaika", "Japan": "Japan", "Jordan": "Jordanien",
            "Kazakhstan": "Kasachstan", "Kenya": "Kenia", "Kosovo": "Kosovo", "Kuwait": "Kuwait", "Kyrgyzstan": "Kirgisistan",
            "Laos": "Laos", "Latvia": "Lettland", "Lebanon": "Libanon", "Lesotho": "Lesotho", "Liberia": "Liberia", "Libya": "Libyen", "Lithuania": "Litauen", "Luxembourg": "Luxemburg",
            "Macedonia": "Nordmazedonien", "North Macedonia": "Nordmazedonien", "Madagascar": "Madagaskar", "Malawi": "Malawi", "Malaysia": "Malaysia", "Mali": "Mali", "Mauritania": "Mauretanien", "Mexico": "Mexiko", "Moldova": "Moldau", "Mongolia": "Mongolei", "Montenegro": "Montenegro", "Morocco": "Marokko", "Mozambique": "Mosambik", "Myanmar": "Myanmar",
            "Namibia": "Namibia", "Nepal": "Nepal", "Netherlands": "Niederlande", "New Caledonia": "Neukaledonien", "New Zealand": "Neuseeland", "Nicaragua": "Nicaragua", "Niger": "Niger", "Nigeria": "Nigeria", "North Korea": "Nordkorea", "Norway": "Norwegen",
            "Oman": "Oman",
            "Pakistan": "Pakistan", "Palestine": "Palästina", "Panama": "Panama", "Papua New Guinea": "Papua-Neuguinea", "Paraguay": "Paraguay", "Peru": "Peru", "Philippines": "Philippinen", "Poland": "Polen", "Portugal": "Portugal", "Puerto Rico": "Puerto Rico",
            "Qatar": "Katar",
            "Romania": "Rumänien", "Russia": "Russland", "Rwanda": "Ruanda",
            "W. Sahara": "Westsahara", "Saudi Arabia": "Saudi-Arabien", "Senegal": "Senegal", "Serbia": "Serbien", "Sierra Leone": "Sierra Leone", "Slovakia": "Slowakei", "Slovenia": "Slowenien", "Solomon Is.": "Salomonen", "Somalia": "Somalia", "South Africa": "Südafrika", "South Korea": "Südkorea", "South Sudan": "Südsudan", "Spain": "Spanien", "Sri Lanka": "Sri Lanka", "Sudan": "Sudan", "Suriname": "Suriname", "Svalbard and Jan Mayen": "Spitzbergen und Jan Mayen", "Swaziland": "Eswatini", "Sweden": "Schweden", "Switzerland": "Schweiz", "Syria": "Syrien",
            "Taiwan": "Taiwan", "Tajikistan": "Tadschikistan", "Tanzania": "Tansania", "Thailand": "Thailand", "Timor-Leste": "Osttimor", "Togo": "Togo", "Trinidad and Tobago": "Trinidad und Tobago", "Tunisia": "Tunesien", "Turkey": "Türkei", "Turkmenistan": "Turkmenistan",
            "Uganda": "Uganda", "Ukraine": "Ukraine", "United Arab Emirates": "Vereinigte Arabische Emirate", "United Kingdom": "Großbritannien", "England": "Großbritannien", "United States of America": "USA", "USA": "USA", "Uruguay": "Uruguay", "Uzbekistan": "Usbekistan",
            "Vanuatu": "Vanuatu", "Venezuela": "Venezuela", "Vietnam": "Vietnam",
            "Yemen": "Jemen",
            "Zambia": "Sambia", "Zimbabwe": "Simbabwe"
        };

        // CPU Daten
        const cpuData = {
            "China": { 
                name: "China", 
                abbau: "Quarzsand (Silizium & Glasfaser), Phosphaterze, Wolfram (>80%), Gold, Zinn, Silber, Indium", 
                verarbeitung: "Reinstsilizium, Wolfram-Veredelung, Kupferraffination, Tantal, Gold- & Nickel-Raffination, Lotlegierungen, Massenfertigung Kupfer-Heatspreader, Indium-Plättchen",
                verwendung: "Silizium bildet den Chip (Die). Phosphor dotiert Transistoren. Wolfram bildet interne Kontakte. Gold für Kontaktflächen. Zinn/Silber/Indium für Lötverbindungen und Wärmeübertragung (TIM). Kupfer für den Kühlkörper. Nickel als Unterbeschichtung.",
                arbeitsbedingungen: "Stark variierende Bedingungen. Während High-Tech-Fabriken moderne Standards aufweisen, gibt es im Bergbau und bei Vorlieferanten oft extrem lange Arbeitszeiten (996-Arbeitskultur) und mangelhaften Gesundheitsschutz. Bei einigen Rohstoffen gibt es wiederholt internationale Vorwürfe von Zwangsarbeit."
            },
            "USA": { 
                name: "USA", 
                abbau: "Quarzsand (Silizium & Glasfaser), Bor, Kupfer, Erdöl/Erdgas, Gold", 
                verarbeitung: "Reinstsilizium, Wafer-Fertigung/Chip-Belichtung (Intel), Gase (Bor/Phosphor), Tantal-Veredelung, Indium-Aufbereitung",
                verwendung: "Silizium für den Hauptchip. Bor/Phosphor zur elektrischen Steuerung der Transistoren. Kupfer/Tantal für Chip-Verdrahtung. Erdöl/Erdgas wird zu Kunstharz für die Trägerplatte (Substrat). Glasfaser stabilisiert das Package.",
                arbeitsbedingungen: "Strenge Arbeitsgesetze und sehr hohe Sicherheitsstandards in der industriellen Fertigung. In der Halbleiterindustrie arbeiten meist hochqualifizierte, gut bezahlte Spezialisten."
            },
            "Germany": { 
                name: "Deutschland", 
                abbau: "Keine wesentlichen primären Abbaugebiete für CPU-Metalle.", 
                verarbeitung: "Reinstsilizium (z. B. Wacker Chemie), Hafnium-Aufbereitung, Wolfram/Kobalt (Pulver/Targets), Kupferraffination, Tantal-Veredelung",
                verwendung: "Reinstsilizium ist das Grundmaterial der Wafer. Hafnium isoliert Transistor-Gates. Wolfram/Kobalt dienen als mikroskopische Stecker (Plugs) im Chip. Kupfer/Tantal bilden die Leiterbahnen auf dem Die.",
                arbeitsbedingungen: "Zählt zu den Ländern mit den weltweit höchsten Arbeits- und Sozialstandards. Starke Gewerkschaften, strenge Regulierung des Arbeitsschutzes und der Arbeitszeiten."
            },
            "Taiwan": { 
                name: "Taiwan", 
                abbau: "Keine wesentlichen primären Abbaugebiete.", 
                verarbeitung: "Wafer-Fertigung/Chip-Belichtung (TSMC), Substrate/Trägerplatinen (z. B. Unimicron), Lotlegierungen, Kupfer-Heatspreader",
                verwendung: "Hier entsteht in der Wafer-Fertigung das 'Gehirn' (der Die). Komplexe mehrlagige Substrate bilden die grüne Trägerplatte. Lotlegierungen verbinden Die und Substrat physisch und elektrisch.",
                arbeitsbedingungen: "Gute Bezahlung, aber extremer Leistungs- und Zeitdruck in der Halbleiterindustrie. Lange Schichten und Überstunden sind in Chip-Fabriken (Fabs) normal, um den 24/7-Betrieb aufrechtzuerhalten."
            },
            "South Korea": { 
                name: "Südkorea", 
                abbau: "Indium (Nebenprodukt)", 
                verarbeitung: "Wafer-Fertigung/Chip-Belichtung (Samsung), Substrate/Trägerplatinen, Indium-Lot-Plättchen",
                verwendung: "Fertigung des Prozessor-Chips (Die) und der zugehörigen Trägerplatinen. Indium-Lot wird als Thermal Interface Material (TIM) extrem wärmeleitend zwischen Chip und Kupferdeckel eingesetzt.",
                arbeitsbedingungen: "Moderne Arbeitsrechte, aber eine Kultur des extremen Wettbewerbs. Lange Arbeitszeiten und strikte Hierarchien prägen den Arbeitsalltag in großen Technologiekonzernen."
            },
            "Japan": { 
                name: "Japan", 
                abbau: "Indium (Nebenprodukt)", 
                verarbeitung: "Hochreine Gase, Hafnium-Aufbereitung, Substrate/Trägerplatinen (z. B. Ibiden), Nickel-Spezialveredelung, Lotlegierungen",
                verwendung: "Gase (Bor/Phosphor) machen Transistoren leitfähig. Hafnium isoliert. Hier werden zudem essenzielle mehrlagige Trägerplatinen (Substrate) hergestellt. Nickel und Lot dienen den elektrischen Kontakten.",
                arbeitsbedingungen: "Stark regulierte Sicherheit und hohe Qualitätsstandards. Traditionell gibt es eine Überstundenkultur ('Karoshi'-Gefahr), wenngleich die Regierung in den letzten Jahren schärfere Gesetze zur Begrenzung von Arbeitszeiten erlassen hat."
            },
            "Saudi Arabia": {
                name: "Saudi-Arabien (Naher Osten)",
                abbau: "Erdöl und Erdgas",
                verarbeitung: "-",
                verwendung: "Erdöl und Erdgas aus dem Nahen Osten bilden die chemische Basis für Epoxidharze. Diese Kunstharze sind das unverzichtbare Trägermaterial für die komplexe, mehrlagige grüne Trägerplatine (Package/Substrat) der CPU.",
                arbeitsbedingungen: "Starke Abhängigkeit von ausländischen Wanderarbeitern im Energiesektor. Obwohl es Reformen gab, werden die Bedingungen für Arbeitsmigranten (Kafala-System) von Menschenrechtsorganisationen weiterhin oft als prekär eingestuft."
            },
            "Democratic Republic of the Congo": { 
                name: "DR Kongo", 
                abbau: "Kobalt (>70%), Tantal (Coltan)", 
                verarbeitung: "Wird meist roh exportiert.",
                verwendung: "Kobalt wird für interne, mikroskopische Kontakte (Plugs) auf dem Silizium-Chip verwendet. Tantal ist essenziell für die extrem feine Leiterbahn-Verdrahtung direkt auf dem Chip.",
                arbeitsbedingungen: "Eines der kritischsten Länder der Lieferkette: Im informellen Kleinbergbau (Artisanal Mining) gibt es weit verbreitete, teils lebensgefährliche Kinderarbeit und Zwangsarbeit. Schutzbekleidung fehlt fast vollständig. Oft finanzieren Minen bewaffnete Konflikte (Konfliktmineralien)."
            },
            "Chile": { 
                name: "Chile", 
                abbau: "Kupfer", 
                verarbeitung: "Kupferkonzentrate",
                verwendung: "Kupfer bildet die winzigen Leiterbahnen direkt auf dem Silizium-Chip und wird massiv für den dicken, wärmeableitenden Deckel (Heatspreader) der CPU verwendet.",
                arbeitsbedingungen: "Der industrielle Bergbau ist stark gewerkschaftlich organisiert und formell reguliert. Dennoch bleiben Minenarbeiter hohen gesundheitlichen Belastungen (Feinstaub, Chemikalien) ausgesetzt."
            },
            "Peru": { 
                name: "Peru", 
                abbau: "Kupfer, Zinn, Silber", 
                verarbeitung: "-",
                verwendung: "Kupfer für Verdrahtung und Kühlkörper. Zinn und Silber sind die Hauptbestandteile von Lotlegierungen, die für BGA-Verbindungen (Lotkugeln an der Unterseite der CPU) genutzt werden.",
                arbeitsbedingungen: "Neben regulierten Großminen gibt es viel informellen Bergbau. Dort fehlen oft grundlegende Sicherheitsstandards, und das Risiko von Arbeitsausbeutung ist hoch."
            },
            "Australia": { 
                name: "Australien", 
                abbau: "Hafnium, Gold", 
                verarbeitung: "Gold-Raffination",
                verwendung: "Hafnium isoliert als High-k-Dielektrikum moderne Transistoren (verhindert Kriechstrom). Gold wird für stark leitende Kontaktflächen und Draht-Bonding auf der Platine genutzt.",
                arbeitsbedingungen: "Sehr hohe Standards bei Arbeitsschutz und Sicherheit. Bergarbeiter und Ingenieure sind in der Regel hervorragend ausgebildet und zählen zu den Bestverdienenden im Land."
            },
            "South Africa": { 
                name: "Südafrika", 
                abbau: "Hafnium", 
                verarbeitung: "Gold-Raffination",
                verwendung: "Hafnium dient der elektrischen Isolierung winziger Transistor-Gates. Gold wird in der Veredelung für die Kontaktflächen auf dem CPU-Substrat verwendet.",
                arbeitsbedingungen: "Formell existieren gute Arbeitsschutzgesetze, jedoch ist die Realität im Bergbau (Tiefminen) von extrem harter, gefährlicher körperlicher Arbeit geprägt. Es kommt häufig zu Streiks bezüglich unzureichender Löhne."
            },
            "Indonesia": { 
                name: "Indonesien", 
                abbau: "Nickel (weltweit größter Förderer), Zinn", 
                verarbeitung: "Massive Verarbeitungskapazitäten für Nickel",
                verwendung: "Nickel dient als Unterbeschichtung für Goldkontakte und wird als Korrosionsschutz galvanisch über den Kupfer-Heatspreader (Deckel) gezogen. Zinn bildet Basis-Lotkugeln.",
                arbeitsbedingungen: "Die extrem schnelle Ausweitung des Nickelbergbaus führt zunehmend zu Berichten über fatale Arbeitsunfälle in den Schmelzanlagen, mangelnden Arbeitsschutz und Belastung der umliegenden Dörfer durch giftige Abwässer."
            },
            "Russia": { 
                name: "Russland", 
                abbau: "Quarzsand (Silizium), Erdgas/Erdöl, Gold, Nickel", 
                verarbeitung: "-",
                verwendung: "Silizium ist Grundmaterial für Wafer. Erdgas/Erdöl ist die chemische Basis für die Epoxidharz-Trägerplatte. Gold und Nickel sichern langlebige und extrem leitfähige Kontakte.",
                arbeitsbedingungen: "Im industriellen Rohstoffsektor herrschen oft raue Bedingungen. Unabhängige Gewerkschaften sind stark eingeschränkt, was die Durchsetzung von besseren Arbeitsbedingungen erschwert."
            },
            "Brazil": { 
                name: "Brasilien", 
                abbau: "Quarzsand (Silizium), Tantal", 
                verarbeitung: "-",
                verwendung: "Silizium als Grundmaterial des Mikrochips. Tantal wird für die extrem feine, lokale Verdrahtung direkt im Silizium-Die verwendet, da es thermisch hochstabil ist.",
                arbeitsbedingungen: "Ein Mix aus stark industrialisiertem Bergbau mit guten Standards und informellen Minen ('Garimpos'), in denen prekäre Bedingungen, Umweltzerstörung (Amazonas) und teils illegale Sklavenarbeit herrschen."
            },
            "Turkey": { 
                name: "Türkei", 
                abbau: "Bor (>70%)", 
                verarbeitung: "-",
                verwendung: "Bor wird als Gas bei der Chip-Herstellung in das Silizium 'eingeschossen' (Dotierung). Erst dadurch werden die Transistoren gesteuert leitfähig.",
                arbeitsbedingungen: "Der Bergbau wird staatlich reguliert, allerdings stand die Türkei in der Vergangenheit nach schweren Grubenunglücken wegen Lücken bei der Arbeitssicherheit stark in der Kritik."
            },
            "Morocco": { 
                name: "Marokko", 
                abbau: "Phosphaterze", 
                verarbeitung: "-",
                verwendung: "Phosphor wird zur Dotierung des Silizium-Wafers genutzt, um die elektrischen Eigenschaften der Transistoren für die P-N-Übergänge gezielt zu verändern.",
                arbeitsbedingungen: "Der Phosphatabbau wird von staatlichen Unternehmen kontrolliert und ist formell reguliert. Kritisiert werden jedoch oft die politischen Begleitumstände, da ein Teil des Abbaus in der umstrittenen Region Westsahara stattfindir."
            },
            "Switzerland": { 
                name: "Schweiz", 
                abbau: "-", 
                verarbeitung: "Weltweite Hochraffination von Gold",
                verwendung: "Hochreines Gold wird für die winzigen Kontaktflächen auf dem Substrat und für das Draht-Bonding genutzt, da es als Edelmetall nicht oxidiert.",
                arbeitsbedingungen: "Höchste globale Standards bei Arbeitsschutz, Bezahlung und Sicherheit in den Veredelungsanlagen."
            },
            "Malaysia": { 
                name: "Malaysia", 
                abbau: "-", 
                verarbeitung: "Lotlegierungen, Endmontage (CPU-Zusammensetzung & Nickel-Überzug)",
                verwendung: "Lotlegierungen verbinden den Silizium-Chip mit der Trägerplatte. In der Endmontage wird der Kupferdeckel zum Schutz vor Oxidation mit Nickel überzogen und auf das Package verklebt.",
                arbeitsbedingungen: "Wichtiger Hub für das 'Packaging' (Zusammenbau). Sehr oft arbeiten hier migrantische Arbeitskräfte aus Nachbarländern. NGOs berichten wiederholt von Praktiken, die an Zwangsarbeit grenzen (Pässe werden einbehalten, Arbeiter hoch verschuldet)."
            },
            "Vietnam": { 
                name: "Vietnam", 
                abbau: "-", 
                verarbeitung: "Endmontage (CPU-Zusammensetzung & Nickel-Überzug)",
                verwendung: "Hauptsächlich Packaging und Endmontage: Der fertige Chip wird auf das Substrat gelötet, und der schützende Kupfer-Heatspreader wird galvanisch vernickelt und aufgesetzt.",
                arbeitsbedingungen: "Als aufstrebender Standort für Technologiefertigung gibt es viele moderne Fabriken (z.B. von Intel). Dennoch sind die Löhne niedrig und lange Arbeitszeiten sowie restriktive Pausenregelungen sind keine Seltenheit."
            },
            "France": { 
                name: "Frankreich", 
                abbau: "-", 
                verarbeitung: "Chemische Aufbereitung von Hafnium",
                verwendung: "Hafnium dient als unverzichtbares Isoliermaterial für die winzigen Transistor-Gates, um das unerwünschte Abfließen von Strom zu verhindern.",
                arbeitsbedingungen: "Sehr hohe europäische Arbeits- und Sicherheitsstandards in der chemischen Industrie."
            },
            "Finland": { 
                name: "Finnland", 
                abbau: "-", 
                verarbeitung: "Wolfram/Kobalt-Veredelung zu Reinstpulver",
                verwendung: "Wolfram und Kobalt werden für die mikroskopisch kleinen, internen Stecker (Plugs) verwendet, die Milliarden Transistoren auf dem Chip verbinden.",
                arbeitsbedingungen: "Vorbildliche skandinavische Arbeitsrechte, hohes Maß an Mitbestimmung, starker Gesundheits- und Arbeitsschutz."
            },
            "Canada": { 
                name: "Kanada", 
                abbau: "Gold", 
                verarbeitung: "Wolfram/Kobalt-Veredelung",
                verwendung: "Gold für oxidationsfreie Kontaktflächen am CPU-Sockel. Wolfram und Kobalt werden für die interne Verdrahtung und Kontaktstecker (Plugs) auf Transistorebene genutzt.",
                arbeitsbedingungen: "Strenge staatliche Überwachung im industriellen Bergbau und hohe Sicherheitsauflagen für Arbeiter."
            },
            "Rwanda": { 
                name: "Ruanda", 
                abbau: "Tantal", 
                verarbeitung: "-",
                verwendung: "Tantal ist essenziell für die extrem feine, lokale Verdrahtung (Interconnects) und dient als Diffusionsbarriere direkt auf dem Silizium-Chip.",
                arbeitsbedingungen: "Bemüht sich darum, eine 'konfliktfreie' Bezugsquelle für Tantal zu sein (mit Blockchain-Tracking). Dennoch bleibt der informelle Abbau harte Handarbeit, und es gibt das Risiko, dass Mineralien aus prekären Nachbarländern (Kongo) geschmuggelt werden."
            },
            "Ghana": { 
                name: "Ghana", 
                abbau: "Gold", 
                verarbeitung: "-",
                verwendung: "Gold wird in der finalen CPU für die Kontaktflächen (Pins/Pads) an der Unterseite genutzt, da es den perfekten Mix aus Leitfähigkeit und Korrosionsbeständigkeit bietet.",
                arbeitsbedingungen: "Neben dem regulierten industriellen Bergbau gibt es massiv informellen Kleinbergbau ('Galamsey'). Hier sind oft Kinder beteiligt, und Arbeiter vergiften sich chronisch bei der Goldgewinnung durch fehlende Schutzkleidung und hochgiftiges Quecksilber."
            },
            "Philippines": { 
                name: "Philippinen", 
                abbau: "Nickel", 
                verarbeitung: "-",
                verwendung: "Nickel wird als silberglänzender Überzug auf den Kupferdeckel aufgetragen, um Korrosion zu verhindern, und dient als Barriere unter Goldkontakten.",
                arbeitsbedingungen: "Der Abbau führt oft zu Konflikten mit indigenen Bevölkerungsgruppen. Die Sicherheitsstandards schwanken stark; oftmals klagen Arbeiter über mangelnde Ausrüstung bei gefährlichen Tätigkeiten."
            },
            "Mexico": { 
                name: "Mexiko", 
                abbau: "Silber", 
                verarbeitung: "-",
                verwendung: "Silber ist neben Zinn ein Hauptbestandteil moderner Lotlegierungen. Diese bilden die BGA-Kügelchen, die die CPU elektrisch mit dem Mainboard verbinden.",
                arbeitsbedingungen: "Regulierte Großminen bieten formelle Beschäftigung, jedoch gibt es in abgelegenen Gebieten ein starkes Risiko durch den Einfluss organisierter Kriminalität (Kartelle), was die Sicherheit der Minenarbeiter massiv gefährdet."
            },
            "Myanmar": { 
                name: "Myanmar", 
                abbau: "Zinn", 
                verarbeitung: "-",
                verwendung: "Zinn ist die Basis aller Lötverbindungen. Es wird benötigt, um den Chip auf die Trägerplatte zu löten, sowie zur späteren Mainboard-Verbindung.",
                arbeitsbedingungen: "Hochgradig kritisch. Der Abbau findet teils in Konfliktzonen statt und finanziert Rebellengruppen oder das Militär. Es herrschen oft desaströse Sicherheitsbedingungen ohne jeglichen Arbeitsschutz, und es gibt Berichte über Zwangsarbeit."
            }
        };

        // Funktion, um die finalen Daten im rechten Panel zu aktualisieren
        function triggerCountryInfo(countryNameOriginal) {
            const translatedName = countryTranslations[countryNameOriginal] || countryNameOriginal;
            
            // Alles andere verstecken, nur die Info anzeigen
            document.getElementById("default-message").style.display = "none";
            document.getElementById("search-results").style.display = "none";
            document.getElementById("country-details").style.display = "block";
            
            if(cpuData[countryNameOriginal]) {
                const info = cpuData[countryNameOriginal];
                document.getElementById("country-name").innerText = info.name;
                document.getElementById("mining-data").innerText = info.abbau;
                document.getElementById("processing-data").innerText = info.verarbeitung;
                document.getElementById("usage-data").innerText = info.verwendung;
                document.getElementById("labor-data").innerText = info.arbeitsbedingungen;
            } else {
                document.getElementById("country-name").innerText = translatedName;
                document.getElementById("mining-data").innerText = "Keine Daten zum Abbau für die CPU-Produktion.";
                document.getElementById("processing-data").innerText = "Keine Daten zur Verarbeitung.";
                document.getElementById("usage-data").innerText = "Keine Verbindungen zur CPU-Lieferkette.";
                document.getElementById("labor-data").innerText = "Keine spezifischen Daten zu den Arbeitsbedingungen in dieser Lieferkette verfügbar.";
            }
        }

        // D3 Setup & Map Engine
        const width = document.getElementById('map-container').clientWidth;
        const height = document.getElementById('map-container').clientHeight;

        const svg = d3.select("#map-container")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const g = svg.append("g");

        const projection = d3.geoMercator()
            .scale(width / 6)
            .translate([width / 2, height / 1.5]);

        const path = d3.geoPath().projection(projection);
        const tooltip = d3.select("#tooltip");

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[-width * 0.03, -height * 0.005], [width * 1.03, height * 1.15]]) 
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Echte Weltkarte ONLINE abrufen
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data) {
            
            document.getElementById("loading").style.display = "none";

            // Alle Länder zeichnen
            g.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", function(d) {
                    return cpuData[d.properties.name] ? "country has-data" : "country";
                })
                .on("mouseover", function(event, d) {
                    const countryNameOriginal = d.properties.name;
                    const translatedName = countryTranslations[countryNameOriginal] || countryNameOriginal;
                    const displayName = cpuData[countryNameOriginal] ? cpuData[countryNameOriginal].name : translatedName;
                    
                    tooltip.style("opacity", 1).html(displayName);
                    // Nur nach vorne holen, wenn es nicht gerade von der Suche blockiert/markiert wird
                    if (!d3.select(this).classed("highlighted-country")) {
                        d3.select(this).raise(); 
                    }
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 15) + "px")
                           .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("opacity", 0);
                })
                .on("click", function(event, d) {
                    // Alle vorherigen Hervorhebungen entfernen
                    g.selectAll("path").classed("highlighted-country", false);
                    // Dieses Land visuell hervorheben
                    d3.select(this).classed("highlighted-country", true).raise();
                    
                    const countryNameOriginal = d.properties.name;
                    triggerCountryInfo(countryNameOriginal);

                    // Suchleistentext anpassen
                    const translatedName = countryTranslations[countryNameOriginal] || countryNameOriginal;
                    const displayName = cpuData[countryNameOriginal] ? cpuData[countryNameOriginal].name : translatedName;
                    document.getElementById("country-search").value = displayName;
                });

            // --- NEU: Live-Suche füllt das rechte Panel und markiert die Karte ---
            const searchInput = document.getElementById("country-search");
            
            searchInput.addEventListener("input", function(e) {
                const searchValue = e.target.value.toLowerCase().trim();
                const resultsContainer = document.getElementById("search-results");
                
                if (searchValue === "") {
                    // Suchfeld leer: Karte bereinigen und Panel auf Standard setzen
                    g.selectAll("path").classed("highlighted-country", false);
                    resultsContainer.style.display = "none";
                    document.getElementById("country-details").style.display = "none";
                    document.getElementById("default-message").style.display = "block";
                    return;
                }

                // Panel für Suchergebnisse vorbereiten
                resultsContainer.innerHTML = "<h3>Wähle ein Land aus:</h3>";
                resultsContainer.style.display = "block";
                document.getElementById("default-message").style.display = "none";
                document.getElementById("country-details").style.display = "none";

                let matchCount = 0;

                // Jedes Land durchgehen und prüfen
                g.selectAll("path").each(function(d) {
                    const countryNameOriginal = d.properties.name;
                    const translatedName = countryTranslations[countryNameOriginal] || countryNameOriginal;
                    const displayName = cpuData[countryNameOriginal] ? cpuData[countryNameOriginal].name : translatedName;
                    
                    // Prüfen, ob der Name mit dem gesuchten Text anfängt
                    const isMatch = displayName.toLowerCase().startsWith(searchValue);
                    
                    d3.select(this).classed("highlighted-country", isMatch);
                    
                    if (isMatch) {
                        d3.select(this).raise();
                        matchCount++;

                        // Erstelle einen anklickbaren Listeneintrag für das Panel
                        const div = document.createElement("div");
                        div.className = "search-result-item";
                        if(cpuData[countryNameOriginal]) {
                            div.classList.add("has-cpu-data");
                        }
                        div.innerText = displayName;
                        
                        // Klick auf das Suchergebnis im Panel
                        div.onclick = function() {
                            // Karte bereinigen und nur dieses Land markieren
                            g.selectAll("path").classed("highlighted-country", false);
                            g.selectAll("path")
                             .filter(p => p.properties.name === countryNameOriginal)
                             .classed("highlighted-country", true)
                             .raise();

                            // Suchfeld aktualisieren und Info anzeigen
                            document.getElementById("country-search").value = displayName;
                            triggerCountryInfo(countryNameOriginal);
                        };
                        
                        resultsContainer.appendChild(div);
                    }
                });

                // Falls kein Land gefunden wurde
                if(matchCount === 0) {
                    resultsContainer.innerHTML += "<p style='color: #7f8c8d; font-style: italic;'>Kein Land gefunden.</p>";
                }
            });

        }).catch(function(error) {
            document.getElementById("loading").innerText = "❌ Fehler: Keine Internetverbindung oder Datenquelle nicht erreichbar.";
            document.getElementById("loading").style.color = "red";
        });

        window.addEventListener('resize', () => {
            const newWidth = document.getElementById('map-container').clientWidth;
            const newHeight = document.getElementById('map-container').clientHeight;
            svg.attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
            
            zoom.translateExtent([[-newWidth * 0.03, -newHeight * 0.005], [newWidth * 1.03, newHeight * 1.15]]);
        });
    </script>
    
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T6TKH6F9"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
</body>
    <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P5NQ7X55"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T6TKH6F9"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
</html>
