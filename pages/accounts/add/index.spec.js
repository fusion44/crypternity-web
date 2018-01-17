import { shallow } from "@vue/test-utils"
import index from "./index"

describe("Account Add Index", () => {
  it("renders the correct markup", () => {
    let wrapper = shallow(index)

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })
})
