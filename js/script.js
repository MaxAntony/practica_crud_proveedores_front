let providersList = document.getElementById('providersList');

eventListeners();
function eventListeners() {
  // web loaded
  document.addEventListener('DOMContentLoaded', getProviders);
  // add new provider
  document
    .querySelector('#providerForm')
    .addEventListener('submit', addProvider);

  //delegator
  document.addEventListener('click', clickOnDocument);
}

async function getProviders(e) {
  e.preventDefault();
  try {
    const prom = await fetch('https://providercrud.herokuapp.com/');
    const providers = await prom.json();
    // let child = providersList.lastElementChild;
    // while (child) {
    //   providersList.removeChild(child);
    //   child = providersList.lastElementChild;
    // } refactor
    while (providersList.lastElementChild) {
      providersList.removeChild(providersList.lastElementChild);
    }
    appendProvidersToList(providers);
  } catch (e) {
    console.log(e);
  }
}

async function addProvider(e) {
  e.preventDefault();
  let firstName = e.target.children[0].children[1];
  let lastName = e.target.children[1].children[1];
  let dni = e.target.children[2].children[1];
  let photo = e.target.children[3].children[1];
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
    e.target.reset();
    getProviders(e);
  } catch (e) {
    console.log(e);
  }
}

function clickOnDocument(e) {
  if (e.target.classList.contains('btnDelete-provider')) {
    deleteProviderFromDOM(e.target.parentElement);
  }
}

function appendProvidersToList(providers) {
  providers.forEach(provider => {
    let li = document.createElement('li');
    let img = document.createElement('img');
    let btnDelete = document.createElement('button');
    btnDelete.innerText = 'eliminar';
    btnDelete.classList.add('btnDelete-provider');
    img.src = provider.photo.imageURL;
    img.classList.add('providerImage');
    li.classList.add('list-group-item');
    li.setAttribute('provider-id', provider._id);
    li.innerText = `${provider.firstName}`;
    li.appendChild(img);
    li.appendChild(btnDelete);
    providersList.appendChild(li);
  });
}

async function deleteProviderFromDOM(providerLi) {
  const providerId = providerLi.attributes[1].value;
  console.log(providerId);
  try {
    const res = await fetch(
      `https://providercrud.herokuapp.com/${providerId}`,
      {
        method: 'DELETE',
      },
    );
    console.log(res);
    providerLi.remove();
  } catch (e) {
    console.log(e);
  }
}
