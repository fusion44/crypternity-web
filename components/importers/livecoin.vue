<template lang="pug">
  v-container(fluid grid-list-sm)
    v-layout(column wrap)
      h1 Livecoin importer
      v-layout(row wrap)
        p(class="info-text") Please check if the data is OK. Livecoin does not provide any timezone data with it's CSV file and has no documentation. Possibly the transaction times are not correct. You can correct them later.
          
      v-layout(column justify-center align-start)
        v-flex(d-flex xs12)
          v-data-table(v-model="selected" :headers="headers" :items="items" hide-actions 
                       class="elevation-2" select-all item-key="localId")
            template(slot="items" slot-scope="props")
              tr(@click="props.expanded = !props.expanded")
                td
                  v-checkbox(primary hide-details :input-value="props.selected" :active="props.selected" 
                             @click="props.selected = !props.selected") 
                td(class="text-xs-right") {{ props.item.txtype }}
                td(class="text-xs-right") {{ props.item.date}}
                td(class="text-xs-right") {{ props.item.credit + ' ' + props.item.creditCurr}}
                td(class="text-xs-right") {{ props.item.debit + ' ' + props.item.debitCurr}}
                td(class="text-xs-right") {{ props.item.fee }}
                td(class="text-xs-right") {{ props.item.correspondent }}
        v-layout(row wrap)
          v-btn(primary @click="onImportClick") Import
          v-btn(primary @click="onCancel") Cancel
</template>

<script>
import gql from "graphql-tag"
import Papa from "papaparse"

let getFloat = line => {
  let temp = line.replace(/,/, ".")
  return isNaN(parseFloat(temp)) ? 0 : parseFloat(temp)
}

export default {
  data() {
    return {
      headers: [
        { text: "Type", value: "txtype" },
        {
          text: "Date",
          align: "left",
          value: "dateLocal"
        },
        { text: "Credit" },
        { text: "Debit" },
        { text: "Fee" },
        { text: "Correspondent" }
      ],
      items: [],
      selected: []
    }
  },
  props: ["files", "accountId"],
  methods: {
    onCancel() {
      this.$router.push("/transactions")
    },
    onImportClick() {
      let transactionList = this.items.map(item => {
        let transactionType = ""
        let transactionTypeRaw = item.txtype
        let sourcePeer = 0
        let targetPeer = 0
        let tags = []

        switch (item.txtype) {
          case "Buy":
            transactionType = "exchange"
            // This on this exchange only, so source and taget are the same
            sourcePeer = targetPeer = this.accountId
            break
          case "Referral funds":
            transactionType = "income"
            // This on this exchange only, so source and taget are the same
            sourcePeer = targetPeer = this.accountId
            tags.push("ReferralBonus")
            break
          case "Deposit":
            transactionType = "transfer"
            // Source is possibly unknown, so source will be 0 (to indicate unknown)
            targetPeer = this.accountId
            break
          default:
            break
        }

        let tx = {
          date: item.date,
          transactionType,
          transactionTypeRaw,
          acquiredCurrency: item.creditCurr,
          acquiredAmount: item.credit,
          sourcePeer,
          spentCurrency: item.debitCurr,
          spentAmount: item.debit,
          targetPeer,
          feeCurrency: item.debitCurr,
          feeAmount: item.fee
        }
        return tx
      })

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: ImportTransactionsMutationInput!) {
              importTransaction(input: $input) {
                status
                formErrors
                transactions {
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
                clientMutationId
              }
            }
          `,
          variables: {
            input: {
              data: {
                serviceType: "livecoin",
                importMechanism: "csv",
                transactions: transactionList
              }
            }
          },
          update: (
            store,
            { data: { importTransaction: { transactions } } }
          ) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
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
              `
            })
            data.allTransactions.push(...transactions)
            store.writeQuery({
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
              data
            })
          }
        })
        .then(data => {
          this.$router.push("/transactions")
        })
        .catch(error => {
          console.log(error)
        })
    },
    processFiles() {
      for (var i = 0; i < this.files.length; i++) {
        this.processFile(this.files.item(i))
      }
    },
    processFile(file) {
      const reader = new FileReader()
      const self = this

      reader.onload = (reader => {
        return function() {
          self.selectFile = false
          let contents = reader.result
          let res = Papa.parse(contents)
          res.data.forEach((line, num) => {
            if (num > 1 && line.length > 1) {
              let transaction = {}
              transaction.txtype = line[0]
              transaction.date = line[1]
              transaction.credit = getFloat(line[2])
              transaction.creditCurr = line[3]
              transaction.debit = getFloat(line[4])
              transaction.debitCurr = line[5]
              transaction.fee = getFloat(line[6])
              transaction.correspondent = line[7]
              self.items.push(transaction)
              self.selected.push(transaction)
            }
          })
        }
      })(reader)

      reader.readAsText(file)
    }
  },
  mounted() {
    if (this.files !== undefined || this.files.length > 0) {
      this.processFiles()
    } else {
      console.error("Cannot process files.")
    }
  }
}
</script>

<style scoped>
.info-text {
  max-width: 650px;
}
</style>

