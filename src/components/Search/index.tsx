import React, { useState } from "react";
import { useEffect } from "react";
import Autosuggest, {
  InputProps,
  ChangeEvent,
  SuggestionsFetchRequested,
} from "react-autosuggest";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
import { selectStickyTool } from "../../state/reducers/tools";
import Providers from "./Providers";
import Geocode from "./Providers/Geocoder";
import "./style.css";

const getSuggestionValue = (suggestion: any) => suggestion.name;

const SearchComponent = () => {
  const [value, setvalue] = useState<string>("");
  const [suggestions, setsuggestions] = useState<any[]>([]);
  const { toogleSideNav } = useActions();
  const stickyTool = useTypedSelector(selectStickyTool);

  const toogleLayers = () => {
    if (stickyTool) {
      toogleSideNav(true);
    }
  };

  const onChange = (event: React.FormEvent<HTMLElement>, values: ChangeEvent) =>
    setvalue(values.newValue);
  const onDataReceived = (arrayOfData: any[]) => {
    const type = arrayOfData[0].type;
    let nextSuggestions = suggestions.filter(
      (suggestion) => suggestion.type != type
    );
    nextSuggestions = [...nextSuggestions, ...arrayOfData];
    setsuggestions(nextSuggestions);
  };

  const onSuggestionsFetchRequested: SuggestionsFetchRequested = ({
    value,
  }) => {
    Providers.getInstance().search(value);
  };

  const onSuggestionsClearRequested = () => setsuggestions([]);

  useEffect(() => {
    Geocode(onDataReceived);
  }, []);

  const inputProps: InputProps<any> = {
    placeholder: "Search ...",
    value,
    onChange: onChange,
    // className: "form-control",
  };

  const theme = {
    container: "flex-grow-1 p-2 react-autosuggest__container",
    containerOpen: "flex-grow-1 p-2 react-autosuggest__container--open",
    input: "form-control react-autosuggest__input",
    inputOpen: "form-control react-autosuggest__input--open",
    inputFocused: "form-control react-autosuggest__input--focused",
    suggestionsContainer: "react-autosuggest__suggestions-container",
    suggestionsContainerOpen: "react-autosuggest__suggestions-container--open",
    suggestionsList: "react-autosuggest__suggestions-list",
    suggestion: "react-autosuggest__suggestion",
    suggestionFirst: "react-autosuggest__suggestion--first",
    suggestionHighlighted: "react-autosuggest__suggestion--highlighted",
    sectionContainer: "react-autosuggest__section-container",
    sectionContainerFirst: "react-autosuggest__section-container--first",
    sectionTitle: "react-autosuggest__section-title",
  };

  // Finally, render it!
  return (
    <div className="searchbar">
      <div className="searchbar__icon" onClick={toogleLayers}>
        <i className="gis-icon gis-icon--layers"></i>
      </div>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
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
};

export default SearchComponent;
