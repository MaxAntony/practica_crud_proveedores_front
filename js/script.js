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

  document
    .querySelector('#editProviderForm')
    .addEventListener('submit', updateProvider);
}

function clickOnDocument(e) {
  if (e.target.classList.contains('btnDelete-provider')) {
    deleteProvider(e.target);
  }
  if (e.target.classList.contains('btnEditProvider')) {
    showModalUpdateProvider(e.target);
  }
  // if (e.target.getAttribute('id') === 'btnUpdateProvider') {
  //   updateProvider(e.target);
  // }
}

async function getProviders() {
  try {
    const prom = await fetch('https://providercrud.herokuapp.com/');
    const providers = await prom.json();
    // let child = providersList.lastElementChild;
    // while (child) {
    //   providersList.removeChild(child);
    //   child = providersList.lastElementChild;
    // }
    // refactor, delete all children
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
    getProviders();
  } catch (e) {
    console.log(e);
  }
}

function appendProvidersToList(providers) {
  providers.forEach(provider => {
    // let li = document.createElement('li');
    // let img = document.createElement('img');
    // let btnDelete = document.createElement('button');
    // btnDelete.innerText = 'eliminar';
    // btnDelete.classList.add('btnDelete-provider');
    // img.src = provider.photo.imageURL;
    // img.classList.add('providerImage');
    // li.classList.add('list-group-item');
    // li.setAttribute('provider-id', provider._id);
    // li.innerText = `${provider.firstName}`;
    // li.appendChild(img);
    // li.appendChild(btnDelete);
    let card = document.createElement('div');
    card.innerHTML = `<div class="col-6">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="${provider.photo.imageURL}" alt="${provider.firstName}" />
      <div class="card-body">
        <h5 class="card-title">${provider.firstName} ${provider.lastName}</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${provider.dni}</li>
      </ul>
      <div class="card-body">
        <button provider-id="${provider._id}" class="btnDelete-provider btn btn-primary mr-3">
          Eliminar</button
        ><button
          provider-id="${provider._id}"
          type="button"
          class="btn btn-primary btnEditProvider"
          data-toggle="modal"
          data-target="#editProviderModal"
        >
          Editar
        </button>
      </div>
    </div>
  </div>`;
    providersList.appendChild(card);
  });
}

async function deleteProvider(btn) {
  let providerId = btn.attributes[0].value;
  let col = btn.parentElement.parentElement.parentElement;
  try {
    const res = await fetch(
      `https://providercrud.herokuapp.com/${providerId}`,
      {
        method: 'DELETE',
      },
    );
    console.log(res);
    col.remove();
  } catch (e) {
    console.log(e);
  }
}

async function updateProvider(e) {
  e.preventDefault();
  // console.log(e.parentElement);
  let form = e.target;
  const providerId = form.children[5].getAttribute('provider-id');
  const formData = new FormData();
  formData.append('firstName', form[0].value);
  formData.append('lastName', form[1].value);
  formData.append('dni', form[2].value);
  formData.append('photo', form[3].files[0]);
  console.log(form[3].files[0]);
  try {
    const res = await fetch(
      `https://providercrud.herokuapp.com/${providerId}`,
      {
        method: 'PUT',
        body: formData,
      },
    );
    console.log(res);
    document.querySelector('#close-modal').click();
    getProviders();
  } catch (e) {
    console.log(e);
  }
}

async function showModalUpdateProvider(btnEdit) {
  const providerId = btnEdit.attributes[0].value;
  try {
    const res = await fetch(
      `https://providercrud.herokuapp.com/${providerId}`,
      {
        method: 'GET',
      },
    );
    const provider = await res.json();
    let editProviderForm = document.querySelector('#editProviderForm');
    editProviderForm.reset();
    editProviderForm[0].value = provider.firstName;
    editProviderForm[1].value = provider.lastName;
    editProviderForm[2].value = provider.dni;
    editProviderForm.children[3].children[2].setAttribute(
      'src',
      provider.photo.imageURL,
    );
    document
      .querySelector('#btnUpdateProvider')
      .setAttribute('provider-id', provider._id);
  } catch (e) {
    console.log(e);
  }
}
