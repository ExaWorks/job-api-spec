function saveLanguage(lang) {
	document.cookie = "language=" + lang;
}

function loadLanguage() {
	if (document.cookie) {
		var all = document.cookie;
		var a = all.split(';');
		for (var i = 0; i < a.length; i++) {
			var cookie = a[i];
			if (cookie.startsWith("language")) {
				var kv = cookie.split('=');
				if (kv[0] == "language") {
					return kv[1];
				}
			}
		}
	}
	return null;
}

function matchesLabel(el) {
	var html = $(el).html();
	return html.startsWith("<strong>") && $(el).html().endsWith("</strong>:");
}

function group(container, endEl) {
	if (endEl && $(endEl).index() == 0) {
		return;
	}
	var group = $("<div></div>").attr("class", "selector-group");
	while ($(container).children().length > 0
		&& $(container).children().eq(0)[0] != $(endEl)[0]) {

		$(container).children().eq(0).appendTo($(group));
	}
	return group;
}

function initSelectors(cls, mode, addEmptySelector, defaultLabel) {
	var tabsIndex = 0;
	$("." + cls).each(function() {
		tabsIndex++;
		var div = this;
		var labels = [];
		var groups = [];

		$(div).children().each(function() {
			// set here in case it gets removed
			if ($(this).is("p")) {
				if (matchesLabel(this)) {
					// remove colon at the end and bold underscore markers, which are used to tag labels
					var label = $(this).children().first().html();
					labels.push(label);

					// add all children up to this point (if any) into a div
					// and store for later use
					groups.push(group(div, this));

					$(this).remove();
				}
			}
		});
		$(div).addClass("global-lang-container");
		// also add all remaining elements to a group
		groups.push(group(div, $(div).find(".selector-group").first()));

		addRadio = function(index, label) {
			var input = $("<input></input>")
				.attr("class", "selector-radio global-lang-selector")
				.attr("type", "radio")
				.attr("id", "_" + cls + "-" + tabsIndex + "-" + index)
				.attr("name", "_" + cls + "-" + tabsIndex);
			if (label != null) {
				$(input).attr("ew-label", label);
			}
			if (defaultLabel == label) {
				$(input).addClass("global-lang-selector-default");
			}
			if (index == 0) {
				input.attr("checked", "true");
			}
			$(input).appendTo($(div));
			return input;
		}

		for (var i = 0; i < labels.length; i++) {
			var label = labels[i];

			radio = addRadio(i, label);

			var labelEl = $("<label></label>")
				.attr("class", "selector-label")
				.attr("for", "_" + cls + "-" + tabsIndex + "-" + i)
				.html(label);

			$(labelEl).appendTo($(div));

			if (addEmptySelector) {
				// doing this on the radio button doesn't work since the callback
				// is always invoked after the state change (and no, inserting as
				// the first click handler does not cnage anything)
				$(labelEl).on("click", function() {
					var f = $(this).attr("for");
					var r = $("#" + f);
					if ($(r).prop("checked")) {
						// check the "empty" radio
						// except check it later since the click may trigger
						// the radio of the clicked label to be selected
						window.setTimeout(function() {
							$("#_" + cls + "-" + tabsIndex + "-_").each(doSelect);
						}, 10);
						saveLanguage(null);
					}
				});
			}

			if (mode == "content-inline") {
				// first group is whatever is before the first label, which we ignore
				$(groups[i + 1]).appendTo($(div));
			}
		}

		if (mode == "content-last") {
			for (var i = 0; i < labels.length; i++) {
				$(groups[i + 1]).appendTo($(div));
			}
		}

		if (addEmptySelector) {
			addRadio("_", defaultLabel);
		}
	});
}

function doSelect() {
	if (!$(this).prop("checked")) {
		$(this).prop("checked", true);
	}
}

function checkAll(value) {
	$(".global-lang-selector[ew-label=\"" + value + "\"]")
		.each(doSelect);
	// for all the containers that do not have this language, select the default
	$(".global-lang-container:not(:has(.global-lang-selector[ew-label=\"" + value + "\"]))")
		.each(function() {
			$(this).find(".global-lang-selector-default").each(doSelect);
		});
}

function syncSelectors() {
	$(".global-lang-selector").each(function() {
		$(this).change(function() {
			var label = $(this).attr("ew-label");
			saveLanguage(label);
			checkAll(label);
		});
	});
}


$(document).ready(function() {
	initSelectors("lang-tabs", "content-last", false, "Java");
	initSelectors("lang-bindings", "content-inline", true, null);

	var lang = loadLanguage();
	if (lang) {
		console.log("Saved language: " + lang);
		checkAll(lang);
	}

	syncSelectors();
});
