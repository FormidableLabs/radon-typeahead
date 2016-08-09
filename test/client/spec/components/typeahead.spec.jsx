/**
 * Client tests
 */
import React from "react";
import Typeahead from "src/components/typeahead";
import { shallow } from "enzyme";

describe("components/typeahead", () => {
  it("renders an input", () => {
    const wrapper = shallow(<Typeahead />);
    expect(wrapper.find("input")).to.have.length(1);
  });

  it("does not render a list if it shouldn't be open", () => {
    const wrapper = shallow(<Typeahead list={["foo", "bar", "baz"]}/>);
    expect(wrapper.find(".typeahead-list")).to.have.length(0);
  });

  it("renders a filtered list of matches", () => {
    const wrapper = shallow(<Typeahead list={["foo", "bar", "baz"]}/>);
    wrapper.find("input").simulate("change", {
      target: { value: "b" }
    });
    const list = wrapper.find(".typeahead-list");
    expect(list.containsMatchingElement(<div>foo</div>)).to.equal(false);
    expect(list.containsMatchingElement(<div>bar</div>)).to.equal(true);
    expect(list.containsMatchingElement(<div>baz</div>)).to.equal(true);
  });

  it("can render with a value passed down through props when in manual mode", () => {
    const testVal = "Test Value";
    const wrapper = shallow(<Typeahead value={testVal} manualMode />);
    const inputVal = wrapper.find("input").props().value;
    expect(inputVal).to.equal(testVal);
  });

  it("in manual mode, value defaults to '' when value prop is not provided", () => {
    const wrapper = shallow(<Typeahead manualMode />);
    const inputVal = wrapper.find("input").props().value;
    expect(inputVal).to.equal("");
  });

  it("when not in manual mode, value defaults to '' even if value prop is provided", () => {
    const testVal = "Test Value";
    const wrapper = shallow(<Typeahead value={testVal} />);
    const inputVal = wrapper.find("input").props().value;
    expect(inputVal).to.equal("");
  });

});
