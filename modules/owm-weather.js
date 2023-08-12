export class WeatherApi {
    #apiKey = "7f35f239cbe6b3e671d433635300a261";

    constructor() {
        this.data = null;
        this.location = { coordinates: { lat: 0, lng: 0 } };
    }

    setLocation(lat, lng) {
        this.location.coordinates = {
            lat: lat,
            lng: lng
        };
        return this;
    }

    async update(callback) {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.location.coordinates.lat}&lon=${this.location.coordinates.lng}&appid=${this.#apiKey}`);
        if (!response.ok) return null;
        this.data = await response.json();
        if (typeof callback == 'function') {
            callback(this.getCurrentTemp(), this.getIcon());
        }
        return this;
    }

    async autoUpdate(callback, loopTime) {
        await this.update();
        callback(this.getCurrentTemp(), this.getIcon());

        setInterval(async () => {
            await this.update();
            callback(this.getCurrentTemp(), this.getIcon());
        }, loopTime);
        return this;
    }

    getCurrentTemp() {
        let temp = this.data?.main?.temp ?? 0;
        return parseInt((temp - 273.15) * 9 / 5 + 32);
    }

    getCurrentConditions() {
        return this.data["weather"][0]["main"];
    }

    getIcon() {
        return `wi wi-owm-${this.#isDaytime() ? 'day' : 'night'}-${this.data.weather[0].id}`;
    }


    #isDaytime() {
        let sunrise = new Date(this.data?.sys?.sunrise * 1000);
        let sunset = new Date(this.data?.sys?.sunset * 1000);
        let now = new Date();

        return (now.getHours() >= sunrise.getHours() && now.getHours() < sunset.getHours());
    }
}