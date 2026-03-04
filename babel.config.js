module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@store": "./src/store",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@types": "./src/types",
            "@theme": "./src/theme",
            "@services": "./src/services",
            "@navigation": "./src/navigation",
            "@constants": "./src/constants",
          },
        },
      ],
    ],
  };
};
