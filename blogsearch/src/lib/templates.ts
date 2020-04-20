const prefix = 'blogsearch';
const suggestionPrefix = `${prefix}-suggestion`;

const templates = {
  suggestion: `
  <div class="
    ${suggestionPrefix}
    ${suggestionPrefix}__main
  ">
    <div class="${suggestionPrefix}--category-header">
      <div class="${suggestionPrefix}--title ${suggestionPrefix}--category-header-item">
        {{{title}}}
      </div>
      <div>
        {{#categories}}
        <span class="${suggestionPrefix}--category-header-lvl0 ${suggestionPrefix}--category-header-item">
          {{{value}}}
        </span>
        {{/categories}}
        {{#tags}}
        <span class="${suggestionPrefix}--category-header-lvl1 ${suggestionPrefix}--category-header-item">
          {{{value}}}
        </span>
        {{/tags}}
      </div>
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
