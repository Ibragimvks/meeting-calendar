document.addEventListener('DOMContentLoaded', () => {
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarDaysGrid = document.getElementById('calendarDays');

    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const userNameInput = document.getElementById('userName');
    const userStatusSelect = document.getElementById('userStatus');
    const userColorInput = document.getElementById('userColor');
    const saveEntryBtn = document.getElementById('saveEntry');
    const currentEntriesList = document.getElementById('currentEntries');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDayElement = null; // To store the day element being edited
    let selectedDate = null; // To store the date being edited

    // Data structure to store entries for each day
    // Key: YYYY-MM-DD, Value: Array of { name, status, color } objects
    const dayEntries = {};

    function renderCalendar() {
        calendarDaysGrid.innerHTML = ''; // Clear previous days
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();

        monthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

        // Adjust for Monday start (0 for Sunday, 1 for Monday...)
        const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        // Add empty cells for the days before the first day of the month
        for (let i = 0; i < startDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            calendarDaysGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.innerHTML = `<div class="day-number">${i}</div>`;

            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            dayElement.dataset.date = dateString;

            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            dayElement.addEventListener('click', () => openModal(dayElement, dateString));
            calendarDaysGrid.appendChild(dayElement);

            // Apply coloring if there are entries for this day
            applyDayColoring(dayElement, dateString);
        }
    }

    function openModal(dayElement, date) {
        selectedDayElement = dayElement;
        selectedDate = date;
        selectedDateDisplay.textContent = `Выбранная дата: ${new Date(date).toLocaleDateString('ru-RU')}`;

        // Clear previous entries and input fields
        userNameInput.value = '';
        userStatusSelect.value = 'свободен';
        userColorInput.value = '#00FF00'; // Default green
        currentEntriesList.innerHTML = '';

        // Load existing entries for the selected day
        const entries = dayEntries[date] || [];
        if (entries.length > 0) {
            entries.forEach(entry => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${entry.name}</span> <span class="status">${entry.status}</span> <div style="width: 15px; height: 15px; background-color: ${entry.color}; border-radius: 3px; margin-left: 10px;"></div>`;
                currentEntriesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Нет записей для этого дня.';
            currentEntriesList.appendChild(li);
        }

        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
        selectedDayElement = null;
        selectedDate = null;
    }

    function saveEntry() {
        const name = userNameInput.value.trim();
        const status = userStatusSelect.value;
        const color = userColorInput.value;

        if (!name) {
            alert('Пожалуйста, введите имя.');
            return;
        }

        if (!selectedDate) {
            alert('Ошибка: Дата не выбрана.');
            return;
        }

        if (!dayEntries[selectedDate]) {
            dayEntries[selectedDate] = [];
        }

        // Add new entry
        dayEntries[selectedDate].push({ name, status, color });

        // Update the day's coloring
        applyDayColoring(selectedDayElement, selectedDate);
        closeModal();
    }

    function applyDayColoring(dayElement, date) {
        const entries = dayEntries[date] || [];
        dayElement.className = 'calendar-day'; // Reset classes
        dayElement.classList.add('day-number-container'); // Keep the number container
        
        // Remove any existing color segments
        dayElement.querySelectorAll('.color-segment').forEach(segment => segment.remove());

        if (entries.length === 0) {
            dayElement.style.backgroundColor = '#f9f9f9'; // Default background
            return;
        }

        dayElement.classList.add(`color-${Math.min(entries.length, 8)}`); // Add class for styling logic, capped at 8 for pre-defined CSS

        // Create and append color segments
        entries.forEach((entry, index) => {
            if (index < 8) { // Only apply colors up to 8 for now, as per CSS
                const segment = document.createElement('div');
                segment.classList.add('color-segment');
                segment.style.backgroundColor = entry.color;
                // The positioning and sizing for each segment are handled by CSS classes (.color-1, .color-2, etc.)
                dayElement.appendChild(segment);
            }
        });
        
        // Bring day number to front
        const dayNumberDiv = dayElement.querySelector('.day-number');
        if (dayNumberDiv) {
            dayElement.appendChild(dayNumberDiv); // Re-append to ensure it's on top
        }
    }


    // Event Listeners
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    saveEntryBtn.addEventListener('click', saveEntry);

    // Initial render
    renderCalendar();
});
