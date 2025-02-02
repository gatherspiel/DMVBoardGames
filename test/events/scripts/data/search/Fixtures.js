export const DEFAULT_SEARCH_PARAMS = {
  day: "any",
  location: "any",
};

export const GROUP_LIST_1 = [
  {
    data: {
      id: 3,
      link: "https://www.meetup.com/board-games-at/",
      locations: "Alexandria",
      events: [
        {
          id: 1,
          title: "Game Night at Glory Days",
          day: "Monday",
          location: "3141 Duke Street · Alexandria, VA",
          summary:
            "We will be playing board games at Glory Days Grill in Alexandria . We don’t play typical games like scrabble or monopoly. We play Euro games like ticket to ride, Lords of Waterdeep, Wingspan, Cascadia and more.",
        },
      ],
      title: "Alexandria Board Game Group",
      summary:
        "Like playing board games after meeting new people? Then we are the group for you. We are a friendly group and all are welcome. Feel free to bring your own games to play or just join in on the fun. Join us for dinner before hand if you like and then we will start games around 630pm. Glory days has $6 burgers on Monday’s and half price appetizers after 9pm. So come and join us for food, friends and games.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 10,
      link: "https://www.meetup.com/alexandria-board-gaming/",
      locations: "Alexandria",
      title: "Alexandria Board Gaming",
      events: [],
      summary:
        "This is a group for playing a variety of modern board games. Feel free to come empty-handed as I will bring my copy of the scheduled game. Each event will be limited attendance based on how many people can play each game.. ",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 9,
      link: "https://www.meetup.com/AARGGH/",
      locations: "Arlington",
      title: "Alexandria-Arlington Regional Gaming Group",
      events: [
        {
          id: 1,
          title: "Grand Gaming Melee(Monthly)",
          day: "Saturday",
          location: "See group on Meetup for location",
          summary:
            "As always, there’ll be board games, dice games, card games, tile games, and just about every other kind of game that can be played on a tabletop. You’re encouraged to bring some of your favorites and teach them to new players, but feel free to come without any and play the games others bring. If you see one you’d like to try, there’ll be someone eager to teach you.",
        },
      ],
      summary:
        "The Alexandria-Arlington Regional Gaming Group or AARGGH exists to provide a community for gaming enthusiasts in the DC Metro area, with an emphasis in NoVA. ",
    },
    frontendState: {
      isVisible: false,
      visibleEvents: [
        {
          id: 1,
          title: "Grand Gaming Melee(Monthly)",
          day: "Saturday",
          location: "See group on Meetup for location",
          summary:
            "As always, there’ll be board games, dice games, card games, tile games, and just about every other kind of game that can be played on a tabletop. You’re encouraged to bring some of your favorites and teach them to new players, but feel free to come without any and play the games others bring. If you see one you’d like to try, there’ll be someone eager to teach you.",
        },
      ],
    },
  },
];
