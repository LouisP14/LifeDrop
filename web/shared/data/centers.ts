export interface DonationCenter {
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}

export const DONATION_CENTERS: DonationCenter[] = [
  // Ile-de-France
  { name: "EFS Paris - Saint-Antoine", city: "Paris", address: "184 Rue du Faubourg Saint-Antoine, 75012", lat: 48.8494, lng: 2.3832, phone: "01 44 67 55 00" },
  { name: "EFS Paris - Crozatier", city: "Paris", address: "21 Rue Crozatier, 75012", lat: 48.8473, lng: 2.3764, phone: "01 43 07 24 64" },
  { name: "EFS Paris - Trinite", city: "Paris", address: "6 Rue d'Athenes, 75009", lat: 48.8773, lng: 2.3304, phone: "01 53 32 64 50" },
  { name: "EFS Paris - Pitie-Salpetriere", city: "Paris", address: "47-83 Bd de l'Hopital, 75013", lat: 48.8384, lng: 2.3650, phone: "01 42 17 72 60" },
  { name: "EFS Ivry-sur-Seine", city: "Ivry-sur-Seine", address: "1 Rue de Verdun, 94200", lat: 48.8131, lng: 2.3853 },
  { name: "EFS Rungis", city: "Rungis", address: "25 Bd Saint-Antoine, 94150", lat: 48.7507, lng: 2.3488 },

  // Nord
  { name: "EFS Lille", city: "Lille", address: "Boulevard du Prof. Jules Leclercq, 59000", lat: 50.6108, lng: 3.0348, phone: "03 20 87 79 60" },
  { name: "EFS Valenciennes", city: "Valenciennes", address: "Avenue Desandrouin, 59300", lat: 50.3596, lng: 3.5250 },

  // Rhone-Alpes
  { name: "EFS Lyon - Gerland", city: "Lyon", address: "1-3 Rue du Vercors, 69007", lat: 45.7275, lng: 4.8285, phone: "04 72 71 17 17" },
  { name: "EFS Lyon - Part-Dieu", city: "Lyon", address: "49 Bd Vivier Merle, 69003", lat: 45.7601, lng: 4.8575 },
  { name: "EFS Grenoble", city: "Grenoble", address: "29 Avenue du Maquis du Gresivaudan, 38700", lat: 45.2149, lng: 5.7256, phone: "04 76 42 43 44" },
  { name: "EFS Saint-Etienne", city: "Saint-Etienne", address: "25 Bd Pasteur, 42100", lat: 45.4263, lng: 4.3804 },

  // PACA
  { name: "EFS Marseille", city: "Marseille", address: "149 Bd Baille, 13005", lat: 43.2885, lng: 5.3942, phone: "04 91 18 98 00" },
  { name: "EFS Nice", city: "Nice", address: "150 Av. de la Lanterne, 06200", lat: 43.6993, lng: 7.2153, phone: "04 92 03 92 50" },
  { name: "EFS Toulon", city: "Toulon", address: "521 Av. du 15e Corps, 83100", lat: 43.1246, lng: 5.9315 },
  { name: "EFS Montpellier", city: "Montpellier", address: "392 Ave du Prof. Jean-Louis Viala, 34094", lat: 43.6313, lng: 3.8529, phone: "04 67 14 23 00" },

  // Grand Ouest
  { name: "EFS Nantes", city: "Nantes", address: "34 Bd Jean-Monnet, 44011", lat: 47.2436, lng: -1.5304, phone: "02 40 12 30 30" },
  { name: "EFS Rennes", city: "Rennes", address: "Rue Pierre-Jean Gineste, 35016", lat: 48.1206, lng: -1.6961, phone: "02 99 54 42 57" },
  { name: "EFS Brest", city: "Brest", address: "Centre hospitalier, 29200", lat: 48.3932, lng: -4.4959 },
  { name: "EFS Angers", city: "Angers", address: "1 Bd de Lavoisier, 49100", lat: 47.4621, lng: -0.5096 },

  // Sud-Ouest
  { name: "EFS Toulouse", city: "Toulouse", address: "75 Rue de Lisieux, 31300", lat: 43.6334, lng: 1.3958, phone: "05 61 77 47 47" },
  { name: "EFS Bordeaux", city: "Bordeaux", address: "Place Amede Larrieu, 33035", lat: 44.8156, lng: -0.5799, phone: "05 56 90 83 83" },

  // Est
  { name: "EFS Strasbourg", city: "Strasbourg", address: "10 Rue Spielmann, 67065", lat: 48.5785, lng: 7.7392, phone: "03 88 21 25 25" },
  { name: "EFS Nancy", city: "Nancy", address: "2 Rue du Dr Archambault, 54511", lat: 48.6570, lng: 6.1632 },
  { name: "EFS Dijon", city: "Dijon", address: "1 Bd Marechal de Lattre de Tassigny, 21000", lat: 47.3167, lng: 5.0167 },
  { name: "EFS Besancon", city: "Besancon", address: "1 Bd Alexandre Fleming, 25000", lat: 47.2378, lng: 6.0282 },

  // Centre
  { name: "EFS Tours", city: "Tours", address: "2 Bd Tonnelle, 37000", lat: 47.3830, lng: 0.6830 },
  { name: "EFS Orleans", city: "Orleans", address: "14 Rue de l'Hopital, 45000", lat: 47.8969, lng: 1.9141 },
  { name: "EFS Clermont-Ferrand", city: "Clermont-Ferrand", address: "Rue Vercingétorix, 63000", lat: 45.7762, lng: 3.0819 },

  // Normandie
  { name: "EFS Rouen", city: "Rouen", address: "Bois-Guillaume, 76230", lat: 49.4644, lng: 1.1211, phone: "02 32 88 56 60" },
  { name: "EFS Caen", city: "Caen", address: "Avenue de la Cote de Nacre, 14000", lat: 49.2104, lng: -0.3606 },
  { name: "EFS Le Havre", city: "Le Havre", address: "55 Rue Gustave Flaubert, 76600", lat: 49.5031, lng: 0.1218 },
  { name: "EFS Avranches", city: "Avranches", address: "Centre hospitalier, 50300", lat: 48.6860, lng: -1.3568 },

  // DOM-TOM
  { name: "EFS Martinique", city: "Fort-de-France", address: "CHU Martinique, 97200", lat: 14.6160, lng: -61.0588 },
  { name: "EFS Guadeloupe", city: "Pointe-a-Pitre", address: "CHU Pointe-a-Pitre, 97159", lat: 16.2375, lng: -61.5250 },
  { name: "EFS Reunion", city: "Saint-Denis", address: "CHR Felix Guyon, 97400", lat: -20.8789, lng: 55.4481 },
];
