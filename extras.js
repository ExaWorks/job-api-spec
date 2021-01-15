$(document).ready(function() {
	var tabsIndex = 0;
	$(".lang-tabs").each(function() {
		tabsIndex++;
		var div = this;
		var labels = [];
		$(div).children().each(function() {
			if ($(this).is("p")) {
				// remove colon at the end; it only makes sense when rendered
				// without this script
				labels.push($(this).html().replace(/:\s*$/, ""));
				$(this).remove();
			}
		});
		
		var firstPre = $(div).children(":first");
		console.log(labels.length);
		
		for (var i = 0; i < labels.length; i++) {
			var label = labels[i];
			
			var input = $("<input></input>")
				.attr("class", "lang-tab-radio")
				.attr("type", "radio")
				.attr("id", "_lang-tabs-" + tabsIndex + "-" + i)
				.attr("name", "_lang-tabs-" + tabsIndex);
			if (i == 0) {
				input.attr("checked", "true");
			}
			$(input).insertBefore(firstPre);
			
			var label = $("<label></label>")
				.attr("class", "lang-tab-label")
				.attr("for", "_lang-tabs-" + tabsIndex + "-" + i)
				.html(label);
			
			$(label).insertBefore(firstPre);
		}
	});
});