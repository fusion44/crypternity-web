 <template lang="pug">
    div
      v-layout(column justify-center align-center)
        v-flex(xs12 sm8 md6) 
          v-text-field(v-model="name" label="Name", hint="e.g. My Binance account")
          v-select(label="Service" v-bind:items="supported_services" v-model="selected_service" 
                   item-text="longName" item-value="shortName")
          v-text-field(v-model="api_key" label="API Key")
          v-text-field(v-model="api_secret" label="API secret")
          v-btn(@click="submit") SUBMIT 
</template> 


<script>
import gql from "graphql-tag"
import { mapGetters, mapActions } from "vuex"

export default {
  data() {
    return {
      name: "",
      selected_service: null,
      supported_services: [],
      api_key: "",
      api_secret: ""
    }
  },
  methods: {
    submit() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: CreateAccountMutationInput!) {
              createAccount(input: $input) {
                account {
                  id
                  name
                  creationDate
                }
              }
            }
          `,
          variables: {
            input: {
              name: this.name,
              serviceType: this.selected_service,
              apiKey: this.api_key,
              apiSecret: this.api_secret
            }
          }
        })
        .then(data => {
          this.$router.push("/accounts")
        })
        .catch(error => {
          console.log(error)
        })
    },
    ...mapActions([])
  },
  apollo: {
    supported_services: {
      query: gql`
        {
          supportedServices {
            shortName
            longName
          }
        }
      `,
      update: data => data.supportedServices
    }
  },
  computed: mapGetters([]),
  watch: {}
}
</script>
