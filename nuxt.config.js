const nodeExternals = require("webpack-node-externals")

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "Crypternity",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Simple project management tool"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },
  modules: ["@nuxtjs/apollo"],
  apollo: {
    clientConfigs: {
      default: "~/plugins/apollo.js"
    }
  },
  plugins: ["~/plugins/plugins.js", "~/plugins/vuetify.js"],
  css: ["~/assets/style/app.styl"],
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Single Page Application mode
  ** Means no SSR
  */
  mode: "spa",
  /*
  ** Build configuration
  */
  build: {
    babel: {
      plugins: [
        [
          "transform-imports",
          {
            vuetify: {
              transform: "vuetify/es5/components/${member}",
              preventFullImport: true
            }
          }
        ]
      ]
    },
    vendor: ["~/plugins/vuetify.js"],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
