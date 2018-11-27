	/* 
	# Developed by Ítalo Viola
	# Version: 1.0.0
	# Objective: Use cookies to track user navigation (capturing URL) data by recieving his e-mail address by get method and storing the data tracked by API call
	# How to use: The script must recieve two get paramethers (base64 encripteds), wich are:
	# e: e-mail address key
	# o: origin key (where the data came from)
	*/

		//Include jQuery
		var jq = document.createElement('script');
		jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
		document.getElementsByTagName('head')[0].appendChild(jq);

		// Initialize vars
		var email;
		var origem;
		var produto;
		var expiration_date = new Date();
		expiration_date.setFullYear(expiration_date.getFullYear() + 1);

		// GET URL paramethers
		function getUrlParameter(sParam) {
			var sPageURL  = decodeURIComponent(window.location.search.substring(1)), 
			sURLVariables = sPageURL.split('&'), 
			sParameterName, 
			i;

			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');

				if (sParameterName[0] == sParam) {
					return sParameterName[1];
				}
			}
		}
		//Verify if cookie already exist
		function getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
		}

		//Assincronous API call
		function sendData(semail, sproduto, sorigem) {
			var form = new FormData();
			form.append("Email", semail);
			form.append("Produto", sproduto);
			form.append("URL", window.location);
			form.append("Origem", sorigem);

			var settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": "http://api.example.com/service",
			  "method": "POST",
			  "processData": false,
			  "contentType": false,
			  "mimeType": "multipart/form-data",
			  "data": form
			}

			$.ajax(settings);
		}

		//Set email and procut variables value, creates cookie if possibule and execute sendData() function
		if (getUrlParameter('e') != null) {
			produto = btoa(url.substring(url.lastIndexOf("/")+1,url.lastIndexOf("?"))+1);
			if (getCookie(produto) == null) {
				if (getCookie("em") == null) {
					email  = getUrlParameter('e');
					origem = getUrlParameter('o');

					document.cookie = "em=" + email + "; expires=" + expiration_date.toUTCString() + "; path=/";
					document.cookie = "or=" + origem + "; expires=" + expiration_date.toUTCString() + "; path=/";
					document.cookie = produto + "=" + produto + "; expires=" + expiration_date.toUTCString();

					sendData(atob(email), atob(produto), atob(origem));

				} else {
					email  = getCookie("em");
					origem = getCookie("or");

					document.cookie = produto + "=" + produto + "; expires=" + expiration_date.toUTCString();

					sendData(atob(email), atob(produto), atob(origem));
				}
			}
		} else if (getCookie("em") != null) {
			email   = getCookie("em");
			produto = btoa(url.substring(url.lastIndexOf("/")+1,url.length)+1);
			origem  = getCookie("or");

			if (getCookie(produto) == null) {
				document.cookie = produto + "=" + produto + "; expires=" + expiration_date.toUTCString();
			}
			
			sendData(atob(email), atob(produto), atob(origem));
		}