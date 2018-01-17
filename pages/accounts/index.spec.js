import { shallow } from "@vue/test-utils"
import index from "./index"

describe("Accounts Index", () => {
  it("renders the correct markup empty", () => {
    let wrapper = shallow(index)

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })

  it("renders the correct markup with 3 accounts", () => {
    let data = {
      propsData: {
        items: [
          {
            id: "1",
            creationDate: "2018-01-16T18:37:17.075765+00:00",
            name: "t1",
            serviceType: "kraken"
          },
          {
            id: "2",
            creationDate: "2018-01-15T19:46:53.293376+00:00",
            name: "t2",
            serviceType: "bitfinex"
          },
          {
            id: "3",
            creationDate: "2018-01-15T19:43:54.055119+00:00",
            name: "t3",
            serviceType: "bitfinex"
          }
        ]
      }
    }

    let wrapper = shallow(index, data)

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })
})
