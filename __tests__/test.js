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
    it("Status: 200. Responds with an empty array when the type exists but contains no projects", () => {
      return request(app)
        .get("/api/projects?type=Pair")
        .expect(200)
        .then(({ body }) => {
          expect(body.projects).to.deep.equal([]);
        });
    });

    /// ERROR HANDLING
    it("Status: 400. Responds with an error message when the type filter is invalid", () => {
      return request(app)
        .get("/api/projects?type=NotAType")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid type query.");
        });
    });
    it("Status: 400. Responds with an error message when the tech_tags filter is invalid", () => {
      return request(app)
        .get("/api/projects?type=Solo&tech_tags=NotATechTag")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid tech tag query.");
        });
    });
    it("Status: 400. Responds with an error message when one tech_tags filter is invalid", () => {
      return request(app)
        .get("/api/projects?tech_tags=MongoDB&tech_tags=NotATechTag")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid tech tag query.");
        });
    });
    it("Status: 400. Responds with an error message when a filter is non-existent", () => {
      return request(app)
        .get("/api/projects?not_tech_tags=MongoDB")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("not_tech_tags is an invalid filter.");
        });
    });
    it("Status: 400. Responds with an error message when a filter exists but is not permitted", () => {
      return request(app)
        .get("/api/projects?title=Make Space App")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Cannot filter by title.");
        });
    });
    it("Status: 400. Responds with an error message when the sortby query is invalid", () => {
      return request(app)
        .get("/api/projects?sortby=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid sortby query.");
        });
    });
    it("Status: 400. Responds with an error message when the sortby query is of an incorrect data type", () => {
      return request(app)
        .get("/api/projects?sortby=123")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid sortby query.");
        });
    });
    it("Status: 400. Responds with an error message when the order query is invalid", () => {
      return request(app)
        .get("/api/projects?order=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid order query.");
        });
    });
    it("Status: 400. Responds with an error message when the order query is of an incorrect data type", () => {
      return request(app)
        .get("/api/projects?sortby=type&order=123")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Invalid order query.");
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

    /// ERROR HANDLING
    it("Status: 404. Responds with an error message when the path is logical but does not exist", () => {
      return request(app)
        .get("/api/project/another-app")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.deep.equal("Project not found.");
        });
    });
  });

  /// INVALID METHODS (post, patch, put, delete)
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
