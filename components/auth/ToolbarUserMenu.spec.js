import { shallow, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import ToolbarUserMenu from "./ToolbarUserMenu"
import * as consts from "../../constants"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("ToolbarUserMenu", () => {
  it("renders the correct markup signed out", () => {
    let getters = {
      getUserLoginState: state => consts.JWT_TOKEN_INVALID,
      getUserName: state => ""
    }

    let store = new Vuex.Store({
      getters
    })

    let wrapper = shallow(ToolbarUserMenu, { store, localVue })

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })

  it("renders correct markup signed in", () => {
    let getters = {
      getUserLoginState: state => consts.JWT_TOKEN_VALID,
      getUserName: state => "abcde"
    }

    let store = new Vuex.Store({
      getters
    })

    let wrapper = shallow(ToolbarUserMenu, { store, localVue })

    let html = wrapper.html()
    expect(html).toMatchSnapshot()
  })
})
