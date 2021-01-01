// test for filtering of events by clicking on checkboxes
describe('Filter all Self Directed Learning events', () => {

    before('open browser', () => {
        browser.url("http://localhost:3000/")
    })
    it('check page has SDL events', () => {
        
        const events = $$('div=Self Directed Learning')
        expect(events).toHaveChildren({ gte: 1 })
    });
    it('click on checkbox for SDL', () => {
        
        const checkbox = $('[id="Self Directed Learning"]')
        const events = $$('div=Self Directed Learning')
        checkbox.click()
    
        expect(events).toHaveChildren({ lte: 0 })
        checkbox.click()
    })
});