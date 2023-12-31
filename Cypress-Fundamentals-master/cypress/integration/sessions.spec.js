///<reference types="cypress" />

const thursdaySessionsData = {
    data: {
        intro: [
            {
                id: "78170",
                title: "Cypress 9 Fundamentals",
                startsAt: "8:30",
                day: "Thursday",
                room: "Jupiter",
                level: "Introductory and overview",
                speakers: [
                    {
                        id: "37313769-11ae-4245-93b3-e6e60d5d187c",
                        name: "Adhithi Ravichandran",
                        __typename: "Speaker",
                    },
                ],
                __typename: "Session",
            },
        ],
        intermediate: [
            {
                id: "85324",
                title: "Bamboo Spec",
                startsAt: "8:30",
                day: "Thursday",
                room: "Io",
                level: "Intermediate",
                speakers: [
                    {
                        id: "e9c40cc-1ffd-44f5-90c2-9d69ada76073",
                        name: "Brian Cox",
                        __typename: "Speaker",
                    },
                ],
                __typename: "Session",
            },
        ],
        advanced: [
            {
                id: "84969",
                title: "`microservices -- The Hard Way is the right Way",
                startsAt: "9:45",
                day: "Thursday",
                room: "Ganymede",
                level: "Advanced",
                speakers: [
                    {
                        id: "60e31e1b-2d77-4f36-8e11-4d9f8b639bc8",
                        name: "Joe Lopez",
                        __typename: "Speaker",
                    },
                ],
                __typename: "Session",
            },
        ],
    },
};
describe("Sessions page", () => {
    beforeEach(() =>{
        cy.visit("/conference");
        cy.get("h1").contains("View Sessions").click();
        cy.url().should("include", "/sessions");

        //Define Aliases here using .as
        cy.dataCy("AllSessions").as("AllSessionsBtn");
        cy.dataCy("Wednesday").as("WednesdayBtn");
        cy.dataCy("Thursday").as("ThursdayBtn");
        cy.dataCy("Friday").as("FridayBtn");
    })
    it("should navigate to conference sessions page and view the day filter buttons", () => {
        cy.visit("http://localhost:1337/conference");
        cy.get("h1").contains("View Sessions").click();
        cy.url().should("include", "/sessions");

        //Validate that filters to buttons by day exist. USe aliases instead of the data-cy function
        
        cy.get("@AllSessionsBtn");  //("[data-cy=AllSessions]");
        cy.get("@WednesdayBtn");     //("[data-cy=Wednesday]");
        cy.get("@ThursdayBtn");    //("[data-cy=Thursday]");
        cy.get("@FridayBtn");      //("[data-cy=Friday]");
    });
    it("should filter sessions and display only Wednesday's sessions when Wednesday button is clicked", () => {

        //intercepting api call for spying; no modifications

        cy.intercept("POST", "http://localhost:4000/graphql").as("getSessionInfo"); 
        cy.get("@WednesdayBtn").click();  //("[data-cy=Wednesday]")
        cy.wait("@getSessionInfo");  //wait

      //Assertions
        //cy.get("[data-cy=day]").should('have.length.of.at.most', 23)
        //cy.get("[data-cy=day]") - basic command to get the elements. can be replaced with custom commands
        cy.dataCy("day").should('have.length.within', 20, 23); //Validate the no of items present on the page
        cy.dataCy("day").contains("Wednesday").should("be.visible");
        cy.dataCy("day").contains("Thursday").should("not.exist");
        cy.dataCy("day").contains("Friday").should("not.exist");
    });
    it("should filter sessions and display only Thursday's sessions when Thursday button is clicked", () => {

        //Stubbing response data - from a predefined contant/code
        cy.intercept("POST", "http://localhost:4000/graphql", thursdaySessionsData).as("getSessionInfo"); //intercepting api call
        cy.get("@ThursdayBtn").click();  //("[data-cy=Wednesday]")
        cy.wait("@getSessionInfo");  //wait

        //Assertions
        cy.dataCy("day").should('have.length.within', 2, 3);
        cy.dataCy("day").contains("Wednesday").should("not.exist");
        cy.dataCy("day").contains("Thursday").should("be.visible");
        cy.dataCy("day").contains("Friday").should("not.exist");
    });
    it("should filter sessions and display only Friday's sessions when Friday button is clicked", () => {

         //Stubbing response data - from a fixture
        cy.intercept("POST", "http://localhost:4000/graphql", {
            fixture: "sessions.json"
        }).as("getSessionInfo"); //intercepting api call
        cy.get("@FridayBtn").click();  //("[data-cy=Wednesday]")
        cy.wait("@getSessionInfo");  //wait

        //Assertions
        cy.dataCy("day").should('have.length.within', 2, 3);
        cy.dataCy("day").contains("Wednesday").should("not.exist");
        cy.dataCy("day").contains("Thursday").should("not.exist");
        cy.dataCy("day").contains("Friday").should("be.visible");
    });
    it("should display all buttons when AllSessions button is clicked", () => {

        cy.intercept("POST", "http://localhost:4000/graphql").as("getSessionInfo"); //intercepting api call
        cy.get("@AllSessionsBtn").click();  //("[data-cy=Wednesday]")
        cy.wait("@getSessionInfo");  //wait

        //cy.dataCy("day").contains("AllSessions").should("be.visible");
        
        cy.get("[data-cy=Wednesday]").contains("Wednesday").should("be.visible");
        cy.get("[data-cy=Thursday]").contains("Thursday").should("be.visible");
        cy.get("[data-cy=Friday]").contains("Friday").should("be.visible");
    });
});