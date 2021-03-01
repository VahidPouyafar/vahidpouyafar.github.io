const table = document.querySelector("table");
const ajaxBtn = document.getElementById("ajax");
const fetchBtn = document.getElementById("fetch");
const requestURL = "https://jsonplaceholder.typicode.com/usersx";

ajaxBtn.addEventListener("click", getDataAjax);
fetchBtn.addEventListener("click", getDataFetch);

function getDataAjax() {
  try {
    let xhr;

    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    xhr.open("GET", requestURL, true);
    xhr.send();
  
    xhr.onreadystatechange = function() {
      try {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const users = JSON.parse(xhr.responseText);
          populateTable(users);
        } else if (xhr.readyState === 4 && xhr.status === 404) {
          throw new Error("HTTP Error! Status: " + xhr.status);
        }
      } catch(e) {
        alert("There has been a problem with your fetch operation:\n" + e.message);
      }
    }
  } catch(e) {
    alert("There has been a problem with your fetch operation:\n" + e.message);
  }
}

function getDataFetch() {
  fetch(requestURL).then(response => {
    if (!response.ok) {
      throw new Error("HTTP Error! Status: " + response.status);
    } else {
      return response.json();
    }
  }).then(myArray => {
    populateTable(myArray);
  }).catch(e => {
    alert("There has been a problem with your fetch operation:\n" + e.message);
  });
}

function populateTable(myArray) {
  for (let i = 0; i < myArray.length; ++i) {
    const row = document.createElement("tr");
    for (const property in myArray[i]) {
      const cell = document.createElement("td");
      if (!(property === "address" || property === "company")) {
        switch (property) {
          case "email":
            cell.innerHTML = `<a href="mailto:${myArray[i][property]}">${myArray[i][property]}</a>`;
            break;
          case "phone":
            cell.innerHTML = `<a href="tel:${myArray[i][property]}">${myArray[i][property]}</a>`;
            break;
          case "website":
            cell.innerHTML = `<a href="http://www.${myArray[i][property]}" target="_blank">${myArray[i][property]}</a>`;
            break;
          default:
            cell.textContent = myArray[i][property];
        }
        row.appendChild(cell);
      }
    }
    const more = document.createElement("td");

    const addressBtn = document.createElement("button");
    const companyBtn = document.createElement("button");
    addressBtn.textContent = "Address";
    companyBtn.textContent = "Company";

    addressBtn.addEventListener("click", () => {
      showAddress(myArray, i);
    });

    companyBtn.addEventListener("click", () => {
      showCompany(myArray, i);
    });

    more.appendChild(addressBtn);
    more.appendChild(companyBtn);

    row.appendChild(more);

    table.appendChild(row);
  }
}

function showAddress(array, index) {
  const address = array[index]["address"];
  let text = "\n";
  text += "Street: " + address["street"] + "\n\n";
  text += "Suite: " + address["suite"] + "\n\n";
  text += "City: " + address["city"] + "\n\n";
  text += "Zipcode: " + address["zipcode"] + "\n\n";
  text += "geo: (" + address["geo"]["lat"] + ", " + address["geo"]["lng"] + ")";

  alert(text);
}

function showCompany(array, index) {
  const company = array[index]["company"];
  let text = "\n";
  text += "Name: " + company["name"] + "\n\n";
  text += "Catch Phrase: " + company["catchPhrase"] + "\n\n";
  text += "bs: " + company["bs"];

  alert(text);
}