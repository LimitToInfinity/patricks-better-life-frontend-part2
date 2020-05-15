const baseURL = "https://patricks-better-life-backend.herokuapp.com";
const eventsURL = `${baseURL}/events`;

const eventForm = document.querySelector(".event-form");
const eventFormReset = document.querySelector("#event-form-reset");

fetch(eventsURL)
    .then(parseJSON)
    .then(displayEvents)

eventForm.addEventListener("submit", createOrUpdateEvent);
eventFormReset.addEventListener("click", resetEventForm);

function createOrUpdateEvent(event) {
    event.preventDefault();
    
    const eventFormData = new FormData(event.target);
    const name = eventFormData.get("name");
    const description = eventFormData.get("description");

    const eventBody = {
        event: {
            name: name,
            description: description
        }
    }

    const fetchURL = `${eventsURL}/${event.target.dataset.eventId}`;

    fetch(fetchURL, {
        method: event.target.dataset.method,
        headers: {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify(eventBody)
    }).then(parseJSON)
        .then(result => {
            if (event.target.dataset.method === "PATCH") {
                updateEventDisplay(name, description);
            } else if (event.target.dataset.method === "POST") {
                displayEvent(result.data.attributes.name, result.data.attributes.description, result.data.id)
            }
            resetEventForm();
        })
}

function resetEventForm() {
    eventForm.reset();
    eventForm.dataset.method = "POST";
    eventForm.dataset.eventId = "";
}

function updateEventDisplay(name, description) {
    const allEventCards = Array.from( document.querySelectorAll(".event-card") );

    const updatedEventCard = allEventCards.find(eventCard => {
        return eventCard.dataset.eventId === eventForm.dataset.eventId
    });

    const eventName = updatedEventCard.querySelector(".event-name");
    const eventDescription = updatedEventCard.querySelector(".event-description");

    eventName.textContent = name;
    eventDescription.textContent = description;
}

function displayEvents(result) {
    const events = result.data;

    events.forEach(event => {
        displayEvent(event.attributes.name, event.attributes.description, event.id);
    })
}

function displayEvent(name, description, id) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");
    eventCard.dataset.eventId = id;
    
    const eventName = document.createElement("h2");
    eventName.textContent = name;
    eventName.classList.add("event-name");
    // eventName.className = "event-name";
    
    const eventDescription = document.createElement("p");
    eventDescription.textContent = description;
    eventDescription.classList.add("event-description");
    
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update!"
    updateButton.addEventListener("click", updateEvent);

    eventCard.append(eventName, eventDescription, updateButton);
    document.body.append(eventCard);
}

function updateEvent(event) {
    const eventCard = event.target.parentNode;
    const eventId = eventCard.dataset.eventId;
    const eventName = eventCard.querySelector(".event-name");
    const eventDescription = eventCard.querySelector(".event-description");

    eventForm.dataset.eventId = eventId;
    eventForm.dataset.method = "PATCH";

    const nameInput = eventForm.querySelector("input[name='name']");
    const descriptionInput = eventForm.querySelector("input[name='description']");


    nameInput.value = eventName.textContent;
    descriptionInput.value = eventDescription.textContent;
}

function parseJSON(response) {
    return response.json();
}