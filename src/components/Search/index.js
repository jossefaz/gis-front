import React from "react";
import Autosuggest from "react-autosuggest";
import Providers from "./Providers";
import Geocode from "./Providers/Geocoder";
import "./style.css";

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

export default class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: [],
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onDataReceived = (arrayOfData) => {
    const type = arrayOfData[0].type;
    let suggestions = this.state.suggestions.filter(
      (suggestion) => suggestion.type != type
    );
    suggestions = [...suggestions, ...arrayOfData];
    this.setState({ suggestions });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    Providers.getInstance().search(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  componentDidMount() {
    Geocode(this.onDataReceived);
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Type a programming language",
      value,
      onChange: this.onChange,
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={(
          selection,
          { suggestion, suggestionValue, index, method }
        ) => suggestion.cb(suggestion)}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
