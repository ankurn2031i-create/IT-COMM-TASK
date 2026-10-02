const REPORTS_STORAGE_KEY = "iim-bg-lost-found-reports";
const MAX_IMAGE_SIZE = 1024 * 1024;

const form = document.querySelector("#report-form");
const message = document.querySelector("#report-message");

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	message.textContent = "";

	const formData = new FormData(form);
	const imageFile = formData.get("picture");

	try {
		let image = "";
		if (imageFile instanceof File && imageFile.size > 0) {
			if (imageFile.size > MAX_IMAGE_SIZE) {
				throw new Error("Please choose an image smaller than 1 MB.");
			}
			image = await readImage(imageFile);
		}

		const reports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || "[]");
		if (!Array.isArray(reports)) {
			throw new Error("Saved reports could not be read. Please clear the saved report data and try again.");
		}

		reports.unshift({
			name: formData.get("name").trim(),
			item: formData.get("item").trim(),
			location: formData.get("location").trim(),
			phone: formData.get("phone").trim(),
			image
		});
		localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
		window.location.href = "item.html";
	} catch (error) {
		message.textContent = error instanceof Error
			? error.message
			: "The report could not be saved. Please try again.";
	}
});

function readImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("The selected image could not be read."));
			}
		});
		reader.addEventListener("error", () => reject(new Error("The selected image could not be read.")));
		reader.readAsDataURL(file);
	});
}