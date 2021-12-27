const mongoose = require("mongoose");
const ProjectModel = require("../server/models/ProjectModel");

const testProjects = [
  {
    _id: "proclaim-your-game-website",
    title: "Proclaim Your Game Website",
    overview: "xyz",
    description: "ABC",
    creation_date: "November 2021",
    type: "Solo",
    tech_tags: [
      "Javascript",
      "PSQL",
      "Node.js",
      "Express",
      "Axios",
      "React",
      "Jest",
      "HTML",
      "CSS",
    ],
    backend_github_link:
      "https://github.com/catcodingcat/proclaim-your-game-be",
    frontend_github_link:
      "https://github.com/catcodingcat/proclaim-your-game-fe",
    backend_hosted_link: "https://dashboard.heroku.com/apps/proclaim-your-game",
    frontend_hosted_link: "https://proclaim-your-game.netlify.app/",
    main_image:
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
    screenshots: [
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
    ],
  },
  {
    _id: "make-space-app",
    title: "Make Space App",
    overview: "xyz",
    description: "ABC",
    creation_date: "December 2021",
    type: "Group",
    tech_tags: [
      "Javascript",
      "MongoDB",
      "Mongoose",
      "Node.js",
      "Express",
      "Axios",
      "React Native",
      "Expo",
      "Firebase",
      "Mocha",
      "Chai",
      "HTML",
      "CSS",
    ],
    backend_github_link: "https://github.com/Kpovey115/makespace-BE",
    frontend_github_link: "https://github.com/Kpovey115/makespace-FE",
    backend_hosted_link: "///",
    frontend_hosted_link: "https://expo.dev/@popatre/MakeSpace",
    main_image:
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
    screenshots: [
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
      "https://fujifilm-x.com/wp-content/uploads/2019/08/x-t30_sample-images03.jpg",
    ],
  },
];

exports.seedTestDb = () => {
  testProjects.forEach((object) => {
    const project = new ProjectModel(object);
    project.save();
  });
};
