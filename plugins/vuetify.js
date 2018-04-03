import Vue from "vue"
import {
  Vuetify,
  VApp,
  VAvatar,
  VCard,
  VDataTable,
  VForm,
  VMenu,
  VNavigationDrawer,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VTabs,
  VToolbar,
  VTooltip,
  VTextField,
  VSelect
} from "vuetify"

Vue.use(Vuetify, {
  theme: {
    primary: "#9c27b0",
    accent: "#ce93d8",
    secondary: "#424242",
    info: "#0D47A1",
    warning: "#ffb300",
    error: "#B71C1C",
    success: "#2E7D32"
  },
  components: {
    VApp,
    VAvatar,
    VCard,
    VDataTable,
    VForm,
    VNavigationDrawer,
    VMenu,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VTabs,
    VToolbar,
    VTooltip,
    VTextField,
    VSelect
  }
})
