import { WidgetHelper } from "../../modules/widget-helper.js";

export class Search {
    engines = {
        "brave": {"name": "Brave", "url": "https://search.brave.com/search?q={search_term}"},
        "google": {"name": "Google", "url": "https://google.com/search?q={search_term}"},
        "bing": {"name": "Bing", "url": "https://www.bing.com/search?q={search_term}"},
        "duckduckgo": {"name": "DuckDuckGo", "url": "https://duckduckgo.com/?q={search_term}"},
        "youchat": {"name": "YouChat", "url": "https://you.com/search?q={search_term}&fromSearchBar=true&tbm=youchat"},
        "yahoo": {"name": "Yahoo", "url": "https://search.yahoo.com/search?p={search_term}"},
        "yandex": {"name": "Yandex", "url": "https://yandex.com/search/?text={search_term}"},
        "ask.com": {"name": "Ask.com", "url": "https://www.ask.com/web?q={search_term}"},
        "ecosia": {"name": "Ecosia", "url": "https://www.ecosia.org/search?q={search_term}"}
    };
    id = this.constructor.name;
    storage = WidgetHelper.getStorage(this);
    static load() {
        WidgetHelper.create(this, "Search", "Allows you to search the web from your new tab.");
    }

    enable() {
        var engine = {};
        if (this.storage.hasOwnProperty("searchEngine")) {
            engine = this.storage.searchEngine;
        } else {
            engine = {"name": "Brave", "url": "https://search.brave.com/search?q={search_term}"}
        }
        let container = WidgetHelper.getContainer(this);
        let form = document.createElement("form");
        form.id = "searchForm";

        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Search the web with " + engine.name + "...";
        input.id = "searchTerm";
        input.autocomplete = "off";
        form.appendChild(input);
        container.appendChild(form);

        document.getElementById("searchForm").onsubmit = (event) => {
            event.preventDefault();
            location.href = engine.url.replaceAll("{search_term}", document.getElementById("searchTerm").value);
            return false;
        }

        let settingsContainer = WidgetHelper.getSettingsContainer(this);
        settingsContainer.innerText = "Select the search engine you prefer: ";

        let select = document.createElement("select");
        select.id = "searchEngine";
        Object.keys(this.engines).forEach((key) => {
            let option = document.createElement("option");
            option.value = key;
            if (key == engine.name.toLowerCase()) option.selected = true;
            option.innerText = this.engines[key].name;
            select.appendChild(option);

        });
        settingsContainer.appendChild(select);
        this.engineChanged = this.engineChanged.bind(this);
        document.getElementById("searchEngine").addEventListener("change", this.engineChanged);
        WidgetHelper.addStyle(this);
    }

    engineChanged() {
        var engine = this.engines[document.getElementById("searchEngine").value];
        this.storage["searchEngine"] = engine;
        WidgetHelper.setStorage(this, this.storage);
        let container = WidgetHelper.getContainer(this);
        let form = document.createElement("form");
        form.id = "searchForm";

        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Search the web with " + engine.name + "...";
        input.id = "searchTerm";
        input.autocomplete = "off";
        form.appendChild(input);
        container.appendChild(form);
        document.getElementById("searchForm").onsubmit = () => {
            event.preventDefault();
            location.href = engine.url.replaceAll("{search_term}", document.getElementById("searchTerm").value);
            return false;
        }
        let settingsContainer = WidgetHelper.getSettingsContainer(this);
        settingsContainer.innerText = "Select the search engine you prefer: ";

        let select = document.createElement("select");
        select.id = "searchEngine";
        Object.keys(this.engines).forEach((key) => {
            let option = document.createElement("option");
            option.value = key;
            if (key == engine.name.toLowerCase()) option.selected = true;
            option.innerText = this.engines[key].name;
            select.appendChild(option);

        });
        settingsContainer.appendChild(select);
        this.engineChanged = this.engineChanged.bind(this);
        document.getElementById("searchEngine").addEventListener("change", this.engineChanged);
    }

    disable() {
        WidgetHelper.destroyContainer(this);
    }
}