console.log('start');

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const productId = urlParams.get('id');

console.log('Getting product ' + productId);
console.log(getProduct());


async function getProduct(){
  let url = 'http://localhost:8080/rest/products/' + productId;
  try {
    let res = await  fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
