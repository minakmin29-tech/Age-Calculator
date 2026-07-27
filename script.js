const input = document.querySelector("#date");
const button = document.querySelector("#btn");
const result = document.querySelector("#result");

let isCalculated = false;

function printError(message = "Введите дату") {
    const error = document.createElement("p");
    error.textContent = message;
    error.style.color = "red";
    error.id = "error";
    button.after(error);
}

function deleteError() {
    const error = document.querySelector("#error");
    if (error) {
        error.remove();
    }
}

function calculateAge(day, month, year) {
    const today = new Date();

    let ageYears = today.getFullYear() - year;
    let ageMonths = today.getMonth() + 1 - month;
    let ageDays = today.getDate() - day;

    if (ageDays < 0) {
        ageMonths--;

        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        ageDays += prevMonth;
    }
    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }

    return { ageYears, ageMonths, ageDays };
}

function reset() {
    input.value = "";
    input.disabled = false;
    result.textContent = "";
    button.textContent = "Посчитать возраст";
    isCalculated = false;
}

button.addEventListener("click", function () {

    if (isCalculated) {
        reset();
        return;
    }

    deleteError();
    
    const value = input.value;

    if (value === "") {
        printError("Поле не должно быть пустым");
        return;
    }
    const parts = value.split(".");

    if (parts.length !== 3) {
        printError("Формат: ДД.ММ.ГГГГ");
        return;
    }

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        printError("Только числа");
        return;
    }
    const currentYear = new Date().getFullYear();

    if (year >= currentYear) {
        printError("Год должен быть меньше текущего");
        return;
    }
    const testDate = new Date(year, month - 1, day);

    if (
        testDate.getFullYear() !== year ||
        testDate.getMonth() !== month - 1 ||
        testDate.getDate() !== day
    ) {
        printError("Такой даты не существует");
        return;
    }

    const { ageYears, ageMonths, ageDays } = calculateAge(day, month, year);

    result.textContent = `На сегодняшний день вам ${ageYears} ${declension(ageYears, 'год', 'года', 'лет')}, ${ageMonths} ${declension(ageMonths, 'месяц', 'месяца', 'месяцев')} и ${ageDays} ${declension(ageDays, 'день', 'дня', 'дней')}`;

    input.disabled = true;
    button.textContent = "Посчитать заново";
    isCalculated = true;
});

function declension(number, one, few, many) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    
    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}