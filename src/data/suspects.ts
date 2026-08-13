import type { Suspect } from "@/types";

export const suspects: Suspect[] = [
  {
    id: "suspect_rahul",
    name: "Rahul Sen",
    age: 31,
    occupation: "UX Designer",
    relationshipToVictim: "Boyfriend",
    knownLocation: "Claims to have been home alone",
    motive: "Jealousy / recent tension over Neha being secretive",
    statements: [
      {
        id: "stmt_rahul_1",
        text: "I was home alone the whole night. I didn't even talk to her after 9.",
        trueMeaning:
          "False — he left at 10:51 PM to pick Neha up and drive her to safety, and is protecting the escape plan.",
      },
    ],
    relatedEvidence: ["clue_06", "clue_07"],
    isActuallyResponsible: false,
    interrogationTopics: [
      {
        id: "rahul_topic_wifi",
        label: "Your Wi-Fi log says otherwise.",
        keywords: ["wifi", "wi-fi", "router", "network", "home", "alone", "10:51", "left"],
        response:
          "...Fine. I left. Around eleven. But it's not what it looks like — I wasn't near her building, and I had nothing to do with whatever happened to her.",
        tone: "nervous",
        relatedClueIds: ["clue_06"],
        unlocksAfterClueId: "clue_06",
        revealsClueIds: ["clue_07"],
      },
      {
        id: "rahul_topic_neha",
        label: "How was Neha, lately?",
        keywords: ["neha", "lately", "acting", "behavior", "distracted", "secretive", "mood"],
        response:
          "Distracted. Secretive, honestly. She'd go quiet mid-conversation, like she was somewhere else in her head. I thought it was us. It wasn't about us.",
        tone: "calm",
        relatedClueIds: ["clue_06"],
        unlocksAfterClueId: "clue_06",
      },
      {
        id: "rahul_topic_driver",
        label: "A delivery driver placed a car near her building.",
        keywords: ["driver", "delivery", "car", "sighting", "block", "seen", "11:10"],
        response:
          "I'm not going to answer that. Ask me something else.",
        tone: "hostile",
        relatedClueIds: ["clue_07"],
        unlocksAfterClueId: "clue_07",
      },
    ],
    evidenceReactions: [
      {
        clueId: "clue_06",
        reaction: "That's... okay, that's my Wi-Fi log. I can't explain that away, can I.",
        tone: "cornered",
        pressureValue: 3,
      },
      {
        clueId: "clue_07",
        reaction: "A driver saw a car? That could be anyone's car. This building has a hundred units.",
        tone: "defensive",
      },
    ],
    defaultEvidenceReaction: "I don't see what that has to do with me.",
    confusedResponse: "I don't— what are you even asking me?",
    stonewallResponse: "I'm not talking about that until you've actually got something. Ask me something real.",
    breakthroughResponse:
      "Okay. Okay — I left to pick her up. She asked me to. She said she needed to disappear for a few days and I didn't ask why, I just drove. I've been protecting her plan this whole time, not myself.",
  },
  {
    id: "suspect_tara",
    name: "Tara Bhatt",
    age: 30,
    occupation: "Corporate Lawyer",
    relationshipToVictim: "Best friend / downstairs neighbor",
    knownLocation: "Own apartment, two floors below Neha's",
    motive: "Unclear at first — has access, technical skill, and an unexplained absence window",
    statements: [
      {
        id: "stmt_tara_1",
        text: "I was in my apartment all night. I don't really remember stepping out.",
        trueMeaning:
          "False by omission — she left specifically to run the phone-mirroring session that faked Neha's 11:42 PM text.",
      },
    ],
    relatedEvidence: ["clue_04", "clue_14"],
    isActuallyResponsible: false,
    interrogationTopics: [
      {
        id: "tara_topic_fob",
        label: "Your fob log shows you left your floor at 11:38.",
        keywords: ["fob", "access", "left", "floor", "apartment", "11:38", "out", "leave"],
        response:
          "You have a lot of logs for someone who thinks Neha's missing. Fine — I stepped out for a few minutes. It has nothing to do with her.",
        tone: "evasive",
        relatedClueIds: ["clue_14"],
        unlocksAfterClueId: "clue_14",
      },
      {
        id: "tara_topic_mirroring",
        label: "Explain the phone-mirroring login.",
        keywords: ["mirroring", "mirror", "login", "phone", "app", "session", "text", "11:42"],
        response:
          "I— that's private. It's not what you think it is. I'm not saying anything else without a lawyer in the room.",
        tone: "nervous",
        relatedClueIds: ["clue_04"],
        unlocksAfterClueId: "clue_04",
        revealsClueIds: ["clue_14"],
      },
      {
        id: "tara_topic_friendship",
        label: "How well do you know Neha?",
        keywords: ["friend", "friendship", "know", "close", "relationship", "downstairs"],
        response:
          "Better than anyone in this building. If something happened to her, I'd know. I'd feel it.",
        tone: "defensive",
        relatedClueIds: ["clue_14"],
        unlocksAfterClueId: "clue_14",
      },
    ],
    evidenceReactions: [
      {
        clueId: "clue_04",
        reaction: "You found the login. Fine. I ran the mirroring session. It wasn't to hurt her.",
        tone: "cornered",
        pressureValue: 3,
      },
      {
        clueId: "clue_14",
        reaction: "My fob log shows I left my floor. That's not a crime. People leave their apartments.",
        tone: "defensive",
      },
    ],
    defaultEvidenceReaction: "I'm not sure what you want me to say about that.",
    confusedResponse: "I'm sorry, I don't follow what you're asking.",
    stonewallResponse: "I don't know what you want me to say to a question like that. Come back when you've got something.",
    breakthroughResponse:
      "She came to me first. Before Rahul, before any of it. I ran the mirroring session so we could fake the 11:42 text — plant it, then let her actually leave at 10:55, clean. I did it because she asked, and because I believed her.",
  },
  {
    id: "suspect_vikram",
    name: "Vikram Nair",
    age: 42,
    occupation: "Head of Corporate Security, Vantage Clear",
    relationshipToVictim: "None personally — connected only through employer",
    knownLocation: "Building facilities fob places him on-site 10:48–11:19 PM",
    motive: "None personal — acting on orders from Arjun Mehra",
    statements: [
      {
        id: "stmt_vikram_1",
        text: "I don't have anything to say about that night.",
        trueMeaning:
          "Evasive because admitting his real reason for being there implicates him in breaking and entering, not because he harmed Neha.",
      },
    ],
    relatedEvidence: ["clue_01", "clue_08"],
    isActuallyResponsible: true,
    interrogationTopics: [
      {
        id: "vikram_topic_fob",
        label: "Your fob placed you there for thirty minutes.",
        keywords: ["fob", "access", "building", "entry", "thirty", "minutes", "10:48", "11:19"],
        response:
          "I was doing my job. That's the extent of what I'm prepared to say without counsel present.",
        tone: "evasive",
        relatedClueIds: ["clue_08"],
        unlocksAfterClueId: "clue_08",
      },
      {
        id: "vikram_topic_door",
        label: "The lock damage report matches forced entry.",
        keywords: ["door", "lock", "damage", "forced", "entry", "break"],
        response:
          "...I was sent to retrieve something. That's the truth. I never touched her, and I never saw her.",
        tone: "nervous",
        relatedClueIds: ["clue_01"],
        unlocksAfterClueId: "clue_01",
        revealsClueIds: ["clue_08"],
      },
      {
        id: "vikram_topic_arjun",
        label: "Did Arjun Mehra send you there?",
        keywords: ["arjun", "mehra", "orders", "send", "boss", "instructed", "instructions"],
        response:
          "I take instructions from corporate security leadership. I'm not going to elaborate further.",
        tone: "defensive",
        relatedClueIds: ["clue_08"],
        unlocksAfterClueId: "clue_08",
        revealsClueIds: ["clue_09"],
      },
    ],
    evidenceReactions: [
      {
        clueId: "clue_01",
        reaction: "The lock, yes. I forced it. I didn't want to, but I had a job to finish.",
        tone: "cornered",
        pressureValue: 3,
      },
      {
        clueId: "clue_08",
        reaction: "My fob puts me there for thirty minutes, correct. Doing my job. Nothing more.",
        tone: "defensive",
      },
    ],
    defaultEvidenceReaction: "That's outside what I'm able to discuss.",
    confusedResponse: "That's not a question I understand.",
    stonewallResponse: "I'm not confirming or denying anything without something in front of me.",
    breakthroughResponse:
      "Fine. Arjun told me to search her apartment for whatever she'd taken from the servers — documents, drives, anything. I broke the lock, searched the place, found nothing, and left. I never touched her. I never saw her. That's the whole of it.",
  },
  {
    id: "suspect_priya",
    name: "Priya Desai",
    age: 45,
    occupation: "CFO, Vantage Clear",
    relationshipToVictim: "Neha's employer (finance leadership)",
    knownLocation: "Office, per company records",
    motive: "Protecting her equity and career ahead of a funding round",
    statements: [
      {
        id: "stmt_priya_1",
        text: "Neha and I disagreed about how to read some vendor numbers. That's all it was.",
        trueMeaning:
          "True but incomplete — she was complicit in signing off on the fraud, but had no knowledge of or involvement in Vikram's break-in.",
      },
    ],
    relatedEvidence: ["clue_10", "clue_11", "clue_12"],
    isActuallyResponsible: false,
    interrogationTopics: [
      {
        id: "priya_topic_invoices",
        label: "Your signature is on the Corebridge invoices.",
        keywords: ["invoice", "invoices", "signature", "sign", "corebridge", "vendor"],
        response:
          "Neha and I disagreed about how to read some vendor numbers. That's all it was.",
        tone: "defensive",
        relatedClueIds: ["clue_11"],
        unlocksAfterClueId: "clue_11",
      },
      {
        id: "priya_topic_call",
        label: "We have a recording of your call with her.",
        keywords: ["call", "recording", "recorded", "phone call", "let it go", "picture"],
        response:
          "...I asked her to let it go until after the funding round closed. I'm not proud of that call. But I never went near her apartment.",
        tone: "nervous",
        relatedClueIds: ["clue_12"],
        unlocksAfterClueId: "clue_12",
      },
      {
        id: "priya_topic_vikram",
        label: "Did you know about the break-in?",
        keywords: ["vikram", "break-in", "break in", "know", "apartment", "search"],
        response:
          "No. God, no. If Vikram did something like that, that was Arjun's call, not mine.",
        tone: "evasive",
        relatedClueIds: ["clue_08"],
        unlocksAfterClueId: "clue_08",
      },
    ],
    evidenceReactions: [
      {
        clueId: "clue_11",
        reaction: "That's my signature, yes. I flagged the numbers to legal. Quietly.",
        tone: "cornered",
        pressureValue: 3,
      },
      {
        clueId: "clue_12",
        reaction: "You have the call. Then you already know what I said, and how I feel about it.",
        tone: "nervous",
      },
    ],
    defaultEvidenceReaction: "I don't think that changes anything about what I've told you.",
    confusedResponse: "I'm not sure what you're getting at.",
    stonewallResponse: "I'd rather not speculate without you showing me what you actually have.",
    breakthroughResponse:
      "I signed off on inflated Corebridge invoices for over a year, to protect the round. Neha found it and wouldn't let it go. I asked her to sit on it. She wouldn't. That's the worst thing I did — I never went near her apartment, and I didn't know Vikram had.",
  },
  {
    id: "suspect_arjun",
    name: "Arjun Mehra",
    age: 38,
    occupation: "CEO, Vantage Clear",
    relationshipToVictim: "Neha's employer",
    knownLocation: "Publicly cooperative, no direct on-site presence claimed",
    motive: "Concealing a ₹40 crore fraud scheme ahead of a funding round",
    statements: [
      {
        id: "stmt_arjun_1",
        text: "This is a tragedy. Whatever the company can do to help find her, we will.",
        trueMeaning:
          "Genuinely doesn't know what happened to Neha — believes Vikram's search was quiet and unconnected to any disappearance.",
      },
    ],
    relatedEvidence: ["clue_08", "clue_09", "clue_10"],
    isActuallyResponsible: true,
    interrogationTopics: [
      {
        id: "arjun_topic_deletion",
        label: "Someone wiped server logs the night she vanished.",
        keywords: ["deletion", "delete", "server", "logs", "wiped", "files", "11:52"],
        response:
          "I authorized a routine data retention cleanup. If the timing looks bad, I understand that — but it had nothing to do with Neha personally.",
        tone: "defensive",
        relatedClueIds: ["clue_09"],
        unlocksAfterClueId: "clue_09",
      },
      {
        id: "arjun_topic_vikram",
        label: "You sent Vikram into her apartment.",
        keywords: ["vikram", "security", "sent", "apartment", "search", "authorize"],
        response:
          "I asked security to confirm whether she'd taken company materials. I did not authorize anyone to hurt her. I didn't think anyone would.",
        tone: "nervous",
        relatedClueIds: ["clue_08"],
        unlocksAfterClueId: "clue_08",
      },
      {
        id: "arjun_topic_fraud",
        label: "The Corebridge invoices point to fraud.",
        keywords: ["fraud", "corebridge", "invoices", "money", "40 crore", "vendor"],
        response:
          "I have nothing further to say about ongoing vendor matters without our counsel present.",
        tone: "hostile",
        relatedClueIds: ["clue_10"],
        unlocksAfterClueId: "clue_10",
        revealsClueIds: ["clue_11", "clue_13", "clue_09"],
      },
    ],
    evidenceReactions: [
      {
        clueId: "clue_09",
        reaction: "The deletion log. I authorized that cleanup myself, yes.",
        tone: "defensive",
      },
      {
        clueId: "clue_08",
        reaction: "You want me to explain why my head of security was in her apartment. Get counsel in the room first.",
        tone: "cornered",
        pressureValue: 3,
      },
    ],
    defaultEvidenceReaction: "I'm not commenting on that without our counsel present.",
    confusedResponse: "I don't think that's a fair question as phrased.",
    stonewallResponse: "I'm not going to respond to that without documentation in front of me.",
    breakthroughResponse:
      "I sent Vikram to search her apartment for anything she'd copied off our servers before it reached a journalist. I was protecting the round, not covering up what happened to Neha — because I still don't know what happened to Neha. I want that on the record.",
  },
  {
    id: "suspect_sameer",
    name: "Sameer Joshi",
    age: 26,
    occupation: "Night Security Guard",
    relationshipToVictim: "None — building staff",
    knownLocation: "Front desk / building rounds",
    motive: "None related to the case — unrelated personal deception",
    statements: [
      {
        id: "stmt_sameer_1",
        text: "I did my usual rounds that night, nothing out of the ordinary.",
        trueMeaning:
          "False — he let his girlfriend in unofficially around 11 PM and falsified his rounds log to avoid disciplinary trouble. Unrelated to Neha.",
      },
    ],
    relatedEvidence: ["clue_15"],
    isActuallyResponsible: false,
    interrogationTopics: [
      {
        id: "sameer_topic_log",
        label: "The guard log doesn't match the resident statements.",
        keywords: ["log", "rounds", "guard", "resident", "match", "floor", "desk"],
        response:
          "Okay — look, that's personal, it's got nothing to do with the Kapoor case. Please don't put this in the report.",
        tone: "nervous",
        relatedClueIds: ["clue_15"],
        unlocksAfterClueId: "clue_15",
      },
      {
        id: "sameer_topic_neha",
        label: "Did you see Neha leave that night?",
        keywords: ["neha", "leave", "see", "saw", "exit", "night"],
        response:
          "Honestly? I wasn't at the desk the whole time. I can't swear to every minute.",
        tone: "evasive",
        relatedClueIds: ["clue_15"],
        unlocksAfterClueId: "clue_15",
      },
    ],
    evidenceReactions: [
      {
        clueId: "clue_15",
        reaction: "Alright — alright. My girlfriend. I let her in around eleven and fudged the rounds log. That's the whole of it, I swear.",
        tone: "cornered",
        pressureValue: 3,
      },
    ],
    defaultEvidenceReaction: "I don't know what to tell you about that.",
    confusedResponse: "Uh — I don't really get what you're asking.",
    stonewallResponse: "Look, I'm not going to just volunteer stuff. Show me why you're asking.",
    breakthroughResponse:
      "It's embarrassing, not criminal. I let my girlfriend in through the side door, we sat in the break room for maybe forty minutes, and I backfilled the log so my supervisor wouldn't clock it. I never left the building unattended for more than a couple minutes, and I never saw anything happen to Neha.",
  },
];
