 <template lang="pug">
    div
      v-layout(column justify-center align-center)
        v-flex(sm8 md6) 
          v-data-table(v-bind:headers="headers" :items="items" class="elevation-1")
              template(slot="items" slot-scope="props")
                tr(@click="props.expanded = !props.expanded")
                  td {{ props.item.id }}
                  td {{ props.item.creationDate | moment("YYYY-MM-DD")}}
                  td {{ props.item.name }}
                  td {{ props.item.serviceType }}
              template(slot="expand", slot-scope="props")
                v-card(flat)
                  v-btn(@click="onActionClick('stats', props.item.id)" flat) stats 
                  v-btn(@click="onActionClick('edit', props.item.id)" flat) edit
                  v-btn(@click="onActionClick('delete', props.item.id)" flat) delete
          v-btn(router="router" to="/accounts/add" color="primary") ADD
</template>

<script>
import gql from "graphql-tag"

export default {
  data() {
    return {
      headers: [
        {
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "created", value: "creationDate" },
        { text: "name", value: "name" },
        { text: "service", value: "serviceType" }
      ],
      items: []
    }
  },
  methods: {
    onActionClick: (type, id) => {
      console.log("click ", type, id)
    }
  },
  apollo: {
    items: {
      query: gql`
        {
          allAccounts {
            id
            creationDate
            name
            serviceType
          }
        }
      `,
      update: data => data.allAccounts
    }
  },
  watch: {}
}
</script>

<style>

</style>
