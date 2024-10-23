let studentOrder = [];
let roster = [];
let sectionId;
let assignmentGrades = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    sectionId = urlParams.get('id');
    document.getElementById('sectionTitle').textContent = `Section ${sectionId}`;

    loadStudentOrder();
    loadRoster();
    loadAssignmentGrades();
    showUploadStudentList();
});

function showUploadStudentList() {
    hideAllSections();
    document.getElementById('uploadStudentList').style.display = 'block';
}

function showUploadRoster() {
    hideAllSections();
    document.getElementById('uploadRoster').style.display = 'block';
}

function showUploadAssignmentGrade() {
    hideAllSections();
    document.getElementById('uploadAssignmentGrade').style.display = 'block';
}

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
}

function loadStudentOrder() {
    const storedOrder = localStorage.getItem(`section${sectionId}StudentOrder`);
    if (storedOrder) {
        studentOrder = JSON.parse(storedOrder);
        displayStudentList();
    }
}

function loadRoster() {
    const storedRoster = localStorage.getItem(`section${sectionId}Roster`);
    if (storedRoster) {
        roster = JSON.parse(storedRoster);
        displayRoster();
    }
}

function saveStudentOrder() {
    localStorage.setItem(`section${sectionId}StudentOrder`, JSON.stringify(studentOrder));
}

function saveRoster() {
    localStorage.setItem(`section${sectionId}Roster`, JSON.stringify(roster));
}

function saveAssignmentGrades() {
    localStorage.setItem(`section${sectionId}AssignmentGrades`, JSON.stringify(assignmentGrades));
}

function uploadStudentList() {
    const file = document.getElementById('studentListUpload').files[0];
    if (file) {
        processFile(file, (jsonData) => {
            studentOrder = jsonData.map(row => ({
                id: row['SIS User ID'],
                name: row['Student']
            }));
            saveStudentOrder();
            displayUploadedStudentList(jsonData);
            alert('Student list uploaded successfully!');
        });
    }
}

function uploadRoster() {
    const file = document.getElementById('rosterUpload').files[0];
    if (file) {
        processFile(file, (jsonData) => {
            roster = jsonData.map(row => ({
                firstName: row['First Name'],
                lastName: row['Last Name'],
                soonerId: row['Sooner ID'],
                email: row['Email'].toLowerCase()
            }));
            saveRoster();
            displayUploadedRoster(jsonData);
            alert('Roster uploaded successfully!');
        });
    }
}

function uploadAssignmentGrade(button) {
    const fileInput = button.previousElementSibling;
    const file = fileInput.files[0];
    if (file) {
        processFile(file, (jsonData) => {
            const processedData = jsonData.map(row => ({
                ...row,
                'Grade': (row['Grade'] && row['Grade'].toString().toLowerCase() === 'n/a') ? 0 : row['Grade'],
                'Email': row['Email'].toLowerCase()
            }));
            assignmentGrades.push(processedData);
            saveAssignmentGrades();
            displayUploadedAssignmentGrade(file.name, processedData);
            alert('Assignment grade uploaded successfully!');
        });
    }
}

function processFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        callback(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function displayStudentList() {
    const studentListElement = document.getElementById('studentListContent');
    studentListElement.innerHTML = '<h3>Current Student List</h3>';
    if (studentOrder.length > 0) {
        const table = createTable(['S.No.', 'Student', 'SIS User ID'], studentOrder.map((student, index) => [index + 1, student.name, student.id]));
        studentListElement.appendChild(table);
    } else {
        studentListElement.innerHTML += '<p>No students uploaded yet.</p>';
    }
}

function displayRoster() {
    const rosterElement = document.getElementById('rosterContent');
    rosterElement.innerHTML = '<h3>Current Roster</h3>';
    if (roster.length > 0) {
        const table = createTable(['S.No.', 'First Name', 'Last Name', 'Sooner ID', 'Email'], 
            roster.map((student, index) => [index + 1, student.firstName, student.lastName, student.soonerId, student.email]));
        rosterElement.appendChild(table);
    } else {
        rosterElement.innerHTML += '<p>No roster uploaded yet.</p>';
    }
}

function displayUploadedStudentList(data) {
    const uploadedDataElement = document.getElementById('studentListContent');
    uploadedDataElement.innerHTML = '<h3>Uploaded Student List</h3>';
    const table = createTable(['S.No.', 'Student', 'SIS User ID'], 
        data.map((row, index) => [index + 1, row['Student'], row['SIS User ID']]));
    uploadedDataElement.appendChild(table);
}

function displayUploadedRoster(data) {
    const uploadedDataElement = document.getElementById('rosterContent');
    uploadedDataElement.innerHTML = '<h3>Uploaded Roster</h3>';
    const table = createTable(['S.No.', 'First Name', 'Last Name', 'Sooner ID', 'Email'], 
        data.map((row, index) => [index + 1, row['First Name'], row['Last Name'], row['Sooner ID'], row['Email']]));
    uploadedDataElement.appendChild(table);
}

function displayUploadedAssignmentGrade(fileName, data) {
    const uploadedDataElement = document.getElementById('assignmentGradeContent');
    uploadedDataElement.innerHTML += `<h3>Uploaded Assignment Grade: ${fileName}</h3>`;
    const table = createTable(['S.No.', 'First Name', 'Email', 'Grade'], 
        data.map((row, index) => [
            index + 1, 
            row['First Name'], 
            row['Email'], 
            row['Grade'] // This will now be 0 instead of 'n/a'
        ]));
    uploadedDataElement.appendChild(table);
}

function createTable(headers, data) {
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Create header row
    const headerRow = table.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Create data rows
    data.forEach(rowData => {
        const row = table.insertRow();
        rowData.forEach(cellData => {
            const cell = row.insertCell();
            cell.textContent = cellData;
        });
    });

    return table;
}

function addNewAssignmentUpload() {
    const assignmentUploads = document.getElementById('assignmentUploads');
    const newUpload = document.createElement('div');
    newUpload.className = 'assignment-upload';
    newUpload.innerHTML = `
        <input type="file" accept=".csv, .xlsx">
        <button onclick="uploadAssignmentGrade(this)">Upload</button>
    `;
    assignmentUploads.appendChild(newUpload);
}

function showProcessData() {
    hideAllSections();
    document.getElementById('processData').style.display = 'block';
}

function processAndDisplayData() {
    console.log("Starting data processing...");

    if (!roster || !roster.length) {
        console.error("Roster is empty or undefined");
        alert("Please upload the roster before processing.");
        return;
    }

    if (!assignmentGrades || !assignmentGrades.length || !assignmentGrades[assignmentGrades.length - 1].length) {
        console.error("Assignment grades are empty or undefined");
        alert("Please upload assignment grades before processing.");
        return;
    }

    if (!studentOrder || !studentOrder.length) {
        console.error("Student list is empty or undefined");
        alert("Please upload the student list before processing.");
        return;
    }

    // Step 1: Inner join roster with assignment grades on 'Email'
    let joinedData = roster.map(rosterEntry => {
        if (!rosterEntry.email) {
            console.warn("Roster entry missing email:", rosterEntry);
            return null;
        }

        const gradeEntry = assignmentGrades[assignmentGrades.length - 1].find(gradeRow => 
            gradeRow.Email && gradeRow.Email.trim().toLowerCase() === rosterEntry.email.trim().toLowerCase()
        );

        if (gradeEntry) {
            return {
                firstName: rosterEntry.firstName || 'Unknown',
                lastName: rosterEntry.lastName || 'Unknown',
                email: rosterEntry.email,
                soonerId: rosterEntry.soonerId,
                grade: gradeEntry.Grade ? (parseFloat(gradeEntry.Grade) * 10).toFixed(2) : 'N/A'
            };
        }
        return null;
    }).filter(entry => entry !== null);

    // Step 2: Join the result with the student list on 'Sooner ID' and 'SIS User ID'
    let finalData = joinedData.map(joinedEntry => {
        const studentEntry = studentOrder.find(student => student.id === joinedEntry.soonerId);
        if (studentEntry) {
            return {
                sisUserId: studentEntry.id,
                studentName: studentEntry.name,
                firstName: joinedEntry.firstName,
                lastName: joinedEntry.lastName,
                email: joinedEntry.email,
                grade: joinedEntry.grade
            };
        }
        return null;
    }).filter(entry => entry !== null);

    console.log("Final Processed Data:", finalData);

    if (finalData.length === 0) {
        console.warn("No matching data found after processing");
        alert("No matching data found after processing. Please check your input files.");
        return;
    }

    // Display the processed data
    displayProcessedData(finalData);
}

function displayProcessedData(data) {
    const processedDataElement = document.getElementById('processedDataContent');
    processedDataElement.innerHTML = '<h3>Processed Data</h3>';
    const table = createTable(['S.No.', 'SIS User ID', 'Student Name', 'First Name', 'Last Name', 'Email', 'Grade'], 
        data.map((row, index) => [
            index + 1, 
            row.sisUserId,
            row.studentName,
            row.firstName,
            row.lastName,
            row.email,
            row.grade
        ]));
    processedDataElement.appendChild(table);
}

function loadAssignmentGrades() {
    const storedGrades = localStorage.getItem(`section${sectionId}AssignmentGrades`);
    if (storedGrades) {
        assignmentGrades = JSON.parse(storedGrades);
        // Optionally, you can display the loaded grades here
    }
}
