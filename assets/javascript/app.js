
// Initialize Firebase

var config = {
    apiKey: "AIzaSyDIdaVUn5m8-6NbyrSlLek2FaCuphA2K_Y",
    authDomain: "train-scheduler-213f5.firebaseapp.com",
    databaseURL: "https://train-scheduler-213f5.firebaseio.com",
    projectId: "train-scheduler-213f5",
    storageBucket: "",
    messagingSenderId: "464858790996"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#add-train-btn").on("click", function() {
    event.preventDefault();
    
    // Grab user's input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();
    frequency = parseInt(frequency);

    // local object that holds the trains added
    var newTrain = {
      name: trainName,
      dest: destination,
      fTrain: firstTrain,
      freq: frequency,
      // nextTrainF: nextTrainFormated,
      // minutesTillTrain: minutesTillNextTrain
    };

    // upload the newTrain to the database
    database.ref("/trains").push(newTrain);

    // clear out all the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");

  });

   // 3. Create Firebase event for adding  to the the train database and a row in the html when a user adds an entry
  database.ref("/trains").on("child_added", function(snapshot) {
    console.log(snapshot.val());

    // store everything into a variable 

    var trainName = snapshot.val().name;
    var destination = snapshot.val().dest;
    var firstTrain = snapshot.val().fTrain;
    var frequency = snapshot.val().freq;

    var firstTrainTime = moment(firstTrain, "HH:mm").subtract(1, "years");

    console.log(firstTrainTime);

    var currentTime = moment();

    diffTime = currentTime.diff(moment(firstTrainTime), "minutes");

    console.log("diffTime = " + diffTime);

    tRemainder = diffTime % frequency;

   

    minutesTillNextTrain = frequency - tRemainder;

    console.log( "min = " + minutesTillNextTrain);





    nextTrain = currentTime.add(minutesTillNextTrain, "minutes");

    nextTrainFormated = moment(nextTrain).format("HH:mm");

    console.log("next train = " + nextTrainFormated)


    // Adding each train into a row
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainFormated + "</td><td>" + minutesTillNextTrain +  "</td></tr>" )
  })

  