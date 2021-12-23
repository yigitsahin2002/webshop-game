describe("(ADMIN) validation errors (wrong inputs in publisher creation/change)", () => {
    beforeEach(() => {
      cy.login("yeet@gmail.com", "12345678");
    });
  
    it("should give validation error (publishernaam is incorrect)", () => {
      cy.intercept("GET", "http://localhost:9000/api/publishers?limit=50&offset=0", {
        fixture: "publishers.json",
      });
  
      cy.visit("http://localhost:3000");
  
      cy.get("[data-cy=overview_btn]").click();
      cy.get("[data-cy=publisher_overview_btn]").click();
      cy.get("[data-cy=publisher_edit_btn]").click();
      cy.get("[data-cy=publishernaam_input]").type(" Games");
      cy.get("[data-cy=submit_publisher]").click();
      cy.get("[data-cy=error_box]").should("be.visible");
      cy.get("[data-cy=validatie_error_close_btn").click();
      cy.get("[data-cy=error_box").should("not.exist");
    }); 

    it("should give form error (publishernaam is incorrect)", () => {
        cy.intercept("GET", "http://localhost:9000/api/publishers?limit=50&offset=0", {
          fixture: "empty.json",
        });
    
        cy.visit("http://localhost:3000");
    
        cy.get("[data-cy=overview_btn]").click();
        cy.get("[data-cy=publisher_overview_btn]").click();
        cy.get("[data-cy=no_publishers_left_txt]").should("be.visible");
        cy.get("[data-cy=add_publisher_empty_btn]").should("be.visible");
        cy.get("[data-cy=add_publisher_empty_btn]").click();
        cy.get("[data-cy=submit_publisher]").click();
        cy.get("[data-cy=labelinput-error]").should("be.visible");
        cy.get("[data-cy=publishernaam_input]").type("Roc");
        cy.get("[data-cy=labelinput-error]").should("not.exist");
        cy.get("[data-cy=publishernaam_input]").type("kstar");
        cy.get("[data-cy=submit_publisher]").click();
    });
});