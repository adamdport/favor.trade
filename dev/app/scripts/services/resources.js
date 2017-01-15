'use strict';

/**
 * @ngdoc service
 * @name devApp.RESOURCES
 * @description
 * # RESOURCES
 * Constant in the devApp.
 */
angular.module('devApp')
  .constant('RESOURCES', {
    do: [
      "Shopping buddy","Dance lessons","Nutrition coaching","Exercise coaching","Web programming","Plumbing","Electric work","Woodworking","Tailoring","Make you a cup of coffee","Cooking lesson","Massage","Computer tuneup","Interior design","Pick out curtains","Fix a flat tire","Pressure wash your outdoor furniture","Tree removal","Help you move","Mop your floors","Restring your guitar","Help plan a trip","Do your laundry","Offer a painfully honest first impression"
    ],
    search: [
      "Auto repair","Shopping","Dance Lessons","Fitness","Lawn mowing","Relationship advice","Landscaping","Financial advice","Make maple syrup","Hunting lessons","Trip planning","Laundry"
    ],
    aboutYourself: [
      "I drive a '71 beetle. All day long people get punched, because of me.",
      "Last night my friend asked to use a USB port to charge his cigarette, but I was using it to charge my book. The future is stupid.",
      "Now that cellphones are becoming more and more waterproof, pretty soon it will be okay to push people into pools again.",
      "Instead of all the prequel and sequel movies coming out, they should start making equels - films shot in the same time period as the original film, but from an entirely different perspective.",
      "Is it crazy how saying sentences backwards creates backwards sentences saying how crazy it is?",
      "Every cell in my body knows how to replicate DNA–but I'm not in on it so I have to spend hours studying it.",
      "To the dinosaurs, we live in a post-apocalyptic future."
    ],
    location: [
      "90210",
      "Beverly Hills, CA"
    ],
    confirm: {
      deleteFavor: "Are you sure you want to delete this favor?"
    },
    requestMessage: [
      "I could totally use a hand with this! I'd love to meet up. If you're interested, when are you free?",
      "I've done this before, but would love your supervision. Would you help me?",
      "I've wanted to try this for years but never had the chance.",
      "How much experience do you have doing this?"
    ],
    max: {
      favor: 200,
      favors: 20,
      bio: 200,
      message: 500,
      reference: 200
    },
    min: {
      favor: 3,
      reference: 10
    }
  });
