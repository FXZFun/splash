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
        let fetchObj = await fetch("https://api.geocode.city/autocomplete?limit=10&q=" + input);
        let json = await fetchObj.json();
        this.autoCompleteBox.innerHTML = "";
        json.forEach(prediction => {
            this.addItem(prediction.latitude, prediction.longitude, prediction.name + (prediction.region ? ", " + prediction.region : ""), prediction.country);
        });
        let small = document.createElement("small");
        small.innerText = "Powered by ";
        
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = "https://geocode.city";
        a.innerText = "geocode.city";
        small.appendChild(a);
        this.autoCompleteBox.appendChild(small);
    }

    addItem(lat, lng, bigText, smallText) {
        let div = document.createElement("div");
        div.dataset.placeLat = lat;
        div.dataset.placeLng = lng;

        let p = document.createElement("p");
        p.classList = "autocomplete-place";

        let span1 = document.createElement("span");
        span1.innerText = bigText + " ";

        let span2 = document.createElement("span");
        span2.classList = "grayText";
        span2.innerText = smallText;

        p.appendChild(span1);
        p.appendChild(span2);
        div.appendChild(p);
        
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
        }, 250);
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