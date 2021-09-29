async function setLocale(locale) {
    await window.localStorage.setItem("locale", locale);
}

async function getLocale() {
    const locale = await window.localStorage.getItem("locale");
    return locale;
}

async function getTheme() {
    const theme = await window.localStorage.getItem("theme");
    return theme;
}

async function setTheme(theme) {
    window.localStorage.setItem("theme", theme);
}

async function setLayout(layout) {
    window.localStorage.setItem("layout", JSON.stringify(layout));
}

async function getLayout() {
    const layout =  await window.localStorage.getItem("layout");
    return JSON.parse(layout);
}

export { setLocale, getLocale, setTheme, getTheme, setLayout, getLayout};