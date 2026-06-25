const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
	document.body.setAttribute('data-theme', savedTheme);
	if (savedTheme==='dark') {
		themeToggle.textContent = "Light Mode";
	} else {
		themeToggle.textContent = "Dark Mode";
	}
} else {
	document.body.setAttribute('data-theme', 'light');
	themeToggle.textContent = ") Dark Mode";
}

themeToggle.addEventListener('click', () => {
	const currTheme = document.body.getAttribute('data-theme');
	let newTheme = 'light';
	if (currTheme==='light') {
		newTheme = 'dark';
		themeToggle.textContent = "Light Mode";
	} else {
		newTheme = 'dark';
		themeToggle.textContent = "Dark Mode";
		newTheme = 'light';
	}

	document.body.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
});
