// Word bank: generic categories/words only (no brands/trademarks/celebrities)
// to keep this freely shareable and copyright-safe.
const WORD_CATEGORIES = {
  "Food & Drink": [
    "Pizza", "Sushi", "Taco", "Pancake", "Burger", "Ice Cream", "Coffee",
    "Spaghetti", "Salad", "Sandwich", "Donut", "Soup", "Steak", "Popcorn",
    "Cheese", "Smoothie", "Curry", "Waffle", "Bacon", "Lemonade"
  ],
  "Animals": [
    "Elephant", "Penguin", "Kangaroo", "Octopus", "Giraffe", "Dolphin",
    "Tiger", "Owl", "Hedgehog", "Crocodile", "Flamingo", "Koala",
    "Squirrel", "Peacock", "Otter", "Camel", "Bat", "Rhino", "Turtle", "Fox"
  ],
  "Places": [
    "Beach", "Airport", "Hospital", "Library", "Casino", "Campsite",
    "Museum", "Stadium", "Farm", "Submarine", "Space Station", "Prison",
    "Castle", "Theme Park", "Ski Resort", "Volcano", "Cruise Ship",
    "Desert Island", "Rainforest", "Subway Station"
  ],
  "Occupations": [
    "Firefighter", "Surgeon", "Pilot", "Chef", "Teacher", "Detective",
    "Astronaut", "Plumber", "Lifeguard", "Photographer", "Electrician",
    "Farmer", "Dentist", "Librarian", "Tailor", "Zookeeper", "Referee",
    "Barista", "Journalist", "Translator"
  ],
  "Sports & Games": [
    "Soccer", "Basketball", "Chess", "Bowling", "Surfing", "Boxing",
    "Golf", "Archery", "Skateboarding", "Volleyball", "Fencing",
    "Rock Climbing", "Table Tennis", "Hockey", "Darts", "Gymnastics",
    "Karate", "Rowing", "Badminton", "Sledding"
  ],
  "Everyday Objects": [
    "Umbrella", "Backpack", "Toothbrush", "Flashlight", "Pillow",
    "Scissors", "Mirror", "Candle", "Wallet", "Ladder", "Blender",
    "Headphones", "Stapler", "Thermometer", "Vacuum", "Keychain",
    "Suitcase", "Alarm Clock", "Umbrella Stand", "Frying Pan"
  ],
  "Nature & Weather": [
    "Thunderstorm", "Rainbow", "Avalanche", "Waterfall", "Earthquake",
    "Tornado", "Glacier", "Sunrise", "Blizzard", "Volcano Eruption",
    "Fog", "Hurricane", "Meadow", "Coral Reef", "Canyon", "Aurora",
    "Drought", "Monsoon", "Geyser", "Tidal Wave"
  ],
  "Fantasy & Myth": [
    "Dragon", "Wizard", "Mermaid", "Vampire", "Ghost", "Unicorn",
    "Werewolf", "Fairy", "Genie", "Phoenix", "Zombie", "Witch",
    "Giant", "Goblin", "Sorcerer", "Centaur", "Knight", "Troll",
    "Elf", "Mummy"
  ],
  "Transportation": [
    "Bicycle", "Helicopter", "Submarine", "Hot Air Balloon", "Train",
    "Rocket", "Skateboard", "Sailboat", "Motorcycle", "Tractor",
    "Cable Car", "Canoe", "Scooter", "Blimp", "Snowmobile",
    "Golf Cart", "Ferry", "Rickshaw", "Segway", "Bulldozer"
  ],
  "School & Work": [
    "Homework", "Meeting", "Deadline", "Exam", "Presentation",
    "Internship", "Recess", "Graduation", "Interview", "Overtime",
    "Whiteboard", "Cubicle", "Backpack", "Report Card", "Lecture",
    "Group Project", "Coffee Break", "Promotion", "Detention", "Syllabus"
  ]
};

const CATEGORY_NAMES = Object.keys(WORD_CATEGORIES);
