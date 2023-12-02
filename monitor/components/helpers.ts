// helper: parsovani Date z UNIX int casu
export function parseDate(val: string | null) : Date | null {
    if (val == null)
        return null;

    return new Date(Number(val) * 1000);
}

// helper: formatovani datum-casu
export function formatDate(time: Date | null): string {
    if (!time) return "";

    return time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear() + " "
        + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

// helper: overeni klicovych nastaveni
export function doCheck(val: string,  checkWith: string | null):boolean | null{
    if (checkWith == null)
        return null;
    else if (val == null)
        return false;
    else
        return (val.toLowerCase() === checkWith.toLowerCase());
}

// helper: nahodny obrazek
export function getRandom(arr: string[] | null): string | null {
    if (arr === null)
        return null;

    return arr[Math.floor(Math.random() * arr.length)];
}
