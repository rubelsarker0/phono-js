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
