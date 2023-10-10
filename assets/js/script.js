const API_KEY = "-VsZptLAKzl50hNBCHwZMygODrk";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") { // if is equal to options
            optArray.push(e[1]);
            // then we're going to push the second value in each entry into my temporary array
        }
    }

    form.delete("options"); // delete all occurrences of options in our form data

    form.append("options", optArray.join()); // append back a comma separated string of options to the form 

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    /*The variable "e" in the loop is not the same "e" event 
    object that we pass into the function. To test if API is working : 
    for (let e of form.entries()) {
       console.log(e);
    }
    */

    /*for (let entry of form.entries()) {
        console.log(entry); // > Console : ['options', 'es6,es8,harsh,jquery,relax,strict'] to test processOptions(form)
    }*/

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        /* to send form to the API add into the request, 
        to attached it as body of the request: */
        body: form,
    });

    // convert the response to json and display it : 
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }

}

async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }

}

function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    // display the modal : 
    resultsModal.show();
}

function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

}


