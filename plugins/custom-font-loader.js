const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withCustomFontLoader(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const fontsDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/assets/fonts"
      );

      // Créer le répertoire s'il n'existe pas
      if (!fs.existsSync(fontsDir)) {
        fs.mkdirSync(fontsDir, { recursive: true });
      }

      // Copier les polices et les renommer avec les BONS NOMS
      const fontMappings = [
        {
          src: path.join(
            config.modRequest.projectRoot,
            "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"
          ),
          dest: path.join(fontsDir, "material-community.ttf"),
          fontName: "material-community",
        },
        {
          src: path.join(
            config.modRequest.projectRoot,
            "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"
          ),
          dest: path.join(fontsDir, "ionicons.ttf"),
          fontName: "ionicons",
        },
        {
          src: path.join(
            config.modRequest.projectRoot,
            "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"
          ),
          dest: path.join(fontsDir, "material.ttf"),
          fontName: "material",
        },
      ];

      for (const mapping of fontMappings) {
        if (fs.existsSync(mapping.src)) {
          fs.copyFileSync(mapping.src, mapping.dest);
          console.log(`✓ Copied font: ${mapping.fontName}`);
        }
      }

      return config;
    },
  ]);
};
