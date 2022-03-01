// initial values

const phoneContainer = document.querySelector('#phone-container');
const phoneDetailContainer = document.querySelector('#phone-detail-container');
const errorMessage = document.querySelector('#error-message');
const searchField = document.querySelector('#search-input');
const spinner = document.getElementById('spinner');

// show and hide spinner functions
const showSpinner = () => {
	spinner.classList.remove('d-none');
};

const hideSpinner = () => {
	spinner.classList.add('d-none');
};

// displaying all the phone searching by user function
const getUserPhones = async () => {
	try {
		const userSearchText = searchField.value.toLocaleLowerCase();
		if (userSearchText === '') {
			phoneContainer.textContent = '';
			errorMessage.textContent = `Please provide correct phone name`;
			errorMessage.classList.remove('d-none');
		} else {
			showSpinner();
			errorMessage.classList.add('d-none');
			const phoneUrl = `https://openapi.programming-hero.com/api/phones?search=${userSearchText}`;
			const response = await fetch(phoneUrl);
			const data = await response.json();
			displayUserPhone(data.data);
			searchField.value = '';
			hideSpinner();
		}
	} catch (error) {
		console.log(error);
	}
};

const displayUserPhone = (phoneData) => {
	if (phoneData.length === 0) {
		phoneContainer.textContent = '';
		errorMessage.textContent = `Result not found!! try again..`;
		errorMessage.classList.remove('d-none');
	} else {
		phoneContainer.textContent = '';
		phoneDetailContainer.textContent = '';
		errorMessage.classList.add('d-none');
		phoneData.slice(0, 20).forEach((phone) => {
			generatePhoneHTML(phone);
		});
	}
};

const generatePhoneHTML = ({ brand, image, phone_name, slug }) => {
	const div = document.createElement('div');
	div.classList.add('col');
	div.innerHTML = `
            <div class="card border-success border-bottom border-3 border-0 rounded">
            <div class="d-flex justify-content-center">
                <img src="${image}" class="card-img-top w-50 p-3" alt="phone image" />
            </div>
            <div class="card-body">
                <h5 class="card-title text-success">${phone_name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"></li>
                    <li class="list-group-item">Brand: ${brand}</li>
                    <li class="list-group-item">Slug: ${slug}</li>
                    <li class="list-group-item"></li>
                </ul>
                <div class="d-flex align-items-center justify-content-center">
                    <a id="btn-search" onclick="loadPhoneDetail('${slug}')" class="btn btn-success text-uppercase px-4">Details</a>
                </div>
            </div>
        </div>`;
	phoneContainer.appendChild(div);
};
