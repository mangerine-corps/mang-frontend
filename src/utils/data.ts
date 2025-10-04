import consultant from "../../public/assets/images/consultant4.png"

export const interests = [
    {
      id: 0,
      label: "No Preference",
      value: "None",
    },
    {
      id: 1,
      label: "Interest 1",
      value: "Interest 1",
    },
    {
      id: 2,
      label: "Interest 2",
      value: "Interest 2",
    },
  ];
  export const employmentType = [
    {
      id: 0,
      label: "No Preference",
      value: "None",
    },
    {
      id: 1,
      label: "Full-Time",
      value: "Full-Time",
    },
    {
      id: 2,
      label: "Part-Time",
      value: "Part-Time",
    },
  ];

  export const menuItemsData = [

    {
      title: 'Services',
      url: '/services',
      submenu: [
        {
          title: 'Web Design',
          url: 'web-design',
        },
        {
          title: 'Web Development',
          url: 'web-dev',
        },
        {
          title: 'SEO',
          url: 'seo',
        },

      ],
    },
  ];

  export const communityData = [
    {
      name: "Virtual assistant network",
      id: "hgqgwsgh",
      members: ["user1", "user2", "user3"],
      description: " Join the Virtual Assistants Network, a vibrant community where virtual assistants from around the globe connect, share insights, and elevate their skills. Whether you’re just starting out or a ...",
      image: consultant.src
    },{
      name: "Consultant’s Conner",
      id: "hgjsk",
      members: ["user1", "user2", "user3"],
      description: " Join the Virtual Assistants Network, a vibrant community where virtual assistants from around the globe connect, share insights, and elevate their skills. Whether you’re just starting out or a ...",
      image: consultant.src
    },{
      name: "Freelance Professional Hub",
      id: "hgqlajdkw",
      members: ["user1", "user2", "user3"],
      description: " Join the Virtual Assistants Network, a vibrant community where virtual assistants from around the globe connect, share insights, and elevate their skills. Whether you’re just starting out or a ...",
      image: consultant.src
    },{
      name: "Consultant’s Conner",
      id: "hggdjskjsk",
      members: ["user1", "user2", "user3"],
      description: " Join the Virtual Assistants Network, a vibrant community where virtual assistants from around the globe connect, share insights, and elevate their skills. Whether you’re just starting out or a ...",
      image: consultant.src
    },{
      name: "Freelance Professional Hub",
      id: "hgqlajdkwjw",
      members: ["user1", "user2", "user3"],
      description: " Join the Virtual Assistants Network, a vibrant community where virtual assistants from around the globe connect, share insights, and elevate their skills. Whether you’re just starting out or a ...",
      image: consultant.src
    },
  ]

  export const coms = [
    {
      name: "UI/UX designers",
      about: "457 members",
      id: "1235",
      images: []
    },    {
      name: "UI/UX designers",
      about: "457 members",
      id: "123562",
      images: []
    },    {
      name: "UI/UX designers",
      about: "457 members",
      id: "1223235",
      images: []
    },
  ]


  export const dummyPosts = [
    {
        user: {
            name: "Jane Doe",
            about: "Enthusiast of tech and design",
            image: consultant.src
        },
        content: "Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.",
        images: ["/path/to/image1.jpg", "/path/to/image2.jpg"],
        community: {
            name: "Tech Innovators",
            image: consultant.src,
            description: "A community for tech enthusiasts and innovators."
        },
        createdAt: new Date().toISOString(),
    },
    {
        user: {
            name: "John Smith",
            about: "Passionate about open-source development",
            image: consultant.src
        },
        content: "Just released a new open-source library for React!!!. Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.",
        images: [],
        community: {
            name: "Open Source Developers",
            image: "/path/to/community-image2.jpg",
            description: "Collaborate, contribute, and innovate with open source."
        },
        createdAt: new Date().toISOString(),
    },
    {
        user: {
            name: "Alice Johnson",
            about: "UI/UX Designer",
            image: consultant.src
        },
        content: "Check out my latest UI design for a mobile app!!!...Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.Loving this community! Just wanted to share my latest project.",
        images: ["/path/to/image3.jpg"],
        community: {
            name: "Designers Hub",
            image: consultant.src,
            description: "A community for designers to share and collaborate."
        },
        createdAt: new Date().toISOString(),
    },
];
