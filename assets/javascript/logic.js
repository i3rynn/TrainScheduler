var firebaseConfig = {
    apiKey: "AIzaSyCCuuHhpYVMyj7PRFsrDcjaNra_A1ge5XM",
    authDomain: "train-de400.firebaseapp.com",
    databaseURL: "https://train-de400.firebaseio.com",
    projectId: "train-de400",
    storageBucket: "train-de400.appspot.com",
    messagingSenderId: "192237766993",
    appId: "1:192237766993:web:a82d5c8bbaa7f03f72ab70"
  };

  firebase.initializeApp(firebaseConfig);

 var database = firebase.database();

 var tMinutesTillTrain = 0;


function displayRealTime() {
setInterval(function(){
    $('#current-time').html(moment().format('hh:mm A'))
  }, 1000);
}
displayRealTime();


 var tRow = "";
 var getKey = "";

 $("#submit-button").on("click", function() {

	event.preventDefault();

	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrainTime = $("#first-train-time").val().trim();
	var trainFrequency = $("#frequency").val().trim();


	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(trainFrequency);

	if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === ""){
		$("#not-military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}

	
	else if (trainName === null || destination === null || firstTrainTime === null || trainFrequency === null){
		$("#not-military-time").empty();
		$("#not-a-number").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}

	else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3)!== ":") {
		$("#missing-field").empty();
		$("#not-a-number").empty();
		$("#not-military-time").html("Time must be in military format: HH:mm. For example, 15:00.");
		return false;
	}

	else if (isNaN(trainFrequency)) {
    	$("#missing-field").empty();
    	$("#not-military-time").empty();
    	$("#not-a-number").html("Not a number. Enter a number (in minutes).");
    	return false;
	}

	else {
		$("#not-military-time").empty();
		$("#missing-field").empty();
		$("#not-a-number").empty();

	    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	    console.log(firstTimeConverted);

	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    var tRemainder = diffTime % trainFrequency;
	    console.log(tRemainder);

	    var tMinutesTillTrain = trainFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

		var newTrain = {
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			trainFrequency: trainFrequency,
			nextTrain: nextTrain,
			tMinutesTillTrain: tMinutesTillTrain,
			currentTime: currentTime.format("hh:mm A")
		};

		database.ref().push(newTrain);

		console.log("train name in database: " + newTrain.trainName);
		console.log("destination in database: " + newTrain.destination);
		console.log("first train time in database: " + newTrain.firstTrainTime);
		console.log("train frequency in database: " + newTrain.trainFrequency);
		console.log("next train in database: " + newTrain.nextTrain);
		console.log("minutes away in database: " + newTrain.tMinutesTillTrain);
		console.log("current time in database: " + newTrain.currentTime);

		$(".add-train-modal").html("<p>" + newTrain.trainName + " was successfully added to the current schedule.");
		$('#addTrain').modal();

		
		$("#train-name").val("");
		$("#destination").val("");
		$("#first-train-time").val("");
		$("#frequency").val("");
	}
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());
	console.log(prevChildKey);

	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var trainFrequency = childSnapshot.val().trainFrequency;
	var nextTrain = childSnapshot.val().nextTrain;
	var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;
	var currentTime = childSnapshot.val().currentTime;


	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(nextTrain);
	console.log(tMinutesTillTrain);
	console.log(trainFrequency);
	console.log(currentTime);

    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

   
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

	var tRow = $("<tr>");
	var trainTd = $("<td>").text(trainName);
    var destTd = $("<td>").text(destination);
    var nextTrainTd = $("<td>").text(nextTrain);
    var trainFrequencyTd = $("<td>").text(trainFrequency);
    var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

    tRow.append("<img src='assets/images/binart.png' alt='trash can' class='trash-can mr-3'>", trainTd, destTd, trainFrequencyTd, nextTrainTd, tMinutesTillTrainTd);
   
    $("#schedule-body").append(tRow);
});



 $("body").on("click", ".trash-can", function(){
	
	event.preventDefault();

	var confirmDelete = confirm("Deleting a train permanently removes the train from the system. Are you sure you want to delete this train?");

	if (confirmDelete) {
		
		$(this).closest('tr').remove();
	
	}

	else {
		return;
	}
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})