import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons"; // precisa do pacote expo-vector-icons
import { useNavigation } from "@react-navigation/native"; // hook para navegação

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <style>
    #map { height: 100vh; width: 100vw; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([-23.55052, -46.633308], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    var origem = [-24.499515, -47.848134];
    var destino = [-24.495353, -47.847048];

    L.marker(origem).addTo(map).bindPopup("Origem");
    L.marker(destino).addTo(map).bindPopup("Destino");

    var url = \`https://router.project-osrm.org/route/v1/driving/\${origem[1]},\${origem[0]};\${destino[1]},\${destino[0]}?overview=full&geometries=geojson\`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          var coords = data.routes[0].geometry.coordinates;
          var latlngs = coords.map(c => [c[1], c[0]]);
          var polyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);
          map.fitBounds(polyline.getBounds());
        } else {
          alert("Não foi possível calcular a rota.");
        }
      })
      .catch(err => console.error(err));
  </script>
</body>
</html>
`;

export default function App() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#425010" />
        </TouchableOpacity>
      </View>

      {/* Mapa dentro do WebView */}
      <WebView source={{ html }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 50,
    elevation: 3,
  },
});
