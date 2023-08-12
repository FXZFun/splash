import { WidgetHelper } from "../../modules/widget-helper.js";

export class QuickLinks {
    static load() {
        WidgetHelper.create(this, "Quick Links", "Shows your frequently accessed websites.");
    }

    async enable() {
        if (typeof browser != "object") {
            let hasPermissions = await chrome.permissions.contains({ permissions: ["favicon", "topSites"] });
            if (!hasPermissions) {
                let result = await chrome.permissions.request({ permissions: ["favicon", "topSites"] });
                if (!result) {
                    WidgetHelper.setEnabled(this, false);
                    WidgetHelper.destroyContainer(this)
                    return false;
                }
            }
        }

        WidgetHelper.addStyle(this);        
        var container = WidgetHelper.getContainer(this);
        container.classList.add("gallery");
        container.style.display = "flex";
        container.innerHTML = "";

        typeof browser != "object" ?
            chrome.topSites.get((sites) => this.addTopSites(sites, container)) :
            chrome.topSites.get({ includeFavicon: true }, (sites) => this.addTopSites(sites, container));
    }

    addTopSites(sites, container) {
        sites.forEach((site, index) => {
            if (index > 9) return;

            var div = document.createElement("div");
            div.classList.add("card");

            var a = document.createElement("a");
            a.href = site.url;
            div.appendChild(a);

            var img = document.createElement("img");
            typeof browser != "object" ?
                img.src = "/_favicon/?pageUrl=" + encodeURIComponent(site.url) + "&size=64" :
                img.src = site.favicon ?? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0xIDE3LjkzYy0zLjk1LS40OS03LTMuODUtNy03LjkzIDAtLjYyLjA4LTEuMjEuMjEtMS43OUw5IDE1djFjMCAxLjEuOSAyIDIgMnYxLjkzem02LjktMi41NGMtLjI2LS44MS0xLTEuMzktMS45LTEuMzloLTF2LTNjMC0uNTUtLjQ1LTEtMS0xSDh2LTJoMmMuNTUgMCAxLS40NSAxLTFWN2gyYzEuMSAwIDItLjkgMi0ydi0uNDFjMi45MyAxLjE5IDUgNC4wNiA1IDcuNDEgMCAyLjA4LS44IDMuOTctMi4xIDUuMzl6Ii8+PC9zdmc+";
            a.appendChild(img);

            var p = document.createElement("p");
            p.innerText = site.title;
            a.appendChild(p);

            container.appendChild(div);
        })
    }

    disable() {
        if (typeof browser != "object") chrome.permissions.remove({ permissions: ["favicon", "topSites"] });
        WidgetHelper.destroyContainer(this);
    }
}