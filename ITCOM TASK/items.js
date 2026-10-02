const REPORTS_STORAGE_KEY = "iim-bg-lost-found-reports";
const list = document.querySelector(".item-list");
const message = document.querySelector("#items-message");

try {
	const reports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || "[]");
	if (!Array.isArray(reports)) {
		throw new Error("Saved reports are not in the expected format.");
	}

	for (const report of reports) {
		if (!report || typeof report.name !== "string" ||
			typeof report.item !== "string" || typeof report.location !== "string" ||
			typeof report.phone !== "string") {
			throw new Error("A saved report is incomplete and could not be displayed.");
		}
		list.prepend(createReportCard(report));
	}
} catch (error) {
	message.hidden = false;
	message.textContent = error instanceof Error
		? `Unable to load saved reports: ${error.message}`
		: "Unable to load saved reports.";
}

function createReportCard(report) {
	const card = document.createElement("article");
	card.className = "row";

	if (typeof report.image === "string" && report.image.startsWith("data:image/")) {
		const image = document.createElement("img");
		image.className = "pic";
		image.src = report.image;
		image.alt = `Photo of ${report.item}`;
		card.append(image);
	} else {
		const placeholder = document.createElement("div");
		placeholder.className = "pic";
		placeholder.textContent = "No photo provided";
		card.append(placeholder);
	}

	const info = document.createElement("div");
	info.className = "item-info";

	const details = document.createElement("div");
	details.className = "uptext";
	appendText(details, "span", "status", "LOST");
	appendText(details, "span", "", report.location);
	appendText(details, "span", "", "Reported item");

	const title = document.createElement("h2");
	title.textContent = report.item;

	const owner = document.createElement("p");
	owner.className = "owner";
	appendText(owner, "strong", "", report.name);
	const phone = document.createElement("a");
	phone.href = `tel:${report.phone.replace(/[^\d+]/g, "")}`;
	phone.textContent = report.phone;
	owner.append(phone);

	info.append(details, title, owner);
	card.append(info);
	return card;
}

function appendText(parent, tagName, className, text) {
	const element = document.createElement(tagName);
	if (className) {
		element.className = className;
	}
	element.textContent = text;
	parent.append(element);
}