<template lang="pug">
  table(class="hover-table")
    thead(class="table-header")
      th 
      th date
      th spent
      th acquired
      th fee
      th book amount
      th book fee
      th from
      th to
      th tags
      th
    tbody
      tr(class="table-row" v-for="t in transactions")
        td
          v-tooltip(bottom)
            v-icon(medium color="red" slot="activator") {{t.icon}}
            span(v-if="t.icon === 'shuffle'") Exchange crypto to crypto
            span(v-if="t.icon === 'send'") Move value from wallet to wallet
            span(v-if="t.icon === 'subdirectory_arrow_right'") Buy crypto currencies using fiat
            span(v-if="t.icon === 'subdirectory_arrow_left'") Sell crypto currencies for fiat
            span(v-if="t.icon === 'arrow_forward'") Income - for example refferal bonuses or payment for a provided service
            span(v-if="t.icon === 'arrow_backward'") Expense - for example buy of a physical good or a service
            span(v-if="t.icon === 'gavel'") Income through mining
        td {{t.date | moment("YYYY-MM-DD HH:mm")}}
        AmountContainer(:amount="t.spentAmount" :symbol="t.spentCurrency")
        AmountContainer(:amount="t.acquiredAmount" :symbol="t.acquiredCurrency")
        AmountContainer(:amount="t.feeAmount" :symbol="t.feeCurrency")
        AmountContainer(:amount="t.bookPriceEur" symbol="EUR")
        AmountContainer(:amount="t.bookPriceFeeEur" symbol="EUR")
        td {{t.sourcePeer.name}}
        td {{t.targetPeer.name}}
        td
          div(class="tag-container")
            div(class="tag" v-for="tag in t.tags") {{tag}}
        v-btn(@click="onActionClick('edit', t.id)" flat icon)
              v-icon(cached) edit
    v-btn(fixed fab bottom right @click="onImportClick()")
      v-icon import_export

      
</template>

<script>
import AmountContainer from "../../components/table/AmountContainer.vue"
import gql from "graphql-tag"

export default {
  components: { AmountContainer },
  data() {
    return {
      transactions: null,
      fab: false
    }
  },
  methods: {
    onActionClick(action, id) {
      switch (action) {
        case "edit":
          this.$router.push(`/transactions/edit/${id}`)
          break
        default:
      }
    },
    onImportClick() {
      this.$router.push("/transactions/import")
    }
  },
  apollo: {
    transactions: {
      query: gql`
        {
          allTransactions {
            id
            date
            spentCurrency
            spentAmount
            acquiredCurrency
            acquiredAmount
            feeCurrency
            feeAmount
            bookPriceEur
            bookPriceBtc
            bookPriceFeeEur
            bookPriceFeeBtc
            sourcePeer {
              id
              name
              classType
            }
            targetPeer {
              id
              name
              classType
            }
            tags
            icon
          }
        }
      `,
      update: data => data.allTransactions
    }
  }
}
</script>

<style scoped>
.table-header {
  font-size: 1.3em;
  text-transform: capitalize;
  text-align: left;
}

.hover-table {
  width: 100%;
  border-collapse: collapse;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tag {
  border-style: solid;
  border-color: rgb(104, 104, 104);
  border-width: 1px;
  margin: 2px;
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 2px;
}

.tag:hover {
  background-color: rgb(18, 154, 172);
}

.table-row {
  height: 35px;
}

.table-row:nth-child(even) {
  background-color: rgb(70, 70, 70);
}

.table-row:hover {
  background-color: rgb(97, 65, 13);
}
</style>
