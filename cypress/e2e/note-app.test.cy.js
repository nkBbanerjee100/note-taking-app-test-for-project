describe('note app e2e', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
  });

  it('creates, updates, filters, and deletes a note', () => {
    cy.contains('No note selected. Create a new one:');

    cy.get('input[placeholder="Note title..."]').type('Cypress Note');
    cy.get('textarea[placeholder="Start typing..."]').type('End-to-end confidence for note flows.');
    cy.contains('button', 'Create Note').click();

    cy.contains('.note-item-title', 'Cypress Note').should('be.visible');
    cy.contains('button', 'Save').should('be.visible');

    cy.get('input[placeholder="Note title..."]').clear().type('Updated Cypress Note');
    cy.contains('button', 'Save').click();
    cy.contains('.note-item-title', 'Updated Cypress Note').should('be.visible');

    cy.get('input[placeholder="Search notes..."]').type('updated');
    cy.contains('.note-item-title', 'Updated Cypress Note').should('be.visible');

    cy.on('window:confirm', () => true);
    cy.get('.delete-btn').click();
    cy.contains('No notes found').should('be.visible');
  });
});
