const input = document.getElementById("input");
const button = document.getElementById("button");
const button2 = document.getElementById("button2");
const searchResultWrapper = document.getElementById("searchResultWrapper");
const loader = document.getElementById("loader");
const sendSearchRequest = () => {
	button2.classList.add("hidden");
	loader.classList.remove("hidden");
	const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&limit=10&exchange=NASDAQ`;
	fetch(searchUrl)
		.then((response) => response.json())
		.then((data) => {
			data.forEach((item) => {
				let searchResultItem = document.createElement("li");
				searchResultItem.classList.add("flex");
				let searchResult = document.createElement("a");
				let searchResultText = document.createTextNode(
					item["name"] + " " + "(" + item["symbol"] + ")"
				);
				searchResult.appendChild(searchResultText);
				searchResult.href = `/stock-API-search/company.html?symbol=${item["symbol"]}`;
				searchResultItem.append(searchResult);
				searchResultWrapper.append(searchResultItem);
				const additionalUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/profile/${item["symbol"]}`;
				fetch(additionalUrl)
					.then((response) => response.json())
					.then((additionalData) => {
						additionalData.forEach((i) => {
							let img = document.createElement("img");
							img.src = i.image;
							img.classList.add("img");
							searchResultItem.prepend(img);
							let changes = document.createElement("div");
							changes.textContent = "(" + i.changes + "%" + ")";
							if (changes.textContent.includes("-")) {
								changes.classList.add("red");
							} else changes.textContent = "(" + "+" + i.changes + "%" + ")";
							changes.classList.add("green");
							searchResultItem.append(changes);
						});
					});
			});
			loader.classList.add("hidden");
			button2.classList.remove("hidden");
		});
};
const reload = () => {
	window.location.reload();
};
if (window.location.href.endsWith("index.html")) {
	button.addEventListener("click", sendSearchRequest);

	button2.addEventListener("click", reload);
}
if (window.location.href.includes("company.html")) {
	const companyWrapper = document.getElementById("companyWrapper");
	const urlParams = new URLSearchParams(window.location.search);
	const symbol = urlParams.getAll("symbol")[0];
	const historyLoader = document.getElementById("historyLoader");
	const companyUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
	const historyUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
	loader.classList.remove("hidden");
	fetch(companyUrl)
		.then((response) => response.json())
		.then((companyData) => {
			let titleWrapper = document.createElement("div");
			titleWrapper.classList.add("flex");
			let companyTitle = document.createElement("h1");
			let companyWebsite = document.createElement("a");
			companyWebsite.href = companyData.profile.website;
			companyWebsite.target = "blank";
			companyWebsite.classList.add("margin");
			let companyWebsiteText = document.createTextNode("Visit company website");
			companyWebsite.appendChild(companyWebsiteText);
			companyTitle.textContent = companyData.profile.companyName;
			let companyImage = document.createElement("img");
			companyImage.src = companyData.profile.image;
			companyImage.classList.add("image");
			let companyValue = document.createElement("div");
			companyValue.classList.add("flex");
			let companyPrice = document.createElement("div");
			companyPrice.textContent =
				"Stock price: " +
				companyData.profile.currency +
				" " +
				companyData.profile.price;
			let companyChangesPercentage = document.createElement("div");
			companyChangesPercentage.textContent =
				companyData.profile.changesPercentage;
			if (companyData.profile.changesPercentage.includes("+")) {
				companyChangesPercentage.classList.add("green");
			} else companyChangesPercentage.classList.add("red");
			let companyDescription = document.createElement("div");
			companyDescription.textContent = companyData.profile.description;
			titleWrapper.append(companyImage, companyTitle);
			companyValue.append(companyPrice, companyChangesPercentage);
			companyWrapper.append(
				titleWrapper,
				companyValue,
				companyDescription,
				companyWebsite
			);
			loader.classList.add("hidden");
		});
	historyLoader.classList.remove("hidden");
	fetch(historyUrl)
		.then((response) => response.json())
		.then((historyData) => {
			let dates = [];
			let stats = [];
			for (let i = 0; i < historyData.historical.length; i++) {
				dates.push(historyData.historical[i].date);
				stats.push(historyData.historical[i].close);
			}
			const labels = dates.reverse();
			const data = {
				labels: labels,
				datasets: [
					{
						label: "Stock Price History",
						backgroundColor: "rgb(66,133,244)",
						borderColor: "rgb(66,133,244)",
						data: stats.reverse(),
					},
				],
			};
			const config = {
				type: "line",
				data,
				options: {},
			};
			const myChart = new Chart(document.getElementById("myChart"), config);
			historyLoader.classList.add("hidden");
		});
}
if (window.location.href.endsWith("index.html")) {
	const marqueeUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list`;
	const marquee = document.getElementById("marquee");
	fetch(marqueeUrl)
		.then((response) => response.json())
		.then((marqueeData) => {
			marqueeData.forEach((stock) => {
				let marqueeSymbol = document.createElement("div");
				marqueeSymbol.classList.add("grey");
				marqueeSymbol.textContent = stock["symbol"];
				let marqueePrice = document.createElement("div");
				marqueePrice.classList.add("green");
				marqueePrice.textContent = stock["price"];
				marquee.append(marqueeSymbol, marqueePrice);
			});
		});
}
