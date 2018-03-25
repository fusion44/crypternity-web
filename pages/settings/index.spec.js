import { shallow } from "@vue/test-utils"
import index from "./index"

describe("Settings Index", () => {
  it("renders the correct markup default state", () => {
    let wrapper = shallow(index)

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })

  it("renders the correct markup with admin user", () => {
    const wrapper = shallow(index)
    wrapper.setData({ isAdmin: true })

    expect(wrapper.vm.isAdmin).toBe(true)

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })
})
