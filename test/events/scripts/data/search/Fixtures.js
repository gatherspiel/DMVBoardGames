import { SearchParams } from "../../../../../src/events/scripts/data/search/model/SearchParams.js";

export const DEFAULT_SEARCH_PARAMS = new SearchParams({
  day: "any",
  location: "any",
});

export const ARLINGTON_SEARCH = new SearchParams({
  day: "any",
  location: "Arlington",
});

export const WEDNESDAY_SEARCH = new SearchParams({
  day: "Wednesday",
  location: "any",
});

export const INVALID_DAY_SEARCh = new SearchParams({
  day: "Test",
  location: "any",
});

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
          id: 2,
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
          id: 2,
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

export const GROUP_LIST_2 = [
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
          id: 2,
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
    },
  },
  {
    data: {
      events: [
        {
          id: 3,
          title:
            "High Interaction Board Games at Western Market Food Hall in DC",
          day: "Sunday",
          location: "2000 Pennsylvania Avenue NW #3500 · Washington, DC",
          summary:
            "We play a variety of high interaction games with a focus on cooperative games, hidden identity games, and high interaction(German-style) Euros.",
        },
        {
          id: 4,
          title: "Board Game Night @ Board Room in Clarendon, Wed, 6:30-10:00",
          day: "Wednesday",
          location: "925 N Garfield St · Arlington, VA",
          summary:
            "Let's play board games. Not the ones your ancestors played but the really cool ones of the new millennium. We play everything from fun, social games to light to heavy strategy games.",
        },
        {
          id: 5,
          title: "Bring Your Own Game Night in DC at Nanny O’Briens",
          day: "Monday",
          location: "3319 Connecticut Avenue Northwest · Washington, DC",
          summary:
            "Hello again! After a long hiatus, the Monday meet up at Nanny O’Briens is back! We’ll have some games to play, but feel free to bring your favorites as well. Stop by for a game and a drink, and say hello! We’ll be in the back room",
        },
        {
          id: 6,
          title:
            "Bring Your Own Eurogames Night at the Crystal City Shops next to We the Pizza",
          day: "Friday",
          location: "2011 Crystal Drive · Arlington, VA",
          summary: "We play a variety of game with a focus on Eurogames",
        },
      ],
      id: 1,
      link: "https://www.meetup.com/beerbogglers/",
      locations: "Arlington, DC",
      title: "Beer & Board Games",
      summary:
        "Hi! This is a group for fun-loving, non-competitive people who enjoy playing party and board games. We have several wonderful venues where we can enjoy food and drinks while playing a few games. Don’t hesitate to bring any games you'd like to play (or feel free to come empty-handed).",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 29,
      link: "https://www.meetup.com/boardgames-food-friends/",
      locations: "Alexandria",
      title: "Boardgames, Food & Friends",
      events: [
        {
          id: 7,
          title: "Weekly Boardgame Throwdown!",
          day: "Monday",
          location: "3141 Duke St · Alexandria, VA",
          summary:
            "This our weekly game night event! We start at 6pm so that we can get dinner from Glory Days. Come join us and maybe meet some new friends as we play games ranging from Fluxx to Ricochet Robots to Ticket to Ride to Saboteur to Cards Against Humanity (and others).",
        },
      ],
      summary:
        "We are a fun group of people who enjoy meeting friends for some good food and boardgames of all types.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 27,
      link: "https://www.meetup.com/county-center-board-tabletop-games/",
      locations: "Woodbridge",
      title: "County Center Board and Tabletop Games",
      events: [],
      summary:
        "Welcome! This group is for those interested in playing board and tabletop games. Events will be held at a private home near County Center, Woodbridge, VA (in Prince William County). Board games are my hobby and I started this group to play more games. If you are sociable, respectful, and like modern board games (or want to learn) then this group is possibly for you.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 18,
      link: "https://www.meetup.com/dc-gaming-group",
      locations: "Brentwood,DC",
      title: "DC Gaming Group",
      events: [],
      summary:
        "DC Gaming Group (DCGG) is a club organization created to foster connections within the DMV gaming community. Together, we can explore new games, support independent game developers, and check out local events.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 19,
      link: "https://www.meetup.com/fairfax-home-tabletop-board-games",
      locations: "Fairfax",
      title: "Fairfax Home Tabletop Board Games",
      events: [],
      summary:
        "Let's play some games! This is a small group event for board games at our house. We can host up to two tables worth of games, up to 8 additional people depending on the game player count. We have a medium library of about 70 games that vary in complexity, player count and type. You are also welcome to bring your own games. Light drinks and snacks will be provided!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 7,
      link: "https://www.meetup.com/fantasy-and-legacy-board-games-the-board-room-clarendon/",
      events: [],
      locations: "Arlington",
      title: "Fantasy and Fun Board Games @ The Board Room (Clarendon)",
      summary:
        "This meetup is dedicated to  fantasy and / or legacy games going @ The Board Room in Arlington, VA. We typically meet on Sunday evenings at 6:30pm. \nGames we have been playing include:\n\n• Lovecraft: Arkham Horror, Eldritch Horror, Arkham Card Game, etc... anything with Cthulhu!!\n• Pandemic \n• Twilight Imperium\n• Dead of Winter\n• Battlestar Galactica\n\nAnd, if anyone is interested in playing a game, please let me know. We are always welcome to new adventures! ",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 14,
      link: "https://www.meetup.com/Fun-Times-In-the-DMV/",
      title: "Fun Times in the DMV",
      locations: "Arlington",
      events: [
        {
          id: 1,
          title: "Beer Garden & Board Games!",
          day: "Wednesday",
          location: "3181 Wilson Blvd · Arlington, VA",
          summary:
            "Best darn night ever! Lots of games. Even more laughs. Come and find out for yourself. New members or members who just haven't been out to a meetup are strongly encouraged to come.",
        },
      ],
      summary:
        "When was the last time you had a FUN TIME? No hoops. No struggle. Just genuine FUN time with people interested in meeting you? As you may have already guessed, this group is all about having a fun time, and while this group is not about board games, I've found that board games are the universal tool for FUN. As a result, this group will host a variety of FUN, SIMPLE, and JUDGEMENT FREE events throughout the DMV that will most likely include board games in some capacity to break the ice. SIMPLE GAMES. So if you love to laugh and are down to have fun with a bunch of ppl looking forward to meeting you, then welcome to your new MeetUp group! ",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 33,
      link: "https://www.meetup.com/Gaithersburg-Board-Games-Meetup-Group/",
      locations: "Gaithersburg",
      title: "Gaithersburg Board Games Meetup Group",
      events: [
        {
          id: 1,
          title: "Gaithersburg Games",
          day: "Saturday",
          location: "19965 Century Blvd · Germantown, MD",
          summary:
            "I invite everybody to join us for board games at Panera bread in Germantown on Century Blvd. We have all sorts of games. We welcome all kinds of gamers from the first timers, to old veterans. Feel free to bring any of your own games if you wish. Most of our members are always eager to learn new games. Of course we also like classics like Catan or Ticket To RIde, among others. You are free to arrive to the event at anytime, and leave whenever you have had enough games. There is no fee for this event. But I am sure that the restaurant would appreciate any patronage, and they are being kind enough to loan us their tables.This event will repeat every final Saturday of each month.",
        },
      ],
      summary:
        "We are looking to make friends, have fun, and play board games! We have a wide selection and all our members are welcome to bring their own games. We are willing to teach and learn as needed and usually we have at least two and sometimes three games going at once. We also enjoy having themed game nights and even do occasional field trips to movies, game taverns, and more! ",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 26,
      link: "https://www.meetup.com/Game-Nights-at-Crossroads/",
      locations: "Manassas",
      title: "Game Nights at Crossroads",
      events: [
        {
          id: 1,
          title: "Mental Monday Trivia Night",
          day: "Monday",
          location: "9412 Main St · Manassas, VA",
          summary:
            "Every week it's a different theme! We have done authors and their works, Changing Seasons, Animated Characters, and lots more. Form a team, but your team score is the amount of correct answers divided by number of team members.\n\nAnd, yes, there are prizes! If attendance is low, everyone gets something, but if it's big, the prizes are bigger, including gift cards!\n\nAll questions are either created by us, or taken from one of our very many trivia games on hand. There will always be easy and hard questions, plus a fair range for every kind of player to be involved.",
        },
        {
          id: 2,
          title: "Advancd Strategy Game Night",
          day: "Tuesday",
          location: "9412 Main St · Manassas, VA",
          summary:
            "Have you ever been intimidated by a game? Glanced at it and ran for the hills (the ones without eyes)?\n\nWell Gamemeister Sam is here to take you by the hand (not literally, though, that would be weird) and guide you to the promised land. Where the sun is always shining and the air smells like warm root beer and heavy cardboard aficionado's are afforded every opportunity to gorge themselves in all manner of scintillating strategy games.",
        },
        {
          id: 3,
          title: "Disney's Lorcana TCG Wednesdays",
          day: "Wednesday",
          location: "9412 Main St · Manassas, VA",
          summary:
            "Every Wednesday at 6pm sharp, Sam will be hosting Disney's Lorcana TCG game nights! There will be prizes for the winners & lots of fun to be had!",
        },
        {
          id: 4,
          title: "Strategy Game Night",
          day: "Thursday",
          location: "9412 Main St · Manassas, VA",
          summary:
            "Thursday is becoming the favored week night for STRATEGY gamers here at Crossroads! We have played Mare Nostrum, Orleans, Gaia Project, and more. Bring your preferences, be ready to split if it's a larger group, and rely on us for an awesome variety of games from which to choose.",
        },
        {
          id: 5,
          title: "Card Sharks of Crossroads",
          day: "Friday",
          location: "9412 Main St · Manassas, VA",
          summary:
            "When it's getting late on a Friday and you don't have other plans, come over for some old-fashioned card-playing! We can play anything and everything, from Euchre and Pinochle to Hearts and Spades to Bridge and Rummy, and maybe even some Poker or Blackjack! It's up to whomever shows up. We'll get a table (or several) at the bar so the drinks (if you so desire) are handy!",
        },
        {
          id: 6,
          title: "Open Games Sunday",
          day: "Sunday",
          location: "9412 Main St · Manassas, VA",
          summary:
            "A weekly meetup for all gamers, from heavy strategy to light party games. Crossroads has a 1,400+ library of games, free to all paying customers (food, drink, or retail purchases qualify). Owner John (yours truly) will be on hand to host the event, and usually be able to sit and play as well!",
        },
      ],
      summary:
        "Crossroads Tabletop Tavern is a home away from home for tabletop gamers of all kinds...and to the gamer in everyone!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 24,
      link: "https://www.meetup.com/gamers-of-the-abyss/",
      locations: "Greenbelt,Silver Spring",
      title: "Gamers of the Abyss",
      events: [],
      summary:
        "Forget all the kiddie board games you used to play at grandma's house and join me in playing the games you Really want to play, like Return to Dark Tower, Tainted Grail (requires a continued group of players through chapters), Human Punishment, Let's Summon Demons, Obsidia, Zombicide, Steamwatchers, Apex, and plenty more!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 20,
      locations: "Fairfax",
      link: "https://www.meetup.com/games-comics-pair-odice-game-center/",
      title: "Games & Comics Pair O'Dice Game Center",
      events: [
        {
          id: 1,
          title: "Saturday All Day Gaming",
          day: "Saturday",
          location: "10385 Main Street · Fairfax, VA",
          summary: "Free to play board gaming all day until we close",
        },
      ],
      summary:
        "If you are into Games and Comics, then our game center can be your paradise! Your home away from home. Friendly people, free tables, and growing communities. This group is for all who want to know whats going on at the Game Center, find more chances to play and connect with the Fairfax gaming & comics communities. We love working with the community to put on even more events, so please come to us with your ideas for events.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 34,
      link: "https://gcom.clubexpress.com/",
      locations: "Maryland",
      title: "Games Club of Maryland",
      events: [],
      summary:
        "The Games Club of Maryland encourages game playing as a hobby. We play all sorts of games - European Strategy board games, card games, deck-builder games, RPG's, wargames. We play in person at local gaming groups across the Mid-Atlantic region and online, and we host or sponsor many gaming events each year. Our main goal is to have fun! We welcome all gamers from novice to experienced, and we have members of all ages and from various gaming and online backgrounds.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 8,
      link: "https://www.meetup.com/hyattsville-gaming-conclave/",
      locations: "Hyattsville",
      title: "Hyattsville Gaming Conclave",
      events: [
        {
          id: 1,
          title: "Games Day",
          day: "Saturday",
          location: "See group on Meetup for location",
          summary:
            "General day of games! Whatever folks feel like playing. Bring your own or learn a new one! If you want to play a longer game, you might want to propose it on the meetup discussion to judge interest. I'll have snacks and soda on hand. Additional snacks or soda welcome. We usually order out for dinner and then continue on till 10pm.\n\nThe games we usually play tend towards those requiring more thinking than typical family or party games and they are usually in the 2-4 hour range. Photos from past meet ups can give you a sense of them. We do sometimes play lighter games though.",
        },
      ],
      summary:
        'This group is dedicated to organizing gaming sessions, running the gamut from Eurogames to Wargames, with party games not unwelcome. Eurogames "are a broad class of tabletop games that generally have simple rules, short to medium playing times, high levels of player interaction, and attractive physical components. The games emphasise strategy, downplay luck and conflict, lean towards economic rather than military themes, and usually keep all the players in the game until it ends... T" ',
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 23,
      link: "https://www.meetup.com/leagueofextraordinarygamers",
      locations: "Ashburn",
      title: "League of Extraordinary Gamers",
      events: [],
      summary:
        "Meet fellow game players in Northern VA...and really from all around the MD/DC area!\n\nCome to a League Meetup to play old and new favorites. We'll teach you everything we know and feed you too :)\n\nWe like being social and we like everything from social games to euro games to strategy games",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 31,
      link: "https://www.meetup.com/manassas-eat-chat-and-game-group/",
      locations: "Chantilly",
      title: "Manassas Eat & Chat and Game Group",
      events: [
        {
          id: 1,
          title: "Manassas Game Group Event!",
          day: "Saturday",
          location: "14361 Newbrook Dr · Chantilly , VA",
          summary:
            "Join us for a fun afternoon of board games, card games, etc! Bring your favorites or play a game that someone else brings.\nYou are welcome to bring snacks (for yourself or to share) and non-alcoholic beverages.",
        },
      ],
      summary:
        "We are a fun group of people who enjoy meeting friends for some good food and boardgames of all types.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 16,
      locations: "Brunswick,College Park,Gaithersburg,Rockville",
      link: "https://www.meetup.com/dcgamenight/",
      title: "Maryland and DC Area Game Night",
      events: [
        {
          id: 1,
          title: "Monday Games at the Board and Brew in College Park",
          day: "Monday",
          location: "8150 Baltimore Ave · College Park, MD",
          summary:
            "Come on out to the Board and Brew in College Park and play a great game with wonderful people while noshing some delectable edibles.",
        },
        {
          id: 2,
          title: "College Park Thursdays: Have fun storming the Kastle!",
          day: "Thursday",
          location: "4748 Cherry Hill Rd, College Park, MD",
          summary:
            "Hey hey everyone, our friendly local GAME KASTLE hosts board game night each and every Thursday starting at 5pm..",
        },
        {
          id: 3,
          title: "Board Gaming at Play More Game Store, Gaithersburg, MD",
          day: "Thursday",
          location: "42 Bureau Dr · Gaithersburg, MD",
          summary:
            "Come Join us at Play More Game Store, 42 Bureau Drive, Gaithersburg, MD for board gaming!.",
        },
        {
          id: 4,
          title: "Rockville Gamers",
          day: "Friday",
          location: "355 Linthicum St · Rockville, MD",
          summary:
            "We meet in Rockville United Church's large meeting room for Friday night gaming at 7:00PM. Lately, we've had four or five tables at 7, and a couple for a second game. Lots of room and outside food and drink are welcome. No alcohol! You can play as late as you like. Bring your own games or choose from among the club's library of almost 100 games.",
        },
        {
          id: 5,
          title: "Games Club of Maryland Brunswick",
          day: "Saturday",
          location: "122 West Potomac Street, · Brunswick, MD",
          summary: "Open board gaming for everyone.",
        },
      ],
      summary:
        "Make new friends and enjoy a wide variety of games ranging from classic party games to social non-commercial games to strategy games to games our members have invented themselves. Come share laughter and fun as we build friendships and memories!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 6,
      link: "https://www.meetup.com/mega-meeple-group/",
      locations: "Alexandria",
      events: [],
      title: "Meeple Board Game Group",
      summary:
        "This group is for experienced Euro style board gamers only. We play games like Terraforming Mars, Ark Nova, Obsession, Tapestry, Eclipse, Scythe, Forgotten Waters, Spirit Island with the average game around 2-4 hrs. This event is held at a members spacoise house in Alexandria and the address will be provided the day before the event. There is also a friendly dog in the house. Below are some important logistical details.Arrive on time! - we will typically wait about 15 minutes to begin playing. If you come much later than that games will be in progress and there is a high probability you won't be able to join a game.Ring the doorbell and if no one answers come in take off your shoes and make your way to the basement. You can also send a message on Meet up if you would prefer for someone to let you in. Light snacks and water will be available but feel free to bring something to share or drink. If you are new to a game that is being played please try and watch a how to play video ahead of time if you get a chance. Looking forward to meeting more gamers and playing more games. ",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 38,
      link: "http://novaboardgamegroup.com/2025-Winter-OpenGameSessions.pdf",
      locations: "Falls Church, Arlington",
      title: "NOVA BoardGame Group",
      events: [],
      summary:
        "Northern Virginia Board Game Group hosts public board game events in Arlington and Falls Church.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      events: [
        {
          id: 1,
          title: "Board Games @ Third Hill Brewing Co.",
          day: "Tuesday",
          location: "8216 Georgia Ave · Silver Spring, MD",
          summary:
            "Come out to Third Hill Brewing Company and play some board games! Serving food with their variety of drinks so come and fuel up for the games.\n\n",
        },
        {
          id: 2,
          title: "Board Games @ Silver Spring Library",
          day: "Saturday",
          location: "900 Wayne Ave · Silver Spring, MD",
          summary:
            "Grab a game or bring your own, this event is open play. Whether it is chucking dice, full of traitors, laying tiles, or only cards involved, it doesn't matter; as long as it is a fun game, let's get it to the table and play it.",
        },
      ],
      id: 2,
      link: "https://www.meetup.com/nontraditional-board-games/",
      locations: "Silver Spring",
      summary:
        "We are all about board games here. NonTraditional Board Games (NTBoardGames for short) is a group for people to come together, play board games, have fun, and meet new friends.\n\nThere's nothing wrong with Monopoly or Scattergories, but this group is focused on games you might've not heard before. Some of the games you can expect to play are Lords of Xidit, Tortuga 1667, Eldritch Horror, and many more.\n\nLet's Play Some Games!",
      title: "NonTraditional Board Games",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 25,
      link: "https://www.meetup.com/olney-board-games-meetup-group/",
      locations: "Olney",
      title: "Olney Board Games Meetup Group",
      events: [
        {
          id: 1,
          title: "Monday Night Board Gaming at Brew Belly in Olney",
          day: "Monday",
          location: "Brew Belly · Olney, MD",
          summary:
            "Join us between 6:00 and 9:30 to play nontraditional board games at Brew Belly restaurant in Olney, MD. Some games will be provided but please do bring along games you are interested in playing",
        },
      ],
      summary:
        "The goal of this group is to bring people together through games. This is a social group to meet other adults who enjoy board games. Typical play is nontraditional board and card games. Join us to learn new games and share some of your favorites. We will provide some games but ask that you also bring games that you would like to teach and play. The Meetup will be at Brew Belly in Olney on Monday evenings. Food and drink are available for purchase and help support the kind folks at this restaurant who are willing to set aside tables for us to play.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 37,
      link: "https://www.meetup.com/potomac-tea-and-knife-society/",
      locations: "Washington, DC",
      title: "Potomac Tea and Knife Society",
      events: [],
      summary:
        "The Potomac Tea and Knife Society is a local gaming group which focuses mostly on organizing Diplomacy games. Generally, we have Diplomacy games about once a month (though Diplomacy is definitely not the only game we play and enjoy during these get-togethers).\n\nWe are located all throughout Washington DC, Maryland, and Northern Virginia.\n\nAny and all interested players are welcome and invited! Whether you are an old hand looking to get into a game, or just interested in learning how to play, come to one of our gaming events.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 35,
      link: "https://www.meetup.com/round-hill-gaming/",
      locations: "Purcellville",
      title: "RTTG - Western Loudon Tabletop Games",
      events: [
        {
          id: 1,
          title: "Board games at Pville Library!",
          day: "Sunday",
          location: "220 E Main St · Purcellville, VA",
          summary:
            "Come play board games! Bring one to play and we will choose what to play. If there are enough people, we will break into groups and play multiple games! Games start within 15 minutes of the start time, so don’t be late!We play games like Ticket to Ride, Scythe, Splendor, 7 Wonders, Everdell, Twilight Imperium, Dominion, etc.",
        },
      ],
      summary:
        "Find people in and around western Loudoun County to play in person board games, table top role playing games, and other games. Join the Discord to be able to participate in choosing which games we play, and participate in more ad-hoc game sessions (sometimes people say \"hey I'm free tomorrow let's get together and game!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 21,
      link: "https://www.meetup.com/Reston-Gaming-Meetup-Group/",
      title: "Reston Gaming Meetup Group",
      locations: "Ashburn,Reston",
      events: [
        {
          id: 6,
          title: "Reston Plays Games",
          day: "Wednesday",
          location: "2310 Colts Neck Rd · Reston, VA",
          summary:
            "Come out to the Reston Community Center and play some games! Party games? Strategy games? Tabletop role-playing games? This massive space can accommodate games for every interest. While the event starts at 5pm, feel free to roll in whenever you are able! If you have games to bring that you'd like to share or run, please do!",
        },
        {
          id: 2,
          title: "Huzzah game night",
          day: "Thursday",
          location: "44927 George Washington Blvd · Ashburn, VA",
          summary:
            "Come join us for some fun and games at Huzzah Hobbies! We play a variety of games such as strategy, co-ops, or party games. This is a great way to meet new people, play some new games, and have some fun at the same time!",
        },
      ],
      summary:
        "Greetings and Salutations to all of you game lovers out there! Our purpose is to get groups together frequently to play games of any kind. Board games, card games, video games, computer games, or whatever we decide. I would like to emphasize the playing of board or card games that incorporate a lot of social interaction, so we can all have a great time!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 4,
      link: "https://www.meetup.com/rockville-gamers-we-have-cake/",
      locations: "Rockville",
      events: [
        {
          id: 1,
          title: "Sunday Boardgaming @ Panera",
          day: "Sunday",
          location: "1780 E Jefferson St · Rockville, MD",
          summary:
            "Open gaming at Panera! New players welcome. We have many games on hand or you can bring your own. We are happy to teach or learn one of yours.",
        },
      ],
      title: "Rockville Gamers - we have cake!",
      summary:
        "We're looking for some fun people to play games with! We welcome any local gamers of any age, in the Rockville, Silver Spring, Gaithersburg area.  We are primarily for playing in person, but we will adapt to online play as necessary.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 13,
      link: "https://www.meetup.com/rockville-strategy-games/",
      locations: "Rockville",
      title: "Rockville Strategy Games",
      events: [],
      summary:
        "This group is looking to build a community of friends and players that favor strategy games. The games run the gamut of gamedom: RPGs, card games, miniature wargames, board games, and video games. Basically all game types, except for gambling :P. On one side, we play RPGs which use pen and paper and require careful study of the rules system to craft a worthy character. At the middle of the road, we play commonly known board games which can cater to a casual audience. And yet on the other side, we play fast arcade style video games where one can easily pick up the control scheme. Bonus points for those with a penchant for game development, as some of the games are created in house and there are plans for a kickstarter campaign.\n\nI have been running gaming groups of different types since high school, and I've built up a plethora of niche gaming options. However, folks are still welcome to bring their own games, be it a board game or a video game, to break up the regular routine. There are no charges for game materials or entrance fees. You just have to show up!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 30,
      link: "https://www.meetup.com/table-games-meetup/",
      locations: "Alexandria,Frederick",
      title: "Table Games Meetup",
      events: [
        {
          id: 1,
          title:
            "ALEXANDRIA Play & Learn Boardgames, Strategy, Card, Euro Games",
          day: "Tuesday",
          location: "7905 Hilltop Village Center Dr · Alexandria, VA",
          summary:
            "This meetup is for people that want to play table games: board games, strategy games, episodic RPGs, eurogames, card games and co-operative games. NOT A GAMER BUT WANT TO LEARN? We teach them all...",
        },
        {
          id: 2,
          title:
            "Frederick Play & Learn Boardgames, Strategy, Card, Euro Games",
          day: "Thursday",
          location: "5500 Buckeystown Pike #804 · Frederick, MD",
          summary:
            "This Buckeystowne meetup is for people that want to LEARN AND PLAY table games: board games, strategy games, episodic RPGs, eurogames, card games and co-operative games. NOT A GAMER BUT WANT TO LEARN? We teach them all...",
        },
      ],
      summary:
        "We are a fun group of people who enjoy meeting friends for some good food and boardgames of all types.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 11,
      link: "https://www.meetup.com/dc-area-board-games/",
      locations: "Arlington,Falls Church",
      title: "The DC Area Board Game Club",
      events: [],
      summary:
        "This club is about bringing small groups of people together and playing some funpetitive games. Your organizer will lead in the fun while you relax and enjoy getting to know some new and interesting people. If you're an open-minded, fun-loving adult who values quality friendships then this is the Meetup group for you!",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 15,
      link: "https://www.meetup.com/boardgames-383/",
      locations: "Springfield",
      title: "The Fairfax Board Game Group",
      events: [],
      summary:
        "Come meet other nearby game players who also enjoy this hobby! \nEvents will be held in Fairfax County. Meeting locations include public libraries, homes, and friendly local game stores. Whether you prefer Catan, Risk, Ticket to Ride, Pandemic, or something else, join us for games and socializing.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 22,
      locations: "Ashburn,Herndon",
      link: "https://www.meetup.com/herndonboardgamegroup",
      title: "The Herndon Boardgame Group",
      events: [
        {
          id: 1,
          title: "Eurogames and Amerithrash at the Herndon Library",
          day: "Saturday",
          location: "768 Center Street · Herndon, VA",
          summary:
            "Join The Herndon Boardgame Group for a fun-filled day of Eurogames and Amerithrash style of gaming!",
        },
        {
          id: 2,
          title: "Herndon/Ashburn Boardgaming Group Meetup",
          day: "Thursday",
          location: "43881 Waxpool Rd · Ashburn, VA",
          summary:
            "Welcome, all, for another meetup at the lodge for another night of boardgaming! Open to anyone in either the Ashburn or Herndon Boardgaming groups and their guests. Bring whatever you want in the way of games, and we'll deal with food when we see how many are interested. I won't be there until 7:45, but John will be there at 7pm. The lodge officially closes at 11pm, so there will be a \"don't start new games after 10:30\" rule in effect. Hope to see everyone there!",
        },
      ],
      summary:
        "Heya Gamerinos!\n\nWe love boardgames of all types.  Not familiar with non-traditional board games? Check out the BoardGameGeek Wiki! https://boardgamegeek.com/wiki/page/Eurogame",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 28,
      link: "https://www.meetup.com/boardgamegroup/",
      locations: "Woodbridge",
      title: "The Prince William Boardgames Meetup Group",
      events: [],
      summary:
        "This group is for anyone interested in playing board games, party games, card games, classic games, Euro games, etc. We're a pretty laid back group so we may play a lot of Euro games at one event and lots of party games at another. It just depends on what people want to play at that event. Go with the flow. We also try to do events that either mix games with something else or just something else for fun. Singles or couples, all are welcome.",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 17,
      link: "https://www.meetup.com/northern-virginia-weeknight-euros-and-more/",
      locations: "Arlington",
      title: "Trains, Trade, Trouble: Eurogames and more",
      events: [],
      summary:
        "If you're a friendly person who enjoys medium and heavy weight European style strategy games, like Lisboa, Agricola, Terraforming Mars, Great Western Trail, and other games that get better with repeated plays, this may be the group for you. If you're someone who also enjoys thematic American style games like Eldritch Horror, Dune, and others? You should definitely join. And finally, if you're looking to try some war games, 18xx or even a legacy style game you've been dying to get to the table: welcome! Looking forward to meeting you! Over the next few months, we'll play games by modern masters Vital Lacerda, Uwe Rosenberg, Daniele Tascini, Alexander Pfister, as well as games by lesser known, but also great designers like Alexander Huemer. Plus, other fun stuff you want to play",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 36,
      link: "https://lu.ma/ts.gamenights",
      locations: "Sheperdstown",
      title: "Tri-State Game Nights",
      events: [
        {
          id: 8,
          title: "Weekly Wednesday",
          day: "Wednesday",
          location: "Swan Pond, West Virginia",
          summary:
            "Come play board games! Bring one to play and we will choose what to play. If there are enough people, we will break into groups and play multiple games! Games start within 15 minutes of the start time, so don’t be late!We play games like Ticket to Ride, Scythe, Splendor, 7 Wonders, Everdell, Twilight Imperium, Dominion, etc.",
        },
        {
          id: 10,
          title: "Public Night @ the Legion",
          day: "Wednesday",
          location: "Charles Town, West Virginia",
          summary:
            "The Charles Town American Legion opens their doors to our gaming community every other Friday, and we are able to gather on their second floor to play games. This is an open session style event where you may join and leave at any time (until our host locks up for the night). Grab your favorite games & friends and come say hi. Our events are open to the public - can't wait to meet you!",
        },
      ],
      summary:
        "In-person gaming events in the WV-VA-MD tristate intersection. Since 2020",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 12,
      link: "https://www.meetup.com/wr-board-game-friends-dc/",
      locations: "DC",
      title: "WR Board Game Friends (NOMA, DC)",
      events: [],
      summary:
        "If you've ever wanted to join a game night without having to round up players or read the rules ahead of time, this group is for you!\n\nI’ll be hosting game nights and other activities in the D.C. area, and you’re welcome to RSVP and join in. You’ll get to hang out with me and some friends I've met through other board game groups, and we’re always excited to meet new people.\nSome game nights will be open to everyone, while others may have attendance limits depending on the game. My goal is to keep the calendar full so you can pick and choose the events that work best for you",
    },
    frontendState: {
      isVisible: false,
    },
  },
  {
    data: {
      id: 32,
      link: "https://www.meetup.com/woodbridge-tabletop-game-night/",
      locations: "Woodbridge",
      title: "Woodbridge Tabletop Game Night",
      events: [
        {
          id: 1,
          title: "Game Night in Lake Ridge",
          day: "Saturday",
          location: "Lake Ridge, VA",
          summary:
            "Welcome! We're a group of gamers that play board games of varying levels of intensity and difficulty. Take a look below to see a sample of the board games we play, and you may also feel free to bring your own. If you don't know how to play, don't worry, we'll teach you! \nMelissa always has paper plates, napkins, cups, etc. on hand, as well as water and soda, and everyone usually brings some kind of snack. You're not expected to, but it is always welcome.\n On the day of the event, an email will be sent with an address and parking instructions. If you don't get it by 4, please check your junk mail folder. Please note there will be a small and very friendly Shetland Sheepdog present.",
        },
      ],
      summary:
        "We are looking to make friends, have fun, and play board games! We have a wide selection and all our members are welcome to bring their own games. We are willing to teach and learn as needed and usually we have at least two and sometimes three games going at once. We also enjoy having themed game nights and even do occasional field trips to movies, game taverns, and more! ",
    },
    frontendState: {
      isVisible: false,
    },
  },
];
