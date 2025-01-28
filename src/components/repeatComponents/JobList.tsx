const jobs = [
    {
      id: 1,
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      salary: "$15k/Monthly",
      logo: "/images/66.png",
      tags: ["Full-Time"],
      categories: ["Marketing", "Design"]
    },
    {
      id: 2,
      title: "Brand Designer",
      company: "Dropbox",
      location: "San Francisco, USA",
      salary: "$15k/Monthly",
      logo: "/images/22.png",
      tags: ["Part-Time"],
      categories: ["Marketing", "Design"]
    },
    {
      id: 3,
      title: "Interactive Developer",
      company: "Terraform",
      location: "Hamburg, Germany",
      salary: "$15k/Monthly",
      logo: "/images/33.png",
      tags: ["Full-Time"],
      categories: ["Development", "Design"]
    },
    {
      id: 4,
      title: "Email Marketing Specialist",
      company: "Revolut",
      location: "Madrid, Spain",
      salary: "$15k/Monthly",
      logo: "/images/44.png",
      tags: ["Full-Time"],
      categories: ["Marketing"]
    },
    {
      id: 5,
      title: "Lead Engineer",
      company: "Canva",
      location: "Ankara, Turkey",
      salary: "$15k/Monthly",
      logo: "/images/77.png",
      tags: ["Part-Time"],
      categories: ["Development", "Engineering"]
    },
    {
      id: 6,
      title: "Product Designer",
      company: "ClassPass",
      location: "Berlin, Germany",
      salary: "$35k/Monthly",
      logo: "/images/55.png",
      tags: ["Part-Time"],
      categories: ["Design", "Product"]
    },
    {
      id: 7,
      title: "Customer Manager",
      company: "Pitch",
      location: "Berlin, Germany",
      salary: "$25k/Monthly",
      logo: "/images/88.png",
      tags: ["Part-Time"],
      categories: ["Customer Service"]
    },
    {
      id: 8,
      title: "Data Analyst",
      company: "Google",
      location: "London, UK",
      salary: "$20k/Monthly",
      logo: "/images/99.png",
      tags: ["Full-Time"],
      categories: ["Data", "Analysis"]
    },
    {
      id: 9,
      title: "HR Specialist",
      company: "Amazon",
      location: "Seattle, USA",
      salary: "$18k/Monthly",
      logo: "/images/101.png",
      tags: ["Part-Time"],
      categories: ["HR", "Administration"]
    },
    {
      id: 10,
      title: "Backend Developer",
      company: "Microsoft",
      location: "Redmond, USA",
      salary: "$30k/Monthly",
      logo: "/images/102.png",
      tags: ["Full-Time"],
      categories: ["Development", "Backend"]
    },
    {
      id: 11,
      title: "UI/UX Designer",
      company: "Apple",
      location: "Cupertino, USA",
      salary: "$28k/Monthly",
      logo: "/images/103.png",
      tags: ["Part-Time"],
      categories: ["Design", "UI/UX"]
    },
    {
      id: 12,
      title: "Sales Executive",
      company: "Salesforce",
      location: "Dublin, Ireland",
      salary: "$22k/Monthly",
      logo: "/images/104.png",
      tags: ["Full-Time"],
      categories: ["Sales", "Marketing"]
    },
    {
      id: 13,
      title: "Content Writer",
      company: "HubSpot",
      location: "Boston, USA",
      salary: "$12k/Monthly",
      logo: "/images/105.png",
      tags: ["Part-Time"],
      categories: ["Writing", "Marketing"]
    },
    {
      id: 14,
      title: "Network Engineer",
      company: "Cisco",
      location: "San Jose, USA",
      salary: "$25k/Monthly",
      logo: "/images/106.png",
      tags: ["Full-Time"],
      categories: ["Engineering", "Networking"]
    },
    {
      id: 15,
      title: "Project Manager",
      company: "Slack",
      location: "Remote",
      salary: "$30k/Monthly",
      logo: "/images/107.png",
      tags: ["Part-Time"],
      categories: ["Management", "Project"]
    },
    {
      id: 16,
      title: "Graphic Designer",
      company: "Behance",
      location: "Los Angeles, USA",
      salary: "$20k/Monthly",
      logo: "/images/22.png",
      tags: ["Full-Time"],
      categories: ["Design", "Marketing"]
    },
    {
      id: 17,
      title: "Front-End Developer",
      company: "GitHub",
      location: "Austin, USA",
      salary: "$28k/Monthly",
      logo: "/images/33.png",
      tags: ["Full-Time"],
      categories: ["Development", "Engineering"]
    },
    {
      id: 18,
      title: "Product Manager",
      company: "Spotify",
      location: "Stockholm, Sweden",
      salary: "$30k/Monthly",
      logo: "/images/55.png",
      tags: ["Full-Time"],
      categories: ["Product", "Management"]
    },
    {
      id: 19,
      title: "DevOps Engineer",
      company: "Heroku",
      location: "San Francisco, USA",
      salary: "$35k/Monthly",
      logo: "/images/77.png",
      tags: ["Full-Time"],
      categories: ["Development", "Engineering"]
    },
    {
      id: 20,
      title: "SEO Specialist",
      company: "Moz",
      location: "Seattle, USA",
      salary: "$20k/Monthly",
      logo: "/images/44.png",
      tags: ["Full-Time"],
      categories: ["Marketing", "SEO"]
    },
    {
      id: 21,
      title: "Cyber Security Analyst",
      company: "Palo Alto Networks",
      location: "Santa Clara, USA",
      salary: "$35k/Monthly",
      logo: "/images/101.png",
      tags: ["Full-Time"],
      categories: ["Security", "IT"]
    },
    {
      id: 22,
      title: "Machine Learning Engineer",
      company: "OpenAI",
      location: "San Francisco, USA",
      salary: "$40k/Monthly",
      logo: "/images/102.png",
      tags: ["Full-Time"],
      categories: ["AI", "Engineering"]
    },
    {
      id: 23,
      title: "Data Scientist",
      company: "IBM",
      location: "New York, USA",
      salary: "$38k/Monthly",
      logo: "/images/99.png",
      tags: ["Full-Time"],
      categories: ["Data", "Science"]
    },
    {
      id: 24,
      title: "Cloud Architect",
      company: "AWS",
      location: "Virginia, USA",
      salary: "$42k/Monthly",
      logo: "/images/106.png",
      tags: ["Full-Time"],
      categories: ["Cloud", "IT"]
    },
    {
      id: 25,
      title: "Blockchain Developer",
      company: "Coinbase",
      location: "San Francisco, USA",
      salary: "$50k/Monthly",
      logo: "/images/33.png",
      tags: ["Full-Time"],
      categories: ["Development", "Blockchain"]
    },
    {
      id: 26,
      title: "Digital Marketing Manager",
      company: "HubSpot",
      location: "Boston, USA",
      salary: "$30k/Monthly",
      logo: "/images/105.png",
      tags: ["Full-Time"],
      categories: ["Marketing", "Management"]
    },
    {
      id: 27,
      title: "UI Designer",
      company: "Adobe",
      location: "San Jose, USA",
      salary: "$35k/Monthly",
      logo: "/images/22.png",
      tags: ["Full-Time"],
      categories: ["Design", "UI/UX"]
    },
    {
      id: 28,
      title: "Backend Engineer",
      company: "Netflix",
      location: "Los Gatos, USA",
      salary: "$45k/Monthly",
      logo: "/images/102.png",
      tags: ["Full-Time"],
      categories: ["Development", "Backend"]
    },
    {
      id: 29,
      title: "Full Stack Developer",
      company: "Twitter",
      location: "San Francisco, USA",
      salary: "$40k/Monthly",
      logo: "/images/33.png",
      tags: ["Full-Time"],
      categories: ["Development", "Full Stack"]
    },
    {
      id: 30,
      title: "Technical Writer",
      company: "Stripe",
      location: "San Francisco, USA",
      salary: "$25k/Monthly",
      logo: "/images/105.png",
      tags: ["Full-Time"],
      categories: ["Writing", "Technical"]
    },
    {
      id: 31,
      title: "Data Engineer",
      company: "Facebook",
      location: "Menlo Park, USA",
      salary: "$50k/Monthly",
      logo: "/images/99.png",
      tags: ["Full-Time"],
      categories: ["Data", "Engineering"]
    },
    {
      id: 32,
      title: "Game Developer",
      company: "Epic Games",
      location: "Cary, USA",
      salary: "$35k/Monthly",
      logo: "/images/106.png",
      tags: ["Full-Time"],
      categories: ["Development", "Gaming"]
    },
    {
      id: 33,
      title: "Business Analyst",
      company: "Oracle",
      location: "Austin, USA",
      salary: "$28k/Monthly",
      logo: "/images/44.png",
      tags: ["Full-Time"],
      categories: ["Business", "Analysis"]
    },
    {
      id: 34,
      title: "Quality Assurance Engineer",
      company: "Intel",
      location: "Santa Clara, USA",
      salary: "$32k/Monthly",
      logo: "/images/77.png",
      tags: ["Full-Time"],
      categories: ["Engineering", "QA"]
    },
    {
      id: 35,
      title: "Network Administrator",
      company: "Juniper Networks",
      location: "Sunnyvale, USA",
      salary: "$27k/Monthly",
      logo: "/images/106.png",
      tags: ["Full-Time"],
      categories: ["Networking", "IT"]
    },
    {
      id: 36,
      title: "Mobile App Developer",
      company: "Spotify",
      location: "Stockholm, Sweden",
      salary: "$30k/Monthly",
      logo: "/images/55.png",
      tags: ["Full-Time"],
      categories: ["Development", "Mobile"]
    },
    {
      id: 37,
      title: "Project Coordinator",
      company: "Trello",
      location: "Remote",
      salary: "$22k/Monthly",
      logo: "/images/107.png",
      tags: ["Full-Time"],
      categories: ["Management", "Project"]
    },
    {
      id: 38,
      title: "Graphic Illustrator",
      company: "Dribbble",
      location: "Vancouver, Canada",
      salary: "$25k/Monthly",
      logo: "/images/22.png",
      tags: ["Full-Time"],
      categories: ["Design", "Illustration"]
    },
    {
      id: 39,
      title: "Operations Manager",
      company: "Uber",
      location: "San Francisco, USA",
      salary: "$38k/Monthly",
      logo: "/images/44.png",
      tags: ["Full-Time"],
      categories: ["Management", "Operations"]
    },
    {
      id: 40,
      title: "Content Strategist",
      company: "Medium",
      location: "New York, USA",
      salary: "$28k/Monthly",
      logo: "/images/105.png",
      tags: ["Full-Time"],
      categories: ["Marketing", "Content"]
    }
  ];
  
  export default jobs;
  