const BACKEND_URL = "http://localhost:5050";

function logAction(action, details) {
    const logs = JSON.parse(localStorage.getItem("deviceLogs")) || [];
    const timestamp = new Date().toISOString();

    logs.push({
        action,
        details,
        timestamp
    });

    localStorage.setItem("deviceLogs", JSON.stringify(logs));
}

async function fetchDevices() {
    const response = await fetch(`${BACKEND_URL}/record`);
    const devices = await response.json();
    const tableBody = document.getElementById("deviceTableBody");
    tableBody.innerHTML = "";
    
    const deviceTypes = [
        "Smart Watch",
        "Smart Bulb",
        "LED Strip",
        "Smart Switch",
        "Smart Camera",
        "Motion Sensor",
        "Door/Window Sensor",
        "Video Doorbell",
        "Smart Lock",
        "Thermostat",
        "Air Purifier",
        "Humidifier",
        "Smart Plug",
        "Smart Refrigerator",
        "Smart Washer",
        "Robot Vacuum",
        "Smart Speaker",
        "Smart TV",
        "Curtain Controller",
        "Air Quality Sensor",
        "Leak Detector",
        "Smart Hub",
        "Smart Garden Light",
        "Smart Sprinkler",
        "Smart Lawn Mower",
        "Gaming Controller"
    ];    

    devices.forEach(device => {
        const isChecked = device.statutAppareil === "active"; 
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="text-center align-middle"><input value="${device.nomAppareil}" onchange="updateDevice('${device._id}', 'nomAppareil', this.value)" /></td>
            <td class="text-center align-middle">
                <select onchange="updateDevice('${device._id}', 'typeAppareil', this.value)">
                    ${deviceTypes.map(type => `
                        <option value="${type}" ${type === device.typeAppareil ? "selected" : ""}>${type}</option>
                    `).join("")}
                </select>
            </td>
            <td class="text-center align-middle">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="toggle-${device._id}" ${isChecked ? "checked" : ""} 
                        onchange="toggleDeviceStatus('${device._id}', this.checked)" />
                    <label class="form-check-label" for="toggle-${device._id}">
                        ${isChecked ? "Active" : "Inactive"}
                    </label>
                </div>
            </td>
            <td class="text-center align-middle"><button onclick="deleteDevice('${device._id}')">Delete</button></td>
            <td>
                <div class="form-check form-switch">
                    <input 
                        type="checkbox" 
                        class="form-check-input" 
                        id="scheduleToggle-${device._id}" 
                        onchange="toggleSchedule('${device._id}', this.checked)" 
                    />
                    <label class="form-check-label" for="scheduleToggle-${device._id}">Schedule</label>
                </div>
                <div id="scheduleInputs-${device._id}" style="display: none; margin-top: 10px;">
                    <input 
                        type="date" 
                        id="scheduleDate-${device._id}" 
                        class="form-control mb-1" 
                        placeholder="Date" 
                    />
                    <input 
                        type="time" 
                        id="scheduleTime-${device._id}" 
                        class="form-control" 
                        placeholder="Time" 
                    />
                    <button 
                        class="btn btn-outline-success mt-2" 
                        onclick="setSchedule('${device._id}')">
                        Save Schedule
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


async function addDevice() {
    const nomAppareil = document.getElementById("addNom").value;
    const typeAppareil = document.getElementById("addType").value;
    const statutAppareil = document.getElementById("addStatut").value;

    await fetch(`${BACKEND_URL}/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomAppareil, typeAppareil, statutAppareil }),
    });

    logAction("Add Device", { nomAppareil, typeAppareil, statutAppareil });

    fetchDevices(); 
    closeAddModal(); 
}

async function updateDevice(id, field, value) {
    await fetch(`${BACKEND_URL}/record/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
    });

    logAction("Update Device", { id, field, newValue: value });
}

async function deleteDevice(id) {
    await fetch(`${BACKEND_URL}/record/${id}`, { method: "DELETE" });
    logAction("Delete Device", { id });
    fetchDevices(); 
}

function openAddModal() {
    window.open('addDeviceModal.html', 'Add Device', 'width=500,height=600');
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

async function addDeviceFromPopup(nomAppareil, typeAppareil, statutAppareil) {
    await fetch(`${BACKEND_URL}/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomAppareil, typeAppareil, statutAppareil }),
    });

    logAction("Add Device", { nomAppareil, typeAppareil, statutAppareil });

    fetchDevices();  
}

function searchDevices() {
    applyFilters();
}

function filterByStatus(status) {
    currentStatusFilter = status;
    applyFilters();
}

function filterByType() {
    currentTypeFilter = document.getElementById("filterByType").value;
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#deviceTableBody tr");
    rows.forEach(row => {
        const deviceName = row.children[0].querySelector("input").value.toLowerCase();
        row.style.display = deviceName.includes(searchTerm) ? "" : "none";
    });
}

async function toggleDeviceStatus(id, isActive) {
    const newStatus = isActive ? "active" : "inactive";

    try {
        const row = document.querySelector(`#toggle-${id}`).closest("tr");
        const deviceName = row.children[0].querySelector("input").value;

        await fetch(`${BACKEND_URL}/record/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statutAppareil: newStatus }),
        });

        logAction("Toggle Status", { id, deviceName, newStatus });

        fetchDevices();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'appareil:", error);
        alert("Échec de la mise à jour du statut. Veuillez réessayer.");
    }
}

function filterByStatus(status) {
    const rows = document.querySelectorAll("#deviceTableBody > tr");
    rows.forEach(row => {
        const isChecked = row.querySelector(".form-check-input").checked;
        const deviceStatus = isChecked ? "active" : "inactive";
        row.style.display = (status === 'all' || deviceStatus === status) ? "" : "none";
    });
}

function filterByType() {
    const selectedType = document.getElementById("filterByType").value;
    const rows = document.querySelectorAll("#deviceTableBody > tr");

    rows.forEach(row => {
        const deviceType = row.querySelector("select").value; 
        row.style.display = (selectedType === 'all' || deviceType === selectedType) ? "" : "none";
    });
}

function logDeviceStatus(deviceId, deviceName, newStatus) {
    const logs = JSON.parse(localStorage.getItem("deviceLogs")) || [];
    const timestamp = new Date().toISOString();

    logs.push({
        id: deviceId,
        name: deviceName,
        status: newStatus,
        timestamp: timestamp
    });

    localStorage.setItem("deviceLogs", JSON.stringify(logs));
}

function showLogsInNewWindow() {
    const logs = JSON.parse(localStorage.getItem("deviceLogs")) || [];
    const logWindow = window.open("", "_blank", "width=800,height=600");

    logWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Device Logs</title>
            <style>
                body {
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    font-family: Consolas, 'Courier New', monospace;
                    margin: 20px;
                }
                h1 {
                    color: #ffffff;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #333;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #2d2d2d;
                    color: #ffffff;
                }
                tr:nth-child(even) {
                    background-color: #2e2e2e;
                }
                tr:nth-child(odd) {
                    background-color: #1e1e1e;
                }
                /* Scrollbar Styling */
                ::-webkit-scrollbar {
                    width: 12px;
                }
                ::-webkit-scrollbar-track {
                    background: #1e1e1e;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #555;
                    border-radius: 6px;
                    border: 3px solid #1e1e1e;
                }
            </style>
        </head>
        <body>
            <h1>Device Logs</h1>
            <table>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => `
                        <tr>
                            <td>${log.action}</td>
                            <td>${JSON.stringify(log.details)}</td>
                            <td>${new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </body>
        </html>
    `);

    logWindow.document.close(); 
}

function toggleSchedule(deviceId, isChecked) {
    const inputsContainer = document.getElementById(`scheduleInputs-${deviceId}`);
    inputsContainer.style.display = isChecked ? 'block' : 'none';
}

function setSchedule(deviceId) {
    const date = document.getElementById(`scheduleDate-${deviceId}`).value;
    const time = document.getElementById(`scheduleTime-${deviceId}`).value;

    if (!date || !time) {
        alert("Please select both date and time for scheduling.");
        return;
    }

    const scheduleTime = new Date(`${date}T${time}`);
    const currentTime = new Date();

    if (scheduleTime <= currentTime) {
        alert("Scheduled time must be in the future.");
        return;
    }

    localStorage.setItem(`schedule-${deviceId}`, scheduleTime.toISOString());
    logAction("Set Schedule", { deviceId, scheduleTime: scheduleTime.toISOString() });

    const timeDifference = scheduleTime - currentTime;
    setTimeout(() => toggleDeviceStatus(deviceId, !document.getElementById(`toggle-${deviceId}`).checked), timeDifference);

    alert("Schedule set successfully.");
}


function openBluetoothModal() {
    const bluetoothModal = new bootstrap.Modal(document.getElementById('bluetoothModal'));
    bluetoothModal.show();
}


async function discoverBluetoothDevices() {
    const deviceList = document.getElementById('bluetoothDeviceList');
    deviceList.innerHTML = ''; 

    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });

        addDeviceToList(device);
    } catch (error) {
        console.error('Bluetooth discovery failed:', error);
        alert('Bluetooth discovery failed. Please ensure your device supports Web Bluetooth and try again.');
    }
}

/**
 * 
 * @param {BluetoothDevice} device 
 */
function addDeviceToList(device) {
    const deviceList = document.getElementById('bluetoothDeviceList');

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = `${device.name || 'Unnamed Device'} (${device.id})`;

    const addButton = document.createElement('button');
    addButton.className = 'btn btn-sm btn-success';
    addButton.textContent = 'Connect & Add';
    addButton.onclick = () => connectAndAddDevice(device);

    listItem.appendChild(addButton);
    deviceList.appendChild(listItem);
}

/**
 * 
 * @param {BluetoothDevice} device 
 */
async function connectAndAddDevice(device) {
    try {
        const server = await device.gatt.connect();
        console.log(`Connected to ${device.name}`);
        const nomAppareil = device.name || `Device-${device.id}`;
        const typeAppareil = 'Bluetooth Device'; 
        const statutAppareil = 'active'; 

        await fetch(`${BACKEND_URL}/record`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomAppareil, typeAppareil, statutAppareil }),
        });

        logAction("Add Device via Bluetooth", { nomAppareil, typeAppareil, statutAppareil });

        fetchDevices(); 
        closeBluetoothModal(); 
        alert(`Device "${nomAppareil}" added successfully.`);
    } catch (error) {
        console.error('Failed to connect or add device:', error);
        alert('Failed to connect or add the Bluetooth device. Please try again.');
    }
}


function closeBluetoothModal() {
    const bluetoothModalElement = document.getElementById('bluetoothModal');
    const bluetoothModal = bootstrap.Modal.getInstance(bluetoothModalElement);
    bluetoothModal.hide();
}


window.openBluetoothModal = openBluetoothModal;
window.discoverBluetoothDevices = discoverBluetoothDevices;
window.connectAndAddDevice = connectAndAddDevice;
window.closeBluetoothModal = closeBluetoothModal;

document.addEventListener("DOMContentLoaded", fetchDevices);

