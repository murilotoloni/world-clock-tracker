/*****************************
 * 1. Load saved timezones
 *****************************/
let timezones = JSON.parse(localStorage.getItem('timezones')) ||
    [Intl.DateTimeFormat().resolvedOptions().timeZone];

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
const selectElement = document.getElementById('timezoneSelect');
const placeholderOption = document.createElement('option');
placeholderOption.value = '';
placeholderOption.textContent = '— Select a Timezone —';
placeholderOption.disabled = true;
placeholderOption.selected = true;
selectElement.appendChild(placeholderOption);

allTimezones.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    option.textContent = tz;
    selectElement.appendChild(option);
});

selectElement.addEventListener('change', () => {
    const selectedTz = selectElement.value;
    if (selectedTz && !timezones.includes(selectedTz)) {
        timezones.push(selectedTz);
        saveTimezones();
        renderTimezones();
        updateTimes();
    }
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

        // Create header container for timezone name and abbreviation
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('header-container');

        const label = document.createElement('span');
        label.classList.add('label');
        label.textContent = tz;

        // Timezone abbreviation display element (will be updated later)
        const tzDisplay = document.createElement('span');
        tzDisplay.classList.add('tz-display');

        headerContainer.appendChild(label);
        headerContainer.appendChild(tzDisplay);

        // Time container for the time display
        const timeContainer = document.createElement('div');
        timeContainer.classList.add('time-container');

        const timeDisplay = document.createElement('span');
        timeDisplay.classList.add('time-display');

        timeContainer.appendChild(timeDisplay);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-button');
        removeBtn.textContent = 'X';
        removeBtn.addEventListener('click', () => removeTimezone(tz));

        // Append elements to card
        card.appendChild(removeBtn);
        card.appendChild(headerContainer);
        card.appendChild(timeContainer);
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
        // Retrieve timezone string from label
        const tz = zoneCard.querySelector('.label').textContent;
        const timeEl = zoneCard.querySelector('.time-display');
        const tzEl = zoneCard.querySelector('.tz-display');

        // Format time without timezone name:
        const timeString = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(offsetDate);

        // Extract timezone abbreviation using formatToParts:
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'short'
        }).formatToParts(offsetDate);
        const tzNamePart = parts.find(part => part.type === "timeZoneName");
        const tzAbbreviation = tzNamePart ? tzNamePart.value : '';

        // Update the elements:
        timeEl.textContent = timeString;
        tzEl.textContent = tzAbbreviation;
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
 * 8. Global Offset Slider control
 *****************************/
const globalSlider = document.getElementById('globalOffsetSlider');
const globalLabel = document.getElementById('globalOffsetLabel');

globalSlider.addEventListener('input', () => {
    offsetHours = parseFloat(globalSlider.value);
    globalLabel.textContent = offsetHours + "h";
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
