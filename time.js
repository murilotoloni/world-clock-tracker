/*****************************
 * 1. Load saved timezones
 *****************************/
let timezones = JSON.parse(localStorage.getItem('timezones'))
    || [Intl.DateTimeFormat().resolvedOptions().timeZone];

/*****************************
 * 2. Offset in hours
 *****************************/
let offsetHours = 0;

/*****************************
 * 3. List of timezones
 *****************************/
const allTimezones = Intl.supportedValuesOf
    ? Intl.supportedValuesOf('timeZone')
    : ["America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"];

/*****************************
 * 4. Populate dropdown
 *****************************/
// Create a placeholder option
const selectElement = document.getElementById('timezoneSelect');
const placeholderOption = document.createElement('option');
placeholderOption.value = '';
placeholderOption.textContent = '— Select a Timezone —';
placeholderOption.disabled = true;
placeholderOption.selected = true;
selectElement.appendChild(placeholderOption);

// Fill in the rest
allTimezones.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    option.textContent = tz;
    selectElement.appendChild(option);
});

// Whenever user picks a timezone, automatically add it
selectElement.addEventListener('change', () => {
    const selectedTz = selectElement.value;
    if (selectedTz && !timezones.includes(selectedTz)) {
        timezones.push(selectedTz);
        saveTimezones();
        renderTimezones();
        updateTimes();
    }
    // Reset dropdown back to placeholder (so user can select again)
    selectElement.value = '';
});

/*****************************
 * 5. Render timezone cards
 *****************************/
function renderTimezones() {
    const container = document.getElementById('timezone-container');
    container.innerHTML = '';

    timezones.forEach(tz => {
        const card = document.createElement('div');
        card.classList.add('timezone');

        const label = document.createElement('div');
        label.classList.add('label');
        label.textContent = tz;

        const timeBox = document.createElement('input');
        timeBox.type = 'text';
        timeBox.classList.add('time-box');
        timeBox.readOnly = true;

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-button');
        removeBtn.textContent = 'X';
        removeBtn.addEventListener('click', () => removeTimezone(tz));

        // Append elements
        card.appendChild(removeBtn);
        card.appendChild(label);
        card.appendChild(timeBox);
        container.appendChild(card);
    });
}

/*****************************
 * 6. Update displayed times
 *****************************/
function updateTimes() {
    const now = new Date();
    const offsetMillis = offsetHours * 3600000;
    const offsetDate = new Date(now.getTime() + offsetMillis);

    document.querySelectorAll('.timezone').forEach(zoneCard => {
        const tz = zoneCard.querySelector('.label').textContent;
        const box = zoneCard.querySelector('.time-box');

        box.value = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(offsetDate);
    });
}

/*****************************
 * 7. Remove a timezone
 *****************************/
function removeTimezone(tz) {
    timezones = timezones.filter(item => item !== tz);
    saveTimezones();
    renderTimezones();
    updateTimes();
}

/*****************************
 * 8. Offset controls
 *****************************/
document.getElementById('minusHour').addEventListener('click', () => {
    offsetHours--;
    document.getElementById('offsetLabel').textContent = offsetHours;
    updateTimes();
});

document.getElementById('plusHour').addEventListener('click', () => {
    offsetHours++;
    document.getElementById('offsetLabel').textContent = offsetHours;
    updateTimes();
});

/*****************************
 * 9. Save to localStorage
 *****************************/
function saveTimezones() {
    localStorage.setItem('timezones', JSON.stringify(timezones));
}

/*****************************
 * 10. Initial load
 *****************************/
renderTimezones();
updateTimes();
