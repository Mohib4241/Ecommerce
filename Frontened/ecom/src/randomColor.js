function getRandomRGB() {
    const r = Math.floor(Math.random() * 256); // Random red (0-255)
    const g = Math.floor(Math.random() * 256); // Random green (0-255)
    const b = Math.floor(Math.random() * 256); // Random blue (0-255)
    return `rgb(${r}, ${g}, ${b})`;
}


export default getRandomRGB