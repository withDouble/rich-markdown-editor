// @flow
import * as React from "react";
import { debounce } from "lodash";
import ReactDOM from "react-dom";
import Editor from "../../src";

const element = document.getElementById("main");
const savedText = localStorage.getItem("saved");
const exampleText = `
# Welcome

This is example content. It is persisted between reloads in localStorage.
`;
const defaultValue = savedText || exampleText;
class Example extends React.Component<*, { readOnly: boolean, dark: boolean }> {
  state = {
    readOnly: false,
    dark: false,
    inlineToolbar: true,
  };

  handleToggleReadOnly = () => {
    this.setState({ readOnly: !this.state.readOnly });
  };

  handleToggleDark = () => {
    this.setState({ dark: !this.state.dark });
  };

  handleToggleInlineToolbar = () => {
    this.setState({ inlineToolbar: !this.state.inlineToolbar });
  };

  handleChange = debounce(value => {
    localStorage.setItem("saved", value());
  }, 250);

  render() {
    return (
      <div style={{ marginTop: "60px" }}>
        <p>
          <button type="button" onClick={this.handleToggleReadOnly}>
            {this.state.readOnly ? "Editable" : "Read Only"}
          </button>
          <button type="button" onClick={this.handleToggleDark}>
            {this.state.dark ? "Light Theme" : "Dark Theme"}
          </button>
          <button type="button" onClick={this.handleToggleInlineToolbar}>
            {this.state.inlineToolbar
              ? "Disable Inline Toolbar"
              : "Enable Inline Toolbar"}
          </button>
        </p>
        <Editor
          readOnly={this.state.readOnly}
          defaultValue={defaultValue}
          inlineToolbar={this.state.inlineToolbar}
          onSave={options => console.log("Save triggered", options)}
          onCancel={() => console.log("Cancel triggered")}
          onChange={this.handleChange}
          onClickLink={href => console.log("Clicked link: ", href)}
          onShowToast={message => window.alert(message)}
          onSearchLink={async term => {
            console.log("Searched link: ", term);
            return [
              {
                title: term,
                url: "localhost",
              },
            ];
          }}
          uploadImage={async file => {
            console.log("File upload triggered: ", file);
            return "";
          }}
          dark={this.state.dark}
          autoFocus
          toc
        />
      </div>
    );
  }
}

if (element) {
  ReactDOM.render(<Example />, element);
}
