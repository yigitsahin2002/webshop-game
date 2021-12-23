describe("(ADMIN) has authorization to see more things than user", () => {
    beforeEach(() => {
        cy.login("yeet@gmail.com", "12345678");
    });

    it("should not show lock icon (admin has authorization to enter)", () => { 
        cy.visit("http://localhost:3000");
    
        cy.get("[data-cy=lock_icon]").should("not.exist");
        cy.get("[data-cy=overview_btn]").click();
        cy.get("[data-cy=overview_box]").should("be.visible");
    });
});

describe("(USER) has less authorization to see things than admin", () => {
    beforeEach(() => {
        cy.login("trem@gmail.com", "12345678");
    });

    it("should show lock icon (user doesn't authorization to enter)", () => { 
        cy.visit("http://localhost:3000");
    
        cy.get("[data-cy=lock_icon]").should("be.visible");
        cy.get("[data-cy=overview_btn]").click();
        cy.get("[data-cy=overview_box]").should("not.exist");
    });
});