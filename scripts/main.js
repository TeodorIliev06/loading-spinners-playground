// State management for spinner customization
const spinnerState = {
  shape: "dots",
  size: 48,
  color: "#3498db",
  speed: 1,
};

const colorInput = document.getElementById("color-picker");
const sizeInput = document.getElementById("size-slider");
const sizeValueLabel = document.getElementById("size-value");
const speedInput = document.getElementById("speed-slider");
const speedValueLabel = document.getElementById("speed-value");
const shapeSelect = document.getElementById("shape-select");

const htmlOutput = document.getElementById("html-output");
const cssOutput = document.getElementById("css-output");

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const textToCopy = document.getElementById(targetId).textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
      btn.textContent = "Copied!";
      btn.classList.add("copied");

      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    });
  });
});

colorInput.addEventListener("input", () => {
  spinnerState.color = colorInput.value;
  updateSpinner();
});

sizeInput.addEventListener("input", () => {
  spinnerState.size = parseInt(sizeInput.value);
  sizeValueLabel.textContent = `${spinnerState.size}px`;
  updateSpinner();
});

speedInput.addEventListener("input", () => {
  const rawValue = parseFloat(speedInput.value);
  const invertedValue = 5 - rawValue + 0.1; // max - val + min offset

  spinnerState.speed = invertedValue;
  speedValueLabel.textContent = `${invertedValue.toFixed(1)}s`;

  updateSpinner();
});

shapeSelect.addEventListener("change", () => {
  spinnerState.shape = shapeSelect.value;
  updateSpinner();
});

function updateSpinner() {
  const spinnersMap = {
    dots: renderDotsSpinner,
    circle: renderCircleSpinner,
    ring: renderRingSpinner,
  };

  const renderFunction = spinnersMap[spinnerState.shape] || renderDotsSpinner;
  renderFunction();

  // Update both light and dark previews
  updateCodeSnippets();
}

function createSpinnerWrapper(className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  return wrapper;
}

function renderSpinnerToContainers(createSpinnerFunction) {
  const wrapperLight = createSpinnerFunction();
  renderToContainer("spinner-preview-light", wrapperLight);

  const wrapperDark = createSpinnerFunction();
  renderToContainer("spinner-preview-dark", wrapperDark);
}

// Helper function to render any element to a container
function renderToContainer(containerId, element) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  container.appendChild(element);
}

function renderDotsSpinner() {
  renderSpinnerToContainers(createDotsSpinner);
}

function createDotsSpinner() {
  const wrapper = createSpinnerWrapper("spinner-dots");
  wrapper.style.gap = `${spinnerState.size * 0.15}px`;

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.style.width = `${spinnerState.size / 3}px`;
    dot.style.height = `${spinnerState.size / 3}px`;
    dot.style.backgroundColor = spinnerState.color;
    dot.style.animation = `bounce ${spinnerState.speed}s infinite ease-in-out`;

    if (i === 1) dot.style.animationDelay = `${spinnerState.speed / 3}s`;
    if (i === 2) dot.style.animationDelay = `${(2 * spinnerState.speed) / 3}s`;

    wrapper.appendChild(dot);
  }

  return wrapper;
}

function renderCircleSpinner() {
  renderSpinnerToContainers(createCircleSpinner);
}

function createCircleSpinner() {
  const wrapper = createSpinnerWrapper("spinner-circle");
  wrapper.style.width = `${spinnerState.size}px`;
  wrapper.style.height = `${spinnerState.size}px`;
  wrapper.style.borderWidth = `${Math.max(2, spinnerState.size / 20)}px`;
  wrapper.style.borderTopColor = spinnerState.color;
  wrapper.style.animation = `spin ${spinnerState.speed}s linear infinite`;

  return wrapper;
}

function renderRingSpinner() {
  const wrapperLight = createRingSpinner(true);
  renderToContainer("spinner-preview-light", wrapperLight);

  const wrapperDark = createRingSpinner(false);
  renderToContainer("spinner-preview-dark", wrapperDark);
}

function createRingSpinner(isLight = true) {
  const wrapper = createSpinnerWrapper("spinner-ring");
  wrapper.style.width = `${spinnerState.size}px`;
  wrapper.style.height = `${spinnerState.size}px`;

  const borderWidth = Math.max(2, spinnerState.size / 20);
  wrapper.style.borderWidth = `${borderWidth}px`;

  // Use the isLight parameter to determine border color
  const borderColor = isLight
    ? addAlpha(spinnerState.color, 0.3)
    : addAlpha(spinnerState.color, 0.1);

  wrapper.style.setProperty("--primary-color", spinnerState.color);
  wrapper.style.setProperty(
    "--accent-color",
    addAlpha(spinnerState.color, 0.7)
  );
  wrapper.style.setProperty("--secondary-color", borderColor);

  wrapper.style.animation = `pulse-spin ${spinnerState.speed}s ease-in-out infinite`;

  return wrapper;
}

function updateCodeSnippets() {
  const spinnerCode = generateSpinnerCode(spinnerState);

  htmlOutput.textContent = spinnerCode.html;
  cssOutput.textContent = spinnerCode.css;
}

function generateSpinnerCode(state) {
  const baseSpinner = {
    type: state.shape,
    size: state.size,
    color: state.color,
    speed: state.speed,
  };

  let spinner;
  switch (state.shape) {
    case "dots":
      spinner = {
        ...baseSpinner,
        dotSize: state.size / 3,
        gap: state.size * 0.15,
        delayFactor: state.speed / 3,
      };
      break;
    case "circle":
      spinner = {
        ...baseSpinner,
        borderWidth: Math.max(2, state.size / 20),
      };
      break;
    case "ring":
      spinner = {
        ...baseSpinner,
        borderWidth: Math.max(2, state.size / 20),
        secondaryColor: addAlpha(state.color, 0.3),
        accentColor: addAlpha(state.color, 0.7),
      };
      break;
    default:
      spinner = { ...baseSpinner };
  }

  return {
    html: generateHTML(spinner),
    css: generateCSS(spinner),
  };
}

function generateHTML(spinner) {
  switch (spinner.type) {
    case "dots":
      return `<div class="spinner-dots">
  <div></div>
  <div></div>
  <div></div>
</div>`;
    case "circle":
      return `<div class="spinner-circle"></div>`;
    case "ring":
      return `<div class="spinner-ring"></div>`;
    default:
      return "<!-- No spinner selected -->";
  }
}

function generateCSS(spinner) {
  // Generate CSS based on spinner type
  switch (spinner.type) {
    case "dots":
      return generateDotsCSS(spinner);
    case "circle":
      return generateCircleCSS(spinner);
    case "ring":
      return generateRingCSS(spinner);
    default:
      return "/* No spinner selected */";
  }
}

function generateDotsCSS(spinner) {
  return `.spinner-dots {
  display: flex;
  justify-content: center;
  gap: ${spinner.gap}px;
}

.spinner-dots div {
  width: ${spinner.dotSize}px;
  height: ${spinner.dotSize}px;
  background-color: ${spinner.color};
  border-radius: 50%;
  animation: bounce ${spinner.speed}s infinite ease-in-out;
}

.spinner-dots div:nth-child(2) {
  animation-delay: ${spinner.delayFactor}s;
}

.spinner-dots div:nth-child(3) {
  animation-delay: ${2 * spinner.delayFactor}s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
  }
  40% {
    transform: scale(1);
  }
}`;
}

function generateCircleCSS(spinner) {
  return `.spinner-circle {
  width: ${spinner.size}px;
  height: ${spinner.size}px;
  border: ${spinner.borderWidth}px solid transparent;
  border-top: ${spinner.borderWidth}px solid ${spinner.color};
  border-radius: 50%;
  animation: spin ${spinner.speed}s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`;
}

function generateRingCSS(spinner) {
  return `.spinner-ring {
  width: ${spinner.size}px;
  height: ${spinner.size}px;
  border: ${spinner.borderWidth}px solid ${spinner.secondaryColor};
  border-top-color: ${spinner.color};
  border-radius: 50%;
  animation: pulse-spin ${spinner.speed}s ease-in-out infinite;
}

@keyframes pulse-spin {
  0% {
    transform: rotate(0deg);
    border-top-color: ${spinner.color};
  }
  50% {
    border-top-color: ${spinner.accentColor};
  }
  100% {
    transform: rotate(360deg);
    border-top-color: ${spinner.color};
  }
}`;
}

function addAlpha(color, alpha) {
  // Convert hex to rgb
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

updateSpinner();
