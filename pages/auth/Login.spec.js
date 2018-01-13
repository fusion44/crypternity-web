import toBeType from "jest-tobetype"
import { mount } from "vue-test-utils"
import Login from "./Login"

expect.extend(toBeType)

describe("Login", () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Login)
  })

  it("renders the correct markup", () => {
    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })

  it("validates username length", () => {
    // Returns either true or a string with error message
    let res = wrapper.vm.rules.username("12")
    expect(res).not.toBeFalsy()
    expect(res).toBeType("string")
    expect(res).toContain("3")

    res = wrapper.vm.rules.username("1234")
    expect(res).toBeTruthy()
    expect(res).toBe(true)
  })

  it("validates password length", () => {
    let res = wrapper.vm.rules.password("12345")
    expect(res).not.toBeFalsy()
    expect(res).toBeType("string")
    expect(res).toContain("6")

    res = wrapper.vm.rules.password("123456")
    expect(res).toBeTruthy()
    expect(res).toBe(true)
  })
})
