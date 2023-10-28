export class Utils {
    static async wait(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}
