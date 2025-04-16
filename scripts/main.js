const spinnerPreview = document.getElementById("spinner-preview");

function renderDotsSpinner() {
  spinnerPreview.innerHTML = `
    <div class="spinner-dots">
      <div></div><div></div><div></div>
    </div>
  `;
}

renderDotsSpinner();
