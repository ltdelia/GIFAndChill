// GLOBAL VARIABLES
var you = "";
var them = "";
var percentage = "";
var result = "";
var GIFSources = [];
var sourceValue = [];

$(document).ready(function(){
// Hiding Our "Is It A Match?" and "Try Again?" divs
	$(".match").hide();
	$("#tryagain").hide();
})

// When the submit button is clicked...
$("#submit").on('click',
	// Run the doIt function
	function doIt(){		

	// Hiding the landing page
	$("#landing").hide();	

	// Showing the results of the "match"
	$("#outputs").show();

	// Display a "Try Again?" div
	$("#tryagain").show();

	// Emptying the previous inputs
	you="";
	them="";

	// Grabbing the values of user input
	you=$("#you").val().trim();
	them=$("#them").val().trim();

	// The AJAX call for the Love Calculator API
	var output = $.ajax({
			// The URL to the Love Calculator API
    		url: 'https://love-calculator.p.mashape.com/GetPercentage?fname='+you+'&sname='+them, 
    		// The HTTP Method
    		type: 'GET', 
    		data: {}, 
    		dataType: 'json',
    	success: function(data) {

        // console.log(data);
        you = data.fname;
        them = data.sname;
        percentage = data.percentage;
        result = data.result;

        displayInfo();

        gifUpload();
        },
    	error: function(err) { alert(err); },
    	beforeSend: function(xhr) {
    	// Adding the Mashape Key to enable API
    	xhr.setRequestHeader("X-Mashape-Authorization", "ceDOtO1OMAmsh6wrcV74AgQJF5Unp1RjG22jsnf3TthWQqm6jM"); 
    	}

	});  


});




function gifUpload(){
	
	// Our empty query variable. This will change depending on the percentage given by the Love Calculator API.	
	var query = "";

	// Our query options
	if(percentage>=80 && percentage<=100){
		query = "celebrate"
	}

	if(percentage>=50 && percentage<=79){
		query = "good+luck"
	}

	if(percentage>=30 && percentage<=49){
		query = "eh"
	}

	if(percentage>=11 && percentage<=29){
		query = "not+good"
	}

	if(percentage>=0 && percentage<=10){
		query = "disaster"
	}
	
	// The URL the Giphy API will use
	var queryURL = "http://api.giphy.com/v1/gifs/search?q="+ query + "&api_key=dc6zaTOxFJmzC&limit=10&offset=0";

	// AJAX call for the Giphy API
	$.ajax({url: queryURL, method: 'GET'})

		.done(function(response){
			for(var i=0; i<response.data.length;i++){
				// We declare a new variable to grab the URL for each GIF in the response from the AJAX call
				var gimme = response.data[i].images.downsized.url;
				// We then push each URL to our empty array GIFSources.
				GIFSources.push(gimme);
			}

			//Shuffle function shuffles the array so values are in random order
			function shuffle(array){
				var currentIndex = GIFSources.length, tempValue, randIndex;
				while(0 !== currentIndex) {
					randIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					tempValue = GIFSources[currentIndex];
					GIFSources[currentIndex] = GIFSources[randIndex];
					GIFSources[randIndex] = tempValue;
				}
				return GIFSources;
			}

			shuffle(GIFSources);

			// After the shuffle function is called, we should have a random URL to link
			// We declare a newGIF variable, using the first value from the GIFSources array
			var newGIF = GIFSources[0];

			$("#express").html("<img src=" + newGIF + ">");
		})
}

// Display the percentage, you, the crush, and the result of the match
function displayInfo(){
	$("#outputs").html();
       	$('#percent').html("<h1>"+percentage + "% Match </h1>");
	    $('#people').html(you+" & "+them);
       	$('#result').html(result);  
}