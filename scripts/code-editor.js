// Initialize CodeMirror editors after the DOM is loaded
let htmlEditor, cssEditor;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tab functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and tabs
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding tab
      const targetTab = document.getElementById(button.dataset.target);
      targetTab.classList.add('active');
    });
  });
  
  // Initialize HTML editor
  htmlEditor = CodeMirror(document.getElementById('html-editor'), {
    mode: 'xml',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    value: document.getElementById('html-output').textContent
  });
  
  // Initialize CSS editor
  cssEditor = CodeMirror(document.getElementById('css-editor'), {
    mode: 'css',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    value: document.getElementById('css-output').textContent
  });
  
  // Apply HTML button
  document.getElementById('apply-html').addEventListener('click', () => {
    applyCustomHtml(htmlEditor.getValue());
  });
  
  // Apply CSS button
  document.getElementById('apply-css').addEventListener('click', () => {
    applyCustomCss(cssEditor.getValue());
  });
});

// Update code editors when UI controls change the spinner
function updateCodeSnippets() {
  const spinnerCode = generateSpinnerCode(spinnerState);
  
  // Update display code
  htmlOutput.textContent = spinnerCode.html;
  cssOutput.textContent = spinnerCode.css;
  
  // Update editors if they exist
  if (htmlEditor && cssEditor) {
    htmlEditor.setValue(spinnerCode.html);
    cssEditor.setValue(spinnerCode.css);
  }
}

// Functions to apply custom code
function applyCustomHtml(html) {
  try {
    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract the spinner element
    const spinnerElement = tempDiv.firstElementChild;
    
    if (spinnerElement) {
      // Apply to preview containers
      const lightPreview = document.getElementById('spinner-preview-light');
      const darkPreview = document.getElementById('spinner-preview-dark');
      
      lightPreview.innerHTML = '';
      lightPreview.appendChild(spinnerElement.cloneNode(true));
      
      darkPreview.innerHTML = '';
      darkPreview.appendChild(spinnerElement.cloneNode(true));
      
      // Update the HTML output display
      document.getElementById('html-output').textContent = html;
    }
  } catch (error) {
    console.error('Error applying HTML:', error);
    alert('Invalid HTML. Please check your code.');
  }
}

function applyCustomCss(css) {
  try {
    // Create or update the style element for custom CSS
    let styleElement = document.getElementById('custom-spinner-styles');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-spinner-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
    
    // Update the CSS output display
    document.getElementById('css-output').textContent = css;
  } catch (error) {
    console.error('Error applying CSS:', error);
    alert('Invalid CSS. Please check your code.');
  }
}