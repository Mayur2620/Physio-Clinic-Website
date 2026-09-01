const createId = (prefix) => `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16)}`;

export const defaultSiteContent = () => ({
  clinicName: "Revive Care",
  clinicDescription:
    "Personalized care for recovery, mobility, and lifelong wellness in a calm, modern clinic environment.",
  heroTitle: "Best Medicare Plan For You",
  heroDescription:
    "Modern physiotherapy, expert doctors, and personal care for recovery, strength, and everyday wellness.",
  aboutTitle: "Compassionate Care, Trusted Expertise",
  aboutDescription:
    "We help patients move better, feel stronger, and return to daily life with confidence.",
  aboutPageTitle: "Focused recovery care for stronger everyday movement.",
  aboutPageDescription:
    "PhysioCare helps patients reduce pain, restore mobility, and build confidence through guided therapy plans and attentive follow-up.",
  servicesPageTitle: "Personalized therapy for pain relief and better movement.",
  servicesPageDescription:
    "Explore physiotherapy care, recovery planning, pain management, and wellness support tailored to your goals.",
  contactHeading: "Contact Us",
  contactDescription: "Send a message and our team will respond as soon as possible.",
  phone: "+91 98765 43210",
  email: "care@physioclinic.com",
  address: "Wellness Avenue, Clinic Block",
  whatsappText: "Message us for quick scheduling.",
  trustCustomers: "18K",
  trustVisitors: "30K",
  quickStats: [
    { id: createId("stat"), icon: "heartbeat", label: "Targeted Recovery Plans" },
    { id: createId("stat"), icon: "home", label: "Functional Movement Care" },
    { id: createId("stat"), icon: "calendar", label: "Guided Therapy Sessions" },
    { id: createId("stat"), icon: "doctor", label: "Expert Physiotherapists" },
  ],
  features: [
    {
      id: createId("feature"),
      icon: "heartbeat",
      title: "Whole-person care",
      description: "We look at pain, posture, movement patterns, and lifestyle together.",
    },
    {
      id: createId("feature"),
      icon: "doctor",
      title: "Experienced clinicians",
      description: "Every plan is shaped by assessment, progress checks, and clear goals.",
    },
    {
      id: createId("feature"),
      icon: "home",
      title: "Comfortable clinic",
      description: "Calm treatment rooms and practical home exercises support recovery.",
    },
    {
      id: createId("feature"),
      icon: "users",
      title: "Community trust",
      description: "Friendly care for athletes, office workers, seniors, and families.",
    },
  ],
  services: [
    {
      id: createId("service"),
      icon: "injured",
      title: "Pain Relief Therapy",
      description: "Hands-on physiotherapy and exercise-based care tailored to your recovery goals.",
      details:
        "Targeted physiotherapy for neck pain, back pain, shoulder pain, knee pain, and joint stiffness.",
      featured: false,
    },
    {
      id: createId("service"),
      icon: "running",
      title: "Sports Injury Rehab",
      description: "Hands-on physiotherapy and exercise-based care tailored to your recovery goals.",
      details:
        "Progressive rehab for sprains, strains, overuse issues, and safe return-to-sport planning.",
      featured: true,
    },
    {
      id: createId("service"),
      icon: "dumbbell",
      title: "Strength & Mobility",
      description: "Hands-on physiotherapy and exercise-based care tailored to your recovery goals.",
      details:
        "Movement retraining and strengthening programs to improve flexibility, balance, and everyday function.",
      featured: false,
    },
    {
      id: createId("service"),
      icon: "heartbeat",
      title: "Post-Surgery Recovery",
      description: "Hands-on physiotherapy and exercise-based care tailored to your recovery goals.",
      details:
        "Guided rehabilitation after orthopedic procedures to restore range of motion and confidence.",
      featured: false,
    },
    {
      id: createId("service"),
      icon: "calendar",
      title: "Posture Correction",
      description: "Hands-on physiotherapy and exercise-based care tailored to your recovery goals.",
      details:
        "Assessment and correction plans for desk strain, muscle imbalance, and poor movement habits.",
      featured: false,
    },
    {
      id: createId("service"),
      icon: "home",
      title: "Home Exercise Plans",
      description: "Hands-on physiotherapy and exercise-based care tailored to your recovery goals.",
      details:
        "Simple, trackable exercise plans that support your treatment between clinic visits.",
      featured: false,
    },
  ],
  doctors: [
    {
      id: createId("doctor"),
      name: "Dr. Arya Pradana",
      role: "Service Instructor",
      days: "Monday, Friday, Saturday",
      hours: "3:00-8:00 P.M.",
    },
    {
      id: createId("doctor"),
      name: "Dr. Kirana Dyah",
      role: "Movement Specialist",
      days: "Tuesday, Thursday, Saturday",
      hours: "10:00 A.M.-5:00 P.M.",
    },
    {
      id: createId("doctor"),
      name: "Drg. Nurul Prestikasari",
      role: "Recovery Consultant",
      days: "Monday, Wednesday, Friday",
      hours: "11:00 A.M.-6:00 P.M.",
    },
  ],
});
