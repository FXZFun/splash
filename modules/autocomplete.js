export class Autocomplete {
    input;
    autoCompleteBox;
    keyIndex = 2;
    constructor() {
        this.keyIndex = 2;
    }
    bind(input) {
        this.input = input;
        this.onkeyup = this.onkeyup.bind(this);
        this.input.onkeyup = this.onkeyup;
        this.addAutoCompleteBox();
    }

    onkeyup() {
        if (this.keyIndex == 2 && this.input.value.trim() !== "") {
            this.autoComplete(this.input.value);
            this.keyIndex = 0;
        } else if (this.keyIndex == 2) {
            this.keyIndex = 0;
        } else {
            this.keyIndex++;
        }
    }

    async autoComplete(input) {
        var fetchObj = await fetch("https://api.geocode.city/autocomplete?limit=10&q=" + input);
        var json = await fetchObj.json();
        this.autoCompleteBox.innerHTML = "";
        json.forEach(prediction => {
            this.addItem(prediction.latitude, prediction.longitude, prediction.name + (prediction.region ? ", " + prediction.region : ""), prediction.country);
        });
        var small = document.createElement("small");
        small.innerHTML = "Powered by <a href='https://geocode.city/' target='_blank'>geocode.city</a>";
        this.autoCompleteBox.appendChild(small);
    }

    addItem(lat, lng, bigText, smallText) {
        var div = document.createElement("div");
        div.dataset.placeLat = lat;
        div.dataset.placeLng = lng;
        div.innerHTML = `<p class="autocomplete-place"><span>${bigText}</span> <span class="grayText">${smallText}</span></p>`;
        this.onClicked = this.onClicked.bind(this);
        div.onclick = this.onClicked;
        this.autoCompleteBox.appendChild(div);
    }

    onClicked(ev) {
        let el = ev.currentTarget;
        if (el.dataset.placeLat && el.dataset.placeLng) {
            this.placeSelected(el.innerText, el.dataset.placeLat, el.dataset.placeLng);
        }
    }

    addAutoCompleteBox() {
        this.autoCompleteBox = document.createElement("div");
        this.autoCompleteBox.style.position = "absolute";
        this.autoCompleteBox.style.top = this.input.clientHeight + this.input.clientTop + 10 + "px";
        this.autoCompleteBox.style.width = this.input.clientWidth + "px";
        this.autoCompleteBox.style.display = "none";
        this.autoCompleteBox.classList.add("autocompleteBox");
        this.autoCompleteBox.innerHTML = "";
        this.input.insertAdjacentElement("afterEnd", this.autoCompleteBox);
        this.hideAutocompleteBox = this.hideAutocompleteBox.bind(this);
        this.showAutocompleteBox = this.showAutocompleteBox.bind(this);
        this.input.onblur = this.hideAutocompleteBox;
        this.input.onfocus = this.showAutocompleteBox;
    }

    hideAutocompleteBox() {
        setTimeout(() => {
            this.autoCompleteBox.style.display = "none";
        }, 100);
    }

    showAutocompleteBox() {
        this.autoCompleteBox.style.display = "block";
    }

    async placeSelected(city, lat, lng) {
        if (typeof this.callback == 'function') {
            this.callback(city, lat, lng);
        }
    }

    setOnCompleteListener(callback) {
        this.callback = callback;
    }
}