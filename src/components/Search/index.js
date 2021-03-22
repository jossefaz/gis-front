import React from "react";
import Autosuggest from "react-autosuggest";
import Providers from "./Providers";
import Geocode from "./Providers/Geocoder";
import "./style.css";

const getSuggestionValue = (suggestion) => suggestion.name;

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
      placeholder: "Search ...",
      value,
      onChange: this.onChange,
      // className: "form-control",
    };

    const theme = {
      container: 'flex-grow-1 p-2 react-autosuggest__container',
      containerOpen: 'flex-grow-1 p-2 react-autosuggest__container--open',
      input: 'form-control react-autosuggest__input',
      inputOpen: 'form-control react-autosuggest__input--open',
      inputFocused: 'form-control react-autosuggest__input--focused',
      suggestionsContainer: 'react-autosuggest__suggestions-container',
      suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
      suggestionsList: 'react-autosuggest__suggestions-list',
      suggestion: 'react-autosuggest__suggestion',
      suggestionFirst: 'react-autosuggest__suggestion--first',
      suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
      sectionContainer: 'react-autosuggest__section-container',
      sectionContainerFirst: 'react-autosuggest__section-container--first',
      sectionTitle: 'react-autosuggest__section-title',
    };

    // Finally, render it!
    return (
      <div className="searchbar">
        <div className="searchbar__icon"><i className="gis-icon gis-icon--layers"></i></div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={(selection, { suggestion }) =>
            suggestion.cb(suggestion)
          }
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={(suggestion) => suggestion.render(suggestion)}
          inputProps={inputProps}
          theme={theme}
        />
      </div>
    );
  }
}
