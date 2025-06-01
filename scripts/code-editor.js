let htmlEditor,
  cssEditor,
  editorsInitialized = false;

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((tab) => tab.classList.remove("active"));

      button.classList.add("active");

      // Show corresponding tab
      const targetTab = document.getElementById(button.dataset.target);
      targetTab.classList.add("active");

      if (button.dataset.target === "code-tab" && !editorsInitialized) {
        initializeEditors();
        editorsInitialized = true;
      }

      if (button.dataset.target === "code-tab" && editorsInitialized) {
        setTimeout(() => {
          htmlEditor.refresh();
          cssEditor.refresh();
        }, 10);
      }
    });
  });

  function initializeEditors() {
    htmlEditor = CodeMirror(document.getElementById("html-editor"), {
      mode: "xml",
      theme: "monokai",
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      value: document.getElementById("html-output").textContent,
    });

    cssEditor = CodeMirror(document.getElementById("css-editor"), {
      mode: "css",
      theme: "monokai",
      lineNumbers: true,
      autoCloseBrackets: true,
      value: document.getElementById("css-output").textContent,
    });

    document.getElementById("apply-html").addEventListener("click", () => {
      applyCustomHtml(htmlEditor.getValue());
    });

    document.getElementById("apply-css").addEventListener("click", () => {
      applyCustomCss(cssEditor.getValue());
    });
  }
});

function updateCodeSnippets() {
  const spinnerCode = generateSpinnerCode(spinnerState);

  htmlOutput.textContent = spinnerCode.html;
  cssOutput.textContent = spinnerCode.css;

  if (htmlEditor && cssEditor) {
    htmlEditor.setValue(spinnerCode.html);
    cssEditor.setValue(spinnerCode.css);
  }
}

function applyCustomHtml(html) {
  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const spinnerElement = tempDiv.firstElementChild;

    if (spinnerElement) {
      const lightPreview = document.getElementById("spinner-preview-light");
      const darkPreview = document.getElementById("spinner-preview-dark");

      lightPreview.innerHTML = "";
      lightPreview.appendChild(spinnerElement.cloneNode(true));

      darkPreview.innerHTML = "";
      darkPreview.appendChild(spinnerElement.cloneNode(true));

      document.getElementById("html-output").textContent = html;
    }
  } catch (error) {
    console.error("Error applying HTML:", error);
    alert("Invalid HTML. Please check your code.");
  }
}

function applyCustomCss(css) {
  try {
    let styleElement = document.getElementById("custom-spinner-styles");

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "custom-spinner-styles";
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
    document.getElementById("css-output").textContent = css;

    parseAndUpdateFromCss(css);

  } catch (error) {
    console.error("Error applying CSS:", error);
    alert("Invalid CSS. Please check your code.");
  }
}

function parseAndUpdateFromCss(css) {
  let needsUpdate = false;

  const colorPatterns = [
    /background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/i,  // For dots spinner
    /border-top-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/i,  // For circle/ring spinner
    /border-top:\s*[^;]*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/i   // Alternative border-top format
  ];

  let foundColor = null;
  for (const pattern of colorPatterns) {
    const match = css.match(pattern);
    if (match && match[1]) {
      foundColor = match[1];
      break;
    }
  }

  if (foundColor && isValidHexColor(foundColor)) {
    spinnerState.color = foundColor;

    const colorPicker = document.getElementById("color-picker");
    colorPicker.value = foundColor;

    needsUpdate = true;
  }

  const speedPatterns = [
    /animation:\s*[^;]*?(\d+(?:\.\d+)?)s/i,
    /animation-duration:\s*(\d+(?:\.\d+)?)s/i,
  ];

  let foundSpeed = null;
  for (const pattern of speedPatterns) {
    const match = css.match(pattern);
    if (match && match[1]) {
      foundSpeed = parseFloat(match[1]);
      break;
    }
  }

  if (foundSpeed && foundSpeed >= 0.1 && foundSpeed <= 5) {
    spinnerState.speed = foundSpeed;

    const speedSlider = document.getElementById("speed-slider");
    const speedValueLabel = document.getElementById("speed-value");
    speedSlider.value = foundSpeed;
    speedValueLabel.textContent = `${foundSpeed.toFixed(1)}s`;

    updateSliderBackground(speedSlider);
    needsUpdate = true;
  }

  const sizePatterns = [
    /width:\s*(\d+)px/i,
    /height:\s*(\d+)px/i,
  ];

  let foundSize = null;
  for (const pattern of sizePatterns) {
    const match = css.match(pattern);
    if (match && match[1]) {
      let parsedSize = parseInt(match[1]);
      
      // For dots spinner multiply by 3 to get actual spinner size
      if (spinnerState.shape === 'dots') {
        parsedSize = parsedSize * 3;
      }
      
      foundSize = parsedSize;
      break;
    }
  }

  if (foundSize && foundSize >= 16 && foundSize <= 128) {
    spinnerState.size = foundSize;

    const sizeSlider = document.getElementById("size-slider");
    const sizeValueLabel = document.getElementById("size-value");
    sizeSlider.value = foundSize;
    sizeValueLabel.textContent = `${foundSize}px`;
    
    updateSliderBackground(sizeSlider);
    needsUpdate = true;
  }

  if (needsUpdate) {
    updateSpinner();
  }
}