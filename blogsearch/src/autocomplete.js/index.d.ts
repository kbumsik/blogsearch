import '../zepto';
import Hogan from 'hogan.js';

export interface AutocompleteOptions {
  debug: boolean;
  hint: boolean;
  autoselect: boolean;
  cssClasses: {
    prefix?: string;
  };
  ariaLabel?: string;
}

export interface Suggestion {
  isLvl0: boolean;
  isLvl1: boolean;
  isLvl2: boolean;
  isLvl1EmptyOrDuplicate: boolean;
  isCategoryHeader: boolean;
  isSubCategoryHeader: boolean;
  isTextOrSubcategoryNonEmpty: boolean;
  category: string;
  subcategory: string;
  title: string;
  text: string | null;
  url: string;
}

type autocompleteEvent =
  | 'autocomplete:opened'
  | 'autocomplete:shown'
  | 'autocomplete:empty'
  | 'autocomplete:closed'
  | 'autocomplete:updated'
  | 'autocomplete:cursorchanged'
  | 'autocomplete:selected'
  | 'autocomplete:cursorremoved'
  | 'autocomplete:autocompleted'
  | 'autocomplete:redrawn';

interface AutocompleteElement {
  on(eventType: autocompleteEvent, callback: () => void): void;
  trigger(eventType: autocompleteEvent): void;
  autocomplete: any;
}

type template = (args: Hogan.Context) => string;

export default function autocomplete(
  input: JQuery<HTMLElement>,
  options: autocompleteOptions,
  datasets: Array<{
    // Reference: https://github.com/algolia/autocomplete.js#datasets
    source(query: string, callback: (suggestion: Suggestion[]) => void): void;
    name?: string;
    displayKey?: (suggestion: Suggestion) => string;
    templates: {
      empty: template;
      suggestion: template;
      footer?: template;
      header?: template;
    };
    debounce?: number;
    cache?: boolean;
  }>
): AutocompleteElement;
