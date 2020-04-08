let providersList = document.getElementById('providersList');

eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', getProviders);
  document
    .querySelector('#providerForm')
    .addEventListener('submit', addProvider);
}

//
async function getProviders(e) {
  try {
    const prom = await fetch('https://providercrud.herokuapp.com/');
    const providers = await prom.json();
    console.log(providers);
    providers.forEach(e => {
      appendProvider(e);
    });
  } catch (e) {
    console.log(e);
  }
}

// async function addProvider(provider) {
//   try {
//     let data = new FormData()
//     data.append('photo')
//   } catch (e) {

//   }
// }

async function addProvider(e) {
  e.preventDefault();
  let firstName = e.target.children[0].children[1];
  let lastName = e.target.children[1].children[1];
  let dni = e.target.children[2].children[1];
  let photo = e.target.children[3].children[1];
  console.log(firstName, lastName, dni, photo);
  let data = new FormData();
  data.append('firstName', firstName.value);
  data.append('lastName', lastName.value);
  data.append('dni', dni.value);
  data.append('photo', photo.files[0]);
  console.log(data);
  try {
    const res = await fetch('https://providercrud.herokuapp.com/', {
      method: 'POST',
      body: data,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
  // document.getElementById("providerForm").submit();
}

function appendProvider(provider) {
  let li = document.createElement('li');
  let img = document.createElement('img');
  img.src = provider.photo.imageURL;
  img.classList.add('providerImage');
  li.classList.add('list-group-item');
  li.innerText = `${provider.firstName}`;
  li.appendChild(img);
  providersList.appendChild(li);
}
