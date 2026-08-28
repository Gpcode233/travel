export interface EventConfig {
  name: string;
  eyebrow: string;
  headline: string;
  topic: string;
  description: string;
  about: string;
  whatToExpect: {
    title: string;
    description: string;
  }[];
  date: string;
  time: string;
  location: string;
  fee: number;
  feeFormatted: string;
  payment: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  whatsapp: {
    number: string;
    cleanNumber: string;
    defaultMessage: string;
    getLink: () => string;
  };
  formOptions: {
    sex: string[];
    ageBracket: string[];
    categories: string[];
    contactFuture: string[];
  };
}

export const eventConfig: EventConfig = {
  name: "Youth Program 2026",
  eyebrow: "YOUTH PROGRAM 2026",
  headline: "Empowering the Next Generation",
  topic: "The Power of Purpose in a Changing World",
  description:
    "A transformative gathering designed to equip young people with knowledge, purpose, practical skills and meaningful connections.",
  about:
    "The Youth Program is a premier gathering dedicated to inspiring and equipping ambitious young minds. Through targeted keynote sessions, interactive discussions, and real-world mentorship, participants gain the clarity and practical tools necessary to navigate modern challenges, unleash their creative potential, and lead with purpose.",
  whatToExpect: [
    {
      title: "Practical Sessions",
      description:
        "Actionable frameworks and masterclasses led by seasoned leaders and industry mentors.",
    },
    {
      title: "Meaningful Conversations",
      description:
        "Engaging dialogues on purpose, resilience, and personal growth in a rapidly changing world.",
    },
    {
      title: "Networking Opportunities",
      description:
        "Connect with high-performing peers, builders, creators, and future collaborators.",
    },
  ],
  date: "Monday, August 31, 2026",
  time: "10:00 AM",
  location: "Enugu, Nigeria",
  fee: 5000,
  feeFormatted: "₦5,000",
  payment: {
    bankName: "PALMPAY",
    accountName: "BASSEY, MANFRED MBANG",
    accountNumber: "9066091468",
  },
  whatsapp: {
    number: "+234 703 912 1611",
    cleanNumber: "2347039121611",
    defaultMessage:
      "Hello, I have completed my payment for the Youth Program 2026.\n\nI have attached my payment receipt.\n\nPlease verify my payment and send me my registration code.",
    getLink: () => {
      const message = encodeURIComponent(
        "Hello, I have completed my payment for the Youth Program 2026.\n\nI have attached my payment receipt.\n\nPlease verify my payment and send me my registration code."
      );
      return `https://wa.me/2347039121611?text=${message}`;
    },
  },
  formOptions: {
    sex: ["Male", "Female"],
    ageBracket: ["13-18yrs", "19-24yrs", "24yrs and above"],
    categories: [
      "Leadership & Purpose",
      "Tech & Digital Skills",
      "Career & Skill Acquisition",
      "Creative Arts & Media",
      "Entrepreneurship & Business Innovation",
      "Ministry & Personal Growth",
    ],
    contactFuture: ["Yes", "No", "Maybe"],
  },
};
