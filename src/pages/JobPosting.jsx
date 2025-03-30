// import "../css/JobPosting.css";
import SmartHireCard from "../components/ReuseableCard.jsx"
function JobPosting() {
  return (<SmartHireCard
    type="job"
    data={{
      title: "Product Designer",
      company: "Mckenzie Media",
      salary: "120 apples",
      salaryRange: "400-1000 monthly",
      employmentType: "Full-time",
      locationType: "Remote",
      location: "Delhi, India",
      overviewTags: ["Opensecurity", "UUX", "UI Design", "IT Specialist", "Metron Graphics"],
      responsibilities: [
        "Conduct their research to understand customer needs, pain points, and behaviours.",
        "Design and prototype intuitive user interfaces for web and mobile applications.",
        // ... more responsibilities
      ],
      requirements: [
        "2 × years of experience in UUUX design, preferably within a SaaS or tech company.",
        "Proficiency in design tools such as Fiping, Adobe App, or Sketch.",
        // ... more requirements
      ],
      preferredQualifications: [
        "Experience in designing for B2B SaaS products.",
        "Finalizatory with designing for mobile applications (iOS/Android).",
        // ... more preferred qualifications
      ],
      benefits: [
        "A dynamic and innovative work environment.",
        "Opportunity to have a direct impact on the user experience of a growing product.",
        // ... more benefits
      ]
    }}
  />  );
}

export default JobPosting;
