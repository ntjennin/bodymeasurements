// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function HandleBodyFatPercentage(agent) {
    let conv = agent.conv();
    let BMI = agent.parameters.BMI;
    let Age = agent.parameters.Age;
    let Gender = agent.parameters.Gender;
    conv.data.bmi = BMI;
    conv.data.age = Age;
    conv.data.gender = Gender;
  }
  
  function TargetHeartRateParameters(agent) {
    let conv = agent.conv();
    
    let resting = agent.parameters.resting;
    let age = agent.parameters.age;
 
    var max = 220 - age;
    var reserve = max - resting;
    var low = reserve * 0.7 + resting;
    var high = max * 0.85 + resting;
      
    agent.add("Your target heart rate should be between " + low + " and " + high);
    
    let data = agent.getContext("bodymeasurements-followup").parameters;
    
    data.age = age;
    data.resting = resting;
    
    let update = {
      "name":"bodymeasurements-followup", 
      "lifespan":5, 
      "parameters": data
    };
    
    agent.setContext(update);
  }
  
  function IdealFatPercentage(agent) {
    let conv = agent.conv();
    let data = agent.getContext("bodymeasurements-followup").parameters;
    var bfp = null;
    if(data && data.age && data.gender && data.height && data.weight) {
       let bmi = data.bmi; 
       let gender = data.gender.substring(0, 1).toLowerCase();
       let age = data.age;
       let message = "Incorrect";
       if(gender.toLowerCase() === "M".toLowerCase()) {
    
         bfp = (1.20 * bmi) + (0.23 * age) - 5.4;   

        if(age >= 20 && age <= 40) {
          if(bfp >= 8 && bfp <= 19) {
            message = "Healthy";  
          } else if(bfp >= 19 && bfp <= 25) {
            message = "Overweight"; 
          } else if(bfp >= 25) {
            message = "Obese"; 
          }
        } else if(age >= 41 && age <= 60) {
          if(bfp >= 11 && bfp <= 22) {
            message = "Healthy";  
          } else if(bfp >= 22 && bfp <= 27) {
            message = "Overweight"; 
          } else if(bfp >= 27) {
            message = "Obese"; 
          }
        } else if(age >= 61 && age <= 79) {
          if(bfp >= 13 && bfp <= 25) {
            message = "Healthy";  
          } else if(bfp >= 25 && bfp <= 30) {
            message = "Overweight"; 
          } else if(bfp >= 30) {
            message = "Obese"; 
          }
        }
      } else if(gender.toLowerCase() === "F".toLowerCase()) {

        bfp = (1.20 * bmi) + (0.23 * age) - 16.2;

        if(age >= 20 && age <= 40) {
          if(bfp < 21) {
            message = "Unhealthy"; 
          } else if(bfp >= 21 && bfp <= 33) {
            message = "Healthy";  
          } else if(bfp >= 34 && bfp <= 40) {
            message = "Overweight"; 
          } else if(bfp >= 40) {
            message = "Obese"; 
          }
        } else if(age >= 41 && age <= 60) {
          if(bfp < 23) {
            message = "Unhealthy";
          }
          else if(bfp >= 23 && bfp <= 35) {
            message = "Healthy";  
          } else if(bfp >= 35 && bfp <= 40) {
            message = "Overweight"; 
          } else if(bfp >= 40) {
            message = "Obese"; 
          }
        } else if(age >= 61 && age <= 79) {
          if(bfp >= 24 && bfp <= 36) {
            message = "Healthy";  
          } else if(bfp >= 36 && bfp <= 42) {
            message = "Overweight"; 
          } else if(bfp >= 42) {
            message = "Obese"; 
          }
        }
      }
    } else {
      agent.add("You will need to provide your age, gender, and bmi.");
    }
  }
  
  function IdealFatPercentageParameters(agent) {
    let bmi = agent.parameters.bmi; 
       let gender = agent.parameters.gender.substring(0, 1).toLowerCase();
       let age = agent.parameters.age;
       let message = "Incorrect";
    var bfp = null;
       if(gender.toLowerCase() === "M".toLowerCase()) {
    
         bfp = (1.20 * bmi) + (0.23 * age) - 5.4;   

        if(age >= 20 && age <= 40) {
          if(bfp >= 8 && bfp <= 19) {
            message = "Healthy";  
          } else if(bfp >= 19 && bfp <= 25) {
            message = "Overweight"; 
          } else if(bfp >= 25) {
            message = "Obese"; 
          }
        } else if(age >= 41 && age <= 60) {
          if(bfp >= 11 && bfp <= 22) {
            message = "Healthy";  
          } else if(bfp >= 22 && bfp <= 27) {
            message = "Overweight"; 
          } else if(bfp >= 27) {
            message = "Obese"; 
          }
        } else if(age >= 61 && age <= 79) {
          if(bfp >= 13 && bfp <= 25) {
            message = "Healthy";  
          } else if(bfp >= 25 && bfp <= 30) {
            message = "Overweight"; 
          } else if(bfp >= 30) {
            message = "Obese"; 
          }
        }
      } else if(gender.toLowerCase() === "F".toLowerCase()) {

        bfp = (1.20 * bmi) + (0.23 * age) - 16.2;

        if(age >= 20 && age <= 40) {
          if(bfp < 21) {
            message = "Unhealthy"; 
          } else if(bfp >= 21 && bfp <= 33) {
            message = "Healthy";  
          } else if(bfp >= 34 && bfp <= 40) {
            message = "Overweight"; 
          } else if(bfp >= 40) {
            message = "Obese"; 
          }
        } else if(age >= 41 && age <= 60) {
          if(bfp < 23) {
            message = "Unhealthy";
          }
          else if(bfp >= 23 && bfp <= 35) {
            message = "Healthy";  
          } else if(bfp >= 35 && bfp <= 40) {
            message = "Overweight"; 
          } else if(bfp >= 40) {
            message = "Obese"; 
          }
        } else if(age >= 61 && age <= 79) {
          if(bfp >= 24 && bfp <= 36) {
            message = "Healthy";  
          } else if(bfp >= 36 && bfp <= 42) {
            message = "Overweight"; 
          } else if(bfp >= 42) {
            message = "Obese"; 
          }
        }
      }
    
    let data = agent.getContext("bodymeasurements-followup").parameters;
    
    data.age = age;
    data.gender = gender;
    data.bmi = bmi;
    
    let update = {
      "name":"bodymeasurements-followup", 
      "lifespan":5, 
      "parameters": data
    };
  }
  
  function TargetHeartRate(agent) {
    let conv = agent.conv();
    let data = agent.getContext("bodymeasurements-followup").parameters;
    
    if(data && data.resting && data.age) {
      
      var max = 220 - data.age;
      var reserve = max - data.resting;
      var low = reserve * 0.7 + data.resting;
      var high = max * 0.85 + data.resting;
      
      agent.add("Your target heart rate should be between " + low + " and " + high);
      
    } else {
	  agent.add("I will need your resting heart rate and age.");
    }
    
  }
  
  function BMIParameters(agent) {
    
    let conv = agent.conv();
    
    let height = agent.parameters.height;
    let weight = agent.parameters.weight;
    
    let data = agent.getContext("bodymeasurements-followup").parameters;
    
    data.weight = weight.amount;
    data.height = height.amount;
        
    let update = {
      "name":"bodymeasurements-followup", 
      "lifespan":5, 
      "parameters": data
    };
    
    agent.setContext(update);
    
    let bmi = weight.amount / (height.amount * height.amount); 
    
    agent.add("Your BMI is " + bmi + ".");    
  }
  
  function HandleBMI(agent) {
    let conv = agent.conv();
    
    let data = agent.getContext("bodymeasurements-followup").parameters;
    
    if(data && data.height && data.weight && !data.bmi) {
      let bmi = data.weight / (data.height * data.height); 
      agent.add("Your BMI is " + bmi + ".");      
    } else if(data && data.bmi) {
      agent.add("Your BMI is " + data.bmi);
    }else {
      agent.add("I will need your height and weight.");    
    }
  }
  
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set("Body Measurements - BMI", HandleBMI);
  intentMap.set("Body Measurements - TargetHeartRate", TargetHeartRate);
  intentMap.set("Body Measurements - BodyFatPercentage", HandleBodyFatPercentage);
  intentMap.set("Body Measurements - BMI - Parameters", BMIParameters);
  intentMap.set("Body Measurements - TargetHeartRateParameters", TargetHeartRateParameters);
  intentMap.set("Body Measurements - IdealBodyFatPercentage", IdealFatPercentage);
  intentMap.set("Body Measurements - IdealBodyFatPercentageParameters", IdealFatPercentageParameters);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
