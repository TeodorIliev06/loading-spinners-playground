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
  switch (spinnerState.shape) {
    case "dots":
      renderDotsSpinner();
      break;
    case "circle":
      renderCircleSpinner();
      break;
    case "ring":
      renderRingSpinner();
      break;
    default:
      renderDotsSpinner();
  }

  // Update both light and dark previews
  updateCodeSnippets();
}

function createSpinnerWrapper(className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  return wrapper;
}

function renderDotsSpinner() {
  const wrapperLight = createDotsSpinner();
  document.getElementById("spinner-preview-light").innerHTML = "";
  document.getElementById("spinner-preview-light").appendChild(wrapperLight);

  const wrapperDark = createDotsSpinner();
  document.getElementById("spinner-preview-dark").innerHTML = "";
  document.getElementById("spinner-preview-dark").appendChild(wrapperDark);
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
  const wrapperLight = createCircleSpinner();
  document.getElementById("spinner-preview-light").innerHTML = "";
  document.getElementById("spinner-preview-light").appendChild(wrapperLight);

  const wrapperDark = createCircleSpinner();
  document.getElementById("spinner-preview-dark").innerHTML = "";
  document.getElementById("spinner-preview-dark").appendChild(wrapperDark);
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
  const wrapperLight = createRingSpinner();
  document.getElementById("spinner-preview-light").innerHTML = "";
  document.getElementById("spinner-preview-light").appendChild(wrapperLight);

  const wrapperDark = createRingSpinner();
  document.getElementById("spinner-preview-dark").innerHTML = "";
  document.getElementById("spinner-preview-dark").appendChild(wrapperDark);
}

function createRingSpinner() {
  const wrapper = createSpinnerWrapper("spinner-ring");
  wrapper.style.width = `${spinnerState.size}px`;
  wrapper.style.height = `${spinnerState.size}px`;

  const borderWidth = Math.max(2, spinnerState.size / 20);
  wrapper.style.borderWidth = `${borderWidth}px`;
  wrapper.style.borderTopColor = spinnerState.color;

  const lightBackground = document.querySelector(".preview-light") !== null;
  const borderColor = lightBackground
    ? "rgba(204, 204, 204, 0.3)"
    : "rgba(255, 255, 255, 0.1)";
  wrapper.style.borderColor = borderColor;
  wrapper.style.borderTopColor = spinnerState.color;

  wrapper.style.animation = `pulse-spin ${spinnerState.speed}s ease-in-out infinite`;

  return wrapper;
}

updateSpinner();
