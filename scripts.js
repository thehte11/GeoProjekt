<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <title>Die globale Smartphone-Lieferkette</title>
   
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        /* --- ORIGINALES GRUND-DESIGN --- */
        body {
            font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            display: flex;
            height: 100vh;
            height: 100dvh;
            width: 100vw; 
            overflow: hidden;
            overscroll-behavior: none;
        }

        #map-container {
            flex: 2;
            background-color: #aadaff;
            position: relative;
            cursor: grab;
            overflow: hidden; 
        }

        #map-container:active {
            cursor: grabbing;
        }

        /* SVG Canvas liegt strikt im Hintergrund */
        #map-canvas {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1;
        }
        svg { width: 100%; height: 100%; }

        #loading {
            position: absolute;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 1.5rem; color: #2c3e50;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 20px; border-radius: 8px; font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            z-index: 2000;
        }

        /* Suchfeld ist nun links oben und extrem stark isoliert! */
        #search-container {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 999999;
            pointer-events: auto !important;
        }

        #country-search {
            padding: 12px 15px; font-size: 16px; border: 2px solid #3498db;
            border-radius: 25px; outline: none; box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            width: 260px; transition: width 0.3s ease, box-shadow 0.3s ease;
            font-family: inherit;
            pointer-events: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            background: rgba(255, 255, 255, 0.95);
        }
        #country-search:focus {
            width: 320px; box-shadow: 0 6px 14px rgba(0,0,0,0.25); border-color: #2980b9;
            background: #ffffff;
        }

        #default-legend, #map-legend {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 12px 18px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            font-size: 14px;
            z-index: 100;
        }
        #map-legend { display: none; }

        .legend-item { display: flex; align-items: center; margin-bottom: 6px; color: #2c3e50; font-weight: bold; }
        .legend-item:last-child { margin-bottom: 0; }
        .legend-color { width: 18px; height: 18px; border-radius: 4px; margin-right: 10px; display: inline-block; border: 1px solid #bdc3c7; }

        /* --- MAP COUNTRIES --- */
        .country { stroke: #bdc3c7; stroke-width: 0.5px; transition: fill 0.2s ease, stroke-width 0.2s ease; cursor: pointer; }

        .country.role-major { fill: #3498db; }
        .country.role-minor { fill: #40BBFF; }
        .country.role-none { fill: #ecf0f1; }

        .highlighted-country { fill: #f1c40f !important; stroke: #ffffff !important; stroke-width: 2.5px !important; }
        .highlighted-mining { fill: #e67e22 !important; stroke: #ffffff !important; stroke-width: 2.5px !important; }
        .highlighted-manufacturing { fill: #9b59b6 !important; stroke: #ffffff !important; stroke-width: 2.5px !important; }
        .highlighted-both { fill: #e74c3c !important; stroke: #ffffff !important; stroke-width: 2.5px !important; }

        .country.role-major:hover, .country.role-minor:hover { fill: #e74c3c !important; stroke: #ffffff; stroke-width: 2.5px; }
        .country.role-none:hover { fill: #d5dbdb !important; stroke: #ffffff; stroke-width: 1.5px; }

        /* --- Info Panel --- */
        #info-panel {
            flex: 1; background-color: #ffffff; padding: 30px;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1); overflow-y: auto;
            min-width: 380px; max-width: 450px; box-sizing: border-box;
            position: relative; z-index: 10000; 
        }

        h1 { font-size: 1.6em; color: #2c3e50; margin-top: 0; margin-bottom: 20px; }
        .info-section { display: none; margin-top: 25px; }
        
        #default-message { color: #7f8c8d; font-style: italic; margin-top: 20px; background: #fdf2f0; padding: 15px; border-radius: 5px;}

        #search-results { display: none; margin-top: 20px; }
        #search-results h3 { color: #2c3e50; font-size: 1.2em; margin-bottom: 10px; }
        .search-result-item {
            padding: 12px 15px; margin-bottom: 8px; background-color: #f9f9f9;
            border: 1px solid #e0e0e0; border-radius: 5px; cursor: pointer;
            transition: all 0.2s ease; font-size: 14px; color: #2c3e50;
        }
        .search-result-item:hover { background-color: #eaf2f8; border-color: #bdc3c7; }
        .search-result-item.result-land { border-left: 5px solid #3498db; }
        .search-result-item.result-bauteil { border-left: 5px solid #9b59b6; }
        .search-result-item.result-rohstoff { border-left: 5px solid #e67e22; }

        .search-type-label { font-size: 0.8em; color: #7f8c8d; text-transform: uppercase; font-weight: bold; margin-bottom: 3px; }

        .clickable-tag {
            display: inline-block; background-color: #eaf2f8; color: #2980b9;
            padding: 5px 12px; margin: 4px 6px 4px 0; border-radius: 20px;
            font-size: 0.9em; cursor: pointer; transition: all 0.2s ease;
            border: 1px solid #a9cce3; font-weight: 500;
        }
        .clickable-tag:hover { background-color: #3498db; color: #ffffff; border-color: #2980b9; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .text-link-tag { background-color: #eaf2f8; color: #2980b9; padding: 2px 5px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; border: 1px solid #a9cce3; font-weight: 600; white-space: nowrap; }
        .text-link-tag:hover { background-color: #3498db; color: #ffffff; border-color: #2980b9; }

        #tooltip {
            position: absolute; background: rgba(44, 62, 80, 0.9); color: white;
            padding: 6px 12px; border-radius: 4px; pointer-events: none;
            font-size: 14px; opacity: 0; transition: opacity 0.2s; font-weight: bold; z-index: 20000;
        }

        @media (max-width: 768px) {
            body { flex-direction: column; height: auto; overflow: auto; }
            #map-container { flex: none; height: 40vh; width: 100%; }
            #info-panel { flex: none; width: 100%; max-width: 100%; min-width: 0; padding: 15px; overflow-y: visible; }
            h1 { font-size: 1.3em; margin-bottom: 10px; }
            #tooltip { display: none !important; }
            #search-container { top: 10px; left: 10px; right: 10px; }
            #country-search { width: 100%; box-sizing: border-box; }
            #country-search:focus { width: 100%; }
            #default-legend, #map-legend { bottom: 10px; left: 10px; font-size: 12px; padding: 8px; }
        }
    </style>
</head>
<body>

    <div id="map-container">
        <div id="map-canvas"></div>
        
        <div id="search-container">
            <input type="text" id="country-search" placeholder="Land, Bauteil oder Mineral suchen..." autocomplete="off">
        </div>
        
        <div id="default-legend">
            <div class="legend-item"><span class="legend-color" style="background: #3498db;"></span> Hauptakteur (Detaillierte Infos)</div>
            <div class="legend-item"><span class="legend-color" style="background: #40BBFF;"></span> Beteiligt (Liefert Rohstoffe/Bauteile)</div>
            <div class="legend-item"><span class="legend-color" style="background: #ecf0f1;"></span> Keine erfasste Rolle</div>
        </div>

        <div id="map-legend">
            <div class="legend-item"><span class="legend-color" style="background: #e67e22;"></span> Rohstoff-Abbau (Fördern)</div>
            <div class="legend-item"><span class="legend-color" style="background: #9b59b6;"></span> Verarbeitung & Montage</div>
            <div class="legend-item"><span class="legend-color" style="background: #e74c3c;"></span> Beides (Abbau & Montage)</div>
        </div>

        <div id="loading">Lade Weltkarte...</div>
        <div id="tooltip"></div>
    </div>

    <div id="info-panel">
        <h1>Die globale Smartphone-Lieferkette</h1>
        
        <div id="default-message">
            Klicke auf ein Land oder suche nach Bauteilen/Rohstoffen, um die echten, weltweiten Transportwege der Logistikbranche zu analysieren.
        </div>

        <div id="search-results"></div>

        <div id="country-details" class="info-section"></div>
    </div>

    <script>
        // --- Klick-Bugfix: Verhindert, dass die Map Klicks auf das Suchfeld stiehlt ---
        const searchInput = document.getElementById("country-search");
        ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'keydown', 'keyup', 'keypress'].forEach(evt => {
            searchInput.addEventListener(evt, (e) => e.stopPropagation());
        });

        let countryCentroids = {};

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
            "Zambia": "Sambia", "Zimbabwe": "Simbabwe","Northern Cyprus":"Nordzypern","French Southern and Antarctic Lands":"Die Französischen Süd- und Antarktisgebiete"
        };

        const materialTranslations = {
            "Silizium": ["silicon"], "Kupfer": ["copper"], "Gold": ["gold"], "Tantal": ["tantalum"], "Wolfram": ["tungsten"], "Hafnium": ["hafnium"], "Bor": ["boron"], "Phosphor": ["phosphorus"], "Zinn": ["tin"], "Silber": ["silver"], "Epoxidharz": ["epoxy", "epoxy resin", "resin"], "Glasfaser": ["fiberglass", "glass fiber"], "Kohlenstoff": ["carbon"], "Glas": ["glass"], "Kunststoff": ["plastic"], "Neodym": ["neodymium"], "Eisen": ["iron"], "Aluminium": ["aluminum", "aluminium"], "Lithium": ["lithium"], "Kobalt": ["cobalt"], "Graphit": ["graphite"], "Nickel": ["nickel"], "Mangan": ["manganese"], "Edelstahl": ["stainless steel"], "Ferrit": ["ferrite"], "Zink": ["zinc"], "Lanthan": ["lanthanum"], "Niob": ["niobium"], "Magnesiumfluorid": ["magnesium fluoride"], "Polymere": ["polymers", "polymer"], "Antimon": ["antimony"], "Argon": ["argon"], "Gallium": ["gallium"], "Arsen": ["arsenic"], "Zirkon": ["zirconium"], "Titan": ["titanium"], "Polycarbonat": ["polycarbonate"], "Quarzglas": ["quartz glass", "quartz"], "Germanium": ["germanium"], "PTFE": ["ptfe", "teflon"], "ABS": ["abs"], "LCP": ["lcp"], "Messing": ["brass"], "PEEK": ["peek"], "Chrom": ["chromium", "chrome"]
        };

        const componentTranslations = {
            "Smartphone-CPU": ["cpu", "processor", "smartphone cpu"],
            "Smartphone-GPU": ["gpu", "graphics", "smartphone gpu"],
            "Smartphone-SoC": ["soc", "system on a chip", "smartphone soc"],
            "Smartphone-Hauptplatine (PCB)": ["motherboard", "mainboard", "pcb", "printed circuit board"],
            "Smartphone-NPU": ["npu", "neural processing unit", "smartphone npu"],
            "LPDDR-RAM": ["ram", "memory"],
            "NAND-Flash-Speicher": ["nand", "flash memory", "storage"],
            "OLED-Display-Panel": ["oled", "display", "screen", "panel"],
            "Smartphone-Digitizer": ["digitizer", "touch screen", "touchscreen"],
            "LRA (Vibrationsmotor)": ["lra", "vibration motor", "haptic", "motor"],
            "Lithium-Ionen-Akku": ["battery", "lithium-ion battery", "accumulator"],
            "PMIC": ["pmic", "power management"],
            "USB-C-Ladebuchse": ["usb-c", "charging port", "port", "usb"],
            "Induktionsspule (Wireless Charging)": ["induction coil", "wireless charging", "coil"],
            "Kameramodul (Sensor-Einheit)": ["camera module", "camera", "sensor"],
            "MEMS-Gyroskop": ["gyroscope", "gyro"],
            "MEMS-Beschleunigungssensor": ["accelerometer"],
            "Annäherungssensor (IR)": ["proximity sensor"],
            "Umgebungslichtsensor (ALS)": ["ambient light sensor", "als", "light sensor"],
            "5G-Modem": ["5g modem", "modem", "baseband"],
            "Antennen-Module": ["antenna", "antenna modules"],
            "NFC-Chip": ["nfc chip", "nfc"],
            "MEMS-Mikrofon": ["microphone", "mic"],
            "Smartphone-Lautsprecher": ["speaker", "loudspeaker"]
        };

        const countryNarratives = {
            "China": { 
                abbau: "Quarzsand (Silizium & Glasfaser), Phosphaterze, Wolfram (>80%), Gold, Zinn, Silber, Indium", 
                verarbeitung: "Reinstsilizium, Wolfram-Veredelung, Kupferraffination, Tantal, Gold- & Nickel-Raffination, Lotlegierungen, Massenfertigung Kupfer-Heatspreader, Indium-Plättchen",
                verwendung: "Silizium bildet den Chip (Die). Phosphor dotiert Transistoren. Wolfram bildet interne Kontakte. Gold für Kontaktflächen. Zinn/Silber/Indium für Lötverbindungen und Wärmeübertragung (TIM). Kupfer für den Kühlkörper. Nickel als Unterbeschichtung.",
                arbeitsbedingungen: "Stark variierende Bedingungen. Während High-Tech-Fabriken moderne Standards aufweisen, gibt es im Bergbau und bei Vorlieferanten oft extrem lange Arbeitszeiten (996-Arbeitskultur) und mangelhaften Gesundheitsschutz. Bei einigen Rohstoffen gibt es wiederholt internationale Vorwürfe von Zwangsarbeit."
            },
            "USA": { 
                abbau: "Quarzsand (Silizium & Glasfaser), Bor, Kupfer, Erdöl/Erdgas, Gold", 
                verarbeitung: "Reinstsilizium, Wafer-Fertigung/Chip-Belichtung (Intel), Gase (Bor/Phosphor), Tantal-Veredelung, Indium-Aufbereitung",
                verwendung: "Silizium für den Hauptchip. Bor/Phosphor zur elektrischen Steuerung der Transistoren. Kupfer/Tantal für Chip-Verdrahtung. Erdöl/Erdgas wird zu Kunstharz für die Trägerplatte (Substrat). Glasfaser stabilisiert das Package.",
                arbeitsbedingungen: "Strenge Arbeitsgesetze und sehr hohe Sicherheitsstandards in der industriellen Fertigung. In der Halbleiterindustrie arbeiten meist hochqualifizierte, gut bezahlte Spezialisten."
            },
            "Deutschland": { 
                abbau: "Keine wesentlichen primären Abbaugebiete für Smartphone-Metalle.", 
                verarbeitung: "Reinstsilizium (z. B. Wacker Chemie), Hafnium-Aufbereitung, Wolfram/Kobalt (Pulver/Targets), Kupferraffination, Tantal-Veredelung",
                verwendung: "Reinstsilizium ist das Grundmaterial der Wafer. Hafnium isoliert Transistor-Gates. Wolfram/Kobalt dienen als mikroskopische Stecker (Plugs) im Chip. Kupfer/Tantal bilden die Leiterbahnen auf dem Die.",
                arbeitsbedingungen: "Zählt zu den Ländern mit den weltweit höchsten Arbeits- und Sozialstandards. Starke Gewerkschaften, strenge Regulierung des Arbeitsschutzes und der Arbeitszeiten."
            },
            "Taiwan": { 
                abbau: "Keine wesentlichen primären Abbaugebiete.", 
                verarbeitung: "Wafer-Fertigung/Chip-Belichtung (TSMC), Substrate/Trägerplatinen (z. B. Unimicron), Lotlegierungen, Kupfer-Heatspreader",
                verwendung: "Hier entsteht in der Wafer-Fertigung das 'Gehirn' (der Die). Komplexe mehrlagige Substrate bilden die grüne Trägerplatte. Lotlegierungen verbinden Die und Substrat physisch und elektrisch.",
                arbeitsbedingungen: "Gute Bezahlung, aber extremer Leistungs- und Zeitdruck in der Halbleiterindustrie. Lange Schichten und Überstunden sind in Chip-Fabriken (Fabs) normal, um den 24/7-Betrieb aufrechtzuerhalten."
            },
            "Südkorea": { 
                abbau: "Indium (Nebenprodukt)", 
                verarbeitung: "Wafer-Fertigung/Chip-Belichtung (Samsung), Substrate/Trägerplatinen, Indium-Lot-Plättchen",
                verwendung: "Fertigung des Prozessor-Chips (Die) und der zugehörigen Trägerplatinen. Indium-Lot wird als Thermal Interface Material (TIM) extrem wärmeleitend zwischen Chip und Kupferdeckel eingesetzt.",
                arbeitsbedingungen: "Moderne Arbeitsrechte, aber eine Kultur des extremen Wettbewerbs. Lange Arbeitszeiten und strikte Hierarchien prägen den Arbeitsalltag in großen Technologiekonzernen."
            },
            "Japan": { 
                abbau: "Indium (Nebenprodukt)", 
                verarbeitung: "Hochreine Gase, Hafnium-Aufbereitung, Substrate/Trägerplatinen (z. B. Ibiden), Nickel-Spezialveredelung, Lotlegierungen",
                verwendung: "Gase (Bor/Phosphor) machen Transistoren leitfähig. Hafnium isoliert. Hier werden zudem essenzielle mehrlagige Trägerplatinen (Substrate) hergestellt. Nickel und Lot dienen den elektrischen Kontakten.",
                arbeitsbedingungen: "Stark regulierte Sicherheit und hohe Qualitätsstandards. Traditionell gibt es eine Überstundenkultur ('Karoshi'-Gefahr), wenngleich die Regierung in den letzten Jahren schärfere Gesetze zur Begrenzung von Arbeitszeiten erlassen hat."
            },
            "Saudi-Arabien": {
                abbau: "Erdöl und Erdgas",
                verarbeitung: "-",
                verwendung: "Erdöl und Erdgas aus dem Nahen Osten bilden die chemische Basis für Epoxidharze. Diese Kunstharze sind das unverzichtbare Trägermaterial für die komplexe, mehrlagige grüne Trägerplatine (Package/Substrat).",
                arbeitsbedingungen: "Starke Abhängigkeit von ausländischen Wanderarbeitern im Energiesektor. Obwohl es Reformen gab, werden die Bedingungen für Arbeitsmigranten (Kafala-System) von Menschenrechtsorganisationen weiterhin oft als prekär eingestuft."
            },
            "DR Kongo": { 
                abbau: "Kobalt (>70%), Tantal (Coltan)", 
                verarbeitung: "Wird meist roh exportiert.",
                verwendung: "Kobalt wird für interne, mikroskopische Kontakte (Plugs) auf dem Silizium-Chip verwendet. Tantal ist essenziell für die extrem feine Leiterbahn-Verdrahtung direkt auf dem Chip.",
                arbeitsbedingungen: "Eines der kritischsten Länder der Lieferkette: Im informellen Kleinbergbau (Artisanal Mining) gibt es weit verbreitete, teils lebensgefährliche Kinderarbeit und Zwangsarbeit. Schutzbekleidung fehlt fast vollständig. Oft finanzieren Minen bewaffnete Konflikte (Konfliktmineralien)."
            },
            "Chile": { 
                abbau: "Kupfer", 
                verarbeitung: "Kupferkonzentrate",
                verwendung: "Kupfer bildet die winzigen Leiterbahnen direkt auf dem Silizium-Chip und wird massiv für den dicken, wärmeableitenden Deckel (Heatspreader) der CPU. verwendet.",
                arbeitsbedingungen: "Der industrielle Bergbau ist stark gewerkschaftlich organisiert und formell reguliert. Dennoch bleiben Minenarbeiter hohen gesundheitlichen Belastungen (Feinstaub, Chemikalien) ausgesetzt."
            },
            "Peru": { 
                abbau: "Kupfer, Zinn, Silber", 
                verarbeitung: "-",
                verwendung: "Kupfer für Verdrahtung und Kühlkörper. Zinn und Silber sind die Hauptbestandteile von Lotlegierungen, die für BGA-Verbindungen (Lotkugeln an der Unterseite der CPU) genutzt werden.",
                arbeitsbedingungen: "Neben regulierten Großminen gibt es viel informellen Bergbau. Dort fehlen oft grundlegende Sicherheitsstandards, und das Risiko von Arbeitsausbeutung ist hoch."
            },
            "Australien": { 
                abbau: "Hafnium, Gold", 
                verarbeitung: "Gold-Raffination",
                verwendung: "Hafnium isoliert als High-k-Dielektrikum moderne Transistoren (verhindert Kriechstrom). Gold wird für stark leitende Kontaktflächen und Draht-Bonding auf der Platine genutzt.",
                arbeitsbedingungen: "Sehr hohe Standards bei Arbeitsschutz und Sicherheit. Bergarbeiter und Ingenieure sind in der Regel hervorragend ausgebildet und zählen zu den Bestverdienenden im Land."
            },
            "Südafrika": { 
                abbau: "Hafnium", 
                verarbeitung: "Gold-Raffination",
                verwendung: "Hafnium dient der elektrischen Isolierung winziger Transistor-Gates. Gold wird in der Veredelung für die Kontaktflächen auf dem CPU-Substrat verwendet.",
                arbeitsbedingungen: "Formell existieren gute Arbeitsschutzgesetze, jedoch ist die Realität im Bergbau (Tiefminen) von extrem harter, gefährlicher körperlicher Arbeit geprägt. Es kommt häufig zu Streiks bezüglich unzureichender Löhne."
            },
            "Indonesien": { 
                abbau: "Nickel (weltweit größter Förderer), Zinn", 
                verarbeitung: "Massive Verarbeitungskapazitäten für Nickel",
                verwendung: "Nickel dient als Unterbeschichtung für Goldkontakte und wird als Korrosionsschutz galvanisch über den Kupfer-Heatspreader (Deckel) gezogen. Zinn bildet Basis-Lotkugeln.",
                arbeitsbedingungen: "Die extrem schnelle Ausweitung des Nickelbergbaus führt zunehmend zu Berichten über fatale Arbeitsunfälle in den Schmelzanlagen, mangelnden Arbeitsschutz und Belastung der umliegenden Dörfer durch giftige Abwässer."
            },
            "Russland": { 
                abbau: "Quarzsand (Silizium), Erdgas/Erdöl, Gold, Nickel", 
                verarbeitung: "-",
                verwendung: "Silizium ist Grundmaterial für Wafer. Erdgas/Erdöl ist die chemische Basis für die Epoxidharz-Trägerplatte. Gold und Nickel sichern langlebige und extrem leitfähige Kontakte.",
                arbeitsbedingungen: "Im industriellen Rohstoffsektor herrschen oft raue Bedingungen. Unabhängige Gewerkschaften sind stark eingeschränkt, was die Durchsetzung von besseren Arbeitsbedingungen erschwert."
            },
            "Brasilien": { 
                abbau: "Quarzsand (Silizium), Tantal", 
                verarbeitung: "-",
                verwendung: "Silizium als Grundmaterial des Mikrochips. Tantal wird für die extrem feine, local Verdrahtung direkt im Silizium-Die verwendet, da es thermisch hochstabil ist.",
                arbeitsbedingungen: "Ein Mix aus stark industrialisiertem Bergbau mit guten Standards und informellen Minen ('Garimpos'), in denen prekäre Bedingungen, Umweltzerstörung (Amazonas) und teils illegale Sklavenarbeit herrschen."
            },
            "Türkei": { 
                abbau: "Bor (>70%)", 
                verarbeitung: "-",
                verwendung: "Bor wird als Gas bei der Chip-Herstellung in das Silizium 'eingeschossen' (Dotierung). Erst dadurch werden die Transistoren gesteuert leitfähig.",
                arbeitsbedingungen: "Der Bergbau wird staatlich reguliert, allerdings stand die Türkei in der Vergangenheit nach schweren Grubenunglücken wegen Lücken bei der Arbeitssicherheit stark in der Kritik."
            },
            "Marokko": { 
                abbau: "Phosphaterze", 
                verarbeitung: "-",
                verwendung: "Phosphor wird zur Dotierung des Silizium-Wafers genutzt, um die elektrischen Eigenschaften der Transistoren für die P-N-Übergänge gezielt zu verändern.",
                arbeitsbedingungen: "Der Phosphatabbau wird von staatlichen Unternehmen kontrolliert und ist formell reguliert. Kritisiert werden jedoch oft die politischen Begleitumstände, da ein Teil des Abbaus in der umstrittenen Region Westsahara stattfindet."
            },
            "Schweiz": { 
                abbau: "-", 
                verarbeitung: "Weltweite Hochraffination von Gold",
                verwendung: "Hochreines Gold wird für die winzigen Kontaktflächen auf dem Substrat und für das Draht-Bonding genutzt, da es als Edelmetall nicht oxidiert.",
                arbeitsbedingungen: "Höchste globale Standards bei Arbeitsschutz, Bezahlung und Sicherheit in den Veredelungsanlagen."
            },
            "Malaysia": { 
                abbau: "-", 
                verarbeitung: "Lotlegierungen, Endmontage (Chip-Zusammensetzung & Nickel-Überzug)",
                verwendung: "Lotlegierungen verbinden den Silizium-Chip mit der Trägerplatte. In der Endmontage wird der Kupferdeckel zum Schutz vor Oxidation mit Nickel überzogen und auf das Package verklebt.",
                arbeitsbedingungen: "Wichtiger Hub für das 'Packaging' (Zusammenbau). Sehr oft arbeiten hier migrantische Arbeitskräfte aus Nachbarländern. NGOs berichten wiederholt von Praktiken, die an Zwangsarbeit grenzen (Pässe werden einbehalten, Arbeiter hoch verschuldet)."
            },
            "Vietnam": { 
                abbau: "-", 
                verarbeitung: "Endmontage (Smartphone-Zusammensetzung)",
                verwendung: "Hauptsächlich Packaging und Endmontage: Die Platinen werden gelötet und die Geräte montiert.",
                arbeitsbedingungen: "Als aufstrebender Standort für Technologiefertigung gibt es viele moderne Fabriken. Dennoch sind die Löhne niedrig und lange Arbeitszeiten sowie restriktive Pausenregelungen sind keine Seltenheit."
            },
            "Frankreich": { 
                abbau: "-", 
                verarbeitung: "Chemische Aufbereitung von Hafnium",
                verwendung: "Hafnium dient als unverzichtbares Isoliermaterial für die winzigen Transistor-Gates, um das unerwünschte Abfließen von Strom zu verhindern.",
                arbeitsbedingungen: "Sehr hohe europäische Arbeits- und Sicherheitsstandards in class chemischen Industrie."
            },
            "Finnland": { 
                abbau: "-", 
                verarbeitung: "Wolfram/Kobalt-Veredelung zu Reinstpulver",
                verwendung: "Wolfram und Kobalt werden für die mikroskopisch kleinen, internen Stecker (Plugs) verwendet, die Milliarden Transistoren auf dem Chip verbinden.",
                arbeitsbedingungen: "Vorbildliche skandinavische Arbeitsrechte, hohes Maß an Mitbestimmung, starker Gesundheits- und Arbeitsschutz."
            },
            "Kanada": { 
                abbau: "Gold", 
                verarbeitung: "Wolfram/Kobalt-Veredelung",
                verwendung: "Gold für oxidationsfreie Kontaktflächen am CPU-Sockel. Wolfram und Kobalt werden für die interne Verdrahtung und Kontaktstecker (Plugs) auf Transistorebene genutzt.",
                arbeitsbedingungen: "Strenge staatliche Überwachung im industriellen Bergbau und hohe Sicherheitsauflagen für Arbeiter."
            },
            "Ruanda": { 
                abbau: "Tantal", 
                verarbeitung: "-",
                verwendung: "Tantal ist essenziell für die extrem feine, lokale Verdrahtung (Interconnects) und dient als Diffusionsbarriere direkt auf dem Silizium-Chip.",
                arbeitsbedingungen: "Bemüht sich darum, eine 'konfliktfreie' Bezugsquelle für Tantal zu sein (mit Blockchain-Tracking). Dennoch bleibt der informelle Abbau harte Handarbeit, und es gibt das Risiko, dass Mineralien aus prekären Nachbarländern geschmuggelt werden."
            },
            "Ghana": { 
                abbau: "Gold", 
                verarbeitung: "-",
                verwendung: "Gold wird in der finalen Platine für Kontaktflächen genutzt, da es den perfekten Mix aus Leitfähigkeit und Korrosionsbeständigkeit bietet.",
                arbeitsbedingungen: "Neben dem regulierten industriellen Bergbau gibt es massiv informellen Kleinbergbau ('Galamsey'). Hier sind oft Kinder beteiligt, und Arbeiter vergiften sich chronisch bei der Goldgewinnung durch fehlende Schutzkleidung und hochgiftiges Quecksilber."
            },
            "Philippinen": { 
                abbau: "Nickel", 
                verarbeitung: "-",
                verwendung: "Nickel wird als silberglänzender Überzug aufgetragen, um Korrosion zu verhindern, und dient als Barriere unter Goldkontakten.",
                arbeitsbedingungen: "Der Abbau führt oft zu Konflikten mit indigenen Bevölkerungsgruppen. Die Sicherheitsstandards schwanken stark; oftmals klagen Arbeiter über mangelnde Ausrüstung bei gefährlichen Tätigkeiten."
            },
            "Mexiko": { 
                abbau: "Silber", 
                verarbeitung: "-",
                verwendung: "Silber ist neben Zinn ein Hauptbestandteil moderner Lotlegierungen. Diese bilden die BGA-Kügelchen, die die Bauteile elektrisch mit dem Mainboard verbinden.",
                arbeitsbedingungen: "Regulierte Großminen bieten formelle Beschäftigung, jedoch gibt es in abgelegenen Gebieten ein starkes Risiko durch den Einfluss organisierter Kriminalität (Kartelle), was die Sicherheit der Minenarbeiter massiv gefährdet."
            },
            "Myanmar": { 
                abbau: "Zinn", 
                verarbeitung: "-",
                verwendung: "Zinn ist die Basis aller Lötverbindungen. Es wird benötigt, um die Chips auf die Trägerplatte zu löten, sowie zur späteren Mainboard-Verbindung.",
                arbeitsbedingungen: "Hochgradig kritisch. Der Abbau findet teils in Konfliktzonen statt und finanziert Rebellengruppen oder das Militär. Es herrschen oft desaströse Sicherheitsbedingungen ohne jeglichen Arbeitsschutz, und es gibt Berichte über Zwangsarbeit."
            },
            "Großbritannien": {
                abbau: "Eisen, Kupfer",
                verarbeitung: "-",
                verwendung: "Speziallegierungen für Gehäuse oder Lautsprecher.",
                arbeitsbedingungen: "Europäische Arbeits- und Sicherheitsstandards."
            },
            "Niederlande": {
                abbau: "-",
                verarbeitung: "NFC-Chips, Halbleiter-Ausrüstung",
                verwendung: "Zentrale Rolle in der Verarbeitung von NFC/Kommunikation.",
                arbeitsbedingungen: "Sehr hohe europäische Standards."
            },
            "Italien": {
                abbau: "-",
                verarbeitung: "MEMS-Sensoren (Beschleunigung, Gyroskop)",
                verwendung: "Hochpräzise Mikroelektronik-Fertigung.",
                arbeitsbedingungen: "Europäische Standards, starker Arbeitsschutz."
            },
            "Österreich": {
                abbau: "-",
                verarbeitung: "Licht- und Kamerasensoren",
                verwendung: "Produktion hochspezialisierter optischer Sensoren.",
                arbeitsbedingungen: "Sehr hohe Standards bei Arbeitssicherheit."
            }
        };

        const cpuData = {
            cpu: { name: "Smartphone-CPU", category: "LOGIC", materials: ["Silizium", "Kupfer", "Gold", "Tantal", "Wolfram", "Hafnium"], geography: { mining: ["China", "USA", "DR Kongo", "Chile", "Australien", "Südafrika", "Brasilien", "Ruanda"], manufacturing: ["Taiwan", "Südkorea", "USA", "Deutschland", "Japan", "Frankreich"] }, technicalSummary: "Der zentrale Hauptprozessor (Central Processing Unit), meist als Teil des SoC. Übernimmt die Kern-Rechenoperationen und Steuerung des Systems." },
            gpu: { name: "Smartphone-GPU", category: "LOGIC", materials: ["Silizium", "Kupfer", "Gold", "Tantal"], geography: { mining: ["China", "Chile", "Australien", "DR Kongo"], manufacturing: ["Taiwan", "Südkorea", "USA"] }, technicalSummary: "Grafikprozessor, oft direkt in den SoC integriert. Übernimmt hochparallele Rechenaufgaben für Rendering." },
            soc: { name: "Smartphone-SoC", category: "LOGIC", materials: ["Silizium", "Kupfer", "Gold", "Tantal", "Bor", "Phosphor"], geography: { mining: ["China", "Australien", "DR Kongo", "USA", "Chile"], manufacturing: ["Taiwan", "Südkorea", "USA"] }, technicalSummary: "System-on-a-Chip: Das zentrale Rechengehirn (CPU, GPU, NPU)." },
            pcb: { name: "Smartphone-Hauptplatine (PCB)", category: "PLATFORM", materials: ["Kupfer", "Gold", "Zinn", "Silber", "Epoxidharz", "Glasfaser"], geography: { mining: ["Chile", "Peru", "China", "Australien", "Mexiko", "Indonesien"], manufacturing: ["China", "Taiwan", "Japan"] }, technicalSummary: "Das High-Density-Interconnect (HDI) Board aus dutzenden Schichten, das alle Komponenten elektrisch verbindet." },
            npu: { name: "Smartphone-NPU", category: "LOGIC", materials: ["Silizium", "Kupfer", "Gold"], geography: { mining: ["China", "Chile"], manufacturing: ["Taiwan", "Südkorea"] }, technicalSummary: "Neural Processing Unit: Spezialisierter Chip zur Hardware-Beschleunigung von KI-Algorithmen." },
            ram: { name: "LPDDR-RAM", category: "STORAGE", materials: ["Silizium", "Kupfer", "Gold", "Wolfram"], geography: { mining: ["China", "Chile", "Australien"], manufacturing: ["Südkorea", "Taiwan", "USA", "Japan"] }, technicalSummary: "Flüchtiger Arbeitsspeicher, meist im PoP-Verfahren direkt auf den SoC gestapelt." },
            nand: { name: "NAND-Flash-Speicher", category: "STORAGE", materials: ["Silizium", "Kupfer", "Gold", "Wolfram"], geography: { mining: ["China", "Chile", "Australien"], manufacturing: ["Südkorea", "Japan", "USA", "China"] }, technicalSummary: "Permanenter Datenspeicher (UFS) mit enorm hohen Lese-/Schreibraten." },
            oledDisplay: { name: "OLED-Display-Panel", category: "INTERFACE", materials: ["Indium", "Silizium", "Kohlenstoff", "Gold", "Glas", "Kunststoff"], geography: { mining: ["China", "Australien"], manufacturing: ["Südkorea", "China", "Japan"] }, technicalSummary: "Organische Leuchtdioden auf einer TFT-Backplane (oft LTPO) ohne Hintergrundbeleuchtung." },
            digitizer: { name: "Smartphone-Digitizer", category: "INTERFACE", materials: ["Indium", "Zinn", "Kupfer", "Glas"], geography: { mining: ["China", "Indonesien", "Chile", "Peru"], manufacturing: ["Südkorea", "China", "Taiwan"] }, technicalSummary: "Hauchdünne Sensorschicht zur kapazitiven Messung von Touch-Eingaben." },
            lraMotor: { name: "LRA (Vibrationsmotor)", category: "MECHANICS", materials: ["Neodym", "Eisen", "Kupfer", "Wolfram", "Aluminium"], geography: { mining: ["China", "Chile", "Peru"], manufacturing: ["China", "Japan"] }, technicalSummary: "Linear Resonant Actuator für präzises haptisches Feedback." },
            battery: { name: "Lithium-Ionen-Akku", category: "POWER", materials: ["Lithium", "Kobalt", "Graphit", "Nickel", "Aluminium", "Kupfer", "Mangan"], geography: { mining: ["DR Kongo", "Australien", "Chile", "China", "Indonesien"], manufacturing: ["China", "Südkorea", "Japan"] }, technicalSummary: "Primäre Energiequelle mit komplexer Zellchemie." },
            pmic: { name: "PMIC", category: "POWER", materials: ["Silizium", "Kupfer", "Gold"], geography: { mining: ["Chile", "Australien"], manufacturing: ["Taiwan", "USA", "Deutschland"] }, technicalSummary: "Power Management IC: Kontrolliert Spannungen und Ströme für alle Komponenten." },
            usbC: { name: "USB-C-Ladebuchse", category: "INTERFACE", materials: ["Edelstahl", "Kupfer", "Gold", "Kunststoff"], geography: { mining: ["Südafrika", "Chile", "Peru", "Australien"], manufacturing: ["China", "Taiwan"] }, technicalSummary: "Schnittstelle für Ladekabel und Daten." },
            wirelessCoil: { name: "Induktionsspule (Wireless Charging)", category: "POWER", materials: ["Kupfer", "Ferrit", "Eisen", "Zink", "Mangan"], geography: { mining: ["Chile", "Peru", "China", "Südafrika"], manufacturing: ["China", "Japan"] }, technicalSummary: "Empfängerspule für Qi-Laden, durch Ferrit abgeschirmt." },
            cameraModule: { name: "Kameramodul (Sensor-Einheit)", category: "SENSOR", materials: ["Silizium", "Lanthan", "Bor", "Niob", "Magnesiumfluorid", "Neodym", "Kupfer", "Aluminium", "Polymere"], geography: { mining: ["China", "Chile", "Peru", "Australien", "Brasilien"], manufacturing: ["Japan", "Südkorea", "Taiwan", "China"] }, technicalSummary: "Optoelektronisches System (Stacked-CMOS, Optik, VCM-Aktuator)." },
            gyroscope: { name: "MEMS-Gyroskop", category: "SENSOR", materials: ["Silizium", "Bor", "Phosphor", "Antimon", "Gold", "Aluminium", "Kupfer", "Wolfram", "Argon"], geography: { mining: ["Türkei", "USA", "Marokko", "China", "Russland", "Australien", "Chile", "Peru"], manufacturing: ["Frankreich", "Italien", "Deutschland", "Taiwan", "Japan", "China"] }, technicalSummary: "Mikromechanischer Sensor zur Erfassung der Rotation." },
            accelerometer: { name: "MEMS-Beschleunigungssensor", category: "SENSOR", materials: ["Silizium", "Bor", "Phosphor", "Aluminium", "Kupfer", "Wolfram", "Gold", "Epoxidharz"], geography: { mining: ["Türkei", "USA", "Marokko", "China", "Australien", "Guinea", "Chile", "Peru"], manufacturing: ["Deutschland", "Italien", "Frankreich", "USA", "Taiwan", "Japan", "China", "Malaysia", "Philippinen"] }, technicalSummary: "Misst lineare Beschleunigung durch eine schwebende Masse an Silizium-Federn." },
            proximitySensor: { name: "Annäherungssensor (IR)", category: "SENSOR", materials: ["Gallium", "Arsen", "Gold", "Silizium", "Zirkon", "Titan", "Polycarbonat", "Kupfer"], geography: { mining: ["China", "Marokko", "Australien", "Russland", "Chile", "Peru"], manufacturing: ["USA", "Deutschland", "Taiwan", "Südkorea", "China", "Japan"] }, technicalSummary: "IR-LED und Photodiode zur Erkennung von Objekten in direkter Nähe." },
            ambientLightSensor: { name: "Umgebungslichtsensor (ALS)", category: "SENSOR", materials: ["Silizium", "Titan", "Polycarbonat", "Quarzglas", "Kupfer", "Zinn", "Silber", "Epoxidharz"], geography: { mining: ["Australien", "Südafrika", "China", "Chile", "Peru", "Indonesien", "Mexiko"], manufacturing: ["Österreich", "Deutschland", "USA", "Taiwan", "China", "Japan"] }, technicalSummary: "Photodioden-Array, das Intensität und Farbspektrum des Lichts misst." },
            modem5g: { name: "5G-Modem", category: "COMMUNICATION", materials: ["Silizium", "Gallium", "Germanium", "Kupfer", "PTFE", "Gold", "Zinn", "Silber", "Nickel", "Graphit"], geography: { mining: ["China", "Russland", "Brasilien", "USA", "Chile", "Peru", "Mexiko", "Indonesien", "Philippinen", "Australien"], manufacturing: ["Deutschland", "USA", "Taiwan", "Südkorea", "Japan", "China"] }, technicalSummary: "Baseband-Prozessor zur Übersetzung hochfrequenter Funksignale." },
            antenna: { name: "Antennen-Module", category: "COMMUNICATION", materials: ["Kupfer", "Gold", "Nickel", "LCP", "Polycarbonat", "ABS", "PTFE", "Messing"], geography: { mining: ["Chile", "Peru", "USA", "China", "Australien", "Russland", "Indonesien"], manufacturing: ["China", "Taiwan", "Japan"] }, technicalSummary: "LDS-gelaserte oder auf LCP gedruckte HF-Strukturen." },
            nfcChip: { name: "NFC-Chip", category: "COMMUNICATION", materials: ["Silizium", "Bor", "Phosphor", "Kupfer", "Aluminium", "Ferrit", "Zink", "Mangan", "Zinn", "Silber"], geography: { mining: ["Türkei", "USA", "Marokko", "China", "Chile", "Peru", "Südafrika", "Indonesien", "Mexiko"], manufacturing: ["Niederlande", "Frankreich", "Italien", "Taiwan", "Japan", "Deutschland", "China"] }, technicalSummary: "Controller samt Secure Element und kupfergeätzter Antenne." },
            microphone: { name: "MEMS-Mikrofon", category: "AUDIO", materials: ["Silizium", "Bor", "Phosphor", "Gold", "Aluminium", "Kupfer", "Eisen", "Nickel", "Zinn"], geography: { mining: ["Türkei", "USA", "Marokko", "China", "Australien", "Russland", "Brasilien", "Chile", "Indonesien"], manufacturing: ["USA", "Deutschland", "Italien", "China", "Taiwan"] }, technicalSummary: "Bewegliche Silizium-Membran und ASIC in resonanzfreiem Gehäuse." },
            speaker: { name: "Smartphone-Lautsprecher", category: "AUDIO", materials: ["Neodym", "Eisen", "Kupfer", "PEEK", "Glasfaser", "Edelstahl", "Chrom", "Messing", "Gold"], geography: { mining: ["China", "Chile", "Peru", "USA", "Deutschland", "Großbritannien", "Südafrika", "Brasilien"], manufacturing: ["China", "Vietnam", "Japan"] }, technicalSummary: "Elektromechanisches Modul (Neodym-Antrieb, PEEK-Membran)." }
        };

        function getAllUniqueMaterials() {
            const matSet = new Set();
            Object.values(cpuData).forEach(data => data.materials.forEach(m => matSet.add(m)));
            return Array.from(matSet).sort();
        }
        const allMaterials = getAllUniqueMaterials();

        function getCountryInfo(countryDe) {
            let miningMinerals = new Set();
            let manufacturingComps = [];
            let allComps = [];

            for (const comp of Object.values(cpuData)) {
                if (comp.geography.mining.includes(countryDe)) {
                    comp.materials.forEach(m => miningMinerals.add(m));
                    if (!allComps.includes(comp)) allComps.push(comp);
                }
                if (comp.geography.manufacturing.includes(countryDe)) {
                    manufacturingComps.push(comp);
                    if (!allComps.includes(comp)) allComps.push(comp);
                }
            }
            return { mining: Array.from(miningMinerals), manufacturing: manufacturingComps, components: allComps };
        }

        function getMapDataForMaterial(materialName) {
            const searchTerm = materialName.toLowerCase().trim();
            const miningSet = new Set();
            const manufacturingSet = new Set();

            for (const comp of Object.values(cpuData)) {
                if (comp.materials.some(m => m.toLowerCase() === searchTerm)) {
                    comp.geography.mining.forEach(c => miningSet.add(c));
                    comp.geography.manufacturing.forEach(c => manufacturingSet.add(c));
                }
            }
            return { miningLocations: Array.from(miningSet), manufacturingLocations: Array.from(manufacturingSet) };
        }

        function generateTags(list, type, emptyMessage = "-") {
            if (!list || list.length === 0) return `<span style="color: #7f8c8d; font-style: italic;">${emptyMessage}</span>`;
            return list.map(item => {
                const safeItem = item.replace(/'/g, "\\'");
                return `<span class="clickable-tag" onclick="handleTagClick('${type}', '${safeItem}')">${item}</span>`;
            }).join(" ");
        }

        function clearMapAndUI() {
            g.selectAll("path").classed("highlighted-country highlighted-mining highlighted-manufacturing highlighted-both", false);
            document.getElementById("map-legend").style.display = "none";
            document.getElementById("default-legend").style.display = "block";
            document.getElementById("search-results").style.display = "none";
            document.getElementById("country-details").style.display = "none";
            document.getElementById("default-message").style.display = "block";
        }

        window.handleTagClick = function(type, value) {
            clearMapAndUI(); 
            document.getElementById("country-search").value = value;
            
            if (type === 'mineral') showMineralInfo(value);
            else if (type === 'country') {
                let enName = Object.keys(countryTranslations).find(key => countryTranslations[key] === value);
                if (!enName) enName = value;
                showCountryInfo(enName);
            } else if (type === 'component') {
                const comp = Object.values(cpuData).find(c => c.name === value);
                if (comp) showComponentInfo(comp);
            }
        };

        function autoLinkText(text) {
            if (!text || text === "-") return text;
            const materials = getAllUniqueMaterials();
            const components = Object.values(cpuData).map(c => c.name);
            const terms = [...components, ...materials].sort((a, b) => b.length - a.length);
            
            let placeholders = [];
            terms.forEach((term) => {
                const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedTerm})`, 'gi');
                if (regex.test(text)) {
                    text = text.replace(regex, function(match) {
                        const isMaterial = materials.some(m => m.toLowerCase() === term.toLowerCase());
                        const originalTerm = isMaterial ? materials.find(m => m.toLowerCase() === term.toLowerCase()) : components.find(c => c.toLowerCase() === term.toLowerCase());
                        const type = isMaterial ? 'mineral' : 'component';
                        placeholders.push(`<span class="text-link-tag" onclick="handleTagClick('${type}', '${originalTerm}')">${match}</span>`);
                        return `__PLCHLDR${placeholders.length - 1}__`;
                    });
                }
            });
            placeholders.forEach((html, i) => { text = text.replace(new RegExp(`__PLCHLDR${i}__`, 'g'), html); });
            return text;
        }

        function highlightRoles(miningArray, manufacturingArray) {
            g.selectAll("path").each(function(d) {
                const countryEn = d.properties.name;
                const countryDe = countryTranslations[countryEn] || countryEn;
                const isMining = miningArray.includes(countryDe);
                const isManufacturing = manufacturingArray.includes(countryDe);
                
                if (isMining && isManufacturing) d3.select(this).classed("highlighted-both", true).raise();
                else if (isMining) d3.select(this).classed("highlighted-mining", true).raise();
                else if (isManufacturing) d3.select(this).classed("highlighted-manufacturing", true).raise();
            });
            
            document.getElementById("default-legend").style.display = "none";
            document.getElementById("map-legend").style.display = "block";
        }

        function renderDetails(title, sections) {
            document.getElementById("default-message").style.display = "none";
            document.getElementById("search-results").style.display = "none";
            const container = document.getElementById("country-details");
            container.style.display = "block";
            
            let html = `<h2 style="color: #e74c3c; margin-bottom: 5px;">${title}</h2>`;
            sections.forEach(sec => {
                const headerColor = sec.color || "#2980b9";
                html += `<h3 style="color: ${headerColor}; border-bottom: 2px solid #eee; padding-bottom: 5px; font-size: 1.1em; margin-top: 20px;">${sec.title}</h3>`;
                html += `<p style="line-height: 1.5; color: #34495e; margin-top: 5px;">${sec.content}</p>`;
            });
            container.innerHTML = html;
        }

        function showCountryInfo(countryEn) {
            const countryDe = countryTranslations[countryEn] || countryEn;
            const info = getCountryInfo(countryDe);
            const narrative = countryNarratives[countryEn] || countryNarratives[countryDe];

            document.getElementById("map-legend").style.display = "none";
            document.getElementById("default-legend").style.display = "none";
            
            g.selectAll("path").filter(p => p.properties.name === countryEn).classed("highlighted-country", true).raise();

            let sections = [];
            if (info.components.length > 0) {
                sections.push({ title: "Wird hier gefördert (Rohstoffe)", content: generateTags(info.mining, 'mineral', 'Kein primärer Abbau erfasst.') });
                sections.push({ title: "Wird hier verarbeitet / montiert", content: generateTags(info.manufacturing.map(c => c.name), 'component', 'Keine Endmontage erfasst.') });
                sections.push({ title: "Beteiligt an Smartphone-Bauteilen", content: generateTags(info.components.map(c => c.name), 'component', 'Keine Beteiligung.') });
            } else {
                sections.push({ title: "Status", content: "Dieses Land spielt in der abgebildeten Smartphone-Lieferkette keine erfasste Hauptrolle." });
            }

            if (narrative) {
                sections.push({ title: "Zusammenfassung Abbau", content: autoLinkText(narrative.abbau) });
                sections.push({ title: "Zusammenfassung Verarbeitung", content: autoLinkText(narrative.verarbeitung) });
                sections.push({ title: "Verwendung im Gerät", content: autoLinkText(narrative.verwendung) });
                sections.push({ title: "Arbeitsbedingungen & Ethik", content: narrative.arbeitsbedingungen, color: "#e67e22" });
            } else if (info.components.length > 0) {
                sections.push({ title: "Arbeitsbedingungen & Ethik", content: "Keine spezifischen Daten zu den Arbeitsbedingungen in diesem Land verfügbar.", color: "#e67e22" });
            }
            renderDetails(`Land: ${countryDe}`, sections);
        }

        function showComponentInfo(comp) {
            highlightRoles(comp.geography.mining, comp.geography.manufacturing);
            
            // Transport-Erklärung je nach Bauteil
            let transportDesc = "";
            const highValueAir = ["Smartphone-CPU", "Smartphone-GPU", "Smartphone-SoC", "Smartphone-NPU", "LPDDR-RAM", "NAND-Flash-Speicher", "Kameramodul (Sensor-Einheit)", "5G-Modem", "OLED-Display-Panel", "MEMS-Gyroskop", "MEMS-Beschleunigungssensor", "Annäherungssensor (IR)", "Umgebungslichtsensor (ALS)", "NFC-Chip"];
            const hazmatSea = ["Lithium-Ionen-Akku"]; 
            
            if (hazmatSea.includes(comp.name)) {
                transportDesc = "<b>🚢 Seefracht (Gefahrgut):</b> Akkus unterliegen strengen IATA-Flugverboten. Sie müssen interkontinental fast ausschließlich sicher in Spezial-Containern verschifft werden.<br><br><b>🚛 Gefahrgut-LKW:</b> Wird für den Transport über verbundene Landmassen genutzt.";
            } else if (highValueAir.includes(comp.name)) {
                transportDesc = "<b>✈️ Luftfracht:</b> Dieses Bauteil ist extrem wertvoll, sensibel und leicht. Um in den kurzen Produktzyklen mithalten zu können, wird es weltweit geflogen.<br><br><b>🚛 Sicherheits-LKW:</b> Übernimmt die kontinentale Feinverteilung von den Flughäfen zu den Fabriken.";
            } else {
                transportDesc = "<b>🚢 Container-Seefracht:</b> Wird für Ozean-Routen genutzt, da das Bauteil schwerer oder in Massen benötigt wird.<br><br><b>🚛 LKW / Güterzug:</b> Übernimmt den Massentransport auf zusammenhängenden Landmassen.";
            }

            renderDetails(`Bauteil: ${comp.name}`, [
                { title: "System-Kategorie", content: comp.category },
                { title: "Verwendete Rohstoffe", content: generateTags(comp.materials, 'mineral', 'Keine Rohstoffe erfasst.') },
                { title: "Abbau-Länder (Mining)", content: generateTags(comp.geography.mining, 'country', 'Keine Länder erfasst.') },
                { title: "Verarbeitungs-Länder (Manufacturing)", content: generateTags(comp.geography.manufacturing, 'country', 'Keine Länder erfasst.') },
                { title: "Technische Details", content: autoLinkText(comp.technicalSummary) },
                { title: "Logistik & Transportweg", content: transportDesc, color: "#27ae60" } 
            ]);
        }

        function showMineralInfo(mineral) {
            const mapData = getMapDataForMaterial(mineral);
            highlightRoles(mapData.miningLocations, mapData.manufacturingLocations);
            
            const usedInComps = Object.values(cpuData).filter(c => c.materials.includes(mineral)).map(c => c.name);
            const mineralTransportDesc = "<b>🚢 Massengut-Frachter (Bulk):</b> Rohe Mineralien und Erze sind extrem schwer und haben einen geringen Kilo-Wert. Sie werden fast ausschließlich über die Weltmeere verschifft.<br><br><b>🚛 Güterzug / LKW (Schwerlast):</b> Übernimmt den Transport von den Minen zu den Häfen und Schmelzanlagen.";

            renderDetails(`Rohstoff: ${mineral}`, [
                { title: "Verwendet in Smartphone-Bauteilen", content: generateTags(usedInComps, 'component', 'Keine Bauteile erfasst.') },
                { title: "Abbau-Länder", content: generateTags(mapData.miningLocations, 'country', 'Keine spezifischen Länder erfasst (globaler Markt).') },
                { title: "Veredelungs- & Verarbeitungs-Länder", content: generateTags(mapData.manufacturingLocations, 'country', 'Keine Länder erfasst.') },
                { title: "Logistik & Transportweg", content: mineralTransportDesc, color: "#27ae60" }
            ]);
        }

        // --- D3 Setup & Map Engine ---
        const width = document.getElementById('map-container').clientWidth;
        const height = document.getElementById('map-container').clientHeight;

        const svg = d3.select("#map-canvas")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .on("click", function(event) {
                if (event.target.tagName.toLowerCase() === 'svg') {
                    document.getElementById("country-search").value = "";
                    clearMapAndUI();
                }
            });

        const g = svg.append("g");
        const projection = d3.geoMercator().scale(width / 6).translate([width / 2, height / 1.5]);
        const path = d3.geoPath().projection(projection);
        const tooltip = d3.select("#tooltip");

        const zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[-width * 0.03, -height * 0.005], [width * 1.03, height * 1.15]]) 
            .on("zoom", (event) => { g.attr("transform", event.transform); });
        svg.call(zoom);

        // Echte Weltkarte ONLINE abrufen
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data) {
            document.getElementById("loading").style.display = "none";

            g.selectAll("path").data(data.features).enter().append("path").attr("d", path)
                .attr("class", function(d) {
                    const countryEn = d.properties.name;
                    const countryDe = countryTranslations[countryEn] || countryEn;
                    
                    const geoCenter = d3.geoCentroid(d);
                    if(geoCenter && !isNaN(geoCenter[0])) { 
                        countryCentroids[countryEn] = geoCenter; 
                        countryCentroids[countryDe] = geoCenter; 
                    }
                    
                    const hasNarrative = !!(countryNarratives[countryEn] || countryNarratives[countryDe]);
                    const compInfo = getCountryInfo(countryDe);
                    const hasComponent = compInfo.components.length > 0;
                    
                    let baseClass = "country ";
                    if (hasNarrative) return baseClass + "role-major";
                    else if (hasComponent) return baseClass + "role-minor";
                    else return baseClass + "role-none";
                })
                .on("mouseover", function(event, d) {
                    const countryDe = countryTranslations[d.properties.name] || d.properties.name;
                    tooltip.style("opacity", 1).html(countryDe);
                    if (!d3.select(this).attr("class").includes("highlighted")) d3.select(this).raise(); 
                })
                .on("mousemove", function(event) { tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 20) + "px"); })
                .on("mouseout", function() { tooltip.style("opacity", 0); })
                .on("click", function(event, d) {
                    clearMapAndUI();

                    const countryEn = d.properties.name;
                    document.getElementById("country-search").value = countryTranslations[countryEn] || countryEn;
                    showCountryInfo(countryEn);
                });

            const searchInputObj = document.getElementById("country-search");
            
            searchInputObj.addEventListener("input", function(e) {
                const term = e.target.value.toLowerCase().trim();
                const resultsContainer = document.getElementById("search-results");
                
                clearMapAndUI();

                if (term === "") { return; }

                resultsContainer.style.display = "block";
                document.getElementById("default-message").style.display = "none";
                document.getElementById("country-details").style.display = "none";
                document.getElementById("default-legend").style.display = "none";
                resultsContainer.innerHTML = "<h3>Suchergebnisse:</h3>";

                function calcScore(searchTerm, textStr) {
                    if (!textStr) return 0;
                    textStr = String(textStr).toLowerCase();
                    if (textStr === searchTerm) return 100;
                    if (textStr.startsWith(searchTerm)) return 50;
                    if (textStr.includes(searchTerm)) return 10;
                    return 0;
                }

                const searchResults = [];
                Object.values(cpuData).forEach(c => {
                    let score = Math.max(0, calcScore(term, c.name));
                    if (c.category.toLowerCase().includes(term)) score = Math.max(score, 5);
                    (componentTranslations[c.name] || []).forEach(t => { const s = calcScore(term, t); if (s > 0) score = Math.max(score, s - 1); });
                    if (score > 0) searchResults.push({ text: c.name, typeLabel: "Bauteil", typeClass: "result-bauteil", score: score, onClickFn: () => showComponentInfo(c) });
                });

                allMaterials.forEach(m => {
                    let score = Math.max(0, calcScore(term, m));
                    (materialTranslations[m] || []).forEach(t => { const s = calcScore(term, t); if (s > 0) score = Math.max(score, s - 1); });
                    if (score > 0) searchResults.push({ text: m, typeLabel: "Rohstoff", typeClass: "result-rohstoff", score: score, onClickFn: () => showMineralInfo(m) });
                });

                g.selectAll("path").each(function(d) {
                    const en = d.properties.name;
                    const de = countryTranslations[en] || en;
                    let score = Math.max(0, calcScore(term, de));
                    const enScore = calcScore(term, en);
                    if (enScore > 0) score = Math.max(score, enScore - 1);
                    if (score > 0) searchResults.push({ text: de, typeLabel: "Land", typeClass: "result-land", score: score, onClickFn: () => showCountryInfo(en) });
                });

                if (searchResults.length === 0) {
                    resultsContainer.innerHTML += "<p style='color: #7f8c8d; font-style: italic;'>Keine Treffer gefunden.</p>";
                    return;
                }

                const uniqueResults = [];
                const seen = new Set();
                searchResults.forEach(r => {
                    const id = r.typeLabel + ":" + r.text;
                    if (!seen.has(id)) { seen.add(id); uniqueResults.push(r); }
                });

                uniqueResults.sort((a, b) => b.score !== a.score ? b.score - a.score : a.text.localeCompare(b.text));
                uniqueResults.forEach(item => {
                    const div = document.createElement("div");
                    div.className = `search-result-item ${item.typeClass}`;
                    div.innerHTML = `<div class="search-type-label">${item.typeLabel}</div>${item.text}`;
                    div.onclick = () => { 
                        clearMapAndUI();
                        document.getElementById("country-search").value = item.text; 
                        item.onClickFn(); 
                    };
                    resultsContainer.appendChild(div);
                });
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
    
</body>
</html>
