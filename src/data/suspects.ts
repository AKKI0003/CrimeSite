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
        id: "rahul_topic_alibi",
        label: "Where were you that night?",
        response:
          "Home. I told you — home, alone, the whole night. I didn't even talk to her after nine.",
        tone: "defensive",
      },
      {
        id: "rahul_topic_wifi",
        label: "Your Wi-Fi log says otherwise.",
        response:
          "...Fine. I left. Around eleven. But it's not what it looks like — I wasn't near her building, and I had nothing to do with whatever happened to her.",
        tone: "nervous",
        relatedClueIds: ["clue_06"],
        unlocksAfterClueId: "clue_06",
      },
      {
        id: "rahul_topic_neha",
        label: "How was Neha, lately?",
        response:
          "Distracted. Secretive, honestly. She'd go quiet mid-conversation, like she was somewhere else in her head. I thought it was us. It wasn't about us.",
        tone: "calm",
      },
      {
        id: "rahul_topic_driver",
        label: "A delivery driver placed a car near her building.",
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
        id: "tara_topic_alibi",
        label: "Where were you that night?",
        response:
          "In my apartment. I don't really remember stepping out — it was a normal night, until it wasn't.",
        tone: "calm",
      },
      {
        id: "tara_topic_fob",
        label: "Your fob log shows you left your floor at 11:38.",
        response:
          "You have a lot of logs for someone who thinks Neha's missing. Fine — I stepped out for a few minutes. It has nothing to do with her.",
        tone: "evasive",
        relatedClueIds: ["clue_14"],
        unlocksAfterClueId: "clue_14",
      },
      {
        id: "tara_topic_mirroring",
        label: "Explain the phone-mirroring login.",
        response:
          "I— that's private. It's not what you think it is. I'm not saying anything else without a lawyer in the room.",
        tone: "nervous",
        relatedClueIds: ["clue_04"],
        unlocksAfterClueId: "clue_04",
      },
      {
        id: "tara_topic_friendship",
        label: "How well do you know Neha?",
        response:
          "Better than anyone in this building. If something happened to her, I'd know. I'd feel it.",
        tone: "defensive",
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
        id: "vikram_topic_generic",
        label: "What happened that night?",
        response: "I don't have anything to say about that night.",
        tone: "hostile",
      },
      {
        id: "vikram_topic_fob",
        label: "Your fob placed you there for thirty minutes.",
        response:
          "I was doing my job. That's the extent of what I'm prepared to say without counsel present.",
        tone: "evasive",
        relatedClueIds: ["clue_08"],
        unlocksAfterClueId: "clue_08",
      },
      {
        id: "vikram_topic_door",
        label: "The lock damage report matches forced entry.",
        response:
          "...I was sent to retrieve something. That's the truth. I never touched her, and I never saw her.",
        tone: "nervous",
        relatedClueIds: ["clue_01"],
        unlocksAfterClueId: "clue_01",
      },
      {
        id: "vikram_topic_arjun",
        label: "Did Arjun Mehra send you there?",
        response:
          "I take instructions from corporate security leadership. I'm not going to elaborate further.",
        tone: "defensive",
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
        id: "priya_topic_relationship",
        label: "What was your relationship with Neha?",
        response:
          "She reported into finance for vendor reconciliation. Professional, mostly cordial. We disagreed near the end.",
        tone: "calm",
      },
      {
        id: "priya_topic_invoices",
        label: "Your signature is on the Corebridge invoices.",
        response:
          "Neha and I disagreed about how to read some vendor numbers. That's all it was.",
        tone: "defensive",
        relatedClueIds: ["clue_11"],
        unlocksAfterClueId: "clue_11",
      },
      {
        id: "priya_topic_call",
        label: "We have a recording of your call with her.",
        response:
          "...I asked her to let it go until after the funding round closed. I'm not proud of that call. But I never went near her apartment.",
        tone: "nervous",
        relatedClueIds: ["clue_12"],
        unlocksAfterClueId: "clue_12",
      },
      {
        id: "priya_topic_vikram",
        label: "Did you know about the break-in?",
        response:
          "No. God, no. If Vikram did something like that, that was Arjun's call, not mine.",
        tone: "evasive",
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
        id: "arjun_topic_statement",
        label: "Do you know what happened to Neha?",
        response:
          "This is a tragedy. Whatever the company can do to help find her, we will. I mean that.",
        tone: "calm",
      },
      {
        id: "arjun_topic_deletion",
        label: "Someone wiped server logs the night she vanished.",
        response:
          "I authorized a routine data retention cleanup. If the timing looks bad, I understand that — but it had nothing to do with Neha personally.",
        tone: "defensive",
        relatedClueIds: ["clue_09"],
        unlocksAfterClueId: "clue_09",
      },
      {
        id: "arjun_topic_vikram",
        label: "You sent Vikram into her apartment.",
        response:
          "I asked security to confirm whether she'd taken company materials. I did not authorize anyone to hurt her. I didn't think anyone would.",
        tone: "nervous",
        relatedClueIds: ["clue_08"],
        unlocksAfterClueId: "clue_08",
      },
      {
        id: "arjun_topic_fraud",
        label: "The Corebridge invoices point to fraud.",
        response:
          "I have nothing further to say about ongoing vendor matters without our counsel present.",
        tone: "hostile",
        relatedClueIds: ["clue_10"],
        unlocksAfterClueId: "clue_10",
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
        id: "sameer_topic_rounds",
        label: "Walk me through your rounds that night.",
        response: "I did my usual rounds that night, nothing out of the ordinary.",
        tone: "calm",
      },
      {
        id: "sameer_topic_log",
        label: "The guard log doesn't match the resident statements.",
        response:
          "Okay — look, that's personal, it's got nothing to do with the Kapoor case. Please don't put this in the report.",
        tone: "nervous",
        relatedClueIds: ["clue_15"],
        unlocksAfterClueId: "clue_15",
      },
      {
        id: "sameer_topic_neha",
        label: "Did you see Neha leave that night?",
        response:
          "Honestly? I wasn't at the desk the whole time. I can't swear to every minute.",
        tone: "evasive",
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
    breakthroughResponse:
      "It's embarrassing, not criminal. I let my girlfriend in through the side door, we sat in the break room for maybe forty minutes, and I backfilled the log so my supervisor wouldn't clock it. I never left the building unattended for more than a couple minutes, and I never saw anything happen to Neha.",
  },
];
