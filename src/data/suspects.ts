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
  },
];
