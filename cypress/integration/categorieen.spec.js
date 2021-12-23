describe("(ADMIN) validation errors (wrong inputs in categorieen creation/change)", () => {
    beforeEach(() => {
      cy.login("yeet@gmail.com", "12345678");
    });
  
    it("should give validation error (categorienaam is incorrect)", () => {
      cy.intercept("GET", "http://localhost:9000/api/categorieen?limit=50&offset=0", {
        fixture: "categorieen.json",
      });
  
      cy.visit("http://localhost:3000");
  
      cy.get("[data-cy=overview_btn]").click();
      cy.get("[data-cy=categorieen_overview_btn]").click();
      cy.get("[data-cy=categorie_edit_btn]").click();
      cy.get("[data-cy=categorienaam_input]").type("a");
      cy.get("[data-cy=submit_categorie]").click();
      cy.get("[data-cy=error_box]").should("be.visible");
      cy.get("[data-cy=validatie_error_close_btn").click();
      cy.get("[data-cy=error_box").should("not.exist");
    }); 

    it("should give form error (categorienaam is incorrect)", () => {
        cy.intercept("GET", "http://localhost:9000/api/categorieen?limit=50&offset=0", {
          fixture: "empty.json",
        });
    
        cy.visit("http://localhost:3000");
    
        cy.get("[data-cy=overview_btn]").click();
        cy.get("[data-cy=categorieen_overview_btn]").click();
        cy.get("[data-cy=no_categorieen_left_txt]").should("be.visible");
        cy.get("[data-cy=add_categorie_empty_btn]").should("be.visible");
        cy.get("[data-cy=add_categorie_empty_btn]").click();
        cy.get("[data-cy=submit_categorie]").click();
        cy.get("[data-cy=labelinput-error]").should("be.visible");
        cy.get("[data-cy=categorienaam_input]").type("a");
        cy.get("[data-cy=labelinput-error]").should("not.exist");
    });
});