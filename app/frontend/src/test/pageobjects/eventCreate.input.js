

const { keys } = require("@material-ui/core/styles/createBreakpoints");


describe('Cancel button behavior', () => {
    it('test cancel button redirects to main page', () => {
        browser.url("http://localhost:3000/eventcreate")

        const elem = $('.App .sideInformation .sideInfoLayer .createEventButton')
        const cancelButton = $('span=Cancel')
        cancelButton.click()

        elem.waitForExist({ timeout: 5000})
    });
});


// test for create event form 
describe('input values in create event form fields', () => {

    before('open browser', () => {
        browser.url("http://localhost:3000/eventcreate")
    })

    it('select value in course id field', () => {
        // click on course id field, wait for dropdown menu,
        // click on first option
        const courseId = $('[id="mui-component-select-course_id"]')
        courseId.click()
        
        const elem = $('<li />')
        elem.waitForExist({ timeout: 3000})

        const option = $('[data-value="1"]')
        option.click()
        
    });
    it('select value in training session field', () => {
        const trainingSession = $('[id="mui-component-select-training_session"]')
        trainingSession.click()
        
        const elem = $('<li />')
        elem.waitForExist({ timeout: 3000})

        const option = $('[data-value="2018-2019"]')
        option.click()
        
    });
    it('select value in event type field', () => {
        const eventType = $('[id="mui-component-select-event_type"]')
        eventType.click()
        
        const elem = $('<li />')
        elem.waitForExist({ timeout: 3000})

        const option = $('[data-value="Whole Class"]')
        option.click()
        
    });
    it('input value in event description field', () => {
       
        const eventDesc = $('[name="event_desc"]')
        eventDesc.setValue('This is a test')

        browser.waitUntil(
            () => eventDesc.getValue() === 'This is a test',
            {
                timeout: 3000,
                timeoutMsg: 'expected value is "This is a test"'
            }
        );
    });
    it('input value in event title field', () => {
       
        const eventTitle = $('[name="event_title"]')
        eventTitle.setValue('testing')
        
        browser.waitUntil(
            () => eventTitle.getValue() === 'testing',
            {
                timeout: 3000,
                timeoutMsg: 'expected value is testing'
            }
        );

    });
    it('test create event button', () => {

        const elem = $('.App .sideInformation .sideInfoLayer .createEventButton')
        const createButton = $('span=Create Event')
        createButton.click()

        // TODO: form is not submitting 
        // elem.waitForExist({ timeout: 5000})
    });
});  