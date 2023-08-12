export class Clock {
    constructor() {
        this.intervalId = null;
        this.prevTime = new Date();
        this.callbacks = {
            second: null,
            minute: null,
            hour: null,
            day: null
        };
        this.format = 24;
    }

    start() {
        const currentTime = new Date();

        Object.values(this.callbacks).forEach(callback => {
            if (typeof callback === 'function') {
                callback(currentTime);
            }
        });

        const checkSecondChange = () => {
            const currentTime = new Date();

            if (currentTime.getSeconds() !== this.prevTime.getSeconds()) {
                clearInterval(intervalId);
                this.intervalId = setInterval(() => this.update(), 1000);
            }
        };

        const intervalId = setInterval(checkSecondChange, 100);
        return this;
    }


    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.prevTime = null;
        return this;
    }

    onUpdateSecond(callback) {
        this.callbacks.second = callback;
        return this;
    }

    onUpdateMinute(callback) {
        this.callbacks.minute = callback;
        return this;
    }

    onUpdateHour(callback) {
        this.callbacks.hour = callback;
        return this;
    }

    onUpdateDay(callback) {
        this.callbacks.day = callback;
        return this;
    }

    update(immediately=false) {
        const currentTime = new Date();

        if (currentTime.getSeconds() !== this.prevTime.getSeconds() || immediately) {
            if (typeof this.callbacks.second === 'function') {
                this.callbacks.second(currentTime);
            }
        }

        if (currentTime.getMinutes() !== this.prevTime.getMinutes() || immediately) {
            if (typeof this.callbacks.minute === 'function') {
                this.callbacks.minute(currentTime);
            }
        }

        if (currentTime.getHours() !== this.prevTime.getHours() || immediately) {
            if (typeof this.callbacks.hour === 'function') {
                this.callbacks.hour(currentTime);
            }
        }

        if (currentTime.getDay() !== this.prevTime.getDay() || immediately) {
            if (typeof this.callbacks.day === 'function') {
                this.callbacks.day(currentTime);
            }
        }

        this.prevTime = currentTime;
    }

    getDisplayTime(time = this.prevTime) {
        let hours = time.getHours();
        const minutes = time.getMinutes().toString().padStart(2, '0');
        let formatEnding = "";
    
        if (this.format === 12) {
            formatEnding = hours < 12 ? " AM" : " PM";
            hours = hours % 12 || 12;
        } else {
            hours = hours.toString().padStart(2, '0');
        }
    
        return `${hours}:${minutes}${formatEnding}`;
    }
    

    getDisplayDate(time=this.prevTime) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return time.toLocaleString({}, options);
    };

    setTimeFormat(format) {
        this.format = format ?? 24;
        return this;
    }
}