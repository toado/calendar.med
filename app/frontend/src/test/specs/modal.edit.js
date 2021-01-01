

describe('Click on an event', () => {

    before('open browser', () => {
        browser.url("http://localhost:3000/")
    })

    it('click on an event, modal should open', () => {

        const elem = $('button=Delete')
        const event = $('div=Whole Class: HIV')
        event.click()

        elem.waitForExist({ timeout: 5000})
    })
    it('click on edit button', () => {

        const elem = $('button=Save')
        const editButton = $('button=Edit')
        editButton.click()

        elem.waitForExist({ timeout: 5000})


    });
    it('edit title in the modal and save it', () => {

        const eventTitle= $('[name="event_title"]')
        eventTitle.click()

        eventTitle.setValue(' This is a test')
        browser.waitUntil(
            () => eventTitle.getValue() === 'HIV This is a test',
            {
                timeout: 3000,
                timeoutMsg: 'expected value is:  HIV This is a test'
            }
        );
        
        const saveButton = $('button=Save')
        saveButton.click()

    });
    it('save the edited modal and check for edit', () => {

        const event = $('div=Whole Class: HIV T')

    });
});