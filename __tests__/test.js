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
  });
});

// it("Status: 200, Responds with an array of filtered listing objects for multiple queries", () => {
//   return request(app)
//     .get("/api/projects?location.city=Manchester&amenities.kitchen=false")
//     .expect(200)
//     .then(({ body }) => {
//       const { listings } = body;
//       expect(listings).to.be.an("array");
//       expect(listings).to.have.lengthOf(3);
//       listings.forEach((listingObj) => {
//         expect(Object.keys(listingObj)).to.have.lengthOf(13);
//         expect(listingObj.location.city).to.deep.equal(`Manchester`);
//         expect(listingObj.amenities.kitchen).to.deep.equal(false);
//       });
//     });
// });

// it("Status: 200, Responds with listings sorted by descending space rating by default", () => {
//   return request(app)
//     .get("/api/listings")
//     .expect(200)
//     .then(({ body }) => {
//       const { listings } = body;
//       expect(listings).to.be.an("array");
//       expect(listings).to.have.lengthOf(7);
//       expect(listings[0].spaceRating).to.deep.equal(4.9);
//       expect(listings[6].spaceRating).to.deep.equal(3);
//       expect(listings).to.be.sortedBy(`spaceRating`, {
//         descending: true,
//       });
//     });
// });

// it("Status: 200, Responds with listings sorted by ascending price", () => {
//   return request(app)
//     .get("/api/listings?sortby=price&order=asc")
//     .expect(200)
//     .then(({ body }) => {
//       const { listings } = body;
//       expect(listings).to.be.an("array");
//       expect(listings).to.have.lengthOf(7);
//       expect(listings).to.be.sortedBy(`price`);
//     });
// });

// it("Status: 200, Responds with listings sorted by ascending alphabetical title and filtered by city", () => {
//   return request(app)
//     .get("/api/listings?location.city=Manchester&sortby=title&order=asc")
//     .expect(200)
//     .then(({ body }) => {
//       const { listings } = body;
//       expect(listings).to.be.an("array");
//       expect(listings).to.be.sortedBy(`title`);
//       expect(listings).to.have.lengthOf(4);
//       listings.forEach((listingObj) => {
//         expect(Object.keys(listingObj)).to.have.lengthOf(13);
//         expect(listingObj.location.city).to.deep.equal(`Manchester`);
//       });
//     });
// });

//check for bad sorting/filtering!!!!! - manual
//ERROR HANDLING

//     describe("POST - INVALID REQUEST", () => {
//       it("Status: 405. Responds with an error message when the path is not allowed", () => {
//         return request(app)
//           .post("/api/")
//           .expect(405)
//           .then(({ body }) => {
//             expect(body.msg).to.deep.equal("Method not allowed.");
//           });
//       });
//     });
//     describe("PATCH - INVALID REQUEST", () => {
//       it("Status: 405. Responds with an error message when the path is not allowed", () => {
//         return request(app)
//           .patch("/api/")
//           .expect(405)
//           .then(({ body }) => {
//             expect(body.msg).to.deep.equal("Method not allowed.");
//           });
//       });
//     });
//     describe("PUT - INVALID REQUEST", () => {
//       it("Status: 405. Responds with an error message when the path is not allowed", () => {
//         return request(app)
//           .put("/api/")
//           .expect(405)
//           .then(({ body }) => {
//             expect(body.msg).to.deep.equal("Method not allowed.");
//           });
//       });
//     });
//     describe("DELETE - INVALID REQUEST", () => {
//       it("Status: 405. Responds with an error message when the path is not allowed", () => {
//         return request(app)
//           .delete("/api/")
//           .expect(405)
//           .then(({ body }) => {
//             expect(body.msg).to.deep.equal("Method not allowed.");
//           });
//       });
//     });
//   });
// });

// describe("/api/project/:_id", () => {
//   describe("GET PROJECT BY ID", () => {
//     it("Status: 200. Responds with a project object with the relevant properties", () => {
//       return (
//         request(app)
//           .get("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//           .expect(200)
//           .then(({ body }) => {
//             let listing = body;
//             expect(listing).to.be.an("object");
//             expect(Object.keys(listing)).to.have.lengthOf(13);
//             expect(listing).to.have.all.keys(
//               "_id",
//               "title",
//               "location",
//               "owner",
//               "price",
//               "spaceRating",
//               "size",
//               "description",
//               "amenities",
//               "reviews",
//               "contactDetails",
//               "bookedDays",
//               "images"
//             );
//             expect(listing.location).to.be.an("object");
//             expect(listing.location).to.deep.nested.keys("city", "postcode");
//             expect(listing.amenities).to.be.an("object");
//             expect(listing.amenities).to.deep.nested.keys(
//               "power",
//               "accessible",
//               "parking",
//               "indoor",
//               "outdoor",
//               "WC",
//               "kitchen",
//               "_24HourAccess"
//             );
//             expect(listing.contactDetails).to.be.an("object");
//             expect(listing.contactDetails).to.deep.nested.keys(
//               "phoneNumber",
//               "emailAddress"
//             );
//             expect(listing.reviews).to.be.an("array");
//             expect(listing.images).to.be.an("array");
//           })
//       );
//     });

//     it("Status: 404. Responds with an error message when the path is logical (hexidecimal) but does not exist", () => {
//       return request(app)
//         .get("/api/listings/61adfad4bacbe7ff1dfb7f2b")
//         .expect(404)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Listing not found.");
//         });
//     });

//     it("Status: 400. Responds with an error message when the path is illogical (not hexidecimal)", () => {
//       return request(app)
//         .get("/api/listings/not-a-hexidecimal")
//         .expect(400)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Invalid data entry.");
//         });
//     });
//   });

//   describe("DELETE - INVALID REQUEST", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .delete("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });

//   describe("PATCH - INVALID REQUEST", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .patch("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });

//   describe("POST - INVALID REQUEST", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .post("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });

//   describe("PUT - INVALID REQUEST", () => {
//     it("Status: 405. Responds with an error message when the path is not allowed", () => {
//       return request(app)
//         .put("/api/listings/61adfad4bacbe7ff1dfb7f2a")
//         .expect(405)
//         .then(({ body }) => {
//           expect(body.msg).to.deep.equal("Method not allowed.");
//         });
//     });
//   });
// });
