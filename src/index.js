const inputField = document.getElementById("input");

inputField.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    let input = inputField.value;
    inputField.value = "";
    output(input);
  }
});

function output(input) {
  let product;

  // Regex remove non word/space chars
  // Trim trailing whitespce
  // Remove digits - not sure if this is best
  // But solves problem of entering something like 'hi1'

  let text = input
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/[\d]/gi, "")
    .trim();
  text = text
    .replace(/ ein /g, " ")
    .replace(/ eine /g, " ")
    .replace(/ einen /g, " ")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00e4/g, "ae")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00df/g, "ss")
    .replace(/ mir /g, " ")
    .replace(/ 's` /g, " ")
    .replace(/gehts/g, "geht es")
    .replace(/bitte /g, "")
    .replace(/ bitte/g, "");
  if (compare(prompts, replies, text)) {
    // Search for exact match in `prompts`
    product = compare(prompts, replies, text);
  } else if (text.match(/(schimmel)/gi)) {
    product = schimmel;
  } else if (text.match(/(laerm|laut|poltern|trampeln|trampelt)/gi)) {
    product = laerm;
  } else if (text.match(/(protokoll)/gi)) {
    product = protokoll;
  } else if (text.match(/(insekten|schaben|kakerlaken|viecher|tiere)/gi)) {
    product = insekten;
  } else if (text.match(/(wasser)/gi)) {
    product = wasser;
  } else if (text.match(/(heizung)/gi)) {
    product = heizung;
  } else if (text.match(/danke/gi)) {
    product = "Gern geschehen.";
  } else if (text.match(/(mangel|schaden|minderung|wohnung|hilfe|helf)/gi)) {
    product = mangelbot;
  } else {
    // If all else fails: random alternative
    product = alternative[Math.floor(Math.random() * alternative.length)];
  }

  // Update DOM
  addChat(input, product);
}

function compare(promptsArray, repliesArray, string) {
  let reply;
  let replyFound = false;
  for (let x = 0; x < promptsArray.length; x++) {
    for (let y = 0; y < promptsArray[x].length; y++) {
      if (promptsArray[x][y] === string) {
        let replies = repliesArray[x];
        reply = replies[Math.floor(Math.random() * replies.length)];
        replyFound = true;
        // Stop inner loop when input value matches prompts
        break;
      }
    }
    if (replyFound) {
      // Stop outer loop when reply is found instead of interating through the entire array
      break;
    }
  }
  return reply;
}

function addChat(input, product) {
  const messagesContainer = document.getElementById("messages");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botImg = document.createElement("img");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botImg.src = "./bot-mini.png";
  botImg.className = "avatar";
  botDiv.className = "bot response";
  botText.innerText = "Schreibe...";
  botDiv.appendChild(botText);
  botDiv.appendChild(botImg);
  messagesContainer.appendChild(botDiv);
  // Keep messages at most recent
  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;

  // Fake delay to seem "real"
  setTimeout(() => {
    botText.innerText = `${product}`;
    textToSpeech(product);
  }, 2000);
}

// Options the user could type in
const prompts = [
  ["hi", "hey", "hallo", "guten morgen", "guten tag"],
  ["was kannst du", "wobei kannst du helfen", "kannst du helfen"],
  ["wie geht es dir", "wie geht es"],
  ["was machst du gerade", "was ist los", "was machst du"],
  ["wie alt bist du"],
  ["ich bin gluecklich", "gut", "toll", "wunderbar", "fantastisch", "super"],
  ["schlecht", "traurig", "nicht so gut", "ich bin muede"],
  ["wer bist du", "bist du mensch", "bist du bot", "bist du mensch oder bot"],
  ["wer hat dich erschaffen", "wer hat dich gebaut", "wer hat dich gemacht"],
  ["wie ist dein name", "dein name", "wie heisst du", "wie wirst du genannt"],
  ["ah", "ja", "ok", "okay"],
  ["bye", "tschuess", "auf wiedersehen", "bis spaeter"],
  [""],
  ["haha", "ha", "lol", "hehe", "witzig"],
  ["klein"],
  ["mittel"],
  ["gross", "riesig"],
  ["silberfische"],
  ["kakerlaken", "schaben"],
  ["ratten"],
  ["ameisen"],
  ["wespen"],
];

// Possible responses, in corresponding order

const replies = [
  ["Hallo!", "Hi!", "Hey!", "Guten Tag!", "Moin, moin!"],
  [
    "Ich bin ein Mangelbot. Frag mich gerne etwas zu Mängeln in deiner Wohnung.",
    "Ich kann dir sagen, welche Ansprüche du gegen deinen Vermietern bei Mängeln in der Wohnung hast. Frag mich gern.",
    "Ich prüfe deine Mietmängel. Frag mich gern.",
  ],
  [
    "Gut, wie geht es dir?",
    "Ganz gut. Wie geht es dir?",
    "Super! Wie geht es dir?",
  ],
  [
    "Ich lese die aktuellen Mietrechtsurteile.",
    "Ich update meine Datenbank mit spannenden Gerichtsentscheidungen.",
    "Ich warte auf deine Fragen.",
    "Ich warte gespannt auf deine Problemstellung.",
  ],
  ["Ich bin noch ganz jung."],
  ["Das freut mich.", "Das ist schön."],
  [
    "Das ist schade, lass mich dir helfen.",
    "Das ist schade. Bei Mängeln kann ich dir helfen!",
  ],
  ["Ich bin nur ein Bot.", "Ich bin ein Bot. Was bist du?"],
  ["Code läuft durch meine Venen."],
  ["Ich bin der Mangelbot", "Man nennt mich Mangelbot"],
  [
    "Schildere mir dein Problem mit Mietmängeln.",
    "Hast du Mängel in deiner Wohnung?",
    "Zu welchen Mängeln möchtest du eine Auskunft?",
  ],
  ["Tschüss.", "Bis zum nächsten Mal.", "Auf Wiedersehen."],
  ["Frag mich gerne etwas."],
  ["Haha!"],
  [
    "Eine Mietminderung könnte bis zu 10% deiner Bruttomiete betragen. Melde den Schimmel deinem Vermieter.",
  ],
  [
    "Eine Mietminderung könnte bis zu 40% deiner Bruttomiete betragen. Melde den Schimmel deinem Vermieter.",
  ],
  [
    "Eine Mietminderung könnte bis zu 100% deiner Bruttomiete betragen. Melde den Schimmel deinem Vermieter.",
  ],
  [
    "Silberfische berechtigten nur bei einer großen Anzahl zu einer Mietminderung. Solltest du täglich mehrere davon finden, könnte ein Mangel vorliegen. Sprich mit deinem Vermieter.",
  ],
  [
    "Kakerlaken und Schaben sind schon bei einem geringen Befall ein Mangel. Wenn diese nicht durch dich selbst eingeschleppt wurden, könnte dies zu einer Mietminderung berechtigen. Sprich mit deinem Vermieter.",
  ],
  [
    "Ein Rattenbefall in der Wohnung berechtigt zur Mietminderung. Sprich mit deinem Vermieter.",
  ],
  [
    "Ameisen berechtigen nur zur Mietminderung, wenn ein großer Befall vorliegt und sie nicht nur vereinzelt auftreten. Sprich mit deinem Vermieter.",
  ],
  [
    "Ein Wespennest auf deinem Balkon, Terasse oder Garten berechtigt zu einer Mietminderung. Wespen sind nach dem Bundesnaturschutzgesetz geschützt, als wild lebende Tiere dürfen sie nicht mutwillig beunruhigt, gefangen, verletzt oder getötet werden. Sprich mit deinem Vermieter, sodass er sie artgerecht entfernen lassen kann.",
  ],
];

// Random for any other user input

const alternative = [
  "Formuliere das bitte etwas einfacher oder nutze bitte eine der vorgegebenen Antwortmöglichkeiten.",
  "Das verstehe ich leider nicht.",
];

// Whatever else you want :)

const schimmel = [
  "Schimmel kann zu einer Mietminderung berechtigen, wenn du ihn durch konsequentes Lüften nicht beseitigt bekommst. Die Höhe richtet sich nach der Größe. Ist der Befall klein, mittel oder riesig, im Vergleich zur gesamten Wohnung?",
];

const laerm = [
  "Lärmbelästigungen von Nachbarn können zu einer Mietminderung berechtigen, wenn sie über das normale Maß hinausgehen, vor allem zu Ruhezeiten. Du solltest ein Protokoll führen.",
];

const protokoll = [
  "In einem Lärmprotokoll sollten die Zeit, Dauer und Art des Lärms beschrieben werden. Lass es von weiteren Nachbarn unterzeichnen und leg es deinem Vermieter vor.",
];

const insekten = [
  "Ein starker Schädlingsbefall kann zur Mietminderung berechtigen. Um welche Art von Schädlingen handelt es sich? Silberfische, Kakerlaken, Schaben, Ratten, Ameisen, Wespen.",
];

const heizung = [
  "Sofern Wohnräume nicht über 20 Grad und Schlafräume nicht über 18 Grad beheizt werden können, liegt ein Mangel und damit ein Grund zur Mietminderung vor. Wenn die Wohnung in Wintermonaten eiskalt ist, kann diese bis zu 100% der Bruttomiete betragen. Melde dies deinem Vermieter.",
];

const wasser = [
  "Bei Ausfall des Warmwassers ist eine Minderung bis zu 15% der Bruttomiete möglich. Bei komplettem Wasserausfall ist eine Minderung von 50% der Bruttomiete und mehr möglich.",
];

const mangelbot = [
  "Frage mich gern etwas zu dem Thema Mietmängel. Zum Beispiel zu: Schimmel, Insektenbefall, Wasserausfall, Heizungsausfall oder Lärmbelästigungen.",
];
// Text to Speech

const synth = window.speechSynthesis;

const textToSpeech = (string) => {
  let voice = new SpeechSynthesisUtterance(string);
  voice.text = string;
  voice.lang = "de";
  voice.volume = 1;
  voice.rate = 1;
  voice.pitch = 1; // Can be 0, 1, or 2
  synth.speak(voice);
};
