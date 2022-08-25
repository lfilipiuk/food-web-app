loadProducts();

var selectedRow = null;

//Show Alerts
function showAlert(message, className){
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;

  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const main = document.querySelector(".main");
  container.insertBefore(div, main);

  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

//Clear all Fields
function clearFields(){
  document.querySelector("#productId").value = "";
  document.querySelector("#name").value = "";
  document.querySelector("#calories").value = "";
  document.querySelector("#carbohydrates").value = "";
  document.querySelector("#sugars").value = "";
  document.querySelector("#protein").value = "";
  document.querySelector("#fat").value = "";
}

//Add Data
document.querySelector("#product-form").addEventListener("submit", (e) => {
  e.preventDefault();

  //Get Form Values
  const productId = document.querySelector("#productId").value;
  const name = document.querySelector("#name").value;
  const calories = document.querySelector("#calories").value;
  const carbohydrates = document.querySelector("#carbohydrates").value;
  const sugars = document.querySelector("#sugars").value;
  const protein = document.querySelector("#protein").value;
  const fat = document.querySelector("#fat").value;

  if(name == "" || calories == "" || carbohydrates == "" || sugars == "" ||
    protein == "" || fat == ""){
      showAlert("Please fill in all fields", "danger");
  }else{
    //ADD OR EDIT PRODUCT
    const product = {};
    product.name = name;
    product.calories = calories;
    product.carbohydrates = carbohydrates;
    product.sugars = sugars;
    product.protein = protein;
    product.fat = fat;

    if(selectedRow = null){
      //ADD NEW PRODUCT HERE
        fetch("http://localhost:8080/rest/products", {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(product)
        }).then(res => {
              showAlert("Product Added", "success");
              window.location.reload();
        });
    }else{
      selectedRow = null;

      fetch("http://localhost:8080/rest/products/" + productId, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(product)
      }).then(res => {
        showAlert("Product Edited", "success");
        window.location.reload();
      });

    }
  }
})

//Edit Data
document.querySelector("#product-list").addEventListener("click",
  (e) =>
  {
    e.preventDefault();
    target = e.target;

    if(target.classList.contains("edit")){
      selectedRow = target.parentElement.parentElement;
      document.querySelector("#productId").value = target.target;
      document.querySelector("#name").value = selectedRow.children[0].textContent;
      document.querySelector("#calories").value = selectedRow.children[1].textContent;
      document.querySelector("#carbohydrates").value = selectedRow.children[2].textContent;
      document.querySelector("#sugars").value = selectedRow.children[3].textContent;
      document.querySelector("#protein").value = selectedRow.children[4].textContent;
      document.querySelector("#fat").value = selectedRow.children[5].textContent;
    }
  })

//Delete Data
document.querySelector("#product-list").addEventListener("click",
  (e) => {
    e.preventDefault()

    target = e.target;

    if(target.classList.contains("delete")){
      const productId = target.target;
      fetch('http://localhost:8080/rest/products/' + productId, { method: 'DELETE' })
        .then(() => {
          showAlert("Product Data Deleted", "danger");
          window.location.reload();
        });
    }
  });

async function getUsers(){
  let url = 'http://localhost:8080/rest/products';
  try {
    let res = await  fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function loadProducts(){
  let products = await getUsers();
  const table = document.getElementById("productTable")
  const tableBody = table.querySelector("tbody");

  //Clear the table
  tableBody.innerHTML = "<tr></tr>";

  //Populate the rows
  for(const product of products._embedded.productList){
    const rowElement = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;
    rowElement.appendChild(nameCell);

    const caloriesCell = document.createElement("td");
    caloriesCell.textContent = product.calories;
    rowElement.appendChild(caloriesCell);

    const carbsCell = document.createElement("td");
    carbsCell.textContent = product.carbohydrates;
    rowElement.appendChild(carbsCell);

    const sugarsCell = document.createElement("td");
    sugarsCell.textContent = product.sugars;
    rowElement.appendChild(sugarsCell);

    const proteinCell = document.createElement("td");
    proteinCell.textContent = product.protein;
    rowElement.appendChild(proteinCell);

    const fatCell = document.createElement("td");
    fatCell.textContent = product.fat;
    rowElement.appendChild(fatCell);

    const linkCell = document.createElement("td");
    const a1 = document.createElement('a');
    a1.href = "#";
    a1.classList = "btn btn-outline-light btn-sm edit";
    a1.textContent = "Edit";
    a1.target = product.id;
    linkCell.appendChild(a1);
    rowElement.appendChild(linkCell);

    const deleteCell = document.createElement("td");
    const a2 = document.createElement('a');
    a2.href = "#";
    a2.classList = "btn btn-outline-danger btn-sm delete";
    a2.textContent = "Delete";
    a2.target = product.id;
    deleteCell.appendChild(a2);
    rowElement.appendChild(deleteCell);

    tableBody.appendChild(rowElement);
  }
}

