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
        WidgetHelper.getContainer(this).innerHTML = `<form id="searchForm"><input type="text" placeholder="Search the web with ${engine.name}..." id="searchTerm" autocomplete="off"></form>`;
        document.getElementById("searchForm").onsubmit = (event) => {
            event.preventDefault();
            location.href = engine.url.replaceAll("{search_term}", document.getElementById("searchTerm").value);
            return false;
        }
        var settingsHtml = "";
        Object.keys(this.engines).forEach((key) => {
            settingsHtml += `<option value="${key}" ${key == engine.name.toLowerCase() ? "selected": ""}>${this.engines[key].name}</option>`;
        });
        WidgetHelper.getSettingsContainer(this).innerHTML = `Select the search engine you prefer: <select id="searchEngine">${settingsHtml}</select>`;
        this.engineChanged = this.engineChanged.bind(this);
        document.getElementById("searchEngine").addEventListener("change", this.engineChanged);
        WidgetHelper.addStyle(this);
    }

    engineChanged() {
        var engine = this.engines[document.getElementById("searchEngine").value];
        this.storage["searchEngine"] = engine;
        WidgetHelper.setStorage(this, this.storage);
        WidgetHelper.getContainer(this).innerHTML = `<form id="searchForm"><input type="text" placeholder="Search the web with ${engine.name}..." id="searchTerm" autocomplete="off"></form>`;
        document.getElementById("searchForm").onsubmit = () => {
            event.preventDefault();
            location.href = engine.url.replaceAll("{search_term}", document.getElementById("searchTerm").value);
            return false;
        }
        var settingsHtml = "";
        Object.keys(this.engines).forEach((key) => {
            settingsHtml += `<option value="${key}" ${key == engine.name.toLowerCase() ? "selected": ""}>${this.engines[key].name}</option>`;
        });
        WidgetHelper.getSettingsContainer(this).innerHTML = `Select the search engine you prefer: <select id="searchEngine">${settingsHtml}</select>`;
        this.engineChanged = this.engineChanged.bind(this);
        document.getElementById("searchEngine").addEventListener("change", this.engineChanged);
    }

    disable() {
        WidgetHelper.destroyContainer(this);
    }
}