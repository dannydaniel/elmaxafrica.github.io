$(document).ready(function () {
	inputConfigure();
});

function inputConfigure() {
	$("input").keypress(function (event) {
		var bReturn;
		switch (event.which) {
			case 13:
				try {
					inputAutoEnter(event.target);
				}
				catch (sError) {}
				bReturn = false;
				break;
			default:
				bReturn = true;
				break;
		}
		return bReturn;
	});
}

function inputAutoEnter(oInput) {
	var oElement;
	var jElement;
	var oAutoEnter;
	var iDepth;
	var sUrl;

	iDepth = 0;
	for (oElement = oInput.parentNode; oElement != null; oElement = oElement.parentNode) {
		jElement = $(oElement);
		iDepth++;
		oAutoEnter = $(".autoenter", oElement).get(0);
		if (oAutoEnter != null) {
			switch (oAutoEnter.tagName.toLowerCase()) {
				case "a":
					if ((sUrl = oAutoEnter.href + "").length > 0) {
						window.location = sUrl;
					} else {
						$(oAutoEnter).trigger("click");
					}
					break;
				default:
					$(oAutoEnter).trigger("click");
					break;
			}
			break;
		} else if (jElement.hasClass("auto-enter-boundary")) {
			break;
		}
	}
}