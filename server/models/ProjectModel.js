const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    _id: String,
    title: String,
    overview: String,
    description: String,
    creation_date: String,
    type: String,
    tech_tags: Array,
    backend_github_link: String,
    frontend_github_link: String,
    backend_hosted_link: String,
    frontend_hosted_link: String,
    main_image: String,
    screenshots: Array,
  },
  {
    versionKey: false,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

module.exports = mongoose.model("project", ProjectSchema);
