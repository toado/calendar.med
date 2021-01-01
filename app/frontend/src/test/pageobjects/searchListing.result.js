
// tests for search functionality 

describe('search function', () => {

    beforeEach('execute before each test', () => {
        browser.url("http://localhost:3000/")
    })

    // successful search tests search-container element does exist
    it('successful search field', () => {
        const elem = $('.search-page .search-container')
        const searchContent = $('[name="search_content"]')

        searchContent.setValue('cardiology')
        browser.keys('Enter')

        elem.waitForExist({ timeout: 3000})
    })
    // unsuccessful search tests search-container element does not exist
    it('unsuccessful search field', () => {
        const elem = $('.search-page .search-container')
        const searchContent = $('[name="search_content"]')

        searchContent.setValue('@#$$@')
        browser.keys('Enter')

        elem.waitForExist({ timeout: 3000, reverse : true})
    })
}) 