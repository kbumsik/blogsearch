const prefix = 'blogsearch';
const suggestionPrefix = `${prefix}-suggestion`;

const templates = {
  suggestion: `
  <a class="
    ${suggestionPrefix}
    ${suggestionPrefix}__main
    "
    aria-label="Link to the result"
    href="{{{url}}}"
  >
    <div class="${suggestionPrefix}--wrapper">
      <div class="${suggestionPrefix}--subcategory-column">
        {{#categories}}
        <span class="${suggestionPrefix}--subcategory-column-text">
          {{{value}}}
        </span>
        {{/categories}}
        {{#tags}}
        <span class="${suggestionPrefix}--subcategory-column-text">
          {{{value}}}
        </span>
        {{/tags}}
      </div>
      <div class="${suggestionPrefix}--content">
        <div class="${suggestionPrefix}--title">{{{title}}}</div>
        {{#body_highlight}}
        <div class="${suggestionPrefix}--text">{{{body_highlight}}}</div>
        {{/body_highlight}}
      </div>
    </div>
  </a>
  `,
  suggestionSimple: `
  <div class="
    ${suggestionPrefix}
    ${suggestionPrefix}__main
    suggestion-layout-simple
  ">
    <div class="${suggestionPrefix}--category-header">
        <div class="${suggestionPrefix}--title ${suggestionPrefix}--category-header-item">
            {{{title}}}
        </div>
        {{#categories}}
        <span class="${suggestionPrefix}--category-header-lvl1 ${suggestionPrefix}--category-header-item">
          {{{value}}}
        </span>
        {{/categories}}
        {{#tags}}
        <span class="${suggestionPrefix}--category-header-lvl1 ${suggestionPrefix}--category-header-item">
          {{{value}}}
        </span>
        {{/tags}}
    </div>
    <div class="${suggestionPrefix}--wrapper">
      {{#body_highlight}}
      <div class="${suggestionPrefix}--content">
        <div class="${suggestionPrefix}--text">{{{body_highlight}}}</div>
      </div>
      {{/body_highlight}}
    </div>
  </div>
  `,
  empty: `
  <div class="${suggestionPrefix}">
    <div class="${suggestionPrefix}--wrapper">
        <div class="${suggestionPrefix}--content ${suggestionPrefix}--no-results">
            <div class="${suggestionPrefix}--title">
                <div class="${suggestionPrefix}--text">
                    No results found for query <b>"{{query}}"</b>
                </div>
            </div>
        </div>
    </div>
  </div>
  `
};

export default templates;
