const app = require("../server/app");
const chai = require("chai"),
  expect = chai.expect;
chai.use(require("chai-sorted"));
const request = require("supertest");
const mongoose = require("mongoose");
const { seedTestDb } = require("../test-db/test-data");

before((done) => {
  mongoose.connection.collections.projects.drop(() => {
    seedTestDb();
    done();
  });
});

describe("app", () => {
  it("Status: 404. Responds with an error message when the path does not exist", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.deep.equal("Path not found.");
      });
  });
});

describe("/api", () => {
  /// HAPPY PATHS (get, filter, sortby)

  describe("GET ALL PROJECTS", () => {
    it("Status: 200. Responds with an array of project objects", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          projects.forEach((projectObj) => {
            expect(Object.keys(projectObj)).to.have.lengthOf(13);
            expect(projectObj).to.have.all.keys(
              "_id",
              "title",
              "overview",
              "description",
              "creation_date",
              "type",
              "tech_tags",
              "backend_github_link",
              "frontend_github_link",
              "backend_hosted_link",
              "frontend_hosted_link",
              "main_image",
              "screenshots"
            );
          });
        });
    });
    it("Status: 200. Responds with an array of filtered projects by type", () => {
      return request(app)
        .get("/api/projects?type=Solo")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(1);
          expect(projects[0].type).to.deep.equal("Solo");
        });
    });
    it("Status: 200. Responds with an array of filtered projects by tech tags", () => {
      return request(app)
        .get("/api/projects?tech_tags=PSQL")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(1);
          expect(projects[0].tech_tags).to.deep.include("PSQL");
        });
    });
    it("Status: 200. Responds with an array of filtered projects by both type and tech tags", () => {
      return request(app)
        .get("/api/projects?type=Group&tech_tags=Jest")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(0);
        });
    });
    it("Status: 200. Responds with an array of filtered projects by multiple tech tags", () => {
      return request(app)
        .get(
          "/api/projects?tech_tags=Axios&tech_tags=MongoDB&tech_tags=Express"
        )
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(1);
          expect(projects[0].tech_tags).to.deep.include("Axios");
          expect(projects[0].tech_tags).to.deep.include("MongoDB");
          expect(projects[0].tech_tags).to.deep.include("Express");
        });
    });
    it("Status: 200. Responds with an array of filtered projects by both type and multiple tech tags", () => {
      return request(app)
        .get(
          "/api/projects?type=Solo&tech_tags=Axios&tech_tags=MongoDB&tech_tags=Express"
        )
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(0);
        });
    });
    it("Status: 200, Responds with projects sorted by descending creation by default", () => {
      return request(app)
        .get("/api/projects")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.sortedBy(`creation_date`, {
            descending: true,
          });
        });
    });
    it("Status: 200, Responds with projects sorted by ascending title (alphabetically)", () => {
      return request(app)
        .get("/api/projects?sortby=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(2);
          expect(projects).to.be.sortedBy(`title`);
        });
    });
    it("Status: 200, Responds with projects sorted by ascending type (alphabetically)", () => {
      return request(app)
        .get("/api/projects?sortby=type&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { projects } = body;
          expect(projects).to.be.an("array");
          expect(projects).to.have.lengthOf(2);
          expect(projects).to.be.sortedBy(`type`);
        });
    });
  });

  /// INVALID METHODS (post, patch, put, delete with both / and /projects)

  describe("POST - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .post("/api/")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .post("/api/projects")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("PATCH - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .patch("/api/")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .patch("/api/projects")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("PUT - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/projects")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
  describe("DELETE - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .delete("/api/")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .delete("/api/projects")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
});

//check for bad sorting/filtering!!!!! - manual
//shouldnt sortby id, overview, description, tech_tags, any links, images, screenshots
//shouldnt filter by id, title, overview, description, creation_date, links, images, screenshots

describe("/api/project/:_id", () => {
  /// HAPPY PATH (get)

  describe("GET PROJECT BY ID", () => {
    it("Status: 200. Responds with a project object with the relevant properties", () => {
      return request(app)
        .get("/api/project/make-space-app")
        .expect(200)
        .then(({ body }) => {
          let project = body;
          expect(project).to.be.an("object");
          expect(Object.keys(project)).to.have.lengthOf(13);
          expect(project).to.have.all.keys(
            "_id",
            "title",
            "overview",
            "description",
            "creation_date",
            "type",
            "tech_tags",
            "backend_github_link",
            "frontend_github_link",
            "backend_hosted_link",
            "frontend_hosted_link",
            "main_image",
            "screenshots"
          );
          expect(project.tech_tags).to.be.an("array");
          expect(project.screenshots).to.be.an("array");
        });
    });

    // ERROR HANDLING
    it("Status: 404. Responds with an error message when the path is logical but does not exist", () => {
      return request(app)
        .get("/api/project/another-app")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Project not found.");
        });
    });
  });

  // INVALID METHODS (post, patch, put, delete)

  describe("DELETE - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .delete("/api/project/make-space-app")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });

  describe("PATCH - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .patch("/api/project/make-space-app")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });

  describe("POST - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .post("/api/project/make-space-app")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });

  describe("PUT - INVALID REQUEST", () => {
    it("Status: 405. Responds with an error message when the path is not allowed", () => {
      return request(app)
        .put("/api/project/make-space-app")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Method not allowed.");
        });
    });
  });
});
