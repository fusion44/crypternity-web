<template lang="pug">
  v-container(fluid grid-list-sm)
    v-layout(column wrap)
      div(v-if="!fileDropped")
        h1 Select import type
          v-select(:items="manualAccounts" v-model="selectedAccount", label="Account" 
                   item-text="name" item-value="id")
          div(v-if="selectedAccount !== null")
            v-card(class="drop-area" :color="dropAreaColor" @dragover.prevent @drop.prevent="handleLoadFile" 
                @dragenter.prevent="handleDragEnter" @dragleave="handleDragLeave") {{dropAreaText}}
            div(if="file-name")
            v-layout(row wrap)
              v-btn(primary @click="onImportClick") Import
              v-btn(primary @click="onCancel") Cancel
      div(v-else)
        div
          LivecoinImporter(:files="files" :accountId="selectedAccount")
</template>

<script>
import gql from "graphql-tag"
import LivecoinImporter from "../../../components/importers/livecoin.vue"

export default {
  components: { LivecoinImporter },
  data() {
    return {
      manualAccounts: [],
      selectedAccount: null,
      fileDropped: false,
      dropAreaColor: "",
      dropAreaText: "Drop CSV file here",
      files: []
    }
  },
  methods: {
    handleLoadFile(f) {
      this.files = f.target.files || f.dataTransfer.files
      this.fileDropped = true
      this.dropAreaColor = ""
    },
    handleDragEnter(f) {
      this.dropAreaColor = "grey"
    },
    handleDragLeave(f) {
      this.dropAreaColor = ""
      this.dropAreaText = "Drop CSV file here"
    },
    onCancel() {
      this.$router.push("/transactions")
    },
    onImportClick() {}
  },
  apollo: {
    manualAccounts: {
      query: gql`
        {
          allAccounts {
            id
            name
            serviceType
          }
          supportedServices {
            shortName
            importer
          }
        }
      `,
      update: data => {
        let manualAccounts = []
        data.supportedServices.filter(service => {
          if (service.importer === "manual") {
            data.allAccounts.filter(account => {
              if (account.serviceType === service.shortName) {
                manualAccounts.push(account)
              }
            })
          }
        })
        return manualAccounts
      }
    }
  }
}
</script>

<style>
.drop-area {
  min-height: 150px;
  min-width: 250px;
  margin: 10px;
  padding: 10px;
}
</style>
