const spinnerState = {
  shape: "dots",
  size: 48,
  color: "#3498db",
  speed: 1,
};

const colorInput = document.getElementById("color-picker");
const sizeInput = document.getElementById("size-slider");
const speedInput = document.getElementById("speed-slider");

colorInput.addEventListener("input", () => {
	spinnerState.color = colorInput.value;
	updateSpinner();
});

sizeInput.addEventListener("input", () => {
	spinnerState.size = parseInt(sizeInput.value);
	updateSpinner();
});

speedInput.addEventListener("input", () => {
	const rawValue = parseFloat(speedInput.value);
	spinnerState.speed = 5 - rawValue + 0.1; // max - val + min offset
	updateSpinner();
});

const spinnerPreview = document.getElementById("spinner-preview");
const shapeSelect = document.getElementById("shape-select");

function updateSpinner() {
  const shape = shapeSelect.value;

  switch (shape) {
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
}

shapeSelect.addEventListener("change", updateSpinner);

function createSpinnerWrapper(className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  return wrapper;
}

function renderDotsSpinner() {
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

  spinnerPreview.innerHTML = "";
  spinnerPreview.appendChild(wrapper);
}

function renderCircleSpinner() {
  const wrapper = createSpinnerWrapper("spinner-circle");

  spinnerPreview.innerHTML = "";
  spinnerPreview.appendChild(wrapper);
}

function renderRingSpinner() {
  const wrapper = createSpinnerWrapper("spinner-ring");

  spinnerPreview.innerHTML = "";
  spinnerPreview.appendChild(wrapper);
}

renderDotsSpinner();
