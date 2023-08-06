export default function Fahrenheit(unitValue) {
    return Number((((unitValue - 32) * 5) / 9).toFixed())
}