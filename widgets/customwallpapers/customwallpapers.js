import { WidgetHelper } from "../../modules/widget-helper.js";

export class CustomWallpapers {
    storage = WidgetHelper.getStorage(this);
    prevBackground = "";
    id = this.constructor.name;
    
    static load() {
        WidgetHelper.create(this, "Custom Wallpapers", "Add custom wallpapers to your new tab.");
    }

    enable() {
        if (navigator.onLine && this.storage.wallpapers) {
            let randomBackground = this.storage.wallpapers[Math.floor(Math.random() * this.storage.wallpapers.length)];
            this.setBackground(randomBackground);
        }

        let container = WidgetHelper.getSettingsContainer(this);
        let p = document.createElement("p");
        p.innerText = "Seperate Wallpaper URLs with a comma";
        container.appendChild(p);

        let div = document.createElement("div");
        div.style.position = "relative";

        let input = document.createElement("input");
        input.type = "text";
        input.id = this.id + "-urls";
        input.placeholder = " ";
        input.autocomplete = "off";
        input.value = this.storage.hasOwnProperty("wallpapers") ? this.storage.wallpapers.join(",") : "";
        div.appendChild(input);

        let label = document.createElement("label");
        label.classList = "placeholder-text";
        label.for = this.id + "-urls";

        let div2 = document.createElement("div");
        div2.classList = "text";
        div2.innerText = "Wallpaper URLs";
        label.appendChild(div2);
        
        div.appendChild(label);

        container.appendChild(div);

        this.updateStorage = this.updateStorage.bind(this);
        document.getElementById(this.id + "-urls").onchange = this.updateStorage;
    }

    setBackground(filename) {
        let url = filename;
        this.prevBackground = document.body.style.background;
        document.body.style.background =
            "linear-gradient(0deg, rgb(2 0 36 / 40%) 0%, rgb(0 0 0 / 20%) 20%, rgba(255,255,255,0) 40%, rgb(0 0 0 / 20%) 80%, rgb(2 0 36 / 40%) 100%), url('" +
            url +
            "') no-repeat center";
        document.body.style.backgroundSize = "cover";
    }

    resetBackground() {
        document.body.style.background = this.prevBackground;
        document.body.style.backgroundSize = "cover";
    }

    updateStorage() {
        this.storage.wallpapers = document.getElementById(this.id + "-urls").value.split(",");
        WidgetHelper.setStorage(this, this.storage)
    }

    disable() {
        this.resetBackground();
    }
}