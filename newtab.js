import { Clock } from "./modules/clock.js";
import { WeatherApi } from "./modules/owm-weather.js";
import { Autocomplete } from "./modules/autocomplete.js";
import { Search } from "./widgets/search/search.js";
import { CustomWallpapers } from "./widgets/customwallpapers/customwallpapers.js";
import { BibleVerses } from "./widgets/bibleverses/bibleverses.js";
import { QuickLinks } from "./widgets/quicklinks/quicklinks.js";

if (!localStorage.hasOwnProperty("settings")) {
    localStorage.setItem("settings", JSON.stringify({ widgets: {} }));
}

async function main() {
    const clock = new Clock();
    clock.setTimeFormat(JSON.parse(localStorage.getItem("settings"))?.timeFormat)
        .onUpdateMinute(t => {
            document.getElementById("time").innerText = clock.getDisplayTime(t);
        })
        .onUpdateDay(t => {
            document.getElementById("date").innerText = clock.getDisplayDate(t);
        })
        .start();

    let backgrounds = await getBackgrounds(JSON.parse(localStorage.getItem("settings"))["theme"] ?? "summer");
    let randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);

    let latlng = getLocation();

    const weatherApi = new WeatherApi();
    weatherApi.setLocation(latlng.lat, latlng.lng).autoUpdate((temp, icon) => {
        document.getElementById("currentWeatherTemperature").innerText = temp;
        document.getElementById("currentWeatherIcon").classList = icon;
    }, 60 * 60 * 1000);

    document
        .querySelector(".currentWeather")
        .addEventListener(
            "click",
            () =>
                (location.href = `https://forecast.weather.gov/MapClick.php?lon=${latlng.lng}&lat=${latlng.lat}`)
        );

    document
        .getElementById("settingsBtn")
        .addEventListener("click", () => openSettings(clock, weatherApi));
    document
        .querySelector(".settings.header button")
        .addEventListener("click", () => closeSettings());

    document.getElementById("springTheme").onclick = () => setTheme("spring");
    document.getElementById("summerTheme").onclick = () => setTheme("summer");
    document.getElementById("fallTheme").onclick = () => setTheme("fall");
    document.getElementById("winterTheme").onclick = () => setTheme("winter");

    try { BibleVerses.load(); } catch (e) { console.error(e); }
    try { Search.load(); } catch (e) { console.error(e); }
    try { CustomWallpapers.load(); } catch (e) { console.error(e); }
    try { QuickLinks.load(); } catch (e) { console.error(e); }
}
main();

function getBackgrounds(theme) {
    return new Promise(resolve => {
        const backgrounds = ["---BACKGROUNDS---"];
        resolve(backgrounds.filter(f => f.startsWith(theme)).map(f => f));
    });
}

function setBackground(filename) {
    let url = "backgrounds/" + encodeURIComponent(filename);
    document.body.style.background =
        "linear-gradient(0deg, rgb(2 0 36 / 40%) 0%, rgb(0 0 0 / 20%) 20%, rgba(255,255,255,0) 40%, rgb(0 0 0 / 20%) 80%, rgb(2 0 36 / 40%) 100%), url('" +
        url +
        "') no-repeat center";
    document.body.style.backgroundSize = "cover";
}

function getLocation() {
    return (
        JSON.parse(localStorage.getItem("settings"))["location"] ?? {
            lat: 32,
            lng: 96
        }
    );
}

function openSettings(clock, weatherApi) {
    let autoComplete = new Autocomplete();
    document.getElementById("timeFormat").checked = clock.format == 12;
    let menu = document.getElementById("menu")
    menu.classList.add("show");
    menu.classList.remove("hide");

    let loc = getLocation();

    let input = document.getElementById("settingsAddressInput");
    if (!!loc.name) input.value = loc.name;

    autoComplete.bind(input);

    autoComplete.setOnCompleteListener((city, lat, lng) => {
        var settings = JSON.parse(localStorage.getItem("settings"));
        input.value = city;
        settings.location = {
            name: city,
            lat: lat,
            lng: lng
        };
        localStorage.setItem("settings", JSON.stringify(settings));
        let latlng = getLocation();
        weatherApi.setLocation(latlng.lat, latlng.lng).update((temp, icon) => {
            document.getElementById("currentWeatherTemperature").innerText = temp;
            document.getElementById("currentWeatherIcon").classList = icon;
        });
    });

    document.getElementById("timeFormat").addEventListener("change", () => updateTimeFormat(clock));
}

function closeSettings() {
    let menu = document.getElementById("menu")
    menu.classList.remove("show");
    menu.classList.add("hide");
}

function updateTimeFormat(clock) {
    var settings = JSON.parse(localStorage.getItem("settings"));
    let checked = document.getElementById("timeFormat").checked;

    settings.timeFormat = checked ? 12 : 24;
    clock.setTimeFormat(settings.timeFormat);
    clock.update(true);

    localStorage.setItem("settings", JSON.stringify(settings));
}

async function setTheme(theme) {
    var settings = JSON.parse(localStorage.getItem("settings"));

    settings.theme = theme;

    let backgrounds = await getBackgrounds(theme);
    let randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);

    localStorage.setItem("settings", JSON.stringify(settings));
}