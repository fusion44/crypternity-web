import { shallow } from "@vue/test-utils"
import index from "./_id"

describe("Account Edit by ID", () => {
  it("renders the correct markup", () => {
    let wrapper = shallow(index)

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })
})
