// test for page redirection on clicking create event button
describe('Create Event button', () => {
    it('click on create event button', () => {
        // click on create event button, wait for eventcreate page to load 
        // test if event create page is loaded by waiting for 'create-event-title' to exist
        browser.url("http://localhost:3000/")

        const elem = $('[name="event_title"]')
        const createEventButton = $('.App .sideInformation .sideInfoLayer .createEventButton')

        createEventButton.click()
        elem.waitForExist({ timeout: 5000})
        browser.pause(1000)
    })
});