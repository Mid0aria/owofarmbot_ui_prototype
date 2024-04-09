function toggleInputs() {
    const isChecked = document.getElementById("timings-switch").checked;
    document.getElementById("huntbottom-input").disabled = !isChecked;
    document.getElementById("hunttop-input").disabled = !isChecked;
    document.getElementById("battlebottom-input").disabled = !isChecked;
    document.getElementById("battletop-input").disabled = !isChecked;
}

document.querySelector(".slider").addEventListener("click", function () {
    document.getElementById("timings-switch").click();
});

document
    .querySelector("#animals-switch + .slider")
    .addEventListener("click", function () {
        setTimeout(function () {
            document.getElementById("animals-switch").click();
        }, 0);
    });

document
    .getElementById("animals-switch")
    .addEventListener("change", function () {
        const isChecked = this.checked;
        const elements = document.querySelectorAll(
            ".dropdown-container, .checkbox-container, p"
        );

        elements.forEach((element) => {
            if (isChecked) {
                element.classList.remove("dim");
            } else {
                element.classList.add("dim");
            }
        });
    });

const animalsSwitch = document.getElementById("animals-switch");

// Select all checkboxes and dropdowns related to animals
const animalCheckboxes = document.querySelectorAll(
    '.checkbox-container input[type="checkbox"]'
);
const animalDropdown = document.getElementById("type-dropdown");

// Add an event listener for the 'change' event to the "Animals" switch
animalsSwitch.addEventListener("change", function () {
    // If the switch is off (unchecked), disable all checkboxes and dropdowns related to animals
    // If the switch is on (checked), enable all checkboxes and dropdowns related to animals
    animalCheckboxes.forEach((checkbox) => (checkbox.disabled = !this.checked));
    animalDropdown.disabled = !this.checked;
});

window.onload = function () {
    // Check the state of the "Animals" switch when the page loads
    const isChecked = document.getElementById("animals-switch").checked;
    const elements = document.querySelectorAll(
        ".dropdown-container, .checkbox-container, p"
    );

    elements.forEach((element) => {
        if (isChecked) {
            element.classList.remove("dim");
        } else {
            element.classList.add("dim");
        }
    });

    // If the switch is off (unchecked), disable all checkboxes and dropdowns related to animals
    // If the switch is on (checked), enable all checkboxes and dropdowns related to animals
    animalCheckboxes.forEach((checkbox) => (checkbox.disabled = !isChecked));
    animalDropdown.disabled = !isChecked;
};
