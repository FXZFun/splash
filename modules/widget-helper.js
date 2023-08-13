export class WidgetHelper {
    // the area to inject widgets into
    static widgetArea = document.querySelector(".widgets");
    static marketplaceArea = document.querySelector(".marketplace");

    // widget instance, name, description
    static create(instance, name, description) {
        let widget = new instance();
        let id = widget.constructor.name;
        let enabled = this.isEnabled(widget);

        // add settings item
        var li = document.createElement("li");
        li.style.flexDirection = "row";
        let h3 = document.createElement("h3");
        h3.innerText = name;
        li.appendChild(h3);

        let input = document.createElement("input");
        input.type = "checkbox";
        input.id = "widgets-enabled-" + id;
        if (enabled) input.checked = true;
        li.appendChild(input);

        let label = document.createElement("label");
        label.setAttribute("for", "widgets-enabled-" + id);
        li.appendChild(label);

        let p = document.createElement("p");
        p.innerText = description;
        li.appendChild(p);

        this.marketplaceArea.appendChild(li);

        // adds widget settings
        var settings = document.createElement("li");
        settings.style.display = enabled ? "flex" : "none";
        settings.id = "widget-settings-" + id;
        this.marketplaceArea.appendChild(settings);

        // listens for settings enabled change
        let checkbox = document.querySelector("#widgets-enabled-" + id);
        checkbox.onchange = () => {
            if (checkbox.checked) {
                settings.style.display = "flex";
                container.style.display = "block";
                widget.enable();
                this.setEnabled(widget, true);
            } else {
                settings.style.display = "none";
                widget.disable();
                this.setEnabled(widget, false);
            }
        };

        // add widget container
        var container = document.createElement("div");
        container.id = "widget-" + id;
        this.widgetArea.appendChild(container);

        if (enabled) {
            container.style.display = "block";
            widget.enable();
        }
    }

    static getContainer(instance) {
        return document.getElementById("widget-" + instance.constructor.name);
    }

    static getSettingsContainer(instance) {
        return document.getElementById("widget-settings-" + instance.constructor.name);
    }

    static destroyContainer(instance) {
        document.getElementById("widget-" + instance.constructor.name).style.display = "none";
    }

    static isEnabled(instance) {
        const id = instance.constructor.name;
        let settings = JSON.parse(localStorage.getItem("settings"))["widgets"];
        return settings.hasOwnProperty(id) && settings[id].enabled;
    }

    static getStorage(instance) {
        const id = instance.constructor.name;
        let settings = JSON.parse(localStorage.getItem("settings"))["widgets"];
        return (settings.hasOwnProperty(id) && settings[id].hasOwnProperty("storage")) ? settings[id].storage : {};
    }

    static setStorage(instance, storage) {
        var settings = JSON.parse(localStorage.getItem("settings"));
        settings["widgets"][instance.constructor.name].storage = storage;
        localStorage.setItem("settings", JSON.stringify(settings));
        return storage;
    }

    static setEnabled(instance, enabled) {
        const id = instance.constructor.name;
        var settings = JSON.parse(localStorage.getItem("settings"));
        if (settings["widgets"].hasOwnProperty(id)) {
            settings["widgets"][id].enabled = enabled;
        } else {
            settings["widgets"][id] = { enabled: enabled };
        }
        localStorage.setItem("settings", JSON.stringify(settings));
        let checkbox = document.querySelector("#widgets-enabled-" + id);
        checkbox.checked = enabled;
    }

    static addStyle(instance) {
        const id = instance.constructor.name.toLowerCase();
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/widgets/" + id + "/" + id + ".css";
        document.querySelector("head").appendChild(link);
    }
}
