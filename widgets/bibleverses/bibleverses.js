import { WidgetHelper } from "../../modules/widget-helper.js";

export class BibleVerses {
    static load() {
        WidgetHelper.create(this, "Bible Verses", "Display a random bible verse from the EHV");
    }

    async enable() {
        WidgetHelper.addStyle(this);
        const container = WidgetHelper.getContainer(this);
        let element = document.createElement("p");
        container.appendChild(element);
        
        let response = await fetch("https://fxzfun.com/api/splash/bibleverses/?key=8287e2e5-59a0-4fa6-ab52-01902363671d&translation=EHV");
        let content = await response.json();

        element.innerText = content?.verse + " - " + content?.reference + " EHV";
    }

    disable() {
        WidgetHelper.destroyContainer(this);
    }
}